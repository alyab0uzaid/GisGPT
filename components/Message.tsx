import Image from "next/image";
import type { Message as MessageType } from "@/lib/types";

export function Message({ message }: { message: MessageType }) {
  const isUser = message.role === "user";

  if (isUser) {
    return (
      <div className="flex justify-end">
        <div className="max-w-[80%] whitespace-pre-wrap rounded-3xl bg-[var(--chrome)] px-4 py-2.5 text-[15px] leading-7">
          {message.content}
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-3">
      <Image
        src="/avatar.png"
        alt="GisGPT"
        width={28}
        height={28}
        className="mt-1 h-7 w-7 shrink-0 rounded-full"
      />
      <div className="whitespace-pre-wrap pt-0.5 text-[15px] leading-7">
        {message.content}
        {message.content.length === 0 && (
          <span className="inline-block h-4 w-2 animate-pulse rounded-sm bg-black/60 align-middle" />
        )}
      </div>
    </div>
  );
}
