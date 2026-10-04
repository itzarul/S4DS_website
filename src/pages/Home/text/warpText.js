/** @param {import("../../../lib/effectScope").EffectScope} scope */
export default function mount(scope) {
  const {
    window,
    document,
    requestAnimationFrame,
    cancelAnimationFrame,
    setTimeout,
    clearTimeout,
    matchMedia,
  } = scope.environment;
  // The supplied React Bits WarpText shader, adapted to the existing DOM headings.
  // One shared WebGL canvas renders only during hover; original headings stay semantic.
  (() => {
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    const targets = [...document.querySelectorAll('#hero-title, #deck-title, #archive-title')];
    targets.forEach((el) => (el.dataset.warpText = ''));
    const canvas = document.createElement('canvas');
    canvas.className = 'text-warp-canvas';
    canvas.setAttribute('aria-hidden', 'true');
    const gl = canvas.getContext('webgl2', {
      alpha: true,
      antialias: false,
      premultipliedAlpha: false,
      powerPreference: 'low-power',
    });
    if (!gl) return;
    let program, buffer, texture;
    try {
      const compile = (type, source) => {
        const shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
          const error = gl.getShaderInfoLog(shader);
          gl.deleteShader(shader);
          throw new Error(error);
        }
        return shader;
      };
      const vertex = compile(gl.VERTEX_SHADER, window.S4DSWarpShaders.vertex);
      const fragment = compile(gl.FRAGMENT_SHADER, window.S4DSWarpShaders.fragment);
      program = gl.createProgram();
      gl.attachShader(program, vertex);
      gl.attachShader(program, fragment);
      gl.linkProgram(program);
      gl.deleteShader(vertex);
      gl.deleteShader(fragment);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS))
        throw new Error(gl.getProgramInfoLog(program));
      gl.useProgram(program);
      buffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([-1, -1, 0, 0, 3, -1, 2, 0, -1, 3, 0, 2]),
        gl.STATIC_DRAW,
      );
      for (const [name, offset] of [
        ['position', 0],
        ['uv', 8],
      ]) {
        const loc = gl.getAttribLocation(program, name);
        gl.enableVertexAttribArray(loc);
        gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 16, offset);
      }
      texture = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    } catch (error) {
      console.warn('Warp text uses its static fallback:', error.message);
      return;
    }
    document.body.append(canvas);
    const uniforms = Object.fromEntries(
      [
        'uResolution',
        'uPointer',
        'uPointerActive',
        'uTime',
        'uWarpStrength',
        'uWarpScale',
        'uSpeed',
        'uPointerInfluence',
        'uPointerStrength',
        'uRefraction',
        'uRipple',
        'uMotion',
      ].map((name) => [name, gl.getUniformLocation(program, name)]),
    );
    const scalar = (name, value) => gl.uniform1f(uniforms[name], value);
    scalar('uWarpScale', 1.7);
    scalar('uSpeed', 0.55);
    scalar('uPointerInfluence', 0.45);
    scalar('uPointerStrength', 0.78);
    scalar('uRipple', 1);
    scalar('uMotion', 1);
    let current = null,
      frame = 0,
      active = 0,
      targetActive = 0,
      px = 0.5,
      py = 0.5,
      tx = 0.5,
      ty = 0.5;
    let bounds,
      started = 0,
      lastDraw = 0,
      leaveTimer = 0;
    const padding = 24;
    function stop() {
      clearTimeout(leaveTimer);
      leaveTimer = 0;
      cancelAnimationFrame(frame);
      frame = 0;
      active = targetActive = 0;
      current?.classList.remove('text-warp-active');
      current = null;
      canvas.style.display = 'none';
    }
    function leave() {
      targetActive = 0;
      if (current && !leaveTimer) leaveTimer = setTimeout(stop, 260);
    }
    const allowed = (el) =>
      el?.id === 'hero-title'
        ? (window.storyVirtual || 0) < 0.01 && window.EntranceMotion?.heroReady !== false
        : (window.storyVirtual || 0) >= 285;
    window.WarpTextMotion = {
      sync() {
        if (current && !allowed(current)) stop();
      },
      stop,
    };
    function enter(el) {
      stop();
      const geometry = window.TextEffectGeometry?.measure(el);
      if (!geometry?.cells.length) return false;
      const { box, scaleX, scaleY } = geometry;
      const width = box.width + padding * 2,
        height = box.height + padding * 2;
      const dpr = Math.min(devicePixelRatio, 1.5);
      const bitmap = document.createElement('canvas');
      bitmap.width = Math.ceil(width * dpr);
      bitmap.height = Math.ceil(height * dpr);
      const ctx = bitmap.getContext('2d');
      ctx.scale(dpr, dpr);
      ctx.textBaseline = 'alphabetic';
      for (const cell of geometry.cells) {
        ctx.font = cell.font;
        ctx.fillStyle = cell.color;
        const metrics = ctx.measureText(cell.letter);
        const ascent = metrics.fontBoundingBoxAscent ?? metrics.actualBoundingBoxAscent;
        const descent = metrics.fontBoundingBoxDescent ?? metrics.actualBoundingBoxDescent;
        const baseline = cell.y + (cell.height - ascent - descent) / 2 + ascent;
        ctx.save();
        ctx.translate(padding, padding);
        ctx.scale(scaleX, scaleY);
        ctx.fillText(cell.letter, cell.x + el.clientLeft, baseline + el.clientTop);
        ctx.restore();
      }
      canvas.width = bitmap.width;
      canvas.height = bitmap.height;
      bounds = { left: box.left - padding, top: box.top - padding, width, height };
      Object.assign(canvas.style, {
        display: 'block',
        left: `${bounds.left}px`,
        top: `${bounds.top}px`,
        width: `${width}px`,
        height: `${height}px`,
      });
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.useProgram(program);
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, bitmap);
      gl.uniform2f(uniforms.uResolution, canvas.width, canvas.height);
      current = el;
      started = performance.now();
      current.classList.add('text-warp-active');
      return true;
    }
    function draw(now) {
      frame = 0;
      if (
        !current ||
        !allowed(current) ||
        reduced.matches ||
        document.hidden ||
        current.closest('[inert]')
      ) {
        stop();
        return;
      }
      const follow = 1 - Math.exp(-Math.min(0.15, (now - lastDraw) / 1000 || 0.016) * 18);
      lastDraw = now;
      px += (tx - px) * follow;
      py += (ty - py) * follow;
      active += (targetActive - active) * follow;
      gl.uniform2f(uniforms.uPointer, px, py);
      scalar('uPointerActive', active);
      scalar('uTime', (now - started) / 1000);
      scalar('uWarpStrength', 0.06 * active);
      scalar('uRefraction', 0.008 * active);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      if (!targetActive && active < 0.005) {
        stop();
        return;
      }
      frame = requestAnimationFrame(draw);
    }
    document.addEventListener(
      'pointermove',
      (event) => {
        if (event.pointerType === 'touch' || reduced.matches || document.hidden) return;
        const el = targets.find((el) => {
          if (!allowed(el)) return false;
          if (
            el.closest('[inert], [hidden], [aria-hidden="true"]') ||
            getComputedStyle(el).visibility === 'hidden'
          )
            return false;
          // Wait for the existing cryptic hero arrival to return its original text.
          if (el.id === 'hero-title' && el.querySelector('[aria-hidden="true"]')) return false;
          const r = el.getBoundingClientRect();
          return (
            event.clientX >= r.left &&
            event.clientX <= r.right &&
            event.clientY >= r.top &&
            event.clientY <= r.bottom
          );
        });
        if (!el) {
          leave();
          return;
        }
        clearTimeout(leaveTimer);
        leaveTimer = 0;
        if (el !== current && !enter(el)) return;
        tx = (event.clientX - bounds.left) / bounds.width;
        ty = 1 - (event.clientY - bounds.top) / bounds.height;
        if (!frame) {
          px = tx;
          py = ty;
        }
        targetActive = 1;
        if (!frame) frame = requestAnimationFrame(draw);
      },
      { passive: true },
    );
    document.addEventListener('pointerleave', leave);
    window.addEventListener('scroll', stop, { passive: true });
    window.addEventListener('resize', stop, { passive: true });
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) stop();
    });
    reduced.addEventListener('change', stop);
    canvas.addEventListener('webglcontextlost', stop);
    window.addEventListener(
      'pagehide',
      () => {
        stop();
        gl.deleteTexture(texture);
        gl.deleteBuffer(buffer);
        gl.deleteProgram(program);
        gl.getExtension('WEBGL_lose_context')?.loseContext();
        canvas.remove();
      },
      { once: true },
    );
  })();
}
