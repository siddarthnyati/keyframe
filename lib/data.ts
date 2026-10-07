// Seeded demo data for Launch Desk.
// Titles, launch dates and artwork are real Prime Video titles from public announcements and IMDb.
// Markets, vendors, people, tickets, statuses and numbers are invented to show the workflow. Nothing here is Amazon data.

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
  launch: string; // ISO date, from public announcements
  markets: string[]; // demo subset; Prime Video launches in 240+ territories
  stage: Stage;
  producer: string; // invented
  logline: string;
  release: string;
  poster: string; // official key art, hotlinked from IMDb (Amazon)
  imdb: string;
};

const IMG = (id: string) => `https://m.media-amazon.com/images/M/${id}._V1_.jpg`;
const BIG12 = ["US", "CA", "UK", "AU", "DE", "FR", "ES", "IT", "BR", "MX", "JP", "IN"];

export const TITLES: Title[] = [
  { id: "terminal", name: "The Terminal List, season 2", kind: "Action thriller series", launch: "2026-10-21", markets: BIG12, stage: "launching", producer: "Priya N.", logline: "Reece hunts a Moscow-to-Langley conspiracy across four continents. Adapts Jack Carr's True Believer.", release: "all 8 episodes at once, 240+ territories", poster: IMG("MV5BYTFiZDQ1NWItODBkZS00ZjA1LThkNzUtY2M5Yzk2M2Y3ZDNkXkEyXkFqcGc@"), imdb: "https://www.imdb.com/title/tt11743610/" },
  { id: "love", name: "Love of Your Life", kind: "Romantic drama, film", launch: "2026-10-14", markets: BIG12, stage: "launching", producer: "Marco D.", logline: "James L. Brooks directs Margaret Qualley, with Gabriel Basso and Aaron Pierre. Limited theaters Oct 7, Prime Video Oct 14.", release: "global same day, 240+ territories", poster: IMG("MV5BNDZjM2Y5NWUtODhjMi00N2MwLWEwMTktZDUwNzg1Y2Y1OWNkXkEyXkFqcGc@"), imdb: "https://www.imdb.com/title/tt34384900/" },
  { id: "masterplan", name: "Masterplan", kind: "Thriller, film", launch: "2026-10-16", markets: ["US", "CA", "UK", "AU", "DE", "FR", "ES", "IT", "BR", "MX"], stage: "launching", producer: "Hannah L.", logline: "Stanley Tucci's veteran thief recruits two strangers to steal the Mona Lisa.", release: "global same day, 240+ territories", poster: IMG("MV5BNjIyYjlmOTAtYTMzZC00OTM1LWE5YWUtZWMzZTQ1OWEyYWIzXkEyXkFqcGc@"), imdb: "https://www.imdb.com/title/tt38672588/" },
  { id: "helluva", name: "Helluva Boss, season 3", kind: "Adult animation series", launch: "2026-10-14", markets: ["US", "CA", "UK", "AU", "DE", "FR", "BR", "MX"], stage: "launching", producer: "Hannah L.", logline: "Vivienne Medrano's hellish assassins return for a third season.", release: "weekly", poster: IMG("MV5BNmMwMWRmNTgtMDkzYy00ZmNhLTlhYzctYjQyODBmZmRhMjBmXkEyXkFqcGc@"), imdb: "https://www.imdb.com/title/tt10691770/" },
  { id: "greatest", name: "The Greatest", kind: "Biographical miniseries", launch: "2026-11-04", markets: BIG12, stage: "planning", producer: "Marco D.", logline: "The first estate-authorized scripted Ali series. 1960 to 1964, Cassius Clay to Muhammad Ali.", release: "8 episodes, 240+ territories", poster: IMG("MV5BNzM3YzU3ZjgtZDMyNC00MGU1LWI3MjYtMTVhZTkyZGUzZjc3XkEyXkFqcGc@"), imdb: "https://www.imdb.com/title/tt15715850/" },
  { id: "rings", name: "The Rings of Power, season 3", kind: "Fantasy series", launch: "2026-11-11", markets: [...BIG12, "NL", "SE", "PL", "KR"], stage: "planning", producer: "Priya N.", logline: "The War of the Elves and the forging of the One Ring. Simon Pegg voices the Balrog.", release: "episodes 1 to 4 on Nov 11, then 2 a week, 240+ territories", poster: IMG("MV5BMjlhYTk3ZGQtNjdlYi00NDQyLTgxZTEtMzk0OTU5OTRhNGZhXkEyXkFqcGc@"), imdb: "https://www.imdb.com/title/tt7631058/" },
  { id: "madden", name: "Madden", kind: "Sports biopic, film", launch: "2026-11-18", markets: ["US", "CA", "UK", "AU", "DE", "MX", "BR"], stage: "planning", producer: "Hannah L.", logline: "Nicolas Cage as John Madden, Christian Bale as Al Davis. David O. Russell directs.", release: "select theaters Nov 11, Prime Video Nov 18", poster: IMG("MV5BOGQ0YzA4ZTAtZjlmYS00ZGU3LTg2MGItYmI2MzQ5MDY4YWE3XkEyXkFqcGc@"), imdb: "https://www.imdb.com/title/tt24818230/" },
  { id: "bladerunner", name: "Blade Runner 2099", kind: "Science fiction series", launch: "2026-11-25", markets: [...BIG12, "KR", "NL", "SE"], stage: "planning", producer: "Marco D.", logline: "Los Angeles, 2099. Hunter Schafer and Michelle Yeoh. A one-season limited series.", release: "all 8 episodes at once, 240+ territories", poster: IMG("MV5BZjdjODQ3ZWQtNzIzZS00NmRmLTg3YTgtOTM0NzQ2NmVlZDg5XkEyXkFqcGc@"), imdb: "https://www.imdb.com/title/tt18224594/" },
  { id: "carrie", name: "Carrie", kind: "Horror series", launch: "2026-10-07", markets: BIG12, stage: "live", producer: "Priya N.", logline: "Mike Flanagan moves Stephen King's outcast to a present-day high school.", release: "all 8 episodes, 240+ territories", poster: IMG("MV5BZTRhNGJmY2YtYjNmOC00ZTA4LThjMzktYTEwYTdkZDE0OTllXkEyXkFqcGc@"), imdb: "https://www.imdb.com/title/tt11540908/" },
  { id: "prefiero", name: "Prefiero la Muerte", kind: "Drama series, Mexico", launch: "2026-10-02", markets: ["MX", "ES", "US", "BR", "CA"], stage: "live", producer: "Hannah L.", logline: "A teen gets bitten by a zombie in small-town Mexico. Horror comedy, coming of age.", release: "all 8 episodes, 240+ territories", poster: IMG("MV5BMGZjNzI3OTUtMzc0Ny00MDVhLWE2ZmYtYzAyYWI1ZTU0NzZiXkEyXkFqcGc@"), imdb: "https://www.imdb.com/title/tt31841438/" },
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
const EN = new Set(["US", "UK", "CA", "AU"]);

function generateCells(): Cell[] {
  const out: Cell[] = [];
  for (const t of TITLES) {
    for (const code of t.markets) {
      const m = marketByCode[code];
      for (const d of DELIVERABLES) {
        if (d.id === "dub" && EN.has(code)) continue;
        const due = addDays(t.launch, -LEAD[d.id]);
        const r = hash(`${t.id}:${code}:${d.id}`);
        let status: Status;
        if (t.stage === "live") status = "approved";
        else if (t.stage === "planning") status = daysBetween(TODAY, due) > 20 ? (r < 0.15 ? "received" : "planned") : r < 0.3 ? "received" : r < 0.5 ? "in_review" : r < 0.6 ? "approved" : "planned";
        else {
          const dtl = daysToLaunch(t);
          if (dtl <= 8) status = r < 0.9 ? "approved" : "in_review";
          else if (dtl <= 15) status = r < 0.8 ? "approved" : r < 0.93 ? "in_review" : "received";
          else status = r < 0.5 ? "approved" : r < 0.7 ? "in_review" : r < 0.85 ? "received" : "planned";
        }
        out.push({ title: t.id, market: code, deliverable: d.id, status, owner: VENDORS[d.id](m), due });
      }
    }
  }
  // The Terminal List, season 2: the story the demo tells. Three blockers, a handful in review.
  const set = (market: string, deliverable: DeliverableId, patch: Partial<Cell>) => {
    const c = out.find((x) => x.title === "terminal" && x.market === market && x.deliverable === deliverable);
    if (c) Object.assign(c, patch);
  };
  for (const code of titleById.terminal.markets) for (const d of DELIVERABLES) set(code, d.id, { status: "approved" });
  set("DE", "dub", { status: "late", due: "2026-10-05", note: "Nordlicht Dub confirmed the German mix slipped. New ETA Oct 9, by phone. Launch is Oct 21." });
  set("JP", "keyart", {
    status: "rejected",
    due: "2026-10-06",
    note: "Rejected at upload: no 2:3 poster in the set. Mandatory for mobile discovery since Jan 30.",
    checks: [
      { label: "Poster 2:3 present", status: "fail" },
      { label: "Hero is text-free", status: "pass" },
      { label: "Title treatment legible at 120px", status: "pass" },
      { label: "Tagline inside safe area", status: "pass" },
    ],
  });
  set("BR", "social", {
    status: "in_review",
    due: "2026-10-16",
    note: "Portuguese tagline runs 9% past the safe area on the 9:16 cut. Agency has the note.",
    checks: [
      { label: "Aspect 9:16", status: "pass" },
      { label: "Tagline inside safe area", status: "fail" },
      { label: "Service badge colour", status: "pass" },
    ],
  });
  set("IN", "subs", { status: "in_review", due: "2026-10-15", note: "Hindi subtitles received Oct 6, in linguistic QC." });
  set("ES", "dub", { status: "in_review", due: "2026-10-14" });
  set("FR", "social", { status: "in_review", due: "2026-10-16" });
  set("MX", "crm", { status: "received", due: "2026-10-18" });
  set("IN", "crm", { status: "received", due: "2026-10-18" });
  // Love of Your Life, a week out and clean.
  for (const code of titleById.love.markets) for (const d of DELIVERABLES) {
    const c = out.find((x) => x.title === "love" && x.market === code && x.deliverable === d.id);
    if (c) c.status = hash(`love:${code}:${d.id}:x`) < 0.93 ? "approved" : "in_review";
  }
  return out;
}
export const CELLS: Cell[] = generateCells();

export function cellsFor(titleId: string) {
  return CELLS.filter((c) => c.title === titleId);
}
export function isBlocking(c: Cell) {
  return c.status === "rejected" || c.status === "late" || c.status === "missing" || (c.checks ?? []).some((k) => k.status === "fail");
}
export function readiness(titleId: string) {
  const cells = cellsFor(titleId);
  const total = cells.length;
  const approved = cells.filter((c) => c.status === "approved").length;
  const blockers = cells.filter(isBlocking);
  const inReview = cells.filter((c) => (c.status === "in_review" || c.status === "received") && !isBlocking(c)).length;
  return { total, approved, inReview, blockers, pct: total ? Math.round((approved / total) * 100) : 0 };
}
export function marketState(titleId: string, code: string): "ready" | "blocked" | "in_progress" | "planned" | "live" {
  const t = titleById[titleId];
  if (t.stage === "live") return "live";
  const cells = CELLS.filter((c) => c.title === titleId && c.market === code);
  if (cells.some(isBlocking)) return "blocked";
  if (cells.every((c) => c.status === "approved")) return "ready";
  if (cells.every((c) => c.status === "planned")) return "planned";
  return "in_progress";
}

// Requests: the intake queue. Invented, shaped like the real ones.
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
  { id: "REQ-2418", type: "Spec rejection", subject: "Terminal List S2 Japan key art bounced at upload, no 2:3 poster", from: "Asset Ops, Tokyo", title: "terminal", market: "JP", received: "2026-10-06", due: "2026-10-08", priority: "P0", status: "New", suggested: { owner: "Halftone Studio", link: "The Terminal List S2, Japan, Key art set", why: "Blocks the Oct 21 launch in Japan. Vendor already has the source files; this is a missing size, not new art." } },
  { id: "REQ-2417", type: "Asset request", subject: "9:16 cut of the Terminal List S2 trailer for TikTok Brazil", from: "Social, LatAm", title: "terminal", market: "BR", received: "2026-10-06", due: "2026-10-14", priority: "P1", status: "New", suggested: { owner: "Bright Street (agency)", link: "The Terminal List S2, Brazil, Social cuts", why: "The same cut is in review for the tagline overflow. Fold into one delivery." } },
  { id: "REQ-2416", type: "Localization", subject: "Hindi subtitles for the Terminal List S2 trailer, final pass", from: "Localization, Mumbai", title: "terminal", market: "IN", received: "2026-10-06", due: "2026-10-15", priority: "P1", status: "In progress", suggested: { owner: "Linea Subtitles", link: "The Terminal List S2, India, Subtitles", why: "Already in linguistic QC. No new work; close when QC signs." } },
  { id: "REQ-2415", type: "Placement", subject: "Homepage hero for Love of Your Life, US, Oct 14 to 16", from: "Merchandising, US", title: "love", market: "US", received: "2026-10-05", due: "2026-10-10", priority: "P1", status: "Triaged", suggested: { owner: "Merch planning", link: "Love of Your Life, United States, Key art set", why: "Hero art is approved. Needs the text-free hero at 1920 by 1080, already in the set." } },
  { id: "REQ-2414", type: "Brief", subject: "Creative brief for The Rings of Power season 3 launch", from: "Marketing lead, EU", title: "rings", received: "2026-10-05", due: "2026-10-12", priority: "P1", status: "In progress", suggested: { owner: "Priya N.", link: "The Rings of Power S3 brief", why: "Draft exists. Needs this week's coverage folded in and sign-off from the EU lead." } },
  { id: "REQ-2413", type: "Localization", subject: "German dub of the Terminal List S2 trailer is late, need the ETA in writing", from: "Localization, Berlin", title: "terminal", market: "DE", received: "2026-10-05", due: "2026-10-07", priority: "P0", status: "In progress", suggested: { owner: "Nordlicht Dub", link: "The Terminal List S2, Germany, Dubbed trailer", why: "ETA Oct 9 given by phone. Get it in writing and alert the DE launch manager." } },
  { id: "REQ-2412", type: "Asset request", subject: "Madden key art, theatrical and streaming variants for Canada", from: "Theatrical, Toronto", title: "madden", market: "CA", received: "2026-10-04", due: "2026-10-30", priority: "P2", status: "Triaged", suggested: { owner: "Halftone Studio", link: "Madden, Canada, Key art set", why: "Day-and-date title needs both lockups. Due 19 days before Nov 18." } },
  { id: "REQ-2411", type: "Data pull", subject: "Carrie day-one performance by market, with review-score context", from: "Marketing lead, US", title: "carrie", received: "2026-10-04", due: "2026-10-09", priority: "P2", status: "Triaged", suggested: { owner: "Marketing analytics", link: "Carrie, live", why: "Standard day-one report. Runs from the dashboard; add the RT 85% and Metacritic 74 for context." } },
  { id: "REQ-2410", type: "Asset request", subject: "Resend the approved French tagline for Terminal List S2 social", from: "Bright Street (agency)", title: "terminal", market: "FR", received: "2026-10-03", due: "2026-10-06", priority: "P2", status: "Done", suggested: { owner: "Priya N.", link: "The Terminal List S2, France, Social cuts", why: "Sent Oct 3. Close." } },
  { id: "REQ-2409", type: "Budget", subject: "Blade Runner 2099 Q4 paid social reallocation", from: "Marketing lead, EU", title: "bladerunner", received: "2026-10-03", due: "2026-10-15", priority: "P2", status: "Triaged", suggested: { owner: "Marketing finance", link: "Blade Runner 2099 plan", why: "Not a tooling or asset request. Route to finance." } },
  { id: "REQ-2408", type: "Localization", subject: "Korean subtitles for the Blade Runner 2099 trailer", from: "Localization, Seoul", title: "bladerunner", market: "KR", received: "2026-10-02", due: "2026-11-15", priority: "P2", status: "Triaged", suggested: { owner: "Linea Subtitles", link: "Blade Runner 2099, South Korea, Subtitles", why: "Due Nov 15, ten days before launch. Normal lead time." } },
  { id: "REQ-2407", type: "Spec rejection", subject: "Prefiero la Muerte MX social cut rejected, burned-in text in the hero crop", from: "Asset Ops, Mexico City", title: "prefiero", market: "MX", received: "2026-10-01", due: "2026-10-03", priority: "P1", status: "Done", suggested: { owner: "Bright Street (agency)", link: "Prefiero la Muerte, Mexico, Social cuts", why: "Fixed and re-approved Oct 2." } },
  { id: "REQ-2406", type: "Placement", subject: "The Greatest in the November sports carousel, UK", from: "Merchandising, EU", title: "greatest", market: "UK", received: "2026-09-30", due: "2026-10-28", priority: "P2", status: "Triaged", suggested: { owner: "Merch planning", link: "The Greatest, United Kingdom, Key art set", why: "Needs the 2:3 poster by Oct 28. Not started, not due." } },
  { id: "REQ-2405", type: "Brief", subject: "The Greatest launch brief, sports and documentary audiences", from: "Marketing lead, US", title: "greatest", received: "2026-09-29", due: "2026-10-14", priority: "P1", status: "In progress", suggested: { owner: "Marco D.", link: "The Greatest brief", why: "Draft due Oct 14. Coverage section can be generated from this week's press." } },
];

// Said this week: real public coverage, gathered 7 Oct 2026, with sources. Filled from research.
export type Signal = { phrase: string; note: string; where: string; date: string; source: string };
export type Signals = { week: string; headline: string; top: Signal[]; takeaways: string[] };
export const SIGNALS: Record<string, Signals> = {
  terminal: {
    week: "Sep 24 to Oct 7",
    headline: "Fans are self-organising a rewatch of season 1 and Dark Wolf before Oct 21. The four-year gap is the risk every outlet names.",
    top: [
      { phrase: "\u201cChris Pratt is done running\u201d", note: "Deadline's line on the Sep 17 trailer. The global, six-location scope is the differentiator the featurette set up.", where: "Deadline", date: "Sep 17", source: "https://deadline.com/2026/09/the-terminal-list-season-2-trailer-1237106251/" },
      { phrase: "\u201cWe are soo backkk. Gotta binge Season 1 and Dark Wolf again.\u201d", note: "Fan reaction to the Sep 23 featurette on X. The catch-up behaviour is already happening without a prompt.", where: "Yahoo Entertainment, from X", date: "Sep 24", source: "https://www.yahoo.com/entertainment/tv/articles/terminal-list-chris-pratt-shows-123000921.html" },
      { phrase: "The four-year gap", note: "Collider flags retention as the open question: will the 2022 audience come back?", where: "Collider", date: "Sep", source: "https://collider.com/chris-pratt-the-terminal-list-season-2-release-date-october-2026/" },
      { phrase: "\u201cBourne meets Reacher\u201d", note: "How MovieWeb sells it. Dark Wolf sits at 80% audience on RT with 250+ ratings; season 2 has no reviews yet.", where: "MovieWeb", date: "Sep", source: "https://movieweb.com/terminal-list-season-2-trailer-prime-video/" },
    ],
    takeaways: ["Run a \u201ccatch up before Oct 21\u201d push now; it matches what fans are already doing.", "Lead social with the six-location scope, not a single action beat.", "Hold review quotes until screeners land; there are none to use yet."],
  },
  love: {
    week: "Sep 17 to Oct 7",
    headline: "Critics disagree on the film and agree on Margaret Qualley. RT 75% from 20 reviews, Metacritic 60.",
    top: [
      { phrase: "\u201cPretty but surface-level, saved by Qualley\u2019s intelligence and emotional transparency\u201d", note: "Variety's review sets the frame most outlets follow.", where: "Variety", date: "Oct", source: "https://variety.com/2026/film/reviews/love-of-your-life-review-margaret-qualley-1236863581/" },
      { phrase: "\u201cEat, Grieve, Love\u201d", note: "Collider: Qualley is the reason to watch. The Portugal setting is the visual people remember.", where: "Collider", date: "Oct", source: "https://collider.com/love-of-your-life-review-margaret-qualley/" },
      { phrase: "Aaron Pierre\u2019s Lanterns heat", note: "ScreenRant hangs the RT score on Pierre's DC profile. A secondary hook for a younger audience.", where: "ScreenRant", date: "Oct", source: "https://screenrant.com/aaron-pierre-love-of-your-life-rotten-tomatoes-score/" },
      { phrase: "Fragmented structure", note: "The Playlist's complaint from the festival run: the time jumps keep characters at a distance.", where: "The Playlist", date: "Sep 17", source: "https://theplaylist.net/love-of-your-life-review-margaret-qualley-rachel-morrison-20260917/" },
    ],
    takeaways: ["Build the Oct 14 streaming push around Qualley and the Portugal visuals, not the plot.", "Use the 75% only with a critic quote beside it; the number alone invites the Metacritic 60.", "Gosling produces and does not appear; keep him out of the art."],
  },
  carrie: {
    week: "Sep 21 to Oct 7",
    headline: "Launched today at RT 85% (81 reviews) and Metacritic 74. The conversation is moving to the changed ending.",
    top: [
      { phrase: "Stephen King calls it \u201cbrilliant\u201d", note: "King on Threads: the social-media angle is \u201cshocking and true.\u201d The most quotable endorsement available.", where: "Deadline", date: "Sep", source: "https://deadline.com/2026/09/stephen-king-reaction-mike-flanagan-carrie-1237098524/" },
      { phrase: "Summer H. Howell is the breakout", note: "Gold Derby is already running awards-buzz pieces on the lead.", where: "Gold Derby", date: "Oct 5", source: "https://www.goldderby.com/tv/2026/carrie-reviews-summer-h-howell-awards-buzz-critics/" },
      { phrase: "Carrie survives", note: "Flanagan told Inverse the ending change was \u201ca gift to the character.\u201d Fan sites read it as a season 2 setup. Spoiler-sensitive.", where: "Inverse", date: "Oct 1", source: "https://www.inverse.com/entertainment/carrie-ending-explained-mike-flanagan-exclusive" },
      { phrase: "\u201cLess distinctive and far less scary than it should be\u201d", note: "The dissent, from THR's Fienberg; TV Insider calls the meme-account subplot overlong.", where: "TV Insider", date: "Oct", source: "https://www.tvinsider.com/1293931/carrie-prime-video-review-mike-flanagan/" },
      { phrase: "\u201cWorst RT score for any Flanagan show yet\u201d", note: "A headline trap: 85% is still certified fresh. Expect it to be quoted anyway.", where: "ComingSoon", date: "Oct 5", source: "https://www.comingsoon.net/tv/news/2200668-mike-flanagans-carrie-tv-show-reviews-best-stephen-king-adaptation-yet" },
    ],
    takeaways: ["Lead day-two social with Howell and the King quote.", "Prepare a spoiler-safe line on the ending before it dominates the thread.", "Do not engage the \u201cworst Flanagan score\u201d framing; the number speaks."],
  },
  rings: {
    week: "Sep 24 to Oct 7",
    headline: "Quiet two weeks. The staggered 4, 2, 2 episode drop is confusing explainers, and the full trailer is still owed.",
    top: [
      { phrase: "When do the episodes come out?", note: "The most recent coverage is a schedule explainer, which means the schedule is not landing on its own.", where: "DocumentaryTube", date: "Oct 1", source: "https://www.documentarytube.com/blog/when-do-the-rings-of-power-episodes-release-season-3-schedule/" },
      { phrase: "\u201cDarkest chapter yet\u201d", note: "Empire on the SDCC teaser: Simon Pegg voices the Balrog, Jamie Campbell Bower is Celeborn. Still the only footage.", where: "Empire", date: "Jul 24", source: "https://www.empireonline.com/tv/news/the-rings-of-power-season-3-trailer-teases-ring-forging-rising-darkness-and-exciting-new-characters/" },
      { phrase: "Not on the NYCC slate", note: "Prime Video's NYCC programme is Helluva Boss, Bloodaxe and Blade Runner 2099. No live moment for Rings this week.", where: "Amazon MGM Studios press", date: "Oct", source: "https://press.amazonmgmstudios.com/us/en/press-release/prime-video-announces-2026-new-york-comic-con-prog" },
    ],
    takeaways: ["Put the episode calendar on every market page and in the CRM.", "Pegg's Balrog and Celeborn are the proven hooks; use them in the social cuts.", "Full trailer date needs to be on the plan this week."],
  },
  madden: {
    week: "Sep 24 to Oct 7",
    headline: "The trailer is being roasted by NFL media. That is the most-shared moment, and ignoring it is the one bad option.",
    top: [
      { phrase: "\u201cChristian Bale please fire your agent\u201d", note: "NFL reporters on X after the Sep 24 trailer. Kyle Tucker: \u201cWithout overreacting, this looks like the worst movie ever made.\u201d", where: "Pro Football Network, from X", date: "Sep 24", source: "https://www.profootballnetwork.com/nfl-world-rips-madden-trailer-nicolas-cage/" },
      { phrase: "\u201cLooks like an SNL sketch\u201d", note: "Nerdist's read. The split is specifically Cage's voice, \u201ctoo much like himself.\u201d", where: "Nerdist", date: "Sep 24", source: "https://nerdist.com/article/madden-trailer-nicolas-cage-christian-bale-prime-video-movie/" },
      { phrase: "Bale's Al Davis gets the warmer read", note: "Reddit reactions respect the Davis rivalry even while mocking the rest.", where: "Pixeltwelve, from Reddit", date: "Sep 25", source: "https://pixeltwelve.com/articles/madden-trailer-nicolas-cage-reddit-reactions" },
      { phrase: "\u201cUnrecognizable transformations\u201d", note: "The entertainment-press angle (E!, People). It is the friendlier frame available.", where: "E! News", date: "Sep 24", source: "https://www.eonline.com/news/1426628/nicolas-cage-christian-bale-unrecognizable-in-madden-trailer" },
    ],
    takeaways: ["Decide this week: lean into camp, or counter-programme with Bale and the Davis rivalry.", "Theatrical Nov 11 and Prime Nov 18 need two lockups; brief the agency now.", "Keep the next cut out of NFL media until the tone decision is made."],
  },
  bladerunner: {
    week: "Sep 24 to Oct 7",
    headline: "NYCC panel this Saturday with Yeoh and Schafer. First new footage since July is likely, and the episode count is still being misreported.",
    top: [
      { phrase: "NYCC, Saturday Oct 10, 6:45pm, Empire Stage", note: "Plus a free 18+ immersive fan experience at Meatpacking Collective. This week's live moment.", where: "Den of Geek", date: "Oct 1", source: "https://www.denofgeek.com/tv/blade-runner-2099-brings-future-new-york-comic-con/" },
      { phrase: "Yeoh: \u201can amazing journey\u201d", note: "At Busan, praising Schafer ahead of NYCC.", where: "Variety", date: "Oct", source: "https://variety.com/2026/film/global/michelle-yeoh-blade-runner-2099-amazing-journey-busan-1236904050" },
      { phrase: "Eight episodes, not ten", note: "Older coverage still says ten hour-long episodes. Amazon says eight. Clear it up in the next release.", where: "Variety, SDCC teaser", date: "Jul 24", source: "https://variety.com/2026/tv/news/blade-runner-2099-trailer-michelle-yeoh-hunter-schafer-1236806977/" },
    ],
    takeaways: ["Have the social cuts ready to publish from the NYCC stage on Saturday.", "State \u201ceight episodes, all at once, Nov 25\u201d in every asset.", "Korean subtitles are the long pole for KR; keep REQ-2408 on schedule."],
  },
  masterplan: {
    week: "Sep 23 to Oct 7",
    headline: "Zero organic conversation nine days out. Coverage is announcement-driven and every write-up already gives away the twist.",
    top: [
      { phrase: "Trailer, Sep 23", note: "The Playlist, Dark Horizons and MovieWeb all ran it; none reported reactions.", where: "The Playlist", date: "Sep 23", source: "https://theplaylist.net/masterplan-trailer-stanley-tucci-trailer-20260923/" },
      { phrase: "White Lotus and Belmondo", note: "Outlets lean on Simona Tabasco's White Lotus credit and Victor Belmondo's surname as the hooks.", where: "About Amazon", date: "Sep", source: "https://www.aboutamazon.com/news/entertainment/masterplan-stanley-tucci-prime-video" },
    ],
    takeaways: ["Sell Tucci as the charming crook and the Louvre spectacle; stop leading with the family reveal.", "A Tucci interview beat is needed this week; there is nothing organic to amplify."],
  },
  greatest: {
    week: "Sep 24 to Oct 7",
    headline: "Four weeks out with no press beat since the summer teaser. The gap is the story.",
    top: [
      { phrase: "Last beat: the ESSENCE Fest teaser", note: "Deadline and Variety covered the July teaser and the Nov 4 date. Nothing since August.", where: "Deadline", date: "Jul 5", source: "https://deadline.com/2026/07/muhammad-ali-series-the-greatest-sets-prime-video-release-date-first-look-teaser-1236973883/" },
    ],
    takeaways: ["Full trailer plus the Lonnie Ali, estate-authorized angle is the obvious beat to schedule.", "Brief is due Oct 14; the coverage section is empty by fact, not by omission."],
  },
  prefiero: {
    week: "Sep 23 to Oct 7",
    headline: "Mexican press is on board. Ending-explained traffic says people are finishing the season.",
    top: [
      { phrase: "\u201cProducci\u00f3n muy buena\u201d", note: "La Opini\u00f3n: the black humour lands.", where: "La Opini\u00f3n", date: "Oct 1", source: "https://laopinion.com/2026/10/01/hablemos-de-prefiero-la-muerte-la-nueva-serie-mexicana-de-prime-video/" },
      { phrase: "Ending explained", note: "Omelete's final-explicado piece is already pulling traffic. Full-season completion is the signal.", where: "Omelete", date: "Oct 6", source: "https://www.omelete.com.mx/prime-video/prefiero-la-muerte-final-explicado-de-la-serie-mexicana-de-zombies-de-prime-video" },
      { phrase: "An allegory about choosing to keep living", note: "Milenio's reading. Sensitive; handle deliberately in LATAM messaging.", where: "Milenio", date: "Oct", source: "https://amp.milenio.com/espectaculos/prefiero-muerte-prime-video-rompe-reglas-genero-zombie" },
    ],
    takeaways: ["Amplify the Mexican reviews in ES and MX social.", "Route any messaging that touches the allegory through the regional lead first."],
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
// Brief contents are illustrative drafts written for the demo, not Amazon's briefs.
export const BRIEFS: Brief[] = [
  { title: "terminal", status: "Approved", owner: "Priya N.", due: "2026-09-25", objective: "Bring season 1 and Dark Wolf viewers back on day one in 12 markets; convert the Dark Wolf audience that has not seen season 1.", audience: "Men 25 to 54 who finished season 1 or Dark Wolf. Second: thriller readers who know the Jack Carr books.", message: "Reece is back. Nobody is safe.", tone: "Hard, quiet, precise. No quips in the key art.", mustHave: ["Pratt alone in the 2:3 poster for JP, BR, IN", "The first 6 seconds of every social cut are the cold open", "Dark Wolf catch-up link in CRM"], avoid: ["Ensemble key art", "Text on the hero", "Spoiling the episode 1 reveal in any cut"] },
  { title: "love", status: "Approved", owner: "Marco D.", due: "2026-09-20", objective: "Open global on Oct 14 with a date-night position; recruit the James L. Brooks audience that remembers Broadcast News.", audience: "Women 25 to 44 first; couples on weekend co-viewing; film-literate adults 45 plus.", message: "Some people you never get over.", tone: "Warm, witty, grown up.", mustHave: ["Gosling and Qualley together in every poster", "Festival quotes on the cover art once cleared", "Friday-evening CRM send"], avoid: ["Rom-com pastel palette", "Any cut that plays as a tearjerker only"] },
  { title: "rings", status: "In review", owner: "Priya N.", due: "2026-10-12", objective: "Season 3 as the biggest launch of the quarter: 240 territories, weekly drops, recruit lapsed season 1 viewers.", audience: "Fantasy viewers who dropped after season 1; Tolkien readers; the family co-viewing audience.", message: "The Ring is forged.", tone: "Epic, dark, earned. Sauron is the face of the season.", mustHave: ["Weekly episode calendar on every market page", "Text-free hero per locale", "Localized title treatment in all 16 demo markets"], avoid: ["Spoiling the forging in trailers", "More than three faces in any key art"] },
  { title: "greatest", status: "Draft", owner: "Marco D.", due: "2026-10-14", objective: "Launch across sports and prestige-drama audiences in 12 markets on Nov 4.", audience: "Sports documentary viewers; Black audiences in the US and UK; the awards audience.", message: "Before the legend, the fight.", tone: "Reverent, kinetic.", mustHave: ["Archive-feel stills in social", "Partner with Thursday Night Football placements"], avoid: ["Boxing-only framing"] },
  { title: "madden", status: "Not started", owner: "Hannah L.", due: "2026-10-28", objective: "", audience: "", message: "", tone: "", mustHave: [], avoid: [] },
  { title: "bladerunner", status: "Not started", owner: "Marco D.", due: "2026-11-04", objective: "", audience: "", message: "", tone: "", mustHave: [], avoid: [] },
];

const R = readiness("terminal");
export const UPDATE_SEED = {
  status: `The Terminal List season 2, launch status, Mon Oct 7. Launch Oct 21 in 12 markets, 14 days out.

Not ready. ${R.blockers.length} blockers, ${R.inReview} items in review, ${R.approved} of ${R.total} deliverables approved.

Blocking
1. Germany, dubbed trailer: late. Nordlicht Dub slipped the mix; verbal ETA Oct 9. I am getting it in writing today and the DE launch manager knows.
2. Japan, key art: rejected at upload, no 2:3 poster in the set. Halftone Studio has the files; fix due Oct 8. This one is on the spec, not the art.
3. Brazil, social cuts: Portuguese tagline runs past the safe area on the 9:16. Agency has the note; revised cut due Oct 16.

In review
India subtitles (Hindi, linguistic QC), Spain dub, France social cuts, Mexico and India CRM emails.

Nothing needed from this group this week. If Nordlicht misses Oct 9 I will ask for the English trailer with German subtitles as the DE fallback on Oct 10.`,
  chase: `Subject: Terminal List S2 German dub, written ETA needed today

Hi Nordlicht team,

Thanks for the call yesterday. Can you confirm in writing that the German dub of The Terminal List season 2 trailer will be delivered by end of day Oct 9 (CET)?

Our launch is Oct 21 and the trailer has to clear QC and trafficking before Oct 14. If Oct 9 is at risk, please say so today so we can prepare the subtitled fallback.

Delivery spec is unchanged: ProRes 422 HQ, stereo and 5.1 stems, 25 fps, filename per the VAM sheet.

Thank you,
Priya`,
};
