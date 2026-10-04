import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { Navbar } from './components/Navbar';
import { PageTransition } from './components/PageTransition';
import { CursorEffects } from './components/CursorEffects';
import { Home } from './pages/Home/Home';
import { Team } from './pages/Team/Team';
import { Events } from './pages/Events/Events';
import { Gallery } from './pages/Gallery/Gallery';
import { Publication } from './pages/Publication/Publication';
import { pageFromPath } from './components/navigation';

export function App() {
  const [page, setPage] = useState(() => pageFromPath(location.pathname));
  const skipIntro = useRef(page !== 'home' || location.hash === '#contact');
  useLayoutEffect(() => {
    document.body.classList.toggle('blank-page', page !== 'home');
    for (const id of ['team', 'events', 'gallery', 'publication'])
      document.body.classList.toggle(`blank-page--${id}`, page === id);
    document.title =
      page === 'home'
        ? 'S4DS | Data Science + AI'
        : `${page[0].toUpperCase() + page.slice(1)} | S4DS`;
  }, [page]);
  const navigate = useCallback((href: string, replace = false) => {
    const url = new URL(href, location.href);
    const next = pageFromPath(url.pathname);
    const action = () => {
      if (replace) history.replaceState(null, '', url.pathname + url.hash);
      else history.pushState(null, '', url.pathname + url.hash);
      skipIntro.current = true;
      flushSync(() => setPage(next));
      if (next === 'home') window.SiteScroll?.navigate(url.hash || '#home');
      else scrollTo({ top: 0, behavior: 'instant' });
    };
    if (window.PageTransit) window.PageTransit.run(action);
    else action();
  }, []);
  useEffect(() => {
    const onPop = () => {
      skipIntro.current = true;
      flushSync(() => setPage(pageFromPath(location.pathname)));
      if (pageFromPath(location.pathname) === 'home')
        window.SiteScroll?.navigate(location.hash || '#home');
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);
  return (
    <>
      <main
        aria-label={page === 'home' ? undefined : page[0].toUpperCase() + page.slice(1)}
        onClick={(event) => {
          const target = event.target;
          if (!(target instanceof Element)) return;
          const wordmark = target.closest<HTMLAnchorElement>('.connect-wordmark');
          if (wordmark) {
            event.preventDefault();
            navigate('/#home');
          }
        }}
      >
        <Navbar page={page} onNavigate={navigate} />
        {page === 'home' ? (
          <Home skipIntro={skipIntro.current} />
        ) : page === 'team' ? (
          <Team />
        ) : page === 'events' ? (
          <Events />
        ) : page === 'gallery' ? (
          <Gallery />
        ) : (
          <Publication />
        )}
      </main>
      <PageTransition />
      {(page === 'home' || page === 'team') && <CursorEffects />}
    </>
  );
}
