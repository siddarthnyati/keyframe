"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Poster from "@/components/Poster";
import { Ring, StatusPill } from "@/components/status";
import { DELIVERABLES, TICKETS, TITLES, daysToLaunch, fmtDate, marketByCode, readiness, type Title } from "@/lib/data";

export default function Today() {
  const launching = TITLES.filter((t) => t.stage === "launching").sort((a, b) => a.launch.localeCompare(b.launch));
  const hero = launching.find((t) => readiness(t.id).blockers.length > 0) ?? launching[0];
  const r = readiness(hero.id);
  const newTickets = TICKETS.filter((t) => t.status === "New");
  const live = TITLES.filter((t) => t.stage === "live");
  const upcoming = TITLES.filter((t) => t.stage !== "live").sort((a, b) => a.launch.localeCompare(b.launch));

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-line">
        <div className="absolute inset-0 scale-110 bg-cover bg-center opacity-25 blur-3xl" style={{ backgroundImage: `url(${hero.poster})` }} aria-hidden />
        <div className="absolute inset-0 bg-gradient-to-r from-app via-app/85 to-app/40" aria-hidden />
        <div className="relative flex gap-8 px-8 py-8">
          <Poster t={hero} w={168} rounded={8} className="shadow-[0_12px_40px_rgba(0,0,0,0.6)]" />
          <div className="min-w-0 flex-1 pt-1">
            <p className="text-[12px] text-t3">Monday, {fmtDate("2026-10-07")}. Next launch that needs you.</p>
            <h1 className="mt-2 text-[26px] font-semibold leading-9 tracking-tight">
              {hero.name} launches in {hero.markets.length} markets in {daysToLaunch(hero)} days.{" "}
              <span className={r.blockers.length ? "text-warn" : "text-ok"}>{r.blockers.length ? "Not ready." : "Ready."}</span>{" "}
              {r.blockers.length ? `${r.blockers.length} thing${r.blockers.length > 1 ? "s are" : " is"} blocking it.` : "Every deliverable is approved."}
            </h1>
            <ul className="mt-4 max-w-[760px] divide-y divide-line rounded-[8px] border border-line bg-panel/80 backdrop-blur">
              {r.blockers.map((c) => (
                <li key={`${c.market}-${c.deliverable}`} className="flex items-start gap-3 px-3 py-2.5">
                  <StatusPill status={c.status} small />
                  <span className="min-w-0 flex-1">
                    <span className="block text-[13px]">
                      {marketByCode[c.market].name}, {DELIVERABLES.find((d) => d.id === c.deliverable)!.label.toLowerCase()}
                    </span>
                    <span className="block text-[12px] leading-4 text-t2">{c.note}</span>
                  </span>
                  <span className="mono shrink-0 text-[11px] text-t3">due {fmtDate(c.due)}</span>
                </li>
              ))}
            </ul>
            <div className="mt-3 flex gap-5 text-[12.5px]">
              <Link href={`/launches?title=${hero.id}`} className="inline-flex items-center gap-1 text-t2 hover:text-t1">
                Launch board <ArrowRight size={13} />
              </Link>
              <Link href="/updates" className="inline-flex items-center gap-1 text-t2 hover:text-t1">
                Monday status, drafted <ArrowRight size={13} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Slate */}
      <section className="px-8 pt-6">
        <div className="flex items-baseline justify-between">
          <h2 className="text-[13px] font-medium text-t2">Launching next</h2>
          <p className="text-[11.5px] text-t3">Ring is approved deliverables over total. Amber means something is blocking.</p>
        </div>
        <div className="scroll-thin mt-3 flex gap-4 overflow-x-auto pb-2">
          {upcoming.map((t) => (
            <SlateTile key={t.id} t={t} />
          ))}
        </div>
      </section>

      <section className="grid grid-cols-[1fr_380px] gap-8 px-8 py-6">
        <div>
          <h2 className="text-[13px] font-medium text-t2">New requests since Friday</h2>
          <ul className="mt-3 divide-y divide-line rounded-[8px] border border-line bg-panel">
            {newTickets.map((t) => {
              const title = TITLES.find((x) => x.id === t.title);
              return (
                <li key={t.id} className="flex items-center gap-3 px-3 py-2.5">
                  {title ? <Poster t={title} w={28} rounded={3} /> : <span className="w-7" />}
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[13px]">{t.subject}</span>
                    <span className="block text-[12px] text-t2">
                      {t.from}. Suggested owner {t.suggested.owner}.
                    </span>
                  </span>
                  <span className="mono shrink-0 text-[11px] text-t3">due {fmtDate(t.due)}</span>
                </li>
              );
            })}
          </ul>
          <Link href="/requests" className="mt-2 inline-flex items-center gap-1 text-[12.5px] text-t2 hover:text-t1">
            All requests <ArrowRight size={13} />
          </Link>
        </div>
        <div>
          <h2 className="text-[13px] font-medium text-t2">Live now</h2>
          <ul className="mt-3 space-y-2">
            {live.map((t) => (
              <li key={t.id} className="flex items-center gap-3">
                <Poster t={t} w={40} rounded={4} />
                <span className="min-w-0">
                  <span className="block text-[13px]">{t.name}</span>
                  <span className="block text-[12px] text-t2">
                    Since {fmtDate(t.launch)}, {t.markets.length} markets
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}

function SlateTile({ t }: { t: Title }) {
  const r = readiness(t.id);
  const dtl = daysToLaunch(t);
  return (
    <Link href={`/launches?title=${t.id}`} className="group w-[132px] shrink-0">
      <div className="relative">
        <Poster t={t} w={132} rounded={6} className="transition-opacity group-hover:opacity-90" />
        <span className="absolute bottom-1.5 right-1.5 rounded-[6px] bg-black/60 p-0.5 backdrop-blur">
          <Ring pct={r.pct} size={30} stroke={3} tone={r.blockers.length ? "var(--warn)" : undefined} />
        </span>
      </div>
      <p className="mt-2 truncate text-[12.5px] font-medium">{t.name}</p>
      <p className="text-[11.5px] text-t2">
        {fmtDate(t.launch)}, {dtl}d, {t.markets.length} mkts
      </p>
    </Link>
  );
}
