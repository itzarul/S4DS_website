/** @param {import("../../lib/effectScope").EffectScope} scope */
export default function mount(scope) {
  const {
    window,
    document,
    setTimeout,
    clearTimeout,
    matchMedia,
    IntersectionObserver,
    ResizeObserver,
  } = scope.environment;
  // Quiet recording signals, independent of the entrance/scroll timelines.
  (() => {
    const matrix = document.querySelector('.deck-dots');
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    const animations = new Set();
    let dots = [],
      dotTimer;

    function shown(el) {
      if (
        !el ||
        window.HeroFreeze?.active ||
        reduced.matches ||
        document.hidden ||
        el.closest('[inert]')
      )
        return false;
      const box = el.getBoundingClientRect();
      if (!box.width || !box.height || box.bottom <= 0 || box.top >= innerHeight) return false;
      for (let node = el; node instanceof Element; node = node.parentElement) {
        const style = getComputedStyle(node);
        if (style.visibility !== 'visible' || Number(style.opacity) < 0.9) return false;
      }
      return true;
    }
    function pulse(el, frames, duration) {
      const animation = el.animate(frames, { duration, easing: 'ease-in-out' });
      animations.add(animation);
      animation.onfinish = animation.oncancel = () => animations.delete(animation);
    }
    function rebuildDots() {
      if (!matrix) return;
      dots.forEach((dot) => dot.getAnimations().forEach((animation) => animation.cancel()));
      // Match the existing radial-gradient tile centres at every breakpoint.
      const [stepX, stepY] = getComputedStyle(matrix).backgroundSize.split(' ').map(parseFloat);
      const width = matrix.clientWidth,
        height = matrix.clientHeight;
      if (!width || !height || !stepX || !stepY) return;
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
      svg.setAttribute('aria-hidden', 'true');
      dots = [];
      for (let y = stepY / 2; y < height; y += stepY) {
        for (let x = stepX / 2; x < width; x += stepX) {
          const dot = document.createElementNS(svg.namespaceURI, 'circle');
          dot.setAttribute('cx', x);
          dot.setAttribute('cy', y);
          dot.setAttribute('r', '1.2');
          svg.append(dot);
          dots.push(dot);
        }
      }
      matrix.replaceChildren(svg);
      matrix.classList.add('has-individual-dots');
    }
    function dotTick() {
      if (shown(matrix) && dots.length > 1) {
        const available = dots.filter((dot) => !dot.getAnimations().length);
        const count = Math.min(available.length, Math.max(3, Math.round(dots.length * 0.15)));
        for (let i = 0; i < count; i++) {
          const [dot] = available.splice(Math.floor(Math.random() * available.length), 1);
          pulse(
            dot,
            [
              { opacity: 1 },
              { opacity: 0.12, offset: 0.3 },
              { opacity: 0.8, offset: 0.55 },
              { opacity: 0.3, offset: 0.7 },
              { opacity: 1 },
            ],
            750 + Math.random() * 700,
          );
        }
      }
      dotTimer = setTimeout(dotTick, 500 + Math.random() * 450);
    }
    function stop() {
      clearTimeout(dotTimer);
      animations.forEach((animation) => animation.cancel());
      animations.clear();
    }
    function sync() {
      stop();
      if (!document.hidden && !reduced.matches) {
        dotTimer = setTimeout(dotTick, 900);
      }
    }
    const resize = new ResizeObserver(rebuildDots);
    if (matrix) resize.observe(matrix);
    const visibility = new IntersectionObserver((entries) => {
      for (const entry of entries)
        if (!entry.isIntersecting) {
          entry.target.getAnimations({ subtree: true }).forEach((animation) => animation.cancel());
        }
    });
    if (matrix) visibility.observe(matrix);
    document.addEventListener('visibilitychange', sync);
    reduced.addEventListener('change', sync);
    sync();
    window.addEventListener(
      'pagehide',
      () => {
        stop();
        resize.disconnect();
        visibility.disconnect();
      },
      { once: true },
    );
  })();
}
