import { useMemo, useState } from "react";
import type { MonthNote } from "@/types/calendar";

type SeasonTheme = {
  accent: string;
  accentSoft: string;
  accentRing: string;
  noteBorder: string;
};

export interface NotesPanelProps {
  notes: MonthNote[];
  linkedDate: Date | null;
  theme: SeasonTheme;
  onLinkedDateChange: (date: Date | null) => void;
  onAddNote: (content: string, date?: Date | null, color?: string) => void;
  onDeleteNote: (id: string) => void;
}

const SWATCHES = ["#fde68a", "#bbf7d0", "#fecdd3", "#ddd6fe", "#bfdbfe"];
const ROTATIONS = ["-rotate-1", "rotate-1", "-rotate-2", "rotate-2", "rotate-0"];

function formatLinkedDate(date: Date | null): string {
  if (!date) {
    return "No date linked";
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function NotesPanel({
  notes,
  linkedDate,
  theme,
  onLinkedDateChange,
  onAddNote,
  onDeleteNote,
}: NotesPanelProps) {
  const [draft, setDraft] = useState("");
  const [selectedColor, setSelectedColor] = useState<string>(SWATCHES[0]);

  const sortedNotes = useMemo(() => {
    return [...notes].sort((a, b) => Number(b.date) - Number(a.date));
  }, [notes]);

  const handlePin = () => {
    const trimmed = draft.trim();
    if (!trimmed) {
      return;
    }

    onAddNote(trimmed, linkedDate, selectedColor);
    setDraft("");
  };

  return (
    <aside
      className="rounded-3xl border border-stone-300/80 bg-[#f7f2e7] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.5)]"
      style={{ boxShadow: `inset 0 1px 0 rgba(255,255,255,0.5), 0 0 0 1px ${theme.noteBorder}40` }}
    >
      <div className="flex items-center justify-between gap-3">
        <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-stone-600">Pinned Notes</h4>
        <button
          type="button"
          onClick={() => onLinkedDateChange(null)}
          className="min-h-11 rounded-xl bg-stone-200 px-3 text-xs font-semibold text-stone-700 transition hover:bg-stone-300"
          aria-label="Remove linked date from note draft"
        >
          Unlink Date
        </button>
      </div>

      <p className="mt-2 text-xs text-stone-600">Linked date: {formatLinkedDate(linkedDate)}</p>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {sortedNotes.map((note, index) => (
          <article
            key={note.id}
            className={`group animate-note-in relative min-h-28 rounded-xl p-3 shadow-md transition hover:z-10 hover:scale-[1.02] ${ROTATIONS[index % ROTATIONS.length]}`}
            style={{ backgroundColor: note.color, border: `1px solid ${theme.noteBorder}80` }}
          >
            <button
              type="button"
              onClick={() => onDeleteNote(note.id)}
              className="absolute right-2 top-2 h-7 w-7 rounded-full bg-black/15 text-sm font-bold text-stone-800 opacity-0 transition hover:bg-black/25 group-hover:opacity-100"
              aria-label="Delete note"
            >
              ×
            </button>

            {note.date ? (
              <p className="mb-2 inline-block rounded-full bg-black/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-stone-700">
                {note.date.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
              </p>
            ) : null}
            <p className="pr-6 text-sm leading-relaxed text-stone-900">{note.content}</p>
          </article>
        ))}
      </div>

      <div className="mt-5 rounded-2xl border border-stone-300 bg-[#fffdf8] p-3">
        <textarea
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="Write something worth pinning..."
          className="min-h-24 w-full resize-none rounded-xl border border-stone-300 bg-stone-50 p-3 text-sm text-stone-800 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
          aria-label="Note content"
        />

        <div className="mt-3 flex flex-wrap items-center gap-2">
          {SWATCHES.map((swatch) => (
            <button
              key={swatch}
              type="button"
              onClick={() => setSelectedColor(swatch)}
              className={[
                "h-8 w-8 rounded-full border-2 transition",
                selectedColor === swatch ? "border-stone-800 scale-105" : "border-stone-300",
              ].join(" ")}
              style={{ backgroundColor: swatch }}
              aria-label={`Select color ${swatch}`}
            />
          ))}
          <button
            type="button"
            onClick={handlePin}
            className="ml-auto min-h-11 rounded-xl px-5 text-sm font-semibold text-stone-50 transition"
            style={{ backgroundColor: theme.accent }}
            aria-label="Pin note"
          >
            Pin
          </button>
        </div>
      </div>
    </aside>
  );
}
