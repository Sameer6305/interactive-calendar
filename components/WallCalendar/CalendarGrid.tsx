import { useRef } from "react";
import type { KeyboardEvent } from "react";
import type { CalendarDay } from "@/types/calendar";

type SeasonTheme = {
  accent: string;
  accentSoft: string;
  accentRing: string;
  noteBorder: string;
};

type HolidayMap = Record<string, string>;

export interface CalendarGridProps {
  days: CalendarDay[];
  selectedDay: Date | null;
  isRangeSelected: boolean;
  theme: SeasonTheme;
  isLoading?: boolean;
  onDayClick: (date: Date) => void;
  onQuickAddNote: (date: Date) => void;
  onEscapeClearRange: () => void;
  className?: string;
}

const DAY_HEADERS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const INDIAN_HOLIDAYS_2025: HolidayMap = {
  "2025-01-14": "Makar Sankranti",
  "2025-01-26": "Republic Day",
  "2025-03-14": "Holi",
  "2025-03-31": "Eid al-Fitr (approx)",
  "2025-08-15": "Independence Day",
  "2025-08-27": "Ganesh Chaturthi (approx)",
  "2025-10-02": "Gandhi Jayanti",
  "2025-10-20": "Diwali (approx)",
  "2025-11-05": "Guru Nanak Jayanti (approx)",
  "2025-12-25": "Christmas Day",
};

function isSameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function toHolidayKey(date: Date): string {
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

function getISOWeekNumber(date: Date): number {
  const target = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNumber = target.getUTCDay() || 7;
  target.setUTCDate(target.getUTCDate() + 4 - dayNumber);
  const yearStart = new Date(Date.UTC(target.getUTCFullYear(), 0, 1));
  const weekNumber = Math.ceil((((target.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
  return weekNumber;
}

export function CalendarGrid({
  days,
  selectedDay,
  isRangeSelected,
  theme,
  isLoading = false,
  onDayClick,
  onQuickAddNote,
  onEscapeClearRange,
  className,
}: CalendarGridProps) {
  const weeks = Array.from({ length: 6 }, (_, index) => days.slice(index * 7, index * 7 + 7));
  const dayButtonRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const handleDayKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number, date: Date) => {
    const lastIndex = days.length - 1;

    if (event.key === "Escape") {
      event.preventDefault();
      onEscapeClearRange();
      return;
    }

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onDayClick(date);
      return;
    }

    let nextIndex = index;

    if (event.key === "ArrowRight") {
      nextIndex = Math.min(index + 1, lastIndex);
    } else if (event.key === "ArrowLeft") {
      nextIndex = Math.max(index - 1, 0);
    } else if (event.key === "ArrowDown") {
      nextIndex = Math.min(index + 7, lastIndex);
    } else if (event.key === "ArrowUp") {
      nextIndex = Math.max(index - 7, 0);
    } else {
      return;
    }

    event.preventDefault();
    dayButtonRefs.current[nextIndex]?.focus();
  };

  if (isLoading) {
    return (
      <section className="rounded-3xl border border-stone-300/80 bg-[#fbf8f0] p-3 md:p-5">
        <div className="space-y-3 animate-pulse">
          <div className="h-4 w-2/3 rounded bg-stone-200" />
          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: 42 }).map((_, idx) => (
              <div key={idx} className="h-10 rounded-lg bg-stone-200" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      className={`rounded-3xl border border-stone-300/80 bg-[#fbf8f0] p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.55)] md:p-5 ${className ?? ""}`}
      style={{ perspective: "1200px" }}
    >
      <div className="overflow-x-auto">
        <div className="grid min-w-[19rem] grid-cols-[1.35rem_repeat(7,minmax(0,1fr))] gap-x-0 gap-y-2" role="grid" aria-label="Month calendar">
        <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-stone-400">WK</div>
        {DAY_HEADERS.map((day) => (
          <div
            key={day}
            className="pb-1 text-center text-xs font-semibold uppercase tracking-[0.16em] text-stone-500"
            role="columnheader"
          >
            {day}
          </div>
        ))}

        {weeks.map((week, weekIndex) => (
          <div key={`week-${weekIndex}`} className="contents">
            <div className="flex items-center justify-center text-[10px] font-medium text-stone-400">
              {getISOWeekNumber(week[0].date)}
            </div>

            {week.map((day, dayOfWeekIndex) => {
              const dayIndex = weekIndex * 7 + dayOfWeekIndex;
              const showPopover =
                selectedDay !== null &&
                isSameDay(selectedDay, day.date) &&
                isRangeSelected;
              const holidayName = INDIAN_HOLIDAYS_2025[toHolidayKey(day.date)] ?? null;
              const isSelected = Boolean(
                (selectedDay && isSameDay(selectedDay, day.date)) || day.isRangeStart || day.isRangeEnd || day.isInRange,
              );

              return (
                <div
                  key={day.date.toISOString()}
                  className="group relative -mx-px p-0.5"
                  role="gridcell"
                  aria-selected={isSelected}
                >
                  {day.isInRange && !day.isRangeStart && !day.isRangeEnd ? (
                    <span
                      className="pointer-events-none absolute inset-y-3 -left-1 -right-1 rounded-none"
                      style={{ backgroundColor: theme.accentSoft }}
                    />
                  ) : null}

                  {day.isRangeStart && day.isInRange ? (
                    <span
                      className="pointer-events-none absolute inset-y-3 left-1/2 right-0"
                      style={{ backgroundColor: theme.accentSoft }}
                    />
                  ) : null}

                  {day.isRangeEnd && day.isInRange ? (
                    <span
                      className="pointer-events-none absolute inset-y-3 left-0 right-1/2"
                      style={{ backgroundColor: theme.accentSoft }}
                    />
                  ) : null}

                  <button
                    type="button"
                    onClick={() => onDayClick(day.date)}
                    onKeyDown={(event) => handleDayKeyDown(event, dayIndex, day.date)}
                    ref={(element) => {
                      dayButtonRefs.current[dayIndex] = element;
                    }}
                    className={[
                      "relative z-10 flex min-h-10 w-full min-w-10 items-center justify-center rounded-xl border text-sm transition sm:min-h-11 sm:min-w-11",
                      "hover:-translate-y-0.5 hover:bg-stone-200/70 hover:shadow-sm",
                      !day.isCurrentMonth ? "opacity-40" : "opacity-100",
                      day.isRangeStart || day.isRangeEnd
                        ? "font-semibold text-white"
                        : "bg-transparent text-stone-800",
                    ].join(" ")}
                    style={{
                      borderColor: day.isToday ? theme.accent : "transparent",
                      boxShadow: day.isToday ? `0 0 0 2px ${theme.accentRing}` : "none",
                      backgroundColor: day.isRangeStart || day.isRangeEnd ? theme.accent : "transparent",
                    }}
                    aria-label={day.date.toDateString()}
                  >
                    <span>{day.date.getDate()}</span>
                  </button>

                  {holidayName ? (
                    <>
                      <span
                        className="pointer-events-none absolute left-1.5 top-1.5 text-[11px]"
                        title={holidayName}
                        aria-label={holidayName}
                      >
                        🇮🇳
                      </span>
                      <span className="pointer-events-none absolute left-1/2 top-0 z-30 hidden w-max -translate-x-1/2 -translate-y-full rounded-md bg-stone-900 px-2 py-1 text-[10px] font-medium text-stone-50 shadow-md group-hover:block">
                        {holidayName}
                      </span>
                    </>
                  ) : null}

                  {showPopover ? (
                    <div className="absolute left-1/2 top-full z-20 mt-2 w-28 -translate-x-1/2 rounded-xl border border-stone-300 bg-[#fffdf7] p-2 text-center shadow-lg print:hidden">
                      <button
                        type="button"
                        onClick={() => onQuickAddNote(day.date)}
                        className="min-h-11 w-full rounded-lg px-2 py-1 text-xs font-semibold text-stone-50 transition"
                        style={{ backgroundColor: theme.accent }}
                        aria-label={`Add note for ${day.date.toDateString()}`}
                      >
                        + Add note
                      </button>
                    </div>
                  ) : null}

                  {day.notes.length > 0 ? (
                    <span className="pointer-events-none absolute bottom-1.5 right-1.5 h-2 w-2 rounded-full bg-amber-500" />
                  ) : null}
                </div>
              );
            })}
          </div>
        ))}
        </div>
      </div>
    </section>
  );
}
