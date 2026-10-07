"use client";

import Link from "next/link";
import { Play } from "lucide-react";
import type { Persona } from "@/lib/data";

export default function PersonaStrip({ persona }: { persona: Persona }) {
  return (
    <div className="flex items-center gap-4 border-b border-line bg-panel px-8 py-3">
      <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-sel text-[13px] font-semibold">{persona.first[0]}</span>
      <p className="min-w-0 flex-1 text-[13px] leading-5">
        <span className="font-medium">You are {persona.name}</span>
        <span className="text-t2">
          , {persona.role}, {persona.org}, {persona.city}. {persona.line}
        </span>
      </p>
      <Link href={`${persona.id === "production" ? "/production" : "/campaign"}?tour=1`} className="inline-flex h-8 shrink-0 items-center gap-2 rounded-[4px] bg-t1 px-3 text-[12.5px] font-medium text-app hover:bg-white">
        <Play size={12} fill="currentColor" /> Follow {persona.first}&rsquo;s morning
      </Link>
    </div>
  );
}
