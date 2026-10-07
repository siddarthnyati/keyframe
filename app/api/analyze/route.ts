import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";
import { THEMES, type FrameTags } from "@/lib/types";

export const maxDuration = 60;

const MAX_FRAMES = 24;

const SYSTEM = `You tag candidate frames from a film or series trailer for a streaming service's marketing team. The team will pick frames for poster, cover and hero artwork.

For each frame return one JSON object with:
- id: the frame id given
- faces: integer count of clearly visible human or character faces
- mood: two or three plain words (e.g. "quiet, tense")
- themes: 1 to 3 items from exactly this list: ${THEMES.map((t) => `"${t}"`).join(", ")}
- text: true if burned-in text, logos or credits are visible
- shot: "wide" | "medium" | "close"
- appeal: 0 to 1, how strong this frame would be as key art (expressive faces that convey tone score high; blur, mid-action smears, more than three people, and text overlays score low)
- why: one short sentence a designer would find useful, plain words, no hype

Respond with a JSON array only. No prose, no code fences.`;

type Incoming = { id: string; dataUrl: string };

function mock(frames: Incoming[]): FrameTags[] & { id: string }[] {
  const moods = ["quiet, searching", "tense, cold", "wide, lonely", "fierce, close", "warm, tender", "dark, urgent"];
  return frames.map((f, i) => ({
    id: f.id,
    faces: i % 3 === 0 ? 1 : i % 5 === 0 ? 2 : 0,
    mood: moods[i % moods.length],
    themes: [THEMES[(i * 3) % THEMES.length], THEMES[(i * 7 + 1) % THEMES.length]],
    text: i % 9 === 8,
    shot: (["wide", "medium", "close"] as const)[i % 3],
    appeal: 0.35 + ((i * 37) % 60) / 100,
    why: "Placeholder tags. Add an API key to run the model.",
  }));
}

export async function POST(req: Request) {
  const body = (await req.json()) as { frames: Incoming[] };
  const frames = (body.frames ?? []).slice(0, MAX_FRAMES);
  if (frames.length === 0) return NextResponse.json({ tags: [], mock: true });

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ tags: mock(frames), mock: true });
  }

  const client = new Anthropic();
  const content: Anthropic.ContentBlockParam[] = [];
  for (const f of frames) {
    const data = f.dataUrl.replace(/^data:image\/jpeg;base64,/, "");
    content.push({ type: "text", text: `Frame ${f.id}` });
    content.push({ type: "image", source: { type: "base64", media_type: "image/jpeg", data } });
  }
  content.push({ type: "text", text: `Tag all ${frames.length} frames. Return the JSON array now.` });

  try {
    const res = await client.messages.create({
      model: "claude-opus-5-5",
      max_tokens: 6000,
      output_config: { effort: "low" },
      system: SYSTEM,
      messages: [{ role: "user", content }],
    });
    if (res.stop_reason === "refusal") {
      return NextResponse.json({ tags: mock(frames), mock: true, note: "model declined" });
    }
    const text = res.content
      .filter((b): b is Anthropic.TextBlock => b.type === "text")
      .map((b) => b.text)
      .join("");
    const start = text.indexOf("[");
    const end = text.lastIndexOf("]");
    const parsed = JSON.parse(text.slice(start, end + 1)) as (FrameTags & { id: string })[];
    const allowed = new Set<string>(THEMES);
    const tags = parsed.map((t) => ({
      ...t,
      themes: (t.themes ?? []).filter((x) => allowed.has(x)).slice(0, 3),
      appeal: Math.max(0, Math.min(1, Number(t.appeal) || 0)),
      faces: Math.max(0, Math.round(Number(t.faces) || 0)),
    }));
    return NextResponse.json({
      tags,
      mock: false,
      usage: { input: res.usage.input_tokens, output: res.usage.output_tokens },
    });
  } catch (err) {
    const message = err instanceof Anthropic.APIError ? `${err.status} ${err.message}` : String(err);
    return NextResponse.json({ tags: mock(frames), mock: true, note: message });
  }
}
