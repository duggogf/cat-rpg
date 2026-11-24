// PROTOTYPE - NOT FOR PRODUCTION (Cat RPG artifact showcase slice; throwaway, see README.md)
// Bakes the preview kit's inked VFX drawings (design/previews/kit/kit.js; art bible §10) into textures at
// boot: SVG string -> Image -> canvas -> THREE.CanvasTexture. Each effect has 3+ drawings (seeded
// variants) so it can swap on twos (art bible §10.1: hard-edged, 2-3 flat tones, 3-8 drawings, no glow).
// Plus a billboard material whose last drawings break up through a halftone dissolve, never an alpha fade.
import * as THREE from 'three';
import Kit from '../../../../../design/previews/kit/kit.js';

export { Kit };
const C = Kit.C;

/** Extra kit-style glyphs the kit does not have (same rules: Cream core, one colour, Ink line). */
const G = {
  clawSpark(seed) { // three short parallel nicks (Claw hit spark)
    const R = Kit.rng(seed * 7 + 1); let s = '';
    for (let i = 0; i < 3; i++) { const o = (i - 1) * 26 + (R() - 0.5) * 6, l = 70 + R() * 30;
      const d = `M${-l / 2} ${o - 4}L${l / 2} ${o - 14}L${l / 2 - 6} ${o - 6}L${-l / 2 + 4} ${o + 5}Z`;
      s += `<path d="${d}" fill="${C.clawCore}" stroke="${C.ink}" stroke-width="5" stroke-linejoin="round" transform="rotate(-28)"/><path d="${d}" fill="${C.clawCore}" stroke="${C.claw}" stroke-width="2.5" stroke-linejoin="round" transform="rotate(-28)"/>`; }
    return s;
  },
  yowlSpark(seed) { let s = ''; for (let i = 0; i < 2; i++) { const r = 34 + i * 24 + seed * 3; s += `<path d="M${-r} ${-r * 0.5}Q${-r * 0.2} ${-r * 1.05} ${r * 0.3} ${-r * 0.75}T${r} ${-r * 0.3}" fill="none" stroke="${C.ink}" stroke-width="13" stroke-linecap="round"/><path d="M${-r} ${-r * 0.5}Q${-r * 0.2} ${-r * 1.05} ${r * 0.3} ${-r * 0.75}T${r} ${-r * 0.3}" fill="none" stroke="${C.yowl}" stroke-width="7" stroke-linecap="round"/>`; } return `<g transform="translate(0 30) rotate(${seed * 9 - 9})">${s}</g>`; },
  thumpSpark(seed) { return `<circle r="${56 + seed * 4}" fill="${C.cream}" stroke="${C.ink}" stroke-width="7"/>` + Kit.sparkle({ x: 0, y: 0, r: 44 + seed * 3, fill: C.ink, stroke: 'none', pinch: 0.2 }); },
  spiral(seed) { let d = 'M0 0'; for (let i = 1; i < 40; i++) { const a = i * 0.42 + seed, r = i * 2.1; d += `L${(Math.cos(a) * r).toFixed(1)} ${(Math.sin(a) * r).toFixed(1)}`; } return `<path d="${d}" fill="none" stroke="${C.ink}" stroke-width="11" stroke-linecap="round"/><path d="${d}" fill="none" stroke="${C.staticYellow}" stroke-width="5" stroke-linecap="round"/>`; },
  sweat() { return `<path d="M0 -40Q26 0 18 18Q10 34 0 34Q-10 34 -18 18Q-26 0 0 -40Z" fill="${C.cream}" stroke="${C.ink}" stroke-width="6" stroke-linejoin="round"/><path d="M-6 6Q-10 16 -2 22" fill="none" stroke="${C.ink}" stroke-width="3" stroke-linecap="round"/>`; },
  hiss(seed) { // jagged cream burst with ink zigzags
    const R = Kit.rng(seed * 13 + 3), pts = [];
    for (let i = 0; i < 18; i++) { const a = -Math.PI * 0.55 + i / 17 * Math.PI * 1.1, rr = i % 2 ? 40 + R() * 12 : 80 + R() * 24; pts.push([Math.cos(a) * rr, Math.sin(a) * rr * 0.75]); }
    pts.push([0, 10]);
    let s = `<path d="M${pts.map((p) => p.map((v) => v.toFixed(1)).join(' ')).join('L')}Z" fill="${C.cream}" stroke="${C.ink}" stroke-width="6" stroke-linejoin="round" transform="rotate(90)"/>`;
    for (let i = 0; i < 3; i++) s += `<path d="M${30 + i * 4} ${-28 + i * 28}l12 -8l10 8l12 -8l10 8" fill="none" stroke="${C.ink}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>`;
    return s;
  },
  crack(seed) { const R = Kit.rng(seed * 17 + 5); let s = ''; for (let i = 0; i < 6; i++) { const a = i / 6 * Math.PI * 2 + R() * 0.6; let x = 0, y = 0, d = 'M0 0'; for (let k = 0; k < 3; k++) { x += Math.cos(a + (R() - 0.5) * 0.9) * (30 + R() * 30); y += Math.sin(a + (R() - 0.5) * 0.9) * (30 + R() * 30); d += `L${x.toFixed(1)} ${y.toFixed(1)}`; } s += `<path d="${d}" fill="none" stroke="${C.ink}" stroke-width="${7 - i % 3}" stroke-linecap="round" stroke-linejoin="round"/>`; } return s; },
  scratch() { let s = ''; for (let i = 0; i < 3; i++) s += `<path d="M-110 ${-24 + i * 24}Q0 ${-34 + i * 24} 110 ${-20 + i * 24}" fill="none" stroke="${C.cream}" stroke-width="7" stroke-linecap="round" opacity="0.9"/>`; return s; },
  pawGlyph() { return Kit.ui.paw({ size: 120 }).replace(/<svg[^>]*>/, '<g transform="scale(2.4)">').replace('</svg>', '</g>'); },
  pawDisc() { // Paw-fill feedback: a flat Pad Pink disc with a halftone edge
    let s = `<circle r="70" fill="${C.pad}"/>`; for (let i = 0; i < 28; i++) { const a = i / 28 * Math.PI * 2; s += `<circle cx="${(Math.cos(a) * 84).toFixed(1)}" cy="${(Math.sin(a) * 84).toFixed(1)}" r="7" fill="${C.pad}"/><circle cx="${(Math.cos(a + 0.11) * 98).toFixed(1)}" cy="${(Math.sin(a + 0.11) * 98).toFixed(1)}" r="4" fill="${C.pad}"/>`; } return s + `<circle r="70" fill="none" stroke="${C.ink}" stroke-width="5"/>`;
  },
  wedge(seed) { const R = Kit.rng(seed * 3 + 9); const a = R() * 6.28; return `<path d="M0 -30L${14 + R() * 8} 22L${-12 - R() * 6} 18Z" fill="${C.cream}" stroke="${C.ink}" stroke-width="5" stroke-linejoin="round" transform="rotate(${(a * 57).toFixed(0)})"/>`; },
};

/** name -> [svg content per drawing] at a 512 x 512 viewBox centred on 0,0 (size ≈ unit in world). */
function recipes() {
  const R = {};
  const n3 = (f) => [1, 2, 3].map(f);
  R.burstClaw = n3((s) => Kit.impactBurst({ r: 150, color: C.claw, seed: s, points: 10 }));
  R.burstThump = n3((s) => Kit.impactBurst({ r: 150, star: true, seed: s, points: 9 }));
  R.burstYowl = n3((s) => Kit.impactBurst({ r: 150, color: C.yowl, seed: s, points: 12 }));
  R.burstPlain = n3((s) => Kit.impactBurst({ r: 160, seed: s + 4, points: 13, inner: 0.5 }));
  R.burstMagenta = n3((s) => Kit.impactBurst({ r: 160, color: C.magenta, seed: s + 7, points: 11 }));
  R.burstGold = n3((s) => Kit.impactBurst({ r: 160, color: C.gold, seed: s + 9, points: 12 }));
  R.sparkClaw = n3((s) => G.clawSpark(s));
  R.sparkYowl = n3((s) => G.yowlSpark(s));
  R.sparkThump = n3((s) => G.thumpSpark(s));
  // slash arcs, three different paths: low right, high left, full-circle flurry (art bible §10.3)
  R.slashLow = n3((s) => Kit.slashArc({ r: 200, a0: 160 + s * 4, a1: 20 - s * 6, thick: 30 }));
  R.slashHigh = n3((s) => Kit.slashArc({ r: 200, a0: -20 + s * 4, a1: -165 - s * 5, thick: 30 }));
  R.slashFlurry = n3((s) => Kit.slashArc({ r: 205, a0: -200 + s * 10, a1: 120 + s * 8, thick: 34 }) + Kit.slashArc({ r: 150, a0: 10 - s * 10, a1: 300, thick: 22, color: C.ink, core: C.ink }));
  R.puff = n3((s) => Kit.dustCloud({ r: 150, puffs: 5, seed: s, lw: 9 }));
  R.puffSmall = n3((s) => Kit.dustCloud({ r: 150, puffs: 3, seed: s + 5, lw: 10 }));
  R.sparkle = n3((s) => Kit.sparkle({ r: 150 - s * 10, fill: C.staticYellow, lw: 9 }));
  R.sparkleCream = n3((s) => Kit.sparkle({ r: 150 - s * 10, fill: C.cream, lw: 9 }));
  R.orbit = n3((s) => `<g transform="scale(2.6) rotate(${s * 25})">${Kit.frazzleOrbit({ r: 70 })}</g>`);
  R.spiral = n3((s) => `<g transform="scale(2.2)">${G.spiral(s)}</g>`);
  R.sweat = [G.sweat(), G.sweat(), G.sweat()].map((x) => `<g transform="scale(2.6)">${x}</g>`);
  R.hiss = n3((s) => `<g transform="scale(2.2)">${G.hiss(s)}</g>`);
  R.crack = n3((s) => `<g transform="scale(2.4)">${G.crack(s)}</g>`);
  R.scratch = [G.scratch()].map((x) => `<g transform="scale(2)">${x}</g>`);
  R.paw = [G.pawGlyph()];
  R.pawDisc = [`<g transform="scale(2.2)">${G.pawDisc()}</g>`];
  R.wedge = n3((s) => `<g transform="scale(2.6)">${G.wedge(s)}</g>`);
  R.claws = n3((s) => `<g transform="rotate(${-30 + s * 8}) scale(1.6)">${G.clawSpark(s + 3)}</g>`);
  return R;
}

async function raster(svgContent, size) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-256 -256 512 512" width="${size}" height="${size}" overflow="visible">${Kit.defs()}${svgContent}</svg>`;
  const img = new Image();
  img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
  await img.decode();
  const cv = document.createElement('canvas'); cv.width = cv.height = size;
  cv.getContext('2d').drawImage(img, 0, 0, size, size);
  const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.NoColorSpace; t.anisotropy = 4;  // raw sRGB in, raw out (like the env shaders)
  return t;
}

/** @returns {Promise<Record<string, THREE.Texture[]>>} */
export async function bakeSprites(size = 256) {
  const R = recipes(), out = {};
  await Promise.all(Object.entries(R).map(async ([k, list]) => { out[k] = await Promise.all(list.map((s) => raster(s, size))); }));
  return out;
}

/**
 * Billboard material: camera-facing quad (sized in world metres), drawing swapped by `map`, rotation in
 * screen space, `dissolve` 0..1 breaks it up through a halftone (screen-space dots), never an alpha fade.
 */
export function billboardMat(map) {
  return new THREE.ShaderMaterial({
    uniforms: { map: { value: map }, rot: { value: 0 }, dissolve: { value: 0 }, flatCol: { value: new THREE.Vector4(0, 0, 0, 0) } },
    vertexShader: /* glsl */`uniform float rot; varying vec2 vUv;
      void main(){ vUv = uv; vec4 mv = modelViewMatrix * vec4(0.0, 0.0, 0.0, 1.0);
        vec2 sc = vec2(length(modelMatrix[0].xyz), length(modelMatrix[1].xyz));
        float c = cos(rot), s = sin(rot); vec2 p = position.xy * sc; mv.xy += vec2(c * p.x - s * p.y, s * p.x + c * p.y);
        gl_Position = projectionMatrix * mv; }`,
    fragmentShader: /* glsl */`uniform sampler2D map; uniform float dissolve; uniform vec4 flatCol; varying vec2 vUv;
      void main(){ vec4 c = texture2D(map, vUv); if (c.a < 0.5) discard;
        if (dissolve > 0.0) { vec2 g = fract(gl_FragCoord.xy / 7.0) - 0.5; if (length(g) < dissolve * 0.75) discard; }
        vec3 col = mix(c.rgb, flatCol.rgb, flatCol.a);
        gl_FragColor = vec4(col, 1.0); }`,
    depthTest: false, depthWrite: false, transparent: false,
  });
}
