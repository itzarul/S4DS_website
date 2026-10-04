/** @param {import("../../../lib/effectScope").EffectScope} scope */
export default function mount(scope) {
  const { window, document, matchMedia, MutationObserver } = scope.environment;
  // React Bits GlareHover: the supplied 300% gradient sweep, applied to
  // each existing face without wrapping or flattening the 3D carousel.
  (() => {
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    const entries = [];
    for (const card of document.querySelectorAll('.story-card,.palette-block')) {
      const isStory = card.matches('.story-card');
      const faces = !isStory
        ? [card]
        : card.matches('.story-card--hero')
          ? [card, ...card.querySelectorAll('.hero-card-back')]
          : [...card.querySelectorAll('.story-card-face')];
      for (const face of faces) {
        const clip = document.createElement('span'),
          light = document.createElement('span');
        clip.className = 'card-glare';
        clip.setAttribute('aria-hidden', 'true');
        if (face === card && isStory) clip.classList.add('card-glare--hero');
        light.className = 'card-glare-light';
        clip.append(light);
        face.append(clip);
      }
      let hovered = false,
        focused = false;
      const sync = () =>
        card.classList.toggle(
          'glare-running',
          !reduced.matches &&
            (!isStory || document.body.classList.contains('deck-settled')) &&
            (hovered || focused),
        );
      card.addEventListener('pointerenter', (e) => {
        if (e.pointerType === 'touch') return;
        hovered = true;
        sync();
      });
      card.addEventListener('pointerleave', () => {
        hovered = false;
        sync();
      });
      card.addEventListener('pointercancel', () => {
        hovered = false;
        sync();
      });
      card.addEventListener('focusin', () => {
        focused = true;
        sync();
      });
      card.addEventListener('focusout', (e) => {
        if (!card.contains(e.relatedTarget)) {
          focused = false;
          sync();
        }
      });
      reduced.addEventListener('change', sync);
      entries.push(sync);
    }
    // A pointer may already be over the card when its entrance finishes.
    const settled = new MutationObserver(() => entries.forEach((sync) => sync()));
    settled.observe(document.body, { attributes: true, attributeFilter: ['class'] });
    window.addEventListener('pagehide', () => settled.disconnect(), { once: true });
  })();
}
