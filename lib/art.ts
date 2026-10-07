import type { Format, Locale, QCCheck } from "./types";

export const PRIME_BLUE = "#2d75fa";
export const BADGE_TEXT = "Included with Plus";
const THUMB_W = 120; // smallest device render we check legibility against
const MIN_TITLE_PX = 9;
const MARGIN = 0.06;

export type RenderInput = {
  img: HTMLImageElement;
  format: Format;
  locale: Locale;
  titleOnHero: boolean;
  titleScale: number; // 0.7 | 1 | 1.3
  scale?: number; // output scale, 1 = full spec size
};

export type RenderOutput = { dataUrl: string; qc: QCCheck[] };

let fontsReady: Promise<void> | null = null;
export function ensureFonts() {
  if (!fontsReady) {
    fontsReady = Promise.all([
      document.fonts.load('400 40px "Instrument Serif"'),
      document.fonts.load('600 20px "Inter Tight"'),
      document.fonts.load('500 20px "Inter Tight"'),
    ]).then(() => undefined);
  }
  return fontsReady;
}

function coverCrop(ctx: CanvasRenderingContext2D, img: HTMLImageElement, w: number, h: number, focalX = 0.5, focalY = 0.45) {
  const ir = img.width / img.height;
  const cr = w / h;
  let sw = img.width;
  let sh = img.height;
  if (ir > cr) sw = img.height * cr;
  else sh = img.width / cr;
  const sx = (img.width - sw) * focalX;
  const sy = (img.height - sh) * focalY;
  ctx.drawImage(img, sx, sy, sw, sh, 0, 0, w, h);
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

export function renderVariant(input: RenderInput): RenderOutput {
  const { img, format, locale, titleOnHero, titleScale } = input;
  const scale = input.scale ?? 0.5;
  const w = Math.round(format.w * scale);
  const h = Math.round(format.h * scale);
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const ctx = c.getContext("2d")!;
  coverCrop(ctx, img, w, h);

  const drawText = format.textAllowed || titleOnHero;
  const qc: QCCheck[] = [];
  const margin = Math.round(w * MARGIN);

  // Sizing per format family
  const isPortrait = h > w;
  const isSquare = w === h;
  const titlePx = Math.round((isPortrait ? 0.19 : isSquare ? 0.14 : 0.095) * w * titleScale);
  const tagPx = Math.round((isPortrait ? 0.046 : isSquare ? 0.036 : 0.026) * w);
  const badgePx = Math.round(tagPx * 0.78);

  let titleBoxOK = true;
  let taglineOverflow = 0;

  if (drawText) {
    // Scrim
    const grad = ctx.createLinearGradient(0, h * 0.35, 0, h);
    grad.addColorStop(0, "rgba(10,14,24,0)");
    grad.addColorStop(1, "rgba(10,14,24,0.88)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Badge
    ctx.font = `600 ${badgePx}px "Inter Tight"`;
    const badgeTextW = ctx.measureText(BADGE_TEXT).width;
    const bh = Math.round(badgePx * 1.9);
    const bw = Math.round(badgeTextW + badgePx * 1.6);
    const by = h - margin - bh;
    ctx.fillStyle = PRIME_BLUE;
    roundRect(ctx, margin, by, bw, bh, 3);
    ctx.fill();
    ctx.fillStyle = "#ffffff";
    ctx.textBaseline = "middle";
    ctx.fillText(BADGE_TEXT, margin + badgePx * 0.8, by + bh / 2 + 1);

    // Tagline
    ctx.textBaseline = "alphabetic";
    ctx.font = `400 ${tagPx}px "Inter Tight"`;
    ctx.fillStyle = "rgba(238,241,247,0.92)";
    const tagY = by - Math.round(tagPx * 0.9);
    const tagW = ctx.measureText(locale.tagline).width;
    const safeW = w - 2 * margin;
    taglineOverflow = Math.max(0, tagW - safeW);
    ctx.fillText(locale.tagline, margin, tagY);

    // Title
    ctx.font = `400 ${titlePx}px "Instrument Serif"`;
    ctx.fillStyle = "#ffffff";
    const titleY = tagY - Math.round(tagPx * 1.1);
    const titleW = ctx.measureText(locale.title).width;
    ctx.fillText(locale.title, margin, titleY);
    titleBoxOK = titleW <= safeW && titleY - titlePx >= margin;
  }

  // QC
  if (!format.textAllowed) {
    qc.push({
      id: "hero-text-free",
      label: "Hero is text-free",
      status: drawText ? "fail" : "pass",
      detail: drawText ? "Title and tagline are burned in. Hero art must carry no text." : "No text burned in. The app draws the title.",
    });
  }
  if (drawText) {
    const thumbTitlePx = (titlePx / w) * THUMB_W;
    qc.push({
      id: "title-legible",
      label: `Title legible at ${THUMB_W}px`,
      status: thumbTitlePx >= MIN_TITLE_PX ? "pass" : "fail",
      detail: `${thumbTitlePx.toFixed(1)}px tall on the smallest carousel. Minimum ${MIN_TITLE_PX}px.`,
    });
    qc.push({
      id: "tagline-fits",
      label: "Tagline inside safe area",
      status: taglineOverflow > 0 ? "fail" : "pass",
      detail:
        taglineOverflow > 0
          ? `Runs ${Math.round((taglineOverflow / w) * 100)}% past the safe area in ${locale.code}.`
          : "Fits within the 6% margins.",
    });
    qc.push({
      id: "title-safe",
      label: "Title inside safe area",
      status: titleBoxOK ? "pass" : "fail",
      detail: titleBoxOK ? "Clear of the edges." : "Title crosses the 6% margin.",
    });
    qc.push({
      id: "badge-colour",
      label: "Service badge colour",
      status: "pass",
      detail: `Badge is ${PRIME_BLUE.toUpperCase()}, the approved blue.`,
    });
  }
  qc.push({
    id: "aspect",
    label: `Aspect ${format.label.split(" ")[1]}`,
    status: "pass",
    detail: `${format.w} by ${format.h} at delivery size.`,
  });

  return { dataUrl: c.toDataURL("image/jpeg", 0.9), qc };
}

export function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}
