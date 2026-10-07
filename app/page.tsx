"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Clapperboard } from "lucide-react";
import Shortlist, { type Status } from "@/components/Shortlist";
import Variants from "@/components/Variants";
import Audiences from "@/components/Audiences";
import { finalScore, sampleFrames } from "@/lib/frames";
import { DEFAULT_LOCALES, type FormatId, type Frame, type FrameTags, type Locale, type Variant } from "@/lib/types";

type Step = "shortlist" | "variants" | "audiences";
const STEPS: { id: Step; label: string }[] = [
  { id: "shortlist", label: "Shortlist" },
  { id: "variants", label: "Variants" },
  { id: "audiences", label: "Audiences" },
];

export default function Page() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [src, setSrc] = useState("/sample/sintel-trailer.mp4");
  const [videoName, setVideoName] = useState("sintel-trailer.mp4");
  const [duration, setDuration] = useState(0);
  const [frames, setFrames] = useState<Frame[]>([]);
  const [status, setStatus] = useState<Status>({ phase: "idle", done: 0, total: 0 });
  const [starred, setStarred] = useState<string[]>([]);
  const [step, setStep] = useState<Step>("shortlist");
  const [locales, setLocales] = useState<Locale[]>(DEFAULT_LOCALES);
  const [activeLocales, setActiveLocales] = useState<string[]>(DEFAULT_LOCALES.map((l) => l.code));
  const [assignment, setAssignment] = useState<Record<FormatId, string>>({ poster: "", cover: "", hero: "", social: "" });
  const [titleOnHero, setTitleOnHero] = useState(false);
  const [titleScale, setTitleScale] = useState(1);
  const [approved, setApproved] = useState<Record<string, boolean>>({});
  const [variants, setVariants] = useState<Variant[]>([]);

  const run = useCallback(async () => {
    const v = videoRef.current;
    if (!v) return;
    setFrames([]);
    setStarred([]);
    setApproved({});
    setStatus({ phase: "sampling", done: 0, total: 0 });
    const sampled = await sampleFrames(v, {
      onFrame: (f, i, total) => {
        setFrames((prev) => [...prev, f]);
        setStatus({ phase: "sampling", done: i + 1, total });
      },
    });
    setFrames(sampled);
    const candidates = sampled.filter((f) => !f.dupOf).sort((a, b) => b.score - a.score).slice(0, 24);
    setStatus({ phase: "tagging", done: 0, total: candidates.length });
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ frames: candidates.map((f) => ({ id: f.id, dataUrl: f.dataUrl })) }),
      });
      const data = (await res.json()) as { tags: (FrameTags & { id: string })[]; mock: boolean; note?: string };
      const byId = Object.fromEntries(data.tags.map((t) => [t.id, t]));
      setFrames((prev) =>
        prev.map((f) => {
          const t = byId[f.id];
          if (!t) return f;
          const tagged = { ...f, tags: t };
          return { ...tagged, score: finalScore(tagged) };
        }),
      );
      setStatus({ phase: "ready", done: 0, total: 0, mock: data.mock, note: data.note });
    } catch {
      setStatus({ phase: "ready", done: 0, total: 0, mock: true, note: "tagging failed" });
    }
    const top = sampled.filter((f) => !f.dupOf).sort((a, b) => b.score - a.score)[0];
    if (v && top) v.currentTime = top.t;
  }, []);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const onMeta = () => {
      setDuration(v.duration);
      run();
    };
    v.addEventListener("loadedmetadata", onMeta);
    v.load();
    return () => v.removeEventListener("loadedmetadata", onMeta);
  }, [src, run]);

  const toggleStar = (id: string) => setStarred((s) => (s.includes(id) ? s.filter((x) => x !== id) : s.length >= 3 ? s : [...s, id]));

  const goVariants = () => {
    const [a, b, c] = starred;
    setAssignment((cur) => ({
      poster: starred.includes(cur.poster) ? cur.poster : a,
      cover: starred.includes(cur.cover) ? cur.cover : (b ?? a),
      hero: starred.includes(cur.hero) ? cur.hero : (c ?? b ?? a),
      social: starred.includes(cur.social) ? cur.social : a,
    }));
    setStep("variants");
  };

  const onDrop = (file: File) => {
    setVideoName(file.name);
    setSrc(URL.createObjectURL(file));
    setStep("shortlist");
  };

  const statusText =
    status.phase === "sampling"
      ? `Scanning ${status.done}/${status.total}`
      : status.phase === "tagging"
        ? "Tagging"
        : status.phase === "ready"
          ? `${starred.length} of 3 shortlisted`
          : "";

  return (
    <div className="flex h-full flex-col">
      <header className="relative flex h-12 shrink-0 items-center border-b border-line bg-panel px-3">
        <div className="flex items-center gap-2">
          <Clapperboard size={16} className="text-t2" />
          <span className="text-[13px] font-semibold">Keyframe</span>
          <span className="mx-1 h-4 w-px bg-line-strong" />
          <span className="text-[12.5px] text-t2">{videoName}</span>
        </div>
        <nav className="absolute left-1/2 flex -translate-x-1/2 items-center gap-1">
          {STEPS.map((s, i) => {
            const enabled = s.id === "shortlist" || starred.length > 0;
            const active = step === s.id;
            return (
              <button
                key={s.id}
                type="button"
                disabled={!enabled}
                onClick={() => (s.id === "variants" ? goVariants() : setStep(s.id))}
                className={`h-8 rounded-[5px] px-3 text-[12.5px] transition-colors disabled:opacity-40 ${active ? "bg-sel text-t1" : "text-t2 hover:text-t1"}`}
              >
                <span className="mono mr-1.5 text-t3">{i + 1}</span>
                {s.label}
              </button>
            );
          })}
        </nav>
        <span className="ml-auto text-[12px] text-t3">{statusText}</span>
      </header>
      <div className="flex min-h-0 min-w-0 flex-1">
        <div className={`flex min-h-0 min-w-0 flex-1 ${step === "shortlist" ? "" : "hidden"}`}>
          <Shortlist
            frames={frames}
            starred={starred}
            onStar={toggleStar}
            onNext={goVariants}
            status={status}
            onDrop={onDrop}
            videoName={videoName}
            duration={duration}
            videoRef={videoRef}
            src={src}
          />
        </div>
        {step === "variants" && (
          <Variants
            frames={frames}
            starred={starred}
            locales={locales}
            onLocales={setLocales}
            activeLocales={activeLocales}
            onActiveLocales={setActiveLocales}
            assignment={assignment}
            onAssign={(f, id) => setAssignment((a) => ({ ...a, [f]: id }))}
            titleOnHero={titleOnHero}
            onTitleOnHero={setTitleOnHero}
            titleScale={titleScale}
            onTitleScale={setTitleScale}
            approved={approved}
            onApprove={(k, v) => setApproved((a) => ({ ...a, [k]: v }))}
            onVariants={setVariants}
            onNext={() => setStep("audiences")}
          />
        )}
        {step === "audiences" && <Audiences frames={frames} starred={starred} variants={variants} locale={locales[0]} />}
      </div>
    </div>
  );
}
