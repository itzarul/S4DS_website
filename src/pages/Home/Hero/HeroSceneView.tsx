export function HeroScene() {
  return (
    <div
      className="hero-sculpture"
      tabIndex={0}
      role="group"
      aria-label="Interactive glass sculpture. Drag or use arrow keys to rotate. Hold still to freeze the page, or press F. Click anywhere or press Escape to resume. Space pauses rotation; Home resets."
    >
      <img
        className="hero-sculpture-fallback"
        src="/assets/hero-sculpture-reference.webp"
        alt="Iridescent glass prisms radiating around a chrome ring"
      />
      <span className="sculpture-hint" aria-hidden="true">
        <span>{'drag to explore'}</span>
        <span>{'hold to freeze <easter egg> <3'}</span>
      </span>
    </div>
  );
}
