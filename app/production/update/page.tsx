"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Sparkle } from "lucide-react";
import Poster from "@/components/Poster";
import { PageIntro } from "@/components/Shell";
import { Button, Panel, PanelHeader, Section, Segmented } from "@/components/ui";
import { DELIVERABLES, UPDATE_SEED, UPDATE_SEED_CAMPAIGN, cellsFor, fmtDate, marketByCode, readiness, titleById } from "@/lib/data";

type Kind = "status" | "chase" | "campaign";

export default function UpdatesPage() {
  return (
    <Suspense>
      <Updates />
    </Suspense>
  );
}

export function Updates({ mode = "production" }: { mode?: "production" | "campaign" }) {
  const params = useSearchParams();
  const kinds: { id: Kind; label: string }[] =
    mode === "campaign"
      ? [{ id: "campaign", label: "Campaign status" }]
      : [
          { id: "status", label: "Production status" },
          { id: "chase", label: "Vendor chase" },
        ];
  const initial = (params.get("kind") as Kind | null) && kinds.some((k) => k.id === params.get("kind")) ? (params.get("kind") as Kind) : kinds[0].id;
  const [kind, setKind] = useState<Kind>(initial);
  const [text, setText] = useState<Record<Kind, string>>({ status: UPDATE_SEED.status, chase: UPDATE_SEED.chase, campaign: UPDATE_SEED_CAMPAIGN });
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const t = titleById.terminal;
  const r = readiness(t.id);

  const regenerate = async () => {
    setBusy(true);
    setNote(null);
    const cells = cellsFor(t.id)
      .filter((c) => c.status !== "approved")
      .map((c) => ({ market: marketByCode[c.market].name, deliverable: DELIVERABLES.find((d) => d.id === c.deliverable)!.label, status: c.status, owner: c.owner, due: c.due, note: c.note ?? null }));
    const res = await fetch("/api/draft", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ kind, title: t.name, launch: t.launch, markets: t.markets.length, producer: t.producer, approved: r.approved, total: r.total, cells }),
    });
    const data = (await res.json()) as { text: string; mock: boolean; note?: string };
    setText((s) => ({ ...s, [kind]: data.text }));
    setNote(data.mock ? "No model key on this deployment; showing the seeded draft." : "Drafted by the model from the board state. Edit before sending.");
    setBusy(false);
  };

  return (
    <div className="flex h-full min-h-0 flex-col">
      <PageIntro
        title={mode === "campaign" ? "Send the status" : "Send the update"}
        right={
          <Segmented<Kind>
            value={kind}
            onChange={(k) => {
              setKind(k);
              setSent(false);
              setNote(null);
            }}
            options={kinds}
          />
        }
      >
        {mode === "campaign"
          ? "The Monday status to the marketing lead, drafted from the board, the queue and the brief. Dev edits and sends. Nothing sends itself."
          : "The two emails Priya writes most, drafted from the launch board with the real dates and owners in. She edits and sends. Nothing sends itself."}
      </PageIntro>
      <div className="flex min-h-0 flex-1 border-t border-line">
        <div className="flex min-w-0 flex-1 flex-col p-8">
          <div className="flex items-center gap-3">
            <Poster t={t} w={28} rounded={3} />
            <p className="text-[13.5px] font-medium">{kind === "chase" ? "To Nordlicht Dub, German trailer" : kind === "campaign" ? `To the marketing lead, ${t.name}, week of ${fmtDate("2026-10-07")}` : `To the marketing lead and Dev, ${t.name}, week of ${fmtDate("2026-10-07")}`}</p>
            <span className="ml-auto" />
            <Button onClick={regenerate} disabled={busy}>
              <Sparkle size={13} /> {busy ? "Drafting" : "Draft again from the board"}
            </Button>
            <Button primary onClick={() => setSent(true)} disabled={sent}>
              {sent ? "Marked as sent" : kind === "chase" ? "Send to vendor" : "Send to the marketing lead"}
            </Button>
          </div>
          {note && <p className="mt-2 text-[12px] text-t3">{note}</p>}
          <textarea
            value={text[kind]}
            onChange={(e) => setText((s) => ({ ...s, [kind]: e.target.value }))}
            className="scroll-thin mt-3 min-h-0 flex-1 resize-none rounded-[8px] border border-line bg-panel p-4 text-[13px] leading-5 text-t1 focus:border-line-strong"
          />
        </div>
        <Panel side="right" width={340}>
          <PanelHeader title="Read from the board" />
          <Section title={`${t.name}, ${fmtDate(t.launch)}`}>
            <p className="text-[12.5px] leading-5 text-t2">
              {r.approved} of {r.total} approved. {r.blockers.length} blocking. {r.inReview} in review.
            </p>
          </Section>
          <Section title="Blockers in the draft">
            <ul className="space-y-1.5 text-[12.5px] leading-5">
              {r.blockers.map((c) => (
                <li key={`${c.market}:${c.deliverable}`}>
                  <span className="text-t1">
                    {marketByCode[c.market].name}, {DELIVERABLES.find((d) => d.id === c.deliverable)!.label.toLowerCase()}
                  </span>
                  <span className="text-t3">, {c.owner}, due {fmtDate(c.due)}</span>
                </li>
              ))}
            </ul>
          </Section>
          <Section title="Why this is the point">
            <p className="text-[12.5px] leading-5 text-t2">
              A producer spends hours a week turning a tracker into prose. The tracker already knows the answer. Draft from it, keep the human on the send.
            </p>
          </Section>
        </Panel>
      </div>
    </div>
  );
}
