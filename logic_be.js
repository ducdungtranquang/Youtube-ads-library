const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { Client } = require('@elastic/elasticsearch');

const app = express();

const PORT = process.env.API_PORT || 5002;
const INTERNAL_SECRET_HEADER = 'x-fb-internal-token';
const INTERNAL_SECRET_VALUE = process.env.INTERNAL_API_TOKEN || 'fb-analyzer-secret-2026';

/**
 * Middleware kiểm tra Header đặc biệt
 */
function checkSpecialHeader(req, res, next) {
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }

    const token = req.headers[INTERNAL_SECRET_HEADER];
    if (!token || token !== INTERNAL_SECRET_VALUE) {
        return res.status(403).json({
            success: false,
            message: 'Forbidden: Invalid or missing internal system sign.'
        });
    }
    next();
}

// ===== RATE LIMITER ĐƠN GIẢN (CHỐNG CRAWLER) =====
const ipRequestCounts = new Map();
if (typeof setInterval !== 'undefined') {
    setInterval(() => {
        const now = Date.now();
        for (const [ip, record] of ipRequestCounts.entries()) {
            if (now > record.resetTime) {
                ipRequestCounts.delete(ip);
            }
        }
    }, 2 * 60 * 1000);
}

function rateLimitMiddleware(maxRequests = 60, windowMs = 60 * 1000) {
    return (req, res, next) => {
        const ip = req.headers['x-forwarded-for']?.split(',')[0].trim() || req.ip || req.socket?.remoteAddress || 'unknown';
        const now = Date.now();
        let record = ipRequestCounts.get(ip);
        if (!record || now > record.resetTime) {
            record = { count: 1, resetTime: now + windowMs };
            ipRequestCounts.set(ip, record);
            return next();
        }
        record.count++;
        if (record.count > maxRequests) {
            const retryAfter = Math.ceil((record.resetTime - now) / 1000);
            res.setHeader('Retry-After', retryAfter);
            return res.status(429).json({
                success: false,
                message: `Quá nhiều yêu cầu từ IP của bạn. Vui lòng chờ ${retryAfter}s trước khi gửi tiếp.`,
                retry_after_seconds: retryAfter
            });
        }
        next();
    };
}

// ===== -STYLE FILTER PRESETS =====
// Các preset dùng field do analyzer tính sẵn (duration_days, duplicates_count,
// scaling_score, trending_score, filter_signals). Mọi ngưỡng đều chỉnh được
// qua query param — xem FILTER_DEFAULTS.
const FILTER_DEFAULTS = {
    new_max_days: 5,            // Ads mới lên: mở rộng phạm vi 3 - 5 ngày (chạy <= 5 ngày)
    scale_min_days: 4,          // Ready to Scale: chạy khoảng 4-5 ngày
    scale_max_days: 5,
    scale_min_duplicates: 2,    // ... + có duplicate (đang nhân bản)
    scale_min_scaling_score: 6, // ... + scaling_score đạt ngưỡng SCALING
    winner_min_days: 7,         // Weekly Winner: chỉ ads chạy 7 - 9 ngày
    winner_max_days: 9,
};

function numParam(value, fallback) {
    const n = Number(value);
    return Number.isFinite(n) ? n : fallback;
}

function escapeRegExp(s) {
    return String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Trả về mảng điều kiện Mongo cho preset (kết hợp AND với các filter khác).
// presets: chuỗi 'new_ads,ready_to_scale' (chấp nhận alias new/scale/winner).
function buildPresetConditions(presets, q) {
    const conds = [];
    const list = String(presets || '').split(',').map(s => s.trim().toLowerCase()).filter(Boolean);
    for (const p of list) {
        if (p === 'new_ads' || p === 'new') {
            conds.push({
                duration_days: { $lte: numParam(q.new_max_days, FILTER_DEFAULTS.new_max_days) },
            });
        } else if (p === 'ready_to_scale' || p === 'scale') {
            conds.push({
                duration_days: {
                    $gte: numParam(q.scale_min_days, FILTER_DEFAULTS.scale_min_days),
                    $lte: numParam(q.scale_max_days, FILTER_DEFAULTS.scale_max_days),
                },
                duplicates_count: { $gte: numParam(q.scale_min_duplicates, FILTER_DEFAULTS.scale_min_duplicates) },
                scaling_score: { $gte: numParam(q.scale_min_scaling_score, FILTER_DEFAULTS.scale_min_scaling_score) },
            });
        } else if (p === 'weekly_winner' || p === 'winner') {
            // Weekly Winner chỉ ads chạy 7-9 ngày (không phụ thuộc score hay trending)
            conds.push({
                duration_days: {
                    $gte: numParam(q.winner_min_days, FILTER_DEFAULTS.winner_min_days),
                    $lte: numParam(q.winner_max_days, FILTER_DEFAULTS.winner_max_days),
                },
            });
        }
        // preset lạ: bỏ qua trong im lặng (không vỡ request)
    }
    return conds;
}

// Sort mặc định ưu tiên mới nhất (start_date giảm dần) khi user không truyền sort_by tường minh.
function resolvePresetSort(presets, hasExplicitSortBy) {
    if (hasExplicitSortBy) return null;
    return { field: 'start_date', order: -1 };
}

/**
 * Khởi tạo API Server (Đã gỡ bỏ Kafka)
 * @param {import('mongodb').Db} dbInstance 
 */
function initSearchServer(dbInstance) {
    const esClient = new Client({ node: process.env.ELASTICSEARCH_URL || 'http://localhost:9200' });
    const ELASTIC_INDEX = 'fb_ads_analyzer';

    const adsCol = dbInstance.collection('analyzed_ads');
    const productsCol = dbInstance.collection('products');

    // ⚡ Khởi tạo các Index tăng tốc cho collection analyzed_ads (giảm thời gian lọc từ 80s -> < 0.1s)
    (async () => {
        try {
            await Promise.allSettled([
                adsCol.createIndex({ duration_days: 1, score: -1 }, { background: true }),
                adsCol.createIndex({ duration_days: 1, start_date: -1 }, { background: true }),
                adsCol.createIndex({ duration_days: 1 }, { background: true }),
                adsCol.createIndex({ start_date: -1 }, { background: true }),
                adsCol.createIndex({ score: -1 }, { background: true }),
                adsCol.createIndex({ trending_score: -1 }, { background: true }),
                adsCol.createIndex({ scaling_score: -1 }, { background: true }),
                adsCol.createIndex({ duplicates_count: 1 }, { background: true }),
                adsCol.createIndex({ country_mentions: 1 }, { background: true }),
                adsCol.createIndex({ latest_detail_country: 1 }, { background: true }),
                adsCol.createIndex({ is_active: 1 }, { background: true }),
            ]);
            console.log('⚡ [MongoDB] Đã khởi tạo Indexes thành công cho analyzed_ads');
        } catch (idxErr) {
            console.warn('⚠️ [MongoDB] Không thể tạo Index tự động:', idxErr.message);
        }
    })();

    const imageStoragePath = path.join(__dirname, '..', '..', 'storage', 'images');
    if (!fs.existsSync(imageStoragePath)) {
        fs.mkdirSync(imageStoragePath, { recursive: true });
    }

    app.use(express.json());
    app.use(cors({
        origin: '*',
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'x-fb-internal-token'],
        credentials: true
    }));
    app.use('/static/images', express.static(imageStoragePath));
    app.use(checkSpecialHeader);
    app.use(rateLimitMiddleware(60, 60 * 1000)); // 🛡️ Rate limit tối đa 60 requests/phút

    /**
     * 🟢 API 1: TÌM KIẾM QUẢNG CÁO (Nâng cấp bộ lọc chuẩn )
     * Thêm param `filter` (preset): new_ads | ready_to_scale | weekly_winner
     * (nhiều preset cách nhau bằng dấu phẩy, kết hợp AND với các filter khác).
     * Ngưỡng chỉnh qua: new_max_days, scale_min_days, scale_max_days,
     * scale_min_duplicates, scale_min_scaling_score, winner_min_score,
     * winner_min_trending, winner_min_duplicates, winner_min_days.
     */
    app.get('/api/ads/search', async (req, res) => {
        try {
            const {
                text,
                country,
                date_from,
                date_to,
                min_score,
                max_score,
                level,
                estimated_spend,
                min_trending_score,
                funnel,
                scaling_level,
                page_name,     // Lọc theo tên Page
                domain,        // Lọc theo tên miền
                is_active,     // Lọc theo trạng thái quảng cáo (true/false)
                filter,        // Preset kiểu : new_ads | ready_to_scale | weekly_winner
            } = req.query;

            const MAX_ALLOWED_PAGE = 50;
            const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
            if (page > MAX_ALLOWED_PAGE) {
                return res.status(400).json({
                    success: false,
                    message: `Đã vượt quá giới hạn trang cho phép (Tối đa ${MAX_ALLOWED_PAGE} trang).`
                });
            }
            // 🔒 Bắt buộc giới hạn tối đa 20 items / trang (limit <= 20) để chống crawl
            const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 20, 1), 20);
            const skip = (page - 1) * limit;

            const query = {};

            // 1. SEARCH TEXT (Elasticsearch)
            if (text) {
                const keyword = Array.isArray(text) ? text.map(x => String(x).trim()).filter(Boolean).join(" ") : String(text).trim();
                if (keyword) {
                    try {
                        const esLimit = Math.min(Math.max(page * limit * 5, 100), 5000);
                        const searchQuery = {
                            bool: {
                                should: [
                                    { match: { full_text_search: { query: keyword, boost: 5 } } },
                                    { match: { normalized_text: { query: keyword, boost: 4 } } },
                                    { match: { text: { query: keyword, boost: 3 } } },
                                    { match: { page_name: { query: keyword, boost: 2 } } }
                                ],
                                minimum_should_match: 1
                            }
                        };

                        const esResponse = await esClient.search({
                            index: ELASTIC_INDEX,
                            query: searchQuery,
                            _source: ['ad_archive_id'],
                            size: esLimit,
                            track_total_hits: false
                        });

                        const hits = esResponse.hits?.hits || [];
                        const adIdsFromEs = [...new Set(hits.map(hit => hit?._source?.ad_archive_id).filter(Boolean).map(String))];

                        if (!adIdsFromEs.length) {
                            return res.json({ success: true, pagination: { total: 0, page, limit, pages: 0 }, data: [] });
                        }
                        query.ad_archive_id = { $in: adIdsFromEs };
                    } catch (esError) {
                        return res.status(500).json({ success: false, message: 'Elasticsearch Error', error: esError.message });
                    }
                }
            }

            // 2. CÁC BỘ LỌC CHUẨN 
            // FIX: country trước đây map nhầm sang `platforms` (tên nền tảng) nên
            // lọc theo quốc gia luôn trả về rỗng. Giờ lọc theo country_mentions
            // (mảng) hoặc latest_detail_country do analyzer ghi.
            if (country) {
                const codeRe = new RegExp(`^${escapeRegExp(String(country).trim())}$`, 'i');
                query.$or = [{ country_mentions: codeRe }, { latest_detail_country: codeRe }];
            }
            if (page_name) query.page_name = { $regex: String(page_name), $options: 'i' };
            if (domain) query.domain = { $regex: String(domain), $options: 'i' };
            if (is_active !== undefined) query.is_active = is_active === 'true';

            if (date_from || date_to) {
                query.start_date = {};
                if (date_from && !Number.isNaN(new Date(date_from).getTime())) query.start_date.$gte = Math.floor(new Date(date_from).getTime() / 1000);
                if (date_to && !Number.isNaN(new Date(date_to).getTime())) query.start_date.$lte = Math.floor(new Date(date_to).getTime() / 1000);
                if (Object.keys(query.start_date).length === 0) delete query.start_date;
            }

            const minScore = Number(min_score), maxScore = Number(max_score);
            if (Number.isFinite(minScore) || Number.isFinite(maxScore)) {
                query.score = {};
                if (Number.isFinite(minScore)) query.score.$gte = minScore;
                if (Number.isFinite(maxScore)) query.score.$lte = maxScore;
            }

            // FIX: level/scaling_level trong DB có prefix emoji (vd '🏆 LEGEND',
            // '🚀 SCALING HARD') nên match chính xác 'LEGEND'/'SCALING' không ra.
            // Đổi sang regex không phân biệt hoa thường.
            if (level) {
                const words = String(level).split(',').map(x => x.trim()).filter(Boolean);
                query.level = { $in: words.map(w => new RegExp(escapeRegExp(w), 'i')) };
            }
            if (estimated_spend) query.estimated_spend = { $in: String(estimated_spend).split(',').map(x => x.trim().toUpperCase()).filter(Boolean) };
            if (Number.isFinite(Number(min_trending_score))) query.trending_score = { $gte: Number(min_trending_score) };
            if (funnel) query.funnel = { $in: String(funnel).split(',').map(x => x.trim().toUpperCase()).filter(Boolean) };
            if (scaling_level) {
                const words = String(scaling_level).split(',').map(x => x.trim()).filter(Boolean);
                query.scaling_level = { $in: words.map(w => new RegExp(escapeRegExp(w), 'i')) };
            }

            // 3. PRESET KIỂU  (kết hợp AND với mọi filter trên)
            const presetList = String(filter || '').split(',').map(s => s.trim().toLowerCase()).filter(Boolean);
            const presetConds = buildPresetConditions(filter, req.query);
            if (presetConds.length) query.$and = presetConds;

            const presetSort = resolvePresetSort(filter, req.query.sort_by !== undefined);
            const requestedSort = presetSort ? presetSort.field : (req.query.sort_by || 'start_date');
            const requestedOrder = presetSort ? presetSort.order : (Number(req.query.sort_order) === 1 ? 1 : -1);
            const allowedSortFields = new Set(['start_date', 'seen_count', 'analyzed_at', 'first_seen', 'last_seen', 'scaling_score', 'estimated_spend_usd', 'duplicates_count', 'duration_days', 'estimated_spend_max_usd', 'estimated_spend_min_usd', 'estimated_reach', 'score', 'trending_score']);
            const safeSortField = allowedSortFields.has(String(requestedSort)) ? String(requestedSort) : 'start_date';
            const sortOptions = { [safeSortField]: requestedOrder };

            // ⚡ Tối ưu tốc độ query: Chạy find trước, tránh countDocuments quét toàn bộ bảng nếu không cần
            const results = await adsCol.find(query)
                .project({
                    ad_archive_id: 1, ad_library_url: 1, page_name: 1, page_like_count: 1, text: 1, link: 1, domain: 1,
                    start_date: 1, seen_count: 1, score: 1, level: 1, trending_score: 1, scaling_score: 1,
                    estimated_spend_usd: 1, estimated_spend_min_usd: 1, estimated_spend_max_usd: 1,
                    estimated_spend: 1, estimated_reach: 1, estimated_reach_min: 1, estimated_reach_max: 1,
                    duplicates_count: 1, duration_days: 1, cpm_used: 1, filter_signals: 1,
                    scaling_level: 1, funnel: 1, analyzed_at: 1,
                    thumbnail_local: 1, is_active: 1, images: { $slice: 1 }, videos: { $slice: 1 }
                })
                .sort(sortOptions).skip(skip).limit(limit).toArray();

            let total = 0;
            if (Object.keys(query).length === 0) {
                total = await adsCol.estimatedDocumentCount();
            } else if (page === 1 && results.length < limit) {
                // Trang 1 mà ít hơn limit thì chắc chắn tổng số chính là kết quả trả về, không cần đếm toàn bộ bảng
                total = results.length;
            } else {
                try {
                    // Giới hạn maxTimeMS 1500ms để không bị treo nghẽn API khi đếm bảng lớn
                    total = await adsCol.countDocuments(query, { maxTimeMS: 1500 });
                } catch (cntErr) {
                    // Fallback nhanh khi count timeout: ước tính dựa trên trang hiện tại
                    total = skip + results.length + (results.length === limit ? limit * 5 : 0);
                }
            }

            return res.json({ success: true, applied_presets: presetList, pagination: { total, page, limit, pages: Math.ceil(total / limit) }, data: results });
        } catch (error) {
            return res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
        }
    });

    /**
     * 🟢 API 1b: SỐ LƯỢNG THEO TỪNG PRESET (Có cache 5 phút để tránh full-scan liên tục)
     */
    let statsCache = null;
    let statsCacheTime = 0;
    const STATS_CACHE_TTL = 5 * 60 * 1000;

    app.get('/api/ads/filter-stats', async (req, res) => {
        try {
            const now = Date.now();
            if (statsCache && (now - statsCacheTime < STATS_CACHE_TTL)) {
                return res.json({ success: true, data: statsCache, cached: true });
            }

            const presetNames = ['new_ads', 'ready_to_scale', 'weekly_winner'];
            const [total, ...counts] = await Promise.all([
                adsCol.estimatedDocumentCount(),
                ...presetNames.map(name => {
                    const conds = buildPresetConditions(name, {});
                    return adsCol.countDocuments(conds.length ? { $and: conds } : {});
                })
            ]);

            const presets = {};
            presetNames.forEach((name, i) => { presets[name] = counts[i]; });

            statsCache = { total, presets, defaults: FILTER_DEFAULTS };
            statsCacheTime = now;

            return res.json({ success: true, data: statsCache });
        } catch (error) {
            return res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
        }
    });

    /**
     * 🟢 API 2: LẤY CHI TIẾT QUẢNG CÁO
     */
    app.get('/api/ads/detail/:id', async (req, res) => {
        try {
            const adId = req.params.id;
            if (!adId) return res.status(400).json({ success: false, message: 'Missing ad archive id parameters.' });

            const adDetail = await adsCol.findOne({ ad_archive_id: adId });
            if (!adDetail) return res.status(404).json({ success: false, message: `Không tìm thấy ID: ${adId}` });

            return res.json({ success: true, data: adDetail });
        } catch (error) {
            return res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
        }
    });

    /**
     * 🟢 API 3: QUẢNG CÁO TƯƠNG TỰ (SIMILAR ADS) - Tính năng 
     * Tìm các quảng cáo chung Domain hoặc chung Page để gợi ý.
     */
    app.get('/api/ads/:id/similar', async (req, res) => {
        try {
            const adId = req.params.id;
            const limit = Math.min(parseInt(req.query.limit, 10) || 10, 50);

            const sourceAd = await adsCol.findOne({ ad_archive_id: adId });
            if (!sourceAd) return res.status(404).json({ success: false, message: 'Ad not found.' });

            const query = { ad_archive_id: { $ne: adId } };

            // Ưu tiên tìm cùng Domain, nếu không có domain thì tìm cùng Page
            if (sourceAd.domain) {
                query.domain = sourceAd.domain;
            } else if (sourceAd.page_name) {
                query.page_name = sourceAd.page_name;
            } else {
                return res.json({ success: true, data: [] }); // Không đủ cơ sở để tìm tương tự
            }

            const similarAds = await adsCol.find(query)
                .project({
                    ad_archive_id: 1, ad_library_url: 1, page_name: 1, text: { $substrCP: ["$text", 0, 150] }, score: 1,
                    estimated_spend_usd: 1, thumbnail_local: 1, images: { $slice: 1 }, videos: { $slice: 1 }
                })
                .sort({ score: -1 })
                .limit(limit)
                .toArray();

            return res.json({ success: true, data: similarAds });
        } catch (error) {
            return res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
        }
    });

    /**
     * 🟢 API 4: THỐNG KÊ CHI TIẾT TỪ MỘT PAGE CỤ THỂ (PAGE PROFILE)
     */
    app.get('/api/pages/:page_name/ads', async (req, res) => {
        try {
            const pageName = req.params.page_name;
            const limit = Math.min(parseInt(req.query.limit, 10) || 20, 100);
            const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
            const skip = (page - 1) * limit;

            const query = { page_name: pageName };
            const total = await adsCol.countDocuments(query);

            const ads = await adsCol.find(query)
                .project({
                    ad_archive_id: 1, ad_library_url: 1, text: { $substrCP: ["$text", 0, 150] }, score: 1, level: 1,
                    is_active: 1, start_date: 1, estimated_spend_usd: 1, estimated_reach: 1,
                    images: { $slice: 1 }, videos: { $slice: 1 }
                })
                .sort({ score: -1 })
                .skip(skip)
                .limit(limit)
                .toArray();

            return res.json({
                success: true,
                pagination: { total, page, limit, pages: Math.ceil(total / limit) },
                data: ads
            });
        } catch (error) {
            return res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
        }
    });

    /**
     * 🟢 API 5: TÌM KIẾM SẢN PHẨM/DOMAIN
     */
    app.get('/api/products/search', async (req, res) => {
        try {
            const { domain, min_product_score, min_winning_ads, min_total_ads, sort_by = 'product_score', sort_order = -1 } = req.query;
            const query = {};

            if (domain) query.domain = { $regex: domain, $options: 'i' };
            if (min_product_score) query.product_score = { $gte: parseInt(min_product_score, 10) };
            if (min_winning_ads) query.winning_ads = { $gte: parseInt(min_winning_ads, 10) };
            if (min_total_ads) query.total_ads = { $gte: parseInt(min_total_ads, 10) };

            const page = parseInt(req.query.page, 10) || 1;
            const limit = parseInt(req.query.limit, 10) || 50;
            const skip = (page - 1) * limit;

            const total = await productsCol.countDocuments(query);
            const results = await productsCol.find(query)
                .sort({ [sort_by]: parseInt(sort_order, 10) })
                .skip(skip).limit(limit).toArray();

            return res.json({ success: true, pagination: { total, page, limit, pages: Math.ceil(total / limit) }, data: results });
        } catch (error) {
            return res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
        }
    });

    /**
     * 🟢 API 6: LẤY CHI TIẾT SẢN PHẨM/DOMAIN
     */
    app.get('/api/products/detail/:domain', async (req, res) => {
        try {
            const { domain } = req.params;
            if (!domain) return res.status(400).json({ success: false, message: 'Domain is required.' });

            const productInfo = await productsCol.findOne({ domain });
            if (!productInfo) return res.status(404).json({ success: false, message: `Product not found.` });

            const topAds = await adsCol.find({ domain })
                .sort({ score: -1 }).limit(20)
                .project({ ad_archive_id: 1, ad_library_url: 1, text: { $substrCP: ["$text", 0, 150] }, score: 1, level: 1, estimated_spend_usd: 1, images: { $slice: 1 }, videos: { $slice: 1 } })
                .toArray();

            return res.json({ success: true, data: { ...productInfo, top_ads: topAds } });
        } catch (error) {
            return res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
        }
    });

    app.listen(PORT, () => {
        console.log(`🖥️  API Search Server đang hoạt động tại cổng: http://localhost:${PORT}`);
    });
}

module.exports = { initSearchServer, buildPresetConditions, resolvePresetSort, FILTER_DEFAULTS };