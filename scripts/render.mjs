// Continuous render benchmark / segment renderer.
// usage: CHROME_PATH=<chrome> REMOTION_TMP=<dir> GL_MODE=swangle node scripts/render.mjs <from> <to> <scale> <out.mp4> [concurrency]
import fs from "node:fs";
if (process.env.REMOTION_TMP) {
  fs.mkdirSync(process.env.REMOTION_TMP, { recursive: true });
  process.env.TEMP = process.env.TMP = process.env.TMPDIR = process.env.REMOTION_TMP;
}
import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition } from "@remotion/renderer";
import path from "node:path";
const [from, to, scale, out, conc = "1"] = process.argv.slice(2);
const browserExecutable = process.env.CHROME_PATH;
const chromiumOptions = { gl: process.env.GL_MODE || "swangle" };
const serveUrl = await bundle({
  entryPoint: path.resolve("src/index.tsx"),
  publicDir: path.resolve("public"),
});
const composition = await selectComposition({ serveUrl, id: process.env.COMP_ID || "BridgeShort", browserExecutable, chromiumOptions });
const t0 = Date.now();
await renderMedia({
  composition,
  serveUrl,
  codec: "h264",
  outputLocation: out,
  frameRange: [Number(from), Number(to)],
  scale: Number(scale),
  browserExecutable,
  chromiumOptions,
  concurrency: Number(conc),
  timeoutInMilliseconds: 240000,
  onProgress: ({ renderedFrames }) => {
    if (renderedFrames % 15 === 0) {
      const s = (Date.now() - t0) / 1000;
      console.log(`frames ${renderedFrames} elapsed ${s.toFixed(0)}s fps ${(renderedFrames / s).toFixed(2)}`);
    }
  },
});
const s = (Date.now() - t0) / 1000;
console.log(`DONE ${Number(to) - Number(from) + 1} frames in ${s.toFixed(0)}s = ${(Number(to) - Number(from) + 1) / s} fps`);
