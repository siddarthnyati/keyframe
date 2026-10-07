import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";
import { UPDATE_SEED, UPDATE_SEED_CAMPAIGN } from "@/lib/data";

export const maxDuration = 60;

type Body = {
  kind: "status" | "chase" | "campaign";
  title: string;
  launch: string;
  markets: number;
  producer: string;
  approved: number;
  total: number;
  cells: { market: string; deliverable: string; status: string; owner: string; due: string; note: string | null }[];
};

const SYSTEM = `You draft short operational emails for a streaming marketing producer. Plain English, no hype, no exclamation marks, no emoji, no bullet symbols other than numbers. Use only the facts given. Dates as "Oct 9". Keep the producer's voice: direct, specific, calm. Never invent a vendor, date or number that is not in the input.`;

export async function POST(req: Request) {
  const body = (await req.json()) as Body;
  const seed = body.kind === "chase" ? UPDATE_SEED.chase : body.kind === "campaign" ? UPDATE_SEED_CAMPAIGN : UPDATE_SEED.status;
  if (!process.env.ANTHROPIC_API_KEY) return NextResponse.json({ text: seed, mock: true });

  const ask =
    body.kind === "campaign"
      ? `Write the Monday campaign status email from the campaign manager to the marketing lead for ${body.title} (launches ${body.launch} in ${body.markets} markets). Production readiness: ${body.approved} of ${body.total} deliverables approved; open production items follow as JSON. Structure: one-line verdict on the campaign, a short "Production" paragraph naming what is blocking and that the production manager owns it, a "Placements" paragraph (homepage hero US Oct 21 to 23 and UK Oct 21 to 22 booked; paid social US and MX booked; CRM US and India booked; Germany paid social, Brazil TikTok and Japan mobile carousel waiting on production), a "Requests" line (two new since Friday, twelve open, nothing unowned), a "Brief" line (approved; adding a catch-up call to action because fans are rewatching season 1), and a closing line. Under 230 words.`
      : body.kind === "status"
      ? `Write the Monday status email for the ${body.title} launch (launches ${body.launch} in ${body.markets} markets, producer ${body.producer}). ${body.approved} of ${body.total} deliverables approved. Open items follow as JSON. Structure: one-line verdict (ready or not, how many blocking), a numbered "Blocking" list with owner, due date and the plan for each, one short "In review" paragraph, and one closing line on what the group needs to do (usually nothing). Under 220 words.`
      : `Write the chase email from ${body.producer} to the vendor that owns the late item among these open items (JSON follows). Subject line first. Ask for a written delivery commitment by a specific date, state the launch date and why the date matters, say what the fallback is if the date slips, and restate that the delivery spec is unchanged. Under 160 words.`;

  try {
    const client = new Anthropic();
    const res = await client.messages.create({
      model: "claude-opus-5-5",
      max_tokens: 1500,
      output_config: { effort: "low" },
      system: SYSTEM,
      messages: [{ role: "user", content: `${ask}\n\n${JSON.stringify(body.cells, null, 1)}` }],
    });
    if (res.stop_reason === "refusal") return NextResponse.json({ text: seed, mock: true, note: "declined" });
    const text = res.content
      .filter((b): b is Anthropic.TextBlock => b.type === "text")
      .map((b) => b.text)
      .join("")
      .trim();
    return NextResponse.json({ text: text || seed, mock: !text });
  } catch (err) {
    const message = err instanceof Anthropic.APIError ? `${err.status} ${err.message}` : String(err);
    return NextResponse.json({ text: seed, mock: true, note: message });
  }
}
