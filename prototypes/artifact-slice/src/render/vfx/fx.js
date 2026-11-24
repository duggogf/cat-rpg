// PROTOTYPE - NOT FOR PRODUCTION (Cat RPG artifact showcase slice; throwaway, see README.md)
// World-space combat VFX (art bible §10.2–§10.6; Combat §3.17): billboarded kit drawings on twos (sparks,
// bursts, slash arcs, dust, glyphs, Frazzle orbits, sweat drops, hiss bursts), and ground decals drawn by
// one procedural shader (telegraphs that grow across the windup, the controlled cat's ring, the Frazzled
// countdown ring with pips, the Paw-fill disc, ground cracks and scratch lines).
// Caps (Combat §3.17 rule 5): 4 glyph bursts / 20 glyphs, 60 dust puffs; telegraph decals draw above dust;
// nothing covers the controlled cat (the scene re-draws it on top of this layer).
import * as THREE from 'three';
import { billboardMat } from './sprites.js';

const TWO = 1 / 30;  // one drawing = two 60 Hz frames
const hexV = (h) => { const n = parseInt(h.slice(1), 16); return new THREE.Vector3(((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255); };
const SPARK = { claw: 'sparkClaw', thump: 'sparkThump', yowl: 'sparkYowl' };
const BURST = { claw: 'burstClaw', thump: 'burstThump', yowl: 'burstYowl' };

/* ------------------------------------------------------------------ ground decal shader */
const decalVert = /* glsl */`varying vec2 vL; void main(){ vL = position.xy * vec2(length(modelMatrix[0].xyz), length(modelMatrix[1].xyz)); gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`;
const decalFrag = /* glsl */`
  uniform int kind;          // 0 circle tele, 1 cone tele, 2 line tele, 3 ring (controlled), 4 frazzle ring, 5 tag ring
  uniform int cls;           // telegraph class 0 white 1 yellow 2 red
  uniform float fill, R, ang, len, wid, pips, pipsMax, t;
  uniform vec3 colA, colB;
  varying vec2 vL;
  const vec3 INK = vec3(0.2, 0.153, 0.231), CREAM = vec3(1.0, 0.965, 0.89), MAG = vec3(1.0, 0.239, 0.545), WHITE = vec3(1.0);
  float hatch(vec2 p){ return step(0.78, fract((p.x + p.y) * 7.0)); }
  float dots(vec2 p, float k){ vec2 g = fract(p * 9.0) - 0.5; return step(length(g), k); }
  void main(){
    vec2 p = vL; float px = fwidth(p.x) + fwidth(p.y);
    vec3 col; float a = 0.0;
    if (kind <= 2) {
      // signed distance d (<0 inside) and the growth coordinate g (0 at the attacker .. 1 at full reach)
      float d, g;
      if (kind == 0) { d = length(p) - R; g = length(p) / R; }
      else if (kind == 1) { float r = length(p); float th = abs(atan(p.x, p.y)); d = max(r - R, (th - ang) * r); d = max(d, -r); g = r / R; }
      else { d = max(abs(p.x) - wid * 0.5, max(-p.y, p.y - len)); g = p.y / len; }
      float lw = 0.06;
      if (cls == 2) { // red: magenta fill, zigzag edge, ink hatching
        float zz = 0.07 * abs(fract(atan(p.y, p.x) * 6.0 + (kind == 2 ? p.y * 3.0 : 0.0)) - 0.5);
        float dz = d + zz;
        if (dz > lw) discard;
        if (dz > 0.0) { col = INK; }
        else { bool grown = g <= fill; col = grown ? (hatch(p) > 0.5 ? INK : MAG) : mix(MAG, CREAM, 0.55); if (!grown && hatch(p * 0.5) > 0.5) col = MAG; }
      } else if (cls == 1) { // yellow: Paper Cream dashed outline over an ink under-stroke, no fill; the grown part gets a thin cream line
        float per = kind == 0 ? atan(p.y, p.x) * R : (p.x + p.y);
        float dash = step(0.38, fract(per * 2.2));
        if (abs(d) < lw * 1.6) { col = abs(d) < lw * 0.8 ? (dash > 0.5 ? CREAM : INK) : INK; if (dash < 0.5 && abs(d) >= lw * 0.8) discard; }
        else if (d < 0.0 && abs(g - fill) < 0.035 && fill < 0.999) col = CREAM;
        else discard;
      } else { // white: 35% halftone white fill, ink rim, chevrons pointing outward
        if (d > lw) discard;
        if (d > -0.0) col = INK;
        else {
          bool grown = g <= fill; float ch = 0.0;
          float cg = fract(g * 3.0); float lat = kind == 0 ? 0.0 : (kind == 1 ? atan(p.x, p.y) * 2.0 : p.x * 1.6);
          if (kind != 0 && abs(cg - 0.55 + abs(lat) * 0.6) < 0.07) ch = 1.0;
          if (!grown) { if (dots(p, 0.18) < 0.5) discard; col = WHITE; }
          else col = ch > 0.5 ? INK : (dots(p, 0.33) > 0.5 ? WHITE : mix(WHITE, CREAM, 0.0));
          if (grown && dots(p, 0.33) < 0.5 && ch < 0.5) discard;
        }
      }
      gl_FragColor = vec4(col, 1.0); return;
    }
    float r = length(p);
    if (kind == 3) { // controlled-cat ground ring: Bell-Gold ring, ink edges, four tick notches
      float d = abs(r - R);
      float tick = 0.0; float an = atan(p.y, p.x); float q = abs(fract(an / 6.2831853 * 4.0 + 0.125) - 0.5);
      if (q < 0.035 && r > R && r < R + 0.11) tick = 1.0;
      if (d < 0.028) col = colA; else if (d < 0.05 || tick > 0.5) col = INK; else discard;
      gl_FragColor = vec4(col, 1.0); return;
    }
    if (kind == 4) { // Frazzled window: magenta countdown ring (clockwise drain) + pips
      float an = fract(atan(p.x, -p.y) / 6.2831853 + 1.0);
      float d = abs(r - R);
      if (pipsMax > 0.0) {
        for (int i = 0; i < 5; i++) { if (float(i) >= pipsMax) break; float pa = (float(i) + 0.5) / pipsMax * 6.2831853; vec2 c = vec2(sin(pa), -cos(pa)) * R; float dd = length(p - c);
          if (dd < 0.075) { gl_FragColor = vec4(float(i) < pips ? (dd < 0.05 ? MAG : INK) : (dd < 0.05 ? CREAM : INK), 1.0); return; } }
      }
      if (d < 0.07) { col = d < 0.045 ? (an <= fill ? MAG : CREAM) : INK; gl_FragColor = vec4(col, 1.0); return; }
      discard;
    }
    if (kind == 5) { // Tag-In spark ring: a Bell-Gold ring with spikes popping outward
      float an = atan(p.y, p.x); float spike = 0.12 * step(0.5, fract(an * 12.0 / 6.2831853));
      float d = abs(r - R - spike * 0.5);
      if (d < 0.04 + spike * 0.25) col = d < 0.025 + spike * 0.2 ? colA : INK; else discard;
      gl_FragColor = vec4(col, 1.0); return;
    }
    discard;
  }`;

function decal(kind, o = {}) {
  const u = { kind: { value: kind }, cls: { value: 0 }, fill: { value: 1 }, R: { value: o.R || 1 }, ang: { value: 0.5 }, len: { value: 1 }, wid: { value: 1 }, pips: { value: 0 }, pipsMax: { value: 0 }, t: { value: 0 },
    colA: { value: hexV(o.colA || '#F2B01E') }, colB: { value: hexV('#FFF6E3') } };
  const m = new THREE.ShaderMaterial({ uniforms: u, vertexShader: decalVert, fragmentShader: decalFrag, extensions: { derivatives: true }, depthWrite: false,
    polygonOffset: true, polygonOffsetFactor: -4, polygonOffsetUnits: -8 });
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), m);
  mesh.rotation.x = -Math.PI / 2; mesh.frustumCulled = false; mesh.renderOrder = 5;
  return mesh;
}

export class WorldFX {
  constructor(tex, scene, decalScene) {
    this.tex = tex; this.scene = scene; this.decals = decalScene;
    this.items = []; this.pool = []; this.tele = new Map(); this.orbits = new Map();
    this.ring = decal(3, { R: 0.48 }); this.ring.position.y = 0.012; decalScene.add(this.ring);
    this.fzRings = new Map(); this.tagRings = [];
  }

  /** Spawn a billboard drawing sequence. o: {name, pos, size (m), frames (drawings shown), hold (drawings), rot, vel, grow, dissolve, delay} */
  spawn(name, pos, o = {}) {
    const list = this.tex[name]; if (!list) return null;
    const dust = name.startsWith('puff');
    const nDust = this.items.filter((i) => i.dust).length, nGlyph = this.items.filter((i) => i.glyph).length;
    if (dust && nDust >= 60) return null;
    if (o.glyph && nGlyph >= 20) return null;
    let mesh = this.pool.pop();
    if (!mesh) { mesh = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), billboardMat(list[0])); mesh.frustumCulled = false; }
    mesh.material.uniforms.map.value = list[0]; mesh.material.uniforms.dissolve.value = 0; mesh.material.uniforms.flatCol.value.set(0, 0, 0, 0);
    mesh.position.copy(pos || (o.follow ? o.follow() : new THREE.Vector3())); mesh.scale.setScalar(o.size || 0.5); mesh.renderOrder = o.order || (dust ? 1 : 3);
    this.scene.add(mesh);
    const it = { mesh, list, name, t: -(o.delay || 0), drawings: o.drawings || 4, size: o.size || 0.5, rot: o.rot || 0, spin: o.spin || 0, vel: o.vel ? o.vel.clone() : null, grow: o.grow || 0,
      cycle: o.cycle !== false, dust, glyph: !!o.glyph, follow: o.follow || null, flat: o.flat || null, breakAt: o.breakAt ?? Math.max(0.5, 1 - 2 / (o.drawings || 4)), start: 0 };
    mesh.visible = it.t >= 0;
    mesh.material.uniforms.rot.value = it.rot;
    this.items.push(it);
    return it;
  }

  /** Dust per the tier table: '2 puffs' | '3-puff ring' | '5-puff ring' | 'ring plus trail' | 'ring plus crack decal' | cloud */
  dust(kind, at, dir) {
    if (!kind) return;
    const n = kind.startsWith('2') ? 2 : kind.startsWith('3') ? 3 : kind.startsWith('5') ? 5 : kind.startsWith('ring') ? 6 : 8;
    const big = n >= 6 ? 1.3 : 1;
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2 + 0.4, r = 0.28 * big;
      const p = new THREE.Vector3(at.x + Math.cos(a) * r, 0.1, at.z + Math.sin(a) * r);
      this.spawn(i % 2 ? 'puffSmall' : 'puff', p, { size: (0.32 + (i % 3) * 0.06) * big, drawings: 6, vel: new THREE.Vector3(Math.cos(a) * 0.9, 0.35, Math.sin(a) * 0.9), grow: 0.5 });
    }
    if (kind.includes('trail') && dir) for (let i = 1; i <= 3; i++) this.spawn('puffSmall', new THREE.Vector3(at.x - dir[0] * 0.35 * i, 0.08, at.z - dir[1] * 0.35 * i), { size: 0.34 - i * 0.06, drawings: 7, delay: i * TWO });
    if (kind.includes('crack')) this.groundMark('crack', at, 1.1, 0.9);
  }

  /** Flat drawing lying on the ground (crack, scratch lines), shown for `life` seconds then dissolving. */
  groundMark(name, at, size, life, yaw = 0) {
    const list = this.tex[name]; if (!list) return;
    const m = new THREE.Mesh(new THREE.PlaneGeometry(size, size), new THREE.ShaderMaterial({
      uniforms: { map: { value: list[0] }, dissolve: { value: 0 } },
      vertexShader: /* glsl */`varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
      fragmentShader: /* glsl */`uniform sampler2D map; uniform float dissolve; varying vec2 vUv; void main(){ vec4 c = texture2D(map, vUv); if (c.a < 0.5) discard; vec2 g = fract(gl_FragCoord.xy / 7.0) - 0.5; if (dissolve > 0.0 && length(g) < dissolve * 0.75) discard; gl_FragColor = vec4(c.rgb, 1.0); }`,
      depthWrite: false, polygonOffset: true, polygonOffsetFactor: -3, polygonOffsetUnits: -6 }));
    m.rotation.set(-Math.PI / 2, 0, yaw); m.position.set(at.x, 0.01, at.z); m.renderOrder = 2;
    this.decals.add(m);
    this.items.push({ ground: true, mesh: m, t: 0, life, list });
  }

  tagRing(at) { const d = decal(5, { R: 0.4 }); d.scale.setScalar(1.4); d.position.set(at.x, at.y + 0.02, at.z); this.decals.add(d); this.tagRings.push({ d, t: 0 }); }

  /** Per-frame: telegraphs from the snapshot, Frazzle rings, orbits; advance drawings on twos. */
  update(dt, tw, s, fighters, controlledId) {
    // telegraph decals (stateless: drawn from the snapshot)
    const seen = new Set();
    for (const tl of s.telegraphs) {
      seen.add(tl.id);
      let d = this.tele.get(tl.id);
      const sh = tl.shape, kind = sh.type === 'circle' ? 0 : sh.type === 'cone' ? 1 : sh.type === 'line' ? 2 : -1;
      if (kind < 0) continue;
      if (!d) { d = decal(kind); this.decals.add(d); this.tele.set(tl.id, d); d.renderOrder = 6; }
      const u = d.material.uniforms; u.cls.value = { white: 0, yellow: 1, red: 2 }[tl.cls] ?? 0;
      u.fill.value = Math.ceil(Math.min(1, tl.fill ?? tl.t / tl.dur) * 15) / 15;   // grows on twos-ish steps
      if (kind === 0) { u.R.value = sh.radius; d.position.set(sh.center[0], 0.015, sh.center[1]); d.scale.setScalar(sh.radius + 0.12); d.rotation.set(-Math.PI / 2, 0, 0); }
      else {
        const L = kind === 1 ? sh.range : sh.length, yaw = Math.atan2(sh.dir[0], sh.dir[1]);
        u.R.value = L; u.len.value = L; u.wid.value = sh.width || 1; u.ang.value = (sh.angle_deg || 60) * Math.PI / 360;
        const half = kind === 1 ? L + 0.12 : Math.max(L, sh.width || 1) + 0.12;
        d.position.set(sh.origin[0], 0.016, sh.origin[1]); d.scale.setScalar(half);
        // plane local +Y must map to the shape's forward on the ground: rotate around world Y after laying flat
        // Euler YXZ = Ry * Rx: local +Y -> (lay flat) world -Z -> (yaw + PI) the shape's forward on the ground
        d.rotation.order = 'YXZ'; d.rotation.set(-Math.PI / 2, yaw + Math.PI, 0);
      }
    }
    for (const [id, d] of this.tele) if (!seen.has(id)) { this.decals.remove(d); d.material.dispose(); this.tele.delete(id); }

    // controlled-cat ring
    const cf = fighters.get(controlledId);
    if (cf && cf.root.visible) { this.ring.visible = true; this.ring.position.set(cf.pos.x, cf.pos.y + 0.012, cf.pos.z); const R = 0.46 * cf.scaleK + 0.04; this.ring.scale.setScalar(R + 0.2); this.ring.material.uniforms.R.value = R; }
    else this.ring.visible = false;

    // Frazzled rings and orbits
    for (const e of s.entities) {
      const f = fighters.get(e.id); if (!f) continue;
      const fz = e.frazzled_s > 0 && f.root.visible && s.mode !== 'pileon';
      let r = this.fzRings.get(e.id);
      if (fz) {
        if (!r) { r = { ring: decal(4, { R: 0.9 }), orbit: null }; this.decals.add(r.ring); this.fzRings.set(e.id, r); }
        const big = e.rank === 'captain' || e.rank === 'boss';
        const u = r.ring.material.uniforms; const RR = 0.55 * f.scaleK + 0.2; u.R.value = RR; u.fill.value = Math.ceil(Math.min(1, e.frazzled_s / 6) * 30) / 30;
        u.pipsMax.value = big ? 5 : 0; u.pips.value = e.pips || 0;
        r.ring.position.set(f.pos.x, f.pos.y + 0.014, f.pos.z); r.ring.scale.setScalar(RR + 0.2);
        if (!r.orbit || !this.items.includes(r.orbit)) r.orbit = this.spawn('orbit', f.head, { size: 0.75 * Math.max(1, f.scaleK * 0.8), drawings: 3, cycle: true, follow: () => f.head.clone().add(new THREE.Vector3(0, 0.12 * f.scaleK, 0)), breakAt: 9, order: 4 });
        if (r.orbit) r.orbit.keep = true;
      } else if (r) {
        this.decals.remove(r.ring); r.ring.material.dispose();
        if (r.orbit) { r.orbit.keep = false; r.orbit.t = r.orbit.drawings * TWO; }
        this.fzRings.delete(e.id);
      }
    }

    // billboards on twos
    for (const it of this.items) {
      it.t += dt;
      if (it.ground) {
        const k = it.t / it.life; it.mesh.material.uniforms.dissolve.value = k > 0.6 ? Math.ceil((k - 0.6) / 0.4 * 3) / 3 : 0;
        it.dead = k >= 1; continue;
      }
      const m = it.mesh; m.visible = it.t >= 0;
      if (it.t < 0) continue;
      const di = Math.floor(it.t / TWO);
      if (it.keep) { m.material.uniforms.map.value = it.list[di % it.list.length]; }
      else {
        m.material.uniforms.map.value = it.list[(it.cycle ? di : Math.min(di, it.list.length - 1)) % it.list.length];
        const k = di / it.drawings;
        m.material.uniforms.dissolve.value = k >= it.breakAt ? Math.min(1, (k - it.breakAt) / (1 - it.breakAt) + 0.25) : 0;
        if (di >= it.drawings) it.dead = true;
      }
      const tq = di * TWO;  // stepped motion
      if (it.follow) m.position.copy(it.follow());
      else if (it.vel) { m.position.copy(it.base || (it.base = m.position.clone())).addScaledVector(it.vel, tq); }
      m.scale.setScalar(it.size * (1 + it.grow * Math.min(1, tq * 3)));
      m.material.uniforms.rot.value = it.rot + it.spin * tq;
      if (it.flat) m.material.uniforms.flatCol.value.copy(it.flat);
    }
    for (const it of this.items) if (it.dead) {
      if (it.ground) { this.decals.remove(it.mesh); it.mesh.geometry.dispose(); it.mesh.material.dispose(); }
      else { this.scene.remove(it.mesh); this.pool.push(it.mesh); }
    }
    this.items = this.items.filter((i) => !i.dead);
    for (const r of this.tagRings) { r.t += dt; const k = Math.floor(r.t / TWO); r.d.material.uniforms.R.value = 0.4 + 0.15 * Math.min(k, 4); if (k >= 7) r.dead = true; }
    for (const r of this.tagRings) if (r.dead) { this.decals.remove(r.d); r.d.material.dispose(); }
    this.tagRings = this.tagRings.filter((r) => !r.dead);
  }

  /* ------------------------------------------------------------------ event recipes */
  /** A hit at `at` (contact point, world). hitType claw|thump|yowl; feel from the arbiter; dir = attacker->target ground unit. */
  hit(at, hitType, feel, dir, o = {}) {
    const tier = feel.tier, type = hitType === 'thump' ? 'thump' : hitType === 'yowl' ? 'yowl' : 'claw';
    const yaw2d = Math.atan2(-dir[1], dir[0]);
    if (o.blocked) { this.spawn('wedge', at, { size: 0.35, drawings: 3, glyph: true }); this.dust('2 puffs', at); return; }
    // spark (T1 0.3 m, 4 drawings; T2 x1.5) or burst (T3+)
    if (tier <= 2) this.spawn(SPARK[type], at, { size: tier === 2 ? 0.55 : 0.4, drawings: 4, rot: yaw2d * 0.3, cycle: false, glyph: true });
    if (tier >= 2) this.spawn(BURST[type], at, { size: tier >= 4 ? 1.25 : tier === 3 ? 0.95 : 0.6, drawings: tier >= 3 ? 5 : 3, rot: (o.seed || 0) * 0.7, cycle: false, order: 2 });
    // the Move's type drawing: slash arc / shockwave / sound arcs
    if (type === 'claw' && (tier >= 1 || o.player)) {
      const arc = o.finisher || tier >= 3 ? 'slashFlurry' : (o.stringIdx === 1 ? 'slashHigh' : 'slashLow');
      this.spawn(arc, at.clone().add(new THREE.Vector3(0, 0.05, 0)), { size: tier >= 3 ? 1.3 : o.finisher ? 1.05 : 0.8, drawings: 4, cycle: false, rot: o.facingRot || 0, breakAt: 0.5, order: 2 });
      if (tier >= 2) this.groundMark('scratch', at, 0.9, 0.5, -Math.atan2(dir[0], dir[1]));
    }
    if (type === 'thump' && tier >= 2) this.spawn('puff', new THREE.Vector3(at.x, 0.1, at.z), { size: 0.8, drawings: 5, grow: 1.2 });
    if (type === 'yowl' && tier >= 1) for (let i = 0; i < 2; i++) this.spawn('sparkYowl', at.clone().addScaledVector(new THREE.Vector3(dir[0], 0, dir[1]), 0.25 * i), { size: 0.5 + i * 0.2, drawings: 4, delay: i * TWO * 2 });
    // glyphs: T2 one glyph, T3 burst of 2-3
    const ng = tier === 2 ? 1 : tier === 3 ? 3 : tier >= 4 ? 3 : 0;
    const gnames = type === 'claw' ? ['claws', 'sparkle', 'sparkleCream'] : type === 'thump' ? ['sparkleCream', 'sparkle', 'paw'] : ['sparkle', 'spiral', 'sparkleCream'];
    for (let i = 0; i < ng; i++) {
      const a = (i / ng) * Math.PI * 1.2 + 0.3;
      this.spawn(gnames[i % 3], at.clone().add(new THREE.Vector3(Math.cos(a) * 0.35, 0.25 + Math.sin(a) * 0.2, Math.sin(a) * 0.2)), { size: tier >= 3 ? 0.3 : 0.24, drawings: 6, vel: new THREE.Vector3(Math.cos(a) * 0.8, 0.9, 0), glyph: true, delay: i * TWO });
    }
    this.dust(feel.dust, new THREE.Vector3(at.x, 0, at.z), dir);
    // T3 local impact disc: a Cream burst flash masked to <= 15% of the screen, 2 frames
    if (feel.impact === 'local_disc' && tier >= 3) this.spawn('burstPlain', at, { size: 1.5, drawings: 1, cycle: false, flat: new THREE.Vector4(1, 0.965, 0.89, 1), order: 2, breakAt: 9 });
  }
}
