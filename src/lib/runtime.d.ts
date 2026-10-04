import type { gsap } from 'gsap';
import type { ScrollTrigger } from 'gsap/ScrollTrigger';
import type Lenis from 'lenis';
import type { RenderQuality } from './types';

declare global {
  interface Window {
    gsap: typeof gsap;
    ScrollTrigger: typeof ScrollTrigger;
    Lenis: typeof Lenis;
    RenderQuality: RenderQuality;
    HeroIntroLock?: { active: boolean; release(): void };
    introBootTimeout?: number;
    SiteScroll?: {
      lock(reason: string): void;
      unlock(reason: string): void;
      navigate(hash: string): void;
    };
    HeroFreeze?: { readonly active: boolean; release(immediate?: boolean): void };
    PageTransit?: { run(action: () => void): void };
  }
  interface Navigator {
    connection?: { saveData?: boolean };
    deviceMemory?: number;
  }
}
