// PROTOTYPE - NOT FOR PRODUCTION (Cat RPG artifact showcase slice; throwaway, see README.md)
// The small chapter pill (kit look: cream bean, cocoa frame, gold for the current chapter) shared by the Lane
// scene (main.js) and the combat sandbox (combat.js). Chapters are query strings on the same page:
//   (none) = the Lane · ?chapter=combat&fight=toughs3 | captain | daifuku
// Hidden in ?test=1 runs so evidence captures stay clean.
const CHAPTERS = [
  ['Lane', ''],
  ['Toughs', '?chapter=combat&fight=toughs3'],
  ['Captain', '?chapter=combat&fight=captain'],
  ['Daifuku', '?chapter=combat&fight=daifuku'],
];

export function chapterPill() {
  const Q = new URLSearchParams(location.search);
  if (Q.get('test') === '1' || Q.get('chapters') === '0') return null;
  const cur = Q.get('chapter') === 'combat' ? ({ toughs3: 1, captain: 2, daifuku: 3 }[Q.get('fight') || 'toughs3'] ?? 1) : 0;
  const el = document.createElement('nav');
  el.setAttribute('aria-label', 'Chapters');
  el.style.cssText = 'position:fixed;left:16px;top:14px;z-index:40;display:flex;align-items:center;gap:4px;padding:5px 6px 5px 12px;'
    + 'background:#FFF6E3;border:3px solid #6B4A35;border-radius:22px 26px 23px 27px;box-shadow:3px 4px 0 rgba(110,106,168,.55);'
    + "font:800 15px/1 'M PLUS Rounded 1c',ui-rounded,system-ui,sans-serif;color:#6B4A35;max-width:calc(100% - 32px);flex-wrap:wrap";
  const lab = document.createElement('span'); lab.textContent = 'Chapters'; lab.style.cssText = 'margin-right:6px;font-weight:700;opacity:.85'; el.appendChild(lab);
  CHAPTERS.forEach(([name, q], i) => {
    const a = document.createElement('a');
    a.textContent = i ? (i === 1 ? 'Combat: ' : '') + name : name;
    a.href = location.pathname + q;
    a.style.cssText = 'text-decoration:none;padding:6px 11px;border-radius:999px;min-height:24px;display:inline-flex;align-items:center;'
      + (i === cur ? 'background:#F2B01E;color:#33273B;border:2px solid #33273B' : 'color:#6B4A35;border:2px solid transparent');
    if (i === cur) a.setAttribute('aria-current', 'page');
    el.appendChild(a);
  });
  document.body.appendChild(el);
  return el;
}
