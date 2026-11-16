/**
 * Utility xác định trạng thái quảng cáo Facebook (Active hay Paused) chuẩn xác:
 * Quy tắc nghiệp vụ từ backend logic_be.js:
 * 1. Nếu cờ ad.is_active rõ ràng là true / 1 / "true" -> true (Active).
 * 2. Nếu filter_signals.is_recently_seen === true -> true (Active).
 * 3. Nếu còn thấy trong 7 ngày qua (ACTIVE_WINDOW_MS = 7 * 24 * 3600 * 1000):
 *    - last_seen >= Date.now() - 7 ngày -> true (Active).
 * 4. Nếu start_date mới xuất bản trong 7 ngày qua và chưa có end_date (hoặc end_date tương lai) -> true (Active).
 * 5. Nếu ad.end_date ở quá khứ -> false (Paused).
 * 6. Mặc định nếu không thuộc các trường hợp trên -> false (Paused).
 */
export interface FacebookAdStatusCandidate {
  is_active?: boolean | number | string | null;
  filter_signals?: {
    is_recently_seen?: boolean | null;
    [key: string]: unknown;
  } | null;
  end_date?: number | string | null;
  last_seen?: number | string | null;
  start_date?: number | string | null;
  [key: string]: unknown;
}

export function isFacebookAdActive(ad: FacebookAdStatusCandidate | null | undefined): boolean {
  if (!ad) return false;

  // 1. Cờ rõ ràng từ DB hoặc API
  if (ad.is_active === true || ad.is_active === 1 || ad.is_active === "true") return true;
  if (ad.filter_signals?.is_recently_seen === true) return true;

  const now = Date.now();
  const SEVEN_DAYS_MS = 7 * 24 * 3600 * 1000;

  // 2. Kiểm tra end_date: nếu đã có end_date và thời gian kết thúc ở quá khứ -> chắc chắn Paused
  if (ad.end_date) {
    let endMs = Number(ad.end_date);
    if (!isNaN(endMs) && endMs > 0) {
      if (endMs < 10000000000) endMs *= 1000;
      if (endMs < now) return false;
    } else {
      const d = new Date(ad.end_date).getTime();
      if (!isNaN(d) && d < now) return false;
    }
  }

  // 3. Kiểm tra last_seen (chuẩn 7 ngày recency của analyzer)
  if (ad.last_seen) {
    let lastSeenMs = Number(ad.last_seen);
    if (!isNaN(lastSeenMs) && lastSeenMs > 0) {
      if (lastSeenMs < 10000000000) lastSeenMs *= 1000;
      if (lastSeenMs >= now - SEVEN_DAYS_MS) {
        return true;
      }
    } else {
      const d = new Date(ad.last_seen).getTime();
      if (!isNaN(d) && d >= now - SEVEN_DAYS_MS) {
        return true;
      }
    }
  }

  // 4. Kiểm tra start_date nếu ad mới lên trong 7 ngày qua
  if (ad.start_date) {
    let startMs = Number(ad.start_date);
    if (!isNaN(startMs) && startMs > 0) {
      if (startMs < 10000000000) startMs *= 1000;
      if (startMs >= now - SEVEN_DAYS_MS) {
        return true;
      }
    } else {
      const d = new Date(ad.start_date).getTime();
      if (!isNaN(d) && d >= now - SEVEN_DAYS_MS) {
        return true;
      }
    }
  }

  return false;
}
