import { gsap, ScrollTrigger, Lenis } from './gsap';

type Cleanup = () => void;

export class EffectScope {
  disposed = false;
  skipIntro = false;
  private cleanups: Cleanup[] = [];
  private frames = new Set<number>();
  private timeouts = new Set<number>();
  private intervals = new Set<number>();
  private context = gsap.context(() => {});
  private listenerMap = new WeakMap<
    EventListenerOrEventListenerObject,
    Map<EventTarget, Map<string, EventListener>>
  >();

  constructor(skipIntro = false) {
    this.skipIntro = skipIntro;
  }

  guard<T extends unknown[]>(callback: (...args: T) => void) {
    return (...args: T) => {
      if (!this.disposed) this.run(() => callback(...args));
    };
  }

  when<T>(promise: PromiseLike<T>, callback: (value: T) => void) {
    return Promise.resolve(promise).then(this.guard(callback));
  }

  own(cleanup: Cleanup) {
    this.cleanups.push(cleanup);
  }

  run<T>(callback: () => T): T | undefined {
    if (this.disposed) return;
    const scope = this;
    const nativeAdd = EventTarget.prototype.addEventListener;
    const nativeRemove = EventTarget.prototype.removeEventListener;

    EventTarget.prototype.addEventListener = function (type, listener, options) {
      if (!listener) return;
      const capture = typeof options === 'boolean' ? options : Boolean(options?.capture);
      const key = `${type}:${capture}`;
      let targets = scope.listenerMap.get(listener);
      if (!targets) scope.listenerMap.set(listener, (targets = new Map()));
      let types = targets.get(this);
      if (!types) targets.set(this, (types = new Map()));
      if (types.has(key)) return;
      const target: EventTarget = this;
      const wrapped: EventListener = (event) =>
        scope.run(() => {
          if (typeof listener === 'function') listener.call(target, event);
          else listener.handleEvent(event);
        });
      types.set(key, wrapped);
      nativeAdd.call(this, type, wrapped, options);
      scope.own(() => {
        if (type === 'pagehide' && target === window) {
          if (typeof listener === 'function')
            listener.call(target, new PageTransitionEvent('pagehide'));
          else listener.handleEvent(new PageTransitionEvent('pagehide'));
        }
        nativeRemove.call(target, type, wrapped, options);
      });
    };
    EventTarget.prototype.removeEventListener = function (type, listener, options) {
      const capture = typeof options === 'boolean' ? options : Boolean(options?.capture);
      const wrapped =
        listener && scope.listenerMap.get(listener)?.get(this)?.get(`${type}:${capture}`);
      nativeRemove.call(this, type, wrapped || listener, options);
      if (listener) scope.listenerMap.get(listener)?.get(this)?.delete(`${type}:${capture}`);
    };
    try {
      return callback();
    } finally {
      EventTarget.prototype.addEventListener = nativeAdd;
      EventTarget.prototype.removeEventListener = nativeRemove;
    }
  }

  get environment() {
    const scope = this;
    class ScopedIntersectionObserver extends IntersectionObserver {
      constructor(callback: IntersectionObserverCallback, options?: IntersectionObserverInit) {
        super(scope.guard(callback), options);
        scope.own(() => this.disconnect());
      }
    }
    class ScopedResizeObserver extends ResizeObserver {
      constructor(callback: ResizeObserverCallback) {
        super(scope.guard(callback));
        scope.own(() => this.disconnect());
      }
    }
    class ScopedMutationObserver extends MutationObserver {
      constructor(callback: MutationCallback) {
        super(scope.guard(callback));
        scope.own(() => this.disconnect());
      }
    }
    return {
      window,
      document,
      gsap,
      ScrollTrigger,
      Lenis,
      matchMedia: window.matchMedia.bind(window),
      IntersectionObserver: ScopedIntersectionObserver,
      ResizeObserver: ScopedResizeObserver,
      MutationObserver: ScopedMutationObserver,
      requestAnimationFrame(callback: FrameRequestCallback) {
        if (scope.disposed) return 0;
        const id = window.requestAnimationFrame((time) => {
          scope.frames.delete(id);
          scope.run(() => callback(time));
        });
        scope.frames.add(id);
        return id;
      },
      cancelAnimationFrame(id: number) {
        scope.frames.delete(id);
        window.cancelAnimationFrame(id);
      },
      setTimeout(callback: () => void, delay?: number) {
        const id = window.setTimeout(() => {
          scope.timeouts.delete(id);
          scope.run(callback);
        }, delay);
        scope.timeouts.add(id);
        return id;
      },
      clearTimeout(id: number) {
        scope.timeouts.delete(id);
        window.clearTimeout(id);
      },
      setInterval(callback: () => void, delay?: number) {
        const id = window.setInterval(scope.guard(callback), delay);
        scope.intervals.add(id);
        return id;
      },
      clearInterval(id: number) {
        scope.intervals.delete(id);
        window.clearInterval(id);
      },
    };
  }

  initialize(callback: () => void) {
    this.context.add(() => this.run(callback));
  }

  dispose() {
    if (this.disposed) return;
    for (const cleanup of this.cleanups.reverse()) cleanup();
    this.disposed = true;
    this.frames.forEach(window.cancelAnimationFrame.bind(window));
    this.timeouts.forEach(window.clearTimeout.bind(window));
    this.intervals.forEach(window.clearInterval.bind(window));
    this.context.revert();
    this.cleanups = [];
  }
}
