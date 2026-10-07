"use client";

import { useEffect, useMemo, useState } from "react";
import JSZip from "jszip";
import { ensureFonts, loadImage, renderVariant } from "@/lib/art";
import { fmtTime } from "@/lib/frames";
import { FORMATS, type Format, type FormatId, type Frame, type Locale, type Variant } from "@/lib/types";
import { Button, QCDot, QCList, RailSection, Toggle } from "./ui";

export type VariantsProps = {
  frames: Frame[];
  starred: string[];
  locales: Locale[];
  onLocales: (l: Locale[]) => void;
  assignment: Record<FormatId, string>;
  onAssign: (format: FormatId, frameId: string) => void;
  titleOnHero: boolean;
  onTitleOnHero: (v: boolean) => void;
  titleScale: number;
  onTitleScale: (v: number) => void;
  onVariants: (v: Variant[]) => void;
  onNext: () => void;
};

export default function Variants(p: VariantsProps) {
  const [variants, setVariants] = useState<Variant[]>([]);
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [exporting, setExporting] = useState(false);

  const frameById = useMemo(() => Object.fromEntries(p.frames.map((f) => [f.id, f])), [p.frames]);
  const starredFrames = p.starred.map((id) => frameById[id]).filter(Boolean);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setBusy(true);
      await ensureFonts();
      const imgs: Record<string, HTMLImageElement> = {};
      for (const f of starredFrames) imgs[f.id] = await loadImage(f.dataUrl);
      const out: Variant[] = [];
      for (const loc of p.locales) {
        for (const fmt of FORMATS) {
          const frameId = p.assignment[fmt.id];
          const img = imgs[frameId];
          if (!img) continue;
          const r = renderVariant({ img, format: fmt, locale: loc, titleOnHero: p.titleOnHero, titleScale: p.titleScale, scale: 0.42 });
          out.push({ key: `${loc.code}:${fmt.id}`, locale: loc.code, format: fmt.id, frameId, dataUrl: r.dataUrl, qc: r.qc });
        }
      }
      if (!cancelled) {
        setVariants(out);
        p.onVariants(out);
        setBusy(false);
        if (!selectedKey && out[0]) setSelectedKey(out[0].key);
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [p.locales, p.assignment, p.titleOnHero, p.titleScale, p.starred]);

  const issues = variants.flatMap((v) => v.qc.filter((c) => c.status === "fail").map((c) => ({ v, c })));
  const sel = variants.find((v) => v.key === selectedKey) ?? variants[0];
  const selFormat = sel ? FORMATS.find((f) => f.id === sel.format)! : undefined;
  const selLocale = sel ? p.locales.find((l) => l.code === sel.locale)! : undefined;

  const updateLocale = (code: string, patch: Partial<Locale>) =>
    p.onLocales(p.locales.map((l) => (l.code === code ? { ...l, ...patch } : l)));

  const exportZip = async () => {
    setExporting(true);
    await ensureFonts();
    const zip = new JSZip();
    const imgs: Record<string, HTMLImageElement> = {};
    for (const f of starredFrames) imgs[f.id] = await loadImage(f.dataUrl);
    const manifest: Record<string, unknown>[] = [];
    for (const loc of p.locales) {
      for (const fmt of FORMATS) {
        const frameId = p.assignment[fmt.id];
        const img = imgs[frameId];
        if (!img) continue;
        const r = renderVariant({ img, format: fmt, locale: loc, titleOnHero: p.titleOnHero, titleScale: p.titleScale, scale: 1 });
        const name = `${loc.code}/${fmt.id}_${fmt.w}x${fmt.h}.jpg`;
        zip.file(name, r.dataUrl.split(",")[1], { base64: true });
        const frame = frameById[frameId];
        manifest.push({
          file: name,
          locale: loc.code,
          format: fmt.id,
          size: [fmt.w, fmt.h],
          source_frame: { id: frameId, timecode: fmtTime(frame.t) },
          themes: frame.tags?.themes ?? [],
          mood: frame.tags?.mood ?? null,
          qc: r.qc.map((c) => ({ id: c.id, status: c.status })),
        });
      }
    }
    zip.file("manifest.json", JSON.stringify({ title: p.locales[0].title, generated: new Date().toISOString(), assets: manifest }, null, 2));
    const blob = await zip.generateAsync({ type: "blob" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `keyframe-${p.locales[0].title.toLowerCase()}.zip`;
    a.click();
    setExporting(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <p className="text-[15px]">
            <span className="font-medium">{variants.length} renders</span>
            <span className="text-muted">
              , {issues.length === 0 ? "no issues" : `${issues.length} issue${issues.length > 1 ? "s" : ""}`}
              {busy ? ", rendering" : ""}
            </span>
          </p>
          <div className="flex items-center gap-5">
            <Toggle checked={p.titleOnHero} onChange={p.onTitleOnHero} label="Title on hero" />
            <label className="inline-flex items-center gap-2 text-[13px]">
              Title size
              <select
                value={p.titleScale}
                onChange={(e) => p.onTitleScale(Number(e.target.value))}
                className="h-7 rounded-[3px] bg-surface-2 px-2 text-[13px]"
              >
                <option value={0.7}>Small</option>
                <option value={1}>Regular</option>
                <option value={1.3}>Large</option>
              </select>
            </label>
            <Button onClick={exportZip} disabled={exporting || variants.length === 0}>
              {exporting ? "Packaging" : "Export set"}
            </Button>
          </div>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full border-separate border-spacing-0">
            <thead>
              <tr>
                <th className="text-left font-medium text-muted text-[12.5px] pb-2 pr-3 w-[150px]">Language</th>
                {FORMATS.map((f) => (
                  <th key={f.id} className="text-left font-medium text-[12.5px] pb-2 pr-3">
                    <span className="text-text">{f.label}</span>
                    <span className="block text-muted font-normal">{f.note}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {p.locales.map((loc) => (
                <tr key={loc.code} className="align-top">
                  <td className="pr-3 pb-3">
                    <p className="text-[13.5px] font-medium">{loc.label}</p>
                    <p className="text-[12px] text-muted">{loc.code}</p>
                  </td>
                  {FORMATS.map((fmt) => {
                    const v = variants.find((x) => x.locale === loc.code && x.format === fmt.id);
                    const fails = v?.qc.filter((c) => c.status === "fail").length ?? 0;
                    const isSel = sel?.key === v?.key;
                    return (
                      <td key={fmt.id} className="pr-3 pb-3">
                        {v ? (
                          <button
                            type="button"
                            onClick={() => setSelectedKey(v.key)}
                            className={`block rounded-[3px] overflow-hidden border text-left ${
                              isSel ? "border-text/70" : fails ? "border-fail/70" : "border-line"
                            }`}
                          >
                            <Cell v={v} fmt={fmt} />
                            <div className="flex items-center gap-1.5 px-2 py-1.5 bg-surface">
                              {v.qc.map((c) => (
                                <QCDot key={c.id} status={c.status} />
                              ))}
                              <span className="ml-auto text-[11.5px] text-muted">{fails ? `${fails} issue${fails > 1 ? "s" : ""}` : "clean"}</span>
                            </div>
                          </button>
                        ) : (
                          <div className="h-24 rounded-[3px] bg-surface" />
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <aside className="rounded-[4px] border border-line bg-ink-2 p-4 h-fit lg:sticky lg:top-20">
        {sel && selFormat && selLocale ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={sel.dataUrl} alt="" className="w-full rounded-[3px]" style={{ aspectRatio: `${selFormat.w}/${selFormat.h}` }} />
            <p className="mt-3 text-[15px] font-medium">
              {selFormat.label}, {selLocale.label}
            </p>
            <RailSection title="Checks">
              <QCList checks={sel.qc} />
            </RailSection>
            <RailSection title="Copy">
              <label className="block text-[12.5px] text-muted">
                Title
                <input
                  value={selLocale.title}
                  onChange={(e) => updateLocale(selLocale.code, { title: e.target.value })}
                  className="mt-1 h-8 w-full rounded-[3px] bg-surface-2 px-2 text-[13.5px] text-text"
                />
              </label>
              <label className="block text-[12.5px] text-muted mt-2">
                Tagline
                <input
                  value={selLocale.tagline}
                  onChange={(e) => updateLocale(selLocale.code, { tagline: e.target.value })}
                  className="mt-1 h-8 w-full rounded-[3px] bg-surface-2 px-2 text-[13.5px] text-text"
                />
              </label>
            </RailSection>
            <RailSection title={`Frame for every ${selFormat.label.split(" ")[0].toLowerCase()}`}>
              <div className="flex gap-2">
                {starredFrames.map((f, i) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => p.onAssign(sel.format, f.id)}
                    className={`rounded-[2px] overflow-hidden border-2 ${p.assignment[sel.format] === f.id ? "border-amber" : "border-transparent"}`}
                    title={`Starred ${i + 1}, ${fmtTime(f.t)}`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={f.dataUrl} alt="" className="h-12 aspect-video object-cover" />
                  </button>
                ))}
              </div>
            </RailSection>
          </>
        ) : (
          <p className="text-muted">Rendering the set.</p>
        )}
        <RailSection title="Open issues">
          {issues.length === 0 ? (
            <p className="text-[13px] text-muted">Every render passes the spec checks.</p>
          ) : (
            <ul className="space-y-1.5">
              {issues.slice(0, 8).map(({ v, c }) => (
                <li key={v.key + c.id}>
                  <button type="button" className="text-left text-[13px] hover:underline" onClick={() => setSelectedKey(v.key)}>
                    <QCDot status="fail" /> {FORMATS.find((f) => f.id === v.format)!.label}, {v.locale}: {c.label.toLowerCase()}
                  </button>
                </li>
              ))}
              {issues.length > 8 && <li className="text-[12.5px] text-muted">and {issues.length - 8} more</li>}
            </ul>
          )}
          <div className="mt-3">
            <Button primary onClick={p.onNext}>
              See who sees what
            </Button>
          </div>
        </RailSection>
      </aside>
    </div>
  );
}

function Cell({ v, fmt }: { v: Variant; fmt: Format }) {
  // Keep every cell the same height so the matrix reads as a grid.
  const h = 150;
  const w = Math.round((h * fmt.w) / fmt.h);
  return (
    <div className="bg-ink flex items-center justify-center" style={{ height: h, width: Math.max(w, 150) }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={v.dataUrl} alt="" style={{ height: h, width: w }} />
    </div>
  );
}
