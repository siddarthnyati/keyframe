"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Inbox, FileText, Grid3X3, Globe2, Send, Sun } from "lucide-react";
import type { ReactNode } from "react";

const NAV = [
  { href: "/", label: "Today", icon: Sun, blurb: "What needs you" },
  { href: "/requests", label: "Requests", icon: Inbox, blurb: "The intake queue" },
  { href: "/briefs", label: "Briefs", icon: FileText, blurb: "Creative briefs and signals" },
  { href: "/launches", label: "Launch board", icon: Grid3X3, blurb: "Markets by deliverables" },
  { href: "/markets", label: "Markets", icon: Globe2, blurb: "Where campaigns run" },
  { href: "/updates", label: "Updates", icon: Send, blurb: "Status, drafted for you" },
];

export default function Shell({ children }: { children: ReactNode }) {
  const path = usePathname();
  return (
    <div className="flex h-full flex-col">
      <header className="flex h-12 shrink-0 items-center gap-3 border-b border-line bg-panel px-4">
        <span className="text-[13.5px] font-semibold tracking-tight">Launch Desk</span>
        <span className="h-4 w-px bg-line-strong" />
        <span className="text-[12.5px] text-t2">The producer&rsquo;s desk for a title launch. One place to see what is ready, what is late, and what to send.</span>
        <span className="ml-auto rounded-[4px] border border-line bg-bg2 px-2 py-0.5 text-[11px] text-t2">Demo. Seeded data, open titles, invented vendors.</span>
      </header>
      <div className="flex min-h-0 min-w-0 flex-1">
        <nav className="flex w-[196px] shrink-0 flex-col border-r border-line bg-panel py-2">
          {NAV.map((n) => {
            const active = n.href === "/" ? path === "/" : path.startsWith(n.href);
            const Icon = n.icon;
            return (
              <Link
                key={n.href}
                href={n.href}
                className={`mx-2 flex items-center gap-2.5 rounded-[5px] px-2.5 py-2 transition-colors ${active ? "bg-sel text-t1" : "text-t2 hover:bg-hover hover:text-t1"}`}
              >
                <Icon size={15} className={active ? "text-t1" : "text-t3"} />
                <span className="min-w-0">
                  <span className="block text-[12.5px] font-medium leading-4">{n.label}</span>
                  <span className="block text-[11px] leading-4 text-t3">{n.blurb}</span>
                </span>
              </Link>
            );
          })}
          <div className="mt-auto px-4 pb-2 text-[11px] leading-4 text-t3">
            Titles are Blender Foundation open movies (CC BY). Every number, vendor and signal is invented for the demo.
          </div>
        </nav>
        <main className="scroll-thin min-w-0 flex-1 overflow-y-auto bg-app">{children}</main>
      </div>
    </div>
  );
}

export function PageIntro({ title, children, right }: { title: string; children: ReactNode; right?: ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-6 border-b border-line px-6 py-4">
      <div className="max-w-[760px]">
        <h1 className="text-[18px] font-semibold tracking-tight">{title}</h1>
        <p className="mt-1 text-[13px] leading-5 text-t2">{children}</p>
      </div>
      {right}
    </div>
  );
}
