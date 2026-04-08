import { useCallback, useEffect, useRef, useState } from "react";
import type { MonthNote } from "@/types/calendar";

const STORAGE_KEY = "wall-calendar-notes";

export interface UseNotesResult {
  notes: MonthNote[];
  addNote: (content: string, date?: Date | null, color?: string) => MonthNote;
  deleteNote: (id: string) => void;
  getNotesForDate: (date: Date) => MonthNote[];
  getMonthNotes: (month: number, year: number) => MonthNote[];
}

function isSameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function randomPastelColor(): string {
  const hue = Math.floor(Math.random() * 360);
  return `hsl(${hue} 75% 85%)`;
}

function normalizeDate(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function useNotes(): UseNotesResult {
  const [notes, setNotes] = useState<MonthNote[]>([]);
  const hasLoadedFromStorage = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") {
      hasLoadedFromStorage.current = true;
      return;
    }

    try {
      const serializedNotes = window.localStorage.getItem(STORAGE_KEY);
      if (!serializedNotes) {
        hasLoadedFromStorage.current = true;
        return;
      }

      const parsedNotes = JSON.parse(serializedNotes) as Array<{
        id: string;
        date: string | null;
        content: string;
        color: string;
      }>;

      const hydratedNotes: MonthNote[] = parsedNotes.map((note) => ({
        ...note,
        date: note.date ? new Date(note.date) : null,
      }));

      setNotes(hydratedNotes);
    } catch {
      setNotes([]);
    } finally {
      hasLoadedFromStorage.current = true;
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    if (!hasLoadedFromStorage.current) {
      return;
    }

    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
    } catch {
      // Ignore storage failures such as quota or privacy mode restrictions.
    }
  }, [notes]);

  const addNote = useCallback((content: string, date: Date | null = null, color?: string): MonthNote => {
    const newNote: MonthNote = {
      id: typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.floor(Math.random() * 1000000)}`,
      date: date ? normalizeDate(date) : null,
      content,
      color: color ?? randomPastelColor(),
    };

    setNotes((previousNotes) => [...previousNotes, newNote]);
    return newNote;
  }, []);

  const deleteNote = useCallback((id: string) => {
    setNotes((previousNotes) => previousNotes.filter((note) => note.id !== id));
  }, []);

  const getNotesForDate = useCallback(
    (date: Date): MonthNote[] => {
      const normalizedDate = normalizeDate(date);
      return notes.filter((note) => note.date !== null && isSameDay(note.date, normalizedDate));
    },
    [notes],
  );

  const getMonthNotes = useCallback(
    (month: number, year: number): MonthNote[] => {
      return notes.filter(
        (note) => note.date !== null && note.date.getMonth() === month && note.date.getFullYear() === year,
      );
    },
    [notes],
  );

  return {
    notes,
    addNote,
    deleteNote,
    getNotesForDate,
    getMonthNotes,
  };
}
