"use client";

import { useState } from "react";
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
  const p0 = TICKETS.filter((t) => t.priority === "P0" && t.status !== "Done").length;

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
        Everything that lands on a producer: asset requests, localization, spec rejections, placements, briefs, data pulls. Today these arrive by ticket, email and chat and get
        re-typed into a tracker. Here each one is read once, linked to the launch board, and given a suggested owner and reason. The producer confirms or changes it. {p0 ? `${p0} are P0.` : ""}
      </PageIntro>
      <div className="flex min-h-0 flex-1">
        <div className="scroll-thin min-w-0 flex-1 overflow-y-auto">
          <table className="w-full text-[12.5px]">
            <thead className="sticky top-0 bg-app">
              <tr className="text-[11px] text-t3">
                <th className="px-6 py-2 text-left font-medium">Request</th>
                <th className="py-2 text-left font-medium">Type</th>
                <th className="py-2 text-left font-medium">Title, market</th>
                <th className="py-2 text-left font-medium">From</th>
                <th className="py-2 text-left font-medium">Due</th>
                <th className="py-2 text-left font-medium">Status</th>
                <th className="py-2 pr-6 text-left font-medium">Suggested owner</th>
              </tr>
            </thead>
            <tbody>
              {list.map((t) => (
                <tr key={t.id} onClick={() => setSelId(t.id)} className={`cursor-pointer border-t border-line ${sel?.id === t.id ? "bg-sel" : "hover:bg-hover"}`}>
                  <td className="px-6 py-2.5">
                    <span className="flex items-center gap-2">
                      <PriorityTag p={t.priority} />
                      <span className="mono text-[11px] text-t3">{t.id}</span>
                    </span>
                    <span className="mt-0.5 block">{t.subject}</span>
                  </td>
                  <td className="py-2.5 text-t2">{t.type}</td>
                  <td className="py-2.5 text-t2">
                    {t.title ? titleById[t.title].name : ""}
                    {t.market ? `, ${marketByCode[t.market].name}` : ""}
                  </td>
                  <td className="py-2.5 text-t2">{t.from}</td>
                  <td className={`mono py-2.5 ${t.due < "2026-10-08" && t.status !== "Done" ? "text-warn" : "text-t2"}`}>{fmtDate(t.due)}</td>
                  <td className="py-2.5 text-t2">{t.status}</td>
                  <td className="py-2.5 pr-6 text-t1">{t.suggested.owner}</td>
                </tr>
              ))}
            </tbody>
          </table>
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
  return (
    <div className="scroll-thin min-h-0 flex-1 overflow-y-auto">
      <div className="border-b border-line p-3">
        <p className="text-[13.5px] font-medium leading-5">{t.subject}</p>
        <p className="mt-1 text-[12px] text-t2">
          From {t.from}, {fmtDate(t.received)}.
        </p>
      </div>
      <Section title="Read from the request">
        <Row label="Type">{t.type}</Row>
        <Row label="Title">{t.title ? titleById[t.title].name : "Not tied to a title"}</Row>
        <Row label="Market">{t.market ? marketByCode[t.market].name : "All"}</Row>
        <Row label="Due">
          <span className="mono">{fmtDate(t.due)}</span>
        </Row>
        <Row label="Priority">
          <PriorityTag p={t.priority} />
        </Row>
      </Section>
      <Section title="Suggested">
        <Row label="Owner">
          <input value={owner} onChange={(e) => setOwner(e.target.value)} className="h-7 w-full rounded-[4px] border border-line bg-bg2 px-2 text-[12.5px]" />
        </Row>
        <Row label="Links to">{t.suggested.link}</Row>
        <p className="mt-2 text-[12.5px] leading-5 text-t1">{t.suggested.why}</p>
        <p className="mt-2 text-[11.5px] leading-4 text-t3">The suggestion is read from the request text and the launch board. The producer decides.</p>
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
