/**
 * Stable pseudo-random metrics for dashboards that lack live telemetry yet.
 * Same seed → same values (reproducible UI); no Math.random().
 */
export function unitFromSeed(seed) {
  const x = Math.sin((Number(seed) || 0) * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
}

export function hashString(str) {
  let h = 2166136261;
  const s = String(str ?? '');
  for (let i = 0; i < s.length; i += 1) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h >>> 0);
}

export function intFromSeed(seed, min, max) {
  return Math.floor(min + unitFromSeed(seed) * (max - min + 0.999999));
}
