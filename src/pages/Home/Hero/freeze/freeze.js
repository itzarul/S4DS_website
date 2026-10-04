/** @param {import("../../../../lib/effectScope").EffectScope} scope */
export default function mount(scope) {
  const { window, document, setTimeout, clearTimeout, matchMedia, gsap } = scope.environment;
  (() => {
    const root = document.documentElement,
      main = document.querySelector('main'),
      host = document.querySelector('.hero-sculpture');
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    const dialog = document.createElement('section');
    dialog.className = 'freeze-dialog';
    dialog.setAttribute('role', 'dialog');
    dialog.setAttribute('aria-modal', 'true');
    dialog.setAttribute('aria-labelledby', 'freeze-title');
    dialog.hidden = true;
    dialog.tabIndex = -1;
    dialog.innerHTML =
      '<div class="sr-only"><h2 id="freeze-title">Where data meets purpose</h2><p>S4DS, TCET’s data and AI community. A student-driven community built around curiosity, experimentation and technology. Explore, learn, build and evolve. Our focus: data science, artificial intelligence, analytics, development, research and innovation.</p></div><button class="freeze-sound" type="button" aria-pressed="false">SOUND ON</button><button class="freeze-exit" type="button">CLICK ANYWHERE TO RETURN · ESC</button>';
    document.body.append(dialog);
    const soundButton = dialog.querySelector('.freeze-sound');
    const state = { charge: 0, reveal: 0 };
    let active = false,
      charging = false,
      exiting = false,
      origin,
      heldPointer,
      entryPointer,
      ignoreClickUntil = 0,
      tween,
      exitTween,
      previousFocus,
      wasInert = false,
      muted = false;
    let audio,
      buffers = {},
      sources = new Set(),
      holdSound,
      audioToken = 0,
      music;
    const pending = {};
    function primeAudio() {
      try {
        audio ??= new (window.AudioContext || window.webkitAudioContext)();
        audio.resume().catch(() => {});
        for (const [key, file] of Object.entries({ hold: 'freeze-hold', enter: 'freeze-enter' }))
          pending[key] ??= fetch(`assets/${file}.mp3`)
            .then((r) => {
              if (!r.ok) throw Error('Audio unavailable');
              return r.arrayBuffer();
            })
            .then((b) => audio.decodeAudioData(b))
            .then((b) => (buffers[key] = b))
            .catch(() => null);
      } catch {
        /* Audio support is optional; the visual interaction remains available. */
      }
    }
    function stopVoice(voice, fade = 0.15) {
      if (!voice || voice.stopped) return;
      voice.stopped = true;
      const now = audio.currentTime;
      voice.gain.gain.cancelScheduledValues(now);
      voice.gain.gain.setTargetAtTime(0, now, Math.max(0.01, fade / 4));
      if (voice.element) {
        voice.timer = setTimeout(() => {
          if (voice.stopped) voice.element.pause();
          sources.delete(voice);
        }, fade * 1000);
        return;
      }
      try {
        voice.source.stop(now + fade);
      } catch {
        /* A buffer source may already have ended before teardown. */
      }
    }
    function play(key, { loop = false, volume = 0.35, rate = 1, fade = 0.1 } = {}) {
      if (muted || !audio || !buffers[key]) return null;
      const source = audio.createBufferSource(),
        gain = audio.createGain();
      source.buffer = buffers[key];
      source.loop = loop;
      source.playbackRate.value = rate;
      gain.gain.value = 0;
      source.connect(gain).connect(audio.destination);
      gain.gain.linearRampToValueAtTime(volume, audio.currentTime + fade);
      const voice = { source, gain, stopped: false };
      sources.add(voice);
      source.onended = () => {
        sources.delete(voice);
        source.disconnect();
        gain.disconnect();
      };
      source.start();
      return voice;
    }
    function beginAmbience() {
      if (!audio || !active || exiting || muted) return;
      // Stream the long instrumental; do not decode 90 seconds into mobile RAM.
      if (!music) {
        const element = new Audio('assets/freeze-ambient.mp3');
        element.loop = true;
        element.preload = 'none';
        const source = audio.createMediaElementSource(element),
          gain = audio.createGain();
        gain.gain.value = 0;
        source.connect(gain).connect(audio.destination);
        music = { element, source, gain, stopped: true };
      }
      clearTimeout(music.timer);
      music.stopped = false;
      sources.add(music);
      music.element.play().catch(() => {});
      music.gain.gain.cancelScheduledValues(audio.currentTime);
      music.gain.gain.setTargetAtTime(0.3, audio.currentTime, 0.3);
    }
    function paint() {
      root.style.setProperty('--freeze-charge', state.charge.toFixed(4));
      root.style.setProperty('--freeze-reveal', state.reveal.toFixed(4));
      const tear = reduced.matches
        ? 0
        : Math.sin(state.charge * 82) * Math.sin(state.charge * Math.PI) * 2.4;
      root.style.setProperty('--freeze-tear', `${tear.toFixed(2)}px`);
      window.HeroLiquid?.setTransition(state.reveal);
    }
    function clearHold() {
      tween?.kill();
      tween = null;
      origin = null;
      heldPointer = null;
      charging = false;
      host.classList.remove('freeze-charging');
      stopVoice(holdSound, 0.12);
      holdSound = null;
    }
    function cancelHold() {
      if (!charging) return;
      clearHold();
      audioToken++;
      tween = gsap.to(state, {
        charge: 0,
        duration: reduced.matches ? 0.12 : 0.38,
        ease: 'power2.out',
        onUpdate: paint,
        onComplete() {
          root.classList.remove('freeze-transitioning');
          root.style.removeProperty('--freeze-charge');
          window.SiteScroll?.unlock('hero-hold');
        },
      });
    }
    function freeze() {
      if (
        active ||
        window.HeroIntroLock?.active ||
        (window.storyVirtual || 0) > 1 ||
        !window.HeroLiquid
      ) {
        cancelHold();
        return;
      }
      entryPointer = heldPointer;
      clearHold();
      active = true;
      exiting = false;
      previousFocus = document.activeElement;
      wasInert = main.inert;
      window.SiteScroll?.lock('hero-freeze');
      window.SiteScroll?.unlock('hero-hold');
      window.WarpTextMotion?.stop();
      main.inert = true;
      root.classList.add('hero-frozen', 'freeze-transitioning');
      dialog.hidden = false;
      dialog.focus({ preventScroll: true });
      window.HeroLiquid.start();
      window.dispatchEvent(new Event('herofreezechange'));
      const token = audioToken;
      pending.enter?.then(() => {
        if (active && !exiting && token === audioToken) play('enter', { volume: 0.38 });
      });
      beginAmbience();
      tween = gsap.to(state, {
        charge: 1,
        reveal: 1,
        duration: reduced.matches ? 0.18 : 0.9,
        ease: 'power2.inOut',
        onUpdate: paint,
      });
    }
    function finishExit() {
      active = false;
      exiting = false;
      root.classList.remove('hero-frozen', 'freeze-transitioning');
      root.style.removeProperty('--freeze-charge');
      root.style.removeProperty('--freeze-reveal');
      root.style.removeProperty('--freeze-tear');
      window.HeroLiquid?.stop();
      main.inert = wasInert;
      dialog.hidden = true;
      state.charge = state.reveal = 0;
      window.dispatchEvent(new Event('herofreezechange'));
      window.SiteScroll?.unlock('hero-freeze');
      window.SiteScroll?.unlock('hero-hold');
      if (previousFocus?.isConnected) previousFocus.focus({ preventScroll: true });
    }
    function release(immediate = false) {
      if (!active || exiting) return;
      exiting = true;
      audioToken++;
      tween?.kill();
      for (const voice of sources) stopVoice(voice, immediate ? 0 : 0.55);
      if (immediate) {
        exitTween?.kill();
        finishExit();
        return;
      }
      exitTween = gsap.to(state, {
        charge: 0,
        reveal: 0,
        duration: reduced.matches ? 0.16 : 0.75,
        ease: 'power2.inOut',
        onUpdate: paint,
        onComplete: finishExit,
      });
    }
    function beginHold(e) {
      if (
        e.button !== 0 ||
        active ||
        charging ||
        window.HeroIntroLock?.active ||
        (window.storyVirtual || 0) > 1
      )
        return;
      primeAudio();
      audioToken++;
      const token = audioToken;
      charging = true;
      origin = { x: e.clientX, y: e.clientY };
      heldPointer = e.pointerId;
      root.classList.add('freeze-transitioning');
      host.classList.add('freeze-charging');
      window.WarpTextMotion?.stop();
      window.SiteScroll?.lock('hero-hold');
      pending.hold?.then(() => {
        if (charging && token === audioToken)
          holdSound = play('hold', { volume: 0.35, rate: 0.52 });
      });
      tween?.kill();
      tween = gsap.to(state, {
        charge: 1,
        duration: 1.05,
        ease: 'power1.inOut',
        onUpdate: paint,
        onComplete: freeze,
      });
    }
    host.addEventListener('pointerdown', beginHold);
    window.addEventListener(
      'pointermove',
      (e) => {
        if (
          charging &&
          origin &&
          e.pointerId === heldPointer &&
          Math.hypot(e.clientX - origin.x, e.clientY - origin.y) > 9
        )
          cancelHold();
      },
      { passive: true },
    );
    window.addEventListener(
      'pointerup',
      (e) => {
        if (active && entryPointer === e.pointerId) {
          entryPointer = null;
          ignoreClickUntil = performance.now() + 120;
        }
        cancelHold();
      },
      { passive: true },
    );
    window.addEventListener('pointercancel', cancelHold, { passive: true });
    window.addEventListener(
      'click',
      (e) => {
        if (!active) return;
        e.preventDefault();
        e.stopImmediatePropagation();
        if (exiting || performance.now() < ignoreClickUntil) return;
        if (e.target.closest('.freeze-sound')) {
          muted = !muted;
          soundButton.textContent = muted ? 'SOUND OFF' : 'SOUND ON';
          soundButton.setAttribute('aria-pressed', String(muted));
          if (muted) {
            for (const voice of sources) stopVoice(voice);
          } else {
            primeAudio();
            beginAmbience();
          }
          return;
        }
        release();
      },
      true,
    );
    window.addEventListener(
      'keydown',
      (e) => {
        if (active) {
          if (e.key === 'Escape') {
            e.preventDefault();
            release();
          }
          if (e.key === 'Tab') {
            const buttons = [...dialog.querySelectorAll('button')],
              i = buttons.indexOf(document.activeElement);
            e.preventDefault();
            buttons[(i + (e.shiftKey ? -1 : 1) + buttons.length) % buttons.length].focus();
          }
          return;
        }
        if (e.target === host && e.key.toLowerCase() === 'f') {
          e.preventDefault();
          primeAudio();
          audioToken++;
          freeze();
        }
      },
      true,
    );
    window.HeroFreeze = {
      get active() {
        return active;
      },
      get charging() {
        return charging;
      },
      get exiting() {
        return exiting;
      },
      release,
    };
    // Visibility changes can race with page teardown; consume the promise so a
    // closed AudioContext never surfaces as an unhandled rejection.
    const pauseAudio = () => {
      cancelHold();
      if (audio && audio.state === 'running') audio.suspend().catch(() => {});
    };
    window.addEventListener('blur', pauseAudio);
    window.addEventListener('focus', () => {
      if (active && !muted) audio?.resume().catch(() => {});
    });
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) pauseAudio();
      else if (active && !muted) audio?.resume().catch(() => {});
    });
    window.addEventListener(
      'resize',
      () => {
        cancelHold();
        if (exiting) {
          exitTween?.kill();
          finishExit();
        } else release(true);
      },
      { passive: true },
    );
    window.addEventListener(
      'pagehide',
      () => {
        clearHold();
        tween?.kill();
        exitTween?.kill();
        for (const voice of sources) stopVoice(voice, 0);
        if (music) {
          clearTimeout(music.timer);
          music.element.pause();
          music.element.removeAttribute('src');
          music.element.load();
          music.source.disconnect();
          music.gain.disconnect();
        }
        audio?.close().catch(() => {});
        window.SiteScroll?.unlock('hero-hold');
        window.SiteScroll?.unlock('hero-freeze');
      },
      { once: true },
    );
  })();
}
