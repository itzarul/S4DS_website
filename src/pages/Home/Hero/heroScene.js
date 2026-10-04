import * as THREE from 'three';
/** @param {import("../../../lib/effectScope").EffectScope} scope */
export default function mount(scope) {
  const {
    window,
    document,
    setTimeout,
    matchMedia,
    IntersectionObserver,
    ResizeObserver,
    MutationObserver,
  } = scope.environment;

  const host = document.querySelector('.hero-sculpture');
  if (host) {
    // Three.js setup (geometry and shader compilation) is the heaviest
    // part of the first load. Keep the lightweight reference image available
    // during the intro and boot WebGL just before the sculpture is revealed.
    // This removes the large main-thread/GPU spike from the opening frame while
    // preserving the exact final sculpture and all of its interactions.
    const boot = () => {
      // Once the WebGL reveal begins, never let the reference bitmap flash
      // through behind the glitch slices. It remains available if setup fails.
      host.classList.add('webgl-loading');
      try {
        mountSculpture(host);
      } catch (error) {
        host.classList.remove('webgl-loading');
        host.classList.add('is-fallback');
        console.warn('Using sculpture image fallback:', error.message);
      }
    };
    const introHeld = Boolean(window.HeroIntroLock?.active);
    if (introHeld && !matchMedia('(prefers-reduced-motion: reduce)').matches)
      setTimeout(boot, 5600);
    else boot();
  }

  function mountSculpture(host) {
    let disposed = false;
    const quality = window.RenderQuality || {
      low: false,
      dpr: 1.5,
      fps: 45,
      particles: 5200,
      reflectionSize: 128,
      reflectionInterval: 250,
    };
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: !quality.low,
      powerPreference: 'low-power',
    });
    renderer.setPixelRatio(Math.min(devicePixelRatio, quality.dpr));
    renderer.setClearColor(0x000000, 0);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.domElement.setAttribute('aria-hidden', 'true');
    host.prepend(renderer.domElement);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(43, 1, 0.1, 40);
    camera.position.set(0, 0, 11.4);

    // A studio reflection environment: bright ribbons give the glass crisp edges.
    const studio = document.createElement('canvas');
    studio.width = 1024;
    studio.height = 512;
    const ctx = studio.getContext('2d');
    ctx.fillStyle = '#080e1b';
    ctx.fillRect(0, 0, 1024, 512);
    for (const [x, w, color] of [
      [65, 24, '#dcefff'],
      [235, 14, '#30baff'],
      [335, 35, '#ffffff'],
      [510, 13, '#ff81ca'],
      [645, 22, '#ddeaff'],
      [790, 18, '#8ffff1'],
      [915, 25, '#ffffff'],
    ]) {
      const gradient = ctx.createLinearGradient(0, 50, 0, 470);
      gradient.addColorStop(0, '#080e1b');
      gradient.addColorStop(0.35, color);
      gradient.addColorStop(0.65, color);
      gradient.addColorStop(1, '#080e1b');
      ctx.fillStyle = gradient;
      ctx.fillRect(x, 35, w, 440);
    }
    const environment = new THREE.CanvasTexture(studio);
    environment.mapping = THREE.EquirectangularReflectionMapping;
    environment.colorSpace = THREE.SRGBColorSpace;
    // The custom glass shaders sample this lightweight equirectangular texture
    // directly. A PMREM convolution is unnecessary here and costs hundreds of
    // milliseconds during startup on laptop GPUs.
    scene.add(new THREE.HemisphereLight(0xcceaff, 0x080d23, 0.4));
    for (const [color, intensity, position] of [
      [0xffffff, 1.3, [3, 5, 5]],
      [0x56b8ff, 1, [-4, -1, 3]],
      [0xdd92ff, 0.8, [1, -4, -2]],
    ]) {
      const light = new THREE.DirectionalLight(color, intensity);
      light.position.set(...position);
      scene.add(light);
    }

    const sculpture = new THREE.Group();
    scene.add(sculpture);
    const rotor = new THREE.Group();
    sculpture.add(rotor);
    const reference = new THREE.TextureLoader().load(
      '/assets/hero-sculpture-reference.webp',
      (texture) => {
        if (disposed) {
          texture.dispose();
          return;
        }
        draw();
      },
    );
    reference.colorSpace = THREE.SRGBColorSpace;
    // Light transmission through dark faces; bright reflections remain nearly opaque.
    const glass = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: true,
      side: THREE.FrontSide,
      toneMapped: false,
      uniforms: { studio: { value: environment }, reference: { value: reference } },
      vertexShader: `
      attribute vec2 referenceUv;
      varying vec3 vNormal; varying vec3 vEye; varying vec3 vLocal; varying vec2 vReferenceUv;
      void main() {
        vec4 view = modelViewMatrix * vec4(position,1.0);
        vNormal = normalize(normalMatrix * normal);
        vEye = -view.xyz; vLocal = position; vReferenceUv = referenceUv;
        gl_Position = projectionMatrix * view;
      }
    `,
      fragmentShader: `
      uniform sampler2D studio; uniform sampler2D reference;
      varying vec3 vNormal; varying vec3 vEye; varying vec3 vLocal; varying vec2 vReferenceUv;
      void main() {
        vec3 n=normalize(vNormal), eye=normalize(vEye);
        float facing=abs(dot(n,eye));
        float rim=pow(1.0-facing,2.2);
        vec3 reflection=(vec4(reflect(-eye,n),0.0)*viewMatrix).xyz;
        vec2 uv=vec2(atan(reflection.z,reflection.x)/6.2831853+.5,asin(clamp(reflection.y,-1.0,1.0))/3.14159265+.5);
        vec3 light=texture2D(studio,uv).rgb;
        float shine=max(light.r,max(light.g,light.b));
        float phase=vLocal.y*12.0+vLocal.x*4.0+dot(n,eye)*5.0;
        vec3 spectrum=pow(.5+.5*cos(phase+vec3(0.0,2.1,4.2)),vec3(2.5));
        float streak=pow(.5+.5*sin(vLocal.y*23.0+vLocal.x*9.0+reflection.x*5.0),14.0);
        float ends=smoothstep(.29,.5,abs(vLocal.y));
        float film=(streak*.18+ends*.48)*(rim*.6+.4);
        vec3 captured=texture2D(reference,vReferenceUv).rgb;
        float detail=max(captured.r,max(captured.g,captured.b));
        // Keep the reference's saturated colour instead of blending grey layers.
        float luma=dot(captured,vec3(.2126,.7152,.0722));
        captured=max(vec3(0.0),mix(vec3(luma),captured,1.22));
        vec3 color=vec3(.001,.003,.006)+captured*.94;
        color+=light*.055+spectrum*film*.55;
        color+=rim*shine*vec3(.06,.085,.12);
        // A restrained glass finish: transmit through face centres, retain the edges.
        float transmission=.26*(1.0-rim)*(1.0-smoothstep(.18,.75,detail));
        gl_FragColor=vec4(color,1.0-transmission);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }
    `,
    });
    // The sphere reflects the actual surrounding prisms, sampled from its centre.
    const coreTarget = new THREE.WebGLCubeRenderTarget(quality.reflectionSize, {
      type: THREE.UnsignedByteType,
      generateMipmaps: true,
      minFilter: THREE.LinearMipmapLinearFilter,
    });
    const reflectionCamera = new THREE.CubeCamera(0.05, 20, coreTarget);
    scene.add(reflectionCamera);
    const chrome = new THREE.ShaderMaterial({
      transparent: true,
      uniforms: {
        reflections: { value: coreTarget.texture },
        studio: { value: environment },
        reference: { value: reference },
      },
      vertexShader: `
      varying vec3 vWorldNormal;varying vec3 vWorldPosition;
      void main(){
        vec4 world=modelMatrix*vec4(position,1.0);
        vWorldPosition=world.xyz;vWorldNormal=normalize(mat3(modelMatrix)*normal);
        gl_Position=projectionMatrix*viewMatrix*world;
      }
    `,
      fragmentShader: `
      uniform samplerCube reflections;uniform sampler2D studio;uniform sampler2D reference;
      varying vec3 vWorldNormal;varying vec3 vWorldPosition;
      void main(){
        vec3 n=normalize(vWorldNormal),eye=normalize(cameraPosition-vWorldPosition);
        float facing=max(dot(n,eye),0.0),rim=pow(1.0-facing,2.5);
        vec3 direction=reflect(-eye,n);
        vec3 reflected=textureCube(reflections,direction).rgb;
        vec2 uv=vec2(atan(direction.z,direction.x)/6.2831853+.5,asin(clamp(direction.y,-1.0,1.0))/3.14159265+.5);
        vec3 studioLight=texture2D(studio,uv).rgb;
        float phase=atan(n.y,n.x)*6.0+facing*8.0;
        vec3 spectrum=pow(.5+.5*cos(phase+vec3(0.0,2.1,4.2)),vec3(2.0));
        vec3 color=vec3(.001,.003,.007)+reflected*(.10+rim*.65)+studioLight*.055;
        color+=rim*(spectrum*.85+vec3(.10,.28,.60));
        color+=vec3(.78,.88,.96)*pow(1.0-facing,5.0)*2.3;
        // Match the reference's black/blue chrome and spectral rim, retaining live reflections.
        vec3 viewNormal=normalize(mat3(viewMatrix)*n);
        vec2 coreUv=vec2((367.0+viewNormal.x*59.0)/735.0,1.0-(368.0-viewNormal.y*59.0)/736.0);
        vec3 referenceChrome=texture2D(reference,coreUv).rgb;
        color=mix(color,referenceChrome,.78)+reflected*.035;
        gl_FragColor=vec4(color,1.0);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }
    `,
    });
    const core = new THREE.Mesh(
      new THREE.SphereGeometry(0.66, quality.low ? 32 : 48, quality.low ? 24 : 36),
      chrome,
    );
    rotor.add(core);
    const shape = new THREE.Shape();
    shape.moveTo(-0.39, -0.5);
    shape.lineTo(0.39, -0.5);
    shape.lineTo(0.5, 0.5);
    shape.lineTo(-0.5, 0.5);
    shape.closePath();
    const prismGeometry = new THREE.ExtrudeGeometry(shape, {
      depth: 1,
      bevelEnabled: true,
      bevelSegments: 1,
      steps: 1,
      bevelSize: 0.018,
      bevelThickness: 0.018,
      curveSegments: 1,
    });
    prismGeometry.translate(0, 0, -0.5);
    const edgeGeometry = new THREE.EdgesGeometry(prismGeometry, 35);
    const edgeMaterial = new THREE.LineBasicMaterial({
      color: 0xb8c8d1,
      transparent: true,
      opacity: 0.4,
    });
    const wireMaterial = new THREE.LineBasicMaterial({
      color: 0x9aabb8,
      transparent: true,
      opacity: 0.45,
    });
    const shards = [];
    // Endpoints traced in reference-image space: gaps, stacks and tangential offsets matter.
    // [inner x/y, outer x/y, width, depth, z, wire-only]
    const bars = [
      [357, 237, 357, 51, 27, 19, -8],
      [379, 219, 410, 59, 38, 25, 8],
      [339, 238, 318, 91, 25, 19, -2],
      [374, 236, 393, 66, 25, 19, 22],
      [288, 244, 209, 106, 24, 16, 3],
      [270, 275, 147, 141, 17, 12, -16, 1],
      [414, 292, 472, 143, 36, 23, -9],
      [418, 302, 540, 188, 27, 21, 8],
      [422, 319, 614, 191, 28, 23, 23],
      [400, 306, 588, 199, 24, 18, -10],
      [516, 331, 661, 276, 17, 13, -20, 1],
      [303, 306, 126, 226, 22, 15, 2],
      [302, 319, 120, 251, 22, 18, 16],
      [310, 297, 225, 236, 28, 25, 27],
      [293, 285, 216, 226, 23, 24, 38],
      [321, 355, 108, 344, 19, 18, 22],
      [307, 375, 61, 392, 18, 12, -8],
      [236, 411, 70, 447, 22, 18, -1],
      [251, 421, 99, 481, 29, 22, 10],
      [302, 448, 169, 529, 27, 22, 22],
      [282, 440, 138, 514, 25, 20, -8],
      [321, 485, 232, 627, 26, 22, 4],
      [293, 470, 196, 622, 23, 19, -8],
      [307, 522, 247, 656, 21, 17, -20, 1],
      [364, 526, 381, 680, 31, 23, -3],
      [393, 482, 424, 619, 33, 21, 12],
      [370, 464, 380, 588, 27, 20, 26],
      [421, 461, 478, 584, 31, 25, 18],
      [412, 441, 467, 558, 32, 24, 35],
      [446, 432, 617, 535, 27, 20, -4],
      [445, 415, 650, 480, 22, 18, -12],
      [439, 394, 646, 421, 23, 19, 15],
      [441, 395, 555, 413, 22, 21, 29],
      [365, 417, 377, 465, 28, 24, 39],
      [389, 423, 417, 473, 31, 26, 32],
    ];
    for (const [index, [ax, ay, bx, by, w, d, , wire]] of bars.entries()) {
      const dx = bx - ax,
        dy = ay - by;
      const angle = Math.atan2(dy, dx);
      const pivot = new THREE.Group();
      // Fill a spherical shell, including both poles, instead of stacking a flat wheel.
      const elevations = [0.04, 0.58, -0.54, 0.91, -0.88, 0.32, -0.29, 0.74, -0.72, 0.18, -0.16];
      const elevation = elevations[index % elevations.length];
      const radial = Math.sqrt(1 - elevation * elevation);
      const direction = new THREE.Vector3(
        Math.cos(angle) * radial,
        Math.sin(angle) * radial,
        elevation,
      );
      const length = THREE.MathUtils.clamp(Math.hypot(dx, dy) / 100, 1.05, 2.35);
      const innerRadius = 1.35 + (index % 4) * 0.16;
      pivot.position.copy(direction).multiplyScalar(innerRadius + length * 0.5);
      pivot.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction);
      pivot.rotateY(((index % 5) - 2) * 0.13);
      const scale = new THREE.Vector3(w / 100, length, (d / 100) * 1.35);
      {
        const geometry = prismGeometry.clone();
        const positions = geometry.getAttribute('position');
        const photoUvs = [];
        pivot.updateMatrix();
        for (let i = 0; i < positions.count; i++) {
          const p = new THREE.Vector3().fromBufferAttribute(positions, i);
          const t = p.y + 0.5;
          photoUvs.push(
            (ax + (bx - ax) * t + p.x * w * Math.cos(angle - Math.PI / 2)) / 735,
            1 - (ay + (by - ay) * t - p.x * w * Math.sin(angle - Math.PI / 2)) / 736,
          );
        }
        geometry.setAttribute('referenceUv', new THREE.Float32BufferAttribute(photoUvs, 2));
        const mesh = new THREE.Mesh(geometry, glass);
        mesh.scale.copy(scale);
        pivot.add(mesh);
      }
      const edges = new THREE.LineSegments(edgeGeometry, wire ? wireMaterial : edgeMaterial);
      edges.scale.copy(scale);
      pivot.add(edges);
      rotor.add(pivot);
      shards.push({ pivot, base: pivot.position.clone(), direction });
    }

    const motion = matchMedia('(prefers-reduced-motion: reduce)');
    const layout = host.closest('.hero-layout');
    // Keep the expensive WebGL loop paused while the opening choreography is
    // still building the page. The sculpture is revealed at the end of the
    // intro, so rendering it underneath the hidden first paint only creates
    // needless GPU work and a noticeable laptop hitch.
    const introActive = () => Boolean(window.HeroIntroLock?.active);
    const hint = host.querySelector('.sculpture-hint');
    const hintMarkup = hint.innerHTML;
    let visible = true,
      running = false,
      paused = false,
      dragging = false,
      hovering = false;
    let yaw = 0,
      pitch = 0,
      targetYaw = 0,
      targetPitch = 0,
      cursorX = 0,
      cursorY = 0;
    let previousX = 0,
      previousY = 0,
      time = 0,
      lastFrame = 0;
    // Let the first visible frames use the shader's studio lighting. The cube
    // reflection is intentionally warmed up after the sculpture is on screen;
    // rendering six reflection faces during startup causes a visible hitch.
    let lastReflection = performance.now() + 1100,
      lastRendered = 0;
    function draw(now = performance.now()) {
      if (disposed) return;
      if (running && now - lastRendered < 1000 / quality.fps) return;
      lastRendered = now;
      const dt = Math.min((now - lastFrame) / 1000 || 0.016, 0.04);
      lastFrame = now;
      if (!paused && !motion.matches && !dragging) time += dt;
      const follow = 1 - Math.exp(-dt * 6);
      yaw += (targetYaw + (motion.matches ? 0 : cursorX * 0.16) - yaw) * follow;
      pitch += (targetPitch + (motion.matches ? 0 : cursorY * 0.12) - pitch) * follow;
      sculpture.rotation.set(0.04 + pitch, -0.04 + yaw, 0);
      rotor.rotation.z = Math.sin(time * 0.12) * 0.08;
      rotor.rotation.y = time * 0.08;
      sculpture.position.y = Math.sin(time * 0.55) * 0.045;
      const spread = hovering && !dragging && !motion.matches ? 0.2 : 0;
      for (const { pivot, base, direction } of shards) {
        for (const axis of ['x', 'y', 'z'])
          pivot.position[axis] +=
            (base[axis] + direction[axis] * spread - pivot.position[axis]) * follow;
      }
      if (now - lastReflection > quality.reflectionInterval || motion.matches) {
        scene.updateMatrixWorld(true);
        core.getWorldPosition(reflectionCamera.position);
        core.visible = false;
        reflectionCamera.update(renderer, scene);
        core.visible = true;
        lastReflection = now;
      }
      renderer.render(scene, camera);
      if (window.HeroFreeze?.active)
        window.dispatchEvent(
          new CustomEvent('herosculptureframe', { detail: renderer.domElement }),
        );
      host.classList.add('is-ready');
      host.classList.remove('webgl-loading');
      host.classList.remove('is-fallback');
    }
    function sync() {
      const active = visible && !document.hidden && !layout.inert && !introActive();
      const animate = active && (!motion.matches || dragging);
      if (animate !== running) {
        running = animate;
        lastFrame = performance.now();
        renderer.setAnimationLoop(animate ? draw : null);
      }
      if (active && !animate) draw();
      if (!active) {
        dragging = false;
        hovering = false;
      }
    }
    const resize = new ResizeObserver(() => {
      renderer.setSize(Math.max(1, host.clientWidth), Math.max(1, host.clientHeight), false);
      camera.aspect = host.clientWidth / Math.max(1, host.clientHeight);
      camera.updateProjectionMatrix();
      if (!introActive()) draw();
    });
    resize.observe(host);
    const visibility = new IntersectionObserver((entries) => {
      visible = entries[0].isIntersecting;
      sync();
    });
    visibility.observe(host);
    const layoutObserver = new MutationObserver(sync);
    layoutObserver.observe(layout, { attributes: true, attributeFilter: ['inert'] });
    const introObserver = new MutationObserver(sync);
    introObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });
    document.addEventListener('visibilitychange', sync);
    motion.addEventListener('change', sync);
    window.addEventListener('herofreezechange', () => {
      dragging = false;
      const size = window.HeroFreeze?.active
        ? Math.min(quality.low ? 384 : 640, Math.max(quality.low ? 256 : 512, host.clientWidth))
        : host.clientWidth;
      renderer.setSize(Math.max(1, size), Math.max(1, size), false);
      sync();
    });
    host.addEventListener('pointerenter', () => {
      hovering = true;
    });
    host.addEventListener('pointerleave', () => {
      hovering = false;
      cursorX = cursorY = 0;
    });
    host.addEventListener('pointerdown', (event) => {
      if (event.button !== 0 || window.HeroFreeze?.active) return;
      dragging = true;
      previousX = event.clientX;
      previousY = event.clientY;
      host.setPointerCapture(event.pointerId);
      sync();
    });
    window.addEventListener(
      'pointermove',
      (event) => {
        if (window.HeroFreeze?.active) return;
        const rect = host.getBoundingClientRect();
        hovering =
          visible &&
          !layout.inert &&
          event.clientX >= rect.left &&
          event.clientX <= rect.right &&
          event.clientY >= rect.top &&
          event.clientY <= rect.bottom;
        if (!hovering && !dragging) {
          cursorX = cursorY = 0;
          return;
        }
        cursorX = (event.clientX - rect.left) / rect.width - 0.5;
        cursorY = (event.clientY - rect.top) / rect.height - 0.5;
        if (dragging) {
          targetYaw += (event.clientX - previousX) * 0.008;
          targetPitch += (event.clientY - previousY) * 0.006;
          previousX = event.clientX;
          previousY = event.clientY;
        }
      },
      { passive: true },
    );
    for (const event of ['pointerup', 'pointercancel', 'lostpointercapture'])
      host.addEventListener(event, () => {
        dragging = false;
        sync();
      });
    host.addEventListener('keydown', (event) => {
      if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', ' ', 'Home'].includes(event.key))
        return;
      event.preventDefault();
      if (event.key === 'ArrowLeft') targetYaw -= 0.2;
      if (event.key === 'ArrowRight') targetYaw += 0.2;
      if (event.key === 'ArrowUp') targetPitch -= 0.2;
      if (event.key === 'ArrowDown') targetPitch += 0.2;
      if (event.key === 'Home') {
        targetYaw = targetPitch = 0;
        time = 0;
      }
      if (event.key === ' ') {
        paused = !paused;
        if (paused) hint.textContent = 'PAUSED · SPACE TO PLAY';
        else hint.innerHTML = hintMarkup;
      }
      if (motion.matches) {
        yaw = targetYaw;
        pitch = targetPitch;
        draw();
      }
      sync();
    });
    renderer.domElement.addEventListener('webglcontextlost', (event) => {
      event.preventDefault();
      renderer.setAnimationLoop(null);
      host.classList.remove('is-ready', 'webgl-loading');
      host.classList.add('is-fallback');
    });
    renderer.domElement.addEventListener('webglcontextrestored', () => {
      running = false;
      sync();
    });
    window.addEventListener(
      'pagehide',
      () => {
        disposed = true;
        renderer.setAnimationLoop(null);
        resize.disconnect();
        visibility.disconnect();
        layoutObserver.disconnect();
        introObserver.disconnect();
        scene.traverse((object) => {
          if (object.isMesh || object.isLineSegments) object.geometry.dispose();
        });
        prismGeometry.dispose();
        glass.dispose();
        chrome.dispose();
        edgeMaterial.dispose();
        wireMaterial.dispose();
        reference.dispose();
        environment.dispose();
        coreTarget.dispose();
        renderer.dispose();
        renderer.forceContextLoss();
        renderer.domElement.remove();
      },
      { once: true },
    );
    sync();
  }
}
