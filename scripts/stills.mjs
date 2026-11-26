// Linux-adapted stills renderer (from templates/scripts/bridge-stills.mjs).
// usage: CHROME_PATH=<chrome> REMOTION_TMP=<dir> node scripts/stills.mjs <outPrefix> <frame,frame,...> [scale]
import fs from "node:fs";
if (process.env.REMOTION_TMP) {
  fs.mkdirSync(process.env.REMOTION_TMP, { recursive: true });
  process.env.TEMP = process.env.TMP = process.env.TMPDIR = process.env.REMOTION_TMP;
}
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";
import path from "node:path";
const [prefix, frames, scale = "0.5"] = process.argv.slice(2);
const browserExecutable = process.env.CHROME_PATH;
const chromiumOptions = { gl: process.env.GL_MODE || "angle" };
const serveUrl = await bundle({
  entryPoint: path.resolve(process.env.BRIDGE_ENTRY || "src/index.tsx"),
  publicDir: path.resolve("public"),
});
const composition = await selectComposition({ serveUrl, id: "BridgeShort", browserExecutable, chromiumOptions });
const onBrowserLog = (l) => {
  if (l.type === "error" || l.type === "warning") console.log(`[${l.type}]`, l.text.slice(0, 300));
};
for (const f of frames.split(",").map(Number)) {
  const t0 = Date.now();
  await renderStill({
    composition,
    serveUrl,
    frame: f,
    output: `${prefix}${f}.jpg`,
    imageFormat: "jpeg",
    jpegQuality: 88,
    scale: Number(scale),
    browserExecutable,
    chromiumOptions,
    timeoutInMilliseconds: 240000,
    onBrowserLog,
  });
  console.log("still", f, ((Date.now() - t0) / 1000).toFixed(1) + "s");
}
