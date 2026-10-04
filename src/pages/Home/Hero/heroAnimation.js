/** @param {import("../../../lib/effectScope").EffectScope} scope */
export default function mount(scope) {
  const { window, document, setTimeout, clearTimeout, matchMedia, gsap } = scope.environment;
  // Arrival choreography is independent of the reversible, scroll-driven carousel.
  (() => {
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    function releaseFirstPaint() {
      clearTimeout(window.introBootTimeout);
      document.documentElement.classList.remove('intro-pending');
    }
    if (!window.gsap || reduced.matches || location.hash === '#contact') {
      releaseFirstPaint();
      window.HeroIntroLock?.release();
      window.EntranceMotion = { heroReady: true, update() {} };
      return;
    }
    const $ = (selector) => document.querySelector(selector);
    const heroParts = [
      '#hero-title',
      '.hero-location',
      '.hero-tag',
      '.site-nav',
      '.brand',
      '.menu-toggle',
      '.rail',
      '.hero-footer',
      '.join-button',
      '.hero-sculpture',
    ].map($);
    const archiveParts = [
      '.deck-subtitle',
      '.deck-nav',
      '.deck-palette',
      '.deck-kicker',
      '.deck-mode',
      '.deck-note',
      '.deck-dots',
    ].map($);
    const photos = [...document.querySelectorAll('.deck-photo')];
    const frame = $('.hero-frame');
    const beams = [];
    let heroTimeline,
      archiveTimeline,
      outline,
      fill,
      archiveStarted = false,
      archiveDone = false;
    const api = (window.EntranceMotion = { heroReady: false, update });
    function clean(el) {
      gsap.set(el, { clearProps: 'opacity,visibility,clipPath,transform,filter,--sweep' });
      el.classList.remove('saber-reveal', 'saber-reveal--vertical', 'saber-reveal--center');
      el.querySelectorAll('.reveal-beam').forEach((beam) => beam.remove());
    }
    function finishHero() {
      heroTimeline?.kill();
      window.stopHeroDecode?.();
      heroParts.forEach(clean);
      gsap.set($('.story-backdrop--hero'), { clearProps: 'opacity' });
      frame.classList.remove('intro-framing');
      outline?.remove();
      fill?.remove();
      beams.splice(0).forEach((el) => el.remove());
      $('.hero-sculpture').classList.remove('model-arriving');
      api.heroReady = true;
      window.HeroIntroLock?.release();
      releaseFirstPaint();
    }
    function finishArchive() {
      archiveTimeline?.kill();
      [...archiveParts, ...photos].forEach(clean);
      archiveDone = true;
      $('.deck-note').classList.remove('focus-lock');
    }
    function centerSweep(timeline, el, at) {
      timeline.call(
        () => {
          el.classList.add('saber-reveal', 'saber-reveal--center');
          for (const side of ['left', 'right']) {
            const beam = document.createElement('i');
            beam.className = `reveal-beam reveal-beam--${side}`;
            beam.setAttribute('aria-hidden', 'true');
            el.append(beam);
          }
        },
        [],
        at,
      );
      timeline
        .set(el, { autoAlpha: 1, '--sweep': '0%' }, at)
        .to(el, { '--sweep': '100%', duration: 0.75, ease: 'power2.inOut' }, at)
        .call(() => clean(el), [], at + 0.76);
    }
    function sweep(timeline, el, at, vertical = false) {
      timeline.call(
        () => {
          el.classList.add('saber-reveal');
          if (vertical) el.classList.add('saber-reveal--vertical');
          if (getComputedStyle(el).position === 'static') el.style.position = 'relative';
          const beam = document.createElement('i');
          beam.className = 'reveal-beam';
          beam.setAttribute('aria-hidden', 'true');
          el.append(beam);
          beams.push(beam);
        },
        [],
        at,
      );
      timeline.set(el, { autoAlpha: 1, '--sweep': '0%' }, at);
      timeline.to(el, { '--sweep': '100%', duration: 0.65, ease: 'power2.inOut' }, at);
      timeline.call(
        () => {
          el.classList.remove('saber-reveal', 'saber-reveal--vertical');
          el.querySelector('.reveal-beam')?.remove();
        },
        [],
        at + 0.7,
      );
    }
    function startHero() {
      if (api.heroReady || reduced.matches) return;
      if (scope.skipIntro) {
        finishHero();
        return;
      }
      if ((window.storyVirtual || 0) > 0.01 || scrollY > 40) {
        finishHero();
        update(window.storyVirtual || 0);
        return;
      }
      const width = frame.clientWidth,
        height = frame.clientHeight;
      fill = document.createElement('div');
      fill.className = 'intro-fill';
      outline = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      outline.classList.add('intro-outline');
      outline.setAttribute('viewBox', `0 0 ${width} ${height}`);
      outline.setAttribute('preserveAspectRatio', 'none');
      outline.setAttribute('aria-hidden', 'true');
      const path = document.createElementNS(outline.namespaceURI, 'path');
      path.setAttribute('d', `M0 0 V${height} H${width} V0 H0`);
      path.setAttribute('fill', 'none');
      path.setAttribute('stroke', '#92928e');
      path.setAttribute('stroke-width', '1');
      path.setAttribute('vector-effect', 'non-scaling-stroke');
      outline.append(path);
      frame.prepend(fill);
      frame.append(outline);
      frame.classList.add('intro-framing');
      // Real SVG units avoid CSS dash values drawing repeated tiny segments.
      const perimeter = path.getTotalLength();
      gsap.set(path, { strokeDasharray: `${perimeter} ${perimeter}`, strokeDashoffset: perimeter });
      gsap.set(fill, { scaleX: 0 });
      releaseFirstPaint();
      heroTimeline = gsap.timeline({ onComplete: finishHero });
      heroTimeline
        .to($('.story-backdrop--hero'), { opacity: 1, duration: 0.6, ease: 'power2.out' }, 0)
        .to(path, { strokeDashoffset: 0, duration: 1, ease: 'none' }, 0.2)
        .to(fill, { scaleX: 1, duration: 0.6, ease: 'power2.inOut' }, 1.2)
        .set($('#hero-title'), { autoAlpha: 1 }, 1.7)
        .call(() => window.playHeroDecode?.(), [], 1.7)
        .to([$('.hero-location'), $('.hero-tag')], { autoAlpha: 1, duration: 0.22 }, 3.1)
        .call(
          () => {
            window.TextEffects?.play('.hero-location', 'flap');
            window.TextEffects?.play('.hero-tag p', 'type');
          },
          [],
          3.12,
        );
      sweep(heroTimeline, $('.site-nav'), 5.15);
      sweep(heroTimeline, $('.brand'), 5.15);
      sweep(heroTimeline, $('.menu-toggle'), 5.15);
      sweep(heroTimeline, $('.hero-footer'), 5.2);
      sweep(heroTimeline, $('.rail'), 5.2, true);
      sweep(heroTimeline, $('.join-button'), 5.3);
      heroTimeline
        .set($('.hero-sculpture'), { autoAlpha: 1 }, 5.95)
        .call(() => $('.hero-sculpture').classList.add('model-arriving'), [], 5.95)
        .to({}, { duration: 0.7 }, 5.95);
    }
    function startArchive() {
      archiveStarted = true;
      const photosAt = 1.05,
        photoDuration = 0.48,
        photoStagger = 0.54;
      // This sequence starts only when the scroll-driven cards reach their final frame.
      const controlsAt = 0.15;
      const detailsAt = photosAt;
      archiveTimeline = gsap.timeline({
        onComplete: () => {
          archiveDone = true;
          [...archiveParts, ...photos].forEach(clean);
        },
      });
      archiveTimeline
        .set($('.deck-subtitle'), { autoAlpha: 1 }, 0)
        .call(() => window.TextEffects?.play('.deck-subtitle', 'decrypt'), [], 0)
        .set($('.deck-palette'), { autoAlpha: 1 }, photosAt)
        .fromTo(
          photos,
          { autoAlpha: 0 },
          { autoAlpha: 1, duration: photoDuration, stagger: photoStagger, ease: 'sine.inOut' },
          photosAt,
        )
        .set($('.deck-kicker'), { autoAlpha: 1 }, detailsAt)
        .call(() => window.TextEffects?.play('.deck-kicker', 'type'), [], detailsAt)
        .fromTo(
          $('.deck-mode'),
          { autoAlpha: 0, clipPath: 'inset(0 0 100% 0)' },
          { autoAlpha: 1, clipPath: 'inset(0 0 0% 0)', duration: 0.35 },
          detailsAt + 0.45,
        )
        .call(() => window.TextEffects?.play('.deck-mode p', 'type'), [], detailsAt + 0.5)
        .set($('.deck-note'), { autoAlpha: 1 }, detailsAt + 1.25)
        .call(() => window.TextEffects?.play('.deck-note p', 'type'), [], detailsAt + 1.25)
        .call(() => $('.deck-note').classList.add('focus-lock'), [], detailsAt + 2.8)
        .to($('.deck-dots'), { autoAlpha: 1, duration: 0.35 }, detailsAt + 2.95)
        .to({}, { duration: 0.5 }, detailsAt + 3);
      centerSweep(archiveTimeline, $('.deck-nav'), controlsAt);
    }
    function update(virtual) {
      if (virtual > 0.01 && !api.heroReady) {
        finishHero();
        window.TextEffects?.stop();
      }
      if (reduced.matches) return;
      if (virtual >= 300 && !archiveStarted && !archiveDone && window.TextEffects?.ready)
        startArchive();
      if (virtual < 285 && archiveStarted && !archiveDone) {
        archiveTimeline?.kill();
        window.TextEffects?.stop();
        [...archiveParts, ...photos].forEach(clean);
        gsap.set([...archiveParts, ...photos], { autoAlpha: 0 });
        archiveStarted = false;
      }
    }
    gsap.set(heroParts, { autoAlpha: 0 });
    gsap.set([...archiveParts, ...photos], { autoAlpha: 0 });
    gsap.set($('.story-backdrop--hero'), { opacity: 0 });
    const fallback = setTimeout(() => {
      if (!heroTimeline) {
        finishHero();
        finishArchive();
      }
    }, 3500);
    const start = () => {
      clearTimeout(fallback);
      startHero();
    };
    if (window.TextEffects?.ready) start();
    else window.addEventListener('text-effects-ready', start, { once: true });
    window.addEventListener(
      'resize',
      () => {
        finishHero();
        if (archiveStarted) finishArchive();
      },
      { passive: true },
    );
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Tab' && !api.heroReady) finishHero();
    });
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        finishHero();
        if (archiveStarted) finishArchive();
      }
    });
    reduced.addEventListener('change', () => {
      finishHero();
      finishArchive();
      window.TextEffects?.stop();
    });
    window.addEventListener(
      'pagehide',
      () => {
        clearTimeout(fallback);
        finishHero();
        finishArchive();
      },
      { once: true },
    );
  })();
}
