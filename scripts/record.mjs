// Records a walkthrough of the running app (npm run dev on port 3111) with Playwright,
// then burns step captions in with ffmpeg. Output: docs/walkthrough.mp4
//
//   node scripts/record.mjs
//
import { chromium } from "playwright";
import { execFileSync } from "node:child_process";
import { mkdirSync, readdirSync, renameSync, rmSync, existsSync } from "node:fs";
import path from "node:path";
import ffmpeg from "ffmpeg-static";

const URL = process.env.URL ?? "http://localhost:3111/";
const W = 1440;
const H = 900;
const out = path.resolve("docs");
const tmp = path.resolve(".video");
rmSync(tmp, { recursive: true, force: true });
mkdirSync(tmp, { recursive: true });
mkdirSync(out, { recursive: true });

const marks = [];
let t0 = 0;
const mark = (text) => marks.push({ t: (Date.now() - t0) / 1000, text });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: { width: W, height: H },
  deviceScaleFactor: 1,
  recordVideo: { dir: tmp, size: { width: W, height: H } },
  colorScheme: "dark",
});
const page = await ctx.newPage();
t0 = Date.now();
await page.goto(URL, { waitUntil: "networkidle" });
mark("One approved trailer in. A launch art set out.");
await sleep(3500);
mark("The browser scans the trailer: a frame every 1.5 seconds, scored for focus and exposure, duplicates folded.");
await page.getByText(/Tagging .* frames/).waitFor({ timeout: 120_000 });
mark("The top 24 go to the model for a designer\u2019s read: faces, mood, theme tags, burned-in text.");

// Wait for tagging
await page.getByText(/near-duplicates folded/).waitFor({ timeout: 120_000 });
await sleep(400);
mark("Every frame scored for focus, exposure and the model's read. The timeline shows where the strong frames live.");

// Skim the timeline
const lane = page.locator("div.cursor-crosshair").first();
const box = await lane.boundingBox();
for (let i = 0; i <= 20; i++) {
  await page.mouse.move(box.x + 20 + ((box.width - 40) * i) / 20, box.y + 60);
  await sleep(90);
}
await sleep(600);

// Pick three frames via the inspector
const tiles = page.locator('img[alt^="Frame at"]');
const pick = async (idx, caption) => {
  await tiles.nth(idx).click();
  await sleep(700);
  if (caption) mark(caption);
  await page.getByRole("button", { name: "Add to shortlist" }).click();
  await sleep(700);
};
await pick(0, "Star three. The tool proposes, the producer decides.");
await pick(1);
await pick(2);
await sleep(600);

// Variants
mark("Sixteen renders: poster, cover, text-free hero and social, per language-locale.");
await page.getByRole("button", { name: /Render variants/ }).click();
await page.locator('button.bg-player img').first().waitFor({ state: "visible", timeout: 60_000 });
await sleep(2600);
// Show a rule failing
mark("Flip the title onto the hero and the spec check fails before anything is uploaded.");
await page.getByRole("switch").first().click();
await sleep(3000);
await page.getByRole("switch").first().click();
await sleep(1200);
// Approve + export sheet
mark("Approve, then export full delivery sizes with a manifest that carries theme tags and check results.");
await page.getByRole("button", { name: "Approve" }).click();
await sleep(700);
await page.getByRole("button", { name: "Export" }).click();
await sleep(2600);
await page.mouse.click(400, 500);
await sleep(500);

// Audiences
mark("Three cohorts, including a new member from a telecom partner with only coarse, consented signals.");
await page.getByRole("button", { name: /See who sees what/ }).click();
const mix = page.getByText("How the mix settles");
await sleep(800);
if (!(await mix.isVisible().catch(() => false))) await page.getByRole("button", { name: /Audiences/ }).click();
await mix.waitFor({ state: "visible", timeout: 20_000 });
await sleep(2200);
mark("The mix settles per cohort. A slice keeps exploring, and a cap stops one face filling the row.");
await sleep(2800);
mark("The loop closes with the two numbers a producer never gets today: who clicked, and who kept watching.");
await sleep(2600);
mark("No generative art. No auto-approval. No paid-media optimisation. Keyframe.");
await sleep(2400);

await ctx.close();
await browser.close();

const webm = readdirSync(tmp).find((f) => f.endsWith(".webm"));
const raw = path.join(tmp, webm);
const rawOut = path.join(out, "walkthrough-raw.webm");
renameSync(raw, rawOut);

// Burn captions. Each caption shows until the next one.
const font = ["/System/Library/Fonts/Supplemental/Arial.ttf", "/System/Library/Fonts/Helvetica.ttc", "/Library/Fonts/Arial.ttf"].find((f) => existsSync(f));
const esc = (s) => s.replace(/\\/g, "\\\\").replace(/'/g, "\u2019").replace(/:/g, "\\:").replace(/%/g, "\\%");
const filters = marks.map((m, i) => {
  const end = marks[i + 1]?.t ?? 9999;
  return `drawtext=fontfile='${font}':text='${esc(m.text)}':fontsize=26:fontcolor=white:box=1:boxcolor=black@0.62:boxborderw=14:x=(w-text_w)/2:y=h-96:enable='between(t,${m.t.toFixed(2)},${end.toFixed(2)})'`;
});
const vf = filters.join(",");
const mp4 = path.join(out, "walkthrough.mp4");
// Drop the static wait while the model tags frames.
const tagStart = marks.find((m) => m.text.startsWith("The top 24"))?.t ?? 0;
const tagEnd = marks.find((m) => m.text.startsWith("Every frame scored"))?.t ?? 0;
const cut = tagEnd - tagStart > 4 ? `,select='not(between(t,${(tagStart + 2.5).toFixed(2)},${(tagEnd - 0.5).toFixed(2)}))',setpts=N/FRAME_RATE/TB` : "";
execFileSync(ffmpeg, ["-y", "-i", rawOut, "-vf", vf + cut, "-an", "-c:v", "libx264", "-pix_fmt", "yuv420p", "-crf", "20", "-movflags", "+faststart", mp4], { stdio: "inherit" });
rmSync(tmp, { recursive: true, force: true });
console.log("Captions:", marks);
console.log("Wrote", mp4);
