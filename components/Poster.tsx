"use client";

import type { Title } from "@/lib/data";

/** Official poster, hotlinked from IMDb (Amazon). Width in px; height follows 2:3. */
export default function Poster({ t, w = 96, className = "", rounded = 6 }: { t: Title; w?: number; className?: string; rounded?: number }) {
  const h = Math.round((w * 3) / 2);
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={t.poster}
      alt={`${t.name} poster`}
      width={w}
      height={h}
      loading="lazy"
      className={`shrink-0 bg-bg2 object-cover ${className}`}
      style={{ width: w, height: h, borderRadius: rounded }}
    />
  );
}
