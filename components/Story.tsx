"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useLayoutEffect, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { Persona } from "@/lib/data";

export type StoryStep = { href: string; target: string; bubble: string; lesson: string };

export const STORIES: Record<Persona["id"], StoryStep[]> = {
  campaign: [
    { href: "/campaign", target: "todo-0", bubble: "Two tickets landed since Friday. Queue first, then the rest.", lesson: "The day starts with what needs him, not a dashboard." },
    { href: "/campaign/requests", target: "row-REQ-2418", bubble: "Japan key art bounced, no 2:3 poster. It already linked the ticket to the board and named Halftone.", lesson: "A request is read once and routed, not re-typed into a tracker." },
    { href: "/campaign/requests", target: "confirm", bubble: "Right owner, right reason. Confirm and route.", lesson: "The tool suggests. Dev decides." },
    { href: "/campaign/brief", target: "coverage", bubble: "Fans are rewatching season 1 before launch. That goes in the CRM as a catch-up call to action.", lesson: "The brief sits next to the evidence, with sources." },
    { href: "/campaign", target: "globe", bubble: "Where are we live? Carrie in the US and UK. Terminal List booked everywhere except the three red ones.", lesson: "The regional lead's question, answered without a slide." },
    { href: "/campaign/status", target: "send", bubble: "Status to my lead, drafted from the board, the queue and the brief. I read it once and send.", lesson: "Nothing sends itself." },
  ],
  production: [
    { href: "/production", target: "todo-0", bubble: "Nordlicht slipped the German dub. I want that date in writing before anything else.", lesson: "The late file names its owner and the next move." },
    { href: "/production/update?kind=chase", target: "send", bubble: "Already written from the board: launch date, fallback, spec. One tweak and send.", lesson: "Drafted, never sent for her." },
    { href: "/production/launch?title=terminal&cell=JP:keyart", target: "cell-JP:keyart", bubble: "Japan bounced on arrival: no 2:3 poster. Halftone has the files, so it is one size, not new art.", lesson: "The spec check ran the day the file arrived, not at upload." },
    { href: "/production/update?kind=status", target: "send", bubble: "10am. The status reads off the same board. Read once, send.", lesson: "One board, every email." },
  ],
};

const join = (href: string, n: number) => `${href}${href.includes("?") ? "&" : "?"}story=${n}`;

export default function Story({ persona, step }: { persona: Persona; step: number }) {
  const steps = STORIES[persona.id];
  const i = Math.min(Math.max(step, 1), steps.length);
  const s = steps[i - 1];
  const router = useRouter();
  const [rect, setRect] = useState<DOMRect | null>(null);
  const prevHref = i > 1 ? join(steps[i - 2].href, i - 1) : null;
  const last = i === steps.length;
  const other = persona.id === "campaign" ? "production" : "campaign";
  const nextHref = last ? `/${other}?story=1` : join(steps[i].href, i + 1);
  const exitHref = s.href.split("?")[0];

  useEffect(() => {
    router.prefetch(nextHref);
  }, [router, nextHref]);

  // Find the target, keep its box fresh, and make clicking it advance the story.
  useLayoutEffect(() => {
    let tries = 0;
    let raf = 0;
    let el: HTMLElement | null = null;
    const onClick = (e: Event) => {
      e.preventDefault();
      e.stopPropagation();
      router.push(nextHref);
    };
    const find = () => {
      el = document.querySelector<HTMLElement>(`[data-story="${s.target}"]`);
      if (el) {
        el.scrollIntoView({ block: "center" });
        setRect(el.getBoundingClientRect());
        el.addEventListener("click", onClick, true);
      } else if (tries++ < 60) raf = requestAnimationFrame(find);
    };
    find();
    const refresh = () => {
      if (el) setRect(el.getBoundingClientRect());
    };
    window.addEventListener("resize", refresh);
    window.addEventListener("scroll", refresh, true);
    const t = setInterval(refresh, 250);
    return () => {
      cancelAnimationFrame(raf);
      clearInterval(t);
      window.removeEventListener("resize", refresh);
      window.removeEventListener("scroll", refresh, true);
      el?.removeEventListener("click", onClick, true);
    };
  }, [s.target, s.href, nextHref, router]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        router.push(nextHref);
      }
      if (e.key === "ArrowLeft" && prevHref) router.push(prevHref);
      if (e.key === "Escape") router.push(exitHref);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [router, nextHref, prevHref, exitHref]);

  return (
    <>
      {rect && (
        <div
          className="pointer-events-none fixed z-30 rounded-[12px] ring-[3px] ring-prime transition-all duration-200"
          style={{ left: rect.left - 6, top: rect.top - 6, width: rect.width + 12, height: rect.height + 12, boxShadow: "0 0 0 9999px rgba(8,10,14,0.6)" }}
        />
      )}

      {/* Avatar + bubble */}
      <div className="pointer-events-none fixed bottom-24 left-6 z-40 flex max-w-[560px] items-end gap-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={persona.avatar} alt="" className="size-[96px] shrink-0 rounded-full bg-white shadow-[0_8px_24px_rgba(0,0,0,0.5)]" />
        <div className="relative rounded-[16px] bg-white px-5 py-3.5 text-[#111] shadow-[0_8px_24px_rgba(0,0,0,0.5)]">
          <span className="absolute -left-2 bottom-6 size-4 rotate-45 bg-white" />
          <p className="text-[15px] font-medium leading-6">{s.bubble}</p>
          <p className="mt-1 text-[12.5px] leading-4 text-[#666]">{s.lesson}</p>
        </div>
      </div>

      {/* Controls: one big Next, with the hand on it */}
      <div className="fixed bottom-6 right-6 z-40 flex items-center gap-3">
        <Link href={exitHref} className="inline-flex size-10 items-center justify-center rounded-full bg-panel text-t3 ring-1 ring-line-strong hover:text-t1" aria-label="Exit story">
          <X size={16} />
        </Link>
        {prevHref ? (
          <Link href={prevHref} className="inline-flex size-12 items-center justify-center rounded-full bg-panel text-t2 ring-1 ring-line-strong hover:text-t1" aria-label="Back">
            <ChevronLeft size={20} />
          </Link>
        ) : (
          <span className="inline-flex size-12 items-center justify-center rounded-full bg-panel text-t3 ring-1 ring-line-strong">
            <ChevronLeft size={20} />
          </span>
        )}
        <div className="relative">
          <Link href={nextHref} className="inline-flex h-14 items-center gap-2 rounded-full bg-prime px-7 text-[17px] font-semibold text-white shadow-[0_12px_32px_rgba(26,152,255,0.45)] hover:brightness-110 active:scale-[0.98]">
            {last ? `Meet ${other === "campaign" ? "Dev" : "Priya"}` : "Next"} <ChevronRight size={20} />
          </Link>
          <div className="pointer-events-none absolute -bottom-7 left-1/2 hand">
            <Hand />
          </div>
          <span className="mono absolute -top-5 right-1 text-[11px] text-t3">
            {i} / {steps.length}
          </span>
        </div>
      </div>
      <div className="fixed inset-x-0 bottom-0 z-40 h-1.5 bg-black/40">
        <div className="h-full bg-prime transition-all duration-300" style={{ width: `${(i / steps.length) * 100}%` }} />
      </div>
    </>
  );
}

function Hand() {
  return (
    <svg width="40" height="48" viewBox="0 0 44 52" fill="none" aria-hidden>
      <path d="M16 46 L16 20 a4 4 0 0 1 8 0 L24 30 L24 10 a4 4 0 0 1 8 0 L32 30 L32 14 a4 4 0 0 1 8 0 L40 36 c0 8 -6 14 -14 14 h-4 c-6 0 -10 -3 -13 -8 L4 30 a4 4 0 0 1 7 -4 L16 32 Z" fill="#FFD9B8" stroke="#1a1a1a" strokeWidth="2.5" strokeLinejoin="round" />
    </svg>
  );
}
