import * as THREE from 'three';

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

// A separable nine-tap Gaussian evaluated with five bilinear texture reads.
const blurShader = `
  uniform sampler2D source;
  uniform vec2 direction;
  varying vec2 vUv;
  void main() {
    vec3 light = texture2D(source, vUv).rgb * 0.227027;
    light += texture2D(source, vUv + direction * 1.384615).rgb * 0.316216;
    light += texture2D(source, vUv - direction * 1.384615).rgb * 0.316216;
    light += texture2D(source, vUv + direction * 3.230769).rgb * 0.070270;
    light += texture2D(source, vUv - direction * 3.230769).rgb * 0.070270;
    gl_FragColor = vec4(light, 1.0);
  }
`;

/** Ring-only optical bloom. Half-resolution blur; no general postprocessing framework. */
export default function createRingBloom(renderer, scene, camera) {
  const type = renderer.extensions.has('EXT_color_buffer_float')
    ? THREE.HalfFloatType
    : THREE.UnsignedByteType;
  const main = new THREE.WebGLRenderTarget(1, 1, { type, samples: 2 });
  const glow = new THREE.WebGLRenderTarget(1, 1, { type, samples: 4 });
  const blur = new THREE.WebGLRenderTarget(1, 1, { type, depthBuffer: false });
  const diffuse = new THREE.WebGLRenderTarget(1, 1, { type, depthBuffer: false });
  const diffuseBlur = new THREE.WebGLRenderTarget(1, 1, { type, depthBuffer: false });
  const screen = new THREE.Scene();
  const screenCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  const geometry = new THREE.PlaneGeometry(2, 2);
  const blurMaterial = new THREE.ShaderMaterial({
    uniforms: { source: { value: null }, direction: { value: new THREE.Vector2() } },
    vertexShader,
    fragmentShader: blurShader,
    depthTest: false,
    depthWrite: false,
    blending: THREE.NoBlending,
  });
  const compositeMaterial = new THREE.ShaderMaterial({
    uniforms: {
      base: { value: main.texture },
      bloom: { value: glow.texture },
      diffuse: { value: diffuse.texture },
      strength: { value: 0.85 },
    },
    vertexShader,
    fragmentShader: `
      uniform sampler2D base;
      uniform sampler2D bloom;
      uniform sampler2D diffuse;
      uniform float strength;
      varying vec2 vUv;
      void main() {
        vec4 scene = texture2D(base, vUv);
        vec3 halo = (texture2D(bloom, vUv).rgb + texture2D(diffuse, vUv).rgb * .45) * strength * vec3(.12, .38, 1.0);
        vec3 light = scene.rgb + halo;
        gl_FragColor = vec4(light, scene.a);
        #include <colorspace_fragment>
        // Preserve transparency so the existing atmosphere remains visible behind the canvas.
        vec3 haloSRGB = sRGBTransferOETF(vec4(halo, 1.0)).rgb;
        float haloAlpha = clamp(max(haloSRGB.r, max(haloSRGB.g, haloSRGB.b)), 0.0, 1.0);
        gl_FragColor.a = max(scene.a, haloAlpha);
      }
    `,
    depthTest: false,
    depthWrite: false,
    blending: THREE.NoBlending,
  });
  const quad = new THREE.Mesh(geometry, blurMaterial);
  screen.add(quad);

  // Black masks still write depth: light behind the plinth stays behind it.
  const masks = [];
  scene.traverse((mesh) => {
    if (!mesh.material || mesh.userData.bloom) return;
    const original = mesh.material;
    const material = new THREE.MeshBasicMaterial({
      color: 0x000000,
      fog: false,
      toneMapped: false,
      transparent: original.transparent,
      side: original.side,
      depthWrite: original.depthWrite,
    });
    masks.push({ mesh, original, material });
  });
  let glowWidth = 1,
    glowHeight = 1,
    diffuseWidth = 1,
    diffuseHeight = 1;
  return {
    resize(width, height, pixelRatio, mobile) {
      main.setSize(Math.round(width * pixelRatio), Math.round(height * pixelRatio));
      // Cap the bloom buffer at CSS resolution even on high-density screens.
      const scale = mobile ? 0.8 : 1;
      glowWidth = Math.max(1, Math.round(width * scale));
      glowHeight = Math.max(1, Math.round(height * scale));
      glow.setSize(glowWidth, glowHeight);
      blur.setSize(glowWidth, glowHeight);
      diffuseWidth = Math.max(1, Math.round(width * 0.2));
      diffuseHeight = Math.max(1, Math.round(height * 0.2));
      diffuse.setSize(diffuseWidth, diffuseHeight);
      diffuseBlur.setSize(diffuseWidth, diffuseHeight);
    },
    render(strength = 0.85) {
      renderer.setRenderTarget(main);
      renderer.render(scene, camera);
      try {
        masks.forEach(({ mesh, original, material }) => {
          if (material.map !== original.map) {
            material.map = original.map;
            material.needsUpdate = true;
          }
          material.opacity = original.opacity;
          mesh.material = material;
        });
        renderer.setRenderTarget(glow);
        renderer.render(scene, camera);
      } finally {
        masks.forEach(({ mesh, original }) => {
          mesh.material = original;
        });
      }
      quad.material = blurMaterial;
      blurMaterial.uniforms.source.value = glow.texture;
      blurMaterial.uniforms.direction.value.set(1 / glowWidth, 0);
      renderer.setRenderTarget(blur);
      renderer.render(screen, screenCamera);
      blurMaterial.uniforms.source.value = blur.texture;
      blurMaterial.uniforms.direction.value.set(0, 1 / glowHeight);
      renderer.setRenderTarget(glow);
      renderer.render(screen, screenCamera);
      // A second, lower-resolution lobe supplies a faint wider halo around the filament.
      blurMaterial.uniforms.source.value = glow.texture;
      blurMaterial.uniforms.direction.value.set(1 / diffuseWidth, 0);
      renderer.setRenderTarget(diffuseBlur);
      renderer.render(screen, screenCamera);
      blurMaterial.uniforms.source.value = diffuseBlur.texture;
      blurMaterial.uniforms.direction.value.set(0, 1 / diffuseHeight);
      renderer.setRenderTarget(diffuse);
      renderer.render(screen, screenCamera);
      compositeMaterial.uniforms.strength.value = strength;
      quad.material = compositeMaterial;
      renderer.setRenderTarget(null);
      renderer.render(screen, screenCamera);
    },
    dispose() {
      main.dispose();
      glow.dispose();
      blur.dispose();
      diffuse.dispose();
      diffuseBlur.dispose();
      geometry.dispose();
      blurMaterial.dispose();
      compositeMaterial.dispose();
      masks.forEach(({ material }) => material.dispose());
    },
  };
}
