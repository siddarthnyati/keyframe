"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageIntro } from "@/components/Shell";
import { Ring, StatusPill } from "@/components/status";
import { DELIVERABLES, TICKETS, TITLES, daysToLaunch, fmtDate, marketByCode, readiness, type Title } from "@/lib/data";

export default function Today() {
  const launching = TITLES.filter((t) => t.stage === "launching").sort((a, b) => a.launch.localeCompare(b.launch));
  const next = launching[0];
  const r = readiness(next.id);
  const newTickets = TICKETS.filter((t) => t.status === "New");
  const live = TITLES.filter((t) => t.stage === "live");
  const planning = TITLES.filter((t) => t.stage === "planning");

  return (
    <>
      <PageIntro title="Today">
        The page a producer opens on Monday morning. One sentence per launch: ready or not, and what is in the way. Nothing here was typed by hand; it is read off the launch board and the request queue.
      </PageIntro>

      <section className="border-b border-line px-6 py-6">
        <p className="text-[22px] font-semibold leading-8 tracking-tight">
          {next.name} launches in {next.markets.length} markets in {daysToLaunch(next)} days.{" "}
          <span className={r.blockers.length ? "text-warn" : "text-ok"}>{r.blockers.length ? "Not ready." : "Ready."}</span>{" "}
          {r.blockers.length ? `${r.blockers.length} thing${r.blockers.length > 1 ? "s are" : " is"} blocking it.` : "Every deliverable is approved."}
        </p>
        <div className="mt-4 grid grid-cols-[1fr_1fr] gap-6">
          <div>
            <p className="label mb-2">Blocking the launch</p>
            <ul className="divide-y divide-line rounded-[6px] border border-line bg-panel">
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
            <Link href={`/launches?title=${next.id}`} className="mt-2 inline-flex items-center gap-1 text-[12.5px] text-t2 hover:text-t1">
              Open the launch board <ArrowRight size={13} />
            </Link>
          </div>
          <div>
            <p className="label mb-2">New requests since Friday</p>
            <ul className="divide-y divide-line rounded-[6px] border border-line bg-panel">
              {newTickets.map((t) => (
                <li key={t.id} className="flex items-start gap-3 px-3 py-2.5">
                  <span className="mono shrink-0 pt-0.5 text-[11px] text-t3">{t.id}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[13px]">{t.subject}</span>
                    <span className="block text-[12px] leading-4 text-t2">
                      {t.from}. Suggested owner {t.suggested.owner}.
                    </span>
                  </span>
                  <span className="mono shrink-0 text-[11px] text-t3">due {fmtDate(t.due)}</span>
                </li>
              ))}
            </ul>
            <Link href="/requests" className="mt-2 inline-flex items-center gap-1 text-[12.5px] text-t2 hover:text-t1">
              Open the request queue <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </section>

      <section className="px-6 py-6">
        <div className="flex items-baseline justify-between">
          <h2 className="text-[14px] font-semibold">The slate</h2>
          <p className="text-[12px] text-t3">Readiness is approved deliverables over total. Blockers are late, rejected, missing, or failing a spec check.</p>
        </div>
        <div className="mt-3 grid grid-cols-3 gap-3">
          {[...launching, ...planning].map((t) => (
            <TitleCard key={t.id} t={t} />
          ))}
        </div>
        <h2 className="mt-8 text-[14px] font-semibold">Live now</h2>
        <div className="mt-3 grid grid-cols-3 gap-3">
          {live.map((t) => (
            <TitleCard key={t.id} t={t} />
          ))}
        </div>
      </section>
    </>
  );
}

function TitleCard({ t }: { t: Title }) {
  const r = readiness(t.id);
  const dtl = daysToLaunch(t);
  return (
    <Link href={`/launches?title=${t.id}`} className="flex gap-3 rounded-[8px] border border-line bg-panel p-3 transition-colors hover:border-line-strong">
      <span className="aspect-[2/3] w-12 shrink-0 rounded-[4px]" style={{ background: `linear-gradient(160deg, hsl(${t.hue} 45% 38%), hsl(${t.hue} 40% 14%))` }} />
      <span className="min-w-0 flex-1">
        <span className="flex items-baseline justify-between gap-2">
          <span className="truncate text-[13.5px] font-medium">{t.name}</span>
          <span className="mono shrink-0 text-[11px] text-t3">{t.stage === "live" ? `live since ${fmtDate(t.launch)}` : `${fmtDate(t.launch)}, ${dtl}d`}</span>
        </span>
        <span className="block text-[12px] text-t2">
          {t.kind}. {t.markets.length} markets. {t.producer}.
        </span>
        <span className="mt-2 flex items-center gap-2">
          <Ring pct={r.pct} size={30} stroke={3} />
          <span className="text-[12px] text-t2">
            {r.approved} of {r.total} approved
            {r.blockers.length ? <span className="text-warn">, {r.blockers.length} blocking</span> : null}
            {r.inReview ? `, ${r.inReview} in review` : ""}
          </span>
        </span>
      </span>
    </Link>
  );
}
