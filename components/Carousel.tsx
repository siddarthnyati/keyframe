"use client";

import Poster from "@/components/Poster";
import { Ring } from "@/components/status";
import { PLACEMENTS, SIGNALS, TICKETS, TITLES, daysToLaunch, fmtDate, readiness } from "@/lib/data";

/** One card per title on the slate: poster, days out, blockers, placements, open requests, this week's headline. */
export default function Carousel({ only }: { only?: string[] }) {
  const titles = only ? TITLES.filter((t) => only.includes(t.id)) : TITLES;
  return (
    <section className="px-8 pb-8">
      <div className="flex items-baseline justify-between">
        <h2 className="text-[11px] font-medium uppercase tracking-[0.1em] text-t3">How things are doing</h2>
        <p className="text-[11px] text-t3">Scroll sideways. One card per title.</p>
      </div>
      <div className="scroll-thin mt-3 flex snap-x gap-4 overflow-x-auto pb-3">
        {titles.map((t) => {
          const r = readiness(t.id);
          const s = SIGNALS[t.id];
          const open = TICKETS.filter((x) => x.title === t.id && x.status !== "Done").length;
          const booked = PLACEMENTS.filter((x) => x.title === t.id).length;
          return (
            <div key={t.id} className="relative w-[300px] shrink-0 snap-start overflow-hidden rounded-[16px] border border-line bg-panel">
              <div className="absolute inset-0 bg-cover bg-center opacity-20 blur-2xl" style={{ backgroundImage: `url(${t.poster})` }} aria-hidden />
              <div className="relative flex gap-3 p-4">
                <Poster t={t} w={64} rounded={5} />
                <div className="min-w-0">
                  <p className="truncate text-[13.5px] font-semibold">{t.name}</p>
                  <p className="text-[11.5px] text-t2">{t.stage === "live" ? `Live since ${fmtDate(t.launch)}` : `${fmtDate(t.launch)}, ${daysToLaunch(t)} days`}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <Ring pct={r.pct} size={26} stroke={3} tone={r.blockers.length ? "var(--warn)" : undefined} />
                    <span className="text-[11.5px] text-t2">
                      {r.blockers.length ? `${r.blockers.length} blocking` : t.stage === "live" ? "delivered" : "on track"} · {booked} placements · {open} open
                    </span>
                  </div>
                </div>
              </div>
              <p className="relative line-clamp-2 px-4 pb-4 text-[12px] leading-4 text-t2">{s ? s.headline : "No coverage gathered yet."}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
