import { HeroScene } from './HeroSceneView';

export function Hero() {
  return (
    <section className="hero story-card story-card--hero relative overflow-hidden" aria-labelledby="hero-title">
      <div className="hero-frame relative z-10 pointer-events-none">
        <div className="hero-layout">
          <aside className="rail" aria-label="Project information">
            <span className="rail-rule rail-rule-top" aria-hidden="true" />
            <span className="rail-label">{'S4DS // 2026–27'}</span>
            <span className="rail-rule rail-rule-middle" aria-hidden="true" />
            <img className="rail-globe" src="/globe.svg" alt="" aria-hidden="true" />
            <span className="rail-rule rail-rule-bottom" aria-hidden="true" />
          </aside>

          <div className="hero-content pointer-events-auto">
            <HeroScene />
            <div className="hero-copy">
              <p className="hero-location">{'LOC.TCET'}</p>
              <h1 id="hero-title" className="hero-title">
                <span>{'SOCIETY 4'}</span>
                <span>{'DATA'}</span>
                <span>{'SCIENCE'}</span>
              </h1>

              <div className="hero-tag">
                <span className="corner-mark" aria-hidden="true" />
                <p>
                  <span>{'We’re here to learn,'}</span> <span>{'experiment, build things,'}</span>{' '}
                  <span>{'and figure out what’s'}</span> <span>{'possible along the way.'}</span>
                </p>
              </div>

              <a
                className="join-button"
                href="https://forms.gle/1Dq1rnAu5s8Hvx2a6"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span>{'JOIN NOW'}</span>
                {'\n                \n              '}
              </a>
            </div>
          </div>

          <div className="hero-footer" aria-label="Live project status">
            <span className="footer-tick" aria-hidden="true" />
            <span className="footer-tick" aria-hidden="true" />
            <span className="footer-tick" aria-hidden="true" />
            <span className="footer-tick" aria-hidden="true" />
            <p>{'THINK BEYOND THE DATA'}</p>
            <span className="footer-dots" aria-hidden="true">
              {'······'}
            </span>
            <span className="recording">
              <i aria-hidden="true" />
              <span className="recording-label">{'REC'}</span>
            </span>
          </div>
        </div>
      </div>
      <div className="hero-card-symbol" aria-hidden="true">
        <img src="/logo.png" alt="" />
        <span>{'S4DS'}</span>
      </div>
      <div className="hero-card-back" aria-hidden="true">
        <span>{'S4DS'}</span>
        <small>{'ARCHIVE SYSTEM'}</small>
      </div>
    </section>
  );
}
