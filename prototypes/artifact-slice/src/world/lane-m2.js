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
  L.walls.push({ box: [-19.5, 0, -12.5, -9.6, 3.2, -2.6], coping: 0.1, tex: 'wall', tint: '#C9C3AE', den: true });
  L.hedges.push([-12.5, 3.55, -6.5, 1.8, 0.5, 2.6], [-15.5, 3.6, -10.5, 1.6, 0.5, 1.6], [-9.9, 2.4, -11.8, 0.6, 0.7, 0.8]);
  L.den = { stone: [-9.75, -2.85], seat: [-10.2, 3.3, -5.4, 1.5], name: 'Den: Daifuku’s Wall' };
  // ---- trees and greenery along the new runs (the lane keeps 01's density: something on every side)
  L.trees.push(
    { trunk: [-4.0, 22.0], h: 2.6, clumps: [[-4.0, 3.2, 22.0, 2.0, 1.4, 2.2], [-2.6, 2.1, 20.5, 1.2, 0.8, 1.6]] },
    { trunk: [5.5, 31.0], h: 2.8, clumps: [[5.2, 3.5, 31.0, 2.2, 1.5, 2.2]] },
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
  L.farPoles = [[1.42, -34], [1.42, 22.0], [-1.42, 46.0], [-14, -3]];
  L.lamps = [[-1.4, -52], [1.4, -40], [-1.4, -28], [1.4, -17], [1.4, 6.5], [-1.4, 14.0], [1.4, 26.0], [-1.4, 35.0], [1.4, 43.5], [-1.4, 57.0]]
    .map(([x, z]) => [x, z, g(z)]);
  // ---- the two live Patches (territory-management.md §3.1); Scent Posts are inked (L-1)
  L.mailbox = { at: [-1.25, 47.6] };
  L.patches = [
    { id: 'LWC', name: 'Low Wall Corner', post: [-1.25, 1.05, 47.6], zone: [30.0, 62.0], rub: [[-1.6, 0.3, 45.2, '+x'], [1.6, 0.3, 50.5, '-x']], home: true },
    { id: 'LPY', name: 'Laundry Pole Yard', post: [0.6, 1.25, -2.05], zone: [-14.0, 10.0], rub: [[-1.6, 0.3, -1.4, '+x'], [1.6, 0.3, 2.3, '-x']] },
  ];
  L.sunspot = { at: [0.45, 44.2], r: 0.75 };
  L.highPerch = [-1.7, 1.58, -4.6];      // the yard perch on the wall coping; the Den seat is within 10 m
  L.yardStop = [0.2, -10.8];             // Daifuku's Morning patrol stop (a ground arena kit at the crest)
  L.home = { gate: [-1.7, 54.3], zone: [-12.5, -1.8, 48.9, 66], camera: { dist: 1.8, height: 0.45, pitch: -2 } };
  L.find = [-1.25, 19.6];                // a hidden find (sparkle tick)
  L.spawn.mikan = [0, 0, 0, Math.PI];
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
