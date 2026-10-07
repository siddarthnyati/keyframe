"use client";

import { useEffect, useMemo, useState } from "react";
import JSZip from "jszip";
import { AlertTriangle, Check, ChevronRight, Download, X } from "lucide-react";
import { ensureFonts, loadImage, renderVariant } from "@/lib/art";
import { fmtTime } from "@/lib/frames";
import { FORMATS, type Format, type FormatId, type Frame, type Locale, type Variant } from "@/lib/types";
import { Button, Empty, IconButton, Input, Panel, PanelHeader, QCList, Row, Section, Segmented, Select, StatusDot, Toggle } from "./ui";

export type VariantsProps = {
  frames: Frame[];
  starred: string[];
  locales: Locale[];
  onLocales: (l: Locale[]) => void;
  activeLocales: string[];
  onActiveLocales: (codes: string[]) => void;
  assignment: Record<FormatId, string>;
  onAssign: (format: FormatId, frameId: string) => void;
  titleOnHero: boolean;
  onTitleOnHero: (v: boolean) => void;
  titleScale: number;
  onTitleScale: (v: number) => void;
  approved: Record<string, boolean>;
  onApprove: (key: string, v: boolean) => void;
  onVariants: (v: Variant[]) => void;
  onNext: () => void;
};

type FormatFilter = "all" | FormatId;
const CELL_H = 128;

export default function Variants(p: VariantsProps) {
  const [variants, setVariants] = useState<Variant[]>([]);
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [formatFilter, setFormatFilter] = useState<FormatFilter>("all");
  const [busy, setBusy] = useState(false);
  const [sheet, setSheet] = useState(false);
  const [onlyApproved, setOnlyApproved] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [exportPick, setExportPick] = useState<Record<string, boolean>>({});

  const frameById = useMemo(() => Object.fromEntries(p.frames.map((f) => [f.id, f])), [p.frames]);
  const starredFrames = p.starred.map((id) => frameById[id]).filter(Boolean);
  const locales = p.locales.filter((l) => p.activeLocales.includes(l.code));
  const formats = FORMATS.filter((f) => formatFilter === "all" || f.id === formatFilter);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setBusy(true);
      await ensureFonts();
      const imgs: Record<string, HTMLImageElement> = {};
      for (const f of starredFrames) imgs[f.id] = await loadImage(f.dataUrl);
      const out: Variant[] = [];
      for (const loc of locales) {
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
        setSelectedKey((k) => (k && out.some((v) => v.key === k) ? k : (out[0]?.key ?? null)));
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [p.locales, p.activeLocales, p.assignment, p.titleOnHero, p.titleScale, p.starred]);

  const issues = variants.flatMap((v) => v.qc.filter((c) => c.status === "fail").map((c) => ({ v, c })));
  const approvedCount = variants.filter((v) => p.approved[v.key]).length;
  const sel = variants.find((v) => v.key === selectedKey) ?? variants[0];
  const selFormat = sel ? FORMATS.find((f) => f.id === sel.format)! : undefined;
  const selLocale = sel ? p.locales.find((l) => l.code === sel.locale)! : undefined;
  const selFails = sel?.qc.filter((c) => c.status === "fail").length ?? 0;

  const updateLocale = (code: string, patch: Partial<Locale>) => p.onLocales(p.locales.map((l) => (l.code === code ? { ...l, ...patch } : l)));
  const toggleLocale = (code: string) =>
    p.onActiveLocales(p.activeLocales.includes(code) ? p.activeLocales.filter((c) => c !== code) : [...p.activeLocales, code]);

  const openSheet = () => {
    const pick: Record<string, boolean> = {};
    for (const v of variants) pick[v.key] = onlyApproved ? !!p.approved[v.key] : true;
    setExportPick(pick);
    setSheet(true);
  };
  const setOnlyApprovedAndPick = (v: boolean) => {
    setOnlyApproved(v);
    setExportPick((prev) => {
      const next: Record<string, boolean> = {};
      for (const x of variants) next[x.key] = v ? !!p.approved[x.key] : (prev[x.key] ?? true);
      return next;
    });
  };

  const exportZip = async () => {
    setExporting(true);
    await ensureFonts();
    const zip = new JSZip();
    const imgs: Record<string, HTMLImageElement> = {};
    for (const f of starredFrames) imgs[f.id] = await loadImage(f.dataUrl);
    const manifest: Record<string, unknown>[] = [];
    for (const v of variants) {
      if (!exportPick[v.key]) continue;
      const loc = p.locales.find((l) => l.code === v.locale)!;
      const fmt = FORMATS.find((f) => f.id === v.format)!;
      const img = imgs[v.frameId];
      if (!img) continue;
      const r = renderVariant({ img, format: fmt, locale: loc, titleOnHero: p.titleOnHero, titleScale: p.titleScale, scale: 1 });
      const name = `${loc.code}/${fmt.id}_${fmt.w}x${fmt.h}.jpg`;
      zip.file(name, r.dataUrl.split(",")[1], { base64: true });
      const frame = frameById[v.frameId];
      manifest.push({
        file: name,
        locale: loc.code,
        format: fmt.id,
        size: [fmt.w, fmt.h],
        approved: !!p.approved[v.key],
        source_frame: { id: v.frameId, timecode: fmtTime(frame.t) },
        themes: frame.tags?.themes ?? [],
        mood: frame.tags?.mood ?? null,
        qc: r.qc.map((c) => ({ id: c.id, status: c.status })),
      });
    }
    zip.file("manifest.json", JSON.stringify({ title: p.locales[0].title, generated: new Date().toISOString(), assets: manifest }, null, 2));
    const blob = await zip.generateAsync({ type: "blob" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `keyframe-${p.locales[0].title.toLowerCase()}.zip`;
    a.click();
    setExporting(false);
    setSheet(false);
  };

  const pickedCount = Object.values(exportPick).filter(Boolean).length;

  return (
    <div className="relative flex min-h-0 min-w-0 flex-1">
      {/* Source + languages */}
      <Panel side="left">
        <PanelHeader title="Source" />
        <div className="scroll-thin min-h-0 flex-1 overflow-y-auto">
          <Section title="Shortlisted frames">
            <ul className="space-y-2">
              {starredFrames.map((f, i) => {
                const uses = FORMATS.filter((fmt) => p.assignment[fmt.id] === f.id).map((fmt) => fmt.label.split(" ")[0]);
                return (
                  <li key={f.id} className="flex items-center gap-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={f.dataUrl} alt="" className="aspect-video h-9 rounded-[4px] object-cover" />
                    <span className="min-w-0 flex-1">
                      <span className="block text-[12px]">
                        <span className="mono text-t2">{i + 1}</span> {fmtTime(f.t)}
                      </span>
                      <span className="block truncate text-[11px] text-t3">{uses.length ? uses.join(", ") : "unused"}</span>
                    </span>
                  </li>
                );
              })}
            </ul>
          </Section>
          <Section title="Languages" right={<span className="mono text-[11px] text-t3">{locales.length}</span>}>
            <ul className="space-y-1">
              {p.locales.map((l) => (
                <li key={l.code}>
                  <label className="flex h-7 cursor-pointer items-center gap-2 rounded-[4px] px-1 hover:bg-hover">
                    <input type="checkbox" checked={p.activeLocales.includes(l.code)} onChange={() => toggleLocale(l.code)} />
                    <span className="flex-1 text-[12.5px]">{l.label}</span>
                    <span className="mono text-[11px] text-t3">{l.code}</span>
                  </label>
                </li>
              ))}
            </ul>
          </Section>
          <Section title="Rules">
            <p className="text-[12px] leading-5 text-t2">Poster 2:3 is mandatory. Hero carries no text. Titles stay legible at 120px. Taglines fit the 6% safe area.</p>
          </Section>
        </div>
      </Panel>

      {/* Matrix */}
      <div className="flex min-w-0 flex-1 flex-col bg-app">
        <div className="flex h-10 shrink-0 items-center gap-3 border-b border-line px-3">
          <Segmented<FormatFilter>
            value={formatFilter}
            onChange={setFormatFilter}
            options={[{ id: "all", label: "All" }, ...FORMATS.map((f) => ({ id: f.id, label: f.label.split(" ")[0] }))]}
          />
          <span className="text-[12px] text-t2">
            {variants.length} renders, {issues.length === 0 ? "no issues" : `${issues.length} issue${issues.length > 1 ? "s" : ""}`}, {approvedCount} approved
            {busy ? ", rendering" : ""}
          </span>
          <span className="ml-auto" />
          <Toggle checked={p.titleOnHero} onChange={p.onTitleOnHero} label="Title on hero" />
          <Select<number>
            value={p.titleScale}
            onChange={p.onTitleScale}
            options={[
              { value: 0.7, label: "Title small" },
              { value: 1, label: "Title regular" },
              { value: 1.3, label: "Title large" },
            ]}
          />
          <Button primary onClick={openSheet} disabled={variants.length === 0}>
            <Download size={13} /> Export
          </Button>
        </div>
        <div className="scroll-thin min-h-0 flex-1 overflow-auto p-4">
          <div className="grid gap-x-3 gap-y-4" style={{ gridTemplateColumns: `120px repeat(${formats.length}, max-content)` }}>
            <span />
            {formats.map((f) => (
              <span key={f.id} className="pb-1">
                <span className="block text-[12.5px] font-medium">{f.label}</span>
                <span className="block text-[11px] text-t3">{f.note}</span>
              </span>
            ))}
            {locales.map((loc) => (
              <Fragment key={loc.code}>
                <span className="pt-1">
                  <span className="block text-[12.5px] font-medium">{loc.label}</span>
                  <span className="mono block text-[11px] text-t3">{loc.code}</span>
                </span>
                {formats.map((fmt) => {
                  const v = variants.find((q) => q.locale === loc.code && q.format === fmt.id);
                  const fails = v?.qc.filter((c) => c.status === "fail").length ?? 0;
                  const isSel = sel?.key === v?.key;
                  const ok = v ? !!p.approved[v.key] : false;
                  const w = Math.round((CELL_H * fmt.w) / fmt.h);
                  return (
                    <div key={fmt.id}>
                      {v ? (
                        <button
                          type="button"
                          onClick={() => setSelectedKey(v.key)}
                          className={`relative block overflow-hidden rounded-[6px] border bg-player ${isSel ? "border-accent" : "border-line hover:border-line-strong"}`}
                          style={{ height: CELL_H, width: w }}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={v.dataUrl} alt="" className="h-full w-full" />
                          <span className="absolute right-1 top-1 flex gap-1">
                            {ok && (
                              <span className="inline-flex size-5 items-center justify-center rounded-[3px] bg-ok text-app">
                                <Check size={12} strokeWidth={3} />
                              </span>
                            )}
                            {fails > 0 && (
                              <span className="mono inline-flex h-5 items-center gap-1 rounded-[3px] bg-warn px-1.5 text-[10.5px] font-medium text-app">
                                <AlertTriangle size={11} /> {fails}
                              </span>
                            )}
                          </span>
                        </button>
                      ) : (
                        <div className="shimmer rounded-[6px]" style={{ height: CELL_H, width: w }} />
                      )}
                    </div>
                  );
                })}
              </Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* Inspector */}
      <Panel side="right">
        <PanelHeader title="Variant" right={sel ? <span className="mono text-[11px] text-t3">{sel.key}</span> : undefined} />
        <div className="scroll-thin min-h-0 flex-1 overflow-y-auto">
          {sel && selFormat && selLocale ? (
            <>
              <div className="border-b border-line p-3">
                <div className="flex h-[220px] items-center justify-center rounded-[6px] bg-player">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={sel.dataUrl} alt="" className="max-h-full max-w-full rounded-[4px]" />
                </div>
                <div className="mt-3">
                  <Button full primary={!p.approved[sel.key]} onClick={() => p.onApprove(sel.key, !p.approved[sel.key])} disabled={selFails > 0 && !p.approved[sel.key]}>
                    <Check size={13} /> {p.approved[sel.key] ? "Approved, click to undo" : selFails > 0 ? "Fix issues to approve" : "Approve"}
                  </Button>
                </div>
              </div>
              <Section title="Variant">
                <Row label="Language">{selLocale.label}</Row>
                <Row label="Format">{selFormat.label}</Row>
                <Row label="Size">
                  <span className="mono">
                    {selFormat.w} × {selFormat.h}
                  </span>
                </Row>
                <Row label="Source frame">
                  <span className="flex gap-1.5">
                    {starredFrames.map((f, i) => (
                      <button
                        key={f.id}
                        type="button"
                        onClick={() => p.onAssign(sel.format, f.id)}
                        className={`overflow-hidden rounded-[3px] border-2 ${p.assignment[sel.format] === f.id ? "border-accent" : "border-transparent hover:border-line-strong"}`}
                        title={`Frame ${i + 1}, ${fmtTime(f.t)}`}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={f.dataUrl} alt="" className="aspect-video h-8 object-cover" />
                      </button>
                    ))}
                  </span>
                </Row>
              </Section>
              <Section title="Copy">
                <Row label="Title">
                  <Input value={selLocale.title} onChange={(v) => updateLocale(selLocale.code, { title: v })} />
                </Row>
                <Row label="Tagline">
                  <Input value={selLocale.tagline} onChange={(v) => updateLocale(selLocale.code, { tagline: v })} />
                </Row>
              </Section>
              <Section title="Checks" right={<span className="mono text-[11px] text-t3">{selFails ? `${selFails} failing` : "all pass"}</span>}>
                <QCList checks={sel.qc} />
              </Section>
            </>
          ) : (
            <Empty>Rendering the set.</Empty>
          )}
          <Section title="Open issues" right={<span className="mono text-[11px] text-t3">{issues.length}</span>}>
            {issues.length === 0 ? (
              <p className="text-[12px] leading-5 text-t2">Every render passes the spec checks.</p>
            ) : (
              <ul className="space-y-1">
                {issues.slice(0, 8).map(({ v, c }) => (
                  <li key={v.key + c.id}>
                    <button type="button" className="flex items-center gap-2 text-left text-[12px] hover:text-t1" onClick={() => setSelectedKey(v.key)}>
                      <StatusDot status="fail" />
                      <span className="text-t2">
                        {FORMATS.find((f) => f.id === v.format)!.label.split(" ")[0]}, {v.locale}: {c.label.toLowerCase()}
                      </span>
                    </button>
                  </li>
                ))}
                {issues.length > 8 && <li className="text-[11.5px] text-t3">and {issues.length - 8} more</li>}
              </ul>
            )}
          </Section>
        </div>
        <div className="border-t border-line p-3">
          <Button full primary onClick={p.onNext}>
            See who sees what <ChevronRight size={14} />
          </Button>
        </div>
      </Panel>

      {/* Export sheet */}
      {sheet && (
        <>
          <button type="button" aria-label="Close export" className="absolute inset-0 z-20 bg-black/40" onClick={() => setSheet(false)} />
          <div className="sheet-in absolute bottom-0 right-0 top-0 z-30 flex w-[380px] flex-col border-l border-line bg-panel">
            <PanelHeader
              title="Export"
              right={
                <IconButton title="Close" onClick={() => setSheet(false)}>
                  <X size={14} />
                </IconButton>
              }
            />
            <div className="border-b border-line px-3 py-2">
              <Toggle checked={onlyApproved} onChange={setOnlyApprovedAndPick} label="Only approved renders" />
            </div>
            <ul className="scroll-thin min-h-0 flex-1 overflow-y-auto py-1">
              {variants.map((v) => {
                const fmt = FORMATS.find((f) => f.id === v.format)!;
                const loc = p.locales.find((l) => l.code === v.locale)!;
                const fails = v.qc.filter((c) => c.status === "fail").length;
                return (
                  <li key={v.key}>
                    <label className="flex h-8 cursor-pointer items-center gap-2 px-3 hover:bg-hover">
                      <input type="checkbox" checked={!!exportPick[v.key]} onChange={(e) => setExportPick((s) => ({ ...s, [v.key]: e.target.checked }))} />
                      <span className="flex-1 text-[12.5px]">
                        {fmt.label}, {loc.label}
                      </span>
                      <span className="mono text-[11px] text-t3">
                        {fmt.w}×{fmt.h}
                      </span>
                      <StatusDot status={p.approved[v.key] ? "ok" : fails ? "fail" : "idle"} />
                    </label>
                  </li>
                );
              })}
            </ul>
            <div className="border-t border-line p-3">
              <Button full primary onClick={exportZip} disabled={exporting || pickedCount === 0}>
                <Download size={13} /> {exporting ? "Packaging" : `Download ${pickedCount} file${pickedCount === 1 ? "" : "s"} as ZIP`}
              </Button>
              <p className="mt-2 text-[11.5px] leading-4 text-t3">Full delivery sizes plus a manifest with locale, source frame, theme tags and check results.</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function Fragment({ children }: { children: React.ReactNode; key?: string }) {
  return <>{children}</>;
}

export type { Format };
