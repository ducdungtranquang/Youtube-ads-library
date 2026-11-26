import { WinningProductSortOption } from "@/types/winning-product";

/**
 * Service trích xuất và tối ưu hóa dữ liệu Winning Products từ Google Sheets
 * URL: https://docs.google.com/spreadsheets/d/1caTdmpu0CdJ6xVMJjDq3WtRrFDCzBp4MwvluayokQhM/edit
 */

export interface SheetWinningProduct {
  id: string;
  title: string;              // Tên Hàng
  library_url: string;        // Link Library
  landing_url: string;        // Link Landing
  thumbnail: string;          // Ảnh Sản Phẩm
  price: string;              // Giá Sản Phẩm
  ads_running_count: number;  // Bao Nhiêu ADS Chạy
  duration_days: string;      // Tổng Số Ngày Chạy
  scan_date: string;          // Ngày quét
  market: string;             // Thị trường chạy
  market_type: "VN" | "GLOBAL";
  country_code: string | null; // e.g. 'vn', 'us', 'de' hoặc null nếu không rõ nước
  country_name: string;
  country_flag: string | null; // emoji cờ hoặc null nếu không rõ nước
  ads_spy_url: string;        // Link Đến ADS SPY TOOL (nếu có)
  page_name: string;          // Tên PAGE
  win_reason: string;         // Lý do WIN
  platform_raw: string;       // Dạng chạy gốc từ Sheet (vd: "Mess tin nhắn", "Landing", "Mess tin nhắn (WhatsApp)")
  platform_type: "LANDING" | "MESSENGER" | "WHATSAPP" | "OTHER";
  platform_label: string;     // "Landing Page", "Messenger", "WhatsApp", "Chưa rõ"
}

// Bảng ánh xạ quốc gia chuẩn
const COUNTRY_MAP: Record<string, { code: string; name: string; flag: string }> = {
  "việt nam": { code: "vn", name: "Việt Nam", flag: "🇻🇳" },
  "vietnam": { code: "vn", name: "Việt Nam", flag: "🇻🇳" },
  "mỹ": { code: "us", name: "Hoa Kỳ (Mỹ)", flag: "🇺🇸" },
  "hoa kỳ": { code: "us", name: "Hoa Kỳ (Mỹ)", flag: "🇺🇸" },
  "đức": { code: "de", name: "Đức", flag: "🇩🇪" },
  "nam phi": { code: "za", name: "Nam Phi", flag: "🇿🇦" },
  "campuchia": { code: "kh", name: "Campuchia", flag: "🇰🇭" },
  "úc": { code: "au", name: "Úc (Australia)", flag: "🇦🇺" },
  "ba lan": { code: "pl", name: "Ba Lan", flag: "🇵🇱" },
  "colombia": { code: "co", name: "Colombia", flag: "🇨🇴" },
  "hà lan": { code: "nl", name: "Hà Lan", flag: "🇳🇱" },
  "nigeria": { code: "ng", name: "Nigeria", flag: "🇳🇬" },
  "philippines": { code: "ph", name: "Philippines", flag: "🇵🇭" },
  "anh": { code: "gb", name: "Vương quốc Anh (UK)", flag: "🇬🇧" },
  "qatar": { code: "qa", name: "Qatar", flag: "🇶🇦" },
  "đan mạch": { code: "dk", name: "Đan Mạch", flag: "🇩🇰" },
};

function resolveCountry(marketRaw: string): {
  code: string | null;
  name: string;
  flag: string | null;
  isVN: boolean;
} {
  const raw = (marketRaw || "").trim().toLowerCase();
  if (!raw) return { code: null, name: "Chưa rõ", flag: null, isVN: false };

  if (raw.includes("việt nam") || raw.includes("vietnam")) {
    return { code: "vn", name: "Việt Nam", flag: "🇻🇳", isVN: true };
  }

  for (const [key, val] of Object.entries(COUNTRY_MAP)) {
    if (raw.includes(key)) {
      return { code: val.code, name: val.name, flag: val.flag, isVN: false };
    }
  }

  // Các trường hợp ghi chung chung "Nước ngoài", "Nước ngoà", "Nước ngo`",...
  // User yêu cầu: product nào không rõ nước thì KHÔNG hiện icon cờ (code = null, flag = null)
  return { code: null, name: marketRaw || "Nước ngoài", flag: null, isVN: false };
}

// Chuẩn hóa và phân loại Dạng chạy / Nền tảng (Landing Page vs Messenger vs WhatsApp)
export function resolvePlatformType(
  rawPlatform: string,
  landingUrl?: string
): {
  type: "LANDING" | "MESSENGER" | "WHATSAPP" | "OTHER";
  label: string;
  raw: string;
} {
  const raw = (rawPlatform || "").trim();
  const lower = raw.toLowerCase();

  if (lower.includes("whatsapp")) {
    return { type: "WHATSAPP", label: "WhatsApp", raw };
  }
  if (
    lower.includes("mess") ||
    lower.includes("tin nhắn") ||
    lower.includes("tin nhan") ||
    lower.includes("inbox") ||
    lower.includes("chat")
  ) {
    return { type: "MESSENGER", label: "Messenger", raw };
  }
  if (
    lower.includes("landing") ||
    lower.includes("web") ||
    lower.includes("ladipage") ||
    lower.includes("chuyển đổi") ||
    lower.includes("chuyen doi")
  ) {
    return { type: "LANDING", label: "Landing Page", raw };
  }

  // Fallback dựa vào Link Landing nếu cột Dạng chạy bị bỏ trống
  const urlLower = (landingUrl || "").toLowerCase();
  if (urlLower.includes("wa.me") || urlLower.includes("whatsapp.com")) {
    return { type: "WHATSAPP", label: "WhatsApp", raw: raw || "WhatsApp" };
  }
  if (
    urlLower.includes("m.me") ||
    urlLower.includes("facebook.com/messages") ||
    urlLower === "https://www.facebook.com/" ||
    urlLower === "https://facebook.com/"
  ) {
    return { type: "MESSENGER", label: "Messenger", raw: raw || "Mess tin nhắn" };
  }
  if (urlLower.startsWith("http") && !urlLower.includes("facebook.com")) {
    return { type: "LANDING", label: "Landing Page", raw: raw || "Landing" };
  }

  return { type: "OTHER", label: raw || "Chưa rõ", raw: raw || "Chưa rõ" };
}

/**
 * Kiểm tra xem ảnh sản phẩm có hợp lệ không (có link url và không phải chuỗi rỗng/lỗi)
 */
export function isValidThumbnailUrl(url?: string): boolean {
  if (!url || typeof url !== "string") return false;
  const trimmed = url.trim().toLowerCase();
  if (!trimmed.startsWith("http://") && !trimmed.startsWith("https://")) return false;
  if (
    trimmed.includes("không lấy được") ||
    trimmed.includes("không rõ") ||
    trimmed.includes("n/a") ||
    trimmed.includes("placeholder")
  ) {
    return false;
  }
  return true;
}

/**
 * Chuyển đổi chuỗi ngày quét (định dạng DD/MM/YYYY) sang timestamp mili-giây
 */
export function parseScanDate(dateStr?: string): number {
  if (!dateStr || typeof dateStr !== "string") return 0;
  const parts = dateStr.trim().split(/[/.-]/);
  if (parts.length >= 3) {
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10);
    const year = parseInt(parts[2], 10);
    if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
      return new Date(year, month - 1, day).getTime();
    }
  }
  const parsed = Date.parse(dateStr);
  return isNaN(parsed) ? 0 : parsed;
}

/**
 * Trích xuất giá trị số chuẩn hóa (quy đổi ra VND tương đương) từ chuỗi giá sản phẩm để so sánh
 */
export function parsePriceValue(priceStr?: string): number {
  if (!priceStr || typeof priceStr !== "string") return 0;
  const raw = priceStr.trim().toLowerCase();

  // Bỏ qua các trường hợp không có giá hợp lệ
  if (
    raw.includes("không lấy được") ||
    raw.includes("không rõ") ||
    raw.includes("liên hệ") ||
    raw.includes("n/a")
  ) {
    return 0;
  }

  // Nếu là ngoại tệ USD, CAD ($19.99, $35 CAD, ...)
  if (raw.includes("$") || raw.includes("usd") || raw.includes("cad")) {
    const match = raw.match(/[\d]+(?:[.,]\d+)?/);
    if (match) {
      const val = parseFloat(match[0].replace(",", "."));
      if (!isNaN(val)) {
        // Quy đổi ước tính 1 USD ~ 25,400 VND để so sánh tương quan cùng giá VND
        return Math.round(val * 25400);
      }
    }
  }

  // Nếu là định dạng K (ví dụ: 99K, 150k)
  const kMatch = raw.match(/(\d+(?:[.,]\d+)?)\s*k\b/);
  if (kMatch) {
    const val = parseFloat(kMatch[1].replace(",", "."));
    if (!isNaN(val)) return Math.round(val * 1000);
  }

  // Định dạng số tiền VND chuẩn (ví dụ: 365.000đ, 1.200.000, 250000)
  const cleanDigits = raw.replace(/[^\d]/g, "");
  if (cleanDigits) {
    const val = parseInt(cleanDigits, 10);
    return isNaN(val) ? 0 : val;
  }

  return 0;
}

// Hàm parse CSV chuẩn RFC 4180 xử lý chuỗi nhiều dòng và dấu ngoặc kép
function parseCSV(text: string): string[][] {
  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentCell = "";
  let insideQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i + 1];

    if (char === '"') {
      if (insideQuotes && nextChar === '"') {
        currentCell += '"';
        i++;
      } else {
        insideQuotes = !insideQuotes;
      }
    } else if (char === "," && !insideQuotes) {
      currentRow.push(currentCell.trim());
      currentCell = "";
    } else if ((char === "\r" || char === "\n") && !insideQuotes) {
      if (char === "\r" && nextChar === "\n") i++;
      currentRow.push(currentCell.trim());
      if (currentRow.some((c) => c.length > 0)) {
        rows.push(currentRow);
      }
      currentRow = [];
      currentCell = "";
    } else {
      currentCell += char;
    }
  }

  if (currentCell || currentRow.length > 0) {
    currentRow.push(currentCell.trim());
    if (currentRow.some((c) => c.length > 0)) {
      rows.push(currentRow);
    }
  }

  return rows;
}

// Bộ nhớ đệm In-Memory cấp máy chủ (Server Cache) với cơ chế Stale-While-Revalidate
interface CacheStore {
  items: SheetWinningProduct[];
  lastFetchedAt: number;
  isFetching: boolean;
}

const globalForSheet = globalThis as unknown as {
  winningProductsSheetCache?: CacheStore;
};

const cache: CacheStore =
  globalForSheet.winningProductsSheetCache ||
  (globalForSheet.winningProductsSheetCache = {
    items: [],
    lastFetchedAt: 0,
    isFetching: false,
  });

const GOOGLE_SHEET_CSV_URL =
  "https://docs.google.com/spreadsheets/d/1caTdmpu0CdJ6xVMJjDq3WtRrFDCzBp4MwvluayokQhM/export?format=csv";
const CACHE_TTL_MS = 15 * 60 * 1000; // 15 phút (theo yêu cầu của user, Google Sheet cập nhật liên tục)

/**
 * Xóa toàn bộ bộ nhớ cache Winning Products ngay lập tức
 */
export function clearWinningProductsCache(): void {
  cache.items = [];
  cache.lastFetchedAt = 0;
  cache.isFetching = false;
}

async function fetchAndParseSheet(): Promise<SheetWinningProduct[]> {
  try {
    const res = await fetch(GOOGLE_SHEET_CSV_URL, {
      method: "GET",
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AdsSpyTool/1.0",
      },
      next: { revalidate: 900 }, // Next.js ISR cache 15 phút (900s)
    });

    if (!res.ok) {
      throw new Error(`Google Sheets export returned status ${res.status}`);
    }

    const csvText = await res.text();
    const rows = parseCSV(csvText);

    // Tìm dòng tiêu đề chứa 'Tên Hàng'
    const headerIndex = rows.findIndex((r) => r.some((c) => c.includes("Tên Hàng")));
    if (headerIndex === -1) {
      throw new Error("Không tìm thấy dòng tiêu đề 'Tên Hàng' trong Google Sheet");
    }

    const headers = rows[headerIndex];
    const dataRows = rows.slice(headerIndex + 1);

    const items: SheetWinningProduct[] = dataRows
      .map((r, idx) => {
        const raw: Record<string, string> = {};
        headers.forEach((h, hIdx) => {
          raw[h] = r[hIdx] || "";
        });

        const country = resolveCountry(raw["Thị trường chạy"] || "");
        const rawAds = raw["Bao Nhiêu ADS Chạy"] || "0";
        const adsCount = parseInt(rawAds.replace(/\D/g, "") || "0", 10);
        const rawPlatform =
          raw["Dạng chạy"] ||
          raw["Dạng Chạy"] ||
          raw["Dạng chạy (Landing / Mess)"] ||
          raw["Nền tảng"] ||
          "";
        const platform = resolvePlatformType(rawPlatform, raw["Link Landing"] || "");

        return {
          id: String(idx + 1),
          title: (raw["Tên Hàng"] || "").trim(),
          library_url: (raw["Link Library"] || "").trim(),
          landing_url: (raw["Link Landing"] || "").trim(),
          thumbnail: (raw["Ảnh Sản Phẩm"] || "").trim(),
          price: (raw["Giá Sản Phẩm"] || "").trim(),
          ads_running_count: adsCount,
          duration_days: (raw["Tổng Số Ngày Chạy"] || "").trim(),
          scan_date: (raw["Ngày quét"] || "").trim(),
          market: (raw["Thị trường chạy"] || "").trim(),
          market_type: (country.isVN ? "VN" : "GLOBAL") as "VN" | "GLOBAL",
          country_code: country.code,
          country_name: country.name,
          country_flag: country.flag,
          ads_spy_url: (raw["Link Đến ADS SPY TOOL (nếu có)"] || "").trim(),
          page_name: (raw["Tên PAGE"] || "").trim(),
          win_reason: (raw["Lý do WIN"] || "").trim(),
          platform_raw: platform.raw,
          platform_type: platform.type,
          platform_label: platform.label,
        };
      })
      .filter((item) => item.title.length > 0 && isValidThumbnailUrl(item.thumbnail));

    return items;
  } catch (error) {
    console.error("[WinningProductsSheet] Error fetching sheet:", error);
    // Nếu có cache cũ thì trả về cache cũ thay vì làm sập trang
    if (cache.items.length > 0) {
      return cache.items;
    }
    throw error;
  }
}

/**
 * Lấy toàn bộ danh sách sản phẩm với cơ chế Cache hiệu năng cao Stale-While-Revalidate
 */
export async function getAllSheetWinningProducts(options?: { forceRefresh?: boolean }): Promise<SheetWinningProduct[]> {
  const now = Date.now();
  const isExpired = now - cache.lastFetchedAt > CACHE_TTL_MS;

  // 1. Nếu yêu cầu forceRefresh: Bắt buộc gọi mới
  if (options?.forceRefresh) {
    cache.isFetching = true;
    try {
      const items = await fetchAndParseSheet();
      cache.items = items;
      cache.lastFetchedAt = Date.now();
      return items;
    } finally {
      cache.isFetching = false;
    }
  }

  // 2. Nếu đã có cache và chưa hết hạn: Trả về tức thì (< 1ms)
  if (cache.items.length > 0 && !isExpired) {
    return cache.items;
  }

  // 3. Stale-While-Revalidate: Nếu đã có cache cũ nhưng đã hết hạn:
  // Trả về cache cũ NGAY LẬP TỨC để người dùng không phải chờ, đồng thời re-fetch ngầm trong background
  if (cache.items.length > 0 && isExpired) {
    if (!cache.isFetching) {
      cache.isFetching = true;
      fetchAndParseSheet()
        .then((items) => {
          cache.items = items;
          cache.lastFetchedAt = Date.now();
        })
        .catch((err) => {
          console.warn("[WinningProductsSheet] Background refresh failed, keeping existing cache:", err);
        })
        .finally(() => {
          cache.isFetching = false;
        });
    }
    return cache.items;
  }

  // 4. Lần đầu khởi động chưa có cache: Bắt buộc đợi fetch lần đầu
  if (cache.isFetching && cache.items.length > 0) {
    return cache.items;
  }

  cache.isFetching = true;
  try {
    const items = await fetchAndParseSheet();
    cache.items = items;
    cache.lastFetchedAt = Date.now();
    return items;
  } finally {
    cache.isFetching = false;
  }
}

/**
 * Cho phép kích hoạt xóa cache thủ công khi admin cập nhật Google Sheet mới
 */
export async function revalidateWinningProductsCache(): Promise<{ success: boolean; total: number }> {
  const items = await getAllSheetWinningProducts({ forceRefresh: true });
  return { success: true, total: items.length };
}

/**
 * Lọc và phân trang cho danh sách (chỉ trả về các trường cơ bản cho card để tối ưu băng thông và tốc độ)
 */
export async function getWinningProductsList(params: {
  q?: string;
  market?: "ALL" | "VN" | "GLOBAL";
  platform?: "ALL" | "LANDING" | "MESSENGER" | "WHATSAPP";
  sort?: WinningProductSortOption;
  page?: number;
  limit?: number;
}): Promise<{
  items: Omit<SheetWinningProduct, "win_reason" | "ads_spy_url">[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
  stats: {
    total: number;
    vn_count: number;
    global_count: number;
    landing_count: number;
    messenger_count: number;
    whatsapp_count: number;
  };
}> {
  const allRawItems = await getAllSheetWinningProducts();
  const allItems = allRawItems.filter((i) => isValidThumbnailUrl(i.thumbnail));

  // Đếm thống kê tổng
  const totalAll = allItems.length;
  const vnCount = allItems.filter((i) => i.market_type === "VN").length;
  const globalCount = allItems.filter((i) => i.market_type === "GLOBAL").length;
  const landingCount = allItems.filter((i) => i.platform_type === "LANDING").length;
  const messengerCount = allItems.filter((i) => i.platform_type === "MESSENGER").length;
  const whatsappCount = allItems.filter((i) => i.platform_type === "WHATSAPP").length;

  let filtered = allItems;

  // 1. Lọc theo Thị trường: Nước ngoài vs Việt Nam
  const marketFilter = (params.market || "ALL").toUpperCase();
  if (marketFilter === "VN") {
    filtered = filtered.filter((i) => i.market_type === "VN");
  } else if (marketFilter === "GLOBAL") {
    filtered = filtered.filter((i) => i.market_type === "GLOBAL");
  }

  // 2. Lọc theo Dạng chạy / Nền tảng: Landing Page vs Messenger vs WhatsApp
  const platformFilter = (params.platform || "ALL").toUpperCase();
  if (platformFilter === "LANDING") {
    filtered = filtered.filter((i) => i.platform_type === "LANDING");
  } else if (platformFilter === "MESSENGER") {
    filtered = filtered.filter((i) => i.platform_type === "MESSENGER");
  } else if (platformFilter === "WHATSAPP") {
    filtered = filtered.filter((i) => i.platform_type === "WHATSAPP");
  }

  // 3. Tìm kiếm theo Tên Hàng hoặc Tên Page (không phân biệt hoa thường và dấu tiếng Việt)
  if (params.q?.trim()) {
    const searchNormalized = params.q
      .trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

    filtered = filtered.filter((i) => {
      const titleNormalized = i.title
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
      const pageNormalized = i.page_name
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
      return titleNormalized.includes(searchNormalized) || pageNormalized.includes(searchNormalized);
    });
  }

  // 4. Sắp xếp danh sách (Mặc định: ngày quét mới nhất trước)
  const sort = params.sort || "date_desc";
  const sorted = [...filtered].sort((a, b) => {
    if (sort === "date_desc") {
      const diff = parseScanDate(b.scan_date) - parseScanDate(a.scan_date);
      if (diff !== 0) return diff;
      return (Number(b.id) || 0) - (Number(a.id) || 0);
    }
    if (sort === "date_asc") {
      const diff = parseScanDate(a.scan_date) - parseScanDate(b.scan_date);
      if (diff !== 0) return diff;
      return (Number(a.id) || 0) - (Number(b.id) || 0);
    }
    if (sort === "price_desc") {
      const priceB = parsePriceValue(b.price);
      const priceA = parsePriceValue(a.price);
      return priceB - priceA;
    }
    if (sort === "price_asc") {
      const priceA = parsePriceValue(a.price);
      const priceB = parsePriceValue(b.price);
      if (priceA > 0 && priceB > 0) return priceA - priceB;
      if (priceA > 0 && priceB === 0) return -1;
      if (priceA === 0 && priceB > 0) return 1;
      return 0;
    }
    if (sort === "ads_desc") {
      return (b.ads_running_count || 0) - (a.ads_running_count || 0);
    }
    return 0;
  });

  const total = sorted.length;
  const page = Math.max(Number(params.page) || 1, 1);
  const limit = Math.min(Math.max(Number(params.limit) || 24, 1), 100);
  const pages = Math.ceil(total / limit) || 1;
  const startIndex = (page - 1) * limit;
  const paginated = sorted.slice(startIndex, startIndex + limit);

  // Trả về đầy đủ các trường cho card và modal (kèm library_url)
  const basicItems = paginated.map((item) => ({
    id: item.id,
    title: item.title,
    thumbnail: item.thumbnail,
    price: item.price,
    ads_running_count: item.ads_running_count,
    duration_days: item.duration_days,
    scan_date: item.scan_date,
    market: item.market,
    market_type: item.market_type,
    country_code: item.country_code,
    country_name: item.country_name,
    country_flag: item.country_flag,
    page_name: item.page_name,
    landing_url: item.landing_url,
    library_url: item.library_url,
    platform_raw: item.platform_raw,
    platform_type: item.platform_type,
    platform_label: item.platform_label,
  }));

  return {
    items: basicItems,
    pagination: {
      total,
      page,
      limit,
      pages,
    },
    stats: {
      total: totalAll,
      vn_count: vnCount,
      global_count: globalCount,
      landing_count: landingCount,
      messenger_count: messengerCount,
      whatsapp_count: whatsappCount,
    },
  };
}

/**
 * Lấy chi tiết đầy đủ của một sản phẩm (gồm Lý do WIN, Link Library, Ads Spy Tool...)
 * Hỗ trợ đối chiếu cả theo id hoặc titleHint để không bao giờ bị lệch sản phẩm
 */
export async function getWinningProductDetail(idOrSlug: string, titleHint?: string): Promise<SheetWinningProduct | null> {
  const allRawItems = await getAllSheetWinningProducts();
  const allItems = allRawItems.filter((i) => isValidThumbnailUrl(i.thumbnail));
  const cleanId = (idOrSlug || "").trim();
  const lowerSlug = cleanId.toLowerCase();
  const cleanTitle = (titleHint || "").trim().toLowerCase();

  // 1. Ưu tiên đối chiếu theo tên sản phẩm chính xác nếu có titleHint
  if (cleanTitle) {
    const foundByTitle = allItems.find((item) => item.title.toLowerCase() === cleanTitle);
    if (foundByTitle) return foundByTitle;
  }

  // 2. Tìm theo id hoặc tên sản phẩm slug
  const found = allItems.find((item) => item.id === cleanId || item.title.toLowerCase() === lowerSlug);
  return found || null;
}
