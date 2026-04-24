"use client";

import { Logo } from "./Logo";

const SUGGESTED = [
  "teach me an Armenian word",
  "random Armenian fact",
];

export function HomeScreen({ onPick }: { onPick: (prompt: string) => void }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 pb-6">
      <div className="flex flex-col items-center gap-4">
        <Logo size="lg" />
        <p className="text-sm text-[var(--muted)]">how can i bless you today 💅🇦🇲</p>
      </div>

      <div className="mt-10 flex flex-wrap justify-center gap-2">
        {SUGGESTED.map((s) => (
          <button
            key={s}
            onClick={() => onPick(s)}
            className="rounded-full border border-[var(--border)] bg-white px-4 py-2 text-sm transition hover:bg-[var(--chrome)]"
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}
