/** @param {import("../../../lib/effectScope").EffectScope} scope */
export default function mount(scope) {
  const {
    window,
    document,
    requestAnimationFrame,
    cancelAnimationFrame,
    setTimeout,
    clearTimeout,
    matchMedia,
  } = scope.environment;
  // One left-to-right decode on arrival; the original text reserves its exact layout.
  window.playHeroDecode = () => {
    const heading = document.querySelector('#hero-title');
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    if (!heading || reduced.matches || scrollY > 40) return;
    const lines = [...heading.children];
    const original = lines.map((line) => line.textContent);
    const glyphs = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$%#@';
    const characters = [];
    let frame = 0,
      done = false;
    heading.setAttribute('aria-label', original.join(' '));
    heading.style.visibility = 'hidden';
    function finish() {
      done = true;
      cancelAnimationFrame(frame);
      lines.forEach((line, index) => {
        line.textContent = original[index];
        line.style.removeProperty('position');
        line.style.removeProperty('color');
        line.removeAttribute('aria-hidden');
      });
      heading.style.removeProperty('visibility');
      heading.removeAttribute('aria-label');
      window.removeEventListener('scroll', interrupt);
      window.removeEventListener('resize', finish);
      reduced.removeEventListener('change', finish);
    }
    function interrupt() {
      if (scrollY > 40) finish();
    }
    window.stopHeroDecode = finish;
    window.addEventListener('scroll', interrupt, { passive: true });
    window.addEventListener('resize', finish, { once: true });
    reduced.addEventListener('change', finish, { once: true });
    // A slow font must not leave the title hidden indefinitely.
    const fallback = setTimeout(finish, 2500);
    scope
      .when(document.fonts.ready, () => {
        if (done) return;
        clearTimeout(fallback);
        const measure = document.createElement('canvas').getContext('2d');
        lines.forEach((line, row) => {
          const style = getComputedStyle(line);
          const color = style.color;
          measure.font = `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
          const widths = Object.fromEntries(
            [...glyphs].map((glyph) => [glyph, measure.measureText(glyph).width]),
          );
          const node = line.firstChild;
          const box = line.getBoundingClientRect();
          const range = document.createRange();
          const cells = [...original[row]].map((letter, index) => {
            range.setStart(node, index);
            range.setEnd(node, index + 1);
            const rect = range.getBoundingClientRect();
            return { letter, left: rect.left - box.left, width: rect.width, index };
          });
          line.style.position = 'relative';
          line.style.color = 'transparent';
          line.setAttribute('aria-hidden', 'true');
          for (const cell of cells) {
            if (cell.letter === ' ') continue;
            const glyph = document.createElement('span');
            Object.assign(glyph.style, {
              position: 'absolute',
              left: `${cell.left}px`,
              top: '0',
              color,
              transformOrigin: 'left center',
              opacity: '0',
            });
            line.append(glyph);
            characters.push({ ...cell, glyph, widths, delay: row * 170 + cell.index * 64 });
          }
        });
        heading.style.visibility = 'visible';
        const started = performance.now();
        let lastStep = -1;
        function render(now) {
          if (done) return;
          const elapsed = now - started;
          const step = Math.floor(elapsed / 65);
          if (step !== lastStep) {
            lastStep = step;
            for (const cell of characters) {
              const age = elapsed - cell.delay;
              const settled = age >= 560;
              const text = settled
                ? cell.letter
                : glyphs[Math.floor(Math.random() * glyphs.length)];
              cell.glyph.textContent = text;
              cell.glyph.style.opacity = String(Math.max(0, Math.min(1, age / 160)));
              cell.glyph.style.transform = settled
                ? 'none'
                : `scaleX(${Math.min(1, cell.width / (cell.widths[text] || cell.width))})`;
            }
          }
          if (elapsed >= 1450) finish();
          else frame = requestAnimationFrame(render);
        }
        frame = requestAnimationFrame(render);
      })
      .catch(finish);
  };
}
