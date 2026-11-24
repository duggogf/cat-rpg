// PROTOTYPE - NOT FOR PRODUCTION
// Phase keys: art bible §4.4 (sky zenith/horizon, key light, shadow, cel tint), plus the
// painter's extras the 2D target uses (warm bounce, haze, cloud tones). Colours are sRGB
// hex and are used AS sRGB numbers: the environment shades in display space, like the
// kit's multiply layers, so swatches arrive on screen unshifted (AB-15).
import * as THREE from 'three';

export const PHASES = {
  day: {
    zenith: '#3F9BE6', horizon: '#A9DBF5', key: '#FFFBEF', shadow: '#6E6AA8', cel: '#FFFFFF',
    sunEl: 58, sunAz: -65,         // degrees; azimuth 0 = toward the sea (-Z), +90 = +X
    shadeK: 0.6,                    // shade = albedo x mix(1, shadow, shadeK)
    shadowTint: '#6F6CC4',          // the 01 frame's lane-shadow wisteria
    bounce: '#FFD9A0', bounceK: 0.22, // warm light kicked up off the lit lane into shaded walls
    haze: '#D6ECF6', hazeMax: 0.62, hazeNear: 22, hazeFar: 260,
    cloudLight: '#FFFFFF', cloudShade: '#C9D8F0', backdropKey: '#FFFFFF',
    sunGlow: '#FFF6D8', sunGlowK: 0.55,
    catKey: '#FFFFFF', catShade: '#D8D2EA', catRim: '#FFF6E3',
  },
  dusk: {
    zenith: '#8E6FB0', horizon: '#F7A45A', key: '#FFC27A', shadow: '#7A4E8C', cel: '#FFDDB5',
    sunEl: 12, sunAz: 22,
    shadeK: 0.62,
    shadowTint: '#7A4E8C',
    bounce: '#FFB070', bounceK: 0.2,
    haze: '#F4B98C', hazeMax: 0.7, hazeNear: 18, hazeFar: 220,
    cloudLight: '#FFD9A6', cloudShade: '#B88FBE', backdropKey: '#FFD2A0',
    sunGlow: '#FFE0A0', sunGlowK: 0.9,
    catKey: '#FFDDB5', catShade: '#9C7CB4', catRim: '#FFD9A0',
  },
};

/** Raw sRGB triple (no colour management) for shader uniforms. */
export function rgb(hex) { const n = parseInt(hex.slice(1), 16); return new THREE.Vector3(((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255); }
/** Direction toward the sun (world). */
export function sunDir(ph) {
  const el = THREE.MathUtils.degToRad(ph.sunEl), az = THREE.MathUtils.degToRad(ph.sunAz);
  return new THREE.Vector3(Math.sin(az) * Math.cos(el), Math.sin(el), -Math.cos(az) * Math.cos(el)).normalize();
}
