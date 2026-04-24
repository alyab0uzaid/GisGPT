"use client";

import { useEffect, useRef } from "react";
import type { Message as MessageType } from "@/lib/types";
import { Message } from "./Message";

export function MessageList({ messages }: { messages: MessageType[] }) {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages]);

  return (
    <div className="mx-auto w-full max-w-3xl space-y-6 px-4 py-8">
      {messages.map((m) => (
        <Message key={m.id} message={m} />
      ))}
      <div ref={endRef} />
    </div>
  );
}
