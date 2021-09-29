import React, { useLayoutEffect } from 'react';
import * as THREE from 'three'
import needResize from '../../utils/needResize';

import './styles.css';

export const SphereGeometry = () => {
  useLayoutEffect(() => {
    const canvas = document.getElementById('sphere-canvas');
    const renderer = new THREE.WebGLRenderer({ canvas });

    const fov = 40;
    const aspect = 2; // the canvas default
    const near = 0.1;
    const far = 1000;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.z = 120;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xaaaaaa);

    const loadManager = new THREE.LoadingManager();
    const loader = new THREE.TextureLoader(loadManager);

    const radius = 30;
    const widthSegments = 22;
    const heightSegments = 20;
    const geometry = new THREE.SphereGeometry(
      radius,
      widthSegments,
      heightSegments
    );
    const material = new THREE.MeshBasicMaterial({
      map: loader.load(
        'https://threejsfundamentals.org/threejs/resources/images/flower-1.jpg'
      ),
    });

    const SphereMesh = new THREE.Mesh(geometry, material);

    scene.add(SphereMesh);

    function render(time) {
      time *= 0.001;

      if (needResize(renderer)) {
        const canvas = renderer.domElement;
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
      }

      SphereMesh.rotation.x = time;
      SphereMesh.rotation.y = time;

      renderer.render(scene, camera);

      requestAnimationFrame(render);
    }

    requestAnimationFrame(render);
  }, []);

  return (
    <div id='sphere'>
      <canvas id='sphere-canvas'></canvas>
      <div id='loading'></div>
    </div>
  );
};
