// PROTOTYPE - NOT FOR PRODUCTION
// "Best on desktop" card (plan Q2: desktop only). Shown on small or touch-only screens;
// dismissable; never causes horizontal scroll (sized from the viewport, box-sizing border-box).
export function isSmallOrTouch() {
  const coarseOnly = matchMedia('(pointer: coarse)').matches && !matchMedia('(any-pointer: fine)').matches;
  return coarseOnly || Math.min(innerWidth, innerHeight) < 600;
}
export function desktopCard(force) {
  if (!force && !isSmallOrTouch()) return null;
  const el = document.createElement('div');
  el.id = 'desktop-card';
  el.setAttribute('role', 'dialog'); el.setAttribute('aria-label', 'Best on desktop');
  el.innerHTML = `<div class="dc-panel"><div class="dc-cat" aria-hidden="true">
      <svg viewBox="0 0 120 80" width="120" height="80"><path d="M20 70 Q18 40 34 30 L30 10 L46 24 Q60 20 74 24 L90 10 L86 30 Q102 40 100 70 Z" fill="#F28C28" stroke="#33273B" stroke-width="3" stroke-linejoin="round"/><path d="M46 70 Q60 52 74 70Z" fill="#FFF6E3" stroke="#33273B" stroke-width="3"/><circle cx="48" cy="44" r="4" fill="#33273B"/><circle cx="72" cy="44" r="4" fill="#33273B"/></svg></div>
    <h2>Best on desktop</h2>
    <p>Cat RPG is made for a keyboard and mouse, or a gamepad, on a bigger screen.</p>
    <button type="button">Look anyway</button></div>`;
  const css = document.createElement('style');
  css.textContent = `#desktop-card{position:fixed;inset:0;display:flex;align-items:center;justify-content:center;padding:16px;box-sizing:border-box;background:rgba(51,39,59,.45);z-index:50;font-family:"M PLUS Rounded 1c",ui-rounded,system-ui,sans-serif}
  #desktop-card *{box-sizing:border-box}
  #desktop-card .dc-panel{width:min(100%,420px);background:#FFF6E3;color:#33273B;border:4px solid #6B4A35;border-radius:28px;padding:20px 20px 22px;text-align:center;box-shadow:0 6px 0 #6B4A35}
  #desktop-card h2{margin:6px 0 8px;font-size:clamp(22px,6vw,30px)}
  #desktop-card p{margin:0 0 16px;font-size:clamp(16px,4.4vw,19px);line-height:1.4}
  #desktop-card button{font:inherit;font-size:18px;font-weight:700;background:#6B4A35;color:#FFF6E3;border:0;border-radius:999px;padding:12px 26px;min-height:44px;cursor:pointer}`;
  document.head.appendChild(css); document.body.appendChild(el);
  el.querySelector('button').addEventListener('click', () => el.remove());
  return el;
}
