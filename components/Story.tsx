"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useLayoutEffect, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { Persona } from "@/lib/data";

export type StoryStep = { href: string; target: string; bubble: string; lesson: string; before: string };

export const STORIES: Record<Persona["id"], StoryStep[]> = {
  production: [
    { href: "/production", target: "todo", bubble: "Three things in my way and the 10am update. That is my Monday.", lesson: "Start with what needs her, not with a dashboard.", before: "Before: four trackers and a vendor thread." },
    { href: "/production", target: "todo-0", bubble: "Nordlicht slipped the German dub again. I want that date in writing.", lesson: "The late file names its owner and what to do next.", before: "Before: a cell that said 'in progress'." },
    { href: "/production/update?kind=chase", target: "send", bubble: "Already written from the board. Launch date, fallback, spec. I tweak one line and send.", lesson: "Drafted, never sent for her.", before: "Before: twenty minutes from memory." },
    { href: "/production/launch?title=terminal&cell=JP:keyart", target: "cell-JP:keyart", bubble: "Japan bounced. No 2:3 poster. Halftone has the files, so it is a size, not new art.", lesson: "The spec check ran the day the file arrived.", before: "Before: the rejection email a week later, after the vendor billed." },
    { href: "/production/update?kind=status", target: "send", bubble: "10am. The status reads off the same board. I read it once and send.", lesson: "One board, every email.", before: "Before: an hour every Monday turning the tracker into prose." },
  ],
  campaign: [
    { href: "/campaign", target: "todo", bubble: "Nine placements booked, three waiting on production. Two tickets since Friday.", lesson: "Start with the campaign, not the tool.", before: "Before: the ticket tool, the tracker, and a Slack search." },
    { href: "/campaign", target: "globe", bubble: "Where are we live this week? Carrie in the US and UK. Terminal List booked everywhere except the three red ones.", lesson: "Show it, don't list it.", before: "Before: someone builds a slide for the regional lead." },
    { href: "/campaign/requests", target: "row-REQ-2418", bubble: "Japan bounced. It already knows who should fix it and why. I confirm.", lesson: "A request is read once and routed, not re-typed.", before: "Before: copy the ticket into the tracker, guess the owner." },
    { href: "/campaign/brief", target: "coverage", bubble: "Fans are rewatching season 1 before launch. That goes in the CRM as a catch-up CTA.", lesson: "The brief sits next to the evidence.", before: "Before: the listening report in a different tool." },
    { href: "/campaign/status", target: "send", bubble: "Status to my lead, drafted from the board, the queue and the brief. Send.", lesson: "Nothing sends itself.", before: "Before: Monday afternoon, gone." },
  ],
};

export default function Story({ persona, step }: { persona: Persona; step: number }) {
  const steps = STORIES[persona.id];
  const i = Math.min(Math.max(step, 1), steps.length);
  const s = steps[i - 1];
  const router = useRouter();
  const [rect, setRect] = useState<DOMRect | null>(null);
  const join = (href: string, n: number) => `${href}${href.includes("?") ? "&" : "?"}story=${n}`;
  const prevHref = i > 1 ? join(steps[i - 2].href, i - 1) : null;
  const nextHref = i < steps.length ? join(steps[i].href, i + 1) : "/";

  useLayoutEffect(() => {
    let tries = 0;
    let raf = 0;
    const find = () => {
      const el = document.querySelector<HTMLElement>(`[data-story="${s.target}"]`);
      if (el) {
        el.scrollIntoView({ block: "center", behavior: "smooth" });
        setRect(el.getBoundingClientRect());
      } else if (tries++ < 40) raf = requestAnimationFrame(find);
    };
    find();
    const onResize = () => {
      const el = document.querySelector<HTMLElement>(`[data-story="${s.target}"]`);
      if (el) setRect(el.getBoundingClientRect());
    };
    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", onResize, true);
    const t = setInterval(onResize, 400);
    return () => {
      cancelAnimationFrame(raf);
      clearInterval(t);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onResize, true);
    };
  }, [s.target, s.href]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") router.push(nextHref);
      if (e.key === "ArrowLeft" && prevHref) router.push(prevHref);
      if (e.key === "Escape") router.push(s.href.split("?")[0]);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [router, nextHref, prevHref, s.href]);

  return (
    <>
      {/* Spotlight */}
      {rect && (
        <div
          className="pointer-events-none fixed z-30 rounded-[10px] ring-2 ring-prime transition-all duration-300"
          style={{ left: rect.left - 6, top: rect.top - 6, width: rect.width + 12, height: rect.height + 12, boxShadow: "0 0 0 9999px rgba(8,10,14,0.55)" }}
        />
      )}
      {/* Pointing hand */}
      {rect && (
        <div className="pointer-events-none fixed z-40 hand" style={{ left: Math.min(rect.left + Math.min(rect.width * 0.5, 180), window.innerWidth - 60), top: rect.top + Math.min(rect.height, 56) - 8 }}>
          <Hand />
        </div>
      )}
      {/* Bubble + avatar */}
      <div className="pointer-events-none fixed bottom-16 left-6 z-40 flex max-w-[520px] items-end gap-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={persona.avatar} alt="" className="size-[88px] shrink-0 rounded-full bg-white shadow-[0_8px_24px_rgba(0,0,0,0.5)]" />
        <div className="pointer-events-auto relative rounded-[14px] bg-white px-4 py-3 text-[14px] leading-5 text-[#111] shadow-[0_8px_24px_rgba(0,0,0,0.5)]">
          <span className="absolute -left-2 bottom-5 size-4 rotate-45 bg-white" />
          <p className="font-medium">{s.bubble}</p>
          <p className="mt-1.5 text-[12px] leading-4 text-[#444]">{s.lesson}</p>
          <p className="mt-0.5 text-[11.5px] leading-4 text-[#888]">{s.before}</p>
        </div>
      </div>
      {/* Progress + controls */}
      <div className="fixed inset-x-0 bottom-0 z-40 h-1 bg-black/40">
        <div className="h-full bg-prime transition-all duration-300" style={{ width: `${(i / steps.length) * 100}%` }} />
      </div>
      <div className="fixed bottom-4 right-5 z-40 flex items-center gap-1 rounded-full bg-panel/95 p-1 shadow-[0_8px_24px_rgba(0,0,0,0.5)] ring-1 ring-line-strong">
        <span className="mono px-2 text-[11px] text-t2">
          {i} / {steps.length}
        </span>
        {prevHref ? (
          <Link href={prevHref} className="inline-flex size-8 items-center justify-center rounded-full text-t2 hover:bg-hover hover:text-t1" aria-label="Back">
            <ChevronLeft size={16} />
          </Link>
        ) : (
          <span className="inline-flex size-8 items-center justify-center text-t3">
            <ChevronLeft size={16} />
          </span>
        )}
        <Link href={nextHref} className="inline-flex h-8 items-center gap-1 rounded-full bg-prime px-3 text-[12.5px] font-medium text-white hover:brightness-110" aria-label="Next">
          {i < steps.length ? "Next" : "Done"} <ChevronRight size={14} />
        </Link>
        <Link href={s.href.split("?")[0]} className="inline-flex size-8 items-center justify-center rounded-full text-t3 hover:bg-hover hover:text-t1" aria-label="Exit story">
          <X size={14} />
        </Link>
      </div>
      <p className="pointer-events-none fixed bottom-5 left-1/2 z-40 -translate-x-1/2 text-[11px] text-t3">Use the arrow keys</p>
    </>
  );
}

function Hand() {
  return (
    <svg width="44" height="52" viewBox="0 0 44 52" fill="none" aria-hidden>
      <path d="M16 46 L16 20 a4 4 0 0 1 8 0 L24 30 L24 10 a4 4 0 0 1 8 0 L32 30 L32 14 a4 4 0 0 1 8 0 L40 36 c0 8 -6 14 -14 14 h-4 c-6 0 -10 -3 -13 -8 L4 30 a4 4 0 0 1 7 -4 L16 32 Z" fill="#FFD9B8" stroke="#1a1a1a" strokeWidth="2.5" strokeLinejoin="round" />
    </svg>
  );
}
