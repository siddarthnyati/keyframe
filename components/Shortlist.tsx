"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { fmtTime } from "@/lib/frames";
import type { Frame } from "@/lib/types";
import { Button, Chip, Meter, RailSection } from "./ui";

export type ShortlistProps = {
  frames: Frame[];
  starred: string[];
  onStar: (id: string) => void;
  onNext: () => void;
  status: { phase: "idle" | "sampling" | "tagging" | "ready"; done: number; total: number; mock?: boolean; note?: string };
  onDrop: (file: File) => void;
  videoName: string;
  duration: number;
};

export default function Shortlist(p: ShortlistProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const [hover, setHover] = useState<string | null>(null);

  const ranked = useMemo(
    () => p.frames.filter((f) => !f.dupOf).sort((a, b) => b.score - a.score),
    [p.frames],
  );
  const folded = p.frames.length - ranked.length;
  const sel = p.frames.find((f) => f.id === selected) ?? ranked[0];
  // Follow the leader until the person picks a frame themselves.
  const picked = useRef(false);
  useEffect(() => {
    if (!picked.current && ranked[0]) setSelected(ranked[0].id);
  }, [ranked]);
  const pick = (id: string) => {
    picked.current = true;
    setSelected(id);
  };

  const starRank = (id: string) => p.starred.indexOf(id);
  const canStarMore = p.starred.length < 3;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 min-h-0">
      <div className="min-w-0">
        {/* Filmstrip hero */}
        <div
          className="rounded-[4px] border border-line bg-ink-2 p-3"
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            const f = e.dataTransfer.files?.[0];
            if (f) p.onDrop(f);
          }}
        >
          <div className="flex items-baseline justify-between mb-2">
            <p className="text-[15px]">
              <span className="font-medium">{p.videoName}</span>
              <span className="text-muted">, {Math.round(p.duration)}s trailer</span>
            </p>
            <p className="text-[12.5px] text-muted">
              {p.status.phase === "sampling" && `Sampling frame ${p.status.done} of ${p.status.total}`}
              {p.status.phase === "tagging" && `Tagging ${p.status.total} frames`}
              {p.status.phase === "ready" && `${p.frames.length} frames, ${folded} near-duplicates folded`}
              {p.status.phase === "idle" && "Drop a trailer here, or use the sample"}
            </p>
          </div>
          <div className="relative">
            <div className="flex gap-[2px] overflow-hidden rounded-[2px]">
              {p.frames.map((f) => {
                const r = starRank(f.id);
                const isHover = hover === f.id || selected === f.id;
                const barH = f.dupOf ? 2 : Math.max(2, Math.round((f.score / 100) * 44));
                return (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => pick(f.id)}
                    onMouseEnter={() => setHover(f.id)}
                    onMouseLeave={() => setHover(null)}
                    className="group/strip relative flex-1 min-w-0"
                    title={`${fmtTime(f.t)}, score ${f.score}`}
                  >
                    <span className="flex h-12 items-end">
                      <span
                        className={`bar-fill block w-full rounded-t-[1px] ${r >= 0 ? "bg-amber" : isHover ? "bg-text" : f.dupOf ? "bg-line" : "bg-text/45"}`}
                        style={{ height: barH }}
                      />
                    </span>
                    <span className="relative block aspect-video overflow-hidden mt-[2px]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={f.dataUrl}
                        alt=""
                        className={`size-full object-cover ${f.dupOf ? "opacity-30" : isHover ? "opacity-100" : "opacity-80"} transition-opacity`}
                      />
                      {r >= 0 && <span className="absolute inset-x-0 bottom-0 h-[3px] bg-amber" />}
                      {isHover && <span className="absolute inset-0 ring-1 ring-inset ring-text/70" />}
                    </span>
                  </button>
                );
              })}
              {p.frames.length === 0 && <div className="h-20 w-full rounded-[2px] bg-surface" />}
            </div>
            {p.status.phase === "tagging" && <div className="scanline absolute inset-x-0 -bottom-1 h-[2px]" />}
            <div className="mt-1.5 flex justify-between text-[11px] tabular-nums text-dim">
              <span>0:00</span>
              <span>{fmtTime(p.duration / 2)}</span>
              <span>{fmtTime(p.duration)}</span>
            </div>
          </div>
        </div>

        {/* Ranked grid */}
        <div className="mt-6 flex items-baseline justify-between">
          <h2 className="text-[15px] font-medium">Ranked by what key art needs</h2>
          <p className="text-[12.5px] text-muted">
            {p.status.mock ? "Placeholder tags, no API key" : p.status.phase === "ready" ? "Scores blend focus, exposure and the model's read" : ""}
          </p>
        </div>
        <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-3">
          {ranked.map((f) => {
            const r = starRank(f.id);
            return (
              <div
                key={f.id}
                data-new="true"
                className={`frame-tile group relative rounded-[3px] overflow-hidden border ${
                  selected === f.id ? "border-text/60" : "border-line"
                } ${r >= 0 ? "ring-2 ring-amber" : ""}`}
                onMouseEnter={() => setHover(f.id)}
                onMouseLeave={() => setHover(null)}
              >
                <button type="button" className="block w-full text-left" onClick={() => pick(f.id)}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={f.dataUrl} alt={`Frame at ${fmtTime(f.t)}`} className="w-full aspect-video object-cover" />
                </button>
                <div className="flex items-center justify-between px-2 py-1.5 bg-surface">
                  <span className="text-[12px] tabular-nums text-muted">{fmtTime(f.t)}</span>
                  <span className="text-[13px] font-medium tabular-nums">{f.score}</span>
                </div>
                <button
                  type="button"
                  onClick={() => p.onStar(f.id)}
                  disabled={r < 0 && !canStarMore}
                  className={`absolute top-1.5 right-1.5 h-6 min-w-6 px-1.5 rounded-[3px] text-[12px] font-medium transition-opacity ${
                    r >= 0
                      ? "bg-amber text-amber-ink opacity-100"
                      : "bg-ink/80 text-text opacity-0 group-hover:opacity-100 focus-visible:opacity-100 disabled:hidden"
                  }`}
                >
                  {r >= 0 ? `Starred ${r + 1}` : "Star"}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Rail */}
      <aside className="rounded-[4px] border border-line bg-ink-2 p-4 h-fit lg:sticky lg:top-20">
        {sel ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={sel.dataUrl} alt="" className="w-full aspect-video object-cover rounded-[3px]" />
            <div className="mt-3 flex items-baseline justify-between">
              <p className="text-[15px] font-medium">Frame at {fmtTime(sel.t)}</p>
              <p className="text-[15px] font-medium tabular-nums">{sel.score}</p>
            </div>
            <div className="mt-3 space-y-1.5">
              <Meter label="Focus" value={sel.sharp * 100} />
              <Meter label="Exposure" value={(1 - Math.abs(sel.bright - 0.42) / 0.42) * 100} />
              <Meter label="Appeal" value={(sel.tags?.appeal ?? 0) * 100} display={sel.tags ? undefined : "..."} />
            </div>
            {sel.tags && (
              <RailSection title="What the model saw">
                <p className="text-[13.5px] leading-5">{sel.tags.why}</p>
                <div className="mt-2 flex flex-wrap gap-1">
                  {sel.tags.themes.map((t) => (
                    <Chip key={t}>{t}</Chip>
                  ))}
                  <Chip>{sel.tags.shot} shot</Chip>
                  <Chip>{sel.tags.faces === 0 ? "no faces" : `${sel.tags.faces} face${sel.tags.faces > 1 ? "s" : ""}`}</Chip>
                  {sel.tags.text && <Chip tone="amber">text on screen</Chip>}
                </div>
              </RailSection>
            )}
          </>
        ) : (
          <p className="text-muted">Pick a frame to see why it ranks where it does.</p>
        )}
        <RailSection title={`Starred ${p.starred.length} of 3`}>
          {p.starred.length === 0 ? (
            <p className="text-[13px] text-muted">Star three frames. Each becomes a variant with its own theme tags.</p>
          ) : (
            <ul className="space-y-1.5">
              {p.starred.map((id, i) => {
                const f = p.frames.find((x) => x.id === id)!;
                return (
                  <li key={id} className="flex items-center gap-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={f.dataUrl} alt="" className="h-8 aspect-video object-cover rounded-[2px]" />
                    <span className="text-[13px] flex-1">
                      {i + 1}. {fmtTime(f.t)}
                      <span className="text-muted"> {f.tags?.themes.slice(0, 2).join(", ")}</span>
                    </span>
                    <button type="button" className="text-[12px] text-muted hover:text-text" onClick={() => p.onStar(id)}>
                      Remove
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
          <div className="mt-3">
            <Button primary disabled={p.starred.length === 0} onClick={p.onNext}>
              Render variants
            </Button>
          </div>
        </RailSection>
      </aside>
    </div>
  );
}
