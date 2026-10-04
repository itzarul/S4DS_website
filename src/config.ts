import type { RenderQuality } from './lib/types';

export function detectRenderQuality(): RenderQuality {
  const low = Boolean(
    navigator.connection?.saveData ||
    (navigator.deviceMemory && navigator.deviceMemory <= 4) ||
    navigator.hardwareConcurrency <= 4,
  );
  const mobile = matchMedia('(pointer:coarse)').matches;
  return {
    low,
    mobile,
    dpr: low ? 1 : mobile ? 1.25 : 1.5,
    fps: low ? 24 : mobile ? 30 : 45,
    particles: low ? 1500 : mobile ? 2600 : 5200,
    reflectionSize: low ? 64 : 128,
    reflectionInterval: low ? 850 : mobile ? 500 : 250,
  };
}
