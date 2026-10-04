/** @param {import("../../lib/effectScope").EffectScope} scope */
export default function mount(scope) {
  const {
    window,
    document,
    requestAnimationFrame,
    cancelAnimationFrame,
    matchMedia,
    IntersectionObserver,
  } = scope.environment;
  // Independent dust layers keep their pace when scrolling stops.
  (() => {
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
    const pointer = { x: 0, y: 0, active: false };
    window.addEventListener(
      'pointermove',
      (event) => {
        pointer.x = event.clientX;
        pointer.y = event.clientY;
        pointer.active = finePointer.matches && event.pointerType !== 'touch';
      },
      { passive: true },
    );
    document.documentElement.addEventListener('pointerleave', () => {
      pointer.active = false;
    });
    window.addEventListener('blur', () => {
      pointer.active = false;
    });
    const fields = [...document.querySelectorAll('.story-backdrop, .connect-particles')].map(
      (surface, index) => {
        const canvas = document.createElement('canvas');
        canvas.className = 'space-particles';
        canvas.setAttribute('aria-hidden', 'true');
        surface.append(canvas);
        return {
          surface,
          canvas,
          ctx: canvas.getContext('2d'),
          visible: false,
          stars: [],
          width: 0,
          height: 0,
          direction: index ? -1 : 1,
        };
      },
    );
    let frame = 0,
      previous = 0;
    function draw(field, dt) {
      const { ctx, width, height } = field;
      const bounds = pointer.active ? field.surface.getBoundingClientRect() : null;
      const follow = 1 - Math.exp(-dt * 4);
      ctx.clearRect(0, 0, width, height);
      for (const star of field.stars) {
        star.x = (star.x + field.direction * star.speed * dt + width) % width;
        star.y = (star.y - star.speed * 0.28 * dt + height) % height;
        star.phase += dt * 0.22;
        const dx = bounds ? star.x - (pointer.x - bounds.left) : 0;
        const dy = bounds ? star.y - (pointer.y - bounds.top) : 0;
        const distance = Math.hypot(dx, dy);
        const influence = bounds ? Math.max(0, 1 - distance / 140) : 0;
        const displacement = influence * influence * (6 + star.depth * 5);
        star.offsetX += ((dx / (distance || 1)) * displacement - star.offsetX) * follow;
        star.offsetY += ((dy / (distance || 1)) * displacement - star.offsetY) * follow;
        const edge = Math.min(
          1,
          star.x / 35,
          (width - star.x) / 35,
          star.y / 35,
          (height - star.y) / 35,
        );
        ctx.globalAlpha = edge * (0.42 + star.depth * 0.4) * (0.9 + Math.sin(star.phase) * 0.1);
        ctx.fillStyle = star.depth > 0.6 ? '#d3eaff' : '#6eafea';
        ctx.beginPath();
        ctx.arc(
          star.x + star.offsetX,
          star.y + star.offsetY,
          0.6 + star.depth * 1.05,
          0,
          Math.PI * 2,
        );
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    }
    function tick(now) {
      frame = 0;
      if (
        document.hidden ||
        window.HeroFreeze?.active ||
        reduced.matches ||
        !fields.some((field) => field.visible)
      )
        return;
      if (now - previous >= 1000 / 30) {
        const dt = previous ? Math.min((now - previous) / 1000, 0.08) : 0;
        fields
          .filter(
            (field) =>
              field.visible &&
              field.surface.closest('.connect-footer')?.dataset.motionPaused !== 'true',
          )
          .forEach((field) => draw(field, dt));
        previous = now;
      }
      frame = requestAnimationFrame(tick);
    }
    function sync() {
      cancelAnimationFrame(frame);
      frame = 0;
      previous = 0;
      if (
        !document.hidden &&
        !window.HeroFreeze?.active &&
        !reduced.matches &&
        fields.some((field) => field.visible)
      )
        frame = requestAnimationFrame(tick);
    }
    function resize() {
      for (const field of fields) {
        field.width = field.surface.clientWidth;
        field.height = field.surface.clientHeight;
        const density = Math.min(devicePixelRatio || 1, window.RenderQuality?.dpr || 1.5);
        field.canvas.width = Math.round(field.width * density);
        field.canvas.height = Math.round(field.height * density);
        field.ctx.setTransform(density, 0, 0, density, 0, 0);
        field.stars = Array.from(
          {
            length: Math.max(
              20,
              Math.min(
                window.RenderQuality?.low ? 65 : 180,
                Math.round((field.width * field.height) / 11000),
              ),
            ),
          },
          () => {
            const depth = Math.random();
            return {
              x: Math.random() * field.width,
              y: Math.random() * field.height,
              offsetX: 0,
              offsetY: 0,
              depth,
              speed: 4 + depth * 9,
              phase: Math.random() * Math.PI * 2,
            };
          },
        );
        draw(field, 0);
      }
      sync();
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries)
          fields.find((field) => field.surface === entry.target).visible =
            entry.isIntersecting && entry.intersectionRatio > 0.001;
        sync();
      },
      { threshold: [0, 0.001] },
    );
    fields.forEach((field) => observer.observe(field.surface));
    window.addEventListener('resize', resize);
    document.addEventListener('visibilitychange', sync);
    window.addEventListener('herofreezechange', sync);
    window.addEventListener('footermotionchange', sync);
    reduced.addEventListener('change', sync);
    resize();
  })();
}
