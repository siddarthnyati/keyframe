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

// Wait for sampling + tagging
await page.getByText(/near-duplicates folded/).waitFor({ timeout: 120_000 });
await sleep(800);
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
await page.getByRole("button", { name: /Render variants/ }).click();
await page.locator("img[src^='data:']").first().waitFor();
await sleep(1800);
mark("Sixteen renders: poster, cover, text-free hero and social, per language-locale.");
await sleep(1200);
// Show a rule failing
await page.getByRole("switch").first().click();
await sleep(1600);
mark("Flip the title onto the hero and the spec check fails before anything is uploaded.");
await sleep(1600);
await page.getByRole("switch").first().click();
await sleep(1200);
// Approve + export sheet
await page.getByRole("button", { name: "Approve" }).click();
await sleep(500);
await page.getByRole("button", { name: "Export" }).click();
await sleep(900);
mark("Approve, then export full delivery sizes with a manifest that carries theme tags and check results.");
await sleep(2200);
await page.keyboard.press("Escape");
await page.mouse.click(400, 500);
await sleep(600);

// Audiences
await page.getByRole("button", { name: /See who sees what/ }).click();
await sleep(1200);
mark("Three cohorts, including a new member from a telecom partner with only coarse, consented signals.");
await sleep(2600);
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
execFileSync(ffmpeg, ["-y", "-i", rawOut, "-vf", vf, "-c:v", "libx264", "-pix_fmt", "yuv420p", "-crf", "20", "-movflags", "+faststart", mp4], { stdio: "inherit" });
rmSync(tmp, { recursive: true, force: true });
console.log("Captions:", marks);
console.log("Wrote", mp4);
