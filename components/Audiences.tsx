"use client";

import { useEffect, useMemo, useState } from "react";
import { COHORTS, matchScore, simulate, type SimVariant } from "@/lib/sim";
import { ensureFonts, loadImage, renderVariant } from "@/lib/art";
import { fmtTime } from "@/lib/frames";
import { FORMATS, type Frame, type Locale, type Variant } from "@/lib/types";
import { Chip, RailSection, Toggle } from "./ui";

export type AudiencesProps = { frames: Frame[]; starred: string[]; variants: Variant[]; locale: Locale };

const VARIANT_TONES = ["bg-text/80", "bg-amber", "bg-muted"];

export default function Audiences(p: AudiencesProps) {
  const [explore, setExplore] = useState(0.1);
  const [cap, setCap] = useState(true);
  const [day, setDay] = useState(0);
  const [posters, setPosters] = useState<Record<string, string>>({});

  // Every variant gets its own 2:3 poster here, whatever it was assigned to in the matrix.
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
        out[id] = renderVariant({ img, format: poster, locale: p.locale, titleOnHero: false, titleScale: 1, scale: 0.3 }).dataUrl;
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

  // Play the 14 days forward once per change, in answer to the person's action.
  useEffect(() => {
    if (!result) return;
    let d = 0;
    const reset = setTimeout(() => setDay(0), 0);
    const id = setInterval(() => {
      d++;
      setDay(Math.min(d, result.days - 1));
      if (d >= result.days - 1) clearInterval(id);
    }, 220);
    return () => {
      clearTimeout(reset);
      clearInterval(id);
    };
  }, [result]);

  if (!result || sims.length === 0) return <p className="text-muted">Star at least one frame first.</p>;

  const totals = result.totals.map((t) => ({
    ...t,
    ctr: t.clicks / Math.max(1, t.impressions),
    retain: t.retained / Math.max(1, t.clicks),
  }));
  const bestCtr = Math.max(...totals.map((t) => t.ctr));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
      <div className="min-w-0">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {COHORTS.map((c) => {
            const scored = sims.map((s) => ({ s, m: matchScore(c, s.frame) })).sort((a, b) => b.m - a.m);
            const top = scored[0];
            const matched = (top.s.frame.tags?.themes ?? []).filter((t) => (c.affinity[t] ?? 0) > 0);
            return (
              <section key={c.id} className="rounded-[4px] border border-line bg-ink-2 p-4">
                <h2 className="text-[15px] font-medium">{c.name}</h2>
                <ul className="mt-2 space-y-1 text-[13px] text-muted">
                  {c.signals.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
                <div className="mt-4 flex gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={top.s.dataUrl} alt="" className="w-[88px] aspect-[2/3] object-cover rounded-[3px]" />
                  <div className="min-w-0">
                    <p className="text-[13.5px] font-medium">Sees {top.s.label.toLowerCase()}</p>
                    <p className="text-[12.5px] text-muted">frame at {fmtTime(top.s.frame.t)}</p>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {matched.length ? matched.map((t) => <Chip key={t} tone="amber">{t}</Chip>) : <Chip>no strong match, explores</Chip>}
                    </div>
                  </div>
                </div>
              </section>
            );
          })}
        </div>

        <div className="mt-6 rounded-[4px] border border-line bg-ink-2 p-4">
          <div className="flex items-baseline justify-between">
            <h2 className="text-[15px] font-medium">How the mix settles, day {day + 1} of {result.days}</h2>
            <div className="flex items-center gap-2 text-[12.5px] text-muted">
              {sims.map((s, i) => (
                <span key={s.id} className="inline-flex items-center gap-1.5">
                  <span className={`inline-block size-2 rounded-[1px] ${VARIANT_TONES[i]}`} />
                  {s.label}
                </span>
              ))}
            </div>
          </div>
          <div className="mt-4 space-y-3">
            {COHORTS.map((c) => {
              const shares = result.allocation[c.id][day];
              return (
                <div key={c.id} className="grid grid-cols-[140px_1fr] md:grid-cols-[200px_1fr] items-center gap-3">
                  <span className="text-[13px] text-muted">{c.name}</span>
                  <div className="flex h-6 w-full overflow-hidden rounded-[3px] bg-surface">
                    {shares.map((s, i) => (
                      <span key={i} className={`bar-fill h-full ${VARIANT_TONES[i]}`} style={{ width: `${s * 100}%` }} title={`${sims[i].label} ${Math.round(s * 100)}%`} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
          <p className="mt-3 text-[12.5px] text-muted">Simulated with seeded numbers. The shape is the point: each cohort settles on its own variant, and a slice keeps exploring.</p>
        </div>

        <div className="mt-6 rounded-[4px] border border-line bg-ink-2 p-4">
          <h2 className="text-[15px] font-medium">What the marketer gets back</h2>
          <table className="mt-3 w-full text-[13px]">
            <thead>
              <tr className="text-muted text-[12.5px]">
                <th className="text-left font-medium pb-2">Variant</th>
                <th className="text-right font-medium pb-2">Impressions</th>
                <th className="text-right font-medium pb-2">Click rate</th>
                <th className="text-right font-medium pb-2">Kept watching past 2 min</th>
                <th className="text-left font-medium pb-2 pl-4">Read</th>
              </tr>
            </thead>
            <tbody>
              {totals.map((t, i) => {
                const bait = t.ctr >= bestCtr * 0.95 && t.retain < 0.4;
                return (
                  <tr key={t.id} className="border-t border-line">
                    <td className="py-2">
                      <span className="inline-flex items-center gap-2">
                        <span className={`inline-block size-2 rounded-[1px] ${VARIANT_TONES[i]}`} />
                        {sims[i].label}, {fmtTime(sims[i].frame.t)}
                      </span>
                    </td>
                    <td className="py-2 text-right tabular-nums">{t.impressions.toLocaleString()}</td>
                    <td className="py-2 text-right tabular-nums">{(t.ctr * 100).toFixed(1)}%</td>
                    <td className="py-2 text-right tabular-nums">{(t.retain * 100).toFixed(0)}%</td>
                    <td className="py-2 pl-4">
                      {bait ? <span className="text-fail">Clicked, then bailed. Misleads.</span> : t.retain > 0.55 ? <span className="text-pass">Honest art.</span> : <span className="text-muted">Fine.</span>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <aside className="rounded-[4px] border border-line bg-ink-2 p-4 h-fit lg:sticky lg:top-20">
        <RailSection title="Controls">
          <Toggle checked={cap} onChange={setCap} label="Cap any variant at 70% of a row" />
          <label className="mt-3 block text-[13px]">
            Keep exploring: {Math.round(explore * 100)}% of traffic
            <input type="range" min={0.02} max={0.3} step={0.02} value={explore} onChange={(e) => setExplore(Number(e.target.value))} className="mt-1 w-full" />
          </label>
        </RailSection>
        <RailSection title="Why this screen exists">
          <p className="text-[13.5px] leading-5">
            Today a variant goes out and the marketer never hears which one won. This closes the loop with the two numbers that matter: who clicked, and who stayed.
          </p>
        </RailSection>
        <RailSection title="The partner cohort">
          <p className="text-[13.5px] leading-5 text-muted">
            A new member from a partner bundle is not cold, just unrecognised. Coarse, consented signals are enough to pick a first variant. They are additive, never load-bearing.
          </p>
        </RailSection>
      </aside>
    </div>
  );
}
