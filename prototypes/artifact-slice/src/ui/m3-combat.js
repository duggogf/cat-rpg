// PROTOTYPE - NOT FOR PRODUCTION (Cat RPG artifact showcase slice; throwaway, see README.md)
// The Verdict after a rival fight in the combat chapters (key-screens §4.5): Combat's own events are played into the
// nemesis town (onCombat), and on a won fight that Routed a tracked Rival the town holds the Verdict for the
// highest-ranked one (the others slip away). The three cards then come up over the combat scene; the choice goes back
// to the sim (applyVerdict). Combat is untouched beyond one call from its EncounterEnded handler (src/entries/combat.js),
// which hands over its Verdict vantage (stage / unstage: the HUD, rings and other cats leave; the judged cat is framed).
import { createTown } from '../sim/nemesis/index.js';
import { Verdict } from './verdict.js';
import { stageSubject, freshScar } from './verdict-stage.js';
import { boardModel, setNemesis } from './rivals-model.js';
import { KIT_CSS } from './combat/kit-assets.js';

let town = null, verdict = null, shown = false;
/** Called by combat.js with each EncounterEnded and its whole event log. Returns true when a Verdict is shown. */
export function combatVerdict(ev, log, { patch = 'LPY', delayMs = 2600, test = false, stage = null, unstage = null } = {}) {
  if (shown || !ev || ev.outcome !== 'win') return false;
  try {
    // the sandbox fights are Life 2 seeds (Goma, Sasa, the Captain): the showcase town after Togemaru's Nose-Touch
    town = createTown({ seed: 42, start: 'showcase_l2d2', branch: 'A' }); setNemesis(town);
    town.onCombat(log.filter((e) => ['EncounterStarted', 'CatRouted', 'FearTriggered', 'BossFlee', 'EncounterEnded'].includes(e.type)), { patch });
    const off = town.verdictOffer(); if (!off) return false;
    const m = boardModel({}), cat = m.cats[off.cat] || { id: off.cat, name: off.cat, role: 'tough', kit: m.cats.goma.kit };
    if (!document.getElementById('kit-css')) { const st = document.createElement('style'); st.id = 'kit-css'; st.textContent = KIT_CSS; document.head.appendChild(st); }
    verdict = verdict || new Verdict();
    shown = true;
    const hud = (on) => document.querySelectorAll('.ch, nav[aria-label=Chapters]').forEach((e) => { e.style.visibility = on ? '' : 'hidden'; });
    const open = () => {
      hud(false);   // key-screens §4.5: the HUD hides under the cards and returns after the payoff
      // review round 1, fix 4: cut to the Verdict vantage on the judged cat (low, ears back, its fresh Scar on its model)
      let tellAt = { x: 1130, y: 520 };
      try { const scar = freshScar(town.cat(off.cat), off); const t = stage && stage(off.cat, { stageSubject: (c, o2 = {}) => stageSubject(c, { scar, camera: o2.camera, squash: false }) }); if (t) tellAt = t; } catch (e) { console.warn('Verdict vantage unavailable', e); }
      verdict.open({ cat, life: town.life || 2, town, tellAt, onChoose: (v) => { hud(true); if (unstage) unstage(); try { town.applyVerdict(v.kind, v.step && v.step.id !== 'free' ? { bribe: v.step.id } : {}); } catch (e) { console.warn('verdict not applied', e); } } });
      const loop = (t0) => (now) => { if (!verdict.isOpen) return; verdict.frame(Math.min(0.05, (now - t0) / 1000)); requestAnimationFrame(loop(now)); };
      requestAnimationFrame(loop(performance.now()));
    };
    if (test || !delayMs) open(); else setTimeout(open, delayMs);
    // the Verdict is modal over the fight: its keys never reach the combat input
    const cap = (e) => { if (!verdict.isOpen) return; verdict.key(e.code, e); e.stopImmediatePropagation(); e.preventDefault(); };
    addEventListener('keydown', cap, true); addEventListener('keyup', cap, true);
    return true;
  } catch (e) { console.warn('combat Verdict unavailable', e); return false; }
}
export const combatTown = () => town;
