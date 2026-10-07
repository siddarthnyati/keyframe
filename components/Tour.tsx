"use client";

import Link from "next/link";
import { X } from "lucide-react";
import type { Persona } from "@/lib/data";

type Step = { href: string; title: string; text: string; before: string };

export const TOURS: Record<Persona["id"], Step[]> = {
  production: [
    { href: "/production", title: "Monday, 9am", text: "One sentence tells Priya whether The Terminal List season 2 is ready and what is in the way. Three blockers, each with the owner and the date.", before: "Before: open four trackers and a vendor thread, work it out by hand." },
    { href: "/production/launch", title: "The German dub", text: "On the board, Germany's dubbed trailer is late. Nordlicht Dub slipped the mix and gave a verbal ETA of Oct 9. The cell says so.", before: "Before: a cell in a spreadsheet that says 'in progress' until someone asks." },
    { href: "/production/launch?title=terminal&cell=JP:keyart", title: "The Japan rejection", text: "Japan's key art failed one check on arrival: no 2:3 poster. It showed up here on the day, not at upload a week later.", before: "Before: the rejection email arrives after the vendor has billed the round." },
    { href: "/production/update?kind=chase", title: "The chase, drafted", text: "The chase to Nordlicht is already written from the board: the date, the fallback, the unchanged spec. Priya edits and sends.", before: "Before: twenty minutes writing it from memory." },
    { href: "/production/update?kind=status", title: "The 10am update", text: "The production status to her marketing lead reads off the same board. Nothing re-typed. Nothing sends itself.", before: "Before: an hour every Monday turning the tracker into prose." },
  ],
  campaign: [
    { href: "/campaign", title: "Monday, 9am", text: "Dev sees the campaign in one sentence, where it is running this week, and what landed in the queue since Friday.", before: "Before: the ticket tool, the tracker, and a Slack search." },
    { href: "/campaign/requests", title: "Two new requests", text: "The Japan rejection and a TikTok cut for Brazil. Each is already linked to the board with a suggested owner and the reason. Dev confirms.", before: "Before: re-type each ticket into the tracker and guess the owner." },
    { href: "/campaign/brief", title: "The brief, with evidence", text: "The approved brief sits beside what people said about the title this week, with sources. Fans are rewatching season 1 and Dark Wolf.", before: "Before: the brief and the listening report live in different places." },
    { href: "/campaign?map=1", title: "Where it runs", text: "Nine placements across six markets. Three are waiting on production: Germany, Brazil, Japan. Same three blockers Priya is chasing.", before: "Before: the regional lead asks, and someone builds a slide." },
    { href: "/campaign/status", title: "Status, sent up", text: "The campaign status to the marketing lead is drafted from the board, the queue and the brief. Dev adds the catch-up CTA decision and sends.", before: "Before: Monday afternoon, gone." },
  ],
};

export default function Tour({ persona, step }: { persona: Persona; step: number }) {
  const steps = TOURS[persona.id];
  const i = Math.min(Math.max(step, 1), steps.length);
  const s = steps[i - 1];
  const next = steps[i];
  const join = (href: string, n: number) => `${href}${href.includes("?") ? "&" : "?"}tour=${n}`;
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-30 flex justify-center p-5">
      <div className="pointer-events-auto w-full max-w-[760px] rounded-[10px] border border-line-strong bg-panel/95 p-4 shadow-[0_16px_48px_rgba(0,0,0,0.55)] backdrop-blur">
        <div className="flex items-start gap-4">
          <span className="mono mt-0.5 shrink-0 rounded-[4px] bg-sel px-1.5 py-0.5 text-[11px] text-t2">
            {i} of {steps.length}
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[13.5px] font-medium">
              {persona.first}&rsquo;s morning. {s.title}.
            </p>
            <p className="mt-1 text-[13px] leading-5 text-t1">{s.text}</p>
            <p className="mt-1 text-[12px] leading-4 text-t3">{s.before}</p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            {next ? (
              <Link href={join(next.href, i + 1)} className="inline-flex h-8 items-center rounded-[4px] bg-t1 px-3 text-[12.5px] font-medium text-app hover:bg-white">
                Next
              </Link>
            ) : (
              <Link href="/" className="inline-flex h-8 items-center rounded-[4px] bg-t1 px-3 text-[12.5px] font-medium text-app hover:bg-white">
                Meet {persona.id === "production" ? "Dev" : "Priya"}
              </Link>
            )}
            <Link href={s.href.split("?")[0]} className="inline-flex size-8 items-center justify-center rounded-[4px] text-t3 hover:bg-hover hover:text-t1" aria-label="Close tour">
              <X size={14} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
