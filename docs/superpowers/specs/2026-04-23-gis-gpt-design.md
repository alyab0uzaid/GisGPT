# GIS GPT — Design Spec

**Date:** 2026-04-23
**Author:** Ali
**For:** Giselle (recipient)

## Summary

GIS GPT is a single-page ChatGPT-style web app where every response is written in the voice of Giselle — a sassy, theatrical, ALL-CAPS-loving, emoji-heavy Armenian character who roasts the user a little and always ties responses back to Armenia (mix of real facts and playful flexes). It's a gift: one link, no login, fresh session every time.

## Goals

- Recognizably looks and feels like ChatGPT's home screen, with Armenian flag accents as the only color.
- Every response stays in Giselle's voice and finds an Armenian tie-in.
- One URL Ali can share; works on phone and desktop.
- Zero-friction: no account, no setup for Giselle.

## Non-Goals (explicit YAGNI)

- No authentication.
- No database. No chat history persistence.
- No rate limiting in v1.
- No user accounts, no multi-user support.
- No image generation, file uploads, voice, or tool use.
- No analytics in v1.

## User Flow

1. Giselle opens the shared URL on her phone or laptop.
2. She sees the home screen: sidebar with "New chat" button, centered GIS GPT logo (flag-gradient dot + wordmark), message input, two suggested prompt chips, small disclaimer.
3. She types a message (or taps a suggested prompt). Input slides up, her message appears, GIS GPT's reply streams in below in Giselle's voice with Armenian tie-in.
4. She can keep chatting. "New chat" in the sidebar clears the current session.
5. Refresh = clean slate. No history ever saved.

## Visual Design

- **Layout:** ChatGPT-clone. Left sidebar (~240px), main chat area fills the rest. On mobile (<768px), sidebar collapses behind a hamburger toggle.
- **Color:** White background, near-black text (`#111`), light gray UI chrome (`#f9f9f9`, `#ececec`). The Armenian flag gradient (red `#D90012` → blue `#0033A0` → orange `#F2A800`) is used only in the logo dot and a small 🇦🇲 in the top-right. Everything else is monochrome.
- **Typography:**
  - **Space Grotesk** — the "GIS GPT" wordmark and any display headings.
  - **Geist** — all chat messages, UI text, buttons, input.
  - Loaded via `next/font/google` and `next/font/local` respectively (Geist ships with Next.js).
- **Home screen:** centered logo + wordmark, input below, two suggested prompts, disclaimer at bottom.
- **Suggested prompts:** "teach me an Armenian word" and "random Armenian fact". Tapping one sends it as the first message.
- **Disclaimer (footer):** "GIS GPT says wild things. Don't take it personal 😝"

## Architecture

### Stack

- **Framework:** Next.js (App Router), TypeScript.
- **Styling:** Tailwind CSS.
- **Fonts:** `next/font` (Geist + Space Grotesk).
- **AI:** Anthropic Claude via `@anthropic-ai/sdk`. Default model: `claude-sonnet-4-6` (latest Sonnet — fast, cheap enough for a toy, good voice).
- **Hosting:** Vercel.
- **Env vars:** `ANTHROPIC_API_KEY` set in Vercel project settings.

### File Structure

```
app/
  layout.tsx              # Root layout, font setup, metadata
  page.tsx                # Home + chat screen (single page)
  api/
    chat/
      route.ts            # POST endpoint, streams Claude responses
  globals.css             # Tailwind directives, small font/color tokens
components/
  Sidebar.tsx             # New chat button, placeholder for recent
  ChatInput.tsx           # Auto-growing textarea + send button
  Message.tsx             # Renders one chat bubble (user or assistant)
  MessageList.tsx         # Scrolling list, auto-scroll on new message
  HomeScreen.tsx          # Centered logo + suggested prompts (shown when messages.length === 0)
  Logo.tsx                # Flag-gradient dot + "GIS GPT" wordmark
lib/
  prompt.ts               # System prompt (Giselle's voice)
  types.ts                # Message types, API types
public/
  favicon.ico             # Armenian flag favicon
```

### Data Flow

1. `app/page.tsx` holds one `useState<Message[]>` for the current conversation. No persistence.
2. User submits input → new user message appended → POST to `/api/chat` with the full messages array.
3. Route handler calls Claude with `stream: true`, pipes tokens back as a `ReadableStream` (Server-Sent Events or plain text stream).
4. Client reads the stream, appends tokens to the in-progress assistant message, re-renders.
5. On "New chat" → `setMessages([])`. That's it.

### API Contract

**`POST /api/chat`**

Request:
```ts
{
  messages: Array<{ role: "user" | "assistant"; content: string }>
}
```

Response: streaming text (token-by-token). No JSON envelope — just raw tokens.

Errors: if the Claude call fails, return a 500 with a plain-text error message. Client shows a Giselle-voiced error bubble ("OK so something BROKE 😤 try again").

### System Prompt

Lives in `lib/prompt.ts`. Drafted structure (final copy to be tuned with Ali's emoji list):

```
You are GIS GPT — a sassy, theatrical, deeply Armenian-pride chatbot modeled after
Giselle. Your entire personality:

- VOICE: sarcastic and confident. You roast the user a little. You're smart and
  you know it. You're dramatic — everything is the BIGGEST deal.
- FORMATTING: use ALL CAPS for emphasis frequently. Use emojis liberally, especially
  😝 😤 💅 🇦🇲 [plus Ali's list]. Keep responses short to medium — never long
  essays unless asked.
- THE BIT: every single response ties back to Armenia somehow. Mix real facts
  (first Christian nation 301 AD, Mount Ararat, duduk, dolma, ghapama, lavash,
  the genocide, the alphabet invented by Mesrop Mashtots in 405 AD, etc.) with
  playful flexes ("as an Armenian obviously...", "armenians invented this", etc.).
  Pick whichever is funnier. Never break the bit.
- BOUNDARIES: you can roast but never be mean about protected traits. Keep it
  playful. If asked something genuinely harmful, decline in character.
```

Ali will provide his emoji shortlist before launch; it slots into the FORMATTING section.

## Testing

Manual only for v1:
- Open locally (`npm run dev`), send a handful of varied prompts (emotional, technical, silly, factual) and verify every response has (a) Giselle's voice, (b) an Armenia tie-in.
- Test suggested-prompt buttons.
- Test "New chat" resets state.
- Test on mobile Safari and desktop Chrome.

No automated tests in v1 — the app is small and output is subjective.

## Deployment

1. Repo pushed to GitHub.
2. Import to Vercel.
3. Set `ANTHROPIC_API_KEY` in Vercel env vars (Production + Preview).
4. Default domain: `gis-gpt.vercel.app`. Custom domain can come later if Ali wants.

## Open Items

- Ali's emoji shortlist (slots into the system prompt — does not block first implementation; we'll start with a reasonable default and swap in later).
- Whether to buy a custom domain.

## Risks

- **API cost if link leaks:** low risk since it's a personal share, but if it spreads, costs could climb. Mitigation deferred — we can add a simple per-IP rate limit later if needed.
- **API key exposure:** all Claude calls happen server-side in the route handler. Key is never shipped to the client.
- **Tone miss:** the voice has to actually feel like Giselle. Ali to review first few real exchanges before sharing the link.
