/** @param {import("../../../lib/effectScope").EffectScope} scope */
export default function mount(scope) {
  const {
    window,
    document,
    requestAnimationFrame,
    cancelAnimationFrame,
    matchMedia,
    IntersectionObserver,
    ResizeObserver,
  } = scope.environment;
  // One scroll-controlled composition: scene arrival, pin, then butterfly + wordmark.
  (() => {
    const footer = document.querySelector('.connect-footer');
    if (!footer) return;
    const stage = footer.querySelector('.connect-stage'),
      host = footer.querySelector('.connect-world'),
      button = footer.querySelector('.connect-motion');
    const reduced = matchMedia('(prefers-reduced-motion: reduce)'),
      letters = [...footer.querySelectorAll('.connect-wordmark span')];
    const clamp = (n) => Math.max(0, Math.min(1, n)),
      ease = (n) => 1 - Math.pow(1 - n, 3);
    let controller,
      started = false,
      visible = false,
      paused = false,
      frame = 0,
      progress = 0;
    const typed = [
      ...footer.querySelectorAll(
        '.connect-kicker,.connect-title-line,.connect-contacts h3,.connect-person p,.connect-person a',
      ),
    ].map((el) => {
      const text = el.textContent,
        accessible = document.createElement('span'),
        visual = document.createElement('span');
      accessible.className = 'sr-only';
      accessible.textContent = text;
      visual.setAttribute('aria-hidden', 'true');
      const chars = [...text].map((char) => {
        const span = document.createElement('span');
        span.className = 'connect-typed-char';
        span.textContent = char;
        visual.append(span);
        return span;
      });
      el.replaceChildren(accessible, visual);
      scope.own(() => {
        el.textContent = text;
      });
      return { el, chars, count: -1 };
    });
    function render() {
      frame = 0;
      progress = reduced.matches
        ? 1
        : clamp(
            -footer.getBoundingClientRect().top /
              Math.max(1, footer.offsetHeight - stage.offsetHeight),
          );
      footer.dataset.progress = progress.toFixed(3);
      const reveal = clamp((progress - 0.08) / 0.52);
      controller?.setReveal(reveal * reveal * (3 - 2 * reveal));
      letters.forEach((el, i) => {
        const p = ease(clamp((progress - 0.08 - (letters.length - 1 - i) * 0.17) / 0.25));
        el.style.transform = `translateY(${(1 - p) * 108}%)`;
      });
      typed.forEach((item, i) => {
        const count = Math.ceil(clamp((progress - 0.015 - i * 0.055) / 0.28) * item.chars.length);
        if (count === item.count) return;
        item.count = count;
        item.chars.forEach((char, j) => (char.style.visibility = j < count ? 'visible' : 'hidden'));
        item.el.style.setProperty('--typed-progress', count > 0 ? '1' : '0');
      });
    }
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(render);
    };
    const sync = () => {
      controller?.setActive(visible && !document.hidden && !paused && !reduced.matches);
      footer.dataset.motionPaused = String(paused);
      window.dispatchEvent(new Event('footermotionchange'));
    };
    button.addEventListener('click', () => {
      paused = !paused;
      button.setAttribute('aria-pressed', String(paused));
      button.textContent = paused ? 'Resume motion' : 'Pause motion';
      sync();
      if (paused) render();
    });
    reduced.addEventListener('change', () => {
      button.hidden = reduced.matches;
      render();
      sync();
    });
    button.hidden = reduced.matches;
    const loading = new IntersectionObserver(
      async (entries) => {
        if (!entries.some((e) => e.isIntersecting) || started) return;
        started = true;
        loading.disconnect();
        try {
          const { createFooterWorld } = await import('./footerScene.js');
          if (scope.disposed) return;
          scope.run(() => {
            controller = createFooterWorld(host, footer);
            render();
            sync();
          });
        } catch (error) {
          host.dataset.renderer = 'unavailable';
          console.warn('Footer scene could not load', error);
        }
      },
      { rootMargin: '400px' },
    );
    loading.observe(footer);
    const visibility = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) render();
      sync();
    });
    visibility.observe(stage);
    const sizes = new ResizeObserver(schedule);
    sizes.observe(stage);
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    document.addEventListener('visibilitychange', sync);
    window.addEventListener('pagehide', (e) => {
      controller?.setActive(false);
      if (!e.persisted) {
        cancelAnimationFrame(frame);
        loading.disconnect();
        visibility.disconnect();
        sizes.disconnect();
        window.removeEventListener('scroll', schedule);
        window.removeEventListener('resize', schedule);
        controller?.dispose();
      }
    });
    window.addEventListener('pageshow', () => {
      render();
      sync();
    });
    render();
  })();
}
