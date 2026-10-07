"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import PersonaStrip from "@/components/PersonaStrip";
import Poster from "@/components/Poster";
import { Ring, StatusPill } from "@/components/status";
import { CELLS, DELIVERABLES, TITLES, daysToLaunch, fmtDate, marketByCode, personaById, readiness, titleById, type Title } from "@/lib/data";

const MINE = ["terminal", "rings", "greatest"]; // Priya's titles

export default function PriyaMonday() {
  const p = personaById.production;
  const hero = titleById.terminal;
  const r = readiness(hero.id);
  const mine = MINE.map((id) => titleById[id]);
  const arrived = CELLS.filter((c) => MINE.includes(c.title) && (c.status === "received" || c.status === "in_review") && !(c.checks ?? []).some((k) => k.status === "fail"));
  const late = CELLS.filter((c) => MINE.includes(c.title) && c.status === "late");

  return (
    <>
      <PersonaStrip persona={p} />
      <section className="relative overflow-hidden border-b border-line">
        <div className="absolute inset-0 scale-110 bg-cover bg-center opacity-25 blur-3xl" style={{ backgroundImage: `url(${hero.poster})` }} aria-hidden />
        <div className="absolute inset-0 bg-gradient-to-r from-app via-app/85 to-app/40" aria-hidden />
        <div className="relative flex gap-8 px-8 py-8">
          <Poster t={hero} w={160} rounded={8} className="shadow-[0_12px_40px_rgba(0,0,0,0.6)]" />
          <div className="min-w-0 flex-1 pt-1">
            <p className="text-[12px] text-t3">Monday, {fmtDate("2026-10-07")}. {p.first}&rsquo;s launch that needs her.</p>
            <h1 className="mt-2 text-[26px] font-semibold leading-9 tracking-tight">
              {hero.name} launches in {hero.markets.length} markets in {daysToLaunch(hero)} days.{" "}
              <span className={r.blockers.length ? "text-warn" : "text-ok"}>{r.blockers.length ? "Not ready." : "Ready."}</span>{" "}
              {r.blockers.length ? `${r.blockers.length} things are blocking it.` : "Every deliverable is approved."}
            </h1>
            <ul className="mt-4 max-w-[760px] divide-y divide-line rounded-[8px] border border-line bg-panel/80 backdrop-blur">
              {r.blockers.map((c) => (
                <li key={`${c.market}-${c.deliverable}`} className="flex items-start gap-3 px-3 py-2.5">
                  <StatusPill status={c.status} small />
                  <span className="min-w-0 flex-1">
                    <span className="block text-[13px]">
                      {marketByCode[c.market].name}, {DELIVERABLES.find((d) => d.id === c.deliverable)!.label.toLowerCase()}, {c.owner}
                    </span>
                    <span className="block text-[12px] leading-4 text-t2">{c.note}</span>
                  </span>
                  <Link href={`/production/launch?title=${c.title}&cell=${c.market}:${c.deliverable}`} className="mono shrink-0 text-[11px] text-t3 hover:text-t1">
                    due {fmtDate(c.due)}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-3 flex gap-5 text-[12.5px]">
              <Link href="/production/update?kind=chase" className="inline-flex items-center gap-1 text-t2 hover:text-t1">
                Chase Nordlicht, drafted <ArrowRight size={13} />
              </Link>
              <Link href="/production/update?kind=status" className="inline-flex items-center gap-1 text-t2 hover:text-t1">
                10am production status, drafted <ArrowRight size={13} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-[1fr_1fr] gap-8 px-8 py-6">
        <div>
          <h2 className="text-[13px] font-medium text-t2">Arrived since Friday, in review</h2>
          <ul className="mt-3 divide-y divide-line rounded-[8px] border border-line bg-panel">
            {arrived.slice(0, 6).map((c) => (
              <li key={`${c.title}-${c.market}-${c.deliverable}`} className="flex items-center gap-3 px-3 py-2.5">
                <Poster t={titleById[c.title]} w={26} rounded={3} />
                <span className="min-w-0 flex-1">
                  <span className="block text-[13px]">
                    {marketByCode[c.market].name}, {DELIVERABLES.find((d) => d.id === c.deliverable)!.label.toLowerCase()}
                  </span>
                  <span className="block text-[12px] text-t2">{c.note ?? `${c.owner}. Checks passed on receipt.`}</span>
                </span>
                <StatusPill status={c.status} small />
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="text-[13px] font-medium text-t2">Late at vendors</h2>
          <ul className="mt-3 divide-y divide-line rounded-[8px] border border-line bg-panel">
            {late.map((c) => (
              <li key={`${c.title}-${c.market}-${c.deliverable}`} className="flex items-center gap-3 px-3 py-2.5">
                <Poster t={titleById[c.title]} w={26} rounded={3} />
                <span className="min-w-0 flex-1">
                  <span className="block text-[13px]">
                    {marketByCode[c.market].name}, {DELIVERABLES.find((d) => d.id === c.deliverable)!.label.toLowerCase()}, {c.owner}
                  </span>
                  <span className="block text-[12px] text-t2">{c.note}</span>
                </span>
                <span className="mono shrink-0 text-[11px] text-warn">was due {fmtDate(c.due)}</span>
              </li>
            ))}
            {late.length === 0 && <li className="px-3 py-3 text-[12.5px] text-t2">Nothing late.</li>}
          </ul>
          <h2 className="mt-6 text-[13px] font-medium text-t2">{p.first}&rsquo;s titles</h2>
          <div className="mt-3 flex gap-4">
            {mine.map((t) => (
              <SlateTile key={t.id} t={t} />
            ))}
          </div>
        </div>
      </section>
      <p className="px-8 pb-8 text-[11.5px] text-t3">
        Other titles on the slate ({TITLES.filter((t) => !MINE.includes(t.id)).length}) belong to other production managers. Switch person at the top to see Dev&rsquo;s campaign desk.
      </p>
    </>
  );
}

function SlateTile({ t }: { t: Title }) {
  const r = readiness(t.id);
  return (
    <Link href={`/production/launch?title=${t.id}`} className="group w-[116px] shrink-0">
      <div className="relative">
        <Poster t={t} w={116} rounded={6} className="transition-opacity group-hover:opacity-90" />
        <span className="absolute bottom-1.5 right-1.5 rounded-[6px] bg-black/60 p-0.5 backdrop-blur">
          <Ring pct={r.pct} size={30} stroke={3} tone={r.blockers.length ? "var(--warn)" : undefined} />
        </span>
      </div>
      <p className="mt-2 truncate text-[12.5px] font-medium">{t.name}</p>
      <p className="text-[11.5px] text-t2">
        {fmtDate(t.launch)}, {daysToLaunch(t)}d, {t.markets.length} mkts
      </p>
    </Link>
  );
}
