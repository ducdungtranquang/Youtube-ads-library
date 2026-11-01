/**
 * Tiện ích đếm ngược thời gian đến mốc Release chính thức (23:00 tối nay theo giờ Việt Nam - UTC+7)
 */

export interface CountdownTimeLeft {
  totalMs: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
  formattedHours: string;
  formattedMinutes: string;
  formattedSeconds: string;
  progressPercent: number;
}

/**
 * Lấy mốc thời gian 23:00:00 tối nay theo múi giờ Việt Nam (Asia/Ho_Chi_Minh, UTC+7)
 */
export function getVietnamTonightTarget(targetHour = 23, targetMinute = 0): Date {
  const now = new Date();

  // Định dạng ngày hôm nay theo múi giờ Việt Nam (YYYY-MM-DD)
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Ho_Chi_Minh',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });

  const vnDateStr = formatter.format(now);
  const hourStr = String(targetHour).padStart(2, '0');
  const minStr = String(targetMinute).padStart(2, '0');

  // Chuỗi ISO đầy đủ với múi giờ Việt Nam +07:00
  return new Date(`${vnDateStr}T${hourStr}:${minStr}:00+07:00`);
}

/**
 * Định dạng ngày giờ hiển thị theo chuẩn tiếng Việt
 */
export function formatVietnamTargetDisplay(targetDate: Date): string {
  try {
    return new Intl.DateTimeFormat('vi-VN', {
      timeZone: 'Asia/Ho_Chi_Minh',
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(targetDate);
  } catch {
    return '23:00 tối nay (Giờ Việt Nam)';
  }
}

/**
 * Tính toán thời gian còn lại đến mốc targetDate
 */
export function calculateVietnamCountdown(targetDate: Date): CountdownTimeLeft {
  const now = new Date();
  const diffMs = targetDate.getTime() - now.getTime();

  if (diffMs <= 0) {
    return {
      totalMs: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      isExpired: true,
      formattedHours: '00',
      formattedMinutes: '00',
      formattedSeconds: '00',
      progressPercent: 100,
    };
  }

  const totalSeconds = Math.floor(diffMs / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  // Tính % tiến trình trong ngày hướng tới mốc 23h (23 giờ = 82,800,000 ms)
  const totalDayMs = 23 * 60 * 60 * 1000;
  const elapsedMs = Math.max(0, totalDayMs - diffMs);
  const progressPercent = Math.min(100, Math.max(0, Math.round((elapsedMs / totalDayMs) * 100)));

  return {
    totalMs: diffMs,
    hours,
    minutes,
    seconds,
    isExpired: false,
    formattedHours: String(hours).padStart(2, '0'),
    formattedMinutes: String(minutes).padStart(2, '0'),
    formattedSeconds: String(seconds).padStart(2, '0'),
    progressPercent,
  };
}
