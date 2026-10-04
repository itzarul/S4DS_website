/** @param {import("../../../lib/effectScope").EffectScope} scope */
export default function mount(scope) {
  const { window, document, gsap } = scope.environment;
  // Original vanilla-GSAP heading animation; the carousel is never targeted here.
  window.ArchiveTitleOrbit = {
    createFlight({ width, height, centerX, centerY, headerBottom, titleHeight }) {
      const flightY = Math.max(height * 0.4, headerBottom + titleHeight * 0.95 + 20) - centerY;
      const state = {
        x: -width * 0.04 - centerX,
        y: flightY,
        scale: 1.9,
        rotation: 0,
        rotationX: 8,
        rotationY: -22,
        curve: 1,
      };
      const timeline = gsap.timeline({ paused: true });
      timeline
        // Cross the full viewport before changing size. End beyond the right edge.
        .to(state, {
          x: width * 1.04 - centerX,
          y: flightY,
          scale: 1.9,
          rotationX: -6,
          rotationY: 22,
          duration: 1.6,
          ease: 'power2.inOut',
        })
        // Return and decelerate to the exact untransformed heading geometry.
        .to(state, {
          x: 0,
          y: 0,
          scale: 1,
          rotationX: 0,
          rotationY: 0,
          curve: 0,
          duration: 1.8,
          ease: 'power3.out',
        });
      return {
        sample(progress) {
          timeline.progress(Math.max(0, Math.min(1, progress)), true);
          return state;
        },
        destroy() {
          timeline.kill();
        },
      };
    },
    mount(stage, title, header) {
      const camera = document.createElement('div');
      camera.className = 'archive-title-camera';
      camera.setAttribute('aria-hidden', 'true');
      const copy = title.cloneNode(true);
      copy.removeAttribute('id');
      copy.className = 'archive-title-orbit';
      camera.append(copy);
      stage.append(camera);
      let flight;
      let glyphs = [];
      let titleWidth = 0;
      function measure() {
        const bounds = title.getBoundingClientRect();
        const origin = stage.getBoundingClientRect();
        const style = getComputedStyle(title);
        const width = stage.clientWidth;
        Object.assign(camera.style, {
          left: `${bounds.left - origin.left}px`,
          top: `${bounds.top - origin.top}px`,
          width: `${bounds.width}px`,
          height: `${bounds.height}px`,
          perspective: `${Math.max(700, width * 0.75)}px`,
        });
        Object.assign(copy.style, {
          font: style.font,
          letterSpacing: style.letterSpacing,
          color: style.color,
        });
        titleWidth = bounds.width;
        // Measure the original typesetting before splitting, preserving its kerning.
        copy.innerHTML = title.innerHTML;
        gsap.set(copy, { x: 0, y: 0, scale: 1, rotation: 0, rotationX: 0, rotationY: 0 });
        glyphs = [];
        for (const line of [...copy.children]) {
          const lineRect = line.getBoundingClientRect();
          const text = line.firstChild;
          const slots = Array.from(text.textContent).map((letter, index) => {
            const range = document.createRange();
            range.setStart(text, index);
            range.setEnd(text, index + 1);
            const rect = range.getBoundingClientRect();
            return { letter, left: rect.left - lineRect.left, width: rect.width };
          });
          Object.assign(line.style, {
            position: 'relative',
            height: `${lineRect.height}px`,
            transformStyle: 'preserve-3d',
          });
          line.replaceChildren();
          for (const slot of slots) {
            const glyph = document.createElement('span');
            Object.assign(glyph.style, {
              position: 'absolute',
              left: `${slot.left}px`,
              top: '0',
              width: `${slot.width}px`,
              transformStyle: 'preserve-3d',
              transformOrigin: '50% 50%',
            });
            const sides = [];
            for (let depth = 3; depth >= 1; depth--) {
              const side = document.createElement('span');
              side.textContent = slot.letter;
              Object.assign(side.style, {
                position: 'absolute',
                inset: '0',
                color: depth === 1 ? '#8298b3' : '#34445b',
              });
              glyph.append(side);
              sides.push({ element: side, depth });
            }
            const face = document.createElement('span');
            face.textContent = slot.letter;
            face.style.position = 'relative';
            glyph.append(face);
            line.append(glyph);
            glyphs.push({ element: glyph, center: slot.left + slot.width / 2, sides });
          }
        }
        flight?.destroy();
        flight = window.ArchiveTitleOrbit.createFlight({
          width,
          height: stage.clientHeight,
          centerX: bounds.left - origin.left + bounds.width / 2,
          centerY: bounds.top - origin.top + bounds.height / 2,
          headerBottom: header.getBoundingClientRect().bottom - origin.top,
          titleHeight: bounds.height,
        });
      }
      function update(virtual, pageOffset) {
        const t = Math.max(0, Math.min(1, (virtual - 140) / 145));
        const moving = virtual >= 140 && virtual < 285;
        title.style.visibility = virtual < 285 ? 'hidden' : '';
        camera.style.visibility = moving ? 'visible' : 'hidden';
        if (!moving || !flight) return;
        const state = flight.sample(t);
        // Letters wrap a cylinder individually; the heading never flips as a flat panel.
        const radius = titleWidth / 1.8;
        for (const glyph of glyphs) {
          const flatX = glyph.center - titleWidth / 2;
          const angle = (flatX / radius) * state.curve;
          const arcX = state.curve > 0.00001 ? (radius / state.curve) * Math.sin(angle) : flatX;
          const z = state.curve > 0.00001 ? (radius / state.curve) * (Math.cos(angle) - 1) : 0;
          gsap.set(glyph.element, {
            x: arcX - flatX,
            z,
            rotationY: (angle * 180) / Math.PI,
            force3D: true,
          });
          for (const side of glyph.sides) {
            gsap.set(side.element, {
              z: -side.depth * 1.4 * state.curve,
              opacity: state.curve,
              force3D: true,
            });
          }
        }
        // Match the still-arriving archive page exactly at the handoff.
        const { x, scale, rotation, rotationX, rotationY } = state;
        gsap.set(copy, {
          x,
          scale,
          rotation,
          rotationX,
          rotationY,
          y: state.y + pageOffset * t * t * t,
          force3D: true,
        });
      }
      return {
        measure,
        update,
        destroy() {
          flight?.destroy();
          camera.remove();
          title.style.removeProperty('visibility');
        },
      };
    },
  };
}
