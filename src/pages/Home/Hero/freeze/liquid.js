/** @param {import("../../../../lib/effectScope").EffectScope} scope */
export default function mount(scope) {
  const { window, document, requestAnimationFrame, cancelAnimationFrame, matchMedia } =
    scope.environment;
  // A live GPU view of the existing sculpture in the reference's liquid spectrum.
  (() => {
    const quality = window.RenderQuality || { low: false, dpr: 1.5, fps: 45 };
    const canvas = document.createElement('canvas');
    canvas.className = 'freeze-liquid';
    canvas.setAttribute('aria-hidden', 'true');
    const gl = canvas.getContext('webgl', {
      alpha: false,
      antialias: false,
      powerPreference: 'low-power',
    });
    if (!gl) {
      window.mountFreezeFallback(canvas);
      return;
    }
    document.body.append(canvas);
    const vertex =
      'attribute vec2 p;varying vec2 uv;void main(){uv=p*.5+.5;gl_Position=vec4(p,0.,1.);}';
    const fragment = `precision mediump float;
    varying vec2 uv;uniform sampler2D world,model,hud,flowmap;uniform float time,aspect,cursorEnergy,transitionPhase,lite;uniform vec2 mouse;
    float hash(float n){return fract(sin(n*127.1)*43758.5453);}
    float wave(vec2 p){return sin(p.x*7.+time*.58+sin(p.y*9.-time*.32))*.45+sin(p.x*14.-time*.4+p.y*6.)*.2;}
    vec3 spectrum(float n){return mix(vec3(.30,.035,.56),vec3(.02,.8,1.),smoothstep(-.6,.75,sin(n)));}
    vec4 object(vec2 q){if(q.x<0.||q.x>1.||q.y<0.||q.y>1.)return vec4(0.);return texture2D(model,q);}
    void main(){
      vec3 wake=texture2D(flowmap,uv).rgb;
      vec2 velocity=(wake.rg-vec2(128./255.))*(255./450.);
      float smoke=clamp(wake.b*2.,0.,1.);
      // Refract the scene through the wake, including the text layer.
      // Fine curls follow the stroke and dissipate with its density.
      vec2 texel=vec2(1./96.);
      vec2 densityGradient=vec2(texture2D(flowmap,uv+vec2(texel.x,0.)).b-texture2D(flowmap,uv-vec2(texel.x,0.)).b,texture2D(flowmap,uv+vec2(0.,texel.y)).b-texture2D(flowmap,uv-vec2(0.,texel.y)).b);
      // Curl along the wake's own edges instead of waving the whole cursor area.
      vec2 eddy=vec2(-densityGradient.y,densityGradient.x);
      float fold=sin(wake.b*19.-time*1.2);
      vec2 dragFlow=velocity*.36+eddy*(.06+.025*fold)/vec2(aspect,1.);
      float displacement=length(dragFlow*vec2(aspect,1.));
      dragFlow*=min(1.,.027/max(displacement,.00001));
      float burst=sin(clamp(transitionPhase,0.,1.)*3.14159265);
      float rowId=floor(uv.y*74.);
      vec2 digitalShift=vec2((hash(rowId+floor(time*19.))-.5)*.08*burst,0.);
      vec2 q=uv-dragFlow+digitalShift;
      float band=floor(q.y*115.);
      float gate=step(.972,hash(band+floor(time*5.)));
      float jump=(hash(band+11.)-.5)*.045*gate;
      q.x+=jump;
      q+=vec2(wave(q)*.008,sin(q.x*11.+time*.65)*.003);
      vec3 bg=texture2D(world,clamp(q,0.,1.)).rgb;
      float l=dot(bg,vec3(.2,.5,.3));
      vec3 color=vec3(.004,.001,.015)+spectrum(q.y*6.+q.x*3.+time*.16)*l*.7;
      // A flowing reflective surface, with irregular cyan/violet contour ribbons.
      float floorMask=1.-smoothstep(.43,.57,q.y);
      float depth=max(.03,.56-q.y);
      float contour=q.y*53.+wave(vec2(q.x*1.4,q.y*3.))*6.+sin(q.x*9.-time*.35)*1.3;
      float thin=pow(.5+.5*sin(contour*3.),20.);
      float drift=sin(q.x*6.+time*.35+sin(q.y*8.))*.5+.5;
      vec3 ribbons=spectrum(q.x*7.+q.y*11.+time*.3)*thin*(.16+.5*drift);
      color+=ribbons*floorMask*smoothstep(.02,.15,q.y)*(1.-smoothstep(.35,.58,depth));
      // Centre the real rotating object only within this alternate, scroll-locked mode.
      float modelSize=aspect<.8?min(.55,aspect*.9):.55*min(1.,aspect/2.057);
      vec2 modelCenter=vec2(.49,aspect<.8?.607:.599);
      vec2 oq=(q-modelCenter)*vec2(aspect,1.)/modelSize+.5;
      oq+=vec2(sin(oq.y*13.+time*.8),cos(oq.x*10.-time*.6))*.012;
      oq+=(mouse-.5)*.012;
      vec4 body=object(oq);float d=.003;
      vec3 edge=vec3(0.);if(lite<.5)edge=abs(object(oq+vec2(d,0.)).rgb-object(oq-vec2(d,0.)).rgb)+abs(object(oq+vec2(0.,d)).rgb-object(oq-vec2(0.,d)).rgb);
      float edgeLight=dot(edge,vec3(.33));
      vec3 neon=body.rgb*vec3(.72,.52,1.1)+spectrum(oq.y*8.+oq.x*5.+time*.25)*edgeLight*1.7;
      color=mix(color,neon,body.a);
      // A rippling echo below the object links it to the liquid environment.
      vec2 rq=(vec2(q.x,.91-q.y)-modelCenter)*vec2(aspect,1.)/modelSize+.5;
      rq.x+=wave(vec2(q.x*2.,q.y*6.))*.13+sin(q.y*140.+time*1.3)*.016;
      vec4 reflection=object(rq);
      color+=reflection.rgb*vec3(.75,.4,1.2)*reflection.a*floorMask*.42*exp(-depth*4.);
      // Localised digital tears; no full-screen strobe or repeated camera shake.
      color+=spectrum(band*.17)*gate*.13*step(.5,hash(floor(q.x*14.)+band));
      vec2 textUv=uv-dragFlow+digitalShift;
      vec4 hudColor=texture2D(hud,clamp(textUv,0.,1.));
      float vignette=1.-.55*smoothstep(.25,.8,length((uv-.5)*vec2(.9,1.)));
      vec3 composed=mix(color*vignette,hudColor.rgb,hudColor.a);
      // Only existing illuminated details catch the smoke; dark areas stay clear.
      composed+=composed*vec3(.02,.16,.22)*smoke;
      gl_FragColor=vec4(composed,1.);
    }`;
    function compile(type, source) {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS))
        throw new Error(gl.getShaderInfoLog(shader));
      return shader;
    }
    let program;
    try {
      program = gl.createProgram();
      const v = compile(gl.VERTEX_SHADER, vertex),
        f = compile(gl.FRAGMENT_SHADER, fragment);
      gl.attachShader(program, v);
      gl.attachShader(program, f);
      gl.linkProgram(program);
      gl.deleteShader(v);
      gl.deleteShader(f);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS))
        throw new Error('Liquid scene unavailable');
    } catch {
      canvas.remove();
      return;
    }
    gl.useProgram(program);
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW,
    );
    const p = gl.getAttribLocation(program, 'p');
    gl.enableVertexAttribArray(p);
    gl.vertexAttribPointer(p, 2, gl.FLOAT, false, 0, 0);
    function texture(unit) {
      const t = gl.createTexture();
      gl.activeTexture(gl.TEXTURE0 + unit);
      gl.bindTexture(gl.TEXTURE_2D, t);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGBA,
        1,
        1,
        0,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        new Uint8Array([0, 0, 0, 0]),
      );
      return t;
    }
    const background = texture(0),
      sculpture = texture(1),
      interfaceTexture = texture(2),
      flowTexture = texture(3),
      flow = window.createFreezeFlow();
    gl.uniform1i(gl.getUniformLocation(program, 'world'), 0);
    gl.uniform1i(gl.getUniformLocation(program, 'model'), 1);
    gl.uniform1i(gl.getUniformLocation(program, 'hud'), 2);
    gl.uniform1i(gl.getUniformLocation(program, 'flowmap'), 3);
    gl.uniform1f(gl.getUniformLocation(program, 'lite'), quality.low ? 1 : 0);
    const up = gl.getUniformLocation(program, 'transitionPhase');
    const ut = gl.getUniformLocation(program, 'time'),
      ua = gl.getUniformLocation(program, 'aspect'),
      um = gl.getUniformLocation(program, 'mouse'),
      ue = gl.getUniformLocation(program, 'cursorEnergy');
    const img = new Image();
    img.onload = scope.guard(() => {
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, background);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
    });
    img.src = 'assets/hero-background.webp';
    let active = false,
      raf = 0,
      start = 0,
      last = 0,
      energy = 0,
      lastUpload = 0,
      pointer = { x: 0.5, y: 0.5 };
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    function renderInterface() {
      const source = window.FreezeConsole?.render(innerWidth, innerHeight);
      if (source) {
        gl.activeTexture(gl.TEXTURE2);
        gl.bindTexture(gl.TEXTURE_2D, interfaceTexture);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, source);
      }
    }
    window.addEventListener('freezeconsoleready', renderInterface);
    function resize() {
      const ratio = Math.min(
        devicePixelRatio,
        quality.dpr,
        (quality.low ? 1000 : 2200) / innerWidth,
      );
      canvas.width = Math.round(innerWidth * ratio);
      canvas.height = Math.round(innerHeight * ratio);
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform1f(ua, innerWidth / innerHeight);
      renderInterface();
    }
    function draw(now) {
      raf = 0;
      if (!active || document.hidden) return;
      if (now - last >= 1000 / quality.fps) {
        const dt = Math.min(0.07, (now - last) / 1000);
        energy *= Math.exp(-dt * 2.4);
        const strength = flow.step(reduced.matches ? 0 : dt);
        gl.activeTexture(gl.TEXTURE3);
        gl.bindTexture(gl.TEXTURE_2D, flowTexture);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
        gl.texImage2D(
          gl.TEXTURE_2D,
          0,
          gl.RGBA,
          flow.size,
          flow.size,
          0,
          gl.RGBA,
          gl.UNSIGNED_BYTE,
          flow.bytes,
        );
        gl.uniform1f(ue, reduced.matches ? 0 : energy);
        gl.uniform1f(ut, reduced.matches ? 0 : (now - start) / 1000);
        gl.uniform2f(um, pointer.x, pointer.y);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
        last = now;
        canvas.dataset.tick = String(Math.round(now));
        canvas.dataset.cursorEnergy = energy.toFixed(3);
        canvas.dataset.flowStrength = strength.toFixed(3);
      }
      if (!reduced.matches) raf = requestAnimationFrame(draw);
    }
    window.addEventListener('herosculptureframe', (event) => {
      const now = performance.now();
      if (!active || (!reduced.matches && now - lastUpload < 1000 / quality.fps)) return;
      lastUpload = now;
      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, sculpture);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, event.detail);
      if (reduced.matches) draw(performance.now());
    });
    window.addEventListener(
      'pointermove',
      (e) => {
        const x = e.clientX / innerWidth,
          y = 1 - e.clientY / innerHeight;
        if (active && e.pointerType !== 'touch' && !reduced.matches) {
          const dx = x - pointer.x,
            dy = y - pointer.y;
          energy = Math.min(1, energy + Math.hypot(dx, dy) * 16);
          const steps = Math.min(12, Math.ceil(Math.hypot(dx, dy) * 100));
          for (let i = 1; i <= steps; i++)
            flow.stroke(
              pointer.x + (dx * i) / steps,
              pointer.y + (dy * i) / steps,
              dx / steps,
              dy / steps,
              innerWidth / innerHeight,
            );
        }
        pointer.x = x;
        pointer.y = y;
      },
      { passive: true },
    );
    window.HeroLiquid = {
      setTransition(value) {
        gl.uniform1f(up, reduced.matches ? 1 : value);
      },
      start() {
        active = true;
        energy = 0;
        flow.clear();
        start = performance.now();
        last = 0;
        resize();
        document.documentElement.classList.add('liquid-ready');
        draw(start);
      },
      stop() {
        active = false;
        energy = 0;
        flow.clear();
        cancelAnimationFrame(raf);
        document.documentElement.classList.remove('liquid-ready');
      },
    };
    document.addEventListener('visibilitychange', () => {
      cancelAnimationFrame(raf);
      if (!document.hidden && active) {
        last = 0;
        draw(performance.now());
      }
    });
    window.addEventListener(
      'pagehide',
      () => {
        cancelAnimationFrame(raf);
        gl.deleteTexture(background);
        gl.deleteTexture(sculpture);
        gl.deleteTexture(interfaceTexture);
        gl.deleteTexture(flowTexture);
        gl.deleteBuffer(buffer);
        gl.deleteProgram(program);
        gl.getExtension('WEBGL_lose_context')?.loseContext();
        canvas.remove();
      },
      { once: true },
    );
  })();
}
