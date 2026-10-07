"use client";

import { useState } from "react";
import Poster from "@/components/Poster";
import { PageIntro } from "@/components/Shell";
import { PriorityTag } from "@/components/status";
import { Button, Panel, PanelHeader, Row, Section, Segmented } from "@/components/ui";
import { TICKETS, fmtDate, marketByCode, titleById, type Ticket } from "@/lib/data";

type Filter = "open" | "new" | "all";

export default function Requests() {
  const [filter, setFilter] = useState<Filter>("open");
  const [selId, setSelId] = useState(TICKETS[0].id);
  const list = TICKETS.filter((t) => (filter === "all" ? true : filter === "new" ? t.status === "New" : t.status !== "Done"));
  const sel = TICKETS.find((t) => t.id === selId) ?? list[0];
  const open = TICKETS.filter((t) => t.status !== "Done").length;

  return (
    <div className="flex h-full min-h-0 flex-col">
      <PageIntro
        title="Requests"
        right={
          <Segmented<Filter>
            value={filter}
            onChange={setFilter}
            options={[
              { id: "open", label: `Open ${open}` },
              { id: "new", label: "New" },
              { id: "all", label: "All" },
            ]}
          />
        }
      >
        Everything that lands on Dev by ticket, read once and linked to the launch board, with a suggested owner and the reason. Dev confirms or changes it.
      </PageIntro>
      <div className="flex min-h-0 flex-1 border-t border-line">
        <div className="scroll-thin min-w-0 flex-1 overflow-y-auto">
          <ul className="divide-y divide-line">
            {list.map((t) => {
              const title = t.title ? titleById[t.title] : null;
              const active = sel?.id === t.id;
              return (
                <li key={t.id} data-story={`row-${t.id}`}>
                  <button type="button" onClick={() => setSelId(t.id)} className={`flex w-full items-center gap-3 px-8 py-2.5 text-left ${active ? "bg-sel" : "hover:bg-hover"}`}>
                    {title ? <Poster t={title} w={30} rounded={3} /> : <span className="w-[30px] shrink-0" />}
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-2">
                        <PriorityTag p={t.priority} />
                        <span className="truncate text-[13px]">{t.subject}</span>
                      </span>
                      <span className="block text-[12px] text-t2">
                        {t.type}. {t.from}
                        {t.market ? `, ${marketByCode[t.market].name}` : ""}.
                      </span>
                    </span>
                    <span className="w-[150px] shrink-0 truncate text-[12px] text-t2">{t.suggested.owner}</span>
                    <span className={`mono w-14 shrink-0 text-right text-[11.5px] ${t.due < "2026-10-08" && t.status !== "Done" ? "text-warn" : "text-t3"}`}>{fmtDate(t.due)}</span>
                    <span className="w-20 shrink-0 text-right text-[11.5px] text-t3">{t.status}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
        <Panel side="right" width={360}>
          <PanelHeader title="Request" right={sel ? <span className="mono text-[11px] text-t3">{sel.id}</span> : undefined} />
          {sel && <Detail t={sel} />}
        </Panel>
      </div>
    </div>
  );
}

function Detail({ t }: { t: Ticket }) {
  const [owner, setOwner] = useState(t.suggested.owner);
  const [done, setDone] = useState(false);
  const title = t.title ? titleById[t.title] : null;
  return (
    <div className="scroll-thin min-h-0 flex-1 overflow-y-auto">
      <div className="flex gap-3 border-b border-line p-3">
        {title && <Poster t={title} w={56} rounded={4} />}
        <div className="min-w-0">
          <p className="text-[13.5px] font-medium leading-5">{t.subject}</p>
          <p className="mt-1 text-[12px] text-t2">
            From {t.from}, {fmtDate(t.received)}.
          </p>
        </div>
      </div>
      <Section title="Read from the request">
        <Row label="Type">{t.type}</Row>
        <Row label="Title">{title ? title.name : "Not tied to a title"}</Row>
        <Row label="Market">{t.market ? marketByCode[t.market].name : "All"}</Row>
        <Row label="Due">
          <span className="mono">{fmtDate(t.due)}</span>
        </Row>
      </Section>
      <Section title="Suggested">
        <Row label="Owner">
          <input value={owner} onChange={(e) => setOwner(e.target.value)} className="h-7 w-full rounded-[4px] border border-line bg-bg2 px-2 text-[12.5px]" />
        </Row>
        <Row label="Links to">{t.suggested.link}</Row>
        <p className="mt-2 text-[12.5px] leading-5 text-t1">{t.suggested.why}</p>
      </Section>
      <div className="flex gap-2 p-3">
        <Button primary full onClick={() => setDone(true)} disabled={done || t.status === "Done"}>
          {done || t.status === "Done" ? "Confirmed" : "Confirm and route"}
        </Button>
        <Button full onClick={() => setDone(false)}>
          Change
        </Button>
      </div>
    </div>
  );
}
