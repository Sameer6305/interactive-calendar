import type { DateRange } from "@/types/calendar";

type SeasonTheme = {
  accent: string;
  accentSoft: string;
  accentRing: string;
  noteBorder: string;
};

export interface DateRangeSelectorProps {
  month: Date;
  range: DateRange;
  theme: SeasonTheme;
  onPreviousMonth: () => void;
  onNextMonth: () => void;
  onClearRange: () => void;
  className?: string;
}

function formatRangeDate(date: Date | null): string {
  if (!date) {
    return "-";
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export function DateRangeSelector({
  month,
  range,
  theme,
  onPreviousMonth,
  onNextMonth,
  onClearRange,
  className,
}: DateRangeSelectorProps) {
  const monthLabel = month.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <section
      className={`rounded-3xl border border-stone-300/80 bg-[#f6f1e6] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.55)] ${className ?? ""}`}
      style={{ boxShadow: `inset 0 1px 0 rgba(255,255,255,0.55), 0 0 0 1px ${theme.accentRing}30` }}
    >
      <div className="flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={onPreviousMonth}
          className="min-h-11 min-w-11 rounded-full border border-stone-400 bg-[#faf9f5] px-3 text-lg text-stone-700 transition hover:bg-stone-200"
          style={{ borderColor: theme.accentRing }}
          aria-label="Go to previous month"
        >
          &lt;
        </button>
        <h3 className="text-center text-xl font-semibold tracking-wide text-stone-800">{monthLabel}</h3>
        <button
          type="button"
          onClick={onNextMonth}
          className="min-h-11 min-w-11 rounded-full border border-stone-400 bg-[#faf9f5] px-3 text-lg text-stone-700 transition hover:bg-stone-200"
          style={{ borderColor: theme.accentRing }}
          aria-label="Go to next month"
        >
          &gt;
        </button>
      </div>

      <div className="mt-4 rounded-2xl bg-stone-50/80 p-3 text-sm text-stone-700">
        <p className="text-xs uppercase tracking-[0.2em] text-stone-500">Selected range</p>
        <p className="mt-1 font-medium">
          {formatRangeDate(range.start)} to {formatRangeDate(range.end)}
        </p>
        <button
          type="button"
          onClick={onClearRange}
          className="mt-3 min-h-11 rounded-xl px-4 py-2 text-sm font-medium text-stone-100 transition"
          style={{ backgroundColor: theme.accent }}
          aria-label="Clear selected date range"
        >
          Clear Range
        </button>
      </div>
    </section>
  );
}
