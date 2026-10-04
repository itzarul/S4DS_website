import { contacts } from '../homeData';
import { FooterScene } from './FooterSceneView';
export function Footer() {
  return (
    <footer className="connect-footer" id="contact" aria-label="Contact S4DS">
      <div className="connect-stage">
        <div className="connect-particles" aria-hidden="true" />
        <FooterScene />
        <div className="connect-intro">
          <p className="connect-kicker">{'KEEP IN SYNC'}</p>
          <h2 className="connect-title" id="connect-title">
            <span className="connect-title-line">{'CONNECT'}</span>
            <span className="connect-title-line">{'WITH US'}</span>
          </h2>
        </div>
        <address className="connect-contacts">
          <h3>{'CONTACTS :'}</h3>
          {contacts.map((person) => (
            <div className="connect-person" key={person.email}>
              <p>{person.role}</p>
              <a href={`mailto:${person.email}`}>{person.label}</a>
            </div>
          ))}
        </address>
        <a className="connect-wordmark" href="#home" aria-label="S4DS — back to home">
          <span>{'S'}</span>
          <span>{'4'}</span>
          <span>{'D'}</span>
          <span>{'S'}</span>
        </a>
        <button
          className="connect-motion"
          type="button"
          aria-pressed="false"
          aria-label="Pause or resume footer animation"
        >
          {'Pause motion'}
        </button>
      </div>
    </footer>
  );
}
