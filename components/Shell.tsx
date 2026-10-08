"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, type ReactNode } from "react";
import { X } from "lucide-react";
import { personaById, type Persona } from "@/lib/data";
import Story from "./Story";

export const NAV: Record<Persona["id"], { href: string; label: string }[]> = {
  production: [
    { href: "/production", label: "Today" },
    { href: "/production/launch", label: "Every file, every market" },
    { href: "/production/update", label: "Emails, drafted" },
  ],
  campaign: [
    { href: "/campaign", label: "Today" },
    { href: "/campaign/requests", label: "Requests" },
    { href: "/campaign/brief", label: "Brief" },
    { href: "/campaign/status", label: "Status" },
  ],
};

export function personaFromPath(path: string): Persona | null {
  if (path.startsWith("/production")) return personaById.production;
  if (path.startsWith("/campaign")) return personaById.campaign;
  return null;
}

export default function Shell({ children }: { children: ReactNode }) {
  const path = usePathname();
  const persona = personaFromPath(path);
  return (
    <div className="flex h-full flex-col">
      <header className="flex h-12 shrink-0 items-center gap-3 border-b border-line bg-panel px-4">
        <Link href="/" className="text-[13.5px] font-semibold tracking-tight">
          Launch Desk
        </Link>
        {persona ? (
          <>
            <span className="h-4 w-px bg-line-strong" />
            <Link href="/" className="flex items-center gap-2 text-[12.5px] text-t2 hover:text-t1" title="Switch person">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={persona.avatar} alt="" className="size-6 rounded-full bg-white" />
              {persona.first}, {persona.role}
            </Link>
            <nav className="ml-6 flex items-center gap-0.5">
              {NAV[persona.id].map((n) => {
                const active = n.href === `/${persona.id}` ? path === n.href : path.startsWith(n.href);
                return (
                  <Link key={n.href} href={n.href} className={`flex h-8 items-center rounded-[5px] px-2.5 text-[12.5px] transition-colors ${active ? "bg-sel text-t1" : "text-t2 hover:text-t1"}`}>
                    {n.label}
                  </Link>
                );
              })}
            </nav>
          </>
        ) : (
          <span className="text-[12.5px] text-t3">Prime Video marketing</span>
        )}
        <span className="ml-auto text-[11px] text-t3">Prototype on seeded data. Titles and artwork belong to Amazon MGM Studios.</span>
      </header>
      <main className="scroll-thin relative min-h-0 min-w-0 flex-1 overflow-y-auto bg-app">{children}</main>
      {persona && (
        <Suspense>
          <TourGate persona={persona} />
        </Suspense>
      )}
    </div>
  );
}

function TourGate({ persona }: { persona: Persona }) {
  const params = useSearchParams();
  const path = usePathname();
  const step = Number(params.get("story") ?? 0);
  if (step) return <Story persona={persona} step={step} />;
  if (params.get("done")) {
    const other = personaById[persona.id === "campaign" ? "production" : "campaign"];
    return (
      <div className="fixed right-5 top-16 z-50 flex w-[360px] items-start gap-3 rounded-[16px] bg-white p-4 text-[#111] shadow-[0_12px_32px_rgba(0,0,0,0.55)]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={persona.avatar} alt="" className="size-12 shrink-0 rounded-full bg-[#f2f2f2]" />
        <div className="min-w-0 flex-1">
          <p className="text-[14px] font-semibold leading-5">{persona.first}&rsquo;s morning is done.</p>
          <p className="mt-0.5 text-[12.5px] leading-4 text-[#555]">Explore the desk. Everything is clickable.</p>
          <Link href={`/${other.id}?story=1`} className="mt-2 inline-flex h-8 items-center gap-1.5 rounded-full bg-prime px-3 text-[12.5px] font-semibold text-white hover:brightness-110">
            See {other.first}&rsquo;s morning
          </Link>
          <p className="mt-1 text-[11.5px] text-[#777]">
            {other.first} is the {other.role.toLowerCase()}.
          </p>
        </div>
        <Link href={path} className="inline-flex size-8 shrink-0 items-center justify-center rounded-full text-[#777] hover:bg-[#f2f2f2] hover:text-[#111]" aria-label="Close">
          <X size={16} />
        </Link>
      </div>
    );
  }
  return null;
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
