"use client";

import Link from "next/link";
import { ArrowRight, Play } from "lucide-react";
import Bubble from "@/components/Bubble";
import Poster from "@/components/Poster";
import { Ring, StatusPill } from "@/components/status";
import { CELLS, DELIVERABLES, daysToLaunch, fmtDate, marketByCode, personaById, readiness, titleById, type Title } from "@/lib/data";

const MINE = ["terminal", "rings", "greatest"];
const TONE = { warn: "bg-warn", err: "bg-err", accent: "bg-prime", ok: "bg-ok" };

export default function PriyaMonday() {
  const p = personaById.production;
  const hero = titleById.terminal;
  const r = readiness(hero.id);
  const arrived = CELLS.filter((c) => MINE.includes(c.title) && (c.status === "received" || c.status === "in_review") && !(c.checks ?? []).some((k) => k.status === "fail")).slice(0, 5);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-line">
        <div className="absolute inset-0 scale-110 bg-cover bg-center opacity-30 blur-3xl" style={{ backgroundImage: `url(${hero.poster})` }} aria-hidden />
        <div className="absolute inset-0 bg-gradient-to-r from-app via-app/80 to-app/30" aria-hidden />
        <div className="relative grid grid-cols-[1fr_auto] items-end gap-8 px-8 pb-6 pt-6">
          <div>
            <Bubble persona={p} text={p.thought} />
            <p className="mt-6 text-[12px] text-t3">Monday, {fmtDate("2026-10-07")}</p>
            <h1 className="mt-1 text-[28px] font-semibold leading-9 tracking-tight">
              {hero.name}: {daysToLaunch(hero)} days, {hero.markets.length} markets.{" "}
              <span className={r.blockers.length ? "text-warn" : "text-ok"}>{r.blockers.length ? `${r.blockers.length} things in the way.` : "Ready."}</span>
            </h1>
            <div className="mt-3 flex items-center gap-3 text-[12.5px] text-t2">
              <Ring pct={r.pct} size={30} stroke={3} tone={r.blockers.length ? "var(--warn)" : undefined} />
              {r.approved} of {r.total} files approved. {r.inReview} in review. Every file, every market, on the board.
              <Link href="/production/launch" className="inline-flex items-center gap-1 text-t1 hover:underline">
                Open the board <ArrowRight size={12} />
              </Link>
            </div>
          </div>
          <div className="flex flex-col items-end gap-3">
            <Poster t={hero} w={120} rounded={8} className="shadow-[0_12px_40px_rgba(0,0,0,0.6)]" />
            <Link href="/production?story=1" className="inline-flex h-9 items-center gap-2 rounded-full bg-prime px-3.5 text-[12.5px] font-semibold text-white hover:brightness-110">
              <Play size={12} fill="currentColor" /> Follow my morning
            </Link>
          </div>
        </div>
      </section>

      {/* To do */}
      <section className="grid grid-cols-[1fr_360px] gap-8 px-8 py-6">
        <div data-story="todo">
          <h2 className="text-[11px] font-medium uppercase tracking-[0.1em] text-t3">To do today</h2>
          <ol className="mt-3 space-y-3">
            {p.todo.map((t, i) => (
              <li key={t.text} data-story={`todo-${i}`} className="flex items-center gap-4 rounded-[12px] border border-line bg-panel p-4">
                <span className={`inline-flex size-9 shrink-0 items-center justify-center rounded-full text-[14px] font-semibold text-app ${TONE[t.tone]}`}>{i + 1}</span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[14px] font-medium">{t.text}</span>
                  <span className="block text-[12.5px] leading-4 text-t2">{t.why}</span>
                </span>
                <Link href={t.href} className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full bg-t1 px-3.5 text-[12.5px] font-medium text-app hover:bg-white">
                  {t.cta} <ArrowRight size={13} />
                </Link>
              </li>
            ))}
          </ol>
        </div>
        <div>
          <h2 className="text-[11px] font-medium uppercase tracking-[0.1em] text-t3">Arrived since Friday</h2>
          <ul className="mt-3 divide-y divide-line rounded-[12px] border border-line bg-panel">
            {arrived.map((c) => (
              <li key={`${c.title}-${c.market}-${c.deliverable}`} className="flex items-center gap-3 px-3 py-2.5">
                <Poster t={titleById[c.title]} w={24} rounded={3} />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[12.5px]">
                    {marketByCode[c.market].name}, {DELIVERABLES.find((d) => d.id === c.deliverable)!.label.toLowerCase()}
                  </span>
                  <span className="block truncate text-[11.5px] text-t3">{c.owner}. Checks passed.</span>
                </span>
                <StatusPill status={c.status} small />
              </li>
            ))}
          </ul>
          <h2 className="mt-6 text-[11px] font-medium uppercase tracking-[0.1em] text-t3">My titles</h2>
          <div className="mt-3 flex gap-3">
            {MINE.map((id) => (
              <Tile key={id} t={titleById[id]} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function Tile({ t }: { t: Title }) {
  const r = readiness(t.id);
  return (
    <Link href={`/production/launch?title=${t.id}`} className="group w-[104px]">
      <div className="relative">
        <Poster t={t} w={104} rounded={6} className="transition-opacity group-hover:opacity-90" />
        <span className="absolute bottom-1.5 right-1.5 rounded-[6px] bg-black/60 p-0.5 backdrop-blur">
          <Ring pct={r.pct} size={28} stroke={3} tone={r.blockers.length ? "var(--warn)" : undefined} />
        </span>
      </div>
      <p className="mt-1.5 truncate text-[12px] font-medium">{t.name}</p>
      <p className="text-[11px] text-t3">
        {fmtDate(t.launch)}, {daysToLaunch(t)}d
      </p>
    </Link>
  );
}
