// PROTOTYPE - NOT FOR PRODUCTION
// M0 cat look-dev lab -> dist/catlab.html
// Query: cast=both|mikan|wallSitter  view=front34|side|back34|back|front  angle=<deg cat yaw, overrides view>
//        gait=idle|walk  speed=<m/s>  t=<sim seconds to step before a single frame>  (no t = live loop)
//        cam=third|close  dist=<m>  h=<camera height m>  ol=<outline scale>  strip=1 (six tail carriages, flat black)
//        phase=day|dusk
import * as THREE from 'three';
import { loadCatAssets, createCatInternal, DAY_LIGHT } from '../render/cats/cat.js';

const q = new URLSearchParams(location.search);
const num = (k, d) => (q.has(k) ? parseFloat(q.get(k)) : d);
const app = document.getElementById('app');
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(q.has('res') ? parseFloat(q.get('res')) : 1); // res=0.85: dynamic-resolution check (canvas upscaled)
renderer.setSize(app.clientWidth || innerWidth, app.clientHeight || innerHeight);
renderer.toneMapping = THREE.NoToneMapping;
app.appendChild(renderer.domElement);
const W = renderer.domElement.width, H = renderer.domElement.height;
const scene = new THREE.Scene();
const strip = q.get('strip') === '1';
const turn = q.get('turn') === '1' || q.get('turn') === '4'; const turn4 = q.get('turn') === '4'; // front / side / back like the owner's turnaround sheet
const phase = q.get('phase') || 'day';
const PH = {
  day: { zen: '#3F9BE6', hor: '#A9DBF5', ground: '#C9BDA2', ground2: '#B9AC93', light: DAY_LIGHT },
  dusk: { zen: '#8E6FB0', hor: '#F7A45A', ground: '#B89A86', ground2: '#A88C7E',
    light: { keyDir: new THREE.Vector3(-0.8, 0.21, 0.3).normalize(), keyColor: new THREE.Color('#FFC27A'), shadeColor: new THREE.Color('#7A4E8C'), rimColor: new THREE.Color('#FFDDB5') } },
}[phase];

// ---- painted backdrop: sky gradient + a soft, unlined painted ground (no lighting on paint)
function canvasTex(w, h, draw) { const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t; }
if (strip || turn) scene.background = new THREE.Color().setStyle(turn ? '#F6ECD6' : '#FBF1DC', THREE.SRGBColorSpace);
else scene.background = canvasTex(4, 256, (g, w, h) => { const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, PH.zen); gr.addColorStop(0.75, PH.hor); gr.addColorStop(1, PH.hor); g.fillStyle = gr; g.fillRect(0, 0, w, h); });
const groundTex = canvasTex(1024, 1024, (g, w, h) => {
  g.fillStyle = strip ? '#EADBBB' : turn ? '#EDE0C4' : PH.ground; g.fillRect(0, 0, w, h);
  let s = 11; const r = () => ((s = (s * 16807) % 2147483647) / 2147483647);
  for (let i = 0; i < 260; i++) { // soft paint dabs
    g.globalAlpha = 0.05 + r() * 0.07; g.fillStyle = r() < 0.5 ? PH.ground2 : '#E2D6BC';
    const x = r() * w, y = r() * h, a = 20 + r() * 70, b = 10 + r() * 30, ro = r() * 3;
    for (const ox of [-w, 0, w]) for (const oy of [-h, 0, h]) { g.beginPath(); g.ellipse(x + ox, y + oy, a, b, ro, 0, Math.PI * 2); g.fill(); }
  }
});
groundTex.wrapS = groundTex.wrapT = THREE.RepeatWrapping; groundTex.repeat.set(6, 6);
const ground = new THREE.Mesh(new THREE.PlaneGeometry(40, 40), new THREE.MeshBasicMaterial({ map: groundTex }));
ground.rotation.x = -Math.PI / 2; scene.add(ground);
if (!strip && !turn) { // a far plaster wall card so the frame has a horizon read
  const wall = new THREE.Mesh(new THREE.PlaneGeometry(40, 0.9), new THREE.MeshBasicMaterial({ color: new THREE.Color().setStyle('#F3E3C3', THREE.SRGBColorSpace) }));
  wall.position.set(0, 0.45, -6); scene.add(wall);
}

// ---- cats
loadCatAssets('').then(main);
function main() {
const cats = [];
const VIEW = { front: 0, front34: 35, side: 90, back34: 145, back: 180 };
const yaw = (q.has('angle') ? num('angle', 0) : VIEW[q.get('view') || 'front34']) * Math.PI / 180;
const gait = q.get('gait') || 'idle', speed = num('speed', 0.6);
if (strip) {
  const order = ['flag', 'post', 'spring', 'blade', 'anchor', 'comma'];
  order.forEach((carry, i) => {
    const c = createCatInternal({ cast: q.get('cast') || 'wallSitter', scale: 1.25, carry, silhouette: q.get('sil') !== '0', seed: i + 3 });
    if (q.get('sil') === '0') c.setLighting(PH.light);
    c.object3D.position.set((i - 2.5) * 0.88, 0, 0);
    c.object3D.rotation.y = Math.atan2(c.object3D.position.x, -num('dist', 4.6)); // each seen square from behind
    scene.add(c.object3D); cats.push(c);
  });
} else if (q.get('lineup') === '1') {
  // M1 cast lineup: every named cast plus three generated toughs, each seen at the same angle
  const L = (q.get('casts') || 'mikan,hige,pon,kinako,togemaru,kagi,daifuku,tough1,tough2,tough3').split(',');
  const TOUGHS = {
    tough1: { cast: 'tough', build: 'round', ears: 'round', tail: 'ringed', coat: { base: 'cream', patch: 'marmalade' }, pattern: 'tabby', personality: 'brooder', eye: 'copper', seed: 1 },
    tough2: { cast: 'tough', build: 'standard', ears: 'standard', tail: 'stub', coat: { base: 'charcoal', white: 'white' }, pattern: 'bicolour', personality: 'stalwart', eye: 'yellowgreen', seed: 2 },
    tough3: { cast: 'tough', build: 'long', ears: 'tall', tail: 'whip', coat: { base: 'silver' }, pattern: 'solid', personality: 'schemer', eye: 'blue', expr: 'smug', seed: 3 },
  };
  const yawL = (q.has('angle') ? num('angle', 0) : VIEW[q.get('view') || 'front34']) * Math.PI / 180;
  const D = num('dist', 9.0); let x = 0; const xs = [];
  const sil = q.get('sil') === '1'; // flat-black silhouettes (the 3 m read test)
  const made = L.map((n, i) => { const o = TOUGHS[n] || { cast: n }; const c = createCatInternal({ ...o, scale: 1.25, silhouette: sil, seed: o.seed != null ? o.seed + 20 : i + 3 }); return c; });
  made.forEach((c) => { const w = 0.3 * c.object3D.scale.x / 1.25 + 0.12; x += w; xs.push(x); x += w; });
  made.forEach((c, i) => {
    c.object3D.position.set(xs[i] - x / 2, 0, 0);
    c.object3D.rotation.y = Math.atan2(c.object3D.position.x, -D) + Math.PI + yawL; // same view angle for each cat
    c.setLighting(PH.light); scene.add(c.object3D); cats.push(c);
  });
} else if (turn) {
  // owner turnaround layout: FRONT, SIDE (facing left), BACK at the sheet's eye-level camera
  (turn4 ? [0, -90, 180, -40] : [0, -90, 180]).forEach((deg, i, A) => {
    const c = createCatInternal({ cast: q.get('cast') || 'mikan', scale: 1.25, seed: 5 });
    c.object3D.position.set((i - (A.length - 1) / 2) * 0.8 + (i === 1 ? 0.06 : 0), 0, 0); // spaced so no tail crosses a neighbour
    c.object3D.rotation.y = deg * Math.PI / 180;
    c.setLighting(PH.light); scene.add(c.object3D); cats.push(c);
  });
} else {
  const which = q.get('cast') || 'both';
  const list = which === 'both' ? ['mikan', 'wallSitter'] : [which];
  list.forEach((cast, i) => {
    const c = createCatInternal({ cast, scale: 1.25, seed: 5 + i * 11 });
    c.object3D.position.set(list.length > 1 ? (i - 0.5) * 0.9 : 0, 0, 0);
    c.object3D.rotation.y = yaw;
    c.setLighting(PH.light);
    scene.add(c.object3D); cats.push(c);
  });
}
for (const c of cats) { c.setGait(gait, speed); c.setOutlineScale(num('ol', 1)); }
  // look=cam: heads turn to the camera; look=x,y,z: to a world point (e.g. a point of interest)
  if (q.has('look')) { const L = q.get('look'); const tgt = L === 'cam' ? null : new THREE.Vector3(...L.split(',').map(Number)); for (const c of cats) c.lookAt(tgt || new THREE.Vector3(0, 0.95, 2.2)); }

// ---- camera: third-person height by default
const cam = new THREE.PerspectiveCamera(num('fov', 40), W / H, 0.05, 200);
if (strip) { cam.fov = num('fov', 37); cam.updateProjectionMatrix(); cam.position.set(0, num('h', 1.0), num('dist', 4.6)); cam.lookAt(0, 0.3, 0); }
else if (q.get('lineup') === '1') { cam.fov = num('fov', 34); cam.updateProjectionMatrix(); cam.position.set(0, num('h', 1.25), num('dist', 9.0)); cam.lookAt(0, 0.3, 0); }
  else if (turn) { cam.fov = num('fov', turn4 ? 19 : 15); cam.updateProjectionMatrix(); cam.position.set(0, num('h', 0.34), num('dist', 4.6)); cam.lookAt(0, 0.2, 0); ground.visible = false; }
  else if (q.get('cam') === 'close') { cam.position.set(0, num('h', 0.55), num('dist', 1.5)); cam.lookAt(0, 0.28, 0); }
else { cam.position.set(0, num('h', 0.95), num('dist', 2.2)); cam.lookAt(0, 0.26, 0); }

const step = 1 / 60;
if (q.has('t')) {
  const n = Math.round(num('t', 0) / step);
  for (let i = 0; i < n; i++) for (const c of cats) c.update(step);
  for (const c of cats) c.update(0);
  renderer.render(scene, cam);
  window.__ready = true;
} else {
  let last = performance.now(), first = true;
  renderer.setAnimationLoop((now) => {
    const dt = Math.min(0.05, (now - last) / 1000); last = now;
    for (const c of cats) c.update(dt);
    renderer.render(scene, cam);
    if (first) { first = false; window.__ready = true; }
  });
}
window.__cat = { cats, scene, cam, renderer, info: () => renderer.info.render };
}
