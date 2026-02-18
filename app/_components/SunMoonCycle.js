"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Sky, Stars } from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  SUN_INTENSITY_DEFAULT,
  SUN_INTENSITY_EVENT,
  SUN_INTENSITY_MAX,
  SUN_INTENSITY_MIN,
  SUN_INTENSITY_STORAGE_KEY,
  sanitizeSunIntensity,
} from "./sunControls";

/* ───────────────────────────────────────────
   Constants
   ─────────────────────────────────────────── */

const SKY_RADIUS = 450000;
const SCROLL_CYCLE_REPEAT = 3;

const EXPOSURE_DAY = 0.76;
const EXPOSURE_NIGHT = 0.62;

// Orb sizes (in world units at z = -120)
const ORB_SIZE_SUN = 12.2;
const ORB_SIZE_SUN_GLOW = 30;
const ORB_SIZE_SUN_CORONA = 42;
const ORB_SIZE_MOON = 9.2;
const ORB_SIZE_MOON_GLOW = 18.5;

// Background image measurements
// The image is 1920×1080. The top ~60% is transparent.
// The island peaks begin at ~62% from the top of the image.
const BG_IMAGE_W = 1920;
const BG_IMAGE_H = 1080;
const BG_HORIZON_RATIO = 0.72; // Sea level at 72% from top of image

// Arc shape
// The sun/moon arc is a parabola from left→right.
// These are in NDC (−1 = bottom, +1 = top).
const ARC_X_EXTENT = 0.92; // How far left/right the arc reaches
const ARC_PEAK_OFFSET = 0.55; // How far ABOVE the horizon the sun peaks (in NDC units)

// Horizon fade — how the sun's brightness ramps as it crosses the horizon
// The glow begins BEFORE the sun is visible (pre-dawn)
const PRE_DAWN_RANGE = 0.30; // NDC units below horizon where glow starts
const SUNRISE_RANGE = 0.0; // Full brightness right at the horizon

// Set to true to show a debug line at the computed horizon
const DEBUG_HORIZON = false;

/* ───────────────────────────────────────────
   Utilities
   ─────────────────────────────────────────── */

const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

function smoothstep(edge0, edge1, x) {
  const t = clamp((x - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
}

function edgeFade(phase, edge = 0.12) {
  return clamp(Math.min(phase, 1 - phase) / edge, 0, 1);
}

/* ───────────────────────────────────────────
   Horizon Position (viewport-aware)
   ─────────────────────────────────────────── */

/**
 * Calculates where the island horizon sits on screen in NDC (−1 bottom, +1 top).
 * Uses the same math as CSS `background-size: cover; background-position: center`.
 */
function getHorizonNdc(viewportW, viewportH) {
  if (viewportW <= 0 || viewportH <= 0) return -0.4;

  // bg-cover: scale so the image fills the viewport on both axes
  const scale = Math.max(viewportW / BG_IMAGE_W, viewportH / BG_IMAGE_H);
  const renderedH = BG_IMAGE_H * scale;

  // bg-position: center → vertical offset
  const offsetY = (viewportH - renderedH) * 0.5;

  // Where the island horizon falls in viewport pixels (from top)
  const horizonPx = offsetY + renderedH * BG_HORIZON_RATIO;

  // Convert to NDC: top of viewport = +1, bottom = −1
  const viewportRatio = horizonPx / viewportH; // 0 = top, 1 = bottom
  return 1 - viewportRatio * 2;
}

/* ───────────────────────────────────────────
   Arc Path (horizon-anchored)
   ─────────────────────────────────────────── */

/**
 * Positions the sun or moon along a parabolic arc anchored to the horizon.
 * phase: 0 → 1 (left to right across screen)
 * horizonNdc: where the island horizon sits (NDC)
 */
function arcPosition(phase, horizonNdc, camera, target) {
  const z = -120;
  const dist = Math.abs(camera.position.z - z);
  const halfH = Math.tan(THREE.MathUtils.degToRad(camera.fov * 0.5)) * dist;
  const halfW = halfH * camera.aspect;

  // X: sweep from left to right
  const xNdc = -ARC_X_EXTENT + 2 * ARC_X_EXTENT * phase;

  // Y: parabolic arc starting at the horizon, peaking above it
  // arc = 0 at phase=0 and phase=1, arc = 1 at phase=0.5
  const arc = 4 * phase * (1 - phase);

  // Start slightly below horizon (so sun rises FROM behind the islands)
  const baseY = horizonNdc - 0.06;
  const yNdc = baseY + arc * ARC_PEAK_OFFSET;

  return target.set(xNdc * halfW, yNdc * halfH, z);
}

/* ───────────────────────────────────────────
   Texture Generators
   ─────────────────────────────────────────── */

function createOrbTexture(size = 256, softness = 0.2) {
  const data = new Uint8Array(size * size * 4);
  const fadeStart = clamp(1 - softness, 0, 1);

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const u = ((x + 0.5) / size) * 2 - 1;
      const v = ((y + 0.5) / size) * 2 - 1;
      const d = Math.sqrt(u * u + v * v);

      let a = 0;
      if (d <= 1) {
        a = d <= fadeStart || softness <= 0 ? 1 : 1 - (d - fadeStart) / (1 - fadeStart);
      }

      const i = (y * size + x) * 4;
      data[i] = data[i + 1] = data[i + 2] = 255;
      data[i + 3] = Math.round(clamp(a, 0, 1) * 255);
    }
  }

  const tex = new THREE.DataTexture(data, size, size, THREE.RGBAFormat);
  tex.needsUpdate = true;
  tex.magFilter = THREE.LinearFilter;
  tex.minFilter = THREE.LinearMipmapLinearFilter;
  tex.generateMipmaps = true;
  return tex;
}

function createSunRayTexture(size = 512, rayCount = 18) {
  const data = new Uint8Array(size * size * 4);
  const twoPi = Math.PI * 2;

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const u = ((x + 0.5) / size) * 2 - 1;
      const v = ((y + 0.5) / size) * 2 - 1;
      const r = Math.sqrt(u * u + v * v);

      let a = 0;
      if (r <= 1) {
        const angle = Math.atan2(v, u);
        let rays = 0;
        for (let i = 0; i < rayCount; i++) {
          const target = (i / rayCount) * twoPi;
          const directional = Math.max(0, Math.cos((angle - target) * 2.2));
          rays = Math.max(rays, directional ** 8);
        }
        const centerFalloff = 1 - smoothstep(0, 1, r);
        const rayFalloff = 1 - smoothstep(0.15, 1, r);
        a = clamp(centerFalloff * 0.16 + rays * rayFalloff * 0.8, 0, 1);
      }

      const i = (y * size + x) * 4;
      data[i] = data[i + 1] = data[i + 2] = 255;
      data[i + 3] = Math.round(a * 255);
    }
  }

  const tex = new THREE.DataTexture(data, size, size, THREE.RGBAFormat);
  tex.needsUpdate = true;
  tex.magFilter = THREE.LinearFilter;
  tex.minFilter = THREE.LinearMipmapLinearFilter;
  tex.generateMipmaps = true;
  return tex;
}

function configureSpriteTexture(texture, { sRGB = false } = {}) {
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.magFilter = THREE.LinearFilter;
  texture.minFilter = THREE.LinearFilter;
  texture.generateMipmaps = false;
  if ("colorSpace" in texture) {
    texture.colorSpace = sRGB ? THREE.SRGBColorSpace : THREE.NoColorSpace;
  }
  texture.needsUpdate = true;
}

/* ───────────────────────────────────────────
   Camera helpers
   ─────────────────────────────────────────── */

function isInFrontOfCamera(camera, pos, fwd, diff) {
  camera.getWorldDirection(fwd);
  diff.copy(pos).sub(camera.position);
  return diff.dot(fwd) > 0;
}

/* ───────────────────────────────────────────
   SkyScene — the inner Three.js scene
   ─────────────────────────────────────────── */

function SkyScene({ progressRef, sunIntensityRef }) {
  // Refs for every renderable
  const skyRef = useRef(null);
  const starsRef = useRef(null);
  const sunCoreRef = useRef(null);
  const sunCoreMtlRef = useRef(null);
  const sunGlowRef = useRef(null);
  const sunGlowMtlRef = useRef(null);
  const sunCoronaRef = useRef(null);
  const sunCoronaMtlRef = useRef(null);
  const moonCoreRef = useRef(null);
  const moonCoreMtlRef = useRef(null);
  const moonGlowRef = useRef(null);
  const moonGlowMtlRef = useRef(null);
  const ambientRef = useRef(null);
  const hemiRef = useRef(null);
  const sunLightRef = useRef(null);
  const moonLightRef = useRef(null);

  // Reusable vectors (no allocations per frame)
  const sunSkyVec = useMemo(() => new THREE.Vector3(), []);
  const sunPos = useMemo(() => new THREE.Vector3(), []);
  const moonPos = useMemo(() => new THREE.Vector3(), []);
  const tmpColor = useMemo(() => new THREE.Color(), []);
  const tmpLightColor = useMemo(() => new THREE.Color(), []);
  const tmpFwd = useMemo(() => new THREE.Vector3(), []);
  const tmpDiff = useMemo(() => new THREE.Vector3(), []);
  const sunScreenVec = useMemo(() => new THREE.Vector3(), []);

  // Textures
  const sunCoreTex = useMemo(() => createOrbTexture(512, 0.02), []);
  const sunGlowTex = useMemo(() => createOrbTexture(512, 0.62), []);
  const sunRayTex = useMemo(() => createSunRayTexture(512, 20), []);
  const moonCoreTex = useMemo(() => createOrbTexture(512, 0.02), []);
  const moonGlowTex = useMemo(() => createOrbTexture(512, 0.78), []);
  const sunImgRef = useRef(null);
  const moonImgRef = useRef(null);

  // Configure procedural textures
  useEffect(() => {
    configureSpriteTexture(sunCoreTex);
    configureSpriteTexture(sunGlowTex);
    configureSpriteTexture(sunRayTex);
    configureSpriteTexture(moonCoreTex);
    configureSpriteTexture(moonGlowTex);
  }, [sunCoreTex, sunGlowTex, sunRayTex, moonCoreTex, moonGlowTex]);

  // Load image-based textures for sun/moon
  useEffect(() => {
    const loader = new THREE.TextureLoader();
    let active = true;

    loader.load("/sun.webp", (tex) => {
      if (!active) { tex.dispose(); return; }
      configureSpriteTexture(tex, { sRGB: true });
      sunImgRef.current = tex;
      if (sunCoreMtlRef.current) {
        sunCoreMtlRef.current.map = tex;
        sunCoreMtlRef.current.needsUpdate = true;
      }
    }, undefined, () => { });

    loader.load("/moon.png", (tex) => {
      if (!active) { tex.dispose(); return; }
      configureSpriteTexture(tex, { sRGB: true });
      moonImgRef.current = tex;
      if (moonCoreMtlRef.current) {
        moonCoreMtlRef.current.map = tex;
        moonCoreMtlRef.current.needsUpdate = true;
      }
    }, undefined, () => { });

    return () => {
      active = false;
      sunImgRef.current?.dispose();
      moonImgRef.current?.dispose();
    };
  }, []);

  // Cleanup procedural textures
  useEffect(
    () => () => {
      sunCoreTex.dispose();
      sunGlowTex.dispose();
      sunRayTex.dispose();
      moonCoreTex.dispose();
      moonGlowTex.dispose();
    },
    [sunCoreTex, sunGlowTex, sunRayTex, moonCoreTex, moonGlowTex],
  );

  /* ─── Per-frame update ─── */
  useFrame((state) => {
    const elapsed = state.clock.elapsedTime;
    const sunIntensity = sanitizeSunIntensity(sunIntensityRef.current);
    const sunIntensityMix = (sunIntensity - SUN_INTENSITY_MIN) / (SUN_INTENSITY_MAX - SUN_INTENSITY_MIN);

    // Scroll progress → cycle position
    const progress = clamp(progressRef.current, 0, 1);
    const cycle = (progress * SCROLL_CYCLE_REPEAT) % 1;
    const sunPass = cycle < 0.5;
    const phase = sunPass ? cycle * 2 : (cycle - 0.5) * 2;

    // Derived values
    const arc = 4 * phase * (1 - phase); // 0→1→0 parabola
    const mainFade = edgeFade(phase, 0.1); // fade at left/right edges
    const haloFade = edgeFade(phase, 0.16);

    // ─── Horizon position (viewport-aware) ───
    const horizonNdc = getHorizonNdc(state.size.width, state.size.height);

    // ─── Position sun and moon on their arcs ───
    arcPosition(phase, horizonNdc, state.camera, sunPos);
    arcPosition(phase, horizonNdc, state.camera, moonPos);

    // ─── Sun's screen Y position (for brightness calc) ───
    const sunScreenY = sunScreenVec.copy(sunPos).project(state.camera).y;

    // ─── Three-phase brightness ───
    // horizonFade: 0 when sun is well below horizon → 1 when sun clears horizon
    // Pre-dawn glow starts PRE_DAWN_RANGE below the horizon
    // Full brightness at SUNRISE_RANGE above the horizon
    const horizonFade = sunPass
      ? smoothstep(
        horizonNdc - PRE_DAWN_RANGE,
        horizonNdc + SUNRISE_RANGE,
        sunScreenY,
      )
      : 0;

    // Daylight drives everything: sky color, star visibility, exposure
    const daylightBase = sunPass
      ? clamp((0.16 + arc * 0.84) * THREE.MathUtils.lerp(0.24, 1, horizonFade), 0, 1)
      : 0.05;
    const daylight = sunPass
      ? clamp(daylightBase * THREE.MathUtils.lerp(0.62, 1.05, sunIntensityMix), 0, 1)
      : daylightBase;

    const orbScale = clamp(state.size.width / 1400, 0.82, 1.18);

    // Visibility checks
    const sunVisible = isInFrontOfCamera(state.camera, sunPos, tmpFwd, tmpDiff);
    const moonVisible = isInFrontOfCamera(state.camera, moonPos, tmpFwd, tmpDiff);

    /* ─── Sky shader ─── */
    if (skyRef.current?.material?.uniforms?.sunPosition) {
      if (sunPass) {
        sunSkyVec.copy(sunPos).normalize().multiplyScalar(SKY_RADIUS);
      } else {
        sunSkyVec.set(0, -SKY_RADIUS * 0.84, 0);
      }
      const u = skyRef.current.material.uniforms;
      u.sunPosition.value.copy(sunSkyVec);
      u.turbidity.value = THREE.MathUtils.lerp(12.5, 5.8, daylight);
      u.rayleigh.value = THREE.MathUtils.lerp(0.24, 1.2, daylight);
      u.mieCoefficient.value = THREE.MathUtils.lerp(0.045, 0.013, daylight);
      u.mieDirectionalG.value = THREE.MathUtils.lerp(0.9, 0.84, daylight);
    }

    /* ─── Stars ─── */
    if (starsRef.current) {
      const opacity = clamp(1 - daylight * 1.5, 0, 1);
      starsRef.current.visible = opacity > 0.01;
      if (starsRef.current.material) starsRef.current.material.opacity = opacity;
    }

    /* ─── Sun core ─── */
    if (sunCoreRef.current && sunCoreMtlRef.current) {
      const o = sunPass
        ? clamp(mainFade * horizonFade * (0.88 + arc * 0.12) * sunIntensity, 0, 1)
        : 0;
      sunCoreRef.current.position.copy(sunPos);
      sunCoreRef.current.scale.setScalar(ORB_SIZE_SUN * orbScale);
      sunCoreRef.current.visible = sunVisible && o > 0.01;
      sunCoreMtlRef.current.opacity = o;
    }

    /* ─── Sun glow ─── */
    if (sunGlowRef.current && sunGlowMtlRef.current) {
      const o = sunPass
        ? clamp(haloFade * horizonFade * (0.15 + arc * 0.24) * sunIntensity, 0, 1)
        : 0;
      const pulse = 1 + Math.sin(elapsed * 0.7) * 0.05;
      const s = (ORB_SIZE_SUN_GLOW + arc * 8) * orbScale * pulse;
      sunGlowRef.current.position.copy(sunPos);
      sunGlowRef.current.scale.setScalar(s);
      sunGlowRef.current.visible = sunVisible && o > 0.01;
      sunGlowMtlRef.current.opacity = o;
      tmpColor.setHSL(0.11, 0.95, 0.64);
      sunGlowMtlRef.current.color.copy(tmpColor);
    }

    /* ─── Sun corona / rays ─── */
    if (sunCoronaRef.current && sunCoronaMtlRef.current) {
      const rayPulse = 1 + Math.sin(elapsed * 0.92) * 0.06;
      const o = sunPass
        ? clamp(haloFade * horizonFade * (0.1 + arc * 0.17) * sunIntensity * rayPulse, 0, 1)
        : 0;
      const s = (ORB_SIZE_SUN_CORONA + arc * 10) * orbScale * rayPulse;
      sunCoronaRef.current.position.copy(sunPos);
      sunCoronaRef.current.scale.setScalar(s);
      sunCoronaRef.current.visible = sunVisible && o > 0.01;
      sunCoronaMtlRef.current.opacity = o;
      sunCoronaMtlRef.current.rotation = elapsed * 0.055;
      tmpColor.setHSL(0.08, 1, 0.5);
      sunCoronaMtlRef.current.color.copy(tmpColor);
    }

    /* ─── Moon core ─── */
    if (moonCoreRef.current && moonCoreMtlRef.current) {
      const o = sunPass ? 0 : clamp(mainFade * 0.9, 0, 1);
      moonCoreRef.current.position.copy(moonPos);
      moonCoreRef.current.scale.setScalar(ORB_SIZE_MOON * orbScale);
      moonCoreRef.current.visible = moonVisible && o > 0.01;
      moonCoreMtlRef.current.opacity = o;
    }

    /* ─── Moon glow ─── */
    if (moonGlowRef.current && moonGlowMtlRef.current) {
      const pulse = 1 + Math.sin(elapsed * 0.55) * 0.035;
      const o = sunPass ? 0 : clamp(haloFade * 0.15 * pulse, 0, 1);
      moonGlowRef.current.position.copy(moonPos);
      moonGlowRef.current.scale.setScalar(ORB_SIZE_MOON_GLOW * orbScale * pulse);
      moonGlowRef.current.visible = moonVisible && o > 0.01;
      moonGlowMtlRef.current.opacity = o;
    }

    /* ─── Tone mapping ─── */
    if (state.gl) {
      const target = THREE.MathUtils.lerp(EXPOSURE_NIGHT, EXPOSURE_DAY, daylight);
      state.gl.toneMappingExposure = THREE.MathUtils.lerp(
        state.gl.toneMappingExposure, target, 0.08,
      );
    }

    /* ─── CSS variable for section backgrounds ─── */
    if (typeof document !== "undefined") {
      document.documentElement.style.setProperty("--sky-daylight", String(daylight));
    }

    /* ─── Ambient light ─── */
    if (ambientRef.current) {
      ambientRef.current.intensity = THREE.MathUtils.lerp(0.05, 0.2, daylight);
    }

    /* ─── Hemisphere light ─── */
    if (hemiRef.current) {
      hemiRef.current.intensity = THREE.MathUtils.lerp(0.08, 0.72, daylight);
      tmpColor.setHSL(
        THREE.MathUtils.lerp(0.57, 0.08, 1 - daylight),
        THREE.MathUtils.lerp(0.66, 0.92, 1 - daylight),
        THREE.MathUtils.lerp(0.62, 0.12, 1 - daylight),
      );
      hemiRef.current.color.copy(tmpColor);
    }

    /* ─── Directional lights ─── */
    if (sunLightRef.current) {
      sunLightRef.current.position.copy(sunPos);
      sunLightRef.current.intensity = sunPass
        ? THREE.MathUtils.lerp(0.2, 1.32, arc) * sunIntensity * horizonFade
        : 0.02;
      tmpLightColor.setHSL(0.11, 1, 0.72);
      sunLightRef.current.color.copy(tmpLightColor);
    }

    if (moonLightRef.current) {
      moonLightRef.current.position.copy(moonPos);
      moonLightRef.current.intensity = sunPass
        ? 0.02
        : THREE.MathUtils.lerp(0.06, 0.2, arc);
    }
  });

  /* ─── JSX ─── */
  return (
    <>
      <Sky
        ref={skyRef}
        distance={SKY_RADIUS}
        turbidity={8}
        rayleigh={1}
        mieCoefficient={0.01}
        mieDirectionalG={0.84}
        sunPosition={[0, 1, 0]}
      />

      <Stars
        ref={starsRef}
        radius={360}
        depth={150}
        count={7000}
        factor={4}
        saturation={0}
        fade
        speed={0.45}
      />

      <ambientLight ref={ambientRef} intensity={0.2} />
      <hemisphereLight ref={hemiRef} args={["#7fb6ff", "#1b2534", 0.8]} />
      <directionalLight ref={sunLightRef} color="#fff3cc" intensity={1.1} />
      <directionalLight ref={moonLightRef} color="#c6d6ff" intensity={0.06} />

      {/* Sun glow (behind core) */}
      <sprite ref={sunGlowRef} renderOrder={4}>
        <spriteMaterial
          ref={sunGlowMtlRef}
          map={sunGlowTex}
          color="#ffd76e"
          transparent
          opacity={0.2}
          alphaTest={0.01}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          depthTest={false}
        />
      </sprite>

      {/* Sun corona / rays */}
      <sprite ref={sunCoronaRef} renderOrder={3}>
        <spriteMaterial
          ref={sunCoronaMtlRef}
          map={sunRayTex}
          color="#ff9a2a"
          transparent
          opacity={0.1}
          alphaTest={0.01}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          depthTest={false}
        />
      </sprite>

      {/* Sun core */}
      <sprite ref={sunCoreRef} renderOrder={5}>
        <spriteMaterial
          ref={sunCoreMtlRef}
          map={sunCoreTex}
          color="#ffffff"
          transparent
          opacity={0.9}
          alphaTest={0.01}
          depthWrite={false}
          depthTest={false}
        />
      </sprite>

      {/* Moon glow */}
      <sprite ref={moonGlowRef} renderOrder={4}>
        <spriteMaterial
          ref={moonGlowMtlRef}
          map={moonGlowTex}
          color="#d7e6ff"
          transparent
          opacity={0.08}
          alphaTest={0.01}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          depthTest={false}
        />
      </sprite>

      {/* Moon core */}
      <sprite ref={moonCoreRef} renderOrder={5}>
        <spriteMaterial
          ref={moonCoreMtlRef}
          map={moonCoreTex}
          color="#ffffff"
          transparent
          opacity={0.85}
          alphaTest={0.01}
          depthWrite={false}
          depthTest={false}
        />
      </sprite>
    </>
  );
}

/* ───────────────────────────────────────────
   Debug Overlay
   ─────────────────────────────────────────── */

function HorizonDebugOverlay() {
  const lineRef = useRef(null);

  useEffect(() => {
    const update = () => {
      if (!lineRef.current) return;
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const ndc = getHorizonNdc(vw, vh);
      // NDC +1 = top (0px), −1 = bottom (vh px)
      const pxFromTop = ((1 - ndc) / 2) * vh;
      lineRef.current.style.top = `${pxFromTop}px`;
      lineRef.current.textContent = `horizon NDC: ${ndc.toFixed(3)} — ${Math.round(pxFromTop)}px from top (${Math.round((pxFromTop / vh) * 100)}%)`;
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return (
    <div
      ref={lineRef}
      style={{
        position: "fixed",
        left: 0,
        right: 0,
        height: "2px",
        background: "red",
        zIndex: 9999,
        pointerEvents: "none",
        color: "red",
        fontSize: "12px",
        fontFamily: "monospace",
        paddingLeft: "8px",
        paddingTop: "4px",
      }}
    />
  );
}

/* ───────────────────────────────────────────
   Main Component (exported)
   ─────────────────────────────────────────── */

export default function SunMoonCycle({ layerClass = "z-0" }) {
  const [reducedMotion, setReducedMotion] = useState(false);
  const progressRef = useRef(0);
  const sunIntensityRef = useRef(SUN_INTENSITY_DEFAULT);

  // Scroll → progress via GSAP ScrollTrigger
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReducedMotion(mq.matches);
    apply();
    mq.addEventListener("change", apply);

    gsap.registerPlugin(ScrollTrigger);

    const sync = () => {
      const y = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      progressRef.current = max > 0 ? clamp(y / max, 0, 1) : 0;
    };
    sync();

    const proxy = { value: progressRef.current };
    const tween = gsap.to(proxy, {
      value: 1,
      ease: "none",
      onUpdate: () => { progressRef.current = proxy.value; },
      scrollTrigger: {
        start: 0,
        end: "max",
        scrub: 0.85,
        invalidateOnRefresh: true,
      },
    });

    const onResize = () => { sync(); ScrollTrigger.refresh(); };
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      mq.removeEventListener("change", apply);
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, []);

  // Fixed sun intensity (slider removed)
  useEffect(() => {
    sunIntensityRef.current = SUN_INTENSITY_DEFAULT;
  }, []);

  // Reduced motion fallback
  if (reducedMotion) {
    return (
      <div
        className={`fixed inset-0 h-full w-full pointer-events-none ${layerClass} bg-gradient-to-b from-[#462104] via-[#c96e12] to-[#f8d44d]`}
      />
    );
  }

  return (
    <div className={`fixed inset-0 h-full w-full pointer-events-none ${layerClass}`}>
      <Canvas
        dpr={[1, 1.7]}
        camera={{ position: [0, 0, 1], fov: 55, near: 0.1, far: SKY_RADIUS + 1000 }}
        gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = EXPOSURE_DAY;
        }}
      >
        <SkyScene progressRef={progressRef} sunIntensityRef={sunIntensityRef} />
      </Canvas>
      {/* Warm atmospheric overlays */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, rgba(255,160,45,0.11) 0%, rgba(255,148,44,0.05) 34%, rgba(20,12,10,0.18) 100%)",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(80% 36% at 50% 88%, rgba(255,128,42,0.16) 0%, rgba(255,128,42,0) 70%)",
        }}
      />
      {/* Debug overlay — toggle via DEBUG_HORIZON constant */}
      {DEBUG_HORIZON && <HorizonDebugOverlay />}
    </div>
  );
}
