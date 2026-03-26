"use client";

import { useEffect, useRef, useState } from "react";

const TOTAL_FRAMES = 139;
const BATCH_SIZE = 20;
const FRAME_WIDTH = 1280;
const FRAME_HEIGHT = 720;

function getFrameUrl(index) {
  const padded = String(index).padStart(4, "0");
  return `/frames/frame-${padded}.webp`;
}

export default function ScrollVideoBackground({ children }) {
  const canvasRef = useRef(null);
  const framesRef = useRef([]);
  const currentFrameRef = useRef(0);
  const rafRef = useRef(null);
  const [ready, setReady] = useState(false);

  // Load frames non-blocking in background
  useEffect(() => {
    // Respect reduced motion preference
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;

    const frames = [];

    const loadFrame = (index) =>
      new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
          frames[index] = img;
          resolve();
        };
        img.onerror = () => resolve(); // Skip failed frames silently
        img.src = getFrameUrl(index + 1);
      });

    const loadAllFrames = async () => {
      // Load frame 0 first for immediate canvas draw
      await loadFrame(0);
      framesRef.current = frames;
      setReady(true);

      // Load remaining frames in background batches
      for (let i = 1; i < TOTAL_FRAMES; i += BATCH_SIZE) {
        const batch = [];
        for (let j = i; j < Math.min(i + BATCH_SIZE, TOTAL_FRAMES); j++) {
          batch.push(loadFrame(j));
        }
        await Promise.all(batch);
        framesRef.current = frames;
      }
    };

    loadAllFrames();
  }, []);

  const drawFrame = (canvas, index) => {
    const frame = framesRef.current[index];
    if (!frame || !canvas) return;

    const ctx = canvas.getContext("2d");
    const canvasW = canvas.width;
    const canvasH = canvas.height;
    const imgRatio = FRAME_WIDTH / FRAME_HEIGHT;
    const canvasRatio = canvasW / canvasH;

    let drawW, drawH, drawX, drawY;
    if (canvasRatio > imgRatio) {
      drawW = canvasW;
      drawH = canvasW / imgRatio;
      drawX = 0;
      drawY = (canvasH - drawH) / 2;
    } else {
      drawH = canvasH;
      drawW = canvasH * imgRatio;
      drawX = (canvasW - drawW) / 2;
      drawY = 0;
    }

    ctx.drawImage(frame, drawX, drawY, drawW, drawH);
  };

  // Draw frames based on scroll position
  useEffect(() => {
    if (!ready) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    // Size canvas
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    drawFrame(canvas, 0);

    const onScroll = () => {
      if (rafRef.current) return;
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null;
        const scrollTop = window.scrollY;
        const docHeight =
          document.documentElement.scrollHeight - window.innerHeight;
        const fraction =
          docHeight > 0 ? Math.max(0, Math.min(1, scrollTop / docHeight)) : 0;
        const frameIndex = Math.min(
          Math.floor(fraction * TOTAL_FRAMES),
          TOTAL_FRAMES - 1
        );

        if (frameIndex !== currentFrameRef.current) {
          // Use the requested frame if loaded, otherwise find nearest loaded frame
          const frames = framesRef.current;
          let drawIndex = frameIndex;
          if (!frames[frameIndex]) {
            for (let d = 1; d < TOTAL_FRAMES; d++) {
              if (frames[frameIndex - d]) {
                drawIndex = frameIndex - d;
                break;
              }
              if (frames[frameIndex + d]) {
                drawIndex = frameIndex + d;
                break;
              }
            }
          }
          currentFrameRef.current = frameIndex;
          drawFrame(canvas, drawIndex);
        }
      });
    };

    const onResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      drawFrame(canvas, currentFrameRef.current);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, [ready]);

  return (
    <>
      {/* Static fallback image — visible immediately */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: -2,
        }}
      >
        <img
          src="/hero-aerial-gulf.png"
          alt=""
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      </div>

      {/* Scroll-driven canvas — draws over fallback once frames load */}
      <canvas
        ref={canvasRef}
        style={{
          position: "fixed",
          inset: 0,
          width: "100%",
          height: "100%",
          zIndex: -1,
          willChange: "transform",
        }}
      />

      {/* Page content renders immediately */}
      {children}
    </>
  );
}
