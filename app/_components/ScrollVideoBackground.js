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
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  // Preload all frames in batches
  useEffect(() => {
    const frames = [];

    const loadFrame = (index) =>
      new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
          frames[index] = img;
          resolve();
        };
        img.onerror = reject;
        img.src = getFrameUrl(index + 1);
      });

    const loadAllFrames = async () => {
      for (let i = 0; i < TOTAL_FRAMES; i += BATCH_SIZE) {
        const batch = [];
        for (let j = i; j < Math.min(i + BATCH_SIZE, TOTAL_FRAMES); j++) {
          batch.push(loadFrame(j));
        }
        await Promise.all(batch);
        setProgress(Math.min(i + BATCH_SIZE, TOTAL_FRAMES) / TOTAL_FRAMES);
      }
      framesRef.current = frames;
      setLoading(false);
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

  // Draw frames based on total page scroll progress
  useEffect(() => {
    if (loading) return;

    const canvas = canvasRef.current;
    drawFrame(canvas, 0);

    const onScroll = () => {
      if (rafRef.current) return;
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null;
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const fraction = docHeight > 0 ? Math.max(0, Math.min(1, scrollTop / docHeight)) : 0;
        const frameIndex = Math.min(
          Math.floor(fraction * TOTAL_FRAMES),
          TOTAL_FRAMES - 1
        );

        if (frameIndex !== currentFrameRef.current) {
          currentFrameRef.current = frameIndex;
          drawFrame(canvas, frameIndex);
        }
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [loading]);

  // Resize canvas to match viewport
  useEffect(() => {
    if (loading) return;

    const canvas = canvasRef.current;
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      drawFrame(canvas, currentFrameRef.current);
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    return () => window.removeEventListener("resize", resizeCanvas);
  }, [loading]);

  return (
    <>
      {/* Loading overlay */}
      {loading && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 50,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background: "#1a1a1a",
          }}
        >
          <div
            style={{
              width: "200px",
              height: "2px",
              background: "#333",
              borderRadius: "1px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                background: "#fff",
                width: `${Math.round(progress * 100)}%`,
                transition: "width 0.3s ease",
              }}
            />
          </div>
          <p style={{ color: "#666", fontSize: "12px", marginTop: "12px", letterSpacing: "0.1em" }}>
            {Math.round(progress * 100)}%
          </p>
        </div>
      )}

      {/* Fixed background canvas */}
      <canvas
        ref={canvasRef}
        style={{
          position: "fixed",
          inset: 0,
          width: "100%",
          height: "100%",
          zIndex: -1,
        }}
      />

      {/* Page content flows normally on top */}
      {children}
    </>
  );
}
