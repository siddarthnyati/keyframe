export const THEMES = [
  "action",
  "adventure",
  "romance",
  "drama",
  "fantasy",
  "comedy",
  "thriller",
  "strong female lead",
  "creature",
  "ensemble",
  "talent close-up",
] as const;
export type Theme = (typeof THEMES)[number];

export type Shot = "wide" | "medium" | "close";

export type FrameTags = {
  faces: number;
  mood: string;
  themes: Theme[];
  text: boolean;
  shot: Shot;
  appeal: number; // 0..1
  why: string;
};

export type Frame = {
  id: string;
  t: number;
  dataUrl: string;
  w: number;
  h: number;
  sharp: number; // 0..1 normalised
  bright: number; // 0..1
  letterbox: number; // 0..1 fraction of dark rows
  hash: string;
  dupOf?: string;
  tags?: FrameTags;
  score: number; // 0..100
};

export type Locale = {
  code: string;
  label: string;
  title: string;
  tagline: string;
};

export type FormatId = "poster" | "cover" | "hero" | "social";

export type Format = {
  id: FormatId;
  label: string;
  w: number;
  h: number;
  textAllowed: boolean;
  note: string;
};

export const FORMATS: Format[] = [
  { id: "poster", label: "Poster 2:3", w: 800, h: 1200, textAllowed: true, note: "Mobile discovery. Mandatory." },
  { id: "cover", label: "Cover 16:9", w: 1280, h: 720, textAllowed: true, note: "Title treatment required." },
  { id: "hero", label: "Hero 16:9", w: 1280, h: 720, textAllowed: false, note: "Text-free. Title drawn by the app." },
  { id: "social", label: "Social 1:1", w: 1080, h: 1080, textAllowed: true, note: "Paid and organic feeds." },
];

export const DEFAULT_LOCALES: Locale[] = [
  { code: "en-US", label: "English", title: "Sintel", tagline: "She crossed the world for a dragon." },
  { code: "es-419", label: "Spanish (LatAm)", title: "Sintel", tagline: "Cruzó el mundo por un dragón." },
  { code: "de-DE", label: "German", title: "Sintel", tagline: "Sie durchquerte die ganze Welt für einen Drachen." },
  { code: "ja-JP", label: "Japanese", title: "シンテル", tagline: "彼女は竜のために世界を旅した。" },
];

export type QCStatus = "pass" | "fail";
export type QCCheck = { id: string; label: string; status: QCStatus; detail: string };

export type Variant = {
  key: string; // `${locale}:${format}`
  locale: string;
  format: FormatId;
  frameId: string;
  dataUrl: string;
  qc: QCCheck[];
};
