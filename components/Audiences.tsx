"use client";

import { useEffect, useMemo, useState } from "react";
import { COHORTS, matchScore, simulate, type SimVariant } from "@/lib/sim";
import { ensureFonts, loadImage, renderVariant } from "@/lib/art";
import { fmtTime } from "@/lib/frames";
import { FORMATS, type Frame, type Locale, type Variant } from "@/lib/types";
import { Chip, Empty, Panel, PanelHeader, Row, Section, Toggle } from "./ui";

export type AudiencesProps = { frames: Frame[]; starred: string[]; variants: Variant[]; locale: Locale };

const TONES = ["bg-t1", "bg-accent", "bg-t3"];

export default function Audiences(p: AudiencesProps) {
  const [explore, setExplore] = useState(0.1);
  const [cap, setCap] = useState(true);
  const [day, setDay] = useState(0);
  const [posters, setPosters] = useState<Record<string, string>>({});
  const [cohortId, setCohortId] = useState(COHORTS[0].id);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      await ensureFonts();
      const poster = FORMATS.find((f) => f.id === "poster")!;
      const out: Record<string, string> = {};
      for (const id of p.starred) {
        const frame = p.frames.find((f) => f.id === id);
        if (!frame) continue;
        const img = await loadImage(frame.dataUrl);
        out[id] = renderVariant({ img, format: poster, locale: p.locale, titleOnHero: false, titleScale: 1, scale: 0.4 }).dataUrl;
      }
      if (!cancelled) setPosters(out);
    })();
    return () => {
      cancelled = true;
    };
  }, [p.starred, p.frames, p.locale]);

  const sims: SimVariant[] = useMemo(() => {
    const byId = Object.fromEntries(p.frames.map((f) => [f.id, f]));
    return p.starred
      .map((id, i) => {
        const frame = byId[id];
        return frame ? { id, frame, label: `Variant ${i + 1}`, dataUrl: posters[id] ?? frame.dataUrl } : null;
      })
      .filter((x): x is SimVariant => !!x);
  }, [p.frames, p.starred, posters]);

  const result = useMemo(() => (sims.length ? simulate(sims, { exploreShare: explore, diversityCap: cap }) : null), [sims, explore, cap]);

  useEffect(() => {
    if (!result) return;
    let d = 0;
    const reset = setTimeout(() => setDay(0), 0);
    const id = setInterval(() => {
      d++;
      setDay(Math.min(d, result.days - 1));
      if (d >= result.days - 1) clearInterval(id);
    }, 200);
    return () => {
      clearTimeout(reset);
      clearInterval(id);
    };
  }, [result]);

  if (!result || sims.length === 0) return <Empty>Star at least one frame first.</Empty>;

  const totals = result.totals.map((t) => ({ ...t, ctr: t.clicks / Math.max(1, t.impressions), retain: t.retained / Math.max(1, t.clicks) }));
  const bestCtr = Math.max(...totals.map((t) => t.ctr));
  const cohort = COHORTS.find((c) => c.id === cohortId)!;
  const ranked = sims.map((s, i) => ({ s, i, m: matchScore(cohort, s.frame) })).sort((a, b) => b.m - a.m);
  const top = ranked[0];
  const runner = ranked[1];
  const matched = (s: SimVariant) => (s.frame.tags?.themes ?? []).filter((t) => (cohort.affinity[t] ?? 0) > 0);

  return (
    <div className="flex min-h-0 min-w-0 flex-1">
      <Panel side="left">
        <PanelHeader title="Audiences" right={<span className="mono text-[11px] text-t3">{COHORTS.length}</span>} />
        <ul className="py-1">
          {COHORTS.map((c) => {
            const best = sims.map((s, i) => ({ i, m: matchScore(c, s.frame) })).sort((a, b) => b.m - a.m)[0];
            const active = c.id === cohortId;
            return (
              <li key={c.id}>
                <button
                  type="button"
                  onClick={() => setCohortId(c.id)}
                  className={`flex w-full items-center gap-2 px-3 py-2 text-left ${active ? "bg-sel" : "hover:bg-hover"}`}
                >
                  <span className={`inline-block size-2 rounded-[1px] ${TONES[best.i]}`} />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[12.5px]">{c.name}</span>
                    <span className="block text-[11px] text-t3">sees variant {best.i + 1}</span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
        <Section title="Variants">
          <ul className="space-y-1">
            {sims.map((s, i) => (
              <li key={s.id} className="flex items-center gap-2 text-[12px]">
                <span className={`inline-block size-2 rounded-[1px] ${TONES[i]}`} />
                {s.label}
                <span className="mono text-t3">{fmtTime(s.frame.t)}</span>
              </li>
            ))}
          </ul>
        </Section>
      </Panel>

      <div className="scroll-thin flex min-w-0 flex-1 flex-col overflow-y-auto bg-app">
        <div className="border-b border-line p-4">
          <div className="flex items-baseline justify-between">
            <h2 className="text-[13.5px] font-medium">{cohort.name}</h2>
            <span className="text-[11.5px] text-t3">What this member sees first, and the runner-up</span>
          </div>
          <ul className="mt-1 flex flex-wrap gap-x-4 gap-y-0.5 text-[12px] text-t2">
            {cohort.signals.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
          <div className="mt-4 flex gap-4">
            {[top, runner].filter(Boolean).map((r, idx) => (
              <div key={r.s.id} className={`flex gap-3 rounded-[8px] border p-3 ${idx === 0 ? "border-line-strong bg-panel" : "border-line"}`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={r.s.dataUrl} alt="" className="aspect-[2/3] w-[132px] rounded-[4px] object-cover" />
                <div className="w-[180px]">
                  <span className="label">{idx === 0 ? "Served" : "Runner-up"}</span>
                  <p className="mt-1 text-[12.5px] font-medium">
                    <span className={`mr-1.5 inline-block size-2 rounded-[1px] ${TONES[r.i]}`} />
                    {r.s.label}
                  </p>
                  <p className="mono text-[11px] text-t3">{fmtTime(r.s.frame.t)}</p>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {matched(r.s).length ? matched(r.s).map((t) => <Chip key={t} tone="accent">{t}</Chip>) : <Chip>no strong match</Chip>}
                  </div>
                  <p className="mt-2 text-[11.5px] leading-4 text-t2">Match {Math.round(r.m * 100)}%</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="border-b border-line p-4">
          <div className="flex items-baseline justify-between">
            <h2 className="text-[13.5px] font-medium">
              How the mix settles, day {day + 1} of {result.days}
            </h2>
            <span className="text-[11.5px] text-t3">Seeded simulation. The shape is the point.</span>
          </div>
          <div className="mt-3 space-y-2">
            {COHORTS.map((c) => {
              const shares = result.allocation[c.id][day];
              return (
                <div key={c.id} className="grid grid-cols-[180px_1fr] items-center gap-3">
                  <span className={`truncate text-[12px] ${c.id === cohortId ? "text-t1" : "text-t2"}`}>{c.name}</span>
                  <div className="flex h-5 w-full overflow-hidden rounded-[4px] bg-bg2">
                    {shares.map((s, i) => (
                      <span key={i} className={`bar-fill h-full ${TONES[i]}`} style={{ width: `${s * 100}%` }} title={`${sims[i].label} ${Math.round(s * 100)}%`} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="p-4">
          <h2 className="text-[13.5px] font-medium">What the marketer gets back</h2>
          <table className="mt-2 w-full text-[12.5px]">
            <thead>
              <tr className="text-[11px] text-t3">
                <th className="pb-1.5 text-left font-medium">Variant</th>
                <th className="pb-1.5 text-right font-medium">Impressions</th>
                <th className="pb-1.5 text-right font-medium">Click rate</th>
                <th className="pb-1.5 text-right font-medium">Still watching at 2 min</th>
                <th className="pb-1.5 pl-4 text-left font-medium">Read</th>
              </tr>
            </thead>
            <tbody>
              {totals.map((t, i) => {
                const bait = t.ctr >= bestCtr * 0.95 && t.retain < 0.4;
                return (
                  <tr key={t.id} className="border-t border-line">
                    <td className="py-2">
                      <span className="inline-flex items-center gap-2">
                        <span className={`inline-block size-2 rounded-[1px] ${TONES[i]}`} />
                        {sims[i].label}
                        <span className="mono text-t3">{fmtTime(sims[i].frame.t)}</span>
                      </span>
                    </td>
                    <td className="mono py-2 text-right">{t.impressions.toLocaleString()}</td>
                    <td className="mono py-2 text-right">{(t.ctr * 100).toFixed(1)}%</td>
                    <td className="mono py-2 text-right">{(t.retain * 100).toFixed(0)}%</td>
                    <td className="py-2 pl-4">
                      {bait ? <span className="text-err">Clicked, then bailed. Misleads.</span> : t.retain > 0.55 ? <span className="text-ok">Honest art.</span> : <span className="text-t2">Fine.</span>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <Panel side="right">
        <PanelHeader title="Allocation" />
        <div className="scroll-thin min-h-0 flex-1 overflow-y-auto">
          <Section title="Controls">
            <Row label="Diversity">
              <Toggle checked={cap} onChange={setCap} label="Cap at 70% of a row" />
            </Row>
            <Row label="Explore">
              <span className="flex items-center gap-2">
                <input type="range" min={0.02} max={0.3} step={0.02} value={explore} onChange={(e) => setExplore(Number(e.target.value))} className="w-full" aria-label="Explore share" />
                <span className="mono w-9 text-right text-[11.5px] text-t2">{Math.round(explore * 100)}%</span>
              </span>
            </Row>
          </Section>
          <Section title="Why this screen">
            <p className="text-[12.5px] leading-5 text-t1">Today a variant goes out and the marketer never hears which one won. This closes the loop with the two numbers that matter: who clicked, and who stayed.</p>
          </Section>
          <Section title="The partner cohort">
            <p className="text-[12.5px] leading-5 text-t2">A new member from a partner bundle is not cold, just unrecognised. Coarse, consented signals are enough to pick a first variant. Additive, never load-bearing.</p>
          </Section>
          <Section title="The diversity cap">
            <p className="text-[12.5px] leading-5 text-t2">Without it a bandit will happily fill a whole row with one face. The cap keeps the homepage looking like a catalogue, not a mirror.</p>
          </Section>
        </div>
      </Panel>
    </div>
  );
}
