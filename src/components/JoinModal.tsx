import { useEffect, useRef, useState } from 'react';

export function JoinModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const root = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState(false);
  useEffect(() => {
    if (!open) return;
    const previousFocus = document.activeElement;
    const main = document.querySelector('main');
    if (main) main.inert = true;
    document.body.classList.add('modal-open');
    window.SiteScroll?.lock('modal');
    const timer = window.setTimeout(() => input.current?.focus(), 20);
    const key = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
      if (event.key !== 'Tab') return;
      const targets = [
        ...(root.current?.querySelectorAll<HTMLElement>('button, input, a[href]') ?? []),
      ];
      const first = targets[0],
        last = targets.at(-1);
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    };
    document.addEventListener('keydown', key);
    return () => {
      clearTimeout(timer);
      document.removeEventListener('keydown', key);
      if (main) main.inert = false;
      document.body.classList.remove('modal-open');
      window.SiteScroll?.unlock('modal');
      if (previousFocus instanceof HTMLElement && previousFocus.isConnected)
        previousFocus.focus({ preventScroll: true });
    };
  }, [open, onClose]);
  return (
    <div
      className="join-modal fixed inset-0 z-[100] grid place-items-center p-[20px]"
      data-join-modal
      ref={root}
      hidden={!open}
    >
      <div
        className="modal-backdrop absolute inset-0 bg-[#000c]"
        data-close-join
        onClick={onClose}
      />
      <section
        className="join-panel relative overflow-auto border border-paper bg-ink"
        role="dialog"
        aria-modal="true"
        aria-labelledby="join-title"
      >
        <button
          className="modal-close"
          type="button"
          data-close-join
          aria-label="Close join form"
          onClick={onClose}
        >
          ×
        </button>
        <p className="modal-kicker">S4DS COMMUNITY</p>
        <h2 id="join-title">
          JOIN THE
          <br />
          NEXT MEMORY.
        </h2>
        <p className="modal-copy">
          Leave your email and we’ll send the next build session, event, or experiment.
        </p>
        <form
          className="join-form grid gap-[10px] mt-[24px]"
          noValidate
          onSubmit={(event) => {
            event.preventDefault();
            const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.current?.value.trim() ?? '');
            setError(!valid);
            setMessage(
              valid ? 'Request received. We’ll be in touch.' : 'Enter a valid email address.',
            );
            if (valid) event.currentTarget.reset();
            else input.current?.focus();
          }}
        >
          <label htmlFor="join-email">EMAIL ADDRESS</label>
          <input
            ref={input}
            id="join-email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            required
          />
          <p className={`form-message${error ? ' error' : ''}`} role="status" aria-live="polite">
            {message}
          </p>
          <button className="join-submit" type="submit">
            SEND REQUEST <span aria-hidden="true">↗</span>
          </button>
        </form>
      </section>
    </div>
  );
}
