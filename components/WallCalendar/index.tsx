"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { CalendarGrid } from "@/components/WallCalendar/CalendarGrid";
import { DateRangeSelector } from "@/components/WallCalendar/DateRangeSelector";
import { MonthHeroImage } from "@/components/WallCalendar/MonthHeroImage";
import { NotesPanel } from "@/components/WallCalendar/NotesPanel";
import { useCalendar } from "@/hooks/useCalendar";
import { useDateRange } from "@/hooks/useDateRange";
import { useNotes } from "@/hooks/useNotes";
import type { CalendarDay } from "@/types/calendar";

function isSameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

type SeasonTheme = {
  accent: string;
  accentSoft: string;
  accentRing: string;
  noteBorder: string;
};

function getSeasonTheme(month: number): SeasonTheme {
  if (month === 11 || month === 0 || month === 1) {
    return {
      accent: "#334155",
      accentSoft: "#dbeafe",
      accentRing: "#93c5fd",
      noteBorder: "#94a3b8",
    };
  }

  if (month >= 2 && month <= 4) {
    return {
      accent: "#166534",
      accentSoft: "#dcfce7",
      accentRing: "#86efac",
      noteBorder: "#f9a8d4",
    };
  }

  if (month >= 5 && month <= 7) {
    return {
      accent: "#c2410c",
      accentSoft: "#ffedd5",
      accentRing: "#fdba74",
      noteBorder: "#fcd34d",
    };
  }

  return {
    accent: "#b45309",
    accentSoft: "#fef3c7",
    accentRing: "#f59e0b",
    noteBorder: "#d97706",
  };
}

export function WallCalendar() {
  const {
    currentMonth,
    currentYear,
    currentMonthDate,
    days,
    goToPreviousMonth,
    goToNextMonth,
  } = useCalendar();
  const { range, handleDayClick, isInRange, isRangeStart, isRangeEnd, clearRange } = useDateRange();
  const { notes, addNote, deleteNote, getMonthNotes, getNotesForDate } = useNotes();

  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [linkedDate, setLinkedDate] = useState<Date | null>(null);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [flipStage, setFlipStage] = useState<"idle" | "out" | "in">("idle");
  const flipTimeoutRef = useRef<number | null>(null);
  const settleTimeoutRef = useRef<number | null>(null);

  const seasonTheme = useMemo(() => getSeasonTheme(currentMonth), [currentMonth]);

  useEffect(() => {
    const loadingTimeout = window.setTimeout(() => {
      setIsInitialLoading(false);
    }, 420);

    return () => {
      window.clearTimeout(loadingTimeout);
      if (flipTimeoutRef.current !== null) {
        window.clearTimeout(flipTimeoutRef.current);
      }
      if (settleTimeoutRef.current !== null) {
        window.clearTimeout(settleTimeoutRef.current);
      }
    };
  }, []);

  const enhancedDays: CalendarDay[] = useMemo(() => {
    return days.map((day) => {
      const dayNotes = getNotesForDate(day.date);
      return {
        ...day,
        isInRange: isInRange(day.date),
        isRangeStart: isRangeStart(day.date),
        isRangeEnd: isRangeEnd(day.date),
        notes: dayNotes.map((note) => note.content),
      };
    });
  }, [days, getNotesForDate, isInRange, isRangeEnd, isRangeStart]);

  const monthNotes = useMemo(() => {
    const linkedMonthNotes = getMonthNotes(currentMonth, currentYear);
    const unlinkedNotes = notes.filter((note) => note.date === null);
    return [...linkedMonthNotes, ...unlinkedNotes];
  }, [currentMonth, currentYear, getMonthNotes, notes]);

  const isRangeSelected = Boolean(range.start && range.end);

  const handleGridDayClick = (date: Date) => {
    handleDayClick(date);
    setSelectedDay((previousDay) => {
      if (previousDay && isSameDay(previousDay, date)) {
        return null;
      }

      return date;
    });
  };

  const handleQuickAddNote = (date: Date) => {
    setLinkedDate(date);
  };

  const handleEscapeRange = () => {
    clearRange();
    setSelectedDay(null);
  };

  const runMonthFlipTransition = (navigateMonth: () => void) => {
    if (flipTimeoutRef.current !== null) {
      window.clearTimeout(flipTimeoutRef.current);
    }
    if (settleTimeoutRef.current !== null) {
      window.clearTimeout(settleTimeoutRef.current);
    }

    setFlipStage("out");
    flipTimeoutRef.current = window.setTimeout(() => {
      navigateMonth();
      setFlipStage("in");
      settleTimeoutRef.current = window.setTimeout(() => {
        setFlipStage("idle");
      }, 220);
    }, 210);
  };

  const flipClassName = flipStage === "out"
    ? "calendar-flip-out"
    : flipStage === "in"
      ? "calendar-flip-in"
      : "";

  return (
    <main className="min-h-screen bg-[#f1ede4] px-3 py-6 md:px-6">
      <section className="mx-auto max-w-7xl rounded-[2rem] border border-stone-300/70 bg-[#faf9f5] p-3 shadow-[0_24px_45px_rgba(56,48,33,0.23)] md:p-5 lg:grid lg:grid-cols-5 lg:gap-6">
        <div className="order-1 space-y-4 lg:col-span-2">
          <MonthHeroImage month={currentMonthDate} isLoading={isInitialLoading} />
          <DateRangeSelector
            className="print:hidden"
            month={currentMonthDate}
            range={range}
            theme={seasonTheme}
            onPreviousMonth={() => runMonthFlipTransition(goToPreviousMonth)}
            onNextMonth={() => runMonthFlipTransition(goToNextMonth)}
            onClearRange={clearRange}
          />
        </div>

        <div className="order-2 mt-4 lg:col-span-3 lg:row-span-2 lg:mt-0">
          <CalendarGrid
            className={flipClassName}
            days={enhancedDays}
            selectedDay={selectedDay}
            isRangeSelected={isRangeSelected}
            theme={seasonTheme}
            isLoading={isInitialLoading}
            onDayClick={handleGridDayClick}
            onQuickAddNote={handleQuickAddNote}
            onEscapeClearRange={handleEscapeRange}
          />
        </div>

        <div className="order-3 mt-4 print:hidden lg:col-span-2 lg:mt-0">
          <NotesPanel
            notes={monthNotes}
            linkedDate={linkedDate}
            theme={seasonTheme}
            onLinkedDateChange={setLinkedDate}
            onAddNote={addNote}
            onDeleteNote={deleteNote}
          />
        </div>
      </section>
    </main>
  );
}
