"use client";

import { useState } from "react";
import { ExternalLink } from "lucide-react";
import Poster from "@/components/Poster";
import { PageIntro } from "@/components/Shell";
import { Chip, Panel, PanelHeader, Section } from "@/components/ui";
import { BRIEFS, SIGNALS, fmtDate, titleById } from "@/lib/data";

export default function Briefs() {
  const [id, setId] = useState(BRIEFS[0].title);
  const b = BRIEFS.find((x) => x.title === id)!;
  const t = titleById[id];
  const s = SIGNALS[id];

  return (
    <div className="flex h-full min-h-0 flex-col">
      <PageIntro title="Write the brief">
        The brief Dev writes and every agency and vendor works from, beside what is being said about the title this week, so it is written from evidence.
      </PageIntro>
      <div className="flex min-h-0 flex-1 border-t border-line">
        <Panel side="left" width={236}>
          <ul className="py-1">
            {BRIEFS.map((x) => {
              const tt = titleById[x.title];
              const active = x.title === id;
              return (
                <li key={x.title}>
                  <button type="button" onClick={() => setId(x.title)} className={`flex w-full items-center gap-2.5 px-3 py-2 text-left ${active ? "bg-sel" : "hover:bg-hover"}`}>
                    <Poster t={tt} w={30} rounded={3} />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[12.5px]">{tt.name}</span>
                      <span className="block text-[11px] text-t3">
                        {x.status}, {fmtDate(tt.launch)}
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </Panel>

        <div className="scroll-thin min-w-0 flex-1 overflow-y-auto px-8 py-6">
          <div className="flex gap-5">
            <Poster t={t} w={110} rounded={6} />
            <div className="min-w-0">
              <h2 className="text-[18px] font-semibold tracking-tight">{t.name}</h2>
              <p className="text-[12.5px] text-t2">
                {t.kind}. Launches {fmtDate(t.launch)}, {t.markets.length} markets, {t.release}.
              </p>
              <p className="mt-2 max-w-[560px] text-[13px] leading-5 text-t1">{t.logline}</p>
              <p className="mt-2 text-[12px] text-t3">
                Brief {b.status.toLowerCase()}. {b.owner}, due {fmtDate(b.due)}.
              </p>
            </div>
          </div>
          {b.status === "Not started" ? (
            <div className="mt-6 max-w-[640px] rounded-[8px] border border-dashed border-line-strong p-5 text-[13px] leading-5 text-t2">
              No brief yet. When the producer starts it, objective, audience and must-haves are proposed from the plan and this week&rsquo;s coverage, and the producer edits before
              anyone sees it.
            </div>
          ) : (
            <div className="mt-6 max-w-[640px] space-y-5">
              <Field label="Objective">{b.objective}</Field>
              <Field label="Audience">{b.audience}</Field>
              <Field label="Key message">
                <span className="text-[16px] leading-6">{b.message}</span>
              </Field>
              <Field label="Tone">{b.tone}</Field>
              <div className="grid grid-cols-2 gap-5">
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
            </div>
          )}
        </div>

        <Panel side="right" width={380}>
          <PanelHeader title="Said this week" right={s ? <span className="text-[11px] text-t3">{s.week}</span> : undefined} />
          {s ? (
            <div className="scroll-thin min-h-0 flex-1 overflow-y-auto">
              <div className="border-b border-line px-3 py-3">
                <p className="text-[13px] leading-5 text-t1">{s.headline}</p>
              </div>
              <Section title="Coverage and chatter">
                <ul className="space-y-3">
                  {s.top.map((x) => (
                    <li key={x.phrase}>
                      <p className="text-[13px] font-medium leading-5">{x.phrase}</p>
                      <p className="text-[12px] leading-4 text-t2">{x.note}</p>
                      <a href={x.source} target="_blank" rel="noreferrer" className="mt-0.5 inline-flex items-center gap-1 text-[11px] text-t3 hover:text-t1">
                        {x.where}, {x.date} <ExternalLink size={10} />
                      </a>
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
              <p className="px-3 pb-3 text-[11px] leading-4 text-t3">From public coverage, gathered {fmtDate("2026-10-07")}. In production this panel reads the listening feed.</p>
            </div>
          ) : (
            <p className="p-3 text-[12.5px] leading-5 text-t2">Listening starts six weeks before launch. Nothing gathered yet for {t.name}.</p>
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
