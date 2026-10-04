const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { JSDOM } = require('jsdom');

let server, window, load;
const globalsBefore = new Map();

before(async () => {
  const dom = new JSDOM('<!doctype html><body><div id="root"></div></body>', { url: 'http://localhost:3001/', pretendToBeVisual: true });
  window = dom.window;
  const media = new window.EventTarget();
  media.matches = true;
  media.addListener = media.addEventListener.bind(media, 'change');
  media.removeListener = media.removeEventListener.bind(media, 'change');
  window.matchMedia = () => media;
  window.scrollTo = () => {};
  class Observer { observe() {} unobserve() {} disconnect() {} }
  window.IntersectionObserver = Observer;
  window.ResizeObserver = Observer;
  Object.defineProperty(window.document, 'fonts', { value: { ready: Promise.resolve(), addEventListener() {}, removeEventListener() {} } });
  const gradient = { addColorStop() {} };
  const ctx = new Proxy({ measureText(text) { return { width: text.length * 8 }; }, createLinearGradient() { return gradient; }, createRadialGradient() { return gradient; } }, { get(target, key) { return key in target ? target[key] : () => {}; } });
  window.HTMLCanvasElement.prototype.getContext = function (kind) { return kind === '2d' ? ctx : null; };
  for (const name of ['window', 'document', 'navigator', 'location', 'history', 'Element', 'HTMLElement', 'HTMLCanvasElement', 'SVGElement', 'Image', 'Event', 'EventTarget', 'CustomEvent', 'PageTransitionEvent', 'MutationObserver', 'ResizeObserver', 'IntersectionObserver', 'innerWidth', 'innerHeight', 'devicePixelRatio', 'scrollY']) {
    globalsBefore.set(name, Object.getOwnPropertyDescriptor(globalThis, name));
    Object.defineProperty(globalThis, name, { value: name === 'window' ? window : window[name], configurable: true, writable: true });
  }
  for (const name of ['getComputedStyle', 'requestAnimationFrame', 'cancelAnimationFrame', 'matchMedia', 'scrollTo']) {
    globalsBefore.set(name, Object.getOwnPropertyDescriptor(globalThis, name));
    Object.defineProperty(globalThis, name, { value: window[name].bind(window), configurable: true, writable: true });
  }
  const { createServer } = await import('vite');
  server = await createServer({ server: { middlewareMode: true, hmr: false }, appType: 'custom' });
  load = route => server.ssrLoadModule(route);
  const { detectRenderQuality } = await load('/src/config.ts');
  window.RenderQuality = detectRenderQuality();
});

after(async () => {
  if (server) {
    const { gsap, ScrollTrigger } = await load('/src/lib/gsap.ts');
    ScrollTrigger.killAll();
    ScrollTrigger.disable();
    gsap.ticker.sleep();
  }
  await server?.close();
  window?.close();
  for (const [name, descriptor] of globalsBefore) {
    if (descriptor) Object.defineProperty(globalThis, name, descriptor);
    else delete globalThis[name];
  }
});

function canonical(node) {
  if (node.nodeType === 3) {
    const text = node.textContent.replace(/\s+/g, ' ');
    return text.trim() ? text : null;
  }
  if (node.nodeType !== 1) return null;
  const attributes = [...node.attributes].map(attribute => {
    let value = attribute.value;
    if (['src', 'href'].includes(attribute.name)) value = value.replace(/^\//, '');
    if (attribute.name === 'inert' || (attribute.name.startsWith('data-') && value === 'true')) value = '';
    return [attribute.name, value];
  }).sort(([a], [b]) => a.localeCompare(b));
  return { tag: node.tagName, attributes, children: [...node.childNodes].map(canonical).filter(Boolean) };
}

test('React sections retain the reference DOM, content, SVG geometry, and asset references', async () => {
  const React = require('react');
  const { renderToStaticMarkup } = require('react-dom/server');
  const { HomeSequence } = await load('/src/pages/Home/HomeSequence.tsx');
  const { Footer } = await load('/src/pages/Home/Footer/Footer.tsx');
  const current = new JSDOM(renderToStaticMarkup(React.createElement(React.Fragment, null, React.createElement(HomeSequence), React.createElement(Footer)))).window.document;
  const reference = new JSDOM(fs.readFileSync(path.join(__dirname, 'fixtures/reference-home.html'), 'utf8')).window.document;
  assert.deepEqual(canonical(current.querySelector('.story-track')), canonical(reference.querySelector('.story-track')));
  assert.deepEqual(canonical(current.querySelector('.connect-footer')), canonical(reference.querySelector('.connect-footer')));
});

test('scoped imperative effects dispose listeners, observers, timers, and pending font callbacks', async () => {
  const { EffectScope } = await load('/src/lib/effectScope.ts');
  const promiseScope = new EffectScope();
  let rejected = false;
  await promiseScope.when(Promise.reject(new Error('font load')), () => {}).catch(() => { rejected = true; });
  assert.equal(rejected, true);
  promiseScope.dispose();
  let events = 0, timers = 0, pending = 0;
  let resolve;
  const fonts = new Promise(done => { resolve = done; });
  const target = new window.EventTarget();
  const mount = () => {
    const scope = new EffectScope();
    scope.initialize(() => {
      target.addEventListener('test', () => events++);
      scope.environment.setTimeout(() => timers++, 30);
      scope.when(fonts, () => pending++);
    });
    return scope;
  };
  const first = mount();
  first.dispose();
  const second = mount();
  target.dispatchEvent(new window.Event('test'));
  assert.equal(events, 1);
  second.dispose();
  resolve();
  await new Promise(done => setTimeout(done, 50));
  assert.equal(timers, 0);
  assert.equal(pending, 0);
});

test('Home effects remount without duplicate glare, particle canvases, freeze layers, or missing footer copy', async () => {
  const React = require('react');
  const { renderToStaticMarkup } = require('react-dom/server');
  const { HomeSequence } = await load('/src/pages/Home/HomeSequence.tsx');
  const { Footer } = await load('/src/pages/Home/Footer/Footer.tsx');
  window.document.body.innerHTML = '<main><header class="site-header"><div class="brand"></div><button class="menu-toggle"></button><nav class="site-nav"></nav></header>' + renderToStaticMarkup(React.createElement(React.Fragment, null, React.createElement(HomeSequence), React.createElement(Footer))) + '</main><div data-join-modal hidden></div>';
  const { mountHomeAnimations } = await load('/src/pages/Home/homeAnimations.ts');
  const previousWarn = console.warn;
  const previousError = console.error;
  console.warn = (...args) => { if (!String(args[0]).startsWith('Using sculpture image fallback:')) previousWarn(...args); };
  console.error = (...args) => { if (!String(args[0]).startsWith('THREE.WebGLRenderer: Error creating WebGL context.')) previousError(...args); };
  try {
    for (let i = 0; i < 2; i++) {
      const dispose = mountHomeAnimations(true);
      await Promise.resolve();
      assert.equal(window.document.querySelectorAll('.card-glare').length, 8);
      assert.equal(window.document.querySelectorAll('.space-particles').length, 3);
      assert.equal(window.document.querySelectorAll('.freeze-dialog').length, 1);
      assert.equal(window.HeroIntroLock.active, false);
      dispose();
      assert.equal(window.document.querySelectorAll('.card-glare, .space-particles, .freeze-dialog, .freeze-liquid').length, 0);
      assert.equal(window.document.querySelector('.connect-kicker').textContent, 'KEEP IN SYNC');
      assert.equal(window.document.querySelector('.connect-title').textContent, 'CONNECTWITH US');
    }
  } finally { console.warn = previousWarn; console.error = previousError; }
});

test('navigation opens separate pages, returns Home immediately, and keeps same-page effects alive', async () => {
  const React = require('react');
  const { createRoot } = require('react-dom/client');
  const previousAct = globalThis.IS_REACT_ACT_ENVIRONMENT;
  globalThis.IS_REACT_ACT_ENVIRONMENT = true;
  window.document.body.innerHTML = '<div id="root"></div>';
  const { App } = await load('/src/App.tsx');
  const root = createRoot(window.document.getElementById('root'));
  const previousError = console.error, previousWarn = console.warn;
  console.error = (...args) => { if (!String(args[0]).startsWith('THREE.WebGLRenderer: Error creating WebGL context.')) previousError(...args); };
  console.warn = (...args) => { if (!String(args[0]).startsWith('Using sculpture image fallback:')) previousWarn(...args); };
  const click = async selector => React.act(async () => window.document.querySelector(selector).dispatchEvent(new window.MouseEvent('click', { bubbles: true, cancelable: true, button: 0 })));
  try {
    await React.act(async () => root.render(React.createElement(React.StrictMode, null, React.createElement(App))));
    const textEngine = window.TextEffects;
    await click('a[href="/#contact"]');
    assert.equal(location.hash, '#contact');
    await click('a[href="/#home"]');
    assert.equal(window.TextEffects, textEngine);
    for (const page of ['team', 'events', 'gallery']) {
      await click(`a[href="/${page}.html"]`);
      assert.equal(location.pathname, `/${page}.html`);
      assert.ok(window.document.body.classList.contains(`blank-page--${page}`));
      assert.equal(window.document.querySelector('.story-track'), null);
      assert.equal(window.document.querySelectorAll('.freeze-dialog, .freeze-liquid').length, 0);
      await click('a[href="/#home"]');
      assert.ok(window.document.querySelector('.story-track'));
      assert.equal(window.HeroIntroLock.active, false);
      assert.equal(window.document.documentElement.classList.contains('intro-pending'), false);
      assert.equal(window.document.querySelectorAll('.card-glare').length, 8);
    }
    await click('[data-open-join]');
    assert.equal(window.document.querySelector('[data-join-modal]').hidden, false);
    assert.equal(window.document.querySelector('main').inert, true);
    await click('.modal-close');
    assert.equal(window.document.querySelector('[data-join-modal]').hidden, true);
    assert.equal(window.document.querySelector('main').inert, false);
  } finally {
    await React.act(async () => root.unmount());
    console.error = previousError; console.warn = previousWarn;
    globalThis.IS_REACT_ACT_ENVIRONMENT = previousAct;
  }
});
