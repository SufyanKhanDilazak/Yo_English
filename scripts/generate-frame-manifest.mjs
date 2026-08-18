// scripts/generate-frame-manifest.mjs
//
// Scans public/frames-desktop and public/frames-mobile for frame_NNN.webp
// files and writes the actual sorted frame numbers to a JSON manifest.
// This means the app never has to assume the sequence is contiguous —
// if a frame is missing, it's simply not in the manifest, so it's never
// requested. Re-run this any time you add, remove, or renumber frames.
//
// Usage: node scripts/generate-frame-manifest.mjs
// Recommended: wire into package.json as "predev" and "prebuild" so it's
// always fresh without needing to remember to run it by hand.

import { readdirSync, writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = join(__dirname, "..", "public");
const outDir = join(__dirname, "..", "lib", "frame-sequence");
const outFile = join(outDir, "frame-manifest.json");

const FRAME_RE = /^frame_(\d+)\.webp$/i;

function scan(folderName) {
  const dir = join(publicDir, folderName);
  let entries;
  try {
    entries = readdirSync(dir);
  } catch {
    console.warn(`[frame-manifest] "${folderName}" not found in /public, skipping.`);
    return [];
  }

  const numbers = entries
    .map((name) => name.match(FRAME_RE))
    .filter((m) => m !== null)
    .map((m) => Number(m[1]))
    .sort((a, b) => a - b);

  if (numbers.length === 0) {
    console.warn(`[frame-manifest] No frame_NNN.webp files found in "${folderName}".`);
  }

  return numbers;
}

const manifest = {
  desktop: scan("frames-desktop"),
  mobile: scan("frames-mobile"),
};

mkdirSync(outDir, { recursive: true });
writeFileSync(outFile, JSON.stringify(manifest, null, 2) + "\n");

console.log(
  `[frame-manifest] desktop: ${manifest.desktop.length} frames, mobile: ${manifest.mobile.length} frames -> ${outFile}`
);
