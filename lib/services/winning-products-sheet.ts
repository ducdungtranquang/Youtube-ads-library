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
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 phút

async function fetchAndParseSheet(): Promise<SheetWinningProduct[]> {
  try {
    const res = await fetch(GOOGLE_SHEET_CSV_URL, {
      method: "GET",
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AdsSpyTool/1.0",
      },
      next: { revalidate: 300 }, // Next.js ISR cache 5 phút
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
          market_type: country.isVN ? "VN" : "GLOBAL",
          country_code: country.code,
          country_name: country.name,
          country_flag: country.flag,
          ads_spy_url: (raw["Link Đến ADS SPY TOOL (nếu có)"] || "").trim(),
          page_name: (raw["Tên PAGE"] || "").trim(),
          win_reason: (raw["Lý do WIN"] || "").trim(),
        };
      })
      .filter((item) => item.title.length > 0);

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
 * Lấy toàn bộ danh sách sản phẩm với cơ chế Cache hiệu năng cao
 */
export async function getAllSheetWinningProducts(): Promise<SheetWinningProduct[]> {
  const now = Date.now();
  const isExpired = now - cache.lastFetchedAt > CACHE_TTL_MS;

  // Nếu cache còn mới, trả về ngay tức thì (< 1ms)
  if (cache.items.length > 0 && !isExpired) {
    return cache.items;
  }

  // Nếu đang fetch thì đợi fetch hoàn tất
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
 * Lọc và phân trang cho danh sách (chỉ trả về các trường cơ bản cho card để tối ưu băng thông và tốc độ)
 */
export async function getWinningProductsList(params: {
  q?: string;
  market?: "ALL" | "VN" | "GLOBAL";
  page?: number;
  limit?: number;
}): Promise<{
  items: Omit<SheetWinningProduct, "win_reason" | "library_url" | "ads_spy_url">[];
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
  };
}> {
  const allItems = await getAllSheetWinningProducts();

  // Đếm thống kê tổng
  const totalAll = allItems.length;
  const vnCount = allItems.filter((i) => i.market_type === "VN").length;
  const globalCount = allItems.filter((i) => i.market_type === "GLOBAL").length;

  let filtered = allItems;

  // 1. Lọc theo Thị trường: Nước ngoài vs Việt Nam
  const marketFilter = (params.market || "ALL").toUpperCase();
  if (marketFilter === "VN") {
    filtered = filtered.filter((i) => i.market_type === "VN");
  } else if (marketFilter === "GLOBAL") {
    filtered = filtered.filter((i) => i.market_type === "GLOBAL");
  }

  // 2. Tìm kiếm theo Tên Hàng (không phân biệt hoa thường và dấu tiếng Việt)
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

  const total = filtered.length;
  const page = Math.max(Number(params.page) || 1, 1);
  const limit = Math.min(Math.max(Number(params.limit) || 24, 1), 100);
  const pages = Math.ceil(total / limit) || 1;
  const startIndex = (page - 1) * limit;
  const paginated = filtered.slice(startIndex, startIndex + limit);

  // Chỉ trả về các trường cơ bản cho card
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
    },
  };
}

/**
 * Lấy chi tiết đầy đủ của một sản phẩm (gồm Lý do WIN, Link Library, Ads Spy Tool...)
 */
export async function getWinningProductDetail(idOrSlug: string): Promise<SheetWinningProduct | null> {
  const allItems = await getAllSheetWinningProducts();
  const found = allItems.find((item) => item.id === idOrSlug || item.title.toLowerCase() === idOrSlug.toLowerCase());
  return found || null;
}
