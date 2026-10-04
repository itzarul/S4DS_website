export type PageId = 'home' | 'team' | 'events' | 'gallery';

export interface NavigationItem {
  id: PageId | 'contact';
  label: string;
  href: string;
}

export interface SceneController {
  setActive(active: boolean): void;
  setReveal(progress: number): void;
  dispose(): void;
}

export interface RenderQuality {
  low: boolean;
  mobile: boolean;
  dpr: number;
  fps: number;
  particles: number;
  reflectionSize: number;
  reflectionInterval: number;
}
