export type DecodedFrame = ImageBitmap | HTMLImageElement;

export interface FrameSource {
  frameCount: number;
  getUrl: (frameIndex: number) => string;
}

interface DecodeSize {
  width: number;
  height: number;
}

interface LoadOptions {
  concurrency: number;
  signal: AbortSignal;
  decodeSize: DecodeSize;
  onFrameLoaded: (index: number, loadedCount: number, total: number) => void;
}

// Fetch priority hints aren't in every TS lib.dom version yet — extend locally
// instead of casting the whole init object to RequestInit.
interface FetchInit extends RequestInit {
  priority?: "high" | "low" | "auto";
}

const supportsBitmap = typeof createImageBitmap === "function";

/**
 * Builds a FrameSource from the real frame numbers on disk (see
 * scripts/generate-frame-manifest.mjs) instead of assuming every number
 * in a range exists. `frameCount` becomes the manifest length, and index i
 * maps to the i-th actual frame — so scroll progress 0..1 always lands on
 * a frame that's really there, no matter how sparse or uneven the gaps are.
 */
export function createFrameSource(
  basePath: string,
  frameNumbers: number[],
  padLength = 3
): FrameSource {
  return {
    frameCount: frameNumbers.length,
    getUrl: (index) => `${basePath}/frame_${String(frameNumbers[index]).padStart(padLength, "0")}.webp`,
  };
}

async function fetchFrame(url: string, signal: AbortSignal, isPriority: boolean): Promise<Blob> {
  const init: FetchInit = {
    signal,
    cache: "force-cache",
    priority: isPriority ? "high" : "low",
  };
  const res = await fetch(url, init);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.blob();
}

async function decodeFrame(blob: Blob, size: DecodeSize): Promise<DecodedFrame> {
  if (supportsBitmap) {
    return createImageBitmap(blob, {
      resizeWidth: size.width,
      resizeHeight: size.height,
      resizeQuality: "medium",
    });
  }
  const img = new Image();
  img.decoding = "async";
  const objectUrl = URL.createObjectURL(blob);
  img.src = objectUrl;
  await img.decode().catch(() => {});
  URL.revokeObjectURL(objectUrl);
  return img;
}

export function loadFrameSequence(
  source: FrameSource,
  opts: LoadOptions
): { bitmaps: (DecodedFrame | null)[]; promise: Promise<void> } {
  const { frameCount, getUrl } = source;
  const { concurrency, signal, decodeSize, onFrameLoaded } = opts;
  const bitmaps: (DecodedFrame | null)[] = new Array(frameCount).fill(null);
  let loadedCount = 0;

  const loadOne = async (index: number): Promise<void> => {
    if (signal.aborted) return;
    const url = getUrl(index);
    try {
      let blob: Blob;
      try {
        blob = await fetchFrame(url, signal, index === 0);
      } catch {
        if (signal.aborted) return;
        blob = await fetchFrame(url, signal, index === 0); // one retry — mobile networks drop requests
      }
      if (signal.aborted) return;
      bitmaps[index] = await decodeFrame(blob, decodeSize);
    } catch {
      // left null — draw loop falls back to the nearest loaded neighbor
    } finally {
      loadedCount++;
      onFrameLoaded(index, loadedCount, frameCount);
    }
  };

  const promise = (async () => {
    if (frameCount === 0) return;
    await loadOne(0); // blocks so the canvas can paint instantly, fetched at high priority

    let cursor = 1;
    const workerCount = Math.min(concurrency, Math.max(frameCount - 1, 0));
    await Promise.all(
      Array.from({ length: workerCount }, async () => {
        while (cursor < frameCount && !signal.aborted) {
          await loadOne(cursor++);
        }
      })
    );
  })();

  return { bitmaps, promise };
}

/** Nearest loaded frame to `target`, expanding outward. -1 if none loaded yet. */
export function findNearestLoaded(bitmaps: (DecodedFrame | null)[], target: number): number {
  if (bitmaps[target]) return target;
  for (let r = 1; r < bitmaps.length; r++) {
    const lo = target - r;
    const hi = target + r;
    if (lo >= 0 && bitmaps[lo]) return lo;
    if (hi < bitmaps.length && bitmaps[hi]) return hi;
  }
  return -1;
}