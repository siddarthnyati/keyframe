"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { geoOrthographic, geoPath, geoGraticule10 } from "d3-geo";
import { feature } from "topojson-client";
import world from "world-atlas/countries-110m.json";
import { MARKETS, type Market } from "@/lib/data";
import type { MarketTone } from "./WorldMap";

const FILL: Record<MarketTone, string> = {
  ready: "var(--ok)",
  blocked: "var(--err)",
  in_progress: "var(--prime-blue)",
  planned: "var(--text-3)",
  live: "var(--ok)",
  none: "var(--bg-sel)",
};
const SIZE = 520;

export default function Globe({ tones, selected, onSelect }: { tones: Record<string, MarketTone>; selected?: string | null; onSelect?: (code: string) => void }) {
  const land = useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const topo = world as any;
    return (feature(topo, topo.objects.countries) as unknown as GeoJSON.FeatureCollection).features;
  }, []);
  const [rot, setRot] = useState<[number, number]>([-20, -20]);
  const drag = useRef<{ x: number; y: number; r: [number, number] } | null>(null);
  const spinning = useRef(true);

  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = now - last;
      last = now;
      if (spinning.current && !drag.current) setRot((r) => [r[0] + dt * 0.012, r[1]]);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const projection = useMemo(
    () =>
      geoOrthographic()
        .scale(SIZE / 2 - 10)
        .translate([SIZE / 2, SIZE / 2])
        .rotate([rot[0], rot[1]])
        .clipAngle(90),
    [rot],
  );
  const path = useMemo(() => geoPath(projection), [projection]);
  const graticule = useMemo(() => geoGraticule10(), []);

  const visible = (m: Market) => {
    const [lon, lat] = [m.lon, m.lat];
    const r = projection.rotate();
    const λ = ((lon + r[0]) * Math.PI) / 180;
    const φ = (lat * Math.PI) / 180;
    const φ0 = (-r[1] * Math.PI) / 180;
    return Math.sin(φ) * Math.sin(φ0) + Math.cos(φ) * Math.cos(φ0) * Math.cos(λ) > 0;
  };

  return (
    <svg
      viewBox={`0 0 ${SIZE} ${SIZE}`}
      className="h-auto w-full max-w-[520px] cursor-grab select-none active:cursor-grabbing"
      role="img"
      aria-label="Globe of markets"
      onPointerDown={(e) => {
        drag.current = { x: e.clientX, y: e.clientY, r: rot };
        (e.target as Element).setPointerCapture?.(e.pointerId);
      }}
      onPointerMove={(e) => {
        if (!drag.current) return;
        const k = 0.35;
        setRot([drag.current.r[0] + (e.clientX - drag.current.x) * k, Math.max(-60, Math.min(60, drag.current.r[1] - (e.clientY - drag.current.y) * k))]);
      }}
      onPointerUp={() => (drag.current = null)}
      onPointerLeave={() => (drag.current = null)}
      onMouseEnter={() => (spinning.current = false)}
      onMouseLeave={() => (spinning.current = true)}
    >
      <defs>
        <radialGradient id="ocean" cx="40%" cy="35%" r="70%">
          <stop offset="0%" stopColor="#1b2a44" />
          <stop offset="100%" stopColor="#0b1220" />
        </radialGradient>
      </defs>
      <circle cx={SIZE / 2} cy={SIZE / 2} r={SIZE / 2 - 10} fill="url(#ocean)" stroke="rgba(255,255,255,0.12)" />
      <path d={path(graticule) ?? ""} fill="none" stroke="rgba(255,255,255,0.05)" />
      {land.map((f, i) => (
        <path key={i} d={path(f) ?? ""} fill="#2b3447" stroke="#0f1726" strokeWidth={0.5} />
      ))}
      {MARKETS.filter(visible).map((m) => {
        const p = projection([m.lon, m.lat]);
        if (!p) return null;
        const tone = tones[m.code] ?? "none";
        const active = tone !== "none";
        const isSel = selected === m.code;
        return (
          <g key={m.code} transform={`translate(${p[0]},${p[1]})`} onClick={() => onSelect?.(m.code)} className={onSelect ? "cursor-pointer" : ""}>
            {active && tone === "blocked" && (
              <circle r={16} fill={FILL[tone]} opacity={0.25}>
                <animate attributeName="r" values="10;18;10" dur="1.8s" repeatCount="indefinite" />
              </circle>
            )}
            <circle r={isSel ? 8 : active ? 6 : 3} fill={FILL[tone]} stroke={isSel ? "#fff" : "#0f1726"} strokeWidth={isSel ? 2.5 : 1.5} />
            <text x={10} y={4} fontSize={12} fontWeight={600} fill={active ? "#fff" : "rgba(255,255,255,0.4)"} fontFamily="Inter, system-ui, sans-serif" style={{ paintOrder: "stroke", stroke: "#0f1726", strokeWidth: 3 }}>
              {m.code}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
