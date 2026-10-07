"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, type ReactNode } from "react";
import { personaById, type Persona } from "@/lib/data";
import Tour from "./Tour";

export const NAV: Record<Persona["id"], { href: string; label: string }[]> = {
  production: [
    { href: "/production", label: "Start Monday" },
    { href: "/production/launch", label: "Check the launch" },
    { href: "/production/update", label: "Send the update" },
  ],
  campaign: [
    { href: "/campaign", label: "Start Monday" },
    { href: "/campaign/requests", label: "Triage requests" },
    { href: "/campaign/brief", label: "Write the brief" },
    { href: "/campaign/status", label: "Send the status" },
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
              <span className="inline-flex size-5 items-center justify-center rounded-full bg-sel text-[10.5px] font-semibold text-t1">{persona.first[0]}</span>
              You are {persona.first}, {persona.role}
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
  const step = Number(params.get("tour") ?? 0);
  if (!step) return null;
  return <Tour persona={persona} step={step} />;
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
