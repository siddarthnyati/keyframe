"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import Poster from "@/components/Poster";
import { PageIntro } from "@/components/Shell";
import { Ring, StatusPill, STATUS_TONE } from "@/components/status";
import { Panel, PanelHeader, Row, Section, Select, StatusDot } from "@/components/ui";
import { DELIVERABLES, STATUS_LABEL, TITLES, cellsFor, daysToLaunch, fmtDate, marketByCode, readiness, titleById, type Cell } from "@/lib/data";

export default function LaunchesPage() {
  return (
    <Suspense>
      <Launches />
    </Suspense>
  );
}

function Launches() {
  const params = useSearchParams();
  const initial = params.get("title") && titleById[params.get("title")!] ? params.get("title")! : "terminal";
  const [titleId, setTitleId] = useState(initial);
  const t = titleById[titleId];
  const cells = cellsFor(titleId);
  const r = readiness(titleId);
  const [selKey, setSelKey] = useState<string | null>(params.get("cell") ?? (r.blockers[0] ? `${r.blockers[0].market}:${r.blockers[0].deliverable}` : null));
  const sel = cells.find((c) => `${c.market}:${c.deliverable}` === selKey) ?? r.blockers[0] ?? cells[0];
  const dtl = daysToLaunch(t);

  return (
    <div className="flex h-full min-h-0 flex-col">
      <PageIntro
        title="Check the launch"
        right={
          <label className="flex items-center gap-2 text-[12px] text-t2">
            Title
            <Select
              value={titleId}
              onChange={(v) => {
                setTitleId(v);
                setSelKey(null);
              }}
              options={TITLES.filter((x) => x.stage !== "live").map((x) => ({ value: x.id, label: `${x.name}, ${fmtDate(x.launch)}` }))}
            />
          </label>
        }
      >
        Priya&rsquo;s tracker, kept for her. Every market, every deliverable, who owes it and when. Spec checks run as files arrive, so a rejection shows here on the day, not at upload.
      </PageIntro>

      <div className="flex min-h-0 flex-1 border-t border-line">
        <div className="scroll-thin min-w-0 flex-1 overflow-auto">
          <div className="flex items-center gap-4 border-b border-line px-8 py-3">
            <Poster t={t} w={44} rounded={4} />
            <Ring pct={r.pct} size={40} />
            <div>
              <p className="text-[14px] font-medium">
                {t.name}, {t.stage === "planning" ? "planning" : `launches ${fmtDate(t.launch)}`}, {dtl} days out
              </p>
              <p className="text-[12.5px] text-t2">
                {r.approved} of {r.total} approved, {r.inReview} in review{r.blockers.length ? `, ${r.blockers.length} blocking` : ", nothing blocking"}. {t.producer} owns the launch.
              </p>
            </div>
            <ul className="ml-auto flex gap-3 text-[11px] text-t3">
              {(Object.keys(STATUS_LABEL) as (keyof typeof STATUS_LABEL)[]).map((s) => (
                <li key={s} className="flex items-center gap-1.5">
                  <span className={`inline-block size-1.5 rounded-full ${STATUS_TONE[s].dot}`} />
                  {STATUS_LABEL[s]}
                </li>
              ))}
            </ul>
          </div>
          <table className="w-full border-separate border-spacing-0 text-[12.5px]">
            <thead className="sticky top-0 z-10 bg-app">
              <tr>
                <th className="w-[200px] px-8 py-2 text-left text-[11px] font-medium text-t3">Market</th>
                {DELIVERABLES.map((d) => (
                  <th key={d.id} className="py-2 pr-3 text-left">
                    <span className="block text-[12px] font-medium text-t1">{d.label}</span>
                    <span className="block text-[11px] font-normal text-t3">{d.who}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {t.markets.map((code) => {
                const m = marketByCode[code];
                return (
                  <tr key={code}>
                    <td className="border-t border-line px-8 py-2 align-top">
                      <span className="block text-[13px]">{m.name}</span>
                      <span className="mono block text-[11px] text-t3">{m.locale}</span>
                    </td>
                    {DELIVERABLES.map((d) => {
                      const c = cells.find((x) => x.market === code && x.deliverable === d.id);
                      if (!c)
                        return (
                          <td key={d.id} className="border-t border-line py-2 pr-3 align-top">
                            <span className="text-[11px] text-t3">n/a</span>
                          </td>
                        );
                      const key = `${c.market}:${c.deliverable}`;
                      const fails = (c.checks ?? []).filter((k) => k.status === "fail").length;
                      const isSel = sel && `${sel.market}:${sel.deliverable}` === key;
                      return (
                        <td key={d.id} className="border-t border-line py-2 pr-3 align-top">
                          <button
                            type="button"
                            onClick={() => setSelKey(key)}
                            className={`block w-full rounded-[5px] border px-2 py-1.5 text-left transition-colors ${isSel ? "border-accent bg-sel" : "border-transparent hover:bg-hover"}`}
                          >
                            <StatusPill status={c.status} small />
                            <span className="mt-1 block text-[11px] text-t3">
                              due {fmtDate(c.due)}
                              {fails ? <span className="text-err"> · {fails} check failing</span> : ""}
                            </span>
                          </button>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <Panel side="right" width={340}>
          <PanelHeader title="Deliverable" />
          {sel ? <CellDetail c={sel} /> : null}
          <Section title={`Blocking ${t.name}`}>
            {r.blockers.length === 0 ? (
              <p className="text-[12.5px] text-t2">Nothing. Every deliverable is approved or on track.</p>
            ) : (
              <ul className="space-y-2">
                {r.blockers.map((c) => (
                  <li key={`${c.market}:${c.deliverable}`}>
                    <button type="button" onClick={() => setSelKey(`${c.market}:${c.deliverable}`)} className="flex w-full items-start gap-2 text-left hover:text-t1">
                      <span className="pt-1.5">
                        <StatusDot status={c.status === "late" ? "warn" : "fail"} />
                      </span>
                      <span className="text-[12.5px] leading-5 text-t2">
                        <span className="text-t1">
                          {marketByCode[c.market].name}, {DELIVERABLES.find((d) => d.id === c.deliverable)!.label.toLowerCase()}
                        </span>
                        . {c.note}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </Section>
        </Panel>
      </div>
    </div>
  );
}

function CellDetail({ c }: { c: Cell }) {
  const d = DELIVERABLES.find((x) => x.id === c.deliverable)!;
  const m = marketByCode[c.market];
  return (
    <>
      <div className="border-b border-line p-3">
        <p className="text-[13.5px] font-medium">
          {m.name}, {d.label.toLowerCase()}
        </p>
        <p className="mt-1">
          <StatusPill status={c.status} />
        </p>
        {c.note && <p className="mt-2 text-[12.5px] leading-5 text-t1">{c.note}</p>}
      </div>
      <Section title="Details">
        <Row label="Owner">{c.owner}</Row>
        <Row label="Due">
          <span className="mono">{fmtDate(c.due)}</span>
        </Row>
        <Row label="Locale">
          <span className="mono">{m.locale}</span>
        </Row>
        <Row label="Title">{titleById[c.title].name}</Row>
      </Section>
      <Section title="Spec checks">
        {c.checks ? (
          <ul className="space-y-1.5">
            {c.checks.map((k) => (
              <li key={k.label} className="flex items-center gap-2 text-[12.5px]">
                <StatusDot status={k.status} />
                <span className={k.status === "fail" ? "text-t1" : "text-t2"}>{k.label}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-[12.5px] leading-5 text-t2">
            {c.status === "approved" ? "All checks passed on receipt." : c.status === "planned" ? "Checks run when the file arrives." : "Checks run on receipt; none failing."}
          </p>
        )}
      </Section>
    </>
  );
}
