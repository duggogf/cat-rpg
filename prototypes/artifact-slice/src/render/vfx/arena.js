// PROTOTYPE - NOT FOR PRODUCTION (Cat RPG artifact showcase slice; throwaway, see README.md)
// The combat sandbox's lot: a wide sun-baked yard in the M0 painted style, built by the world builder
// (src/world/builder.js, read-only) from a lot spec derived here, in ARENA-LOCAL metres (the sim's
// frame: posse spawns +Z, enemies -Z, the sea toward -Z). Each sim arena id gets its own dressing:
//   sandbox_lane / gatepost: the High Road wall on the left (x = -4.4 / fence top at +4.4), a board
//     fence behind the enemies, houses and trees over it, the water bucket in the ring.
//   wash_tub_kit: Daifuku's yard wall across the ring (z = -2.5, his High Road), the wash tub below it,
//     Laundry Pole Yard's poles and sheets behind.
// The inked tub / bucket are drawn here (cel + hull, the builder's materials) so they can tip over.
import * as THREE from 'three';
import L0 from '../../world/lane.json';
import { buildWorld, contactBlob } from '../../world/builder.js';
import { celMat, hullMat } from '../env.js';
import { rgb } from '../phases.js';

const clone = (o) => JSON.parse(JSON.stringify(o));

function baseLot() {
  const L = clone(L0);
  L.lane = { x0: -7.5, x1: 7.5, z0: -14, z1: 26 };
  L.crest = { z: -14, dropTo: -9, dropZ: -42 };
  L.spawn = { mikan: [0, 0, 3, 3.14], wallSitter: [0, 0, -3, 0] };
  L.walls = []; L.fences = []; L.gates = []; L.vending = []; L.aircons = []; L.brooms = []; L.drainpipes = [];
  L.passerBy = null; L.props = [];
  L.houses = [
    { box: [2.2, 0, -17.5, 9.4, 2.7, -11.0], roof: 2.3, ridge: 'x', windows: [['+z', 0.3, 1.1, 1.4, 0.9], ['+z', 0.7, 1.1, 1.2, 0.9]] },
    { box: [-12.5, 0, -19.5, -5.0, 2.8, -12.8], roof: 2.2, ridge: 'z', windows: [['+x', 0.5, 1.2, 1.4, 0.9]] },
    { box: [9.2, 0, -4.0, 15.5, 2.6, 4.5], roof: 2.2, ridge: 'z', windows: [['-x', 0.3, 1.1, 1.4, 0.9], ['-x', 0.72, 1.1, 1.2, 0.9]] },
    { box: [-15.5, 0, -6.0, -9.0, 2.7, 2.0], roof: 2.4, ridge: 'z', windows: [['+x', 0.4, 1.1, 1.4, 0.9]] },
    { box: [-14.0, 0, 9.0, -8.5, 2.7, 16.0], roof: 2.3, ridge: 'x', windows: [['+x', 0.5, 1.1, 1.4, 0.9]] },
    { box: [9.5, 0, 10.0, 16.0, 2.6, 17.0], roof: 2.2, ridge: 'z', windows: [['-x', 0.5, 1.1, 1.4, 0.9]] },
  ];
  L.trees = [
    { trunk: [-6.8, -9.0], h: 2.8, clumps: [[-7.0, 3.3, -9.2, 2.4, 1.6, 2.4], [-5.4, 2.4, -8.4, 1.5, 1.0, 1.7], [-8.4, 3.6, -10.8, 2.0, 1.3, 2.0]] },
    { trunk: [8.0, -8.6], h: 3.2, clumps: [[8.0, 4.0, -8.8, 2.6, 1.8, 2.6], [6.6, 3.0, -9.8, 1.8, 1.2, 1.8], [9.6, 3.2, -7.0, 1.7, 1.1, 1.6]] },
    { trunk: [-8.6, 5.0], h: 2.4, clumps: [[-8.6, 3.0, 5.0, 2.0, 1.4, 2.2], [-7.6, 2.0, 3.4, 1.3, 0.8, 1.5]] },
    { trunk: [11.5, 7.0], h: 3.0, clumps: [[11.5, 3.8, 7.0, 2.4, 1.6, 2.4]] },
    { trunk: [-7.5, -24.0], h: 1.5, clumps: [[-7.5, 1.0, -24.0, 2.6, 1.4, 2.4]] },
  ];
  L.hedges = [
    [-6.2, 0.75, -7.2, 1.2, 0.75, 1.8], [5.6, 0.7, -7.6, 1.3, 0.7, 1.4], [7.9, 0.8, -2.0, 0.9, 0.8, 1.6], [7.9, 0.85, 3.6, 1.0, 0.8, 1.8],
    [-7.6, 0.8, -1.5, 1.0, 0.8, 1.6], [-7.4, 0.7, 8.6, 1.2, 0.7, 1.6], [2.4, 0.6, -7.5, 0.8, 0.55, 1.1],
  ];
  L.hydrangeas = [[-6.9, -5.6, 0.9], [7.4, 0.6, 0.8], [-7.2, 2.6, 0.75], [6.9, -6.4, 0.8]];
  L.grassLines = [[-7.3, -7.2, -7.3, 12, 70], [7.3, -7.2, 7.3, 12, 70], [-7.2, -7.1, 7.2, -7.1, 60], [-3.2, -4.8, -2.0, -6.4, 10], [3.6, 5.6, 5.0, 6.8, 10]];
  L.pole = { at: [6.6, -7.6], h: 8.4 };
  L.farPoles = [[6.6, -30], [-9, 22], [-14, -9]];
  L.lantern = { at: [-6.4, 6.2], h: 1.2 };
  L.notice = { x: -50, z: -50, y: -5, w: 0.01, h: 0.01 };
  L.laundry = { posts: [[-2.6, -10.0], [0.2, -10.0]], h: 2.35, sheets: [[0.08, 0.38, 0.72, '#FFFDF4'], [0.46, 0.7, 0.52, '#F7D9A8'], [0.74, 0.98, 0.78, '#FFFDF4']] };
  L.bricks = [[-5.6, 4.3, 0.2], [5.4, 3.8, -0.3], [-1.2, -6.6, 0.1]];
  const gb = []; let s = 3;
  const r = () => ((s = (s * 16807) % 2147483647) / 2147483647);
  for (let i = 0; i < 34; i++) gb.push(['groundbits', i % 4, 4, -6.5 + r() * 13, i + 1, -6.5 + r() * 15, 0.8 + r() * 0.5, 0.6 + r() * 0.5, 'up']);
  L.decals = [['manhole', 0, 1, 3.2, 0, 4.6, 0.62, 0.62, 'up'], ['manhole', 0, 1, -2.5, 0, -6.2, 0.55, 0.55, 'up'], ...gb];
  return L;
}

/** Wall + fence dressing per sim arena. */
function dressFor(L, arena) {
  const fenceH = 1.3, wallH = 1.5;
  if (arena.id === 'wash_tub_kit') {
    // Daifuku's yard wall: plaster with coping, across the ring (his High Road), longer than the edge for the set.
    L.walls.push({ box: [-6.6, 0, -2.65, 6.6, wallH, -2.35], coping: 0.08, tex: 'wall' });
    L.walls.push({ box: [-6.8, 0, -9.5, -6.6, wallH, -2.35], coping: 0.08, tex: 'wall' });
    L.walls.push({ box: [6.6, 0, -9.5, 6.8, wallH, -2.35], coping: 0.08, tex: 'wall' });
    L.fences.push({ box: [-7.5, 0, 9.0, -7.42, fenceH, -2.2] }, { box: [7.42, 0, 9.0, 7.5, fenceH, -2.2] });
    L.laundry = { posts: [[-3.2, -6.2], [2.8, -6.2]], h: 2.35, sheets: [[0.06, 0.26, 0.7, '#FFFDF4'], [0.32, 0.52, 0.5, '#F7D9A8'], [0.58, 0.78, 0.74, '#FFFDF4'], [0.82, 0.97, 0.6, '#CFE4F2']] };
    L.trees[0].trunk = [-5.0, -9.5];
    L.hedges = L.hedges.filter(h => h[2] > -2 || Math.abs(h[0]) > 6);
  } else {
    const hr = arena.high_roads[0];
    const wx = hr.a[0], w = hr.width / 2;
    if (arena.id === 'gatepost') L.fences.push({ box: [wx - w, 0, hr.a[1] - 3, wx + w, hr.y, hr.b[1] + 3] });
    else L.walls.push({ box: [wx - w, 0, hr.a[1] - 2.6, wx + w, hr.y, hr.b[1] + 2.0], coping: 0.08, tex: 'wall' });
    L.fences.push({ box: [-7.5, 0, -7.2, 7.5, fenceH, -7.12] });
    L.fences.push({ box: [7.42, 0, -7.12, 7.5, fenceH, 2.0] });
  }
}

/** Inked tub/bucket (cel + hull), returned so the combat scene can tip it when used. */
function inkedVessel(kind) {
  const shade = rgb('#D8D2EA');
  const part = (g, hex, cy) => {
    g.computeVertexNormals();
    const P = g.attributes.position, c = rgb(hex), C = [], S = [], SN = [];
    for (let i = 0; i < P.count; i++) {
      C.push(c.x, c.y, c.z); S.push(c.x * shade.x * 0.96, c.y * shade.y * 0.96, c.z * shade.z * 0.96);
      const d = new THREE.Vector3(P.getX(i), (P.getY(i) - cy) * 1.4, P.getZ(i)).normalize(); SN.push(d.x, d.y, d.z);
    }
    g.setAttribute('color', new THREE.Float32BufferAttribute(C, 3)); g.setAttribute('shadeCol', new THREE.Float32BufferAttribute(S, 3)); g.setAttribute('smoothN', new THREE.Float32BufferAttribute(SN, 3));
    return g;
  };
  const lathe = (prof, seg = 32) => new THREE.LatheGeometry(prof.map(([r, y]) => new THREE.Vector2(r, y)), seg);
  const grp = new THREE.Group(), cm = celMat(), hm = hullMat(2.2);
  const parts = [];
  if (kind === 'tub') {
    parts.push(part(lathe([[0, 0.01], [0.48, 0.01], [0.52, 0.04], [0.6, 0.34], [0.56, 0.34], [0.5, 0.06], [0, 0.06]]), '#9AB3C4', 0.17));
    const rim = new THREE.TorusGeometry(0.585, 0.025, 6, 40); rim.rotateX(Math.PI / 2); rim.translate(0, 0.34, 0); parts.push(part(rim, '#C6D7E2', 0.34));
    const water = new THREE.CircleGeometry(0.55, 32); water.rotateX(-Math.PI / 2); water.translate(0, 0.27, 0); water.userData.noHull = true; parts.push(part(water, '#7FC4E8', 0.27));
  } else {
    parts.push(part(lathe([[0, 0.005], [0.1, 0.005], [0.115, 0.02], [0.14, 0.26], [0.125, 0.26], [0.105, 0.03], [0, 0.03]]), '#7FB2D9', 0.13));
    const rim = new THREE.TorusGeometry(0.138, 0.012, 6, 24); rim.rotateX(Math.PI / 2); rim.translate(0, 0.26, 0); parts.push(part(rim, '#A9D2EE', 0.26));
    const water = new THREE.CircleGeometry(0.125, 20); water.rotateX(-Math.PI / 2); water.translate(0, 0.2, 0); water.userData.noHull = true; parts.push(part(water, '#7FC4E8', 0.2));
  }
  for (const g of parts) { grp.add(new THREE.Mesh(g, cm)); if (!g.userData.noHull) grp.add(new THREE.Mesh(g, hm)); }
  grp.userData.water = grp.children.find((m) => m.geometry.type === 'CircleGeometry');
  return grp;
}

/**
 * Build the lot for a sim arena. @param arena snapshot().arena; @param props snapshot().props; @param tex loaded textures
 * @returns builder output plus `props` {id -> THREE.Group}
 */
export function buildArena(arena, props, tex) {
  const L = baseLot();
  dressFor(L, arena);
  const W = buildWorld(L, tex);
  W.props = {};
  for (const p of props) {
    const g = inkedVessel(p.id === 'wash_tub' ? 'tub' : 'bucket');
    g.position.set(p.pos[0], 0, p.pos[2]);
    W.late.add(g);
    W.env.add(contactBlob(p.pos[0], p.pos[2], p.id === 'wash_tub' ? 0.75 : 0.22, p.id === 'wash_tub' ? 0.6 : 0.2));
    W.props[p.id] = g;
  }
  return W;
}

/** Tip a used bucket (the tub stays and just empties). */
export function spendProp(g, kind) {
  if (!g) return;
  if (g.userData.water) g.userData.water.visible = false;
  if (kind !== 'wash_tub') { g.rotation.z = Math.PI / 2 * 0.92; g.position.y = 0.12; }
}
