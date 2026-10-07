import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PERSONAS, TITLES, fmtDate } from "@/lib/data";

export default function Door() {
  const hero = TITLES.find((t) => t.id === "terminal")!;
  return (
    <div className="mx-auto max-w-[1040px] px-8 py-12">
      <p className="text-[12px] text-t3">Monday, {fmtDate("2026-10-07")}</p>
      <h1 className="mt-2 text-[28px] font-semibold leading-9 tracking-tight">Launch Desk</h1>
      <p className="mt-2 max-w-[640px] text-[14px] leading-6 text-t2">
        Built for one team: Title Launch Marketing, Prime Video Originals. Two chairs on it. The desk reads the launch board, the request queue and this week&rsquo;s coverage, and tells each of them what needs them today. Pick a chair.
      </p>

      <div className="mt-8 grid grid-cols-2 gap-5">
        {PERSONAS.map((p) => (
          <Link key={p.id} href={`/${p.id}`} className="group flex flex-col rounded-[12px] border border-line bg-panel p-6 transition-colors hover:border-line-strong">
            <div className="flex items-center gap-3">
              <span className="inline-flex size-11 items-center justify-center rounded-full bg-sel text-[15px] font-semibold">{p.first[0]}</span>
              <div>
                <p className="text-[15px] font-semibold">{p.name}</p>
                <p className="text-[12.5px] text-t2">
                  {p.role}, {p.org}
                </p>
              </div>
            </div>
            <p className="mt-5 text-[13.5px] leading-6 text-t1">&ldquo;{p.line}&rdquo;</p>
            <p className="mt-3 text-[12.5px] leading-5 text-t2">
              <span className="text-t3">Owns right now. </span>
              {p.owns}
            </p>
            <p className="mt-2 text-[12.5px] leading-5 text-t2">
              <span className="text-t3">Monday means. </span>
              {p.monday}
            </p>
            <span className="mt-6 inline-flex items-center gap-1.5 text-[13px] font-medium text-t1">
              Start {p.first}&rsquo;s Monday <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
            </span>
          </Link>
        ))}
      </div>

      <div className="mt-10 flex gap-5 rounded-[12px] border border-line p-5">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={hero.poster} alt="" className="h-[96px] w-[64px] rounded-[4px] object-cover" />
        <div className="text-[12.5px] leading-5 text-t2">
          <p className="text-t1">The week on the desk.</p>
          <p>
            {hero.name} launches {fmtDate(hero.launch)} in {hero.markets.length} demo markets, with three things blocking it. Priya owns getting it delivered. Dev owns the campaign around it. The same three blockers show up on both desks, from two different jobs.
          </p>
          <p className="mt-2 text-t3">
            Titles, dates and artwork are real Prime Video titles from public announcements and IMDb. People, vendors, tickets, statuses and numbers are invented for the prototype.
          </p>
        </div>
      </div>
    </div>
  );
}
