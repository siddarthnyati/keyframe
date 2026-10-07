"use client";

import type { QCCheck } from "@/lib/types";

export function Button({
  children,
  onClick,
  primary,
  disabled,
  small,
  title,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  primary?: boolean;
  disabled?: boolean;
  small?: boolean;
  title?: string;
}) {
  const base = small ? "h-7 px-2.5 text-[12.5px]" : "h-9 px-3.5";
  const look = primary
    ? "bg-amber text-amber-ink hover:brightness-105 disabled:opacity-40"
    : "bg-surface-2 text-text hover:bg-line disabled:opacity-40";
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${look} rounded-[3px] font-medium disabled:cursor-not-allowed transition-colors`}
    >
      {children}
    </button>
  );
}

export function Chip({ children, tone }: { children: React.ReactNode; tone?: "amber" | "muted" }) {
  const look =
    tone === "amber" ? "bg-amber/15 text-amber" : "bg-surface-2 text-muted";
  return <span className={`inline-block rounded-[3px] px-1.5 py-0.5 text-[11.5px] leading-4 ${look}`}>{children}</span>;
}

export function Meter({ label, value, display }: { label: string; value: number; display?: string }) {
  const pct = Math.max(0, Math.min(100, value));
  return (
    <div className="grid grid-cols-[88px_1fr_40px] items-center gap-2 text-[12.5px]">
      <span className="text-muted">{label}</span>
      <span className="h-1 rounded-full bg-line overflow-hidden">
        <span className="bar-fill block h-full bg-text/70" style={{ width: `${pct}%` }} />
      </span>
      <span className="text-right tabular-nums text-muted">{display ?? Math.round(pct)}</span>
    </div>
  );
}

export function QCDot({ status }: { status: QCCheck["status"] }) {
  return (
    <span
      className={`inline-block size-2 rounded-full ${status === "pass" ? "bg-pass" : "bg-fail"}`}
      aria-label={status}
    />
  );
}

export function QCList({ checks }: { checks: QCCheck[] }) {
  return (
    <ul className="space-y-2">
      {checks.map((c) => (
        <li key={c.id} className="grid grid-cols-[14px_1fr] gap-2">
          <span className="pt-1.5">
            <QCDot status={c.status} />
          </span>
          <span>
            <span className={c.status === "fail" ? "text-text" : "text-text/90"}>{c.label}</span>
            <span className="block text-[12.5px] text-muted">{c.detail}</span>
          </span>
        </li>
      ))}
    </ul>
  );
}

export function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <label className="inline-flex items-start gap-2 cursor-pointer select-none">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative h-5 w-9 shrink-0 rounded-full transition-colors ${checked ? "bg-amber" : "bg-line-2"}`}
      >
        <span
          className={`absolute left-0 top-0.5 size-4 rounded-full bg-ink transition-transform ${checked ? "translate-x-[18px]" : "translate-x-0.5"}`}
        />
      </button>
      <span className="text-[13px]">{label}</span>
    </label>
  );
}

export function RailSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-line pt-4 mt-4 first:border-t-0 first:pt-0 first:mt-0">
      <h3 className="text-[13px] font-medium text-muted mb-2">{title}</h3>
      {children}
    </section>
  );
}
