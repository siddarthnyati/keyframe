"use client";

import type { Persona } from "@/lib/data";

/** The person and what they are thinking. growth.design style, in the product's words. */
export default function Bubble({ persona, text, size = 72 }: { persona: Persona; text: string; size?: number }) {
  return (
    <div className="flex items-end gap-3">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={persona.avatar} alt={persona.name} className="shrink-0 rounded-full bg-white" style={{ width: size, height: size }} />
      <div className="relative rounded-[14px] bg-white px-4 py-2.5 text-[13.5px] leading-5 text-[#111]">
        <span className="absolute -left-1.5 bottom-4 size-3 rotate-45 bg-white" />
        {text}
      </div>
    </div>
  );
}
