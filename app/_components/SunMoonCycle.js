"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Sky, Stars } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
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

const SKY_RADIUS = 450000;
const SCROLL_CYCLE_REPEAT = 3;

const EXPOSURE_DAY = 0.76;
const EXPOSURE_NIGHT = 0.62;
const BLOOM_INTENSITY_DAY = 0.18;
const BLOOM_INTENSITY_NIGHT = 0.34;
const BLOOM_THRESHOLD_DAY = 0.44;
const BLOOM_THRESHOLD_NIGHT = 0.32;
const BLOOM_SMOOTHING = 0.5;

const ORB_SIZE_SUN = 10.8;
const ORB_SIZE_SUN_GLOW = 23;
const ORB_SIZE_SUN_CORONA = 34;
const ORB_SIZE_MOON = 8.8;
const ORB_SIZE_MOON_GLOW = 17;

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

function createOrbTexture(size = 256, softness = 0.2) {
  const data = new Uint8Array(size * size * 4);
  const fadeStart = clamp(1 - softness, 0, 1);

  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      const u = ((x + 0.5) / size) * 2 - 1;
      const v = ((y + 0.5) / size) * 2 - 1;
      const distance = Math.sqrt(u * u + v * v);

      let alpha = 0;
      if (distance <= 1) {
        if (distance <= fadeStart || softness <= 0) {
          alpha = 1;
        } else {
          alpha = 1 - (distance - fadeStart) / (1 - fadeStart);
        }
      }

      const idx = (y * size + x) * 4;
      data[idx] = 255;
      data[idx + 1] = 255;
      data[idx + 2] = 255;
      data[idx + 3] = Math.round(clamp(alpha, 0, 1) * 255);
    }
  }

  const texture = new THREE.DataTexture(data, size, size, THREE.RGBAFormat);
  texture.needsUpdate = true;
  texture.magFilter = THREE.LinearFilter;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.generateMipmaps = true;
  return texture;
}

function edgeFade(phase, edge = 0.12) {
  return clamp(Math.min(phase, 1 - phase) / edge, 0, 1);
}

function arcPointForBody(phase, camera, target) {
  const z = -120;
  const distance = Math.abs(camera.position.z - z);
  const halfHeight = Math.tan(THREE.MathUtils.degToRad(camera.fov * 0.5)) * distance;
  const halfWidth = halfHeight * camera.aspect;

  // Bottom-left (-0.92, -0.96) -> peak y=0.80 -> bottom-right (0.92, -0.96)
  const xNdc = -0.92 + 1.84 * phase;
  const arc = 4 * phase * (1 - phase);
  const yNdc = -0.96 + arc * 1.76;

  return target.set(xNdc * halfWidth, yNdc * halfHeight, z);
}

function isInFrontOfCamera(camera, position, forward, cameraToBody) {
  camera.getWorldDirection(forward);
  cameraToBody.copy(position).sub(camera.position);
  return cameraToBody.dot(forward) > 0;
}

function SkyScene({ progressRef, sunIntensityRef }) {
  const skyRef = useRef(null);
  const starsRef = useRef(null);
  const bloomRef = useRef(null);
  const sunCoreRef = useRef(null);
  const sunCoreMaterialRef = useRef(null);
  const sunGlowRef = useRef(null);
  const sunGlowMaterialRef = useRef(null);
  const sunCoronaRef = useRef(null);
  const sunCoronaMaterialRef = useRef(null);
  const moonCoreRef = useRef(null);
  const moonCoreMaterialRef = useRef(null);
  const moonGlowRef = useRef(null);
  const moonGlowMaterialRef = useRef(null);
  const ambientRef = useRef(null);
  const hemiRef = useRef(null);
  const sunLightRef = useRef(null);
  const moonLightRef = useRef(null);

  const sunSkyVector = useMemo(() => new THREE.Vector3(), []);
  const sunBodyVector = useMemo(() => new THREE.Vector3(), []);
  const moonBodyVector = useMemo(() => new THREE.Vector3(), []);
  const tmpColor = useMemo(() => new THREE.Color(), []);
  const tmpLightColor = useMemo(() => new THREE.Color(), []);
  const tmpForward = useMemo(() => new THREE.Vector3(), []);
  const tmpCameraToBody = useMemo(() => new THREE.Vector3(), []);
  const sunCoreTexture = useMemo(() => createOrbTexture(256, 0.02), []);
  const sunGlowTexture = useMemo(() => createOrbTexture(256, 0.55), []);
  const sunCoronaTexture = useMemo(() => createOrbTexture(256, 0.75), []);
  const moonCoreTexture = useMemo(() => createOrbTexture(256, 0.02), []);
  const moonGlowTexture = useMemo(() => createOrbTexture(256, 0.7), []);

  useEffect(
    () => () => {
      sunCoreTexture.dispose();
      sunGlowTexture.dispose();
      sunCoronaTexture.dispose();
      moonCoreTexture.dispose();
      moonGlowTexture.dispose();
    },
    [sunCoreTexture, sunGlowTexture, sunCoronaTexture, moonCoreTexture, moonGlowTexture],
  );

  useFrame((state) => {
    const sunIntensity = sanitizeSunIntensity(sunIntensityRef.current);
    const sunIntensityMix =
      (sunIntensity - SUN_INTENSITY_MIN) / (SUN_INTENSITY_MAX - SUN_INTENSITY_MIN);
    const progress = clamp(progressRef.current, 0, 1);
    const cycle = (progress * SCROLL_CYCLE_REPEAT) % 1;
    const sunPass = cycle < 0.5;
    const phase = sunPass ? cycle * 2 : (cycle - 0.5) * 2;

    const arcStrength = 4 * phase * (1 - phase);
    const mainFade = edgeFade(phase, 0.1);
    const haloFade = edgeFade(phase, 0.16);
    const daylightBase = sunPass ? clamp(0.16 + arcStrength * 0.84, 0, 1) : 0.05;
    const daylight = sunPass
      ? clamp(daylightBase * THREE.MathUtils.lerp(0.62, 1.05, sunIntensityMix), 0, 1)
      : daylightBase;
    const orbViewportScale = clamp(state.size.width / 1400, 0.82, 1.18);

    arcPointForBody(phase, state.camera, sunBodyVector);
    arcPointForBody(phase, state.camera, moonBodyVector);

    const sunInView = isInFrontOfCamera(
      state.camera,
      sunBodyVector,
      tmpForward,
      tmpCameraToBody,
    );
    const moonInView = isInFrontOfCamera(
      state.camera,
      moonBodyVector,
      tmpForward,
      tmpCameraToBody,
    );

    if (skyRef.current?.material?.uniforms?.sunPosition) {
      if (sunPass) {
        sunSkyVector.copy(sunBodyVector).normalize().multiplyScalar(SKY_RADIUS);
      } else {
        sunSkyVector.set(0, -SKY_RADIUS * 0.84, 0);
      }

      skyRef.current.material.uniforms.sunPosition.value.copy(sunSkyVector);
      skyRef.current.material.uniforms.turbidity.value = THREE.MathUtils.lerp(12.5, 5.8, daylight);
      skyRef.current.material.uniforms.rayleigh.value = THREE.MathUtils.lerp(0.24, 1.2, daylight);
      skyRef.current.material.uniforms.mieCoefficient.value = THREE.MathUtils.lerp(0.045, 0.013, daylight);
      skyRef.current.material.uniforms.mieDirectionalG.value = THREE.MathUtils.lerp(0.9, 0.84, daylight);
    }

    if (starsRef.current) {
      const starsOpacity = clamp(1 - daylight * 1.5, 0, 1);
      starsRef.current.visible = starsOpacity > 0.01;
      if (starsRef.current.material) {
        starsRef.current.material.opacity = starsOpacity;
      }
    }

    if (sunCoreRef.current && sunCoreMaterialRef.current) {
      const sunOpacity = sunPass
        ? clamp(mainFade * (0.88 + arcStrength * 0.12) * sunIntensity, 0, 1)
        : 0;
      sunCoreRef.current.position.copy(sunBodyVector);
      sunCoreRef.current.scale.set(ORB_SIZE_SUN * orbViewportScale, ORB_SIZE_SUN * orbViewportScale, 1);
      sunCoreRef.current.visible = sunInView && sunOpacity > 0.01;
      sunCoreMaterialRef.current.opacity = sunOpacity;
    }

    if (sunGlowRef.current && sunGlowMaterialRef.current) {
      const sunGlowOpacity = sunPass
        ? clamp(haloFade * (0.12 + arcStrength * 0.2) * sunIntensity, 0, 1)
        : 0;
      sunGlowRef.current.position.copy(sunBodyVector);
      sunGlowRef.current.scale.set(
        (ORB_SIZE_SUN_GLOW + arcStrength * 8) * orbViewportScale,
        (ORB_SIZE_SUN_GLOW + arcStrength * 8) * orbViewportScale,
        1,
      );
      sunGlowRef.current.visible = sunInView && sunGlowOpacity > 0.01;
      sunGlowMaterialRef.current.opacity = sunGlowOpacity;
      tmpColor.setHSL(0.11, 0.95, 0.64);
      sunGlowMaterialRef.current.color.copy(tmpColor);
    }

    if (sunCoronaRef.current && sunCoronaMaterialRef.current) {
      const sunCoronaOpacity = sunPass
        ? clamp(haloFade * (0.08 + arcStrength * 0.14) * sunIntensity, 0, 1)
        : 0;
      sunCoronaRef.current.position.copy(sunBodyVector);
      sunCoronaRef.current.scale.set(
        (ORB_SIZE_SUN_CORONA + arcStrength * 9) * orbViewportScale,
        (ORB_SIZE_SUN_CORONA + arcStrength * 9) * orbViewportScale,
        1,
      );
      sunCoronaRef.current.visible = sunInView && sunCoronaOpacity > 0.01;
      sunCoronaMaterialRef.current.opacity = sunCoronaOpacity;
      tmpColor.setHSL(0.08, 1, 0.5);
      sunCoronaMaterialRef.current.color.copy(tmpColor);
    }

    if (moonCoreRef.current && moonCoreMaterialRef.current) {
      const moonOpacity = sunPass ? 0 : clamp(mainFade * 0.9, 0, 1);
      moonCoreRef.current.position.copy(moonBodyVector);
      moonCoreRef.current.scale.set(ORB_SIZE_MOON * orbViewportScale, ORB_SIZE_MOON * orbViewportScale, 1);
      moonCoreRef.current.visible = moonInView && moonOpacity > 0.01;
      moonCoreMaterialRef.current.opacity = moonOpacity;
    }

    if (moonGlowRef.current && moonGlowMaterialRef.current) {
      const moonGlowOpacity = sunPass ? 0 : clamp(haloFade * 0.16, 0, 1);
      moonGlowRef.current.position.copy(moonBodyVector);
      moonGlowRef.current.scale.set(ORB_SIZE_MOON_GLOW * orbViewportScale, ORB_SIZE_MOON_GLOW * orbViewportScale, 1);
      moonGlowRef.current.visible = moonInView && moonGlowOpacity > 0.01;
      moonGlowMaterialRef.current.opacity = moonGlowOpacity;
    }

    if (state.gl) {
      const targetExposure = THREE.MathUtils.lerp(EXPOSURE_NIGHT, EXPOSURE_DAY, daylight);
      state.gl.toneMappingExposure = THREE.MathUtils.lerp(state.gl.toneMappingExposure, targetExposure, 0.08);
    }

    if (typeof document !== "undefined") {
      document.documentElement.style.setProperty("--sky-daylight", String(daylight));
    }

    if (bloomRef.current) {
      const dayBloom = BLOOM_INTENSITY_DAY * THREE.MathUtils.lerp(0.55, 1, sunIntensityMix);
      bloomRef.current.intensity = THREE.MathUtils.lerp(BLOOM_INTENSITY_NIGHT, dayBloom, daylight);
      bloomRef.current.luminanceThreshold = THREE.MathUtils.lerp(BLOOM_THRESHOLD_NIGHT, BLOOM_THRESHOLD_DAY, daylight);
      bloomRef.current.luminanceSmoothing = BLOOM_SMOOTHING;
    }

    if (ambientRef.current) {
      ambientRef.current.intensity = THREE.MathUtils.lerp(0.05, 0.2, daylight);
    }

    if (hemiRef.current) {
      hemiRef.current.intensity = THREE.MathUtils.lerp(0.08, 0.72, daylight);
      tmpColor.setHSL(
        THREE.MathUtils.lerp(0.57, 0.08, 1 - daylight),
        THREE.MathUtils.lerp(0.66, 0.92, 1 - daylight),
        THREE.MathUtils.lerp(0.62, 0.12, 1 - daylight),
      );
      hemiRef.current.color.copy(tmpColor);
    }

    if (sunLightRef.current) {
      sunLightRef.current.position.copy(sunBodyVector);
      sunLightRef.current.intensity = sunPass
        ? THREE.MathUtils.lerp(0.2, 1.32, arcStrength) * sunIntensity
        : 0.02;
      tmpLightColor.setHSL(0.11, 1, 0.72);
      sunLightRef.current.color.copy(tmpLightColor);
    }

    if (moonLightRef.current) {
      moonLightRef.current.position.copy(moonBodyVector);
      moonLightRef.current.intensity = sunPass ? 0.02 : THREE.MathUtils.lerp(0.06, 0.2, arcStrength);
    }
  });

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
      <hemisphereLight
        ref={hemiRef}
        args={["#7fb6ff", "#1b2534", 0.8]}
      />
      <directionalLight ref={sunLightRef} color="#fff3cc" intensity={1.1} />
      <directionalLight ref={moonLightRef} color="#c6d6ff" intensity={0.06} />

      <sprite ref={sunGlowRef} renderOrder={4}>
        <spriteMaterial
          ref={sunGlowMaterialRef}
          map={sunGlowTexture}
          color="#ffd76e"
          transparent
          opacity={0.2}
          alphaTest={0.01}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          depthTest={false}
        />
      </sprite>

      <sprite ref={sunCoronaRef} renderOrder={3}>
        <spriteMaterial
          ref={sunCoronaMaterialRef}
          map={sunCoronaTexture}
          color="#ff9a2a"
          transparent
          opacity={0.1}
          alphaTest={0.01}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          depthTest={false}
        />
      </sprite>

      <sprite ref={sunCoreRef} renderOrder={5}>
        <spriteMaterial
          ref={sunCoreMaterialRef}
          map={sunCoreTexture}
          color="#fffef8"
          transparent
          opacity={0.9}
          alphaTest={0.01}
          depthWrite={false}
          depthTest={false}
        />
      </sprite>

      <sprite ref={moonGlowRef} renderOrder={4}>
        <spriteMaterial
          ref={moonGlowMaterialRef}
          map={moonGlowTexture}
          color="#d7e6ff"
          transparent
          opacity={0.08}
          alphaTest={0.01}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          depthTest={false}
        />
      </sprite>

      <sprite ref={moonCoreRef} renderOrder={5}>
        <spriteMaterial
          ref={moonCoreMaterialRef}
          map={moonCoreTexture}
          color="#f8fbff"
          transparent
          opacity={0.85}
          alphaTest={0.01}
          depthWrite={false}
          depthTest={false}
        />
      </sprite>

      <EffectComposer disableNormalPass>
        <Bloom
          ref={bloomRef}
          intensity={BLOOM_INTENSITY_DAY}
          luminanceThreshold={BLOOM_THRESHOLD_DAY}
          luminanceSmoothing={BLOOM_SMOOTHING}
          mipmapBlur
        />
      </EffectComposer>
    </>
  );
}

export default function SunMoonCycle() {
  const [reducedMotion, setReducedMotion] = useState(false);
  const progressRef = useRef(0);
  const sunIntensityRef = useRef(SUN_INTENSITY_DEFAULT);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const applyMotionPreference = () => setReducedMotion(mediaQuery.matches);
    applyMotionPreference();
    mediaQuery.addEventListener("change", applyMotionPreference);

    gsap.registerPlugin(ScrollTrigger);

    const updateFromScroll = () => {
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      progressRef.current = docHeight > 0 ? clamp(scrollY / docHeight, 0, 1) : 0;
    };

    updateFromScroll();

    const proxy = { value: progressRef.current };
    const tween = gsap.to(proxy, {
      value: 1,
      ease: "none",
      onUpdate: () => {
        progressRef.current = proxy.value;
      },
      scrollTrigger: {
        start: 0,
        end: "max",
        scrub: 0.85,
        invalidateOnRefresh: true,
      },
    });

    const handleResize = () => {
      updateFromScroll();
      ScrollTrigger.refresh();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      mediaQuery.removeEventListener("change", applyMotionPreference);
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const saved = window.localStorage.getItem(SUN_INTENSITY_STORAGE_KEY);
    sunIntensityRef.current = sanitizeSunIntensity(saved ?? SUN_INTENSITY_DEFAULT);

    const handleSunIntensityChange = (event) => {
      const nextValue = sanitizeSunIntensity(event?.detail?.value);
      sunIntensityRef.current = nextValue;
    };

    window.addEventListener(SUN_INTENSITY_EVENT, handleSunIntensityChange);
    return () => {
      window.removeEventListener(SUN_INTENSITY_EVENT, handleSunIntensityChange);
    };
  }, []);

  if (reducedMotion) {
    return (
      <div className="fixed inset-0 w-full h-full pointer-events-none z-0 bg-gradient-to-b from-[#462104] via-[#c96e12] to-[#f8d44d]" />
    );
  }

  return (
    <div className="fixed inset-0 w-full h-full pointer-events-none z-0">
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
    </div>
  );
}
