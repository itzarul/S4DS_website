import { useLayoutEffect } from 'react';
import mountCursor from './cursor';
import { EffectScope } from '../lib/effectScope';

export function CursorEffects() {
  useLayoutEffect(() => {
    const scope = new EffectScope();
    const before = new Set(document.body.children);
    scope.initialize(() => mountCursor(scope));
    const nodes = [...document.body.children].filter((node) => !before.has(node));
    return () => {
      scope.dispose();
      nodes.forEach((node) => node.remove());
      document.documentElement.classList.remove(
        'signal-pointer',
        'hand-pointer',
        'pointer-hover',
        'pointer-pressed',
      );
    };
  }, []);
  return null;
}
