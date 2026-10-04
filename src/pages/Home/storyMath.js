/** @param {import("../../lib/effectScope").EffectScope} scope */
export default function mount(scope) {
  const { window } = scope.environment;
  /* Phase equations from nova-scroll-study-smooth/src/lib/storyMath.ts.
   * Nova's virtual 0..1600 opening is followed by S4DS's normal archive flow.
   * Its later, unrelated particle scene is intentionally outside this page.
   */
  (function (root) {
    const clamp01 = (value) => Math.min(1, Math.max(0, value));
    const lerp = (a, b, p) => a + (b - a) * clamp01(p);
    const phaseProgress = (value, start, end) =>
      end <= start ? Number(value >= end) : clamp01((value - start) / (end - start));
    const smoothstep = (value) => {
      const t = clamp01(value);
      return t * t * (3 - 2 * t);
    };
    function phases(virtual) {
      const global = clamp01(virtual / 2000);
      return {
        phase1: clamp01(global / (2 / 15)),
        phase2: clamp01((global - 0.1) / 0.05),
        phase3: clamp01((global - 0.15) / 0.25),
        phase4: clamp01((global - 0.4) / 0.35),
      };
    }
    function geometry(width, height) {
      const vmin = Math.min(width, height) / 100;
      const values =
        width < 640 ? [64, 94, 41, 60] : width < 1100 ? [54, 80, 35, 52] : [42, 62, 27, 40];
      const [cardWidth, cardHeight, radius, flyback] = values.map((value) => value * vmin);
      return { cardWidth, cardHeight, radius, flyback };
    }
    // Bound the entire carousel at any Y rotation, including perspective.
    function fitDeck(cardWidth, cardHeight, radius, perspective, frameWidth, frameHeight) {
      const extent = Math.hypot(radius, cardWidth / 2);
      const magnification = perspective / Math.max(1, perspective - extent);
      return (
        Math.min(
          1,
          frameWidth / (2 * extent * magnification),
          frameHeight / (cardHeight * magnification),
        ) * 0.86
      );
    }
    root.StoryMath = { clamp01, lerp, phaseProgress, smoothstep, phases, geometry, fitDeck };
  })(window);
}
