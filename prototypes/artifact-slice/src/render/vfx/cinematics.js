// PROTOTYPE - NOT FOR PRODUCTION (Cat RPG artifact showcase slice; throwaway, see README.md)
// M1.1 cinematics (design/reviews/owner-feedback/combat-m1.1-spec.md §5–§6):
//  - STAGGER: zoom onto the staggered cat, a brief time slow, and a shattered-glass blink (soft pulses drawn by
//    the screen layer, never a strobe). Full for Captains, Bosses and the first stagger of a fight; light for Toughs.
//  - SPECIAL CHAIN: Mikan's Special cut-in (time stopped: the sim is held; a punch-in on Mikan; only Mikan renders
//    over an impact-frame background: a flat panel value-matched to the frame's mean luminance with full-field Ink
//    lines, entering behind a 3-drawing halftone wipe), then each crew cat in range with its own cut-in, then the
//    Team finisher (the existing Pile-On set-piece). ≈ 1 s per cut-in the first time in a fight, ≈ 0.5 s after.
import * as THREE from 'three';

const TWO = 1 / 30;
/** Per-cat ability colour (Spec §7) and Special name (the folded-in Zoomies, Combat §3.7). */
export const CAT_STYLE = {
  mikan: { col: '#F28C28', special: 'MIDNIGHT LAPS' }, hige: { col: '#3F9BE6', special: 'LANDSLIDE' },
  pon: { col: '#B9A0FF', special: 'MIDNIGHT ARIA' }, kinako: { col: '#5A9E4B', special: 'MIDNIGHT LAPS' },
  togemaru: { col: '#FFE14A', special: 'MIDNIGHT LAPS' }, kagi: { col: '#B9A0FF', special: 'MIDNIGHT ARIA' },
};
export const styleOf = (catId) => CAT_STYLE[catId] || { col: '#A8C878', special: 'SPECIAL' };
const SPECIAL_BY_STYLE = { Scrapper: 'MIDNIGHT LAPS', Bruiser: 'LANDSLIDE', Yowler: 'MIDNIGHT ARIA' };

const bgVert = /* glsl */`void main(){ gl_Position = vec4(position.xy, 0.0, 1.0); }`;
const bgFrag = /* glsl */`
  uniform vec3 panel, ink; uniform vec2 centre, res; uniform float wipe, seed, inner;
  float h(float n){ return fract(sin(n * 91.7 + seed * 13.1) * 43758.5453); }
  void main(){
    vec2 p = gl_FragCoord.xy;
    if (wipe < 3.0) { vec2 g = mod(p, 18.0) - 9.0; if (length(g) > (wipe + 1.0) * 3.0) discard; }
    vec2 d = p - centre; float r = length(d), m = min(res.x, res.y);
    float a = atan(d.y, d.x) / 6.2831853 * 64.0; float i = floor(a), f = fract(a);
    float r0 = m * inner * (0.75 + h(i + 7.0) * 0.6);
    float w = (0.08 + h(i) * 0.3) * clamp((r - r0) / (m * 0.9), 0.0, 1.0);
    vec3 c = abs(f - 0.5) < w ? ink : panel;
    gl_FragColor = vec4(c, 1.0);
  }`;

export class Cinematics {
  constructor({ renderer, cam, scr, lateScene, fGroup }) {
    this.renderer = renderer; this.cam = cam; this.scr = scr; this.late = lateScene; this.fGroup = fGroup;
    this.cutCam = new THREE.PerspectiveCamera(26, 1, 0.05, 50);
    this.bgMat = new THREE.ShaderMaterial({ uniforms: { panel: { value: new THREE.Color() }, ink: { value: new THREE.Color('#33273B') }, centre: { value: new THREE.Vector2() },
      res: { value: new THREE.Vector2(1920, 1080) }, wipe: { value: 3 }, seed: { value: 1 }, inner: { value: 0.3 } }, vertexShader: bgVert, fragmentShader: bgFrag, depthTest: false, depthWrite: false });
    this.bgScene = new THREE.Scene(); const q = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), this.bgMat); q.frustumCulled = false; this.bgScene.add(q);
    this.orth = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    this.chain = null; this.staggers = 0; this.chainsPlayed = 0;
  }

  /** Stagger on fighter f. full: the Captain / Boss / first-stagger version. Returns {dip, focus} for the entry. */
  stagger(f, full, t) {
    this.staggers++;
    this.scr.add({ kind: 'shatter', at: f.head.clone().add(new THREE.Vector3(0, -0.12, 0)), dur: full ? 0.5 : 0.3, full, seed: this.staggers });
    return { dip: { from: t, to: t + (full ? 0.42 : 0.22), scale: full ? 0.2 : 0.45 }, focus: { pt: f.head.clone(), from: t, until: t + (full ? 0.5 : 0.28), k: full ? 0.45 : 0.2 } };
  }

  /** Start the Special chain. cats: [{id, catId, style, f}] in order (Mikan first). onDone(): fires the Team finisher. */
  startChain(cats, mean, t, onDone) {
    const short = this.chainsPlayed > 0; this.chainsPlayed++;
    const per = short ? 0.5 : 1.0;
    this.chain = { cats, i: 0, t0: t, per, mean, onDone, seed: 3 + this.chainsPlayed, done: false };
    this.beginCut(t);
  }
  beginCut(t) {
    const C = this.chain, c = C.cats[C.i];
    c.f.impulse('hiss', t, { dur: C.per * 0.5 }); c.f.impulse('strike', t + C.per * 0.55, { mag: 1.6, dur: C.per * 0.4 });
    // panel: the cat's colour, scaled to the frame's mean luminance (art bible §10.4 panel luminance rule)
    const col = new THREE.Color(styleOf(c.catId).col); const lin = col.clone().convertSRGBToLinear();
    const L = 0.2126 * lin.r + 0.7152 * lin.g + 0.0722 * lin.b, k = Math.min(3, (C.mean || 0.4) / Math.max(0.02, L));
    lin.multiplyScalar(k); lin.r = Math.min(1, lin.r); lin.g = Math.min(1, lin.g); lin.b = Math.min(1, lin.b);
    this.panel = lin.convertLinearToSRGB();
    c.t0 = t;
    this.scr.add({ kind: 'cutin', dur: C.per, name: (c.special || styleOf(c.catId).special), who: c.name, col: styleOf(c.catId).col, idx: C.i, of: C.cats.length, fid: c.id });
  }
  /** M1.1 sim: one cut-in driven by the sim's SpecialCutIn event (the sim runs the chain on real time). */
  cutIn(c, dur, mean, t, first) {
    this.chain = { cats: [c], i: 0, t0: t, per: dur, mean, onDone: null, seed: 3 + this.chainsPlayed, external: true, first };
    if (first) this.chainsPlayed++;
    this.beginCut(t);
  }
  end() { this.chain = null; }
  get holding() { return !!this.chain; }
  /** Per frame (real time). Returns the active cut-in or null. */
  update(t) {
    const C = this.chain; if (!C) return null;
    const c = C.cats[C.i];
    if (C.external) { if (t - c.t0 >= C.per) { this.chain = null; return null; } return c; }
    if (t - c.t0 >= C.per) {
      C.i++;
      if (C.i >= C.cats.length) { const done = C.onDone; this.chain = null; if (done) done(); return null; }
      this.beginCut(t);
    }
    return C.cats[C.i];
  }
  /** Draw the cut-in frame: background quad (halftone wipe in over 3 drawings), then only the cat, close up. */
  render(c, t) {
    const R = this.renderer, C = this.chain, u = (t - c.t0);
    const drawn = Math.floor(u / TWO);
    const out = C.per - u < 2 * TWO;             // wipe out over 2 drawings
    const size = R.getDrawingBufferSize(new THREE.Vector2());
    const B = this.bgMat.uniforms; B.res.value.copy(size); B.panel.value.copy(this.panel);
    B.centre.value.set(size.x * 0.42, size.y * 0.5); B.seed.value = C.seed;
    B.wipe.value = (C.external ? C.first : C.i === 0) ? Math.min(3, drawn) : 3;
    if (out && C.i === C.cats.length - 1 && !C.external) B.wipe.value = Math.max(0, Math.floor((C.per - u) / TWO));
    R.autoClear = false; R.setRenderTarget(null); R.render(this.bgScene, this.orth);
    // close camera on the cat: from the front 3/4, a little low, slowly pushing in; a slight tilt is allowed behind the panel
    const f = c.f, fwd = new THREE.Vector3(Math.sin(f.yaw), 0, Math.cos(f.yaw)), right = new THREE.Vector3(fwd.z, 0, -fwd.x);
    const k = Math.min(1, u / C.per), dist = (2.3 - 0.35 * k) * f.scaleK;   // a slow push-in on a waist-up framing
    this.cutCam.aspect = size.x / size.y;
    this.cutCam.position.copy(f.head).addScaledVector(fwd, dist).addScaledVector(right, (c.idx % 2 ? -0.35 : 0.35) * f.scaleK).add(new THREE.Vector3(0, -0.1 * f.scaleK, 0));
    this.cutCam.up.set(Math.sin(0.12 * (c.idx % 2 ? -1 : 1)), Math.cos(0.12), 0).applyAxisAngle(new THREE.Vector3(0, 1, 0), f.yaw);
    this.cutCam.lookAt(f.head.clone().add(new THREE.Vector3(0, -0.14 * f.scaleK, 0)).addScaledVector(right, (c.idx % 2 ? 0.25 : -0.25) * f.scaleK));
    // (the camera's horizontal offset puts the cat right of centre, leaving the left for the name band)
    this.cutCam.updateProjectionMatrix(); this.cutCam.updateMatrixWorld();
    R.clearDepth();
    const vis = this.late.children.map((o) => o.visible); this.late.children.forEach((o) => { o.visible = o === this.fGroup; });
    const fv = this.fGroup.children.map((o) => o.visible); this.fGroup.children.forEach((o) => { o.visible = o === f.root; });
    const was = f.root.visible; f.root.visible = true;
    R.render(this.late, this.cutCam);
    f.root.visible = was;
    this.late.children.forEach((o, i) => { o.visible = vis[i]; }); this.fGroup.children.forEach((o, i) => { o.visible = fv[i]; });
    R.autoClear = true;
    this.cutScreen = this.cutCam;
  }
}
export { SPECIAL_BY_STYLE };
