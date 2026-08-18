"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { loadFrameSequence, findNearestLoaded, type FrameSource, type DecodedFrame } from "../lib/frame-sequence/frameLoader";

const MAX_DPR = 2;
const RESIZE_HEIGHT_THRESHOLD = 150; // ignore iOS URL-bar-driven height changes during scroll

function getViewportHeight(): number {
  if (typeof window === "undefined") return 0;
  return window.visualViewport?.height ?? window.innerHeight;
}

export function useScrollFrameSequence(
  source: FrameSource,
  scrollPxPerFrame: number,
  smoothing: number,
  concurrency: number
) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const bitmapsRef = useRef<(DecodedFrame | null)[]>([]);
  const progressRef = useRef(0);
  const targetProgressRef = useRef(0);
  const lastDrawnFrame = useRef(-1);
  const isIntersecting = useRef(false);
  const isPageVisible = useRef(true);
  const lastTsRef = useRef<number | null>(null);
  const rafId = useRef<number | null>(null);
  const lastWidth = useRef(0);
  const lastHeight = useRef(0);

  const [loadProgress, setLoadProgress] = useState(0);
  const [isFirstFrameReady, setIsFirstFrameReady] = useState(false);

  // Don't let the browser restore a mid-page scroll position out from under us on load
  useEffect(() => {
    if (typeof window !== "undefined" && "scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    setIsFirstFrameReady(false);
    setLoadProgress(0);
    lastDrawnFrame.current = -1;

    const nav = navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } };
    const saveData = nav.connection?.saveData;
    const slowLink = nav.connection?.effectiveType === "2g" || nav.connection?.effectiveType === "slow-2g";
    const effectiveConcurrency = saveData || slowLink ? Math.min(2, concurrency) : concurrency;

    // Decode frames at actual canvas resolution, not source resolution — the single
    // biggest memory saving on low-end phones holding 75+ decoded bitmaps at once.
    const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
    const decodeSize = {
      width: Math.round(window.innerWidth * dpr),
      height: Math.round(getViewportHeight() * dpr),
    };

    const { bitmaps, promise } = loadFrameSequence(source, {
      concurrency: effectiveConcurrency,
      signal: controller.signal,
      decodeSize,
      onFrameLoaded: (index, loaded, total) => {
        if (index === 0) setIsFirstFrameReady(true);
        setLoadProgress((prev) => {
          const next = Math.round((loaded / total) * 20) / 20; // throttle to 5% steps
          return next > prev ? next : prev;
        });
      },
    });

    bitmapsRef.current = bitmaps;
    promise.catch(() => {});
    return () => controller.abort();
  }, [source, concurrency]);

  const draw = useCallback((frameIndex: number) => {
    const canvas = canvasRef.current;
    const bitmap = bitmapsRef.current[frameIndex];
    if (!canvas || !bitmap) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    const cw = canvas.width;
    const ch = canvas.height;
    const iw = "naturalWidth" in bitmap ? bitmap.naturalWidth || bitmap.width : bitmap.width;
    const ih = "naturalHeight" in bitmap ? bitmap.naturalHeight || bitmap.height : bitmap.height;
    if (!iw || !ih) return;

    const scale = Math.max(cw / iw, ch / ih); // cover, not contain
    const dw = iw * scale;
    const dh = ih * scale;
    ctx.clearRect(0, 0, cw, ch);
    ctx.drawImage(bitmap, (cw - dw) / 2, (ch - dh) / 2, dw, dh);
  }, []);

  useEffect(() => {
    const onVisibilityChange = () => {
      isPageVisible.current = document.visibilityState === "visible";
    };
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => document.removeEventListener("visibilitychange", onVisibilityChange);
  }, []);

  useEffect(() => {
    const tick = (ts: number) => {
      rafId.current = requestAnimationFrame(tick);
      if (!isIntersecting.current || !isPageVisible.current) {
        lastTsRef.current = ts;
        return;
      }

      const container = containerRef.current;
      const frameCount = bitmapsRef.current.length;
      if (!container || !frameCount) return;

      const dt = lastTsRef.current !== null ? ts - lastTsRef.current : 16.67;
      lastTsRef.current = ts;

      const rect = container.getBoundingClientRect();
      const scrollableDistance = rect.height - getViewportHeight();
      const raw = scrollableDistance > 0 ? -rect.top / scrollableDistance : 0;
      targetProgressRef.current = Math.min(1, Math.max(0, raw));

      // Delta-time-based lerp: identical feel at 30Hz, 60Hz, 120Hz, or after a throttled tab resumes
      const rate = 1 - Math.pow(1 - smoothing, dt / 16.67);
      progressRef.current += (targetProgressRef.current - progressRef.current) * rate;
      if (Math.abs(progressRef.current - targetProgressRef.current) < 0.0008) {
        progressRef.current = targetProgressRef.current;
      }

      const wanted = Math.round(progressRef.current * (frameCount - 1));
      const drawable = bitmapsRef.current[wanted] ? wanted : findNearestLoaded(bitmapsRef.current, wanted);
      if (drawable !== -1 && drawable !== lastDrawnFrame.current) {
        draw(drawable);
        lastDrawnFrame.current = drawable;
      }
    };

    rafId.current = requestAnimationFrame(tick);
    return () => {
      if (rafId.current !== null) cancelAnimationFrame(rafId.current);
    };
  }, [draw, smoothing]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    if (typeof IntersectionObserver === "undefined") {
      isIntersecting.current = true; // ancient-browser fallback
      return;
    }
    const observer = new IntersectionObserver(([entry]) => (isIntersecting.current = entry.isIntersecting), {
      rootMargin: "200px 0px 200px 0px",
    });
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let resizeRaf: number | null = null;

    const applySize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      const newWidth = window.innerWidth;
      const newHeight = getViewportHeight();

      // Skip reallocation for small height-only changes — this is what Safari's
      // URL bar animates through on every scroll, and resizing the canvas backing
      // store mid-gesture is what was causing the mobile stutter.
      const widthChanged = newWidth !== lastWidth.current;
      const heightChanged = Math.abs(newHeight - lastHeight.current) > RESIZE_HEIGHT_THRESHOLD;
      if (!widthChanged && !heightChanged) return;

      lastWidth.current = newWidth;
      lastHeight.current = newHeight;

      canvas.width = Math.round(newWidth * dpr);
      canvas.height = Math.round(newHeight * dpr);
      lastDrawnFrame.current = -1;

      const frameCount = bitmapsRef.current.length;
      if (frameCount) {
        const idx = Math.round(progressRef.current * (frameCount - 1));
        const drawable = bitmapsRef.current[idx] ? idx : findNearestLoaded(bitmapsRef.current, idx);
        if (drawable !== -1) draw(drawable);
      }
    };

    const onResize = () => {
      if (resizeRaf !== null) cancelAnimationFrame(resizeRaf);
      resizeRaf = requestAnimationFrame(applySize);
    };

    applySize();
    window.addEventListener("resize", onResize);
    // iOS Safari fires visualViewport resize on URL-bar show/hide, not always `window.resize`
    window.visualViewport?.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      window.visualViewport?.removeEventListener("resize", onResize);
      if (resizeRaf !== null) cancelAnimationFrame(resizeRaf);
    };
  }, [draw]);

  return { containerRef, canvasRef, loadProgress, isFirstFrameReady, scrollHeightPx: source.frameCount * scrollPxPerFrame };
}