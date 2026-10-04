/** @param {import("../lib/effectScope").EffectScope} scope */
export default function mount(scope) {
  const { window, document, requestAnimationFrame, cancelAnimationFrame, matchMedia, gsap } =
    scope.environment;
  (() => {
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    const fine = matchMedia('(hover: hover) and (pointer: fine)');
    const trail = document.createElement('div');
    trail.className = 'cursor-fluid';
    const cursor = document.createElement('div');
    cursor.className = 'signal-cursor';
    [trail, cursor].forEach((el) => {
      el.setAttribute('aria-hidden', 'true');
      document.body.append(el);
    });
    cursor.innerHTML = `<svg viewBox="0 0 48 56" fill="none">
    <defs>
      <linearGradient id="arrow-edge" x1="7" y1="6" x2="36" y2="43" gradientUnits="userSpaceOnUse"><stop stop-color="#238bff"/><stop offset=".45" stop-color="#002aff"/><stop offset=".72" stop-color="#13e8ff"/><stop offset="1" stop-color="#043bff"/></linearGradient>
      <linearGradient id="arrow-silver" x1="9" y1="8" x2="36" y2="37" gradientUnits="userSpaceOnUse"><stop stop-color="#f0f8ff"/><stop offset=".35" stop-color="#425263"/><stop offset=".62" stop-color="#bfcedb"/><stop offset="1" stop-color="#eef9ff"/></linearGradient>
    </defs>
    <path d="M6 5L43 44L24 38L12 52Z" fill="#031635" stroke="#003bff" stroke-width="1.6"/>
    <path d="M6 5L43 44L24 38L12 52Z M9 10L15 43L23 33L36 38Z" fill="url(#arrow-edge)" fill-rule="evenodd"/>
    <path d="M9 10L23 33L15 43Z" fill="#050d17"/>
    <path d="M9 10L36 38L23 33Z" fill="url(#arrow-silver)"/>
    <path d="M9 10L27 34L36 38L23 33Z" fill="#a6b4c2" opacity=".65"/>
    <path d="M9 10L23 33L15 43M23 33L36 38M9 10L27 34" stroke="#dcefff" stroke-width=".55" opacity=".7"/>
    <path d="M6 5L12 51L24 38M7 6L42 43" stroke="#19d4ff" stroke-width=".65"/>
  </svg>`;
    const definitions = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    definitions.setAttribute('width', '0');
    definitions.setAttribute('height', '0');
    definitions.setAttribute('aria-hidden', 'true');
    definitions.style.position = 'absolute';
    definitions.innerHTML =
      '<defs><filter id="cursor-goo" x="0" y="0" width="360" height="360" filterUnits="userSpaceOnUse"><feGaussianBlur in="SourceGraphic" stdDeviation="9" result="blur"/><feColorMatrix in="blur" values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 35 -10"/></filter><mask id="cursor-blob-mask" maskUnits="userSpaceOnUse" maskContentUnits="userSpaceOnUse" x="0" y="0" width="360" height="360" style="mask-type:alpha"><g filter="url(#cursor-goo)" fill="white"><circle cx="180" cy="180" r="33"/><circle cx="180" cy="180" r="55"/><circle cx="180" cy="180" r="38"/></g></mask></defs>';
    document.body.append(definitions);
    const blobCircles = [...definitions.querySelectorAll('circle')];
    const blobs = [
      { x: 0, y: 0 },
      { x: 0, y: 0 },
      { x: 0, y: 0 },
    ];
    for (const name of ['hover', 'pressed']) {
      const image = new Image();
      image.src = `assets/cursor-arrow-${name}.svg`;
    }
    let navigating = false;
    let cursorRaf = 0,
      pointerX = 0,
      pointerY = 0;
    function finishNavigation() {
      navigating = false;
    }
    function clearCursor() {
      document.documentElement.classList.remove(
        'signal-pointer',
        'hand-pointer',
        'pointer-hover',
        'pointer-pressed',
      );
      cursor.style.opacity = '0';
      cursor.classList.remove('is-interactive', 'is-pressed');
      trail.style.opacity = '0';
      trail.classList.remove('is-pressed');
      window.gsap?.killTweensOf(blobs);
      cancelAnimationFrame(cursorRaf);
      cursorRaf = 0;
    }
    function drawBlob() {
      cursorRaf = 0;
      trail.style.transform = `translate3d(${pointerX - 180}px,${pointerY - 180}px,0)`;
      blobs.forEach((blob, i) => {
        blobCircles[i].setAttribute('cx', 180 + Math.max(-110, Math.min(110, blob.x - pointerX)));
        blobCircles[i].setAttribute('cy', 180 + Math.max(-110, Math.min(110, blob.y - pointerY)));
      });
    }
    function queueBlob() {
      if (!cursorRaf) cursorRaf = requestAnimationFrame(drawBlob);
    }
    function updateHover(target) {
      document.documentElement.classList.remove('hand-pointer');
      const interactive =
        target instanceof Element &&
        !!target.closest(
          'a[href],button:not(:disabled),.hero-sculpture,[role="button"],input[type="submit"]',
        );
      document.documentElement.classList.toggle(
        'pointer-hover',
        interactive && !window.HeroFreeze?.active,
      );
    }
    window.addEventListener('herofreezechange', () =>
      updateHover(document.elementFromPoint(pointerX, pointerY)),
    );
    window.addEventListener(
      'pointermove',
      (event) => {
        if (!fine.matches || reduced.matches || event.pointerType === 'touch') return;
        if (event.target.closest('input,textarea,select,[contenteditable="true"]')) {
          clearCursor();
          return;
        }
        const entering = cursor.style.opacity !== '1';
        document.documentElement.classList.add('signal-pointer');
        cursor.style.opacity = '1';
        trail.style.opacity = '1';
        pointerX = event.clientX;
        pointerY = event.clientY;
        document.documentElement.style.setProperty('--pointer-x', `${pointerX}px`);
        document.documentElement.style.setProperty('--pointer-y', `${pointerY}px`);
        cursor.style.transform = `translate3d(${pointerX}px,${pointerY}px,0)`;
        trail.style.transform = `translate3d(${pointerX - 180}px,${pointerY - 180}px,0)`;
        updateHover(event.target);
        blobs.forEach((blob, i) => {
          if (entering || !window.gsap) {
            blob.x = pointerX;
            blob.y = pointerY;
          } else
            gsap.to(blob, {
              x: pointerX,
              y: pointerY,
              duration: [0.1, 0.32, 0.5][i],
              ease: i ? 'power1.out' : 'power3.out',
              overwrite: true,
              onUpdate: queueBlob,
            });
        });
        queueBlob();
      },
      { passive: true },
    );
    window.addEventListener(
      'pointerover',
      (event) => {
        if (fine.matches && event.pointerType !== 'touch') updateHover(event.target);
      },
      { passive: true },
    );
    window.addEventListener(
      'pointerdown',
      (event) => {
        if (!fine.matches || event.pointerType === 'touch' || event.button !== 0) return;
        document.documentElement.classList.add('pointer-pressed');
        cursor.classList.add('is-pressed');
        trail.classList.add('is-pressed');
      },
      { passive: true, capture: true },
    );
    window.addEventListener(
      'pointerup',
      () => {
        document.documentElement.classList.remove('pointer-pressed');
        cursor.classList.remove('is-pressed');
        trail.classList.remove('is-pressed');
      },
      { passive: true, capture: true },
    );
    window.addEventListener('pointercancel', clearCursor, { passive: true });
    window.addEventListener(
      'scroll',
      () => {
        if (cursor.style.opacity === '1')
          updateHover(document.elementFromPoint(pointerX, pointerY));
      },
      { passive: true },
    );
    document.addEventListener('pointerleave', clearCursor);
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Tab') clearCursor();
    });
    document.addEventListener('focusin', (event) => {
      if (event.target.matches('input,textarea,select,[contenteditable="true"]')) clearCursor();
    });
    window.addEventListener('blur', clearCursor);
    window.addEventListener(
      'resize',
      () => {
        if (navigating) finishNavigation();
        clearCursor();
      },
      { passive: true },
    );
    function accessibilityChange() {
      clearCursor();
      if (navigating) finishNavigation();
    }
    reduced.addEventListener('change', accessibilityChange);
    fine.addEventListener('change', clearCursor);
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) accessibilityChange();
    });
    window.addEventListener(
      'pagehide',
      () => {
        accessibilityChange();
      },
      { once: true },
    );
  })();
}
