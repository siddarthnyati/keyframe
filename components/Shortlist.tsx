"use client";
/* eslint-disable react-hooks/refs, react-hooks/immutability, react-hooks/preserve-manual-memoization -- the player element is owned by the page and driven imperatively here */

import { useCallback, useEffect, useMemo, useRef, useState, type RefObject } from "react";
import { ChevronRight, Minus, Pause, Play, Plus, Star } from "lucide-react";
import { fmtTime } from "@/lib/frames";
import type { Frame } from "@/lib/types";
import { Button, Chip, Empty, IconButton, Meter, Panel, PanelHeader, Row, Section, Segmented } from "./ui";

export type Status = { phase: "idle" | "sampling" | "tagging" | "ready"; done: number; total: number; mock?: boolean; note?: string };

export type ShortlistProps = {
  frames: Frame[];
  starred: string[];
  onStar: (id: string) => void;
  onNext: () => void;
  status: Status;
  onDrop: (file: File) => void;
  videoName: string;
  duration: number;
  videoRef: RefObject<HTMLVideoElement | null>;
  src: string;
};

type Filter = "all" | "faces" | "wide";

export default function Shortlist(p: ShortlistProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const [filter, setFilter] = useState<Filter>("all");
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [hoverT, setHoverT] = useState<number | null>(null);
  const [laneW, setLaneW] = useState(800);
  const laneRef = useRef<HTMLDivElement>(null);
  const picked = useRef(false);

  const ranked = useMemo(() => p.frames.filter((f) => !f.dupOf).sort((a, b) => b.score - a.score), [p.frames]);
  const shown = ranked.filter((f) => {
    if (filter === "faces") return (f.tags?.faces ?? 0) >= 1;
    if (filter === "wide") return f.tags?.shot === "wide";
    return true;
  });
  const folded = p.frames.length - ranked.length;
  const sel = p.frames.find((f) => f.id === selected) ?? ranked[0];
  const starRank = (id: string) => p.starred.indexOf(id);
  const sampling = p.status.phase === "sampling";

  // Follow the leader until the person picks a frame themselves.
  useEffect(() => {
    if (!picked.current && ranked[0] && p.status.phase === "ready") setSelected(ranked[0].id);
  }, [ranked, p.status.phase]);

  const seek = useCallback(
    (t: number) => {
      const v = p.videoRef.current;
      if (!v || sampling) return;
      v.pause();
      v.currentTime = Math.max(0, Math.min(p.duration || 0, t));
      setPlaying(false);
    },
    [p.videoRef, p.duration, sampling],
  );

  const pick = (id: string) => {
    picked.current = true;
    setSelected(id);
    const f = p.frames.find((x) => x.id === id);
    if (f) seek(f.t);
  };

  // Playhead follows the element.
  useEffect(() => {
    const v = p.videoRef.current;
    if (!v) return;
    let raf = 0;
    const tick = () => {
      setTime(v.currentTime);
      if (!v.paused && !v.ended) raf = requestAnimationFrame(tick);
    };
    const onPlay = () => {
      setPlaying(true);
      raf = requestAnimationFrame(tick);
    };
    const onPause = () => {
      setPlaying(false);
      setTime(v.currentTime);
      cancelAnimationFrame(raf);
    };
    const onTime = () => setTime(v.currentTime);
    v.addEventListener("play", onPlay);
    v.addEventListener("pause", onPause);
    v.addEventListener("ended", onPause);
    v.addEventListener("seeked", onTime);
    v.addEventListener("timeupdate", onTime);
    return () => {
      cancelAnimationFrame(raf);
      v.removeEventListener("play", onPlay);
      v.removeEventListener("pause", onPause);
      v.removeEventListener("ended", onPause);
      v.removeEventListener("seeked", onTime);
      v.removeEventListener("timeupdate", onTime);
    };
  }, [p.videoRef, p.src]);

  useEffect(() => {
    const el = laneRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setLaneW(el.clientWidth));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const togglePlay = () => {
    const v = p.videoRef.current;
    if (!v || sampling) return;
    if (v.paused) v.play();
    else v.pause();
  };

  // Timeline geometry
  const dur = Math.max(p.duration, 1);
  const totalW = Math.max(laneW * zoom, 1);
  const x = (t: number) => (t / dur) * totalW;
  const step = p.frames.length > 1 ? p.frames[1].t - p.frames[0].t : 1.5;
  const frameW = Math.max(2, x(step) - 1);
  const nearest = (t: number) => p.frames.reduce((a, b) => (Math.abs(b.t - t) < Math.abs(a.t - t) ? b : a), p.frames[0]);
  const tickEvery = dur > 120 ? 30 : dur > 40 ? 10 : 5;
  const ticks: number[] = [];
  for (let t = 0; t <= dur; t += tickEvery) ticks.push(t);

  const laneT = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = laneRef.current!;
    const rect = el.getBoundingClientRect();
    const px = e.clientX - rect.left + el.scrollLeft;
    return (px / totalW) * dur;
  };

  const hoverFrame = hoverT !== null && p.frames.length ? nearest(hoverT) : null;

  return (
    <div className="flex min-h-0 min-w-0 flex-1">
      {/* Shots */}
      <Panel side="left">
        <PanelHeader title="Shots" right={<span className="mono text-[11px] text-t3">{ranked.length}</span>} />
        <div className="border-b border-line px-3 py-2">
          <Segmented<Filter>
            value={filter}
            onChange={setFilter}
            options={[
              { id: "all", label: "All" },
              { id: "faces", label: "Faces" },
              { id: "wide", label: "Wide" },
            ]}
          />
        </div>
        <div className="scroll-thin min-h-0 flex-1 overflow-y-auto p-2">
          {shown.length === 0 && <Empty>{sampling ? "Scanning the trailer." : "Nothing matches this filter."}</Empty>}
          <div className="grid grid-cols-2 gap-2">
            {shown.map((f) => {
              const r = starRank(f.id);
              const isSel = sel?.id === f.id;
              return (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => pick(f.id)}
                  className={`group relative overflow-hidden rounded-[6px] border text-left transition-colors ${
                    isSel ? "border-accent" : "border-transparent hover:border-line-strong"
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={f.dataUrl} alt={`Frame at ${fmtTime(f.t)}`} className="aspect-video w-full object-cover" />
                  <span className="mono absolute bottom-1 left-1 rounded-[3px] bg-black/70 px-1 text-[10.5px] text-t1">{fmtTime(f.t)}</span>
                  <span className="mono absolute bottom-1 right-1 rounded-[3px] bg-black/70 px-1 text-[10.5px] font-medium text-t1">{f.score}</span>
                  {r >= 0 && (
                    <span className="absolute right-1 top-1 inline-flex size-5 items-center justify-center rounded-[3px] bg-t1 text-app">
                      <Star size={11} fill="currentColor" />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </Panel>

      {/* Player + timeline */}
      <div
        className="flex min-w-0 flex-1 flex-col bg-app"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          const f = e.dataTransfer.files?.[0];
          if (f) p.onDrop(f);
        }}
      >
        <div className="relative flex min-h-0 flex-1 items-center justify-center bg-player">
          <video ref={p.videoRef} src={p.src} muted playsInline preload="auto" className="max-h-full max-w-full" />
          {(sampling || p.status.phase === "tagging") && (
            <div className="absolute bottom-3 left-3 right-3 rounded-[6px] bg-black/70 px-3 py-2 backdrop-blur">
              <div className="flex items-center justify-between text-[12px]">
                <span>{sampling ? `Scanning frame ${p.status.done} of ${p.status.total}` : `Tagging ${p.status.total} frames with the model`}</span>
                <span className="mono text-t2">{sampling ? `${Math.round((p.status.done / Math.max(1, p.status.total)) * 100)}%` : ""}</span>
              </div>
              <div className="mt-1.5 h-0.5 overflow-hidden rounded-full bg-bg2">
                {sampling ? (
                  <div className="bar-fill h-full bg-t1" style={{ width: `${(p.status.done / Math.max(1, p.status.total)) * 100}%` }} />
                ) : (
                  <div className="shimmer h-full" />
                )}
              </div>
            </div>
          )}
          {p.status.phase === "idle" && <p className="absolute text-[12.5px] text-t2">Drop a trailer here.</p>}
        </div>

        {/* Transport */}
        <div className="flex h-10 shrink-0 items-center gap-2 border-t border-line px-3">
          <IconButton title={playing ? "Pause" : "Play"} onClick={togglePlay} disabled={sampling}>
            {playing ? <Pause size={15} /> : <Play size={15} />}
          </IconButton>
          <span className="mono text-[12px] text-t1">{fmtTime(time)}</span>
          <span className="mono text-[12px] text-t3">/ {fmtTime(p.duration)}</span>
          <span className="ml-3 text-[12px] text-t2">{p.videoName}</span>
          <span className="ml-auto text-[11.5px] text-t3">
            {p.status.phase === "ready" && `${p.frames.length} frames, ${folded} near-duplicates folded${p.status.mock ? ", placeholder tags" : ""}`}
          </span>
        </div>

        {/* Timeline */}
        <div className="shrink-0 border-t border-line">
          <div ref={laneRef} className="scroll-thin relative overflow-x-auto overflow-y-hidden" onMouseLeave={() => setHoverT(null)}>
            <div
              className="relative cursor-crosshair select-none"
              style={{ width: totalW, height: 20 + 28 + 56 }}
              onMouseMove={(e) => setHoverT(laneT(e))}
              onClick={(e) => {
                const t = laneT(e);
                seek(t);
                const f = nearest(t);
                if (f) {
                  picked.current = true;
                  setSelected(f.id);
                }
              }}
            >
              {/* Ruler */}
              <div className="absolute inset-x-0 top-0 h-5 border-b border-line">
                {ticks.map((t) => (
                  <span key={t} className="mono absolute top-0 h-full border-l border-line-strong pl-1 text-[10px] leading-5 text-t3" style={{ left: x(t) }}>
                    {fmtTime(t).replace(/\.\d$/, "")}
                  </span>
                ))}
                {p.starred.map((id) => {
                  const f = p.frames.find((q) => q.id === id);
                  if (!f) return null;
                  return <span key={id} className="absolute top-[6px] size-2 rotate-45 bg-t1" style={{ left: x(f.t) + frameW / 2 - 4 }} />;
                })}
              </div>
              {/* Score lane */}
              <div className="absolute inset-x-0 top-5 h-7 border-b border-line">
                {p.frames.map((f) => {
                  const r = starRank(f.id);
                  const h = f.dupOf ? 2 : Math.max(2, Math.round((f.score / 100) * 24));
                  return (
                    <span
                      key={f.id}
                      className={`absolute bottom-0 rounded-t-[1px] ${r >= 0 ? "bg-t1" : sel?.id === f.id ? "bg-accent" : f.dupOf ? "bg-bg2" : "bg-t3"}`}
                      style={{ left: x(f.t), width: frameW, height: h }}
                    />
                  );
                })}
              </div>
              {/* Filmstrip */}
              <div className="absolute inset-x-0 top-12 h-14">
                {p.frames.map((f) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={f.id}
                    src={f.dataUrl}
                    alt=""
                    draggable={false}
                    className={`absolute top-0 h-full object-cover ${f.dupOf ? "opacity-30" : "opacity-85"} ${sel?.id === f.id ? "ring-1 ring-inset ring-accent opacity-100" : ""}`}
                    style={{ left: x(f.t), width: frameW }}
                  />
                ))}
                {p.frames.length === 0 && <div className="h-full w-full bg-bg2" />}
              </div>
              {/* Playhead */}
              <div className="pointer-events-none absolute top-0 bottom-0 w-px bg-accent" style={{ left: x(time) }}>
                <span className="absolute -left-[5px] top-0 size-0 border-x-[5px] border-t-[6px] border-x-transparent border-t-accent" />
              </div>
              {/* Skimmer */}
              {hoverT !== null && hoverFrame && (
                <>
                  <div className="pointer-events-none absolute top-5 bottom-0 w-px bg-skim" style={{ left: x(hoverT) }} />
                  <div
                    className="pointer-events-none absolute top-6 z-10 w-[120px] -translate-x-1/2 rounded-[4px] border border-line-strong bg-panel p-0.5"
                    style={{ left: Math.min(Math.max(x(hoverT), 62), totalW - 62) }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={hoverFrame.dataUrl} alt="" className="aspect-video w-full rounded-[2px] object-cover" />
                    <span className="mono block px-1 pt-0.5 text-center text-[10px] text-t2">{fmtTime(hoverT)}</span>
                  </div>
                </>
              )}
            </div>
          </div>
          <div className="flex h-7 items-center gap-2 border-t border-line px-3">
            <span className="text-[11px] text-t3">Timeline</span>
            <span className="ml-auto" />
            <IconButton title="Zoom out" onClick={() => setZoom((z) => Math.max(1, z - 0.5))}>
              <Minus size={13} />
            </IconButton>
            <input type="range" min={1} max={4} step={0.5} value={zoom} onChange={(e) => setZoom(Number(e.target.value))} className="w-24" aria-label="Timeline zoom" />
            <IconButton title="Zoom in" onClick={() => setZoom((z) => Math.min(4, z + 0.5))}>
              <Plus size={13} />
            </IconButton>
            <button type="button" className="text-[11px] text-t2 hover:text-t1" onClick={() => setZoom(1)}>
              Fit
            </button>
          </div>
        </div>
      </div>

      {/* Inspector */}
      <Panel side="right">
        <PanelHeader title="Frame" right={sel ? <span className="mono text-[11px] text-t3">{sel.id}</span> : undefined} />
        <div className="scroll-thin min-h-0 flex-1 overflow-y-auto">
          {sel ? (
            <>
              <div className="border-b border-line p-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={sel.dataUrl} alt="" className="aspect-video w-full rounded-[6px] object-cover" />
                <div className="mt-3">
                  <Button full onClick={() => p.onStar(sel.id)} disabled={starRank(sel.id) < 0 && p.starred.length >= 3} primary={starRank(sel.id) < 0}>
                    <Star size={13} fill={starRank(sel.id) >= 0 ? "currentColor" : "none"} />
                    {starRank(sel.id) >= 0 ? "Remove from shortlist" : "Add to shortlist"}
                  </Button>
                </div>
              </div>
              <Section title="Frame">
                <Row label="Timecode">
                  <span className="mono">{fmtTime(sel.t)}</span>
                </Row>
                <Row label="Score">
                  <span className="mono">{sel.score}</span>
                </Row>
                <Meter label="Focus" value={sel.sharp * 100} />
                <Meter label="Exposure" value={(1 - Math.abs(sel.bright - 0.42) / 0.42) * 100} />
                <Meter label="Appeal" value={(sel.tags?.appeal ?? 0) * 100} display={sel.tags ? undefined : "..."} />
              </Section>
              {sel.tags && (
                <Section title="Model read">
                  <Row label="Shot">{sel.tags.shot}</Row>
                  <Row label="Faces">{sel.tags.faces}</Row>
                  <Row label="Mood">{sel.tags.mood}</Row>
                  <Row label="Themes">
                    <span className="flex flex-wrap gap-1">
                      {sel.tags.themes.map((t) => (
                        <Chip key={t}>{t}</Chip>
                      ))}
                    </span>
                  </Row>
                  <Row label="On-screen text">{sel.tags.text ? <Chip tone="warn">yes</Chip> : "none"}</Row>
                  <p className="mt-2 text-[12.5px] leading-5 text-t1">{sel.tags.why}</p>
                </Section>
              )}
            </>
          ) : (
            <Empty>Pick a frame to see why it ranks where it does.</Empty>
          )}
          <Section title={`Shortlist ${p.starred.length} of 3`}>
            {p.starred.length === 0 ? (
              <p className="text-[12px] leading-5 text-t2">Add three frames. Each becomes a variant with its own theme tags.</p>
            ) : (
              <ul className="space-y-1.5">
                {p.starred.map((id, i) => {
                  const f = p.frames.find((q) => q.id === id)!;
                  return (
                    <li key={id} className="flex items-center gap-2">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={f.dataUrl} alt="" className="aspect-video h-7 rounded-[3px] object-cover" />
                      <span className="min-w-0 flex-1 truncate text-[12px]">
                        <span className="mono text-t2">{i + 1}</span> {fmtTime(f.t)}
                        <span className="text-t3"> {f.tags?.themes.slice(0, 2).join(", ")}</span>
                      </span>
                      <button type="button" className="text-[11px] text-t3 hover:text-t1" onClick={() => p.onStar(id)}>
                        Remove
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </Section>
        </div>
        <div className="border-t border-line p-3">
          <Button full primary disabled={p.starred.length === 0} onClick={p.onNext}>
            Render variants <ChevronRight size={14} />
          </Button>
        </div>
      </Panel>
    </div>
  );
}
