"use client";

import { STATUS_LABEL, type Status } from "@/lib/data";

export const STATUS_TONE: Record<Status, { dot: string; text: string; bg: string }> = {
  approved: { dot: "bg-ok", text: "text-ok", bg: "bg-ok/12" },
  in_review: { dot: "bg-accent", text: "text-t1", bg: "bg-accent/20" },
  received: { dot: "bg-t2", text: "text-t2", bg: "bg-bg2" },
  planned: { dot: "bg-t3", text: "text-t3", bg: "bg-bg2" },
  rejected: { dot: "bg-err", text: "text-err", bg: "bg-err/15" },
  late: { dot: "bg-warn", text: "text-warn", bg: "bg-warn/15" },
  missing: { dot: "bg-err", text: "text-err", bg: "bg-err/15" },
};

export function StatusPill({ status, small }: { status: Status; small?: boolean }) {
  const t = STATUS_TONE[status];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-[3px] ${t.bg} ${small ? "px-1.5 py-0 text-[11px]" : "px-2 py-0.5 text-[12px]"} ${t.text}`}>
      <span className={`inline-block size-1.5 rounded-full ${t.dot}`} />
      {STATUS_LABEL[status]}
    </span>
  );
}

export function Ring({ pct, size = 44, stroke = 4, tone }: { pct: number; size?: number; stroke?: number; tone?: string }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="shrink-0">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--bg-2)" strokeWidth={stroke} />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={tone ?? (pct >= 100 ? "var(--ok)" : "var(--text-1)")}
        strokeWidth={stroke}
        strokeDasharray={`${(pct / 100) * c} ${c}`}
        strokeLinecap="butt"
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
      <text x="50%" y="50%" dominantBaseline="central" textAnchor="middle" className="mono" fill="var(--text-1)" fontSize={size * 0.26}>
        {pct}
      </text>
    </svg>
  );
}

export function PriorityTag({ p }: { p: "P0" | "P1" | "P2" }) {
  const look = p === "P0" ? "bg-err/15 text-err" : p === "P1" ? "bg-warn/15 text-warn" : "bg-bg2 text-t2";
  return <span className={`mono inline-block rounded-[3px] px-1.5 py-0.5 text-[11px] ${look}`}>{p}</span>;
}
