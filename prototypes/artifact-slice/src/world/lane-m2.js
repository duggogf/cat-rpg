// PROTOTYPE - NOT FOR PRODUCTION
// M2: grows the approved M0 lane corner (lane.json, untouched at the origin) into ≈ 120 m of Hidamari Lane.
// Uphill (+Z) to Haru's garden wall and Low Wall Corner; downhill (-Z) over the crest and down the stepped
// slope into the lower town. Adds the two live Patches, the High Perch, the Den wall (Daifuku within 10 m of
// the perch), the yard stop, street lamps for the lamp wave, Rub Marks, the Sunspot and High Road ribbons.
// Coordinates: metres; X right, Y up; the lane is x ∈ [-1.6, 1.6]; the sea is toward -Z.

/** Lane ground height (shared with the builder): flat to the crest, then the slope into the lower town. */
export function groundY(L, z) {
  const cz = L.crest.z; if (z >= cz) return 0;
  return L.crest.dropTo * Math.min(1, Math.pow((cz - z) / (cz - L.crest.dropZ), 1.3));
}

export function extendLayout(L) {
  const g = (z) => groundY(L, z);
  L.lane.z1 = 66;
  // ---- left plaster wall: the M0 run now stops at Haru's garden; the garden has a low wall with a gate gap
  L.walls[0].box = [-1.8, 0, -13.85, -1.6, 1.5, 49];
  L.walls.push({ box: [-1.8, 0, 49, -1.6, 0.95, 53.4], coping: 0.07, tex: 'wall', home: true });
  L.walls.push({ box: [-1.8, 0, 55.2, -1.6, 0.95, 66], coping: 0.07, tex: 'wall', home: true });
  L.walls.push({ box: [-12.5, 0, 48.8, -1.8, 0.95, 49], coping: 0.07, tex: 'wall', home: true });
  // the old cross house at the top of the lane moves up to close the T-junction above Haru's garden
  L.houses = L.houses.filter((h) => !(h.box[2] === 42.0));
  L.houses.push({ box: [-9.0, 0, 67.0, 6.0, 3.0, 74.0], roof: 2.6, ridge: 'x', windows: [['-z', 0.25, 1.2, 1.4, 0.9], ['-z', 0.55, 1.2, 1.4, 0.9], ['-z', 0.82, 1.2, 1.2, 0.9]] });
  // Haru's house (the home side of the wall blend) and two more houses on the right side uphill
  L.houses.push({ box: [-13.0, 0, 57.5, -5.0, 2.8, 65.5], roof: 2.4, ridge: 'z', windows: [['+x', 0.3, 1.1, 1.4, 0.9], ['+x', 0.7, 1.1, 1.4, 0.9], ['-z', 0.5, 1.1, 1.6, 1.0]], home: true });
  L.houses.push({ box: [3.4, 0, 43.0, 10.5, 2.6, 50.5], roof: 2.3, ridge: 'x', windows: [['-x', 0.5, 1.1, 1.4, 0.9], ['-z', 0.4, 1.1, 1.4, 0.9]] });
  L.houses.push({ box: [3.6, 0, 53.0, 10.0, 2.7, 61.0], roof: 2.2, ridge: 'z', windows: [['-x', 0.4, 1.1, 1.4, 0.9]] });
  L.fences.push({ box: [1.6, 0, 41, 1.68, 1.3, 66] });
  // ---- downhill: stepped walls (left) and stepped board fence (right) follow the slope in 4 m courses
  for (let z = -14; z > -62; z -= 4) {
    const za = z, zb = z - 4, mid = (za + zb) / 2, top = g(mid);
    L.walls.push({ box: [-1.8, g(zb) - 0.8, zb, -1.6, top + 1.35, za], coping: 0.07, tex: 'wall', step: true });
    if (z < -18) L.fences.push({ box: [1.6, g(zb) - 0.8, zb, 1.68, top + 1.2, za], step: true });
  }
  // ---- the Den: Daifuku's great wall uphill behind the left gardens, its mossy corner stone, and his seat
  L.walls.push({ box: [-19.5, 0, -1.6, -9.6, 3.2, 9.5], coping: 0.1, tex: 'stone', den: true });
  L.hedges.push([-12.5, 3.55, 6.0, 1.8, 0.5, 2.6], [-15.5, 3.6, 1.5, 1.6, 0.5, 1.6], [-9.9, 2.4, 9.0, 0.6, 0.7, 0.8]);
  L.den = { stone: [-9.75, -1.45], seat: [-10.2, 3.3, 4.6, 1.5], name: 'Den: Daifuku’s Wall' };
  // the M0 garden tree uphill of the corner moves aside so the perch has a clear sightline to the Den
  const t2 = L.trees.find((t) => t.trunk[0] === -4.2 && t.trunk[1] === 3.0); if (t2) { t2.trunk = [-5.6, 12.0]; t2.clumps = [[-5.6, 2.9, 12.0, 1.8, 1.2, 1.9], [-3.4, 1.95, 11.0, 1.2, 0.75, 1.5]]; }
  // ---- trees and greenery along the new runs (the lane keeps 01's density: something on every side)
  L.trees.push(
    { trunk: [-4.0, 22.0], h: 2.6, clumps: [[-4.0, 3.2, 22.0, 2.0, 1.4, 2.2], [-2.6, 2.1, 20.5, 1.2, 0.8, 1.6]] },
    { trunk: [3.4, 25.6], h: 2.8, clumps: [[3.2, 3.5, 25.6, 2.2, 1.5, 2.2], [2.2, 2.6, 23.2, 1.3, 0.9, 1.4]] },   // the persimmon tree over Persimmon Alley's pole
    { trunk: [-4.5, 40.5], h: 2.4, clumps: [[-4.5, 3.0, 40.5, 1.9, 1.3, 2.0], [-2.7, 2.0, 42.0, 1.1, 0.8, 1.4]] },
    { trunk: [-6.5, 52.0], h: 2.2, clumps: [[-6.5, 2.7, 52.0, 1.8, 1.2, 1.8]], home: true },
    { trunk: [-4.0, -26.0], h: 2.4, clumps: [[-4.0, g(-26) + 2.9, -26.0, 2.0, 1.3, 2.0]], base: g(-26) },
    { trunk: [4.6, -38.0], h: 2.6, clumps: [[4.6, g(-38) + 3.1, -38.0, 2.2, 1.4, 2.0]], base: g(-38) },
  );
  L.hedges.push([-1.7, 1.55, 12.0, 0.55, 0.5, 1.2], [-1.7, 1.6, 27.5, 0.6, 0.5, 1.3], [-1.65, 1.5, 36.0, 0.5, 0.45, 1.0], [1.75, 1.4, 24.0, 0.4, 0.35, 1.0], [1.75, 1.4, 35.0, 0.35, 0.3, 0.8],
    [-1.65, g(-22) + 1.45, -22.0, 0.5, 0.45, 1.1], [1.75, g(-31) + 1.3, -31.0, 0.4, 0.35, 0.9], [-1.65, g(-45) + 1.45, -45.0, 0.5, 0.45, 1.2]);
  L.hydrangeas.push([1.38, 21.0, 0.8], [-1.35, 33.5, 0.7], [1.4, 39.0, 0.75], [-1.35, 46.0, 0.6]);
  L.grassLines.push([1.52, 41, 1.52, 65, 40], [-1.55, 41, -1.55, 48.5, 14]);
  L.props.push(['pot', 1.3, 15.0, 0, 0.9], ['aloe', -1.36, 26.0, 0.3, 0.85], ['bucket', 1.28, 29.5, 0, 0.85], ['pot', -1.38, 44.0, 0, 0.9], ['aloe', 1.3, 47.5, 0.2, 0.9]);
  L.hedges.push([1.3, 0.42, 15.0, 0.2, 0.17, 0.2], [-1.38, 0.42, 44.0, 0.2, 0.17, 0.2]);
  L.decals.push(['manhole', 0, 1, -0.4, 0, 18.5, 0.55, 0.55, 'up'], ['manhole', 0, 1, 0.3, 0, 37.0, 0.55, 0.55, 'up'],
    ['stains', 0, 3, -1.6, 0, 15.5, 0.75, 1.5, '+x'], ['stains', 2, 3, -1.6, 0.2, 24.0, 0.6, 1.2, '+x'], ['stains', 0, 3, -1.6, 0, 31.0, 0.75, 1.5, '+x'], ['stains', 0, 3, -1.6, 0, 43.0, 0.75, 1.5, '+x'],
    ['poster', 0, 1, -1.6, 0.6, 29.0, 0.42, 0.56, '+x'], ['notice', 0, 1, -1.6, 0.55, 38.0, 0.5, 0.65, '+x']);
  [[0, -0.7, 11.0, 0.8, 0.6], [1, 0.6, 20.0, 1.0, 1.0], [3, -0.5, 26.5, 0.9, 0.7], [0, 0.8, 32.5, 0.8, 0.6], [2, -0.4, 40.0, 1.0, 0.65], [1, 0.4, 49.5, 0.9, 0.9], [0, -0.6, 56.0, 0.8, 0.6]]
    .forEach(([c, x, z, w, h], i) => L.decals.push(['groundbits', c, 4, x, 20 + i, z, w, h, 'up']));
  L.drainpipes.push([-1.555, 22.5, 1.55], [-1.555, 39.0, 1.55]);
  L.bricks.push([1.45, 26.5, 0.4], [-1.42, 35.5, -0.2]);
  // ---- utility poles (+ wires) and street lamps; the lamp wave runs uphill from the lowest lamp
  L.farPoles = [[1.42, -34], [1.45, 38.0], [-14, -3]];
  L.lamps = [[-1.4, -52], [1.4, -40], [-1.4, -28], [1.4, -17], [1.4, 6.5], [-1.4, 14.0], [1.4, 26.0], [-1.4, 35.0], [-1.4, 41.0], [1.4, 43.5], [1.4, 50.5], [-1.4, 57.0]]
    .map(([x, z]) => [x, z, g(z)]);
  // ---- the Patches (territory-management.md §3.1). Ids match the territory sim (src/sim/territory,
  // data/territory/patches.json): one inked landmark per post, two Rub Marks per outer Patch (Whisker Sense only),
  // the Den's corner stone. LPY's `gatepost` is drawn by the approved M0 stone lantern (the 01 frame's Scent Post):
  // flagged for Art (rename the landmark or the post id).
  L.mailbox = { at: [-1.25, 47.6] };
  L.patches = [
    { id: 'LWC', post: 'red_mailbox', at: [-1.25, 1.05, 47.6], zone: [38.0, 62.0], rub: { 'LWC.rub1': [-1.6, 0.3, 45.2, '+x'], 'LWC.rub2': [1.6, 0.3, 50.5, '-x'] }, home: true },
    { id: 'PA', post: 'utility_pole', at: [1.3, 1.7, 24.0], zone: [14.0, 38.0], rub: { 'PA.rub1': [-1.6, 0.3, 21.5, '+x'], 'PA.rub2': [1.6, 0.3, 30.5, '-x'] } },
    { id: 'LPY', post: 'gatepost', at: [0.6, 1.25, -2.05], zone: [-14.0, 14.0], rub: { 'LPY.rub1': [-1.6, 0.3, -1.4, '+x'], 'LPY.rub2': [1.6, 0.3, 2.3, '-x'] } },
    { id: 'TSS', post: 'milk_crates', at: [1.15, g(-38) + 1.0, -38.0], zone: [-64.0, -14.0], rub: { 'TSS.rub1': [-1.6, 0.3, -31.0, '+x'], 'TSS.rub2': [1.6, 0.3, -44.0, '-x'] } },
    { id: 'DEN', post: 'corner_stone', at: [-9.75, 0.75, -1.45], zone: null, rub: {} },
  ];
  // Boss stops (boss_patrol.json): den_wall (window shut), S_M Laundry Pole Yard (Morning), S_D Tofu Shop's back lane (Day), S_N the Den corner
  L.stops = { den_wall: [-10.2, 3.3, 4.6], S_M: [0.2, 0, -10.8], S_D: [0.3, 0, -46.5], S_N: [-8.6, 0, 0.4] };
  L.pa = { pole: [1.3, 24.0] }; L.tss = { crates: [1.15, -38.0] };
  L.sunspot = { at: [0.45, 44.2], r: 0.75 };
  L.highPerch = [-1.7, 1.58, 3.2];       // the yard perch on the wall coping; the Den seat is within 10 m
  L.yardStop = L.stops.S_M;
  L.home = { gate: [-1.7, 54.3], zone: [-12.5, -1.8, 48.9, 66], camera: { dist: 1.8, height: 0.45, pitch: -2 } };
  L.find = [-1.25, 19.6];                // a hidden find (sparkle tick)
  L.spawn.mikan = [0, 0, 0, Math.PI];
  // ---- M2 review fix 5: dress the bare stretches (01 density: something every ≈ 8 m on both sides)
  // spill clumps sit off the ribbon line so they overhang the coping without hiding a cat walking it
  for (const h of L.hedges) { if (h[0] > -1.85 && h[0] < -1.45 && h[1] > 1.2) h[0] = -2.0; if (h[0] > 1.55 && h[0] < 1.9 && h[1] > 1.1) h[0] = 1.95; }
  L.grassLines.push([-1.7, -13, -1.7, 48, 70, 1.58], [1.64, -7.6, 1.64, 7.0, 16, 1.3], [-14.5, -1.4, -10.0, -1.4, 10, 3.3]);
  // Low Wall Corner (vantage 0) and the top of the lane
  L.props.push(['pot', 1.3, 40.5, 0, 0.85], ['bucket', 1.28, 53.0, 0, 0.85], ['aloe', -1.36, 41.6, 0.2, 0.8], ['pot', 1.3, 59.5, 0, 0.9]);
  L.hedges.push([1.3, 0.42, 40.5, 0.2, 0.17, 0.2], [1.3, 0.42, 59.5, 0.2, 0.17, 0.2]);
  L.decals.push(['poster', 0, 1, 1.6, 0.6, 45.0, 0.42, 0.56, '-x'], ['notice', 0, 1, 1.6, 0.55, 56.0, 0.5, 0.65, '-x'], ['stains', 0, 3, -1.6, 0, 40.0, 0.75, 1.5, '+x'],
    ['groundbits', 1, 4, 0.6, 30, 53.0, 0.9, 0.9, 'up'], ['groundbits', 0, 4, -0.5, 31, 60.0, 0.8, 0.6, 'up']);
  L.drainpipes.push([-1.555, 42.5, 1.55]);
  L.laundries = [
    { posts: [[2.6, 46.2], [4.8, 46.2]], h: 2.3, sheets: [[0.1, 0.38, 0.7, '#FFFDF4'], [0.45, 0.66, 0.5, '#CFE0F0'], [0.72, 0.95, 0.66, '#FFFDF4']] },
    { posts: [[-9.0, 52.6], [-6.8, 52.6]], h: 2.2, sheets: [[0.12, 0.45, 0.66, '#FFFDF4'], [0.55, 0.85, 0.5, '#F7D9A8']] },          // Haru's garden
    { posts: [[2.8, -30.0], [4.9, -30.0]], h: 2.2, y0: g(-30), sheets: [[0.1, 0.4, 0.7, '#FFFDF4'], [0.5, 0.75, 0.55, '#E4D2EE']] },  // a lower yard on the slope
  ];
  // Haru's garden behind the gate: pots, hydrangeas, a hedge line, stepping stones
  L.props.push(['pot', -2.4, 50.6, 0, 0.9], ['aloe', -4.2, 57.2, 0, 0.9], ['bucket', -2.7, 56.2, 0.4, 0.8], ['pot', -8.2, 56.4, 0, 1.0]);
  L.hedges.push([-2.4, 0.42, 50.6, 0.2, 0.17, 0.2], [-8.2, 0.45, 56.4, 0.22, 0.18, 0.22], [-11.6, 0.8, 52.5, 0.9, 0.8, 2.2], [-3.0, 0.7, 64.0, 1.0, 0.7, 1.4], [-6.0, 0.65, 64.6, 1.0, 0.6, 1.2]);
  L.hydrangeas.push([-3.1, 51.6, 0.7], [-5.8, 55.0, 0.75], [-10.2, 56.0, 0.7]);
  [[-2.8, 53.2], [-4.0, 54.4], [-5.2, 55.6], [-6.3, 56.9]].forEach(([x, z], i) => L.decals.push(['groundbits', 3, 4, x, 40 + i, z, 0.7, 0.55, 'up']));
  // the High Road's far side: sheds and garden fences instead of open lawn
  L.houses.push(
    { box: [-6.6, 0, 10.6, -4.4, 2.0, 12.8], roof: 0.7, ridge: 'z', windows: [['+x', 0.5, 1.0, 0.7, 0.5]] },
    { box: [-5.6, 0, 14.4, -3.6, 1.9, 16.4], roof: 0.6, ridge: 'x', windows: [] },
    { box: [-5.8, 0, 44.4, -3.6, 1.9, 46.6], roof: 0.7, ridge: 'z', windows: [['+x', 0.5, 1.0, 0.7, 0.5]] },
  );
  L.fences.push({ box: [-6.3, 0, 26.2, -6.22, 1.25, 29.8] }, { box: [-7.2, 0, 38.2, -7.12, 1.25, 43.8] }, { box: [-6.9, 0, 17.0, -6.82, 1.25, 18.8] });
  L.hedges.push([-3.0, 0.6, 7.5, 0.9, 0.6, 1.2], [-6.5, 0.7, 33.0, 1.1, 0.7, 1.6], [-3.4, 0.55, 35.5, 0.8, 0.55, 1.0]);
  // the slope (vantage 4): pots at the wall feet, posters and stains on the stepped walls, spill over the courses
  L.props.push(['pot', -1.35, -26.0, 0, 0.85], ['aloe', 1.3, -29.0, 0.3, 0.85], ['bucket', -1.32, -41.0, 0, 0.8], ['pot', 1.28, -47.0, 0, 0.9], ['aloe', -1.34, -53.5, 0, 0.85]);
  L.hedges.push([-1.35, g(-26) + 0.42, -26.0, 0.2, 0.17, 0.2], [1.28, g(-47) + 0.42, -47.0, 0.2, 0.17, 0.2],
    [-2.0, g(-34) + 1.5, -34.0, 0.55, 0.5, 1.2], [1.95, g(-39) + 1.3, -39.5, 0.45, 0.4, 1.0], [-2.0, g(-51) + 1.45, -51.0, 0.6, 0.5, 1.3]);
  [[1, 0.5, -19.5, 1.0, 1.0], [0, -0.6, -23.0, 0.8, 0.6], [3, 0.4, -27.5, 0.9, 0.7], [1, -0.3, -32.0, 1.0, 1.0], [0, 0.7, -36.5, 0.8, 0.6], [2, -0.4, -42.0, 1.0, 0.65], [3, 0.5, -48.0, 0.9, 0.7], [0, -0.5, -54.0, 0.8, 0.6]]
    .forEach(([c, x, z, w, h], i) => L.decals.push(['groundbits', c, 4, x, 50 + i, z, w, h, 'up']));
  L.decals.push(['manhole', 0, 1, 0.2, 0, -37.5, 0.55, 0.55, 'up']);
  L.decals.push(['poster', 0, 1, -1.6, g(-24) + 0.6, -24.0, 0.42, 0.56, '+x'], ['stains', 0, 3, -1.6, g(-30) - 0.2, -30.0, 0.75, 1.5, '+x'], ['notice', 0, 1, -1.6, g(-43) + 0.55, -43.0, 0.5, 0.65, '+x'],
    ['stains', 2, 3, -1.6, g(-49) + 0.1, -49.0, 0.6, 1.2, '+x']);

  // the M0 Wall Sitter keeps her coping seat (now the Laundry Pole Yard's High Perch neighbour)
  return L;
}

/** High Road ribbons: every wall and fence top is a walkable segment {a, b, y, w, solid}. */
export function highRoad(L) {
  const segs = [];
  const add = (bx, cap, kind) => {
    const [x0, , z0, x1, y1, z1] = [Math.min(bx[0], bx[3]), bx[1], Math.min(bx[2], bx[5]), Math.max(bx[0], bx[3]), bx[4], Math.max(bx[2], bx[5])];
    const alongZ = (z1 - z0) >= (x1 - x0), y = y1 + (cap || 0);
    if (alongZ) segs.push({ ax: (x0 + x1) / 2, az: z0 + 0.1, bx: (x0 + x1) / 2, bz: z1 - 0.1, y, kind });
    else segs.push({ ax: x0 + 0.1, az: (z0 + z1) / 2, bx: x1 - 0.1, bz: (z0 + z1) / 2, y, kind });
  };
  for (const w of L.walls) add(w.box, w.coping, w.den ? 'den' : 'wall');
  for (const f of L.fences) add(f.box, 0, 'fence');
  return segs;
}
