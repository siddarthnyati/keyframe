import Link from "next/link";
import { ArrowRight, Play } from "lucide-react";
import { PERSONAS, TITLES } from "@/lib/data";

export default function Door() {
  const wall = TITLES.filter((t) => t.stage !== "live").slice(0, 8);
  return (
    <div className="relative min-h-full overflow-hidden">
      {/* Poster wall */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.22]" aria-hidden>
        <div className="flex gap-3 blur-[2px]" style={{ transform: "rotate(-6deg) translate(-40px, -60px) scale(1.15)" }}>
          {[...wall, ...wall].map((t, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={i} src={t.poster} alt="" className="h-[300px] w-[200px] shrink-0 rounded-[8px] object-cover" style={{ marginTop: i % 2 ? 90 : 0 }} />
          ))}
        </div>
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-app/40 via-app/85 to-app" aria-hidden />

      <div className="relative mx-auto max-w-[1000px] px-8 pb-16 pt-14">
        <p className="text-[12px] font-medium uppercase tracking-[0.12em] text-prime">Prime Video · Title Launch Marketing</p>
        <h1 className="mt-3 text-[40px] font-semibold leading-[1.05] tracking-tight">
          One team runs a launch.
          <br />
          Two chairs. Pick yours.
        </h1>

        <div className="mt-10 grid grid-cols-2 gap-5">
          {PERSONAS.map((p) => (
            <div key={p.id} className="flex flex-col rounded-[16px] border border-line bg-panel/90 p-6 backdrop-blur">
              <div className="flex items-center gap-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.avatar} alt="" className="size-16 rounded-full bg-white" />
                <div>
                  <p className="text-[17px] font-semibold">{p.name}</p>
                  <p className="text-[12.5px] text-t2">{p.role}</p>
                  <p className="text-[12px] text-t3">
                    {p.org}, {p.city}
                  </p>
                </div>
              </div>
              <p className="mt-5 text-[11px] font-medium uppercase tracking-[0.1em] text-t3">Today</p>
              <ol className="mt-2 space-y-1.5">
                {p.todo.map((t, i) => (
                  <li key={t.text} className="flex gap-2.5 text-[13px] leading-5">
                    <span className="mono mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-sel text-[11px] text-t2">{i + 1}</span>
                    <span>{t.text}</span>
                  </li>
                ))}
              </ol>
              <div className="mt-6 flex items-center gap-3">
                <Link href={`/${p.id}?story=1`} className="inline-flex h-10 items-center gap-2 rounded-full bg-prime px-4 text-[13px] font-semibold text-white hover:brightness-110">
                  <Play size={13} fill="currentColor" /> Follow {p.first}&rsquo;s morning
                </Link>
                <Link href={`/${p.id}`} className="inline-flex h-10 items-center gap-1.5 rounded-full px-3 text-[13px] text-t2 hover:text-t1">
                  Just open the desk <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          ))}
        </div>

        <p className="mt-10 max-w-[720px] text-[12px] leading-5 text-t3">
          A prototype for the Global Marketing Tooling team. Titles, dates and artwork are real Prime Video titles from public announcements and IMDb and belong to Amazon MGM Studios. People, vendors, tickets, statuses and numbers are invented.
        </p>
      </div>
    </div>
  );
}
