
  /* ------------------------------------------------------------------ painted world (never inked) */
  /** Shared <defs>: paint filters. Put Kit.defs() once at the top of every <svg>. */
  function defs() {
    const disp = (id, f, oct, sc, seed, blur) => `<filter id="${id}" x="-30%" y="-30%" width="160%" height="160%" color-interpolation-filters="sRGB"><feTurbulence type="fractalNoise" baseFrequency="${f}" numOctaves="${oct}" seed="${seed}" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="${sc}" xChannelSelector="R" yChannelSelector="G"${blur ? ' result="d"' : ''}/>${blur ? `<feGaussianBlur in="d" stdDeviation="${blur}"/>` : ''}</filter>`;
    return `<defs>
      ${disp('k-rough', 0.022, 2, 6, 3)}${disp('k-wobble', 0.008, 2, 14, 5)}
      ${disp('k-leaf', 0.038, 2, 26, 7)}${disp('k-leaf-fine', 0.075, 2, 13, 11)}${disp('k-leaf-far', 0.02, 2, 16, 4, 0.8)}
      ${disp('k-cloud', 0.0075, 3, 46, 9, 1.1)}${disp('k-cloud-fine', 0.02, 2, 16, 2, 0.6)}
      ${disp('k-dab', 0.05, 1, 5, 13)}
      <filter id="k-soft" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="5"/></filter>
      <filter id="k-soft2" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="16"/></filter>
      <filter id="k-soft3" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="42"/></filter>
      <filter id="k-contact" x="-30%" y="-60%" width="160%" height="220%"><feGaussianBlur stdDeviation="2.6"/></filter>
      <filter id="k-grain" x="0" y="0" width="100%" height="100%" color-interpolation-filters="sRGB"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="21"/><feColorMatrix values="0 0 0 0 0.42  0 0 0 0 0.36  0 0 0 0 0.5  0.9 0.5 0 0 -0.52"/></filter>
      <filter id="k-brush" x="0" y="0" width="100%" height="100%" color-interpolation-filters="sRGB"><feTurbulence type="fractalNoise" baseFrequency="0.004 0.09" numOctaves="3" seed="8"/><feColorMatrix values="0 0 0 0 0.43  0 0 0 0 0.41  0 0 0 0 0.66  1.5 0 0 0 -0.62"/></filter>
      <filter id="k-brush-v" x="0" y="0" width="100%" height="100%" color-interpolation-filters="sRGB"><feTurbulence type="fractalNoise" baseFrequency="0.07 0.005" numOctaves="3" seed="18"/><feColorMatrix values="0 0 0 0 0.43  0 0 0 0 0.41  0 0 0 0 0.66  1.5 0 0 0 -0.62"/></filter>
      <filter id="k-mottle" x="0" y="0" width="100%" height="100%" color-interpolation-filters="sRGB"><feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves="4" seed="31"/><feColorMatrix values="0 0 0 0 0.43  0 0 0 0 0.41  0 0 0 0 0.66  1.6 0 0 0 -0.7"/></filter>
      <filter id="k-mottle-light" x="0" y="0" width="100%" height="100%" color-interpolation-filters="sRGB"><feTurbulence type="fractalNoise" baseFrequency="0.016" numOctaves="3" seed="44"/><feColorMatrix values="0 0 0 0 1  0 0 0 0 0.98  0 0 0 0 0.9  0 1.7 0 0 -0.78"/></filter>
      <filter id="k-dry" x="-10%" y="-10%" width="120%" height="120%"><feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="2" seed="6" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="5"/></filter>
    </defs>`;
