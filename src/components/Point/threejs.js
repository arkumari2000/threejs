import * as THREE from 'three';

export const ThreeJS = (camera, scene, canvas) => {
  let mouseDown = false;
  let pointObjects = [];
  let target = new THREE.Vector3();
  let lon = 90,
    lat = 0;
  let phi = 0,
    theta = 0;
  let mesh;
  const renderer = new THREE.WebGLRenderer({ canvas });

  const init = () => {
    // add an ambientLight to the scene
    const light = new THREE.AmbientLight(0xffffff); // soft white light
    scene.add(light);

    // add panorama image
    const geometry = new THREE.SphereGeometry(500, 60, 40);
    // invert the geometry on the x-axis so that all of the faces point inward
    geometry.scale(-1, 1, 1);
    const panorama_texture = new THREE.TextureLoader().load(
      'https://threejs.org/examples/textures/2294472375_24a3b8ef46_o.jpg'
    );
    const material = new THREE.MeshBasicMaterial({ map: panorama_texture });

    mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // add circle
    const geometry_pink = new THREE.SphereGeometry(0.02, 32, 32);
    const material_pink = new THREE.MeshBasicMaterial({ color: 11011101 });
    const pointSphere = new THREE.Mesh(geometry_pink, material_pink);
    pointSphere.position.x = 0.0;
    pointSphere.position.y = 0.0;
    pointSphere.position.z = 1.0;

    scene.add(pointSphere);
    pointObjects.push(pointSphere);

    // add ring to the circle
    const ring_geometry = new THREE.RingGeometry(0.05, 0.08, 30);
    const ring_material = new THREE.MeshBasicMaterial({
      color: 11011101,
      side: THREE.DoubleSide,
    });
    const ring = new THREE.Mesh(ring_geometry, ring_material);
    ring.position.x = 0.0;
    ring.position.y = 0.0;
    ring.position.z = 1.0;

    scene.add(ring);
    pointObjects.push(ring);
  };

  const ray_tracing = (e, objects) => {
    const vector = new THREE.Vector3();
    const ans = [];
    if (e.offsetX) {
      //chrome,ie,safari
      vector.x = e.offsetX;
      vector.y = e.offsetY;
    } else {
      //firefox
      vector.x = e.layerX;
      vector.y = e.layerY;
    }
    vector.x = 2 * (vector.x / window.innerWidth) - 1;
    vector.y = 1 - 2 * (vector.y / window.innerHeight);

    const cam = camera.clone();
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(vector, cam);

    objects.forEach((object) => {
      ans.push(raycaster.intersectObjects(object));
    });

    return ans;
  };

  function onMouseOver(e) {
    document.body.style.cursor = 'pointer';
  }

  function changeTexture() {
    console.log('entered');
    mesh.material.map = new THREE.TextureLoader().load(
      'https://aws1.discourse-cdn.com/standard17/uploads/threejs/original/2X/8/8f704e6f7487d15ce979aeca4f4dfea43349ab4b.jpeg'
    );
    mesh.material.needsUpdate = true;
  }

  const onDocumentMouseDown = (event) => {
    event.preventDefault();
    mouseDown = true;

    const intersect = ray_tracing(event, [pointObjects]);
    if (intersect.length > 0) {
      document.addEventListener('click', changeTexture, false);
      document.addEventListener('mouseover', onMouseOver, false);
    }
  };

  const onDocumentMouseMove = (event) => {
    if(!mouseDown) return;
    const movementX =
      event.movementX || event.mozMovementX || event.webkitMovementX || 0;
    const movementY =
      event.movementY || event.mozMovementY || event.webkitMovementY || 0;

    lon -= movementX * 0.1;
    lat += movementY * 0.1;
  };

  function onDocumentMouseWheel(event) {
    camera.fov -= event.wheelDeltaY * 0.05;
    camera.updateProjectionMatrix();
  }

  function onDocumentMouseUp(event) {
    document.removeEventListener('mousemove', onDocumentMouseMove);
  }

  const initEventListener = () => {
    document.addEventListener('wheel', onDocumentMouseWheel, false);
    document.addEventListener('mousedown', onDocumentMouseDown, false);
    document.addEventListener('mousemove', onDocumentMouseMove, false);
    document.addEventListener('mouseup', onDocumentMouseUp, false);
  };

  function animate() {
    requestAnimationFrame(animate);

    //lon +=  0.1;
    lat = Math.max(-85, Math.min(85, lat));
    phi = THREE.Math.degToRad(90 - lat);
    theta = THREE.Math.degToRad(lon);

    target.x = Math.sin(phi) * Math.cos(theta);
    target.y = Math.cos(phi);
    target.z = Math.sin(phi) * Math.sin(theta);

    camera.lookAt(target);
    renderer.render(scene, camera);
  }

  return {
      init,
      animate,
      initEventListener
  }
};
