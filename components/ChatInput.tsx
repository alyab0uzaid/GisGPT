"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  onSend: (text: string) => void;
  disabled?: boolean;
  autoFocus?: boolean;
};

export function ChatInput({ onSend, disabled, autoFocus }: Props) {
  const [value, setValue] = useState("");
  const ref = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 200) + "px";
  }, [value]);

  useEffect(() => {
    if (autoFocus) ref.current?.focus();
  }, [autoFocus]);

  const submit = () => {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setValue("");
  };

  return (
    <div className="mx-auto w-full max-w-3xl px-4">
      <div className="flex items-end gap-2 rounded-3xl border border-[var(--border)] bg-white px-4 py-3 shadow-[0_0_0_0.5px_rgba(0,0,0,0.02),0_2px_6px_rgba(0,0,0,0.04)] focus-within:border-black/20">
        <textarea
          ref={ref}
          rows={1}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              submit();
            }
          }}
          placeholder="Message GIS GPT"
          className="max-h-[200px] w-full resize-none border-0 bg-transparent text-[15px] leading-6 outline-none placeholder:text-[var(--muted)]"
        />
        <button
          onClick={submit}
          disabled={disabled || !value.trim()}
          aria-label="Send"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-black text-white transition disabled:bg-black/20"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 19V5M5 12l7-7 7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}
