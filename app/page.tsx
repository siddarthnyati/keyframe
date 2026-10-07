"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Shortlist from "@/components/Shortlist";
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
  const [videoName, setVideoName] = useState("Sintel");
  const [duration, setDuration] = useState(0);
  const [frames, setFrames] = useState<Frame[]>([]);
  const [status, setStatus] = useState<{ phase: "idle" | "sampling" | "tagging" | "ready"; done: number; total: number; mock?: boolean; note?: string }>({ phase: "idle", done: 0, total: 0 });
  const [starred, setStarred] = useState<string[]>([]);
  const [step, setStep] = useState<Step>("shortlist");
  const [locales, setLocales] = useState<Locale[]>(DEFAULT_LOCALES);
  const [assignment, setAssignment] = useState<Record<FormatId, string>>({ poster: "", cover: "", hero: "", social: "" });
  const [titleOnHero, setTitleOnHero] = useState(false);
  const [titleScale, setTitleScale] = useState(1);
  const [variants, setVariants] = useState<Variant[]>([]);

  const run = useCallback(async () => {
    const v = videoRef.current;
    if (!v) return;
    setFrames([]);
    setStarred([]);
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

  const toggleStar = (id: string) =>
    setStarred((s) => (s.includes(id) ? s.filter((x) => x !== id) : s.length >= 3 ? s : [...s, id]));

  const goVariants = () => {
    const [a, b, c] = starred;
    setAssignment({ poster: a, cover: b ?? a, hero: c ?? b ?? a, social: a });
    setStep("variants");
  };

  const onDrop = (file: File) => {
    setVideoName(file.name.replace(/\.[^.]+$/, ""));
    setSrc(URL.createObjectURL(file));
    setStep("shortlist");
  };

  return (
    <div className="min-h-full">
      <video ref={videoRef} src={src} muted playsInline preload="auto" className="hidden" />
      <header className="sticky top-0 z-10 border-b border-line bg-ink/90 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-[1440px] items-center gap-4 md:gap-8 px-4 md:px-6">
          <span className="text-[16px] font-semibold tracking-tight">Keyframe</span>
          <nav className="flex items-center gap-1">
            {STEPS.map((s, i) => {
              const enabled = s.id === "shortlist" || starred.length > 0;
              const active = step === s.id;
              return (
                <button
                  key={s.id}
                  type="button"
                  disabled={!enabled}
                  onClick={() => (s.id === "variants" ? goVariants() : setStep(s.id))}
                  className={`h-8 rounded-[3px] px-3 text-[13.5px] transition-colors disabled:opacity-40 ${
                    active ? "bg-surface-2 text-text" : "text-muted hover:text-text"
                  }`}
                >
                  <span className="tabular-nums text-dim mr-1.5">{i + 1}</span>
                  {s.label}
                </button>
              );
            })}
          </nav>
          <p className="ml-auto hidden md:block text-[12.5px] text-muted">A trailer in, a launch art set out, with the spec checks built in.</p>
        </div>
      </header>
      <main className="mx-auto max-w-[1440px] px-6 py-6">
        {step === "shortlist" && (
          <Shortlist frames={frames} starred={starred} onStar={toggleStar} onNext={goVariants} status={status} onDrop={onDrop} videoName={videoName} duration={duration} />
        )}
        {step === "variants" && (
          <Variants
            frames={frames}
            starred={starred}
            locales={locales}
            onLocales={setLocales}
            assignment={assignment}
            onAssign={(f, id) => setAssignment((a) => ({ ...a, [f]: id }))}
            titleOnHero={titleOnHero}
            onTitleOnHero={setTitleOnHero}
            titleScale={titleScale}
            onTitleScale={setTitleScale}
            onVariants={setVariants}
            onNext={() => setStep("audiences")}
          />
        )}
        {step === "audiences" && <Audiences frames={frames} starred={starred} variants={variants} locale={locales[0]} />}
      </main>
      <footer className="mx-auto max-w-[1440px] px-6 pb-8 text-[12px] text-dim">
        Sample footage: Sintel trailer, Blender Foundation, CC BY 3.0. Service badge and spec rules are illustrative. No generative art is used, only frames from the source.
      </footer>
    </div>
  );
}
