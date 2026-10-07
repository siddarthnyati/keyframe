import type { Frame, Theme } from "./types";

export type Cohort = {
  id: string;
  name: string;
  signals: string[];
  affinity: Partial<Record<Theme, number>>;
};

export const COHORTS: Cohort[] = [
  {
    id: "romance",
    name: "Character-led viewers",
    signals: ["Finished three character dramas this month", "Watches on living-room TV in the evening", "Skips action trailers early"],
    affinity: { romance: 1, drama: 0.9, "talent close-up": 0.7, "strong female lead": 0.5 },
  },
  {
    id: "action",
    name: "Action and creature fans",
    signals: ["Rewatched two creature features", "Mobile first, short sessions", "Clicks on wide, kinetic art"],
    affinity: { action: 1, creature: 0.9, thriller: 0.7, adventure: 0.5 },
  },
  {
    id: "coldstart",
    name: "New via telecom partner",
    signals: ["No viewing history yet", "Arrived through a partner bundle, Tamil Nadu", "Consented travel co-brand on the partner card"],
    affinity: { adventure: 1, fantasy: 0.8, "strong female lead": 0.6, action: 0.3 },
  },
];

export type SimVariant = { id: string; frame: Frame; label: string; dataUrl: string };

export function matchScore(cohort: Cohort, frame: Frame) {
  const themes = frame.tags?.themes ?? [];
  let s = 0;
  for (const t of themes) s += cohort.affinity[t] ?? 0;
  return s / Math.max(1, themes.length);
}

/** Seeded PRNG so the story is repeatable. */
function mulberry32(a: number) {
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function gammaSample(rand: () => number, k: number): number {
  // Marsaglia-Tsang for k >= 1; boost for k < 1
  if (k < 1) return gammaSample(rand, k + 1) * Math.pow(rand(), 1 / k);
  const d = k - 1 / 3;
  const c = 1 / Math.sqrt(9 * d);
  for (;;) {
    let x: number;
    let v: number;
    do {
      const u1 = rand();
      const u2 = rand();
      x = Math.sqrt(-2 * Math.log(u1 || 1e-9)) * Math.cos(2 * Math.PI * u2);
      v = 1 + c * x;
    } while (v <= 0);
    v = v * v * v;
    const u = rand();
    if (u < 1 - 0.0331 * x * x * x * x) return d * v;
    if (Math.log(u) < 0.5 * x * x + d * (1 - v + Math.log(v))) return d * v;
  }
}
function betaSample(rand: () => number, a: number, b: number) {
  const x = gammaSample(rand, a);
  const y = gammaSample(rand, b);
  return x / (x + y);
}

export type DayAllocation = number[]; // share per variant for one cohort on one day
export type SimResult = {
  days: number;
  allocation: Record<string, DayAllocation[]>; // cohortId -> day -> shares
  totals: {
    id: string;
    impressions: number;
    clicks: number;
    retained: number; // watched past two minutes
  }[];
};

export type SimOptions = { exploreShare: number; diversityCap: boolean; days?: number };

/** Thompson sampling per cohort, with a deliberate "bait" variant that clicks well and retains badly. */
export function simulate(variants: SimVariant[], opts: SimOptions): SimResult {
  const days = opts.days ?? 14;
  const rand = mulberry32(42);
  const n = variants.length;
  const perDay = 12000;

  // True rates
  const bait = n > 1 ? 1 : -1; // the second starred frame plays the bait role
  const trueCTR = (cohortIdx: number, v: number) => {
    const m = matchScore(COHORTS[cohortIdx], variants[v].frame);
    const base = 0.028 + 0.034 * m;
    return v === bait ? base + 0.018 : base;
  };
  const trueRetain = (v: number) => (v === bait ? 0.31 : 0.58 + 0.06 * ((v * 7) % 3));

  const allocation: Record<string, DayAllocation[]> = {};
  const totals = variants.map((v) => ({ id: v.id, impressions: 0, clicks: 0, retained: 0 }));

  COHORTS.forEach((cohort, ci) => {
    const a = new Array(n).fill(1);
    const b = new Array(n).fill(1);
    const daysAlloc: DayAllocation[] = [];
    for (let d = 0; d < days; d++) {
      // Sample a winner many times to estimate today's share
      const wins = new Array(n).fill(0);
      for (let s = 0; s < 400; s++) {
        let best = 0;
        let bestV = -1;
        for (let v = 0; v < n; v++) {
          const draw = betaSample(rand, a[v], b[v]);
          if (draw > bestV) {
            bestV = draw;
            best = v;
          }
        }
        wins[best]++;
      }
      let share = wins.map((x) => x / 400);
      // Explore floor
      const floor = opts.exploreShare / n;
      share = share.map((x) => x * (1 - opts.exploreShare) + floor);
      // Diversity cap: no variant above 70% of a cohort's row
      if (opts.diversityCap) {
        const cap = 0.7;
        let excess = 0;
        share = share.map((x) => {
          if (x > cap) {
            excess += x - cap;
            return cap;
          }
          return x;
        });
        const under = share.filter((x) => x < cap).length || 1;
        share = share.map((x) => (x < cap ? x + excess / under : x));
      }
      daysAlloc.push(share);
      // Observe
      for (let v = 0; v < n; v++) {
        const imps = Math.round(perDay * share[v]);
        const clicks = Math.round(imps * trueCTR(ci, v) * (0.9 + 0.2 * rand()));
        const retained = Math.round(clicks * trueRetain(v));
        a[v] += clicks;
        b[v] += imps - clicks;
        totals[v].impressions += imps;
        totals[v].clicks += clicks;
        totals[v].retained += retained;
      }
    }
    allocation[cohort.id] = daysAlloc;
  });

  return { days, allocation, totals };
}
