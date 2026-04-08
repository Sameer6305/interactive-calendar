import { Playfair_Display } from "next/font/google";

export interface MonthHeroImageProps {
  month: Date;
  isLoading?: boolean;
}

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["700", "800"],
});

const MONTH_IMAGE_MAP: Record<number, string> = {
  0: "https://images.unsplash.com/photo-1422360902398-0a91ff2c1a1f?auto=format&fit=crop&w=1400&q=80",
  1: "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?auto=format&fit=crop&w=1400&q=80",
  2: "https://images.unsplash.com/photo-1462275646964-a0e3386b89fa?auto=format&fit=crop&w=1400&q=80",
  3: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=1400&q=80",
  4: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1400&q=80",
  5: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1400&q=80",
  6: "https://images.unsplash.com/photo-1473116763249-2faaef81ccda?auto=format&fit=crop&w=1400&q=80",
  7: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1400&q=80",
  8: "https://images.unsplash.com/photo-1477414956199-6d57f668602e?auto=format&fit=crop&w=1400&q=80",
  9: "https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=1400&q=80",
  10: "https://images.unsplash.com/photo-1503435824048-a799a3a84bf7?auto=format&fit=crop&w=1400&q=80",
  11: "https://images.unsplash.com/photo-1483664852095-d6cc6870702d?auto=format&fit=crop&w=1400&q=80",
};

export function MonthHeroImage({ month, isLoading = false }: MonthHeroImageProps) {
  const monthName = month.toLocaleString("en-US", { month: "long" });
  const imageUrl = MONTH_IMAGE_MAP[month.getMonth()] ?? MONTH_IMAGE_MAP[0];

  if (isLoading) {
    return (
      <header className="relative overflow-hidden rounded-3xl border border-stone-300/70 bg-stone-100 p-3 shadow-[0_18px_30px_rgba(34,31,26,0.14)]">
        <div className="h-[200px] w-full animate-pulse rounded-2xl bg-stone-200 sm:h-64 md:h-72" />
      </header>
    );
  }

  return (
    <header className="relative overflow-hidden rounded-3xl border border-stone-300/70 bg-stone-100 shadow-[0_18px_30px_rgba(34,31,26,0.14)]">
      <div
        className="relative h-[200px] w-full bg-cover bg-center sm:h-64 md:h-72"
        style={{ backgroundImage: `url(${imageUrl})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-black/20" />
        <div className="absolute inset-0 bg-[repeating-linear-gradient(135deg,rgba(250,249,245,0.08)_0px,rgba(250,249,245,0.08)_1px,transparent_1px,transparent_7px)]" />

        <div className="absolute left-6 right-6 bottom-5">
          <p className="text-sm uppercase tracking-[0.24em] text-stone-100/90">Wall Calendar</p>
          <h2 className={`${playfair.className} text-5xl font-extrabold leading-none text-stone-50 md:text-6xl`}>
            {monthName}
          </h2>
        </div>

        <div className="pointer-events-none absolute left-1/2 top-3 flex -translate-x-1/2 items-center gap-16">
          {[0, 1].map((ring) => (
            <div key={ring} className="relative flex flex-col items-center">
              <span className="h-4 w-4 rounded-full border border-stone-700/80 bg-stone-900/80" />
              <svg
                className="mt-1 h-4 w-4 text-zinc-200 drop-shadow"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="2" />
              </svg>
            </div>
          ))}
        </div>
      </div>
    </header>
  );
}
