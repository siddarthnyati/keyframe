"use client";

import { useState } from "react";
import { TrendingUp } from "lucide-react";
import { PageIntro } from "@/components/Shell";
import { Chip, Panel, PanelHeader, Row, Section } from "@/components/ui";
import { BRIEFS, SIGNALS, fmtDate, titleById } from "@/lib/data";

export default function Briefs() {
  const [id, setId] = useState("sintel");
  const b = BRIEFS.find((x) => x.title === id)!;
  const t = titleById[id];
  const s = SIGNALS[id];

  return (
    <div className="flex h-full min-h-0 flex-col">
      <PageIntro title="Briefs">
        The creative brief is the one document every vendor and agency works from. On the right, what fans are saying about the title this week, so the brief is written from
        evidence and not from the last meeting. The signals are illustrative here; in production they come from the social listening feed.
      </PageIntro>
      <div className="flex min-h-0 flex-1">
        <Panel side="left" width={240}>
          <PanelHeader title="Titles" />
          <ul className="py-1">
            {BRIEFS.map((x) => {
              const tt = titleById[x.title];
              const active = x.title === id;
              return (
                <li key={x.title}>
                  <button type="button" onClick={() => setId(x.title)} className={`flex w-full items-center gap-2.5 px-3 py-2 text-left ${active ? "bg-sel" : "hover:bg-hover"}`}>
                    <span className="aspect-[2/3] w-6 shrink-0 rounded-[2px]" style={{ background: `linear-gradient(160deg, hsl(${tt.hue} 45% 38%), hsl(${tt.hue} 40% 14%))` }} />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[12.5px]">{tt.name}</span>
                      <span className="block text-[11px] text-t3">
                        {x.status}, due {fmtDate(x.due)}
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </Panel>

        <div className="scroll-thin min-w-0 flex-1 overflow-y-auto px-6 py-5">
          <div className="flex items-baseline justify-between">
            <h2 className="text-[16px] font-semibold">{t.name} launch brief</h2>
            <span className="text-[12px] text-t3">
              {b.status}. {b.owner}. Due {fmtDate(b.due)}.
            </span>
          </div>
          {b.status === "Not started" ? (
            <div className="mt-4 rounded-[8px] border border-dashed border-line-strong p-6 text-[13px] leading-5 text-t2">
              No brief yet. Launches {fmtDate(t.launch)} in {t.markets.length} markets. When the producer starts it, the objective, audience and must-haves are proposed from the
              plan and the signals, and the producer edits before anyone sees it.
            </div>
          ) : (
            <div className="mt-4 max-w-[720px] space-y-4">
              <Field label="Objective">{b.objective}</Field>
              <Field label="Audience">{b.audience}</Field>
              <Field label="Key message">
                <span className="text-[15px]">{b.message}</span>
              </Field>
              <Field label="Tone">{b.tone}</Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Must have">
                  <ul className="list-disc space-y-1 pl-4">
                    {b.mustHave.map((x) => (
                      <li key={x}>{x}</li>
                    ))}
                  </ul>
                </Field>
                <Field label="Avoid">
                  <ul className="list-disc space-y-1 pl-4">
                    {b.avoid.map((x) => (
                      <li key={x}>{x}</li>
                    ))}
                  </ul>
                </Field>
              </div>
              <Field label="Deliverables and markets">
                {t.markets.length} markets, six deliverables each: key art set, trailer, dubbed trailer, subtitles, social cuts, CRM email. Dates work back from {fmtDate(t.launch)} on
                the launch board.
              </Field>
            </div>
          )}
        </div>

        <Panel side="right" width={360}>
          <PanelHeader
            title="What fans are saying"
            right={
              <span className="inline-flex items-center gap-1 text-[11px] text-t3">
                <TrendingUp size={12} /> {s ? s.week : "no data"}
              </span>
            }
          />
          {s ? (
            <div className="scroll-thin min-h-0 flex-1 overflow-y-auto">
              <Section title="This week">
                <Row label="Mentions">
                  <span className="mono">{s.volume.toLocaleString()}</span>
                </Row>
                <Row label="Positive">
                  <span className="mono">{Math.round(s.sentiment * 100)}%</span>
                </Row>
              </Section>
              <Section title="Trending phrases">
                <ul className="space-y-2.5">
                  {s.top.map((x) => (
                    <li key={x.phrase}>
                      <div className="flex items-baseline justify-between gap-2">
                        <span className="text-[13px] font-medium">&ldquo;{x.phrase}&rdquo;</span>
                        <span className="mono shrink-0 text-[11px] text-t3">
                          {x.mentions.toLocaleString()} <span className={x.change >= 0 ? "text-ok" : "text-err"}>{x.change >= 0 ? "+" : ""}{Math.round(x.change * 100)}%</span>
                        </span>
                      </div>
                      <p className="text-[12px] leading-4 text-t2">{x.note}</p>
                      <p className="text-[11px] text-t3">{x.where}</p>
                    </li>
                  ))}
                </ul>
              </Section>
              <Section title="Who is talking">
                <ul className="space-y-1.5">
                  {s.audiences.map((a) => (
                    <li key={a.name} className="text-[12.5px]">
                      <div className="flex items-center justify-between">
                        <span>{a.name}</span>
                        <span className="mono text-[11px] text-t3">{Math.round(a.share * 100)}%</span>
                      </div>
                      <div className="mt-1 h-1 overflow-hidden rounded-full bg-bg2">
                        <div className="h-full bg-t2" style={{ width: `${a.share * 100}%` }} />
                      </div>
                      <span className="text-[11.5px] text-t3">{a.lean}</span>
                    </li>
                  ))}
                </ul>
              </Section>
              <Section title="What to do with it">
                <ul className="space-y-2">
                  {s.takeaways.map((x) => (
                    <li key={x} className="flex gap-2 text-[12.5px] leading-5">
                      <Chip tone="accent">do</Chip>
                      <span>{x}</span>
                    </li>
                  ))}
                </ul>
              </Section>
            </div>
          ) : (
            <p className="p-3 text-[12.5px] leading-5 text-t2">Listening starts six weeks before launch. Nothing yet for {t.name}.</p>
          )}
        </Panel>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="label mb-1">{label}</p>
      <div className="text-[13px] leading-5 text-t1">{children}</div>
    </div>
  );
}
