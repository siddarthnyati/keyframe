import type { Frame } from "./types";

const SMALL_W = 96;
const SMALL_H = 54;

function gray(data: Uint8ClampedArray, i: number) {
  return 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
}

/** Laplacian variance over a small grayscale copy. Higher is sharper. */
function sharpness(g: Float32Array, w: number, h: number) {
  let sum = 0;
  let sumSq = 0;
  let n = 0;
  for (let y = 1; y < h - 1; y++) {
    for (let x = 1; x < w - 1; x++) {
      const i = y * w + x;
      const lap = -4 * g[i] + g[i - 1] + g[i + 1] + g[i - w] + g[i + w];
      sum += lap;
      sumSq += lap * lap;
      n++;
    }
  }
  const mean = sum / n;
  return sumSq / n - mean * mean;
}

function letterbox(g: Float32Array, w: number, h: number) {
  let dark = 0;
  for (let y = 0; y < h; y++) {
    let rowSum = 0;
    for (let x = 0; x < w; x++) rowSum += g[y * w + x];
    if (rowSum / w < 12) dark++;
  }
  return dark / h;
}

/** 8x8 average hash as a 64-char bit string. */
function aHash(g: Float32Array, w: number, h: number) {
  const bits: number[] = [];
  const cellW = w / 8;
  const cellH = h / 8;
  const cells: number[] = [];
  for (let cy = 0; cy < 8; cy++) {
    for (let cx = 0; cx < 8; cx++) {
      let s = 0;
      let n = 0;
      for (let y = Math.floor(cy * cellH); y < Math.floor((cy + 1) * cellH); y++) {
        for (let x = Math.floor(cx * cellW); x < Math.floor((cx + 1) * cellW); x++) {
          s += g[y * w + x];
          n++;
        }
      }
      cells.push(s / n);
    }
  }
  const mean = cells.reduce((a, b) => a + b, 0) / cells.length;
  for (const c of cells) bits.push(c > mean ? 1 : 0);
  return bits.join("");
}

export function hamming(a: string, b: string) {
  let d = 0;
  for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) d++;
  return d;
}

function seekTo(video: HTMLVideoElement, t: number) {
  return new Promise<void>((resolve) => {
    const onSeeked = () => {
      video.removeEventListener("seeked", onSeeked);
      resolve();
    };
    video.addEventListener("seeked", onSeeked);
    video.currentTime = t;
  });
}

export type SampleOptions = {
  everySeconds?: number;
  outWidth?: number;
  onFrame?: (f: Frame, index: number, total: number) => void;
};

/** Sample frames from a loaded video element. Resolves with raw (unranked) frames. */
export async function sampleFrames(video: HTMLVideoElement, opts: SampleOptions = {}): Promise<Frame[]> {
  const every = opts.everySeconds ?? 1.5;
  const outW = opts.outWidth ?? 640;
  const duration = video.duration;
  const times: number[] = [];
  for (let t = 0.4; t < duration - 0.2; t += every) times.push(t);

  const vw = video.videoWidth;
  const vh = video.videoHeight;
  const outH = Math.round((outW * vh) / vw);

  const big = document.createElement("canvas");
  big.width = outW;
  big.height = outH;
  const bctx = big.getContext("2d", { willReadFrequently: true })!;

  const small = document.createElement("canvas");
  small.width = SMALL_W;
  small.height = SMALL_H;
  const sctx = small.getContext("2d", { willReadFrequently: true })!;

  const frames: Frame[] = [];
  for (let i = 0; i < times.length; i++) {
    const t = times[i];
    await seekTo(video, t);
    bctx.drawImage(video, 0, 0, outW, outH);
    sctx.drawImage(video, 0, 0, SMALL_W, SMALL_H);
    const img = sctx.getImageData(0, 0, SMALL_W, SMALL_H).data;
    const g = new Float32Array(SMALL_W * SMALL_H);
    let bsum = 0;
    for (let p = 0; p < SMALL_W * SMALL_H; p++) {
      g[p] = gray(img, p * 4);
      bsum += g[p];
    }
    const f: Frame = {
      id: `f${String(i).padStart(2, "0")}`,
      t,
      dataUrl: big.toDataURL("image/jpeg", 0.82),
      w: outW,
      h: outH,
      sharp: sharpness(g, SMALL_W, SMALL_H),
      bright: bsum / (SMALL_W * SMALL_H) / 255,
      letterbox: letterbox(g, SMALL_W, SMALL_H),
      hash: aHash(g, SMALL_W, SMALL_H),
      score: 0,
    };
    frames.push(f);
    opts.onFrame?.(f, i, times.length);
  }
  return normalise(frames);
}

/** Normalise sharpness to 0..1, fold near-duplicates, compute a local score. */
export function normalise(frames: Frame[]): Frame[] {
  const maxSharp = Math.max(...frames.map((f) => f.sharp), 1);
  const out = frames.map((f) => ({ ...f, sharp: Math.sqrt(f.sharp / maxSharp) }));
  for (let i = 0; i < out.length; i++) {
    for (let j = 0; j < i; j++) {
      if (!out[j].dupOf && hamming(out[i].hash, out[j].hash) <= 5) {
        out[i].dupOf = out[j].id;
        break;
      }
    }
  }
  for (const f of out) f.score = localScore(f);
  return out;
}

export function localScore(f: Frame) {
  // Prefer sharp frames, mid-range exposure, no letterbox, no near-black fades.
  const exposure = 1 - Math.min(1, Math.abs(f.bright - 0.42) / 0.42);
  const base = 0.55 * f.sharp + 0.35 * exposure + 0.1 * (1 - f.letterbox);
  const fadePenalty = f.bright < 0.06 ? 0.6 : 0;
  return Math.round(Math.max(0, base - fadePenalty) * 100);
}

/** Blend local score with model appeal once tags arrive. */
export function finalScore(f: Frame) {
  if (!f.tags) return f.score;
  const ai = f.tags.appeal * 100;
  const faceBonus = f.tags.faces >= 1 && f.tags.faces <= 3 ? 6 : 0;
  const textPenalty = f.tags.text ? 10 : 0;
  return Math.round(Math.min(100, 0.45 * f.score + 0.55 * ai + faceBonus - textPenalty));
}

export function fmtTime(t: number) {
  const m = Math.floor(t / 60);
  const s = Math.floor(t % 60);
  const d = Math.floor((t % 1) * 10);
  return `${m}:${String(s).padStart(2, "0")}.${d}`;
}
