/** @param {import("../../lib/effectScope").EffectScope} scope */
export default function mount(scope) {
  const {
    window,
    document,
    requestAnimationFrame,
    matchMedia,
    IntersectionObserver,
    gsap,
    ScrollTrigger,
    Lenis,
  } = scope.environment;
  const siteHeader = document.querySelector('.site-header');
  let smoothScroll = null;
  const scrollLocks = new Set(window.HeroIntroLock?.active ? ['intro'] : []);
  function syncScrollLock() {
    const locked = scrollLocks.size > 0;
    document.documentElement.classList.toggle('scroll-held', locked);
    if (locked) smoothScroll?.stop();
    else smoothScroll?.start();
  }
  window.SiteScroll = {
    lock(reason) {
      scrollLocks.add(reason);
      syncScrollLock();
    },
    unlock(reason) {
      scrollLocks.delete(reason);
      syncScrollLock();
    },
  };
  const preventLockedScroll = (event) => {
    if (scrollLocks.size) event.preventDefault();
  };
  window.addEventListener('wheel', preventLockedScroll, { passive: false });
  window.addEventListener('touchmove', preventLockedScroll, { passive: false });
  window.addEventListener('keydown', (event) => {
    if (
      scrollLocks.size &&
      ['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Home', 'End', ' '].includes(event.key) &&
      !event.target.closest('input,textarea,select,[contenteditable="true"]')
    )
      event.preventDefault();
  });
  const track = document.querySelector('.story-track');
  const stage = document.querySelector('.story-stage');
  const carousel = document.querySelector('.story-carousel');
  const deckPosition = document.querySelector('.deck-position');
  const deckLayout = document.querySelector('.deck-layout');
  const deckButtons = [...document.querySelectorAll('[data-deck-memory]')];
  let activeDeckMemory = 0;
  const cards = [...carousel.querySelectorAll('.story-card')];
  const hero = cards[0];
  const layout = document.querySelector('.hero-layout');
  const heroFrame = document.querySelector('.hero-frame');
  const symbol = document.querySelector('.hero-card-symbol');
  const reveal = document.querySelector('.connect-footer');
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');
  // Ambient motion is independent of the scroll-driven card choreography.
  const ambientSurfaces = [...document.querySelectorAll('.story-backdrop')];
  const visibleAtmospheres = new Set();
  function syncAmbientMotion() {
    for (const surface of ambientSurfaces) {
      const running = !document.hidden && !reduceMotion.matches && visibleAtmospheres.has(surface);
      surface.style.setProperty('--ambient-play-state', running ? 'running' : 'paused');
    }
  }
  const atmosphereObserver = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting && entry.intersectionRatio > 0.001)
          visibleAtmospheres.add(entry.target);
        else visibleAtmospheres.delete(entry.target);
      }
      syncAmbientMotion();
    },
    { threshold: [0, 0.001] },
  );
  ambientSurfaces.forEach((surface) => atmosphereObserver.observe(surface));
  document.addEventListener('visibilitychange', syncAmbientMotion);
  reduceMotion.addEventListener('change', syncAmbientMotion);
  let disposeStory = () => {};
  let jumpToStory = null;
  function fitViewport() {
    document.documentElement.style.setProperty(
      '--viewport-width',
      `${document.documentElement.clientWidth}px`,
    );
  }
  fitViewport();
  window.addEventListener('resize', fitViewport);

  function initStory() {
    disposeStory();
    if (reduceMotion.matches || !window.gsap || !window.ScrollTrigger || !window.StoryMath) return;
    const { clamp01, lerp, smoothstep, phaseProgress, phases, geometry } = window.StoryMath;
    gsap.registerPlugin(ScrollTrigger);
    // Finish after the fourth face, then let the sticky stage scroll away.
    const OPENING_END = 800;
    const titleOrbit = window.ArchiveTitleOrbit?.mount(
      stage,
      document.querySelector('#deck-title'),
      siteHeader,
    );
    let dimensions, travel, origin;

    function measure() {
      fitViewport();
      // Measure the destination layout rather than its in-flight page offset.
      deckLayout.style.transform = 'none';
      titleOrbit?.measure();
      const width = innerWidth;
      const height = stage.clientHeight;
      // Preserve NOVA's scroll speed through the four cards. Its later mask
      // and particle phases are replaced by ordinary document scrolling.
      const referenceTravel = (width < 640 ? 12 : width < 1100 ? 16 : 19) * height;
      travel = (referenceTravel * OPENING_END) / 4750;
      // 2000vh means 20 viewports: 19 viewports of travel.
      track.style.setProperty('--story-travel', `${travel}px`);
      const layoutStyle = getComputedStyle(layout);
      const frameWidth = parseFloat(layoutStyle.width);
      const frameHeight = parseFloat(layoutStyle.height);
      const frameLeft =
        parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--frame-left')) *
        (width < 640 ? 1 : width / 100);
      dimensions = {
        width,
        height,
        viewportWidth: stage.clientWidth,
        vmin: Math.min(width, height) / 100,
        frameWidth,
        frameHeight,
        offsetX: frameLeft + frameWidth / 2 - stage.clientWidth / 2,
        ...geometry(width, height),
      };
      const stageBounds = stage.getBoundingClientRect();
      const perspective = parseFloat(
        getComputedStyle(document.querySelector('.story-camera')).perspective,
      );
      // The rotating card is the frame now. Keep its center in the archive's
      // left composition and size it to the same visual footprint as the old
      // static window, without rendering a second rectangle behind it.
      const targetFrameWidth = width < 640 ? stage.clientWidth * 0.76 : stage.clientWidth * 0.34;
      const targetFrameHeight = width < 640 ? stage.clientHeight * 0.44 : stage.clientHeight * 0.68;
      dimensions.deckX =
        (width < 640 ? stage.clientWidth * 0.5 : stage.clientWidth * 0.395) - stage.clientWidth / 2;
      dimensions.deckY = stage.clientHeight * (width < 640 ? 0.52 : 0.49) - stage.clientHeight / 2;
      // Size the visible card itself to the archive frame footprint. The old
      // safety fit was for a separate window and made the cube sit inside it.
      dimensions.deckScale =
        Math.min(
          targetFrameWidth / dimensions.cardWidth,
          targetFrameHeight / dimensions.cardHeight,
        ) * (width < 640 ? 0.8 : 0.84);
      // Widen the faces without stretching their text. Measure the full swept
      // volume, so the nearest corners remain clear even between face-on stops.
      if (width >= 640) {
        dimensions.cardWidth *= 1.32;
        dimensions.cardHeight *= 1.1;
      }
      // Keep visible air between adjacent faces; widening a face must also
      // move it away from the carousel's center to preserve that separation.
      dimensions.radius = Math.max(dimensions.radius, dimensions.cardWidth * 0.7);
      const asideBounds = document.querySelector('.deck-aside').getBoundingClientRect();
      const titleBounds = document.querySelector('#deck-title').getBoundingClientRect();
      const navBounds = document.querySelector('.deck-nav').getBoundingClientRect();
      const centerX = stage.clientWidth / 2 + dimensions.deckX;
      const gap = width < 640 ? 12 : Math.max(24, stage.clientWidth * 0.017);
      const left = width < 640 ? gap : asideBounds.right - stageBounds.left + gap;
      const right =
        width < 640 ? stage.clientWidth - gap : titleBounds.left - stageBounds.left - gap;
      const top =
        width < 640
          ? height * 0.3
          : Math.max(height * 0.16, siteHeader.getBoundingClientRect().bottom + gap);
      const bottom =
        width < 640
          ? asideBounds.top - stageBounds.top - gap
          : navBounds.top - stageBounds.top - gap;
      // Use the full clear vertical area between the fixed header and memory controls.
      if (width >= 640) dimensions.deckY = (top + bottom) / 2 - height / 2;
      const centerY = height / 2 + dimensions.deckY;
      const extent = Math.hypot(dimensions.radius, dimensions.cardWidth / 2);
      const sweptWidth = (2 * extent * perspective) / Math.sqrt(perspective ** 2 - extent ** 2);
      const sweptHeight = (dimensions.cardHeight * perspective) / (perspective - extent);
      dimensions.deckScale = Math.min(
        dimensions.deckScale,
        (2 * Math.min(centerX - left, right - centerX)) / sweptWidth,
        (2 * Math.min(centerY - top, bottom - centerY)) / sweptHeight,
      );
      origin = track.getBoundingClientRect().top + scrollY;
    }

    function apply(progress) {
      const virtual = clamp01(progress) * OPENING_END;
      window.storyVirtual = virtual;
      document.body.classList.toggle('deck-settled', virtual >= 299.5);
      window.WarpTextMotion?.sync(virtual);
      window.TextEffects?.sync(virtual);
      const { phase1, phase2, phase3 } = phases(virtual);
      const d = dimensions;
      const rotation = phase3 * -270;
      const settle = smoothstep(phaseProgress(virtual, 80, 300));
      deckPosition.style.transform = `translate3d(${d.deckX * settle}px,${d.deckY * settle}px,0) scale(${lerp(1, d.deckScale, settle)})`;
      const pageProgress = smoothstep(phaseProgress(virtual, 80, 300));
      const pageOffset = (1 - pageProgress) * d.height;
      stage.style.setProperty('--hero-background-y', `${-pageProgress * d.height * 0.28}px`);
      stage.style.setProperty('--archive-page-y', `${pageOffset}px`);
      stage.style.setProperty('--archive-texture-y', `${-pageOffset * 0.18}px`);
      titleOrbit?.update(virtual, pageOffset);
      deckLayout.style.transform = `translate3d(0,${pageOffset}px,0)`;
      deckLayout.style.opacity = 1;
      deckLayout.style.visibility = pageProgress > 0 ? 'visible' : 'hidden';
      deckLayout.inert = pageProgress < 0.99;
      deckLayout.setAttribute('aria-hidden', String(deckLayout.inert));
      activeDeckMemory = Math.round(phase3 * 3);
      deckButtons.forEach((button, index) => {
        if (index === activeDeckMemory) button.setAttribute('aria-current', 'true');
        else button.removeAttribute('aria-current');
      });
      carousel.style.transform = `rotateY(${rotation}deg)`;
      hero.style.width = `${lerp(d.frameWidth, d.cardHeight, phase1)}px`;
      hero.style.height = `${lerp(d.frameHeight, d.cardWidth, phase1)}px`;
      hero.style.borderRadius = `${lerp(0, 1.6 * d.vmin, phase1)}px`;
      // Transform order is significant: depth precedes the hero's quarter-turn.
      hero.style.transform = `translate3d(calc(-50% + ${d.offsetX * (1 - phase1)}px),-50%,0) rotateY(0deg) translateZ(${d.radius * phase2}px) rotateZ(${phase1 * 90}deg)`;
      const heroOpacity = 1 - smoothstep(phaseProgress(virtual, 100, 240));
      layout.style.opacity = heroOpacity;
      heroFrame.style.overflow = phase1 > 0 ? 'hidden' : 'visible';
      heroFrame.style.backgroundColor = `rgba(0,0,0,${lerp(0.45, 1, smoothstep(phase1))})`;
      layout.inert = heroOpacity <= 0.45;
      layout.setAttribute('aria-hidden', String(layout.inert));
      symbol.style.opacity = smoothstep(phaseProgress(phase1, 0.4, 1));
      cards.slice(1).forEach((card, index) => {
        card.style.width = `${d.cardWidth}px`;
        card.style.height = `${d.cardHeight}px`;
        card.style.borderRadius = `${1.6 * d.vmin}px`;
        card.style.transform = `translate3d(-50%,-50%,0) rotateY(${(index + 1) * 90}deg) translateZ(${d.radius * phase2}px) scaleX(${Math.max(phase2, 0.0001)})`;
      });
      cards.forEach((card, index) => {
        const angle = index * 90 + rotation;
        card.style.zIndex = String(20 + Math.round((Math.cos((angle * Math.PI) / 180) + 1) * 100));
        if (index)
          card.setAttribute(
            'aria-hidden',
            String(!(phase2 > 0.99 && Math.abs(angle) < 60 && virtual < 1000)),
          );
      });
      window.EntranceMotion?.update(virtual);
    }

    track.classList.add('story-enhanced');
    document.body.classList.add('story-running');
    measure();
    const trigger = ScrollTrigger.create({
      trigger: track,
      start: 'top top',
      end: 'bottom bottom',
      invalidateOnRefresh: true,
      onRefreshInit: measure,
      onUpdate: (self) => apply(self.progress),
      onRefresh: (self) => apply(self.progress),
    });
    apply(trigger.progress);
    let updateLenis;
    if (window.Lenis) {
      smoothScroll = new Lenis({
        autoRaf: false,
        lerp: 0.1,
        smoothWheel: true,
        syncTouch: false,
        overscroll: true,
        respectReducedMotion: true,
      });
      smoothScroll.on('scroll', ScrollTrigger.update);
      updateLenis = (time) => smoothScroll?.raf(time * 1000);
      gsap.ticker.add(updateLenis);
      gsap.ticker.lagSmoothing(0);
      syncScrollLock();
    }
    jumpToStory = (virtual) => origin + travel * clamp01(virtual / OPENING_END);
    disposeStory = () => {
      titleOrbit?.destroy();
      trigger.kill();
      if (updateLenis) gsap.ticker.remove(updateLenis);
      smoothScroll?.destroy();
      smoothScroll = null;
      gsap.ticker.lagSmoothing(500, 33);
      track.classList.remove('story-enhanced');
      document.body.classList.remove('story-running');
      [
        track,
        stage,
        carousel,
        deckPosition,
        deckLayout,
        layout,
        heroFrame,
        symbol,
        reveal,
        ...cards,
      ].forEach((node) => node.removeAttribute('style'));
      deckLayout.inert = true;
      deckLayout.setAttribute('aria-hidden', 'true');
      layout.inert = false;
      reveal.inert = false;
      layout.removeAttribute('aria-hidden');
      reveal.removeAttribute('aria-hidden');
      cards.slice(1).forEach((card) => card.setAttribute('aria-hidden', 'true'));
      jumpToStory = null;
    };
    scope.when(document.fonts.ready, () => {
      if (jumpToStory) ScrollTrigger.refresh();
    });
  }

  function goToDeckMemory(index) {
    if (!jumpToStory) return;
    const memory = (index + 4) % 4;
    const top = jumpToStory(300 + (memory * 500) / 3);
    if (smoothScroll) smoothScroll.scrollTo(top, { force: true });
    else scrollTo({ top, behavior: 'smooth' });
  }
  deckButtons.forEach((button) =>
    button.addEventListener('click', () => goToDeckMemory(Number(button.dataset.deckMemory))),
  );
  document
    .querySelector('[data-deck-prev]')
    .addEventListener('click', () => goToDeckMemory(activeDeckMemory - 1));
  document
    .querySelector('[data-deck-next]')
    .addEventListener('click', () => goToDeckMemory(activeDeckMemory + 1));

  window.SiteScroll.navigate = (hash) => {
    const target = document.querySelector(hash);
    if (!target) return;
    let top = hash === '#home' ? 0 : target.getBoundingClientRect().top + scrollY;
    if (hash === '#contact') top += target.offsetHeight - innerHeight;
    if (smoothScroll) smoothScroll.scrollTo(top, { force: true, immediate: true });
    else scrollTo({ top, behavior: 'instant' });
    ScrollTrigger.update();
  };
  reduceMotion.addEventListener('change', initStory);
  window.addEventListener('pagehide', () => disposeStory());
  window.addEventListener('pageshow', (event) => {
    if (event.persisted) initStory();
  });
  initStory();
  // A contact link from another page opens the completed footer, without replaying the intro.
  if (location.hash === '#contact')
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const footer = document.querySelector('#contact');
        const top =
          footer.getBoundingClientRect().top + scrollY + footer.offsetHeight - innerHeight;
        if (smoothScroll) smoothScroll.scrollTo(top, { force: true, immediate: true });
        else scrollTo({ top, behavior: 'instant' });
        ScrollTrigger.update();
      });
    });
}
