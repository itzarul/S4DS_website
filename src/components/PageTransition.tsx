import { useLayoutEffect, useRef } from 'react';
import { gsap } from '../lib/gsap';
import { Pixel } from './Pixel';

export function PageTransition() {
  const root = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useLayoutEffect(() => {
    const element = root.current,
      canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!element || !canvas || !ctx) return;
    let timeline: gsap.core.Timeline | undefined;
    let raf = 0,
      last = 0,
      active = false,
      departing = false;
    let pixels: Pixel[] = [];
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    const paint = (now: number) => {
      if (!active) return;
      raf = requestAnimationFrame(paint);
      if (now - last < 1000 / 60) return;
      last = now - ((now - last) % (1000 / 60));
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      pixels.forEach((pixel) => (departing ? pixel.disappear() : pixel.appear()));
    };
    const finish = () => {
      active = false;
      cancelAnimationFrame(raf);
      element.style.opacity = '0';
      element.style.visibility = 'hidden';
      document.documentElement.classList.remove('page-changing');
      window.SiteScroll?.unlock('navigation');
    };
    window.PageTransit = {
      run(action) {
        if (active || window.HeroFreeze?.active || window.HeroIntroLock?.active) return;
        if (reduced.matches) {
          action();
          return;
        }
        canvas.width = Math.min(innerWidth, 1600);
        canvas.height = Math.round((innerHeight * canvas.width) / innerWidth);
        pixels = [];
        const gap = window.RenderQuality.low ? 16 : 10;
        const colors = ['#e0f2fe', '#7dd3fc', '#0ea5e9'];
        for (let x = 0; x < canvas.width; x += gap) {
          for (let y = 0; y < canvas.height; y += gap) {
            pixels.push(
              new Pixel(
                canvas,
                ctx,
                x,
                y,
                colors[Math.floor(Math.random() * colors.length)],
                0.025,
                Math.hypot(x - canvas.width / 2, y - canvas.height / 2),
              ),
            );
          }
        }
        active = true;
        departing = false;
        last = 0;
        window.SiteScroll?.lock('navigation');
        document.documentElement.classList.add('page-changing');
        gsap.set(element, { visibility: 'visible', opacity: 0 });
        raf = requestAnimationFrame(paint);
        timeline = gsap.timeline({ onComplete: finish });
        timeline
          .to(element, { opacity: 1, duration: 0.65, ease: 'power2.inOut' }, 0)
          .call(
            () => {
              action();
              window.SiteScroll?.lock('navigation');
            },
            [],
            0.68,
          )
          .call(
            () => {
              departing = true;
            },
            [],
            0.78,
          )
          .to(element, { opacity: 0, duration: 0.65, ease: 'power2.inOut' }, 0.8);
      },
    };
    return () => {
      timeline?.kill();
      finish();
      delete window.PageTransit;
    };
  }, []);
  return (
    <div
      className="pixel-transition fixed inset-0 pointer-events-none"
      ref={root}
      aria-hidden="true"
    >
      <canvas ref={canvasRef} />
    </div>
  );
}
