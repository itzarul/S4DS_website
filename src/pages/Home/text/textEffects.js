/** @param {import("../../../lib/effectScope").EffectScope} scope */
export default function mount(scope) {
  const { window, document, requestAnimationFrame, cancelAnimationFrame, matchMedia } =
    scope.environment;
  (() => {
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const noise = 'X_:.<>/';
    const states = [];
    let raf = 0;
    const sample = (chars) => chars[Math.floor(Math.random() * chars.length)];

    // DOM ranges retain kerning, explicit line breaks and responsive word wrapping.
    function measure(el) {
      const box = el.getBoundingClientRect();
      const scaleX = box.width / (el.offsetWidth || box.width);
      const scaleY = box.height / (el.offsetHeight || box.height);
      const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
      const cells = [];
      let node;
      while ((node = walker.nextNode())) {
        if (node.parentElement.closest('.text-fx-layer, .sr-only')) continue;
        if (
          node.parentElement.closest('[aria-hidden="true"]') &&
          !node.parentElement.closest('.connect-intro')
        )
          continue;
        if (getComputedStyle(node.parentElement).visibility === 'hidden') continue;
        const style = getComputedStyle(node.parentElement);
        for (let index = 0; index < node.length; index++) {
          let letter = node.textContent[index];
          if (/\s/.test(letter)) continue;
          const range = document.createRange();
          range.setStart(node, index);
          range.setEnd(node, index + 1);
          const rect = range.getBoundingClientRect();
          if (!rect.width || !rect.height) continue;
          if (style.textTransform === 'uppercase') letter = letter.toUpperCase();
          cells.push({
            letter,
            x: (rect.left - box.left) / scaleX - el.clientLeft,
            y: (rect.top - box.top) / scaleY - el.clientTop,
            width: rect.width / scaleX,
            height: rect.height / scaleY,
            font: `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`,
            color: style.color,
          });
        }
      }
      return { cells, box, scaleX, scaleY };
    }
    window.TextEffectGeometry = { measure };

    function visible(el) {
      if (el.closest('.hero-layout') && (window.storyVirtual || 0) > 0.01) return false;
      if (el.closest('[inert], [hidden], [aria-hidden="true"]')) return false;
      const box = el.getBoundingClientRect();
      return (
        box.width > 0 &&
        box.height > 0 &&
        box.bottom > 0 &&
        box.top < innerHeight &&
        getComputedStyle(el).visibility !== 'hidden'
      );
    }
    function finish(state) {
      state.layer?.remove();
      state.layer = null;
      state.cells = [];
      state.el.classList.remove('text-fx-active');
      state.el.style.removeProperty('--text-fx-color');
      state.active = false;
    }
    function build(state) {
      const el = state.el;
      const { cells } = measure(el);
      if (!cells.length) return false;
      const color = getComputedStyle(el).color;
      if (getComputedStyle(el).position === 'static') el.style.position = 'relative';
      const layer = document.createElement('span');
      layer.className = 'text-fx-layer';
      layer.setAttribute('aria-hidden', 'true');
      state.cells = cells.map((cell, index) => {
        const slot = document.createElement('span');
        slot.className = 'text-fx-cell';
        Object.assign(slot.style, {
          left: `${cell.x}px`,
          top: `${cell.y}px`,
          width: `${cell.width}px`,
          height: `${cell.height}px`,
          font: cell.font,
          lineHeight: `${cell.height}px`,
        });
        const glyph = document.createElement('span');
        glyph.className = 'text-fx-glyph';
        glyph.textContent = cell.letter;
        slot.append(glyph);
        layer.append(slot);
        return { ...cell, index, slot, glyph, until: 0, lastStep: -1 };
      });
      state.layer = layer;
      el.style.setProperty('--text-fx-color', color);
      el.append(layer);
      el.classList.add('text-fx-active');
      return true;
    }
    function setGlyph(cell, letter) {
      cell.glyph.textContent = letter;
      // Scramble glyphs fit their reserved slots rather than moving adjacent letters.
      cell.glyph.style.transform =
        letter === cell.letter
          ? ''
          : `scaleX(${Math.min(1, cell.width / Math.max(cell.width, cell.glyph.scrollWidth))})`;
    }
    function start(state) {
      if (reduced.matches || document.hidden || !visible(state.el) || state.active) return;
      if (!build(state)) return;
      state.active = true;
      state.started = performance.now() + (state.kind === 'scramble' ? 0 : state.delay);
      state.played = true;
      if (state.kind === 'type') {
        state.cursor = document.createElement('span');
        state.cursor.className = 'text-fx-cursor';
        state.layer.append(state.cursor);
        state.cells.forEach((cell) => (cell.slot.style.opacity = '0'));
      }
      if (state.kind === 'flap') {
        state.cells.forEach((cell) => {
          cell.slot.classList.add('text-fx-cell--flap');
          cell.glyph.remove();
          cell.halves = ['top', 'bottom', 'top front', 'bottom back'].map((names) => {
            const half = document.createElement('span');
            half.className =
              'text-fx-half ' +
              names
                .split(' ')
                .map((n) => `text-fx-half--${n}`)
                .join(' ');
            const glyph = document.createElement('span');
            glyph.textContent = cell.letter;
            half.append(glyph);
            cell.slot.append(half);
            return half;
          });
          cell.sequence = [
            cell.letter,
            ...Array.from({ length: 4 }, () => sample(alphabet)),
            cell.letter,
          ];
        });
      }
      wake();
    }
    function tick(now) {
      raf = 0;
      let active = false;
      for (const state of states) {
        if (!state.active) continue;
        if (reduced.matches || document.hidden || !visible(state.el)) {
          finish(state);
          continue;
        }
        const age = now - state.started;
        if (state.kind === 'type') {
          const count = Math.max(0, Math.floor(age / 20));
          state.cells.forEach((cell, i) => (cell.slot.style.opacity = i < count ? '1' : '0'));
          const cell = state.cells[Math.min(Math.max(0, count - 1), state.cells.length - 1)];
          Object.assign(state.cursor.style, {
            left: `${cell.x + (count ? cell.width : 0) + 2}px`,
            top: `${cell.y + 2}px`,
            height: `${cell.height - 4}px`,
            opacity: String(Math.floor(Math.max(age, 0) / 420) % 2 ? 0 : 1),
          });
          if (age > state.cells.length * 20 + 260) finish(state);
        } else if (state.kind === 'flap') {
          state.cells.forEach((cell) => {
            const local = Math.max(0, age - cell.index * 32);
            const step = Math.min(4, Math.floor(local / 115));
            const t = Math.min(1, (local - step * 115) / 115);
            const [top, bottom, front, back] = cell.halves;
            top.firstChild.textContent = cell.sequence[step + 1];
            bottom.firstChild.textContent = cell.sequence[step];
            front.firstChild.textContent = cell.sequence[step];
            back.firstChild.textContent = cell.sequence[step + 1];
            front.style.transform = `rotateX(${-90 * Math.min(1, t * 2)}deg)`;
            back.style.transform = `rotateX(${90 * (1 - Math.max(0, t * 2 - 1))}deg)`;
          });
          if (age > state.cells.length * 32 + 575) finish(state);
        } else if (state.kind === 'decrypt') {
          const step = Math.floor(Math.max(age, 0) / 48);
          state.cells.forEach((cell) => {
            const order = Math.abs(cell.index - (state.cells.length - 1) / 2) * 2;
            const settled = age > 200 + order * 27;
            if (cell.lastStep !== step) {
              setGlyph(cell, settled ? cell.letter : sample(alphabet + '.:/'));
              cell.lastStep = step;
            }
          });
          if (age > 260 + state.cells.length * 27) finish(state);
        } else {
          let moving = false;
          const step = Math.floor(now / 60);
          state.cells.forEach((cell) => {
            const scrambling = cell.until > now;
            moving ||= scrambling;
            if (cell.lastStep !== step) {
              setGlyph(cell, scrambling ? sample(noise) : cell.letter);
              cell.lastStep = step;
            }
          });
          if (!moving) finish(state);
        }
        active ||= state.active;
      }
      if (active) wake();
    }
    function wake() {
      if (!raf) raf = requestAnimationFrame(tick);
    }
    function add(selector, kind, delay = 0) {
      document.querySelectorAll(selector).forEach((el) => {
        if (el.dataset.textEffect) return;
        el.dataset.textEffect = kind;
        const state = { el, kind, delay, active: false, played: false, cells: [] };
        states.push(state);
        {
          el.addEventListener('pointermove', (event) => {
            if (event.pointerType === 'touch' || reduced.matches || !visible(el)) return;
            if (state.active && state.kind !== 'scramble') return;
            if (!state.active) {
              state.kind = 'scramble';
              start(state);
            }
            const box = el.getBoundingClientRect();
            const sx = box.width / (el.offsetWidth || box.width),
              sy = box.height / (el.offsetHeight || box.height);
            const nearest = state.cells
              .map((cell) => ({
                cell,
                distance: Math.hypot(
                  event.clientX - (box.left + (cell.x + cell.width / 2) * sx),
                  event.clientY - (box.top + (cell.y + cell.height / 2) * sy),
                ),
              }))
              .sort((a, b) => a.distance - b.distance)
              .slice(0, 4);
            state.cells.forEach((cell) => (cell.until = 0));
            for (const { cell, distance } of nearest)
              if (distance < 52) cell.until = performance.now() + 260;
            wake();
          });
        }
      });
    }
    window.TextEffects = {
      play(selector, kind) {
        states
          .filter((s) => s.el.matches(selector))
          .forEach((state) => {
            finish(state);
            state.kind = kind;
            state.delay = 0;
            start(state);
          });
      },
      stop() {
        states.forEach(finish);
      },
      sync(virtual) {
        if (virtual > 0.01)
          states.filter((s) => s.active && s.el.closest('.hero-layout')).forEach(finish);
      },
      ready: false,
    };
    scope.when(document.fonts.ready, () => {
      add(
        '.hero-location, .deck-kicker, .archive-kicker, .deck-subtitle, .archive-subtitle, .hero-tag p, .deck-mode p, .archive-mode p, .deck-note p, .archive-note p, .connect-kicker, .connect-title-line',
        'scramble',
      );
      window.TextEffects.ready = true;
      window.dispatchEvent(new Event('text-effects-ready'));
      window.addEventListener(
        'pagehide',
        () => {
          states.forEach(finish);
          cancelAnimationFrame(raf);
        },
        { once: true },
      );
    });
    const stop = () => {
      states.forEach(finish);
      cancelAnimationFrame(raf);
      raf = 0;
    };
    window.addEventListener('resize', stop, { passive: true });
    window.addEventListener(
      'scroll',
      () =>
        states.forEach((s) => {
          if (s.active && !visible(s.el)) finish(s);
        }),
      { passive: true },
    );
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) stop();
    });
    reduced.addEventListener('change', stop);
  })();
}
