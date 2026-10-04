import { EffectScope } from '../../lib/effectScope';
import { homeMounts } from './engineMounts';

const engineGlobals = [
  'HeroIntroLock',
  'introBootTimeout',
  'SiteScroll',
  'StoryMath',
  'storyVirtual',
  'ArchiveTitleOrbit',
  'EntranceMotion',
  'TextEffects',
  'TextEffectGeometry',
  'WarpTextMotion',
  'S4DSWarpShaders',
  'FreezeConsole',
  'createFreezeFlow',
  'mountFreezeFallback',
  'HeroLiquid',
  'HeroFreeze',
  'playHeroDecode',
  'stopHeroDecode',
] as const;

export function mountHomeExperience(skipIntro: boolean) {
  const scope = new EffectScope(skipIntro);
  const previous = new Map(engineGlobals.map((key) => [key, Reflect.get(window, key)]));
  const bodyChildren = new Set(document.body.children);
  const surfaces = [...document.querySelectorAll('.story-track, .connect-footer')];
  const originalNodes = new Map(
    surfaces
      .flatMap((surface) => [surface, ...surface.querySelectorAll('*')])
      .map((node) => [
        node,
        [...node.attributes].map((attribute) => [attribute.name, attribute.value] as const),
      ]),
  );
  document.documentElement.classList.add('sculpture-loading');
  const intro =
    !skipIntro &&
    location.hash !== '#contact' &&
    !matchMedia('(prefers-reduced-motion: reduce)').matches;
  window.HeroIntroLock = {
    active: intro,
    release() {
      this.active = false;
      document.documentElement.classList.remove('intro-pending', 'scroll-held');
      window.SiteScroll?.unlock('intro');
    },
  };
  if (intro) {
    document.documentElement.classList.add('intro-pending', 'scroll-held');
    window.introBootTimeout = scope.environment.setTimeout(
      () => window.HeroIntroLock?.release(),
      8000,
    );
  }
  scope.initialize(() => homeMounts.forEach((mount) => mount(scope)));
  const ownedNodes = [...document.body.children].filter((node) => !bodyChildren.has(node));
  return () => {
    window.HeroFreeze?.release(true);
    scope.dispose();
    ownedNodes.forEach((node) => node.remove());
    for (const surface of surfaces) {
      for (const node of surface.querySelectorAll('*')) if (!originalNodes.has(node)) node.remove();
    }
    for (const [node, attributes] of originalNodes) {
      for (const attribute of [...node.attributes]) node.removeAttribute(attribute.name);
      for (const [name, value] of attributes) node.setAttribute(name, value);
    }
    document.documentElement.classList.remove(
      'intro-pending',
      'scroll-held',
      'sculpture-loading',
      'hero-frozen',
      'freeze-transitioning',
      'liquid-ready',
    );
    document.body.classList.remove('story-running', 'deck-settled', 'modal-open');
    for (const key of engineGlobals) {
      if (previous.get(key) === undefined) Reflect.deleteProperty(window, key);
      else Reflect.set(window, key, previous.get(key));
    }
  };
}
