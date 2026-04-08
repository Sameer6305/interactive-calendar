import { useMemo, useState } from "react";
import type { CalendarDay } from "@/types/calendar";

export interface UseCalendarResult {
  currentMonth: number;
  currentYear: number;
  currentMonthDate: Date;
  days: CalendarDay[];
  generateCalendarDays: () => CalendarDay[];
  goToPreviousMonth: () => void;
  goToNextMonth: () => void;
}

function areSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function useCalendar(): UseCalendarResult {
  const today = useMemo(() => new Date(), []);
  const [currentMonth, setCurrentMonth] = useState<number>(today.getMonth());
  const [currentYear, setCurrentYear] = useState<number>(today.getFullYear());

  const currentMonthDate = useMemo(
    () => new Date(currentYear, currentMonth, 1),
    [currentMonth, currentYear],
  );

  const generateCalendarDays = (): CalendarDay[] => {
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
    const daysFromPreviousMonth = firstDayOfMonth.getDay();
    const startDate = new Date(currentYear, currentMonth, 1 - daysFromPreviousMonth);
    const grid: CalendarDay[] = [];

    for (let slot = 0; slot < 42; slot += 1) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + slot);

      grid.push({
        date,
        isCurrentMonth: date.getMonth() === currentMonth,
        isToday: areSameDay(date, today),
        isInRange: false,
        isRangeStart: false,
        isRangeEnd: false,
        notes: [],
      });
    }

    return grid;
  };

  const days = useMemo(() => generateCalendarDays(), [currentMonth, currentYear]);

  const goToPreviousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((previousYear) => previousYear - 1);
      return;
    }

    setCurrentMonth((previousMonth) => previousMonth - 1);
  };

  const goToNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((previousYear) => previousYear + 1);
      return;
    }

    setCurrentMonth((previousMonth) => previousMonth + 1);
  };

  return {
    currentMonth,
    currentYear,
    currentMonthDate,
    days,
    generateCalendarDays,
    goToPreviousMonth,
    goToNextMonth,
  };
}
