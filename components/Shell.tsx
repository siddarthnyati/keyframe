"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Inbox, FileText, Grid3X3, Globe2, Send, Sun } from "lucide-react";
import type { ReactNode } from "react";

const NAV = [
  { href: "/", label: "Today", icon: Sun },
  { href: "/requests", label: "Requests", icon: Inbox },
  { href: "/briefs", label: "Briefs", icon: FileText },
  { href: "/launches", label: "Launch board", icon: Grid3X3 },
  { href: "/markets", label: "Markets", icon: Globe2 },
  { href: "/updates", label: "Updates", icon: Send },
];

export default function Shell({ children }: { children: ReactNode }) {
  const path = usePathname();
  return (
    <div className="flex h-full flex-col">
      <header className="flex h-12 shrink-0 items-center gap-3 border-b border-line bg-panel px-4">
        <span className="text-[13.5px] font-semibold tracking-tight">Launch Desk</span>
        <span className="text-[12.5px] text-t3">Prime Video marketing</span>
        <nav className="ml-6 flex items-center gap-0.5">
          {NAV.map((n) => {
            const active = n.href === "/" ? path === "/" : path.startsWith(n.href);
            const Icon = n.icon;
            return (
              <Link key={n.href} href={n.href} className={`flex h-8 items-center gap-1.5 rounded-[5px] px-2.5 text-[12.5px] transition-colors ${active ? "bg-sel text-t1" : "text-t2 hover:text-t1"}`}>
                <Icon size={14} className={active ? "text-t1" : "text-t3"} />
                {n.label}
              </Link>
            );
          })}
        </nav>
        <span className="ml-auto text-[11px] text-t3">Prototype on seeded data. Titles and artwork belong to Amazon MGM Studios.</span>
      </header>
      <main className="scroll-thin min-h-0 min-w-0 flex-1 overflow-y-auto bg-app">{children}</main>
    </div>
  );
}

export function PageIntro({ title, children, right }: { title: string; children: ReactNode; right?: ReactNode }) {
  return (
    <div className="flex items-end justify-between gap-6 px-8 pb-4 pt-6">
      <div className="max-w-[720px]">
        <h1 className="text-[20px] font-semibold tracking-tight">{title}</h1>
        <p className="mt-1 text-[13px] leading-5 text-t2">{children}</p>
      </div>
      {right}
    </div>
  );
}
