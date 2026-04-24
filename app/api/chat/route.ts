import Anthropic from "@anthropic-ai/sdk";
import { SYSTEM_PROMPT } from "@/lib/prompt";
import type { ChatRequestBody } from "@/lib/types";

export const runtime = "nodejs";
export const maxDuration = 60;

const client = new Anthropic();

export async function POST(req: Request) {
  let body: ChatRequestBody;
  try {
    body = await req.json();
  } catch {
    return new Response("OK so your REQUEST was broken 😤 not mine 💅", { status: 400 });
  }

  const messages = (body.messages ?? []).filter(
    (m) => (m.role === "user" || m.role === "assistant") && typeof m.content === "string" && m.content.trim().length > 0,
  );

  if (messages.length === 0) {
    return new Response("say SOMETHING babe 😝", { status: 400 });
  }

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const anthropicStream = client.messages.stream({
          model: "claude-opus-4-7",
          max_tokens: 4096,
          system: SYSTEM_PROMPT,
          thinking: { type: "adaptive" },
          messages: messages.map((m) => ({ role: m.role, content: m.content })),
        });

        anthropicStream.on("text", (text) => {
          controller.enqueue(encoder.encode(text));
        });

        await anthropicStream.finalMessage();
        controller.close();
      } catch (err) {
        const msg =
          err instanceof Anthropic.APIError
            ? `OK the API is HAVING A MOMENT 😤 (${err.status}) try again`
            : "OK so something BROKE 😤 try again";
        controller.enqueue(encoder.encode(msg));
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      "X-Accel-Buffering": "no",
    },
  });
}
