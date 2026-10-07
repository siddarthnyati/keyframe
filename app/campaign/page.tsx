"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight } from "lucide-react";
import PersonaStrip from "@/components/PersonaStrip";
import Poster from "@/components/Poster";
import { PriorityTag } from "@/components/status";
import WorldMap, { type MarketTone } from "@/components/WorldMap";
import { BRIEFS, MARKETS, PLACEMENTS, TICKETS, daysToLaunch, fmtDate, marketByCode, marketState, personaById, readiness, titleById } from "@/lib/data";

export default function DevMonday() {
  const p = personaById.campaign;
  const hero = titleById.terminal;
  const r = readiness(hero.id);
  const newTickets = TICKETS.filter((t) => t.status === "New");
  const open = TICKETS.filter((t) => t.status !== "Done").length;
  const brief = BRIEFS.find((b) => b.title === hero.id)!;
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
      <PersonaStrip persona={p} />
      <section className="border-b border-line px-8 py-7">
        <p className="text-[12px] text-t3">Monday, {fmtDate("2026-10-07")}. {p.first}&rsquo;s campaign.</p>
        <h1 className="mt-2 max-w-[900px] text-[24px] font-semibold leading-8 tracking-tight">
          {hero.name}: {placements.length} placements booked across {new Set(placements.map((x) => x.market)).size} markets, {daysToLaunch(hero)} days out.{" "}
          <span className="text-warn">{waiting.length} are waiting on production.</span> {newTickets.length} new requests, brief {brief.status.toLowerCase()}.
        </h1>
        <div className="mt-3 flex gap-5 text-[12.5px]">
          <Link href="/campaign/requests" className="inline-flex items-center gap-1 text-t2 hover:text-t1">
            Triage the {open} open requests <ArrowRight size={13} />
          </Link>
          <Link href="/campaign/status" className="inline-flex items-center gap-1 text-t2 hover:text-t1">
            Monday status, drafted <ArrowRight size={13} />
          </Link>
        </div>
      </section>

      <section className="grid grid-cols-[1fr_380px] gap-8 px-8 py-6">
        <div>
          <div className="flex items-baseline justify-between">
            <h2 className="text-[13px] font-medium text-t2">Where the campaign runs this week</h2>
            <p className="text-[11.5px] text-t3">Red: a placement waiting on production. Green: live. Blue: booked. Click a market.</p>
          </div>
          <div className="mt-3 rounded-[8px] border border-line bg-panel p-2">
            <WorldMap tones={tones} selected={sel} onSelect={setSel} />
          </div>
        </div>
        <div>
          <h2 className="text-[13px] font-medium text-t2">{sel ? marketByCode[sel].name : "Pick a market"}</h2>
          <ul className="mt-3 divide-y divide-line rounded-[8px] border border-line bg-panel">
            {here.map((x) => (
              <li key={`${x.title}-${x.channel}`} className="flex items-center gap-3 px-3 py-2.5">
                <Poster t={titleById[x.title]} w={26} rounded={3} />
                <span className="min-w-0 flex-1">
                  <span className="block text-[13px]">{x.channel}</span>
                  <span className="block text-[12px] text-t2">
                    {titleById[x.title].name}, {x.window}
                  </span>
                </span>
                <span className={`text-[11.5px] ${x.status === "Pending art" ? "text-warn" : x.status === "Live" ? "text-ok" : "text-t2"}`}>{x.status}</span>
              </li>
            ))}
            {here.length === 0 && <li className="px-3 py-3 text-[12.5px] text-t2">No placements here.</li>}
          </ul>
          {sel && waiting.some((x) => x.market === sel) && (
            <p className="mt-2 text-[12px] leading-4 text-t3">
              Waiting on production means Priya&rsquo;s board has this market blocked. The {r.blockers.length} blockers are the same ones on her desk.
            </p>
          )}
        </div>
      </section>

      <section className="grid grid-cols-[1fr_380px] gap-8 px-8 pb-8">
        <div>
          <h2 className="text-[13px] font-medium text-t2">New in the queue since Friday</h2>
          <ul className="mt-3 divide-y divide-line rounded-[8px] border border-line bg-panel">
            {newTickets.map((t) => (
              <li key={t.id} className="flex items-center gap-3 px-3 py-2.5">
                {t.title ? <Poster t={titleById[t.title]} w={26} rounded={3} /> : <span className="w-[26px]" />}
                <PriorityTag p={t.priority} />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[13px]">{t.subject}</span>
                  <span className="block text-[12px] text-t2">
                    {t.from}. Suggested owner {t.suggested.owner}.
                  </span>
                </span>
                <span className="mono shrink-0 text-[11px] text-t3">due {fmtDate(t.due)}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="text-[13px] font-medium text-t2">Briefs on {p.first}&rsquo;s desk</h2>
          <ul className="mt-3 divide-y divide-line rounded-[8px] border border-line bg-panel">
            {BRIEFS.slice(0, 4).map((b) => (
              <li key={b.title} className="flex items-center gap-3 px-3 py-2.5">
                <Poster t={titleById[b.title]} w={26} rounded={3} />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[13px]">{titleById[b.title].name}</span>
                  <span className="block text-[12px] text-t2">
                    {b.status}, due {fmtDate(b.due)}
                  </span>
                </span>
              </li>
            ))}
          </ul>
          <Link href="/campaign/brief" className="mt-2 inline-flex items-center gap-1 text-[12.5px] text-t2 hover:text-t1">
            Write the brief <ArrowRight size={13} />
          </Link>
        </div>
      </section>
    </>
  );
}
