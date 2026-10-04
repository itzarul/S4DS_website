export function Archive() {
  return (
    <section
      id="events"
      className="deck-layout"
      aria-labelledby="deck-title"
      aria-hidden="true"
      inert={true}
    >
      <p className="deck-kicker">{'// MEMORY ARCHIVE'}</p>
      <div className="deck-window" aria-hidden="true" />
      <aside className="deck-aside" aria-label="Memory archive details">
        <div className="deck-mode">
          <span className="deck-crosshair deck-brackets" aria-hidden="true">
            {'+'}
          </span>
          <p>
            {'ARCHIVE MODE'}
            <br />
            {'VIEWING MEMORIES'}
          </p>
        </div>
        <div className="deck-note deck-brackets">
          <p>
            {'CAPTURED MOMENTS.'}
            <br />
            {'REAL PEOPLE.'}
            <br />
            {'RAW ENERGY.'}
            <br />
            {'TIMELESS IMPACT.'}
          </p>
        </div>
        <div className="deck-dots" aria-hidden="true" />
      </aside>
      <h2 id="deck-title">
        <span>{'THE'}</span>
        <span>{'ARCHIVE'}</span>
      </h2>
      <p className="deck-subtitle">
        {'A GLIMPSE INTO'}
        <br />
        {'THE PAST'}
      </p>
      <div className="deck-palette" id="gallery">
        <svg
          className="deck-palette-art"
          viewBox="0 0 700 457"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          aria-label="Archive photos: a cricket game, students working in a computer lab, and an auditorium event"
        >
          <g className="deck-photo">
            <path d="M21 177V1H328V177H21Z" stroke="#555550" strokeWidth="2" />
            <path d="M21 41V1H64" stroke="#e9e8e3" strokeWidth="2" />
            <image
              href="/assets/archive-cricket.webp"
              x="43"
              y="24"
              width="341"
              height="179"
              preserveAspectRatio="xMidYMid slice"
            />
          </g>
          <g className="deck-photo">
            <image
              href="/assets/archive-lab.webp"
              x="17"
              y="257"
              width="232"
              height="168"
              preserveAspectRatio="xMidYMid slice"
            />
            <path
              d="M5 328V248H66M209 445H249V402M1 248H15M5 243V257M239 445H256M249 434V453"
              stroke="#e9e8e3"
              strokeWidth="2"
            />
          </g>
          <g className="deck-photo">
            <path d="M300 265V189H365V213" stroke="#85817e" strokeWidth="2" />
            <path d="M300 221V189H326M300 239V265H323" stroke="#e9e8e3" strokeWidth="2" />
            <image
              href="/assets/archive-auditorium.webp"
              x="311"
              y="197"
              width="376"
              height="250"
              preserveAspectRatio="xMidYMid slice"
            />
            <path d="M650 192H697V253M697 401V456H328V426" stroke="#e9e8e3" strokeWidth="2" />
            <path d="M328 426V456H357M658 456H687V433" stroke="#85817e" strokeWidth="2" />
          </g>
        </svg>
      </div>
      <nav className="deck-nav" aria-label="Rotating archive memories">
        <button
          className="deck-direction deck-previous"
          type="button"
          data-deck-prev=""
          aria-label="Previous memory"
        >
          <span className="deck-arrow" aria-hidden="true">
            {'←'}
          </span>
          <span className="deck-direction-label">{'PREVIOUS MEMORY'}</span>
        </button>
        <div className="deck-memory-items">
          <button
            type="button"
            data-deck-memory="0"
            aria-label="View memory 01"
            aria-current="true"
          >
            {'01'}
          </button>
          <span aria-hidden="true" />
          <button type="button" data-deck-memory="1" aria-label="View memory 02">
            {'02'}
          </button>
          <span aria-hidden="true" />
          <button type="button" data-deck-memory="2" aria-label="View memory 03">
            {'03'}
          </button>
          <span aria-hidden="true" />
          <button type="button" data-deck-memory="3" aria-label="View memory 04">
            {'04'}
          </button>
        </div>
        <button
          className="deck-direction deck-next"
          type="button"
          data-deck-next=""
          aria-label="Next memory"
        >
          <span className="deck-direction-label">{'NEXT MEMORY'}</span>
          <span className="deck-arrow" aria-hidden="true">
            {'→'}
          </span>
        </button>
      </nav>
    </section>
  );
}
