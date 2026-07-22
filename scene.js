import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.165.0/build/three.module.js';

const canvas = document.getElementById('webgl');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const mobile = window.matchMedia('(max-width: 760px)').matches;

try {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: !mobile, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, mobile ? 1.25 : 1.7));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x07070a, mobile ? .065 : .045);

  const camera = new THREE.PerspectiveCamera(38, window.innerWidth / window.innerHeight, .1, 100);
  camera.position.set(0, 0, mobile ? 8.8 : 7.6);
  scene.add(camera);

  const root = new THREE.Group();
  scene.add(root);
  root.position.x = mobile ? 1.5 : 2.25;
  root.position.y = mobile ? 1.4 : .4;

  const ambient = new THREE.AmbientLight(0xffffff, .52);
  const key = new THREE.PointLight(0xb7ff5a, 28, 20, 2);
  key.position.set(4, 4, 5);
  const fill = new THREE.PointLight(0x6b56ff, 20, 18, 2);
  fill.position.set(-4, -2, 2);
  scene.add(ambient, key, fill);

  const material = new THREE.MeshPhysicalMaterial({
    color: 0x5c7e3a,
    metalness: .28,
    roughness: .2,
    transmission: .22,
    thickness: 1.5,
    clearcoat: 1,
    clearcoatRoughness: .16,
    emissive: 0x172408,
    emissiveIntensity: .55,
    flatShading: false
  });

  const wireMaterial = new THREE.MeshBasicMaterial({ color: 0xb7ff5a, wireframe: true, transparent: true, opacity: .12 });
  let mainMesh;
  let wireMesh;

  function geometryForMode(mode) {
    if (mode === 'orbit') return new THREE.TorusKnotGeometry(1.35, .34, mobile ? 110 : 190, 20, 2, 3);
    if (mode === 'signal') return new THREE.IcosahedronGeometry(1.75, mobile ? 2 : 4);
    return new THREE.OctahedronGeometry(1.72, mobile ? 2 : 5);
  }

  function setMode(mode) {
    if (mainMesh) {
      root.remove(mainMesh, wireMesh);
      mainMesh.geometry.dispose();
      wireMesh.geometry.dispose();
    }
    const geometry = geometryForMode(mode);
    mainMesh = new THREE.Mesh(geometry, material);
    wireMesh = new THREE.Mesh(geometry.clone(), wireMaterial);
    wireMesh.scale.setScalar(1.035);
    root.add(mainMesh, wireMesh);

    if (mode === 'orbit') {
      material.color.setHex(0x768d5d);
      material.metalness = .54;
      material.roughness = .15;
      material.transmission = .08;
      wireMaterial.opacity = .09;
    } else if (mode === 'signal') {
      material.color.setHex(0x242832);
      material.metalness = .82;
      material.roughness = .28;
      material.transmission = 0;
      wireMaterial.opacity = .34;
    } else {
      material.color.setHex(0x5c7e3a);
      material.metalness = .28;
      material.roughness = .2;
      material.transmission = .22;
      wireMaterial.opacity = .12;
    }
  }
  setMode('crystal');

  const ringMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: .12, side: THREE.DoubleSide });
  const ringOne = new THREE.Mesh(new THREE.TorusGeometry(2.2, .008, 8, 180), ringMaterial);
  ringOne.rotation.x = 1.15;
  ringOne.rotation.z = .45;
  const ringTwo = new THREE.Mesh(new THREE.TorusGeometry(2.65, .006, 8, 180), ringMaterial.clone());
  ringTwo.material.color.setHex(0xb7ff5a);
  ringTwo.material.opacity = .17;
  ringTwo.rotation.x = .4;
  ringTwo.rotation.y = 1.2;
  root.add(ringOne, ringTwo);

  const count = mobile ? 650 : 1450;
  const positions = new Float32Array(count * 3);
  const scales = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    const radius = 4 + Math.random() * 18;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = radius * Math.cos(phi) - 5;
    scales[i] = Math.random();
  }
  const particleGeometry = new THREE.BufferGeometry();
  particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  particleGeometry.setAttribute('aScale', new THREE.BufferAttribute(scales, 1));
  const particleMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: mobile ? .022 : .028, transparent: true, opacity: .42, sizeAttenuation: true });
  const particles = new THREE.Points(particleGeometry, particleMaterial);
  scene.add(particles);

  const mouse = { x: 0, y: 0 };
  window.addEventListener('pointermove', function (event) {
    mouse.x = (event.clientX / window.innerWidth - .5) * 2;
    mouse.y = (event.clientY / window.innerHeight - .5) * 2;
  }, { passive: true });

  let scrollY = window.scrollY;
  window.addEventListener('scroll', function () { scrollY = window.scrollY; }, { passive: true });

  const clock = new THREE.Clock();
  function render() {
    const elapsed = clock.getElapsedTime();
    const pageProgress = scrollY / Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
    const targetX = mobile ? 1.5 - pageProgress * 2.1 : 2.25 - pageProgress * 4.2;
    const targetY = (mobile ? 1.4 : .4) - pageProgress * 1.5;
    root.position.x += (targetX + mouse.x * (mobile ? .08 : .2) - root.position.x) * .045;
    root.position.y += (targetY - mouse.y * (mobile ? .06 : .16) - root.position.y) * .045;

    if (!reducedMotion) {
      root.rotation.y += .0025;
      root.rotation.x = Math.sin(elapsed * .35) * .14 + mouse.y * .08;
      mainMesh.rotation.z += .0012;
      wireMesh.rotation.y -= .0018;
      ringOne.rotation.z += .0018;
      ringTwo.rotation.z -= .0012;
      particles.rotation.y = elapsed * .008;
      particles.rotation.x = mouse.y * .015;
      key.position.x = 4 + mouse.x * 2;
      key.position.y = 4 - mouse.y * 2;
    }
    renderer.render(scene, camera);
    requestAnimationFrame(render);
  }
  render();

  function resize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, window.innerWidth <= 760 ? 1.25 : 1.7));
  }
  window.addEventListener('resize', resize);

  const captions = {
    crystal: 'Mode 01 — Crystal Matter',
    orbit: 'Mode 02 — Orbit Machine',
    signal: 'Mode 03 — Signal Wire'
  };
  document.querySelectorAll('.mode-btn').forEach(function (button) {
    button.addEventListener('click', function () {
      const mode = button.dataset.mode;
      document.querySelectorAll('.mode-btn').forEach(function (item) { item.classList.toggle('is-active', item === button); });
      document.getElementById('mode-caption').textContent = captions[mode];
      setMode(mode);
    });
  });

  document.documentElement.classList.add('webgl-ready');
  window.finishPortfolioLoader();
} catch (error) {
  console.warn('WebGL scene could not start. Showing the CSS fallback.', error);
  window.finishPortfolioLoader();
}
