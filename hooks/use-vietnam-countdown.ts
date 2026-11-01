"use client";

import { useEffect, useState, useMemo } from "react";
import {
  CountdownTimeLeft,
  calculateVietnamCountdown,
  formatVietnamTargetDisplay,
  getVietnamTonightTarget,
} from "@/lib/utils/vietnam-countdown";

export interface UseVietnamCountdownReturn extends CountdownTimeLeft {
  targetDate: Date;
  targetDisplay: string;
  isMounted: boolean;
}

/**
 * Hook đếm ngược thời gian đến 23:00 tối nay theo giờ Việt Nam
 * Đảm bảo SSR-safe và không gây lỗi hydration mismatch
 */
export function useVietnamCountdown(targetHour = 23, targetMinute = 0): UseVietnamCountdownReturn {
  const targetDate = useMemo(
    () => getVietnamTonightTarget(targetHour, targetMinute),
    [targetHour, targetMinute]
  );

  const targetDisplay = useMemo(
    () => formatVietnamTargetDisplay(targetDate),
    [targetDate]
  );

  const [isMounted, setIsMounted] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<CountdownTimeLeft>(() =>
    calculateVietnamCountdown(targetDate)
  );

  useEffect(() => {
    setIsMounted(true);
    // Cập nhật ngay khi mount ở client
    setTimeLeft(calculateVietnamCountdown(targetDate));

    const intervalId = setInterval(() => {
      setTimeLeft(calculateVietnamCountdown(targetDate));
    }, 1000);

    return () => clearInterval(intervalId);
  }, [targetDate]);

  return {
    ...timeLeft,
    targetDate,
    targetDisplay,
    isMounted,
  };
}
