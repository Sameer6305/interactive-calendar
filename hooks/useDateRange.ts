import { useCallback, useState } from "react";
import type { DateRange } from "@/types/calendar";

export interface UseDateRangeResult {
  range: DateRange;
  handleDayClick: (date: Date) => void;
  isInRange: (date: Date) => boolean;
  isRangeStart: (date: Date) => boolean;
  isRangeEnd: (date: Date) => boolean;
  clearRange: () => void;
}

function normalizeDate(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function isSameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

export function useDateRange(): UseDateRangeResult {
  const [start, setStart] = useState<Date | null>(null);
  const [end, setEnd] = useState<Date | null>(null);

  const handleDayClick = useCallback((date: Date) => {
    const nextDate = normalizeDate(date);

    if (!start) {
      setStart(nextDate);
      setEnd(null);
      return;
    }

    if (!end) {
      if (nextDate.getTime() < start.getTime()) {
        setStart(nextDate);
        setEnd(start);
        return;
      }

      setEnd(nextDate);
      return;
    }

    setStart(null);
    setEnd(null);
  }, [end, start]);

  const isInRange = useCallback(
    (date: Date): boolean => {
      if (!start || !end) {
        return false;
      }

      const normalizedDate = normalizeDate(date);
      return normalizedDate.getTime() >= start.getTime() && normalizedDate.getTime() <= end.getTime();
    },
    [end, start],
  );

  const isRangeStart = useCallback(
    (date: Date): boolean => {
      if (!start) {
        return false;
      }

      return isSameDay(normalizeDate(date), start);
    },
    [start],
  );

  const isRangeEnd = useCallback(
    (date: Date): boolean => {
      if (!end) {
        return false;
      }

      return isSameDay(normalizeDate(date), end);
    },
    [end],
  );

  const clearRange = useCallback(() => {
    setStart(null);
    setEnd(null);
  }, []);

  return {
    range: {
      start,
      end,
    },
    handleDayClick,
    isInRange,
    isRangeStart,
    isRangeEnd,
    clearRange,
  };
}
