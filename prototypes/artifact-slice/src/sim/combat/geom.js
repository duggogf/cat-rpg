// PROTOTYPE - NOT FOR PRODUCTION (Cat RPG artifact showcase slice; throwaway, see README.md)
// Ground-plane geometry (x, z in metres). No trig in state-affecting code: facings are unit vectors.

export const len = (x, z) => Math.sqrt(x * x + z * z);
export const dist = (a, b) => len(a.x - b.x, a.z - b.z);
export function norm(x, z) { const l = len(x, z); return l > 1e-9 ? [x / l, z / l] : [0, 0]; }
export const clamp = (x, a, b) => Math.max(a, Math.min(b, x));

/** cos of half an angle in degrees (computed once per call site; deterministic enough for thresholds). */
export const cosHalf = deg => Math.cos((deg / 2) * Math.PI / 180);

/** Point p inside the cone from origin o along unit dir d, range r, full angle deg. */
export function inCone(o, d, r, deg, p, pad = 0) {
  const dx = p.x - o.x, dz = p.z - o.z, l = len(dx, dz);
  if (l > r + pad) return false;
  if (l < 1e-6) return true;
  return (dx * d[0] + dz * d[1]) / l >= cosHalf(deg) - 1e-9 || l <= pad;
}

/** Closest point on segment a-b to p, with the parameter t in [0,1]. */
export function closestOnSeg(a, b, p) {
  const abx = b[0] - a[0], abz = b[1] - a[1];
  const l2 = abx * abx + abz * abz;
  const t = l2 > 0 ? clamp(((p.x - a[0]) * abx + (p.z - a[1]) * abz) / l2, 0, 1) : 0;
  return { x: a[0] + abx * t, z: a[1] + abz * t, t };
}

/** Distance from p to the line segment (for the 'line' telegraph shape). */
export function distToSeg(a, b, p) { const c = closestOnSeg(a, b, p); return len(p.x - c.x, p.z - c.z); }

/** Shape test for telegraphs and area Moves. A hit never exceeds its drawn shape (Combat §3.12). */
export function inShape(shape, p, pad = 0) {
  switch (shape.type) {
    case 'cone': return inCone({ x: shape.origin[0], z: shape.origin[1] }, shape.dir, shape.range, shape.angle_deg, p, pad);
    case 'circle': return len(p.x - shape.center[0], p.z - shape.center[1]) <= shape.radius + pad;
    case 'line': {
      const a = shape.origin, b = [a[0] + shape.dir[0] * shape.length, a[1] + shape.dir[1] * shape.length];
      return distToSeg(a, b, p) <= shape.width / 2 + pad;
    }
    case 'self': return false;
    default: return false;
  }
}
