export interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  isInRange: boolean;
  isRangeStart: boolean;
  isRangeEnd: boolean;
  notes: string[];
}

export interface DateRange {
  start: Date | null;
  end: Date | null;
}

export interface MonthNote {
  id: string;
  date: Date | null;
  content: string;
  color: string;
}
