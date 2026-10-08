"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight, Play } from "lucide-react";
import Bubble from "@/components/Bubble";
import Carousel from "@/components/Carousel";
import Globe from "@/components/Globe";
import Poster from "@/components/Poster";
import type { MarketTone } from "@/components/WorldMap";
import { MARKETS, PLACEMENTS, daysToLaunch, fmtDate, marketByCode, marketState, personaById, titleById } from "@/lib/data";

const TONE = { warn: "bg-warn", err: "bg-err", accent: "bg-prime", ok: "bg-ok" };

export default function DevMonday() {
  const p = personaById.campaign;
  const hero = titleById.terminal;
  const placements = PLACEMENTS.filter((x) => x.title === hero.id);
  const waiting = placements.filter((x) => x.status === "Pending art");
  const [sel, setSel] = useState<string | null>("DE");

  const tones = useMemo(() => {
    const out: Record<string, MarketTone> = {};
    for (const m of MARKETS) {
      const here = PLACEMENTS.filter((x) => x.market === m.code);
      if (here.length === 0) {
        out[m.code] = "none";
        continue;
      }
      if (here.some((x) => x.title === hero.id && x.status === "Pending art")) out[m.code] = "blocked";
      else if (here.some((x) => x.status === "Live")) out[m.code] = "live";
      else if (here.some((x) => x.title === hero.id)) out[m.code] = marketState(hero.id, m.code) === "ready" ? "ready" : "in_progress";
      else out[m.code] = "planned";
    }
    return out;
  }, [hero.id]);
  const here = sel ? PLACEMENTS.filter((x) => x.market === sel) : [];

  return (
    <>
      <section className="relative overflow-hidden border-b border-line">
        <div className="absolute inset-0 scale-110 bg-cover bg-center opacity-25 blur-3xl" style={{ backgroundImage: `url(${hero.poster})` }} aria-hidden />
        <div className="absolute inset-0 bg-gradient-to-r from-app via-app/85 to-app/40" aria-hidden />
        <div className="relative flex items-end justify-between gap-8 px-8 pb-6 pt-6">
          <div>
            <Bubble persona={p} text={p.thought} />
            <p className="mt-6 text-[12px] text-t3">Monday, {fmtDate("2026-10-07")}</p>
            <h1 className="mt-1 text-[28px] font-semibold leading-9 tracking-tight">
              {hero.name} campaign: {placements.length} placements, {daysToLaunch(hero)} days out. <span className="text-warn">{waiting.length} waiting on production.</span>
            </h1>
          </div>
          <Link href="/campaign?story=1" className="inline-flex h-9 shrink-0 items-center gap-2 rounded-full bg-prime px-3.5 text-[12.5px] font-semibold text-white hover:brightness-110">
            <Play size={12} fill="currentColor" /> Follow my morning
          </Link>
        </div>
      </section>

      <section className="grid grid-cols-[1fr_1fr] gap-8 px-8 py-6">
        <div data-story="todo">
          <h2 className="text-[11px] font-medium uppercase tracking-[0.1em] text-t3">To do today</h2>
          <ol className="mt-3 space-y-3">
            {p.todo.map((t, i) => (
              <li key={t.text} className="flex items-center gap-4 rounded-[12px] border border-line bg-panel p-4">
                <span className={`inline-flex size-9 shrink-0 items-center justify-center rounded-full text-[14px] font-semibold text-app ${TONE[t.tone]}`}>{i + 1}</span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[14px] font-medium">{t.text}</span>
                  <span className="block text-[12.5px] leading-4 text-t2">{t.why}</span>
                </span>
                <Link href={t.href} data-story={`todo-${i}`} className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full bg-t1 px-3.5 text-[12.5px] font-medium text-app hover:bg-white">
                  {t.cta} <ArrowRight size={13} />
                </Link>
              </li>
            ))}
          </ol>
        </div>
        <div id="globe" data-story="globe">
          <div className="flex items-baseline justify-between">
            <h2 className="text-[11px] font-medium uppercase tracking-[0.1em] text-t3">Where it runs this week</h2>
            <p className="text-[11px] text-t3">Drag to spin. Red is waiting on production.</p>
          </div>
          <div className="mt-3 flex gap-4 rounded-[16px] border border-line bg-panel p-3">
            <Globe tones={tones} selected={sel} onSelect={setSel} />
            <div className="min-w-0 flex-1 py-2">
              <p className="text-[14px] font-semibold">{sel ? marketByCode[sel].name : "Pick a market"}</p>
              <ul className="mt-2 space-y-2">
                {here.map((x) => (
                  <li key={`${x.title}-${x.channel}`} className="flex items-center gap-2.5">
                    <Poster t={titleById[x.title]} w={24} rounded={3} />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[12.5px]">{x.channel}</span>
                      <span className="block truncate text-[11px] text-t3">
                        {titleById[x.title].name}, {x.window}
                      </span>
                    </span>
                    <span className={`shrink-0 text-[11px] font-medium ${x.status === "Pending art" ? "text-warn" : x.status === "Live" ? "text-ok" : "text-t2"}`}>{x.status}</span>
                  </li>
                ))}
                {here.length === 0 && <li className="text-[12px] text-t3">Nothing booked here.</li>}
              </ul>
              <ul className="mt-4 space-y-1 text-[11px] text-t3">
                <li className="flex items-center gap-1.5">
                  <span className="inline-block size-2 rounded-full bg-ok" /> Live
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="inline-block size-2 rounded-full bg-prime" /> Booked
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="inline-block size-2 rounded-full bg-err" /> Waiting on production
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <Carousel />
    </>
  );
}
