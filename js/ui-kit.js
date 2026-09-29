/* Mascotte (SVG) et icônes. Aucune dépendance externe. */
(function (A) {
  'use strict';

  /* Mascotte : explorateur à la loupe. mood = 'search' | 'happy' */
  function mascot(mood = 'search') {
    const happy = mood === 'happy';
    const eyes = happy
      ? `<path d="M68 96 Q82 80 96 96" stroke="#3b2210" stroke-width="6" fill="none" stroke-linecap="round"/>
         <path d="M124 96 Q138 80 152 96" stroke="#3b2210" stroke-width="6" fill="none" stroke-linecap="round"/>`
      : `<ellipse cx="82" cy="94" rx="10" ry="12" fill="#fff" stroke="#3b2210" stroke-width="3"/>
         <circle cx="85" cy="96" r="5.5" fill="#3b2210"/><circle cx="87" cy="93" r="1.8" fill="#fff"/>`;
    const lens = happy
      ? `<g transform="translate(6 -58) rotate(18 160 130)">
           <path d="M160 122 L186 166" stroke="#7a4b1e" stroke-width="12" stroke-linecap="round"/>
           <circle cx="150" cy="96" r="30" fill="#bfe6ff" fill-opacity=".55" stroke="#e0a020" stroke-width="9"/>
           <path d="M134 84 Q140 74 152 72" stroke="#fff" stroke-width="5" fill="none" stroke-linecap="round" opacity=".8"/>
         </g>
         <path d="M162 176 Q200 150 196 100" stroke="#c9a66b" stroke-width="22" fill="none" stroke-linecap="round"/>
         <circle cx="196" cy="98" r="14" fill="#f2c29b"/>`
      : `<circle cx="140" cy="92" r="31" fill="#bfe6ff" fill-opacity=".5" stroke="#e0a020" stroke-width="9"/>
         <ellipse cx="140" cy="92" rx="19" ry="22" fill="#fff" stroke="#3b2210" stroke-width="3"/>
         <circle cx="144" cy="94" r="10" fill="#3b2210"/><circle cx="148" cy="89" r="3.4" fill="#fff"/>
         <path d="M162 116 L190 154" stroke="#7a4b1e" stroke-width="12" stroke-linecap="round"/>
         <circle cx="190" cy="154" r="13" fill="#f2c29b"/>`;
    const mouth = happy
      ? `<path d="M86 122 Q110 154 134 122 Z" fill="#7a1f1f" stroke="#3b2210" stroke-width="3" stroke-linejoin="round"/><path d="M96 130 Q110 142 124 130 Q110 136 96 130Z" fill="#ff8a8a"/>`
      : `<path d="M90 126 Q110 146 130 126 Q110 134 90 126Z" fill="#fff" stroke="#3b2210" stroke-width="3" stroke-linejoin="round"/>`;
    return `<svg viewBox="0 0 220 230" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Anachro, la mascotte exploratrice">
<path d="M14 232 C14 182 56 164 110 164 C164 164 206 182 206 232Z" fill="#c9a66b"/>
<path d="M84 164 L110 194 L136 164Z" fill="#f6e8c8"/>
<rect x="92" y="146" width="36" height="26" rx="10" fill="#e8b48a"/>
<ellipse cx="56" cy="108" rx="9" ry="13" fill="#e8b48a"/><ellipse cx="164" cy="108" rx="9" ry="13" fill="#e8b48a"/>
<ellipse cx="110" cy="104" rx="56" ry="52" fill="#f2c29b"/>
<path d="M56 112 C60 162 160 162 164 112 C150 134 70 134 56 112Z" fill="#6b4226"/>
${mouth}
<ellipse cx="111" cy="112" rx="9" ry="7" fill="#e6a27a"/>
${eyes}
${lens}
<ellipse cx="110" cy="64" rx="84" ry="19" fill="#8b5a2b"/>
<path d="M50 64 C50 18 170 18 170 64Z" fill="#a46c36"/>
<path d="M52 56 C82 68 138 68 168 56 L170 64 C140 78 80 78 50 64Z" fill="#4a2a10"/>
<path d="M64 40 Q110 22 156 40" stroke="#c48a4a" stroke-width="5" fill="none" stroke-linecap="round" opacity=".7"/>
</svg>`;
  }

  const P = {
    home: 'M3 11.5 12 4l9 7.5V21h-6v-6H9v6H3z',
    trophy: 'M7 4h10v5a5 5 0 0 1-10 0zM7 6H4v2a3 3 0 0 0 3 3M17 6h3v2a3 3 0 0 1-3 3M12 14v4M8 21h8M9.5 18h5',
    user: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21c0-4 3.6-6 8-6s8 2 8 6',
    pause: 'M8 5v14M16 5v14',
    bulb: 'M9 18h6M10 21h4M12 3a6 6 0 0 0-3.6 10.8c.7.6 1.1 1.3 1.1 2.2h5c0-.9.4-1.6 1.1-2.2A6 6 0 0 0 12 3z',
    search: 'M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14zM16.5 16.5 21 21M8 11h6M11 8v6',
    share: 'M12 15V3M7.5 7.5 12 3l4.5 4.5M5 12v6a3 3 0 0 0 3 3h8a3 3 0 0 0 3-3v-6',
    retry: 'M4 12a8 8 0 1 0 2.6-5.9M4 4v5h5',
    back: 'M15 5l-7 7 7 7',
    next: 'M9 5l7 7-7 7',
    lock: 'M7 11V8a5 5 0 0 1 10 0v3M6 11h12v9H6z',
    clock: 'M12 21a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM12 8v4.5l3 2'
  };
  const F = {
    star: 'M12 2l3 7 7.4.6-5.6 4.8 1.8 7.3L12 18l-6.6 3.7 1.8-7.3L1.6 9.6 9 9z',
    heart: 'M12 21S4 15.7 4 9.9A4.4 4.4 0 0 1 12 7.2 4.4 4.4 0 0 1 20 9.9C20 15.7 12 21 12 21z',
    flame: 'M12 2c1.2 4.2 6 5.6 6 11a6 6 0 0 1-12 0c0-2.2 1-3.7 2.4-5 .2 2 1 3 2.2 3.2C9.4 8.4 10 5 12 2z'
  };

  function icon(name, size = 22) {
    if (F[name]) return `<svg class="ic ic-fill ic-${name}" width="${size}" height="${size}" viewBox="0 0 24 24" aria-hidden="true"><path d="${F[name]}" fill="currentColor"/></svg>`;
    return `<svg class="ic" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${P[name]}"/></svg>`;
  }

  const stars = (n, max = 3, size = 26) =>
    `<span class="stars" aria-label="${n} étoile${n > 1 ? 's' : ''} sur ${max}">${Array.from({ length: max }, (_, i) => `<span class="star ${i < n ? 'on' : ''}">${icon('star', size)}</span>`).join('')}</span>`;

  const logo = () => `<h1 class="logo" aria-label="Anachro"><span>ANACHR</span><svg class="logo-clock" viewBox="0 0 64 64" aria-hidden="true"><circle cx="32" cy="32" r="28" fill="#fff6e3" stroke="#6b3f17" stroke-width="8"/><circle cx="32" cy="32" r="28" fill="none" stroke="#ffc93c" stroke-width="3"/><path d="M32 16v17l11 7" stroke="#6b3f17" stroke-width="6" fill="none" stroke-linecap="round"/><circle cx="32" cy="32" r="4" fill="#c1392b"/></svg></h1>`;

  A.ui = { mascot, icon, stars, logo };
})(window.Anachro = window.Anachro || {});
