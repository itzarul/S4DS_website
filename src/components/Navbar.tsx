import { useEffect, useState } from 'react';
import { navigation } from './navigation';
import type { PageId } from '../lib/types';

export function Navbar({ page, onNavigate }: { page: PageId; onNavigate: (href: string) => void }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(scrollY > 60);
  useEffect(() => {
    const update = () => setScrolled(scrollY > 60);
    const key = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && open) {
        setOpen(false);
        document.querySelector<HTMLButtonElement>('.menu-toggle')?.focus();
      }
    };
    window.addEventListener('scroll', update, { passive: true });
    document.addEventListener('keydown', key);
    return () => {
      window.removeEventListener('scroll', update);
      document.removeEventListener('keydown', key);
    };
  }, [open]);
  return (
    <header className={`site-header flex items-center${scrolled ? ' is-scrolled' : ''}`}>
      <a
        className="brand"
        href="/#home"
        aria-label="S4DS home"
        onClick={(event) => {
          event.preventDefault();
          setOpen(false);
          onNavigate('/#home');
        }}
      >
        <img src="/logo.png" alt="S4DS" />
      </a>
      <button
        className="menu-toggle"
        type="button"
        aria-expanded={open}
        aria-controls="primary-nav"
        onClick={() => setOpen(!open)}
      >
        <span />
        <span />
        <span className="sr-only">Toggle navigation</span>
      </button>
      <nav
        className={`site-nav${open ? ' open' : ''}`}
        id="primary-nav"
        aria-label="Primary navigation"
      >
        {navigation.map((item) => (
          <a
            key={item.id}
            className={item.id === page ? 'active' : undefined}
            aria-current={item.id === page ? 'page' : undefined}
            href={item.href}
            onClick={(event) => {
              if (event.button || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)
                return;
              event.preventDefault();
              setOpen(false);
              onNavigate(item.href);
            }}
          >
            {item.label}
          </a>
        ))}
      </nav>
    </header>
  );
}
