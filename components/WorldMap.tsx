"use client";

import { useMemo } from "react";
import { geoNaturalEarth1, geoPath } from "d3-geo";
import { feature } from "topojson-client";
import world from "world-atlas/countries-110m.json";
import { MARKETS, type Market } from "@/lib/data";

export type MarketTone = "ready" | "blocked" | "in_progress" | "planned" | "live" | "none";
const FILL: Record<MarketTone, string> = {
  ready: "var(--ok)",
  blocked: "var(--err)",
  in_progress: "var(--accent)",
  planned: "var(--text-3)",
  live: "var(--ok)",
  none: "var(--bg-sel)",
};

const W = 960;
const H = 470;

export default function WorldMap({
  tones,
  selected,
  onSelect,
  labels,
}: {
  tones: Record<string, MarketTone>;
  selected?: string | null;
  onSelect?: (code: string) => void;
  labels?: Record<string, string>;
}) {
  const { land, projection } = useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const topo = world as any;
    const countries = feature(topo, topo.objects.countries) as unknown as GeoJSON.FeatureCollection;
    const projection = geoNaturalEarth1().fitExtent(
      [
        [8, 8],
        [W - 8, H - 8],
      ],
      { type: "Sphere" } as GeoJSON.GeoJsonProperties as never,
    );
    const path = geoPath(projection);
    return { land: countries.features.map((f) => path(f) ?? ""), projection };
  }, []);

  const pos = (m: Market) => projection([m.lon, m.lat]) ?? [0, 0];

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label="World map of markets">
      <rect width={W} height={H} fill="var(--bg-app)" />
      {land.map((d, i) => (
        <path key={i} d={d} fill="var(--bg-2)" stroke="var(--bg-app)" strokeWidth={0.6} />
      ))}
      {MARKETS.map((m) => {
        const [x, y] = pos(m);
        const tone = tones[m.code] ?? "none";
        const isSel = selected === m.code;
        const active = tone !== "none";
        return (
          <g key={m.code} transform={`translate(${x},${y})`} onClick={() => onSelect?.(m.code)} className={onSelect ? "cursor-pointer" : ""}>
            {active && tone === "blocked" && <circle r={14} fill={FILL[tone]} opacity={0.18} />}
            <circle r={isSel ? 7 : active ? 5.5 : 3} fill={FILL[tone]} stroke={isSel ? "var(--text-1)" : "var(--bg-app)"} strokeWidth={isSel ? 2 : 1.5} />
            <text x={9} y={4} fontSize={11} fill={active ? "var(--text-1)" : "var(--text-3)"} fontFamily="Inter, system-ui, sans-serif">
              {m.code}
              {labels?.[m.code] ? ` ${labels[m.code]}` : ""}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
