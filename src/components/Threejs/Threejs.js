import * as THREE from 'three';
let camera,
  scene,
  renderer;
let isUserInteracting = false,
  onPointerDownMouseX = 0,
  onPointerDownMouseY = 0,
  lon = 0,
  onPointerDownLon = 0,
  lat = 0,
  onPointerDownLat = 0,
  phi = 0,
  theta = 0;
export function init() {
  const container = document.getElementById('container');

  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    1,
    1100
  );

  scene = new THREE.Scene();
  camera.rotation.z = Math.PI

  const geometry = new THREE.SphereGeometry(500, 60, 40);
  // invert the geometry on the x-axis so that all of the faces point inward
  geometry.scale(-1, 1, 1);

  const texture = new THREE.TextureLoader().load(
    'https://threejs.org/examples/textures/2294472375_24a3b8ef46_o.jpg'
  );
  const material = new THREE.MeshBasicMaterial({ map: texture });

  const mesh = new THREE.Mesh(geometry, material);

  scene.add(mesh);

  renderer = new THREE.WebGLRenderer();
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  container.appendChild(renderer.domElement);

  container.style.touchAction = 'none';
  container.addEventListener('pointerdown', onPointerDown);

  document.addEventListener('wheel', onDocumentMouseWheel);

  //

  document.addEventListener('dragover', function (event) {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'copy';
  });

  document.addEventListener('dragenter', function () {
    document.body.style.opacity = '0.5';
  });

  document.addEventListener('dragleave', function () {
    document.body.style.opacity = '1';
  });

  document.addEventListener('drop', function (event) {
    event.preventDefault();

    const reader = new FileReader();
    reader.addEventListener('load', function (event) {
      material.map.image.src = event.target.result;
      material.map.needsUpdate = true;
    });

    document.body.style.opacity = '1';
  });

  const pickPosition = { x: 0, y: 0 };

  function getContainerRelativePosition(event) {
    const rect = container.getBoundingClientRect();
    return {
      x: ((event.clientX - rect.left) * container.offsetWidth) / rect.width,
      y: ((event.clientY - rect.top) * container.offsetHeight) / rect.height,
    };
  }

  function setPickPosition(event) {
    const pos = getContainerRelativePosition(event);
    pickPosition.x = (pos.x / container.offsetWidth) * 2 - 1;
    pickPosition.y = (pos.y / container.offsetHeight) * -2 + 1; // note we flip Y
    console.log(pickPosition)
  }

  window.addEventListener('mousemove', setPickPosition);

  //

  window.addEventListener('resize', onWindowResize);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}

export function onPointerDown(event) {
  if (event.isPrimary === false) return;

  isUserInteracting = true;

  onPointerDownMouseX = event.clientX;
  onPointerDownMouseY = event.clientY;

  onPointerDownLon = lon;
  onPointerDownLat = lat;

  document.addEventListener('pointermove', onPointerMove);
  document.addEventListener('pointerup', onPointerUp);
}

export function onPointerMove(event) {
  if (event.isPrimary === false) return;

  lon = (onPointerDownMouseX - event.clientX) * 0.1 + onPointerDownLon;
  lat = (event.clientY - onPointerDownMouseY) * 0.1 + onPointerDownLat;
}

export function onPointerUp() {
  isUserInteracting = false;

  document.removeEventListener('pointermove', onPointerMove);
  document.removeEventListener('pointerup', onPointerUp);
}

export function onDocumentMouseWheel(event) {
  const fov = camera.fov + event.deltaY * 0.05;

  camera.fov = THREE.MathUtils.clamp(fov, 10, 75);

  camera.updateProjectionMatrix();
}

export function animate() {
  requestAnimationFrame(animate);
  update();
}

function update() {
  if (isUserInteracting === false) {
    lon += 0.1;
  }

  lat = Math.max(-85, Math.min(85, lat));
  phi = THREE.MathUtils.degToRad(90 - lat);
  theta = THREE.MathUtils.degToRad(lon);

  const x = 500 * Math.sin(phi) * Math.cos(theta);
  const y = 500 * Math.cos(phi);
  const z = 500 * Math.sin(phi) * Math.sin(theta);

  camera.lookAt(x, y, z);

  renderer.render(scene, camera);
}
