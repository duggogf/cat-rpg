// PROTOTYPE - NOT FOR PRODUCTION
// Territory visuals for the street (territory-management.md §3.2 DR-47, hud.md §3.2, art bible §6.2 / §10.8):
//   - wisps: 1-4 drawn curling ribbons in the owning Clowder's colour with a Cream rim above each Scent Post,
//     baked from the kit's scentWisps(); thin and droop below Strong; swap drawings on twos; brighter in Whisker Sense
//   - pops: the Spray's sparkle cloud and pop (never liquid); a smaller puff for an Over-mark
//   - Rub Marks (Clowder emblem glyphs) and the Keeper's scent trail: shown only in Whisker Sense
//   - the Head Home thread: a bell-gold ribbon with a Cream rim and Ink edge, flowing toward home
//   - the scent compass ring on the ground around Mikan with up to 6 ticks (hud.md §3.2 priority)
// All inked VFX are flat (no glow) and draw in the late pass, after the paint post (crisp).
import * as THREE from 'three';
import { Kit } from './vfx/sprites.js';
import { CLOWDER } from '../world/territory.js';
import { U } from './env.js';

const C = Kit.C;
async function raster(svgInner, w, h, view) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${view || `0 0 ${w} ${h}`}" width="${w}" height="${h}" overflow="visible">${Kit.defs()}${svgInner}</svg>`;
  const img = new Image(); img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg); await img.decode();
  const cv = document.createElement('canvas'); cv.width = w; cv.height = h; cv.getContext('2d').drawImage(img, 0, 0, w, h);
  return cv;
}
const tex = (cv) => { const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.NoColorSpace; t.anisotropy = 4; return t; };
export const GLYPH = {
  crown: (c = C.gold) => `<path d="M-16 8L-18 -10L-8 -2L0 -14L8 -2L18 -10L16 8Z" fill="${c}" stroke="${C.ink}" stroke-width="2.6" stroke-linejoin="round"/><path d="M-12 14h24" stroke="${C.ink}" stroke-width="2.6" stroke-linecap="round"/><circle cx="-9" cy="17" r="2.4" fill="${C.ink}"/><circle cx="0" cy="18" r="2.4" fill="${C.ink}"/><circle cx="9" cy="17" r="2.4" fill="${C.ink}"/>`,
  stake: (c = CLOWDER.outsider.color) => `<path d="M-4 16V-16" stroke="${C.ink}" stroke-width="3.5" stroke-linecap="round"/><path d="M-4 -16L16 -10L-4 -3Z" fill="${c}" stroke="${C.ink}" stroke-width="2.5" stroke-linejoin="round"/>`,
  cracked: () => `<path d="M-6 16q-11 -9 0 -17q11 -8 1 -17" fill="none" stroke="${C.ink}" stroke-width="8" stroke-linecap="round"/><path d="M-6 16q-11 -9 0 -17q11 -8 1 -17" fill="none" stroke="${C.gold}" stroke-width="4.5" stroke-linecap="round"/><path d="M2 -4l6 -3l-2 6l7 -2" fill="none" stroke="${C.ink}" stroke-width="2.4" stroke-linejoin="round"/>`,
  sparkle: () => Kit.sparkle({ x: 0, y: 0, r: 15, fill: C.cream, lw: 2.6 }) + Kit.sparkle({ x: 12, y: -11, r: 6, fill: C.gold, lw: 2 }),
  bell: () => `<circle r="14" fill="${C.gold}" stroke="${C.ink}" stroke-width="2.6"/><path d="M-8 3H8M0 3V11" fill="none" stroke="${C.ink}" stroke-width="2.6"/><circle cx="-5" cy="-6" r="3" fill="${C.cream}"/>`,
  brick: (c = C.sage) => `<path d="M-16 -11h32v22h-32z" fill="${c}" stroke="${C.ink}" stroke-width="2.6" stroke-linejoin="round"/><path d="M-16 0h32M0 -11v11M-8 0v11M8 0v11" fill="none" stroke="${C.ink}" stroke-width="2.6"/>`,
};

export async function bakeScent() {
  const T = { wisps: {}, pops: [], puffs: [], glyph: {} };
  const keys = { wallSitters: C.sage, bell: C.gold, outsider: CLOWDER.outsider.color };
  await Promise.all(Object.entries(keys).map(async ([k, col]) => {
    T.wisps[k] = [];
    for (let n = 1; n <= 4; n++) {
      T.wisps[k][n] = await Promise.all([0, 1].map(async (f) => tex(await raster(Kit.scentWisps({ x: 128, y: 250, count: n, h: 190, color: col, seed: 4 + f * 7 + n }), 256, 256))));
    }
  }));
  for (let i = 0; i < 4; i++) {
    const R = Kit.rng(91 + i); let s = Kit.dustCloud({ x: 128, y: 150, r: 46 + i * 10, puffs: 6, seed: 3 + i, lw: 4 });
    for (let k = 0; k < 5; k++) { const a = R() * 6.28, d = 60 + i * 14 + R() * 20; s += Kit.sparkle({ x: 128 + Math.cos(a) * d, y: 140 + Math.sin(a) * d * 0.8, r: 9 + R() * 9, fill: k % 2 ? C.gold : C.cream, lw: 3 }); }
    T.pops.push(tex(await raster(s, 256, 256)));
    T.puffs.push(tex(await raster(Kit.dustCloud({ x: 128, y: 140, r: 26 + i * 8, puffs: 5, seed: 11 + i, lw: 4 }), 256, 256)));
  }
  for (const [k, f] of Object.entries(GLYPH)) T.glyph[k] = await raster(`<g transform="translate(32 32)">${f()}</g>`, 64, 64);
  T.glyph.brickTex = tex(await raster(`<g transform="translate(64 64) scale(2.2)">${GLYPH.brick()}</g>`, 128, 128));
  T.glyph.bellTex = tex(await raster(`<g transform="translate(64 64) scale(2.2)">${GLYPH.bell()}</g>`, 128, 128));
  return T;
}

/* ---------------------------------------------------------------- shared shaders */
const CARD_VERT = /* glsl */`uniform float sway, time, droop; varying vec2 vUv;
  void main(){ vUv = uv; vec3 r = normalize(vec3(viewMatrix[0][0], 0.0, viewMatrix[2][0]));
    vec3 c = (modelMatrix * vec4(0.0, 0.0, 0.0, 1.0)).xyz; float sx = length(modelMatrix[0].xyz), sy = length(modelMatrix[1].xyz);
    float h = position.y + 0.5; vec2 p = position.xy * vec2(sx, sy * (1.0 - 0.18 * droop));
    p.x += (sin(time * 1.3 + c.x * 2.0) * 0.06 * sway + droop * 0.16 * h) * sy * h;   // slow curl; below Strong they lean and sag
    vec3 wp = c + r * p.x + vec3(0.0, p.y, 0.0); gl_Position = projectionMatrix * viewMatrix * vec4(wp, 1.0); }`;
const CARD_FRAG = /* glsl */`uniform sampler2D map; uniform float lift, gate, halftone, fade; varying vec2 vUv;
  float bb(vec2 p){ ivec2 i = ivec2(mod(p, 4.0)); int b[16] = int[16](0,8,2,10,12,4,14,6,3,11,1,9,15,7,13,5); return (float(b[i.y * 4 + i.x]) + 0.5) / 16.0; }
  void main(){ vec4 t = texture2D(map, vUv); if (t.a < 0.5) discard;
    if (gate < 0.999) { vec2 g = fract(gl_FragCoord.xy / 7.0) - 0.5; if (length(g) > gate * 0.72) discard; }   // halftone in/out, never an alpha fade
    if (fade < 0.999 && bb(gl_FragCoord.xy) > fade) discard;
    vec3 c = t.rgb; c = mix(c, min(c * 1.18, vec3(1.0)), lift);
    gl_FragColor = vec4(c, 1.0); }`;
const cardMat = (map, o = {}) => new THREE.ShaderMaterial({
  uniforms: { map: { value: map }, time: U.time, sway: { value: o.sway ?? 1 }, droop: { value: 0 }, lift: { value: 0 }, gate: { value: o.gate ?? 1 }, halftone: { value: 0 }, fade: { value: 1 } },
  vertexShader: CARD_VERT, fragmentShader: CARD_FRAG, side: THREE.DoubleSide,
});

/** Screen-width ribbon along a polyline (the kit's 2D ribbon, drawn in 3D): colour core, Cream rim, Ink edge. */
const RIB_VERT = /* glsl */`attribute vec3 nextP; attribute float side; attribute float along; uniform float widthM, minPx, rtH, rtW; varying float vSide; varying float vAlong;
  void main(){ vec4 a = projectionMatrix * viewMatrix * vec4(position, 1.0), b = projectionMatrix * viewMatrix * vec4(nextP, 1.0);
    vec2 res = vec2(rtW, rtH); vec2 sa = a.xy / max(a.w, 1e-3) * res, sb = b.xy / max(b.w, 1e-3) * res; vec2 d = normalize(sb - sa + 1e-5); vec2 n = vec2(-d.y, d.x);
    float px = max(minPx, widthM * projectionMatrix[1][1] * rtH * 0.5 / max(a.w, 1e-3));
    a.xy += n * side * px / res * a.w; vSide = side; vAlong = along; gl_Position = a; }`;
const RIB_FRAG = /* glsl */`uniform vec3 color, rim, ink; uniform float time, flow, dash, gate, rimW; varying float vSide; varying float vAlong;
  void main(){ if (gate < 0.999) { vec2 g = fract(gl_FragCoord.xy / 7.0) - 0.5; if (length(g) > gate * 0.72) discard; }
    if (dash > 0.0 && fract((vAlong - time * flow) / dash) > 0.62) discard;
    float s = abs(vSide); vec3 c = s > 1.0 - rimW * 0.45 ? ink : (s > 1.0 - rimW ? rim : color); gl_FragColor = vec4(c, 1.0); }`;
export function ribbonMesh(pts, o = {}) {
  const g = new THREE.BufferGeometry(); const ribMat = new THREE.ShaderMaterial({
    uniforms: { color: { value: new THREE.Color(o.color || C.gold) }, rim: { value: new THREE.Color(C.cream) }, ink: { value: new THREE.Color(C.ink) }, time: U.time,
      flow: { value: o.flow ?? 0.8 }, dash: { value: o.dash ?? 0 }, gate: { value: 1 }, rimW: { value: o.rimW ?? 0.42 }, widthM: { value: o.width ?? 0.05 }, minPx: { value: o.minPx ?? 4 }, rtH: { value: 1080 }, rtW: { value: 1920 } },
    vertexShader: RIB_VERT, fragmentShader: RIB_FRAG, side: THREE.DoubleSide,
  });
  // colours arrive as raw sRGB like every other inked material
  for (const k of ['color', 'rim', 'ink']) { const c = ribMat.uniforms[k].value; c.copy(new THREE.Color().setStyle(k === 'color' ? (o.color || C.gold) : k === 'rim' ? C.cream : C.ink, THREE.NoColorSpace)); }
  const m = new THREE.Mesh(g, ribMat); m.frustumCulled = false; m.userData.setPts = (P) => setRibbon(g, P); setRibbon(g, pts); return m;
}
function setRibbon(g, P) {
  const pos = [], nxt = [], side = [], along = [], idx = []; let L = 0;
  for (let i = 0; i < P.length; i++) {
    const p = P[i], q = P[Math.min(P.length - 1, i + 1)], pr = P[Math.max(0, i - 1)];
    const n = i === P.length - 1 ? [p[0] + (p[0] - pr[0]), p[1] + (p[1] - pr[1]), p[2] + (p[2] - pr[2])] : q;
    if (i) L += Math.hypot(p[0] - pr[0], p[1] - pr[1], p[2] - pr[2]);
    for (const s of [-1, 1]) { pos.push(...p); nxt.push(...n); side.push(s); along.push(L); }
    if (i < P.length - 1) { const k = i * 2; idx.push(k, k + 1, k + 2, k + 1, k + 3, k + 2); }
  }
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute('nextP', new THREE.Float32BufferAttribute(nxt, 3));
  g.setAttribute('side', new THREE.Float32BufferAttribute(side, 1)); g.setAttribute('along', new THREE.Float32BufferAttribute(along, 1)); g.setIndex(idx);
  g.attributes.position.needsUpdate = true;
}

export class ScentLayer {
  constructor(scene, L, terr, T, groundY) {
    this.scene = scene; this.L = L; this.terr = terr; this.T = T; this.gy = groundY; this.t = 0; this.sense = 0;
    this.posts = []; this.pops = []; this.ribbons = [];
    for (const p of L.patches) {
      const m = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), cardMat(T.wisps.wallSitters[1][0]));
      m.position.set(p.post[0], p.post[1] + 0.62, p.post[2]); m.scale.set(0.95, 0.95, 1); m.frustumCulled = false; m.renderOrder = 4; m.name = 'wisps-' + p.id;
      scene.add(m); this.posts.push({ id: p.id, mesh: m, base: m.position.clone() });
      for (const [k, [x, y, z, face]] of p.rub.entries()) {   // Rub Marks: emblem glyphs flat on the wall base, Whisker Sense only
        const g = new THREE.Mesh(new THREE.PlaneGeometry(0.22, 0.22), cardMat(T.glyph.brickTex, { gate: 0, sway: 0 }));
        g.material.vertexShader = /* glsl */`varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0); }`;
        g.position.set(x + (face === "+x" ? 0.01 : -0.01), y + this.gy(z), z); g.rotation.y = face === '+x' ? Math.PI / 2 : -Math.PI / 2; g.name = `rub-${p.id}-${k}`; g.userData.rub = { patch: p.id, k };
        scene.add(g); this.ribbons.push({ mesh: g, sense: true, glyph: true, patch: p.id });
      }
    }
    // the Laundry Pole Yard Keeper's scent trail: post -> wall base -> up onto the coping -> along to the High Perch
    const trail = [[0.6, 0.08, -2.05], [-0.4, 0.06, -2.6], [-1.45, 0.06, -3.1], [-1.55, 0.7, -3.4], [-1.62, 1.6, -3.7], [-1.7, 1.62, -4.6], [-1.7, 1.62, -6.0], [-1.7, 1.66, -8.0]];
    const tr = ribbonMesh(trail, { color: C.sage, width: 0.05, dash: 0.32, flow: 0.35, minPx: 4 }); tr.name = 'trail-LPY'; scene.add(tr); this.ribbons.push({ mesh: tr, sense: true, patch: 'LPY' });
    // Head Home thread (hidden until shown)
    this.thread = ribbonMesh([[0, 0.2, 0], [0, 0.2, -1]], { color: C.gold, width: 0.045, dash: 0.6, flow: 1.4, minPx: 5 }); this.thread.visible = false; this.thread.name = 'homeThread'; scene.add(this.thread);
    // compass ring
    this.ringCv = document.createElement('canvas'); this.ringCv.width = this.ringCv.height = 512; this.ringTex = tex(this.ringCv);
    const rg = new THREE.PlaneGeometry(2.3, 2.3); rg.rotateX(-Math.PI / 2);
    this.ring = new THREE.Mesh(rg, new THREE.MeshBasicMaterial({ map: this.ringTex, transparent: true, depthWrite: false })); this.ring.renderOrder = 5; this.ring.visible = false; this.ring.name = 'compass'; scene.add(this.ring);
  }
  setRT(w, h) { for (const m of [this.thread, ...this.ribbons.map((r) => r.mesh)]) if (m.material.uniforms.rtH) { m.material.uniforms.rtH.value = h; m.material.uniforms.rtW.value = w; } }
  /** A Spray (big sparkle cloud + pop) or an Over-mark (small puff) at a point, drawn on twos. */
  pop(at, big) {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), cardMat((big ? this.T.pops : this.T.puffs)[0], { sway: 0 }));
    m.position.copy(at); m.scale.setScalar(big ? 1.3 : 0.6); m.frustumCulled = false; m.renderOrder = 6; this.scene.add(m);
    this.pops.push({ m, t: 0, big, frames: big ? this.T.pops : this.T.puffs });
  }
  update(dt, ctx) {
    this.t += dt; const sk = ctx.sense; this.sense = sk;
    for (const p of this.posts) {
      const st = this.terr.patch(p.id), n = Math.max(1, st.wisps), key = st.owner || 'wallSitters', mat = p.mesh.material;
      p.mesh.visible = st.wisps > 0;
      mat.uniforms.map.value = this.T.wisps[key][n][Math.floor(this.t * 6) % 2];   // on twos (12 fps drawings, two drawings)
      mat.uniforms.droop.value = st.scent < 60 ? 1 : 0; mat.uniforms.lift.value = sk; mat.uniforms.fade.value = ctx.fadeOf ? ctx.fadeOf(p.id) : 1;
      p.mesh.scale.set(0.8 + 0.06 * n, (0.8 + 0.06 * n) * (st.scent < 60 ? 0.85 : 1), 1);
    }
    for (const r of this.ribbons) {
      const gate = r.sense ? sk : 1, m = r.mesh.material.uniforms; m.gate.value = gate; r.mesh.visible = gate > 0.02;
      if (r.glyph && r.patch) { const st = this.terr.patch(r.patch); m.map.value = st.owner === 'bell' ? this.T.glyph.bellTex : this.T.glyph.brickTex; }
    }
    for (const q of this.pops) {
      q.t += dt; const f = Math.floor(q.t * 12);   // twos
      if (f >= q.frames.length + 1) { this.scene.remove(q.m); q.m.geometry.dispose(); q.m.material.dispose(); q.dead = true; continue; }
      q.m.material.uniforms.map.value = q.frames[Math.min(q.frames.length - 1, f)]; q.m.material.uniforms.gate.value = f >= q.frames.length ? 0.45 : 1;
      q.m.position.y += dt * (q.big ? 0.35 : 0.2);
    }
    this.pops = this.pops.filter((q) => !q.dead);
    // thread
    if (ctx.thread) { this.thread.visible = true; this.thread.userData.setPts(ctx.thread); this.thread.material.uniforms.gate.value = ctx.threadGate ?? 1; }
    else this.thread.visible = false;
    // compass
    this.ring.visible = sk > 0.05;
    if (this.ring.visible) { this.ring.position.set(ctx.mikan.x, ctx.mikan.y + 0.02, ctx.mikan.z); this.drawRing(ctx.ticks || [], ctx.mikan, sk); }
  }
  drawRing(ticks, at, k) {
    const g = this.ringCv.getContext('2d'), S = 512, c = S / 2, R = S * 0.39; g.clearRect(0, 0, S, S);
    g.globalAlpha = Math.min(1, k * 1.4);
    g.lineWidth = 9; g.strokeStyle = C.ink; g.setLineDash([18, 14]); g.beginPath(); g.arc(c, c, R, 0, Math.PI * 2); g.stroke();
    g.lineWidth = 5; g.strokeStyle = C.cream; g.beginPath(); g.arc(c, c, R, 0, Math.PI * 2); g.stroke(); g.setLineDash([]);
    for (const t of ticks.slice(0, 6)) {
      const dx = t.x - at.x, dz = t.z - at.z, l = Math.hypot(dx, dz) || 1, x = c + dx / l * R, y = c + dz / l * R, img = this.T.glyph[t.kind], s = t.kind === 'crown' ? 96 : 72;
      if (img) g.drawImage(img, x - s / 2, y - s / 2, s, s);
    }
    this.ringTex.needsUpdate = true;
  }
}
