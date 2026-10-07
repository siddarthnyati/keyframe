"use client";

import type { ReactNode } from "react";
export type QCCheck = { id: string; label: string; status: "pass" | "fail"; detail: string };

export function Button({
  children,
  onClick,
  primary,
  danger,
  disabled,
  small,
  title,
  full,
}: {
  children: ReactNode;
  onClick?: () => void;
  primary?: boolean;
  danger?: boolean;
  disabled?: boolean;
  small?: boolean;
  title?: string;
  full?: boolean;
}) {
  const size = small ? "h-7 px-2.5 text-[12px] gap-1.5" : "h-8 px-3 text-[12.5px] gap-2";
  const look = primary
    ? "bg-t1 text-app hover:bg-white"
    : danger
      ? "bg-bg2 border border-line text-err hover:bg-hover"
      : "bg-bg2 border border-line text-t1 hover:bg-hover";
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center rounded-[4px] font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${size} ${look} ${full ? "w-full" : ""}`}
    >
      {children}
    </button>
  );
}

export function IconButton({
  children,
  onClick,
  title,
  active,
  disabled,
}: {
  children: ReactNode;
  onClick?: () => void;
  title: string;
  active?: boolean;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex size-7 items-center justify-center rounded-[4px] transition-colors disabled:opacity-40 ${
        active ? "bg-sel text-t1" : "text-t2 hover:bg-hover hover:text-t1"
      }`}
    >
      {children}
    </button>
  );
}

export function Segmented<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { id: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="inline-flex rounded-[5px] border border-line bg-bg2 p-0.5">
      {options.map((o) => (
        <button
          key={o.id}
          type="button"
          onClick={() => onChange(o.id)}
          className={`h-6 rounded-[4px] px-2.5 text-[12px] font-medium transition-colors ${
            value === o.id ? "bg-sel text-t1" : "text-t2 hover:text-t1"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

export function Panel({ children, side, width }: { children: ReactNode; side: "left" | "right"; width?: number }) {
  return (
    <aside
      className={`flex min-h-0 shrink-0 flex-col bg-panel ${side === "left" ? "border-r" : "border-l"} border-line`}
      style={{ width: width ?? (side === "left" ? 248 : 320) }}
    >
      {children}
    </aside>
  );
}

export function PanelHeader({ title, right }: { title: string; right?: ReactNode }) {
  return (
    <div className="flex h-9 shrink-0 items-center justify-between border-b border-line px-3">
      <span className="text-[12.5px] font-medium">{title}</span>
      {right}
    </div>
  );
}

export function Section({ title, children, right, icon }: { title: string; children: ReactNode; right?: ReactNode; icon?: ReactNode }) {
  return (
    <section className="border-b border-line px-3 py-3">
      <div className="mb-2 flex items-center justify-between gap-2">
        <span className="flex items-center gap-2">
          {icon}
          <span className="label">{title}</span>
        </span>
        {right}
      </div>
      {children}
    </section>
  );
}

export function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="grid min-h-7 grid-cols-[96px_1fr] items-center gap-2">
      <span className="text-[12px] text-t2">{label}</span>
      <span className="min-w-0 text-[12.5px] text-t1">{children}</span>
    </div>
  );
}

export function Meter({ label, value, display }: { label: string; value: number; display?: string }) {
  const pct = Math.max(0, Math.min(100, value));
  return (
    <div className="grid h-7 grid-cols-[96px_1fr_32px] items-center gap-2">
      <span className="text-[12px] text-t2">{label}</span>
      <span className="h-1 overflow-hidden rounded-full bg-bg2">
        <span className="bar-fill block h-full bg-t2" style={{ width: `${pct}%` }} />
      </span>
      <span className="mono text-right text-[11.5px] text-t2">{display ?? Math.round(pct)}</span>
    </div>
  );
}

export function Chip({ children, tone }: { children: ReactNode; tone?: "warn" | "ok" | "accent" }) {
  const look =
    tone === "warn"
      ? "bg-warn/15 text-warn"
      : tone === "ok"
        ? "bg-ok/15 text-ok"
        : tone === "accent"
          ? "bg-accent/20 text-t1"
          : "bg-bg2 text-t2";
  return <span className={`inline-block rounded-[3px] px-1.5 py-0.5 text-[11px] leading-4 ${look}`}>{children}</span>;
}

export function Input({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <input
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className="h-7 w-full rounded-[4px] border border-line bg-bg2 px-2 text-[12.5px] text-t1 placeholder:text-t3 focus:border-line-strong"
    />
  );
}

export function Select<T extends string | number>({
  value,
  onChange,
  options,
}: {
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string }[];
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange((typeof value === "number" ? Number(e.target.value) : e.target.value) as T)}
      className="h-7 rounded-[4px] border border-line bg-bg2 px-2 text-[12.5px] text-t1"
    >
      {options.map((o) => (
        <option key={String(o.value)} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}

export function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <label className="inline-flex cursor-pointer select-none items-center gap-2">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative h-4 w-7 shrink-0 rounded-full transition-colors ${checked ? "bg-accent" : "bg-sel"}`}
      >
        <span
          className={`absolute left-0 top-0.5 size-3 rounded-full bg-white transition-transform ${checked ? "translate-x-[14px]" : "translate-x-0.5"}`}
        />
      </button>
      <span className="text-[12px] text-t1">{label}</span>
    </label>
  );
}

export function StatusDot({ status }: { status: "pass" | "fail" | "ok" | "warn" | "idle" }) {
  const c =
    status === "pass" || status === "ok" ? "bg-ok" : status === "fail" ? "bg-err" : status === "warn" ? "bg-warn" : "bg-t3";
  return <span className={`inline-block size-1.5 rounded-full ${c}`} aria-label={status} />;
}

export function QCList({ checks }: { checks: QCCheck[] }) {
  return (
    <ul className="space-y-2">
      {checks.map((c) => (
        <li key={c.id} className="grid grid-cols-[12px_1fr] gap-2">
          <span className="pt-[7px]">
            <StatusDot status={c.status} />
          </span>
          <span>
            <span className="block text-[12.5px] text-t1">{c.label}</span>
            <span className="block text-[11.5px] leading-4 text-t2">{c.detail}</span>
          </span>
        </li>
      ))}
    </ul>
  );
}

export function Empty({ children }: { children: ReactNode }) {
  return <p className="px-3 py-3 text-[12px] leading-5 text-t2">{children}</p>;
}
