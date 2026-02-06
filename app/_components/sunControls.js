export const SUN_INTENSITY_EVENT = "gulfsolar:sun-intensity-change";
export const SUN_INTENSITY_STORAGE_KEY = "gulfsolar:sun-intensity";
export const SUN_INTENSITY_DEFAULT = 0.82;
export const SUN_INTENSITY_MIN = 0.35;
export const SUN_INTENSITY_MAX = 1.2;

export function sanitizeSunIntensity(value) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return SUN_INTENSITY_DEFAULT;
  return Math.min(SUN_INTENSITY_MAX, Math.max(SUN_INTENSITY_MIN, numeric));
}
