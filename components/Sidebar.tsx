"use client";

import { Logo } from "./Logo";

type Props = {
  onNewChat: () => void;
  open: boolean;
  onClose: () => void;
};

export function Sidebar({ onNewChat, open, onClose }: Props) {
  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/30 md:hidden"
          onClick={onClose}
          aria-hidden
        />
      )}
      <aside
        className={`fixed z-40 h-full w-[260px] shrink-0 border-r border-[var(--border)] bg-[var(--chrome)] transition-transform md:static md:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col p-3">
          <div className="flex items-center justify-between px-2 py-2">
            <Logo size="sm" />
            <button
              className="rounded-md p-1.5 hover:bg-black/5 md:hidden"
              onClick={onClose}
              aria-label="Close sidebar"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          <button
            onClick={() => {
              onNewChat();
              onClose();
            }}
            className="mt-2 flex items-center gap-2 rounded-lg border border-[var(--border)] bg-white px-3 py-2.5 text-sm font-medium transition hover:bg-black/[0.03]"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 5v14M5 12h14" />
            </svg>
            New chat
          </button>

          <div className="mt-6 px-2 text-xs uppercase tracking-wide text-[var(--muted)]">
            Recent
          </div>
          <div className="mt-1 px-2 text-sm text-[var(--muted)]">
            Nothing yet 💅
          </div>

          <div className="mt-auto flex items-center gap-2 rounded-lg px-2 py-2 text-sm text-[var(--muted)]">
            <span className="text-base">🇦🇲</span>
            <span>for giselle</span>
          </div>
        </div>
      </aside>
    </>
  );
}
