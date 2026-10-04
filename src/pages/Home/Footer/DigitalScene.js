import { createButterflyRig } from './Butterfly.js';
import * as THREE from 'three';

const surfaceVertex = `
  varying vec3 vPosition;
  varying vec3 vWorld;
  varying vec3 vNormal;
  varying vec3 vColor;
  void main() {
    vPosition = position;
    vWorld = (modelMatrix * vec4(position, 1.0)).xyz;
    vNormal = normalize(mat3(modelMatrix) * normal);
    vColor = color;
    gl_Position = projectionMatrix * viewMatrix * vec4(vWorld, 1.0);
  }
`;

const noiseGLSL = `
  float hash(vec3 p) {
    p = fract(p * .3183099 + vec3(.13, .27, .41));
    p *= 17.0;
    return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
  }
  float noise(vec3 p) {
    vec3 i = floor(p), f = fract(p);
    f = f*f*(3.0-2.0*f);
    return mix(mix(mix(hash(i),hash(i+vec3(1,0,0)),f.x),
      mix(hash(i+vec3(0,1,0)),hash(i+vec3(1,1,0)),f.x),f.y),
      mix(mix(hash(i+vec3(0,0,1)),hash(i+vec3(1,0,1)),f.x),
      mix(hash(i+vec3(0,1,1)),hash(i+vec3(1,1,1)),f.x),f.y),f.z);
  }
  float fbm(vec3 p) {
    return noise(p)*.55 + noise(p*2.07)*.26 + noise(p*4.13)*.13 + noise(p*8.31)*.06;
  }
`;

const crystalFragment = `
  uniform float uOpacity;
  uniform sampler2D uSurface;
  uniform float uHasSurface;
  varying vec3 vPosition;
  varying vec3 vWorld;
  varying vec3 vNormal;
  varying vec3 vColor;
  ${noiseGLSL}
  void main() {
    vec3 n = normalize(vNormal);
    vec3 view = normalize(cameraPosition-vWorld);
    float facing = abs(dot(n,view));
    float fresnel = pow(1.0-facing, 2.3);
    vec3 reflected = reflect(-view,n);
    float strip = pow(max(0.0, dot(reflected,normalize(vec3(-.8,1.,1.)))), 85.0);
    float ribbon=pow(.5+.5*sin(reflected.x*18.+reflected.y*9.),22.);
    float violet=pow(max(0.,dot(reflected,normalize(vec3(1.,-.3,.7)))),24.);
    float strip2 = pow(max(0.0, dot(reflected,normalize(vec3(.8,.4,1.)))), 70.0);
    float detail = fbm(vPosition*8.0);
    float fracture = 1.0-smoothstep(.025,.073,abs(sin(vPosition.y*9.0+vPosition.x*13.0+detail*15.0)));
    float fine = 1.0-smoothstep(.008,.035,abs(sin(vPosition.x*27.0-vPosition.z*12.0+detail*35.0)));
    float key = .3 + .7*max(0.0,dot(n,normalize(vec3(-2.,3.,4.))));
    vec3 mineral = texture2D(uSurface,vPosition.xy*.65+vPosition.z*.13).rgb;
    float mineralLight = dot(mineral,vec3(.21,.72,.07));
    vec3 blue = vColor * key * mix(.4+detail*.6,.09+mineralLight*1.7,uHasSurface);
    blue += pow(mineral,vec3(.8))*vec3(.13,.65,1.6)*uHasSurface;
    blue += vec3(.12,.56,.94) * fracture * .27;
    blue += vec3(.08,.35,.6) * fine * .18;
    blue += vec3(.05,.48,1.0) * fresnel * .95;
    blue += vec3(.09,.5,.94)*ribbon*.7;
    blue += vec3(.24,.08,.8)*violet*.35;
    blue += vec3(.6,.88,1.0) * strip * (1.1+mineralLight*1.8);
    blue += vec3(.34,.3,1.0) * strip2;
    gl_FragColor = vec4(blue,uOpacity);
    #include <colorspace_fragment>
  }
`;

const marbleFragment = `
  uniform float uOpacity;
  uniform sampler2D uSurface;
  uniform float uHasSurface;
  varying vec3 vPosition;
  varying vec3 vWorld;
  varying vec3 vNormal;
  varying vec3 vColor;
  ${noiseGLSL}
  void main() {
    vec3 p = vPosition*4.0;
    float n = fbm(p*1.4);
    float vein = abs(sin(p.x*2.7+p.y*3.0+p.z*1.8+n*17.0));
    float white = 1.0-smoothstep(.02,.19,vein);
    float hairline = 1.0-smoothstep(.01,.055,abs(sin(p.y*9.0-p.x*4.0+fbm(p*3.0)*24.0)));
    vec3 normal = normalize(vNormal);
    float key = .26+.74*max(dot(normal,normalize(vec3(-2.,4.,3.))),0.0);
    float edge = pow(1.0-abs(dot(normal,normalize(cameraPosition-vWorld))),3.0);
    vec3 base = mix(vec3(.004,.011,.022),vec3(.18,.34,.46),white*(.4+n*.6));
    base += hairline*vec3(.027,.058,.078);
    vec3 blend=pow(abs(normal),vec3(8.));
    blend/=max(blend.x+blend.y+blend.z,.001);
    vec3 surface=texture2D(uSurface,vPosition.yz*1.7).rgb*blend.x
      +texture2D(uSurface,vPosition.xz*1.7).rgb*blend.y
      +texture2D(uSurface,vPosition.xy*1.7).rgb*blend.z;
    base=mix(base,pow(surface,vec3(1.05))*vec3(.7,1.25,1.8),uHasSurface);
    base *= key;
    base += vec3(.012,.07,.13)*edge;
    base += vec3(.008,.035,.07)*pow(max(0.,normal.y),8.);
    gl_FragColor = vec4(base,uOpacity);
    #include <colorspace_fragment>
  }
`;

/** Geometry and surface treatment only. FooterWorld owns all input and animation. */
export default function createDigitalScene(world, ownGeometry, ownMaterial) {
  const occluders = [];
  const fading = [];
  const material = (fragmentShader) => {
    const m = ownMaterial(
      new THREE.ShaderMaterial({
        vertexShader: surfaceVertex,
        fragmentShader,
        vertexColors: true,
        uniforms: { uOpacity: { value: 1 }, uSurface: { value: null }, uHasSurface: { value: 0 } },
        transparent: true,
      }),
    );
    fading.push(m);
    return m;
  };
  const marble = material(marbleFragment);
  const crystalMaterial = material(crystalFragment);
  const lineMaterial = ownMaterial(
    new THREE.LineBasicMaterial({
      color: 0x63cfff,
      transparent: true,
      opacity: 0.52,
      depthWrite: false,
    }),
  );
  const subtleLine = ownMaterial(
    new THREE.LineBasicMaterial({
      color: 0x258dad,
      transparent: true,
      opacity: 0.18,
      depthWrite: false,
    }),
  );
  const addEdges = (mesh, lineMat = lineMaterial, threshold = 18) => {
    const lines = new THREE.LineSegments(
      ownGeometry(new THREE.EdgesGeometry(mesh.geometry, threshold)),
      lineMat,
    );
    mesh.add(lines);
    return lines;
  };
  const paint = (geometry, colors = [0xffffff]) => {
    const values = [];
    const count = geometry.attributes.position.count;
    for (let i = 0; i < count; i++) {
      const color = new THREE.Color(colors[Math.floor(i / 3) % colors.length]);
      values.push(color.r, color.g, color.b);
    }
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(values, 3));
    return geometry;
  };

  const centerpiece = new THREE.Group();
  centerpiece.position.set(0.1, 0.66, 0.12);
  world.add(centerpiece);
  const pedestal = new THREE.Group();
  pedestal.rotation.set(0.04, -0.24, -0.035);
  centerpiece.add(pedestal);
  const tiers = [
    [3.7, 0.42, 2.15, -2.85],
    [3.25, 0.83, 1.85, -2.225],
    [2.75, 0.13, 1.56, -1.745],
    [2.28, 0.11, 1.38, -1.625],
  ];
  tiers.forEach(([w, h, d, y]) => {
    const mesh = new THREE.Mesh(
      ownGeometry(paint(new THREE.BoxGeometry(w, h, d).toNonIndexed())),
      marble,
    );
    mesh.position.y = y;
    pedestal.add(mesh);
    occluders.push(mesh);
    addEdges(mesh, subtleLine);
  });

  const butterfly = createButterflyRig(ownGeometry, ownMaterial);
  const crystal = butterfly.rig;
  crystal.position.set(0, 0.1, 0.3);
  crystal.scale.setScalar(0.95);
  centerpiece.add(crystal);
  const panels = [];
  const panelPositions = [
    [-2.65, 1.8, -0.5, 0.43, 1.3],
    [-1.8, 0.45, 0.1, 0.4, 1.06],
    [2.7, 1.65, -0.6, 0.38, 1.35],
    [3.2, 0.25, 0.25, 0.42, 1.17],
    [-2.5, -0.75, -1.4, 0.3, 0.92],
    [2.5, -1.1, -0.6, 0.28, 0.88],
    [-0.9, 2.5, -2, 0.22, 0.65],
    [1.65, 0.7, -2.4, 0.24, 0.7],
  ];
  panelPositions.forEach(([x, y, z, w, h], i) => {
    const panel = new THREE.Group();
    const geometry = ownGeometry(
      paint(
        new THREE.BoxGeometry(w, h, 0.028).toNonIndexed(),
        [0x062348, 0x1b597c, 0x063056, 0x092440, 0x186288, 0x031122],
      ),
    );
    const mesh = new THREE.Mesh(geometry, crystalMaterial);
    panel.add(mesh);
    panel.position.set(x, y, z);
    panel.userData.origin = { x, y, z };
    panel.rotation.set(0, i % 2 ? 0.25 : -0.3, i % 3 ? 0.03 : -0.04);
    addEdges(mesh, lineMaterial);
    occluders.push(mesh);
    world.add(panel);
    panels.push(panel);
  });

  // No floor, horizon, or reflection: the entire object is suspended in a void.
  const environment = new THREE.Group();
  world.add(environment);
  let seed = 73;
  const random = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
  const dustPositions = [],
    dustColors = [];
  for (let i = 0; i < 190; i++) {
    dustPositions.push((random() - 0.5) * 22, (random() - 0.5) * 14, (random() - 0.5) * 16 - 3);
    const value = 0.15 + random() * 0.42;
    dustColors.push(value * 0.35, value * 0.72, value);
  }
  const dustGeometry = ownGeometry(new THREE.BufferGeometry());
  dustGeometry.setAttribute('position', new THREE.Float32BufferAttribute(dustPositions, 3));
  dustGeometry.setAttribute('color', new THREE.Float32BufferAttribute(dustColors, 3));
  const dust = new THREE.Points(
    dustGeometry,
    ownMaterial(
      new THREE.PointsMaterial({
        size: 0.022,
        vertexColors: true,
        transparent: true,
        opacity: 0.65,
        depthWrite: false,
        sizeAttenuation: true,
      }),
    ),
  );
  environment.add(dust);

  const fragments = [];
  for (let i = 0; i < 16; i++) {
    const geometry = ownGeometry(
      paint(new THREE.TetrahedronGeometry(0.06 + random() * 0.12), [0x12365a, 0x167fab, 0x070d24]),
    );
    const fragment = new THREE.Mesh(geometry, marble);
    const angle = (i / 16) * Math.PI * 2;
    const radius = 2.4 + random() * 2.4;
    fragment.position.set(Math.cos(angle) * radius, Math.sin(angle) * 3.1, (random() - 0.5) * 5);
    fragment.rotation.set(random() * 3, random() * 3, random() * 3);
    fragment.userData.origin = fragment.position.clone();
    world.add(fragment);
    fragments.push(fragment);
    occluders.push(fragment);
  }
  return {
    centerpiece,
    crystal,
    panels,
    fragments,
    environment,
    occluders,
    butterfly,
    setTexture(texture) {
      fading.forEach((m) => {
        m.uniforms.uSurface.value = texture;
        m.uniforms.uHasSurface.value = 1;
      });
    },
    update(opacity) {
      fading.forEach((m) => {
        m.opacity = opacity;
        m.uniforms.uOpacity.value = opacity;
      });
    },
    resize(mobile, tablet) {
      centerpiece.scale.setScalar(mobile ? 0.68 : 0.87);
      centerpiece.position.y = mobile ? 0.28 : 0.66;
      panels.forEach((panel, i) => {
        panel.visible = mobile ? i < 4 : tablet ? i < 6 : true;
        panel.scale.setScalar(mobile ? 0.65 : 1);
        // Positions are composed in update() so an active GSAP drift cannot undo this fit.
        panel.children[0].position.x = mobile ? -panel.userData.origin.x * 0.75 : 0;
      });
      environment.scale.setScalar(mobile ? 0.7 : 1);
      fragments.forEach((fragment, i) => {
        fragment.visible = !mobile || i < 8;
      });
    },
  };
}
