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

const SKY_RADIUS = 450000;
const SCROLL_CYCLE_REPEAT = 3;

const EXPOSURE_DAY = 0.76;
const EXPOSURE_NIGHT = 0.62;

const ORB_SIZE_SUN = 12.2;
const ORB_SIZE_SUN_HALO = 30;
const ORB_SIZE_SUN_RAYS = 42;
const ORB_SIZE_SUN_GLOW = ORB_SIZE_SUN_HALO;
const ORB_SIZE_SUN_CORONA = ORB_SIZE_SUN_RAYS;
const ORB_SIZE_MOON = 9.2;
const ORB_SIZE_MOON_GLOW = 18.5;

const BACKGROUND_IMAGE_WIDTH = 1920;
const BACKGROUND_IMAGE_HEIGHT = 1080;
const BACKGROUND_IMAGE_ALPHA_TOP_RATIO = 0.6213;
const BACKGROUND_IMAGE_ALPHA_SOLID_RATIO = 0.7074;
const BACKGROUND_IMAGE_HORIZON_RATIO =
  BACKGROUND_IMAGE_ALPHA_TOP_RATIO +
  (BACKGROUND_IMAGE_ALPHA_SOLID_RATIO - BACKGROUND_IMAGE_ALPHA_TOP_RATIO) * 0.45;
const HORIZON_FADE_BELOW_NDC = 0.08;
const HORIZON_FADE_ABOVE_NDC = 0.12;

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

function smoothstep(edge0, edge1, x) {
  const t = clamp((x - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
}

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

function createSunRayTexture(size = 512, rayCount = 18) {
  const data = new Uint8Array(size * size * 4);
  const twoPi = Math.PI * 2;

  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      const u = ((x + 0.5) / size) * 2 - 1;
      const v = ((y + 0.5) / size) * 2 - 1;
      const r = Math.sqrt(u * u + v * v);

      let alpha = 0;
      if (r <= 1) {
        const angle = Math.atan2(v, u);
        let rays = 0;

        for (let i = 0; i < rayCount; i += 1) {
          const target = (i / rayCount) * twoPi;
          const directional = Math.max(0, Math.cos((angle - target) * 2.2));
          rays = Math.max(rays, directional ** 8);
        }

        const centerFalloff = 1 - smoothstep(0, 1, r);
        const rayFalloff = 1 - smoothstep(0.15, 1, r);
        alpha = clamp(centerFalloff * 0.16 + rays * rayFalloff * 0.8, 0, 1);
      }

      const idx = (y * size + x) * 4;
      data[idx] = 255;
      data[idx + 1] = 255;
      data[idx + 2] = 255;
      data[idx + 3] = Math.round(alpha * 255);
    }
  }

  const texture = new THREE.DataTexture(data, size, size, THREE.RGBAFormat);
  texture.needsUpdate = true;
  texture.magFilter = THREE.LinearFilter;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.generateMipmaps = true;
  return texture;
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

function backgroundHorizonNdc(viewportWidth, viewportHeight) {
  if (viewportWidth <= 0 || viewportHeight <= 0) return -0.25;

  const scale = Math.max(
    viewportWidth / BACKGROUND_IMAGE_WIDTH,
    viewportHeight / BACKGROUND_IMAGE_HEIGHT,
  );
  const renderedHeight = BACKGROUND_IMAGE_HEIGHT * scale;
  const offsetY = (viewportHeight - renderedHeight) * 0.5;
  const horizonY = offsetY + renderedHeight * BACKGROUND_IMAGE_HORIZON_RATIO;
  const horizonViewportRatio = clamp(horizonY / viewportHeight, 0, 1);
  return 1 - horizonViewportRatio * 2;
}

function SkyScene({ progressRef, sunIntensityRef }) {
  const skyRef = useRef(null);
  const starsRef = useRef(null);
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
  const sunScreenVector = useMemo(() => new THREE.Vector3(), []);
  const sunCoreFallbackTexture = useMemo(() => createOrbTexture(512, 0.02), []);
  const sunGlowTexture = useMemo(() => createOrbTexture(512, 0.62), []);
  const sunRayTexture = useMemo(() => createSunRayTexture(512, 20), []);
  const moonCoreFallbackTexture = useMemo(() => createOrbTexture(512, 0.02), []);
  const moonGlowTexture = useMemo(() => createOrbTexture(512, 0.78), []);
  const sunImageTextureRef = useRef(null);
  const moonImageTextureRef = useRef(null);

  useEffect(() => {
    configureSpriteTexture(sunCoreFallbackTexture);
    configureSpriteTexture(sunGlowTexture);
    configureSpriteTexture(sunRayTexture);
    configureSpriteTexture(moonCoreFallbackTexture);
    configureSpriteTexture(moonGlowTexture);
  }, [sunCoreFallbackTexture, sunGlowTexture, sunRayTexture, moonCoreFallbackTexture, moonGlowTexture]);

  useEffect(() => {
    const loader = new THREE.TextureLoader();
    let active = true;

    loader.load(
      "/sun.webp",
      (texture) => {
        if (!active) {
          texture.dispose();
          return;
        }
        configureSpriteTexture(texture, { sRGB: true });
        sunImageTextureRef.current = texture;
        if (sunCoreMaterialRef.current) {
          sunCoreMaterialRef.current.map = texture;
          sunCoreMaterialRef.current.needsUpdate = true;
        }
      },
      undefined,
      () => {
        // Fallback texture stays active if file fails to load.
      },
    );

    loader.load(
      "/moon.png",
      (texture) => {
        if (!active) {
          texture.dispose();
          return;
        }
        configureSpriteTexture(texture, { sRGB: true });
        moonImageTextureRef.current = texture;
        if (moonCoreMaterialRef.current) {
          moonCoreMaterialRef.current.map = texture;
          moonCoreMaterialRef.current.needsUpdate = true;
        }
      },
      undefined,
      () => {
        // Fallback texture stays active if file fails to load.
      },
    );

    return () => {
      active = false;
      sunImageTextureRef.current?.dispose();
      moonImageTextureRef.current?.dispose();
    };
  }, []);

  useEffect(
    () => () => {
      sunCoreFallbackTexture.dispose();
      sunGlowTexture.dispose();
      sunRayTexture.dispose();
      moonCoreFallbackTexture.dispose();
      moonGlowTexture.dispose();
    },
    [sunCoreFallbackTexture, sunGlowTexture, sunRayTexture, moonCoreFallbackTexture, moonGlowTexture],
  );

  useFrame((state) => {
    const elapsed = state.clock.elapsedTime;
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
    const horizonNdc = backgroundHorizonNdc(state.size.width, state.size.height);

    arcPointForBody(phase, state.camera, sunBodyVector);
    arcPointForBody(phase, state.camera, moonBodyVector);

    const sunScreenY = sunScreenVector.copy(sunBodyVector).project(state.camera).y;
    const horizonFade = sunPass
      ? smoothstep(
          horizonNdc - HORIZON_FADE_BELOW_NDC,
          horizonNdc + HORIZON_FADE_ABOVE_NDC,
          sunScreenY,
        )
      : 0;
    const daylightBase = sunPass
      ? clamp((0.16 + arcStrength * 0.84) * THREE.MathUtils.lerp(0.24, 1, horizonFade), 0, 1)
      : 0.05;
    const daylight = sunPass
      ? clamp(daylightBase * THREE.MathUtils.lerp(0.62, 1.05, sunIntensityMix), 0, 1)
      : daylightBase;
    const orbViewportScale = clamp(state.size.width / 1400, 0.82, 1.18);

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
        ? clamp(mainFade * horizonFade * (0.88 + arcStrength * 0.12) * sunIntensity, 0, 1)
        : 0;
      sunCoreRef.current.position.copy(sunBodyVector);
      sunCoreRef.current.scale.set(ORB_SIZE_SUN * orbViewportScale, ORB_SIZE_SUN * orbViewportScale, 1);
      sunCoreRef.current.visible = sunInView && sunOpacity > 0.01;
      sunCoreMaterialRef.current.opacity = sunOpacity;
    }

    if (sunGlowRef.current && sunGlowMaterialRef.current) {
      const sunGlowOpacity = sunPass
        ? clamp(haloFade * horizonFade * (0.15 + arcStrength * 0.24) * sunIntensity, 0, 1)
        : 0;
      const haloPulse = 1 + Math.sin(elapsed * 0.7) * 0.05;
      sunGlowRef.current.position.copy(sunBodyVector);
      sunGlowRef.current.scale.set(
        (ORB_SIZE_SUN_GLOW + arcStrength * 8) * orbViewportScale * haloPulse,
        (ORB_SIZE_SUN_GLOW + arcStrength * 8) * orbViewportScale * haloPulse,
        1,
      );
      sunGlowRef.current.visible = sunInView && sunGlowOpacity > 0.01;
      sunGlowMaterialRef.current.opacity = sunGlowOpacity;
      tmpColor.setHSL(0.11, 0.95, 0.64);
      sunGlowMaterialRef.current.color.copy(tmpColor);
    }

    if (sunCoronaRef.current && sunCoronaMaterialRef.current) {
      const rayPulse = 1 + Math.sin(elapsed * 0.92) * 0.06;
      const sunCoronaOpacity = sunPass
        ? clamp(haloFade * horizonFade * (0.1 + arcStrength * 0.17) * sunIntensity * rayPulse, 0, 1)
        : 0;
      sunCoronaRef.current.position.copy(sunBodyVector);
      sunCoronaRef.current.scale.set(
        (ORB_SIZE_SUN_CORONA + arcStrength * 10) * orbViewportScale * rayPulse,
        (ORB_SIZE_SUN_CORONA + arcStrength * 10) * orbViewportScale * rayPulse,
        1,
      );
      sunCoronaRef.current.visible = sunInView && sunCoronaOpacity > 0.01;
      sunCoronaMaterialRef.current.opacity = sunCoronaOpacity;
      sunCoronaMaterialRef.current.rotation = elapsed * 0.055;
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
      const moonPulse = 1 + Math.sin(elapsed * 0.55) * 0.035;
      const moonGlowOpacity = sunPass ? 0 : clamp(haloFade * 0.15 * moonPulse, 0, 1);
      moonGlowRef.current.position.copy(moonBodyVector);
      moonGlowRef.current.scale.set(
        ORB_SIZE_MOON_GLOW * orbViewportScale * moonPulse,
        ORB_SIZE_MOON_GLOW * orbViewportScale * moonPulse,
        1,
      );
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
        ? THREE.MathUtils.lerp(0.2, 1.32, arcStrength) * sunIntensity * horizonFade
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
          map={sunRayTexture}
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
          map={sunCoreFallbackTexture}
          color="#ffffff"
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
          map={moonCoreFallbackTexture}
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

export default function SunMoonCycle({ layerClass = "z-0" }) {
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
