import * as THREE from 'three';
// Articulated wing membranes, luminous veins and particles share the scene's depth.
export function createButterflyRig(ownGeometry, ownMaterial, low = !!window.RenderQuality?.low) {
  const rig = new THREE.Group();
  rig.rotation.set(0.08, -0.28, -0.12);
  const materials = {
      push(...items) {
        items.forEach(ownMaterial);
      },
    },
    geometries = {
      push(...items) {
        items.forEach(ownGeometry);
      },
    },
    wings = [];
  const lineMat = new THREE.MeshBasicMaterial({ color: 0xb9f4ff, toneMapped: false });
  const haloMat = new THREE.MeshBasicMaterial({
    color: 0x6588ff,
    transparent: true,
    opacity: 0.12,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    toneMapped: false,
  });
  materials.push(lineMat, haloMat);
  function line(group, points, r = 0.007) {
    const curve = new THREE.CatmullRomCurve3(points),
      g = new THREE.TubeGeometry(curve, low ? 35 : 70, r, 5, false);
    geometries.push(g);
    group.add(new THREE.Mesh(g, lineMat));
    if (r > 0.005) {
      const halo = new THREE.TubeGeometry(curve, low ? 35 : 70, r * 4, 5, false);
      geometries.push(halo);
      group.add(new THREE.Mesh(halo, haloMat));
    }
  }
  const membrane = new THREE.ShaderMaterial({
    side: THREE.DoubleSide,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: { phase: { value: 0 } },
    vertexShader:
      'varying vec3 p;void main(){p=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
    fragmentShader:
      'varying vec3 p;uniform float phase;void main(){float wave=.5+.5*sin(p.y*15.+p.x*11.+phase*2.);float ridge=pow(wave,22.);float pulse=.65+.35*sin(phase+p.y*2.);vec3 color=mix(vec3(.32,.008,.22),vec3(1.,.05,.52),clamp(p.y*.3+.3,0.,1.));gl_FragColor=vec4(color*(.24+ridge*.42),(.12+ridge*.16)*pulse);}',
  });
  materials.push(membrane);
  const upper = new THREE.Shape();
  upper.moveTo(0, 0);
  upper.bezierCurveTo(0.25, 0.5, 0.36, 1.3, 0.83, 1.73);
  upper.bezierCurveTo(1.28, 2.12, 1.48, 1.13, 1.28, 0.65);
  upper.bezierCurveTo(1.04, 0.2, 0.43, -0.1, 0, 0);
  const lower = new THREE.Shape();
  lower.moveTo(0, 0);
  lower.bezierCurveTo(0.46, 0.19, 1.11, -0.04, 1.1, -0.61);
  lower.bezierCurveTo(1.06, -1.12, 0.39, -1.13, 0.12, -0.56);
  lower.bezierCurveTo(0.03, -0.35, 0, -0.15, 0, 0);
  for (const side of [-1, 1]) {
    const hinge = new THREE.Group();
    hinge.scale.x = side;
    rig.add(hinge);
    wings.push(hinge);
    for (const shape of [upper, lower]) {
      const geo = new THREE.ShapeGeometry(shape, low ? 24 : 48);
      geometries.push(geo);
      hinge.add(new THREE.Mesh(geo, membrane));
      const outline = shape.getPoints(100).map((v) => new THREE.Vector3(v.x, v.y, 0));
      line(hinge, outline, 0.009);
      for (let j = 0; j < 4; j++) {
        const end = shape.getPoint(0.2 + j * 0.14);
        line(
          hinge,
          [
            new THREE.Vector3(0, 0, 0.006),
            new THREE.Vector3(end.x * 0.45, end.y * 0.38, 0.04),
            new THREE.Vector3(end.x * 0.75, end.y * 0.78, 0.012),
            new THREE.Vector3(end.x, end.y, 0.006),
          ],
          0.0035,
        );
      }
    }
    line(
      hinge,
      [
        new THREE.Vector3(0, 0.2, 0),
        new THREE.Vector3(0.13, 0.42, 0.03),
        new THREE.Vector3(0.24, 0.57, 0.02),
      ],
      0.005,
    );
  }
  const bodyGeo = new THREE.CapsuleGeometry(0.032, 0.54, 5, 10);
  geometries.push(bodyGeo);
  const body = new THREE.Mesh(bodyGeo, lineMat);
  body.position.y = -0.03;
  rig.add(body);
  // Looping sparkles trace the membranes and float around the wing tips.
  const count = low ? 170 : 320,
    vertices = new Float32Array(count * 3),
    seeds = [];
  const hash = (i) => {
    const n = Math.sin(i * 127.1 + 19.4) * 43758.5453;
    return n - Math.floor(n);
  };
  for (let i = 0; i < count; i++) seeds.push([hash(i), hash(i + 29), hash(i + 193)]);
  const pointsGeo = new THREE.BufferGeometry();
  pointsGeo.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
  geometries.push(pointsGeo);
  const sparkleMat = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: { phase: { value: 0 }, pixelRatio: { value: Math.min(devicePixelRatio, 1.5) } },
    vertexShader:
      'uniform float phase;uniform float pixelRatio;varying float intensity;void main(){intensity=.3+.7*pow(.5+.5*sin(phase*4.+position.x*17.+position.y*13.),4.);vec4 mv=modelViewMatrix*vec4(position,1.);gl_PointSize=(2.+intensity*4.)*pixelRatio;gl_Position=projectionMatrix*mv;}',
    fragmentShader:
      'varying float intensity;void main(){vec2 q=gl_PointCoord-.5;float r=length(q);float a=exp(-r*r*32.)*intensity;gl_FragColor=vec4(mix(vec3(1.,.10,.62),vec3(.9,1.,1.),intensity),a);}',
  });
  materials.push(sparkleMat);
  const sparks = new THREE.Points(pointsGeo, sparkleMat);
  rig.add(sparks);
  const glowGeo = new THREE.PlaneGeometry(3.4, 3.4);
  geometries.push(glowGeo);
  const glowMat = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    depthTest: false,
    blending: THREE.AdditiveBlending,
    uniforms: { energy: { value: 0.7 } },
    vertexShader:
      'varying vec2 uv0;void main(){uv0=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
    fragmentShader:
      'varying vec2 uv0;uniform float energy;void main(){float r=length((uv0-.5)*2.);float haze=exp(-r*r*9.)*.10;float core=exp(-r*r*260.)*.65;gl_FragColor=vec4(vec3(1.,.14,.65)*energy,(haze+core));}',
  });
  materials.push(glowMat);
  const glow = new THREE.Mesh(glowGeo, glowMat);
  glow.position.set(0, -0.04, 0.4);
  rig.add(glow);

  function update(time) {
    // Every motion uses integer harmonics of the same 8-second cycle.
    const phase = ((time % 8) / 8) * Math.PI * 2;
    const flap = 0.62 + 0.53 * Math.sin(phase * 8);
    wings[0].rotation.y = flap;
    wings[1].rotation.y = -flap;
    rig.position.y = Math.sin(phase * 2) * 0.075;
    rig.rotation.y = -0.35 + Math.sin(phase) * 0.14;
    membrane.uniforms.phase.value = phase;
    sparkleMat.uniforms.phase.value = phase;
    glowMat.uniforms.energy.value = 0.75 + 0.25 * Math.sin(phase * 8);
    for (let i = 0; i < count; i++) {
      const [a, b, c] = seeds[i],
        side = i % 2 ? -1 : 1,
        theta = a * Math.PI * 2;
      const x = side * (0.15 + b * 1.3),
        y = -0.9 + a * 2.8,
        z = Math.sin(theta + phase * 2) * 0.13;
      const angle = side * flap;
      vertices[i * 3] = x * Math.cos(angle) + Math.sin(phase + theta) * 0.07;
      vertices[i * 3 + 1] = y;
      vertices[i * 3 + 2] = z - x * Math.sin(angle) + c * 0.1;
    }
    pointsGeo.attributes.position.needsUpdate = true;
  }
  const revealMaterials = new Map();
  rig.traverse((o) => {
    if (!o.material) return;
    o.userData.bloom = true;
    const m = o.material;
    if (revealMaterials.has(m)) return;
    revealMaterials.set(m, m.opacity);
    m.transparent = true;
    if (m.isShaderMaterial) {
      m.uniforms.uReveal = { value: 0 };
      m.fragmentShader =
        'uniform float uReveal;\n' +
        m.fragmentShader.replace(/}\s*$/, 'gl_FragColor.a *= uReveal; }');
    }
  });
  function setReveal(value) {
    rig.visible = value > 0.001;
    for (const [m, opacity] of revealMaterials) {
      if (m.isShaderMaterial) m.uniforms.uReveal.value = value;
      else m.opacity = opacity * value;
    }
  }
  setReveal(0);
  return { rig, update, setReveal };
}
