import React, { useEffect } from 'react';
import * as THREE from 'three';

import './styles.css';

export const Picking = () => {
  useEffect(() => {
    let camera, scene, renderer;
    let target = new THREE.Vector3();

    let lon = 90,
      lat = 0;
    let phi = 0,
      theta = 0;
    let touchX, touchY;
    let sphere;
    let mesh;

    init();
    animate();

    function init() {
      camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.01,
        1000
      );
      scene = new THREE.Scene();

      const light = new THREE.AmbientLight(0xffffff); // soft white light
      scene.add(light);

      const geometry = new THREE.SphereGeometry(500, 60, 40);
      // invert the geometry on the x-axis so that all of the faces point inward
      geometry.scale(-1, 1, 1);

      const texture_mesh = new THREE.TextureLoader().load(
        'https://threejs.org/examples/textures/2294472375_24a3b8ef46_o.jpg'
      );
      const material = new THREE.MeshBasicMaterial({ map: texture_mesh });

      mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);

      const geometry_pink = new THREE.SphereGeometry(0.02, 32, 32);
      const material_pink = new THREE.MeshBasicMaterial({ color: 11011101 });
      sphere = new THREE.Mesh(geometry_pink, material_pink);
      sphere.position.x = 0.0;
      sphere.position.y = 0.0;
      sphere.position.z = 1.0;

      scene.add(sphere);

      renderer = new THREE.WebGLRenderer();
      renderer.setSize(window.innerWidth, window.innerHeight);
      document.body.appendChild(renderer.domElement);

      //

      document.addEventListener('mousedown', onDocumentMouseDown, false);
      document.addEventListener('touchstart', onDocumentTouchStart, false);
      document.addEventListener('touchmove', onDocumentTouchMove, false);
      window.addEventListener('resize', onWindowResize, false);
    }

    function onWindowResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }

    function onDocumentMouseDown(event) {
      event.preventDefault();

      const intersect = ray_tracing(event, [sphere]);
      if (intersect.length === 0) {
        document.addEventListener('mousemove', onDocumentMouseMove, false);
      } else {
        document.addEventListener('mousemove', MouseMoveObject, false);
        document.addEventListener('click', changeTexture, false);
      }

      document.addEventListener('mouseup', onDocumentMouseUp, false);
    }

    function changeTexture() {
      console.log('entered');
      mesh.material.map = new THREE.TextureLoader().load(
        'https://aws1.discourse-cdn.com/standard17/uploads/threejs/original/2X/8/8f704e6f7487d15ce979aeca4f4dfea43349ab4b.jpeg'
      );
      mesh.material.needsUpdate = true;
    }

    function ray_tracing(e, objects) {
      const uv = new THREE.Vector3();
      if (e.offsetX) {
        //chrome,ie,safari
        uv.x = e.offsetX;
        uv.y = e.offsetY;
      } else {
        //firefox
        uv.x = e.layerX;
        uv.y = e.layerY;
      }
      uv.x = 2 * (uv.x / window.innerWidth) - 1;
      uv.y = 1 - 2 * (uv.y / window.innerHeight);

      const cam = camera.clone();
      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(uv, cam);
      return raycaster.intersectObjects(objects);
    }

    function MouseMoveObject(event) {
      const intersect = ray_tracing(event, scene.children);
      const point = intersect[0].point;
      point.setLength(1.0);

      sphere.position.x = point.x;
      sphere.position.y = point.y;
      sphere.position.z = point.z;

      const pos =
        'Position: [' +
        String(point.x.toFixed(2)) +
        ',' +
        String(point.y.toFixed(2)) +
        ',' +
        String(point.z.toFixed(2)) +
        ']';
      console.log(pos);
    }

    function onDocumentMouseMove(event) {
      const movementX =
        event.movementX || event.mozMovementX || event.webkitMovementX || 0;
      const movementY =
        event.movementY || event.mozMovementY || event.webkitMovementY || 0;

      lon -= movementX * 0.1;
      lat += movementY * 0.1;
    }

    function onDocumentMouseUp(event) {
      document.removeEventListener('mousemove', MouseMoveObject);
      document.removeEventListener('mousemove', onDocumentMouseMove);
      document.removeEventListener('mouseup', onDocumentMouseUp);
    }

    function onDocumentMouseWheel(event) {
      camera.fov -= event.wheelDeltaY * 0.05;
      camera.updateProjectionMatrix();
    }

    document.addEventListener('wheel', onDocumentMouseWheel);
    function onDocumentTouchStart(event) {
      event.preventDefault();

      const touch = event.touches[0];

      touchX = touch.screenX;
      touchY = touch.screenY;
    }

    function onDocumentTouchMove(event) {
      event.preventDefault();

      const touch = event.touches[0];

      lon -= (touch.screenX - touchX) * 0.1;
      lat += (touch.screenY - touchY) * 0.1;

      touchX = touch.screenX;
      touchY = touch.screenY;
    }

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

    return () => {
      document.removeEventListener('wheel', onDocumentMouseWheel);
    };
  }, []);

  return <div></div>;
};
