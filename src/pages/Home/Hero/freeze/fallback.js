/** @param {import("../../../../lib/effectScope").EffectScope} scope */
export default function mount(scope) {
  const { window, document } = scope.environment;
  window.mountFreezeFallback = (canvas) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    document.body.append(canvas);
    const bg = new Image(),
      object = new Image();
    bg.src = 'assets/hero-background.webp';
    object.src = 'assets/hero-sculpture-reference.webp';
    let active = false;
    function draw() {
      if (!active) return;
      canvas.width = Math.min(innerWidth, 1200);
      canvas.height = Math.round((canvas.width * innerHeight) / innerWidth);
      const w = canvas.width,
        h = canvas.height;
      ctx.fillStyle = '#02040b';
      ctx.fillRect(0, 0, w, h);
      if (bg.complete && bg.naturalWidth) {
        ctx.globalAlpha = 0.7;
        ctx.drawImage(bg, 0, 0, w, h);
        ctx.globalAlpha = 1;
      }
      const size = Math.min(h * 0.55, w * 0.8);
      if (object.complete && object.naturalWidth) {
        ctx.globalCompositeOperation = 'screen';
        ctx.drawImage(object, w * 0.49 - size / 2, h * 0.4 - size / 2, size, size);
        ctx.globalCompositeOperation = 'source-over';
      }
      const hud = window.FreezeConsole?.render(innerWidth, innerHeight);
      if (hud) ctx.drawImage(hud, 0, 0, w, h);
      canvas.dataset.tick = String(performance.now());
    }
    bg.onload = object.onload = scope.guard(draw);
    window.addEventListener('freezeconsoleready', draw);
    window.HeroLiquid = {
      setTransition() {},
      start() {
        active = true;
        canvas.dataset.fallback = 'true';
        document.documentElement.classList.add('liquid-ready');
        draw();
      },
      stop() {
        active = false;
        document.documentElement.classList.remove('liquid-ready');
      },
    };
  };
}
