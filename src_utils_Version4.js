export function lerp(a, b, t) { return a + (b-a)*t; }
export function clamp(x, min, max) { return Math.max(min, Math.min(max, x)); }