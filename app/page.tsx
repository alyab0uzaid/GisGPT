"use client";

import { useCallback, useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { ChatInput } from "@/components/ChatInput";
import { MessageList } from "@/components/MessageList";
import { HomeScreen } from "@/components/HomeScreen";
import type { Message } from "@/lib/types";

function uid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export default function Page() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [sending, setSending] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const send = useCallback(
    async (text: string) => {
      if (sending) return;

      const userMsg: Message = { id: uid(), role: "user", content: text };
      const assistantId = uid();
      const assistantMsg: Message = { id: assistantId, role: "assistant", content: "" };

      const next = [...messages, userMsg];
      setMessages([...next, assistantMsg]);
      setSending(true);

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: next.map((m) => ({ role: m.role, content: m.content })),
          }),
        });

        if (!res.body) {
          setMessages((cur) =>
            cur.map((m) =>
              m.id === assistantId
                ? { ...m, content: "OK so something BROKE 😤 try again" }
                : m,
            ),
          );
          return;
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let acc = "";

        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          acc += decoder.decode(value, { stream: true });
          setMessages((cur) =>
            cur.map((m) => (m.id === assistantId ? { ...m, content: acc } : m)),
          );
        }
      } catch {
        setMessages((cur) =>
          cur.map((m) =>
            m.id === assistantId
              ? { ...m, content: "OK so something BROKE 😤 try again" }
              : m,
          ),
        );
      } finally {
        setSending(false);
      }
    },
    [messages, sending],
  );

  const newChat = () => {
    if (sending) return;
    setMessages([]);
  };

  const empty = messages.length === 0;

  return (
    <div className="flex h-dvh">
      <Sidebar onNewChat={newChat} open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-[var(--border)] px-3 py-2 md:border-b-0">
          <button
            className="rounded-md p-2 hover:bg-black/5 md:hidden"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open sidebar"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M3 6h18M3 12h18M3 18h18" />
            </svg>
          </button>
          <div className="md:hidden">
            <span className="font-display text-base font-semibold">GisGPT</span>
          </div>
          <span className="text-xl" aria-label="Armenian flag" title="Armenia 🇦🇲">🇦🇲</span>
        </header>

        {empty ? (
          <HomeScreen onPick={send} />
        ) : (
          <div className="scrollbar-thin flex-1 overflow-y-auto">
            <MessageList messages={messages} />
          </div>
        )}

        <div className="pb-4 pt-2">
          <ChatInput onSend={send} disabled={sending} autoFocus />
          <p className="mx-auto mt-2 max-w-3xl px-4 text-center text-xs text-[var(--muted)]">
            GisGPT says wild things. Don&apos;t be so sensitive 😝
          </p>
        </div>
      </main>
    </div>
  );
}
