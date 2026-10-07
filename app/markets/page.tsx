"use client";

import { useMemo, useState } from "react";
import { PageIntro } from "@/components/Shell";
import { StatusPill } from "@/components/status";
import { Panel, PanelHeader, Section, Segmented } from "@/components/ui";
import WorldMap, { type MarketTone } from "@/components/WorldMap";
import { CELLS, DELIVERABLES, MARKETS, TITLES, daysToLaunch, fmtDate, marketByCode, marketState, titleById } from "@/lib/data";

type View = "all" | string;

export default function Markets() {
  const [view, setView] = useState<View>("all");
  const [sel, setSel] = useState<string | null>("DE");

  // Tone per market: worst state across the titles in view.
  const tones = useMemo(() => {
    const out: Record<string, MarketTone> = {};
    for (const m of MARKETS) {
      const titles = TITLES.filter((t) => (view === "all" ? true : t.id === view) && t.markets.includes(m.code));
      if (titles.length === 0) {
        out[m.code] = "none";
        continue;
      }
      const states = titles.map((t) => marketState(t.id, m.code));
      out[m.code] = states.includes("blocked") ? "blocked" : states.includes("in_progress") ? "in_progress" : states.includes("ready") ? "ready" : states.includes("live") ? "live" : "planned";
    }
    return out;
  }, [view]);

  const counts = useMemo(() => {
    const c = { blocked: 0, in_progress: 0, ready: 0, live: 0, planned: 0 };
    for (const v of Object.values(tones)) if (v !== "none") c[v]++;
    return c;
  }, [tones]);

  const m = sel ? marketByCode[sel] : null;
  const titlesHere = m ? TITLES.filter((t) => (view === "all" ? true : t.id === view) && t.markets.includes(m.code)) : [];

  return (
    <div className="flex h-full min-h-0 flex-col">
      <PageIntro
        title="Markets"
        right={
          <Segmented<View>
            value={view}
            onChange={setView}
            options={[{ id: "all", label: "All titles" }, ...TITLES.filter((t) => t.stage !== "live").slice(0, 3).map((t) => ({ id: t.id, label: t.name }))]}
          />
        }
      >
        Where campaigns are live, launching, or stuck, by market. Red means something in that market is blocking a launch. Click a market for the titles running there and what
        each one still owes. This is the view a regional lead asks for in every weekly, and today it is assembled by hand from several trackers.
      </PageIntro>
      <div className="flex min-h-0 flex-1">
        <div className="scroll-thin min-w-0 flex-1 overflow-y-auto p-6">
          <div className="rounded-[8px] border border-line bg-panel p-2">
            <WorldMap tones={tones} selected={sel} onSelect={setSel} />
          </div>
          <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-[12px] text-t2">
            <li className="flex items-center gap-1.5">
              <span className="inline-block size-2 rounded-full bg-err" /> Blocked, {counts.blocked}
            </li>
            <li className="flex items-center gap-1.5">
              <span className="inline-block size-2 rounded-full bg-accent" /> In progress, {counts.in_progress}
            </li>
            <li className="flex items-center gap-1.5">
              <span className="inline-block size-2 rounded-full bg-ok" /> Ready or live, {counts.ready + counts.live}
            </li>
            <li className="flex items-center gap-1.5">
              <span className="inline-block size-2 rounded-full bg-t3" /> Planned, {counts.planned}
            </li>
          </ul>
        </div>
        <Panel side="right" width={360}>
          <PanelHeader title={m ? m.name : "Market"} right={m ? <span className="mono text-[11px] text-t3">{m.locale}</span> : undefined} />
          {m && (
            <div className="scroll-thin min-h-0 flex-1 overflow-y-auto">
              {titlesHere.length === 0 && <p className="p-3 text-[12.5px] text-t2">No campaigns in {m.name} for this view.</p>}
              {titlesHere.map((t) => {
                const cells = CELLS.filter((c) => c.title === t.id && c.market === m.code);
                const state = marketState(t.id, m.code);
                const owed = cells.filter((c) => c.status !== "approved");
                return (
                  <Section
                    key={t.id}
                    title={t.name}
                    right={
                      <span className="text-[11px] text-t3">
                        {t.stage === "live" ? `live since ${fmtDate(t.launch)}` : `${fmtDate(t.launch)}, ${daysToLaunch(t)}d`}
                      </span>
                    }
                  >
                    <p className="text-[12.5px] text-t2">
                      {state === "live" ? "Campaign live." : state === "ready" ? "Every deliverable approved." : state === "blocked" ? "Blocked." : state === "planned" ? "Nothing due yet." : `${owed.length} still owed.`}
                    </p>
                    {owed.length > 0 && (
                      <ul className="mt-2 space-y-1.5">
                        {owed.map((c) => (
                          <li key={c.deliverable} className="flex items-center justify-between gap-2 text-[12px]">
                            <span className="text-t1">{DELIVERABLES.find((d) => d.id === c.deliverable)!.label}</span>
                            <span className="flex items-center gap-2">
                              <span className="mono text-[11px] text-t3">{fmtDate(c.due)}</span>
                              <StatusPill status={c.status} small />
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </Section>
                );
              })}
              <Section title="Live in this market">
                <p className="text-[12.5px] text-t2">
                  {TITLES.filter((t) => t.stage === "live" && t.markets.includes(m.code)).map((t) => titleById[t.id].name).join(", ") || "Nothing live."}
                </p>
              </Section>
            </div>
          )}
        </Panel>
      </div>
    </div>
  );
}
