// Seeded demo data for Launch Desk. Every title is a Blender Foundation open movie (CC BY),
// every vendor, person, number and signal is invented. Nothing here is Amazon data.

export const TODAY = "2026-10-07";

export type Status = "approved" | "in_review" | "received" | "planned" | "rejected" | "late" | "missing";

export const STATUS_LABEL: Record<Status, string> = {
  approved: "Approved",
  in_review: "In review",
  received: "Received",
  planned: "Not due yet",
  rejected: "Rejected",
  late: "Late",
  missing: "Missing",
};

export type DeliverableId = "keyart" | "trailer" | "dub" | "subs" | "social" | "crm";
export const DELIVERABLES: { id: DeliverableId; label: string; short: string; who: string }[] = [
  { id: "keyart", label: "Key art set", short: "Key art", who: "Artwork adaptation vendor" },
  { id: "trailer", label: "Trailer", short: "Trailer", who: "Creative agency" },
  { id: "dub", label: "Dubbed trailer", short: "Dub", who: "Dubbing studio" },
  { id: "subs", label: "Subtitles", short: "Subs", who: "Subtitle vendor" },
  { id: "social", label: "Social cuts", short: "Social", who: "Creative agency" },
  { id: "crm", label: "CRM email", short: "CRM", who: "Internal CRM team" },
];

export type Market = { code: string; name: string; locale: string; lat: number; lon: number; region: string };
export const MARKETS: Market[] = [
  { code: "US", name: "United States", locale: "en-US", lat: 38.9, lon: -95.7, region: "Americas" },
  { code: "CA", name: "Canada", locale: "en-CA", lat: 51.3, lon: -97.1, region: "Americas" },
  { code: "MX", name: "Mexico", locale: "es-MX", lat: 23.6, lon: -102.5, region: "Americas" },
  { code: "BR", name: "Brazil", locale: "pt-BR", lat: -14.2, lon: -51.9, region: "Americas" },
  { code: "UK", name: "United Kingdom", locale: "en-GB", lat: 54.0, lon: -2.5, region: "Europe" },
  { code: "DE", name: "Germany", locale: "de-DE", lat: 51.2, lon: 10.4, region: "Europe" },
  { code: "FR", name: "France", locale: "fr-FR", lat: 46.6, lon: 2.2, region: "Europe" },
  { code: "ES", name: "Spain", locale: "es-ES", lat: 40.4, lon: -3.7, region: "Europe" },
  { code: "IT", name: "Italy", locale: "it-IT", lat: 42.5, lon: 12.5, region: "Europe" },
  { code: "NL", name: "Netherlands", locale: "nl-NL", lat: 52.1, lon: 5.3, region: "Europe" },
  { code: "SE", name: "Sweden", locale: "sv-SE", lat: 62.0, lon: 15.0, region: "Europe" },
  { code: "PL", name: "Poland", locale: "pl-PL", lat: 52.0, lon: 19.1, region: "Europe" },
  { code: "IN", name: "India", locale: "hi-IN", lat: 21.0, lon: 78.0, region: "Asia Pacific" },
  { code: "JP", name: "Japan", locale: "ja-JP", lat: 36.2, lon: 138.3, region: "Asia Pacific" },
  { code: "KR", name: "South Korea", locale: "ko-KR", lat: 36.5, lon: 127.9, region: "Asia Pacific" },
  { code: "AU", name: "Australia", locale: "en-AU", lat: -25.3, lon: 133.8, region: "Asia Pacific" },
];
export const marketByCode = Object.fromEntries(MARKETS.map((m) => [m.code, m])) as Record<string, Market>;

export type Stage = "launching" | "live" | "planning";
export type Title = {
  id: string;
  name: string;
  kind: string;
  launch: string; // ISO date
  markets: string[];
  stage: Stage;
  producer: string;
  logline: string;
  hue: number; // placeholder art colour
};

export const TITLES: Title[] = [
  { id: "sintel", name: "Sintel", kind: "Fantasy adventure, feature", launch: "2026-10-16", markets: ["US", "UK", "DE", "FR", "BR", "MX", "JP", "IN"], stage: "launching", producer: "Priya N.", logline: "A young woman crosses the world to find the dragon she raised.", hue: 28 },
  { id: "tears", name: "Tears of Steel", kind: "Science fiction, feature", launch: "2026-10-30", markets: ["US", "CA", "UK", "DE", "FR", "ES", "IT", "NL", "SE", "PL", "JP", "AU"], stage: "launching", producer: "Marco D.", logline: "Forty years on, a group of scientists tries to undo the day the robots came.", hue: 205 },
  { id: "bunny", name: "Big Buck Bunny", kind: "Animated comedy, kids", launch: "2026-11-06", markets: ["US", "CA", "UK", "DE", "FR", "ES", "MX", "BR", "IN", "AU"], stage: "launching", producer: "Hannah L.", logline: "A gentle giant of a rabbit plans a very polite revenge.", hue: 95 },
  { id: "cosmos", name: "Cosmos Laundromat", kind: "Comedy drama, series", launch: "2026-11-20", markets: ["US", "UK", "DE", "FR", "NL", "JP", "KR"], stage: "planning", producer: "Marco D.", logline: "A suicidal sheep gets an offer he cannot understand.", hue: 320 },
  { id: "spring", name: "Spring", kind: "Fantasy, short", launch: "2026-12-04", markets: ["US", "UK", "DE", "FR", "JP", "KR", "AU"], stage: "planning", producer: "Priya N.", logline: "A shepherd girl and her dog face the spirits of the old season.", hue: 150 },
  { id: "agent", name: "Agent 327", kind: "Action comedy, series", launch: "2026-12-12", markets: ["US", "UK", "NL", "DE", "FR", "ES", "IT", "PL", "SE"], stage: "planning", producer: "Hannah L.", logline: "The Netherlands' least secret secret agent returns.", hue: 0 },
  { id: "elephants", name: "Elephants Dream", kind: "Surreal animation, feature", launch: "2026-09-25", markets: ["US", "UK", "DE", "FR", "JP"], stage: "live", producer: "Priya N.", logline: "Two characters explore a machine that may not exist.", hue: 260 },
  { id: "caminandes", name: "Caminandes", kind: "Comedy shorts, kids", launch: "2026-09-18", markets: ["US", "MX", "BR", "ES", "IT"], stage: "live", producer: "Hannah L.", logline: "A llama with big plans and small luck.", hue: 45 },
];
export const titleById = Object.fromEntries(TITLES.map((t) => [t.id, t])) as Record<string, Title>;

export type Check = { label: string; status: "pass" | "fail" };
export type Cell = {
  title: string;
  market: string;
  deliverable: DeliverableId;
  status: Status;
  owner: string;
  due: string;
  note?: string;
  checks?: Check[];
};

const VENDORS: Record<DeliverableId, (m: Market) => string> = {
  keyart: () => "Halftone Studio (artwork adaptation)",
  trailer: () => "Bright Street (agency)",
  dub: (m) => (m.region === "Europe" ? "Nordlicht Dub" : m.region === "Asia Pacific" ? "Tokyo Script House" : "Casa Doblaje"),
  subs: () => "Linea Subtitles",
  social: () => "Bright Street (agency)",
  crm: () => "CRM team (internal)",
};

function hash(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return (h >>> 0) / 4294967295;
}
function addDays(iso: string, d: number) {
  const t = new Date(iso + "T00:00:00Z");
  t.setUTCDate(t.getUTCDate() + d);
  return t.toISOString().slice(0, 10);
}
export function daysBetween(a: string, b: string) {
  return Math.round((new Date(b + "T00:00:00Z").getTime() - new Date(a + "T00:00:00Z").getTime()) / 86400000);
}
export function daysToLaunch(t: Title) {
  return daysBetween(TODAY, t.launch);
}
export function fmtDate(iso: string) {
  return new Date(iso + "T00:00:00Z").toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" });
}

const LEAD: Record<DeliverableId, number> = { keyart: 10, trailer: 12, dub: 7, subs: 6, social: 5, crm: 3 };

function generateCells(): Cell[] {
  const out: Cell[] = [];
  for (const t of TITLES) {
    for (const code of t.markets) {
      const m = marketByCode[code];
      for (const d of DELIVERABLES) {
        const due = addDays(t.launch, -LEAD[d.id]);
        const r = hash(`${t.id}:${code}:${d.id}`);
        let status: Status;
        if (t.stage === "live") status = "approved";
        else if (t.stage === "planning") status = daysBetween(TODAY, due) > 20 ? "planned" : r < 0.3 ? "received" : r < 0.45 ? "in_review" : "planned";
        else {
          const dtl = daysToLaunch(t);
          if (dtl <= 10) status = r < 0.78 ? "approved" : r < 0.92 ? "in_review" : "received";
          else status = r < 0.4 ? "approved" : r < 0.6 ? "in_review" : r < 0.75 ? "received" : "planned";
        }
        // Dubs do not apply to the market's own language.
        if (d.id === "dub" && (code === "US" || code === "UK" || code === "CA" || code === "AU")) continue;
        out.push({ title: t.id, market: code, deliverable: d.id, status, owner: VENDORS[d.id](m), due });
      }
    }
  }
  // Sintel: the story the demo tells. Three blockers, one near miss.
  const set = (market: string, deliverable: DeliverableId, patch: Partial<Cell>) => {
    const c = out.find((x) => x.title === "sintel" && x.market === market && x.deliverable === deliverable);
    if (c) Object.assign(c, patch);
  };
  for (const code of titleById.sintel.markets) for (const d of DELIVERABLES) set(code, d.id, { status: "approved" });
  set("DE", "dub", { status: "late", due: "2026-10-05", note: "Nordlicht Dub confirmed the mix slipped; new ETA Oct 9. Launch is Oct 16." });
  set("JP", "keyart", {
    status: "rejected",
    due: "2026-10-06",
    note: "Rejected at upload: no 2:3 poster in the set. Mandatory since Jan 30 for mobile discovery.",
    checks: [
      { label: "Poster 2:3 present", status: "fail" },
      { label: "Hero is text-free", status: "pass" },
      { label: "Title legible at 120px", status: "pass" },
      { label: "Tagline inside safe area", status: "pass" },
    ],
  });
  set("BR", "social", {
    status: "in_review",
    due: "2026-10-11",
    note: "Portuguese tagline runs 9% past the safe area on the 9:16 cut. Agency has the note.",
    checks: [
      { label: "Aspect 9:16", status: "pass" },
      { label: "Tagline inside safe area", status: "fail" },
      { label: "Service badge colour", status: "pass" },
    ],
  });
  set("IN", "subs", { status: "in_review", due: "2026-10-10", note: "Hindi subtitles received Oct 6, in linguistic QC." });
  set("MX", "crm", { status: "received", due: "2026-10-13" });
  set("FR", "social", { status: "in_review", due: "2026-10-11" });
  set("IN", "crm", { status: "received", due: "2026-10-13" });
  return out;
}
export const CELLS: Cell[] = generateCells();

export function cellsFor(titleId: string) {
  return CELLS.filter((c) => c.title === titleId);
}
export function readiness(titleId: string) {
  const cells = cellsFor(titleId);
  const total = cells.length;
  const approved = cells.filter((c) => c.status === "approved").length;
  const blockers = cells.filter((c) => c.status === "rejected" || c.status === "late" || c.status === "missing" || (c.checks ?? []).some((k) => k.status === "fail"));
  const inReview = cells.filter((c) => c.status === "in_review" || c.status === "received").length;
  return { total, approved, inReview, blockers, pct: total ? Math.round((approved / total) * 100) : 0 };
}
export function marketState(titleId: string, code: string): "ready" | "blocked" | "in_progress" | "planned" | "live" {
  const t = titleById[titleId];
  if (t.stage === "live") return "live";
  const cells = CELLS.filter((c) => c.title === titleId && c.market === code);
  if (cells.some((c) => c.status === "rejected" || c.status === "late" || c.status === "missing" || (c.checks ?? []).some((k) => k.status === "fail"))) return "blocked";
  if (cells.every((c) => c.status === "approved")) return "ready";
  if (cells.every((c) => c.status === "planned")) return "planned";
  return "in_progress";
}

// Requests: the intake queue.
export type TicketType = "Asset request" | "Localization" | "Spec rejection" | "Brief" | "Placement" | "Data pull" | "Budget";
export type Ticket = {
  id: string;
  type: TicketType;
  subject: string;
  from: string;
  title?: string;
  market?: string;
  received: string;
  due: string;
  priority: "P0" | "P1" | "P2";
  status: "New" | "Triaged" | "In progress" | "Done";
  suggested: { owner: string; link: string; why: string };
};
export const TICKETS: Ticket[] = [
  { id: "REQ-2418", type: "Spec rejection", subject: "Sintel JP key art bounced at upload, no 2:3 poster", from: "Asset Ops, Tokyo", title: "sintel", market: "JP", received: "2026-10-06", due: "2026-10-08", priority: "P0", status: "New", suggested: { owner: "Halftone Studio", link: "Sintel, Japan, Key art set", why: "Blocks the Oct 16 launch in Japan. Vendor already has the source files." } },
  { id: "REQ-2417", type: "Asset request", subject: "9:16 cut of the Sintel trailer for TikTok Brazil", from: "Social, LatAm", title: "sintel", market: "BR", received: "2026-10-06", due: "2026-10-10", priority: "P1", status: "New", suggested: { owner: "Bright Street (agency)", link: "Sintel, Brazil, Social cuts", why: "Same cut is in review for the tagline overflow. Fold into one delivery." } },
  { id: "REQ-2416", type: "Localization", subject: "Hindi subtitles for Sintel trailer, final pass", from: "Localization, Mumbai", title: "sintel", market: "IN", received: "2026-10-06", due: "2026-10-10", priority: "P1", status: "In progress", suggested: { owner: "Linea Subtitles", link: "Sintel, India, Subtitles", why: "Already in linguistic QC. No new work, close when QC signs." } },
  { id: "REQ-2415", type: "Placement", subject: "Homepage hero slot for Sintel, US, Oct 16 to 18", from: "Merchandising, US", title: "sintel", market: "US", received: "2026-10-05", due: "2026-10-12", priority: "P1", status: "Triaged", suggested: { owner: "Merch planning", link: "Sintel, United States, Key art set", why: "Hero art is approved. Needs the text-free hero at 1920 by 1080, already in the set." } },
  { id: "REQ-2414", type: "Brief", subject: "Creative brief for Tears of Steel launch campaign", from: "Marketing lead, EU", title: "tears", received: "2026-10-05", due: "2026-10-09", priority: "P1", status: "In progress", suggested: { owner: "Marco D.", link: "Tears of Steel brief", why: "Draft exists. Needs the signals section and sign-off from the EU lead." } },
  { id: "REQ-2413", type: "Localization", subject: "German dub of Sintel trailer is late, need new ETA in writing", from: "Localization, Berlin", title: "sintel", market: "DE", received: "2026-10-05", due: "2026-10-07", priority: "P0", status: "In progress", suggested: { owner: "Nordlicht Dub", link: "Sintel, Germany, Dubbed trailer", why: "ETA Oct 9 given by phone. Get it in writing and alert the DE launch manager." } },
  { id: "REQ-2412", type: "Asset request", subject: "Big Buck Bunny key art set, kids-safe variant for India", from: "Kids & Family, APAC", title: "bunny", market: "IN", received: "2026-10-04", due: "2026-10-20", priority: "P2", status: "Triaged", suggested: { owner: "Halftone Studio", link: "Big Buck Bunny, India, Key art set", why: "Standard variant request. Due 10 days before the Nov 6 launch." } },
  { id: "REQ-2411", type: "Data pull", subject: "Elephants Dream week-one performance by market", from: "Marketing lead, EU", title: "elephants", received: "2026-10-04", due: "2026-10-08", priority: "P2", status: "Triaged", suggested: { owner: "Marketing analytics", link: "Elephants Dream, live", why: "Standard week-one report. Runs from the dashboard, no custom work." } },
  { id: "REQ-2410", type: "Asset request", subject: "Resend the approved French tagline for Sintel social", from: "Bright Street (agency)", title: "sintel", market: "FR", received: "2026-10-03", due: "2026-10-06", priority: "P2", status: "Done", suggested: { owner: "Priya N.", link: "Sintel, France, Social cuts", why: "Sent Oct 3. Close." } },
  { id: "REQ-2409", type: "Budget", subject: "Agent 327 Q4 paid social budget reallocation", from: "Marketing lead, EU", title: "agent", received: "2026-10-03", due: "2026-10-15", priority: "P2", status: "Triaged", suggested: { owner: "Marketing finance", link: "Agent 327 plan", why: "Not a tooling or asset request. Route to finance." } },
  { id: "REQ-2408", type: "Localization", subject: "Korean subtitles for Cosmos Laundromat trailer", from: "Localization, Seoul", title: "cosmos", market: "KR", received: "2026-10-02", due: "2026-11-10", priority: "P2", status: "Triaged", suggested: { owner: "Linea Subtitles", link: "Cosmos Laundromat, South Korea, Subtitles", why: "Due Nov 10, 10 days before launch. Normal lead time." } },
  { id: "REQ-2407", type: "Spec rejection", subject: "Caminandes MX social cut rejected, burned-in text in hero crop", from: "Asset Ops, Mexico City", title: "caminandes", market: "MX", received: "2026-10-01", due: "2026-10-03", priority: "P1", status: "Done", suggested: { owner: "Bright Street (agency)", link: "Caminandes, Mexico, Social cuts", why: "Fixed and re-approved Oct 2." } },
  { id: "REQ-2406", type: "Placement", subject: "Spring in the December kids carousel, AU", from: "Merchandising, APAC", title: "spring", market: "AU", received: "2026-09-30", due: "2026-11-20", priority: "P2", status: "Triaged", suggested: { owner: "Merch planning", link: "Spring, Australia, Key art set", why: "Needs the 2:3 poster by Nov 20. Not started, not due." } },
  { id: "REQ-2405", type: "Brief", subject: "Big Buck Bunny launch brief, kids and family", from: "Kids & Family, US", title: "bunny", received: "2026-09-29", due: "2026-10-10", priority: "P1", status: "In progress", suggested: { owner: "Hannah L.", link: "Big Buck Bunny brief", why: "Draft due Oct 10. Signals section can be generated from the slate page." } },
];

// Signals: what fans are saying this week. Illustrative.
export type Signal = { phrase: string; mentions: number; change: number; where: string; note: string };
export type Signals = { week: string; sentiment: number; volume: number; top: Signal[]; audiences: { name: string; share: number; lean: string }[]; takeaways: string[] };
export const SIGNALS: Record<string, Signals> = {
  sintel: {
    week: "Sep 30 to Oct 6",
    sentiment: 0.71,
    volume: 48200,
    top: [
      { phrase: "the dragon scene", mentions: 9400, change: 0.62, where: "TikTok, YouTube Shorts", note: "The reunion in the cave is the most shared clip. People post it without the title." },
      { phrase: "Scales", mentions: 6100, change: 0.35, where: "X, Reddit", note: "The baby dragon's name is becoming the hook. Fans say 'the Scales movie'." },
      { phrase: "she walks the whole world for him", mentions: 4300, change: 0.8, where: "Instagram", note: "Quote-style posts, mostly women 18 to 34." },
      { phrase: "animated but not for kids", mentions: 2700, change: 0.12, where: "Reddit", note: "Recurring question. The adult-fantasy framing needs to be clearer in the art." },
      { phrase: "Sintel vs Spring", mentions: 1200, change: 0.4, where: "YouTube", note: "Fans pair the two titles. Cross-promotion opportunity in December." },
    ],
    audiences: [
      { name: "Adult fantasy viewers", share: 0.46, lean: "journey, dragon, loss" },
      { name: "Animation fans", share: 0.31, lean: "craft, the studio, the short-film roots" },
      { name: "Parents checking suitability", share: 0.23, lean: "is it for kids, how dark is it" },
    ],
    takeaways: [
      "Lead the social cuts with the cave reunion. It is already travelling on its own.",
      "Put the dragon in the 2:3 poster for Japan and Brazil. The name 'Scales' is doing the work there.",
      "Add a one-line rating note to the CRM email. 'Is it for kids' is the top unanswered question.",
    ],
  },
  tears: {
    week: "Sep 30 to Oct 6",
    sentiment: 0.58,
    volume: 12800,
    top: [
      { phrase: "practical effects", mentions: 3100, change: 0.2, where: "YouTube, Reddit", note: "Behind-the-scenes clips outperform the trailer two to one." },
      { phrase: "Amsterdam in 2050", mentions: 2200, change: 0.55, where: "Instagram, X", note: "Location shots are the most saved images." },
      { phrase: "robot uprising but sad", mentions: 1700, change: 0.3, where: "TikTok", note: "Tone reads as melancholy, not action. Trailer cut leans action." },
    ],
    audiences: [
      { name: "Sci-fi viewers", share: 0.52, lean: "world, effects, premise" },
      { name: "Film-craft audience", share: 0.33, lean: "how it was made" },
      { name: "Casual browsers", share: 0.15, lean: "is it an action film" },
    ],
    takeaways: ["Cut a 30-second making-of for social before launch.", "Hero art: the Amsterdam skyline, not the robot.", "Flag the tone gap to the agency before the dub scripts lock."],
  },
};

export type Brief = {
  title: string;
  status: "Draft" | "In review" | "Approved" | "Not started";
  owner: string;
  due: string;
  objective: string;
  audience: string;
  message: string;
  tone: string;
  mustHave: string[];
  avoid: string[];
};
export const BRIEFS: Brief[] = [
  { title: "sintel", status: "Approved", owner: "Priya N.", due: "2026-09-20", objective: "Drive first-week starts in 8 markets with a fantasy-first position; make the adult rating clear.", audience: "Adult fantasy viewers first, animation fans second. Parents are a reassurance audience, not a target.", message: "She crossed the world for a dragon.", tone: "Epic, quiet, earned. No jokes in the key art.", mustHave: ["Dragon visible in the 2:3 poster for JP, BR, IN", "Cave reunion in the first 6 seconds of every social cut", "Rating line in CRM"], avoid: ["Kid-show palette", "Text on the hero", "More than two faces in any frame"] },
  { title: "tears", status: "In review", owner: "Marco D.", due: "2026-10-09", objective: "Launch in 12 markets with a world-first position; recruit the film-craft audience early.", audience: "Sci-fi viewers, then the film-craft audience that already shares the making-of.", message: "Forty years on, they go back for the day it all went wrong.", tone: "Melancholy, grounded. The city is a character.", mustHave: ["Amsterdam skyline as hero art", "30-second making-of for social", "Tone note to dubbing before scripts lock"], avoid: ["Robot-centred key art", "Action-trailer music bed in social cuts"] },
  { title: "bunny", status: "Draft", owner: "Hannah L.", due: "2026-10-10", objective: "Family launch across 10 markets ahead of the school break.", audience: "Parents of 4 to 9 year olds; the kids themselves on co-viewing.", message: "The nicest rabbit you will ever meet. Mostly.", tone: "Warm, bright, a little mischievous.", mustHave: ["Kids-safe key art variant for IN", "Sunday-morning CRM send"], avoid: ["Anything that reads as scary in the thumbnail"] },
  { title: "cosmos", status: "Not started", owner: "Marco D.", due: "2026-10-24", objective: "", audience: "", message: "", tone: "", mustHave: [], avoid: [] },
  { title: "spring", status: "Not started", owner: "Priya N.", due: "2026-11-06", objective: "", audience: "", message: "", tone: "", mustHave: [], avoid: [] },
  { title: "agent", status: "Not started", owner: "Hannah L.", due: "2026-11-14", objective: "", audience: "", message: "", tone: "", mustHave: [], avoid: [] },
];

export const UPDATE_SEED = {
  status: `Sintel launch status, Mon Oct 7. Launch Oct 16 in 8 markets, 9 days out.

Not ready. 3 blockers, 4 items in review, 38 of 45 deliverables approved.

Blocking
1. Germany, dubbed trailer: late. Nordlicht Dub slipped the mix; verbal ETA Oct 9. I am getting it in writing today and the DE launch manager knows.
2. Japan, key art: rejected at upload, no 2:3 poster in the set. Halftone Studio has the files; fix due Oct 8. This one is on the spec, not the art.
3. Brazil, social cuts: Portuguese tagline runs past the safe area on the 9:16. Agency has the note; revised cut due Oct 11.

In review
India subtitles (Hindi, linguistic QC), France and Brazil social cuts, Mexico and India CRM emails.

Nothing needed from this group this week. If Nordlicht misses Oct 9 I will ask for the English trailer with German subtitles as the DE fallback on Oct 10.`,
  chase: `Subject: Sintel German dub, written ETA needed today

Hi Nordlicht team,

Thanks for the call yesterday. Can you confirm in writing that the German dub of the Sintel trailer will be delivered by end of day Oct 9 (CET)?

Our launch is Oct 16 and the trailer has to clear QC and trafficking before Oct 12. If Oct 9 is at risk, please say so today so we can prepare the subtitled fallback.

Delivery spec is unchanged: ProRes 422 HQ, stereo and 5.1 stems, 25 fps, filename per the VAM sheet.

Thank you,
Priya`,
};
