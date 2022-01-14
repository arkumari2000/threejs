import React, { useLayoutEffect } from 'react';
import * as THREE from 'three';
import needResize from '../../utils/needResize';

import './styles.css';

export const Text = () => {
  useLayoutEffect(() => {
    const canvas = document.querySelector('#text');
    const renderer = new THREE.WebGLRenderer({ canvas });
    const scene = new THREE.Scene();
    const text = new THREE.TextGeometry( 'THREE.JS' );

    scene.add(text)

    const camera = new THREE.PerspectiveCamera(
      40,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 2;

    const geometry = new THREE.SphereGeometry(0.001, 0.001, 0.001);

    const cubes = []; // just an array we can use to rotate the cubes

    const material = new THREE.MeshBasicMaterial();

    for (let i = 0; i < 60000; i++) {
      const cube = new THREE.Mesh(geometry, material);
      cube.position.x = (Math.random() - 0.5) * 10;
      cube.position.y = (Math.random() - 0.5) * 10;
      cube.position.z = (Math.random() - 0.5) * 10;
      scene.add(cube);
      cubes.push(cube);
    }

    const color = 0xffffff;
    const intensity = 3;
    const light = new THREE.PointLight(color, intensity);
    scene.add(light);

    function render(time) {
      time *= 0.001;

      if (needResize(renderer)) {
        const canvas = renderer.domElement;
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
      }

      cubes.forEach((cube, ndx) => {
        const speed = 0.1 + ndx * 0.01;
        const rot = time * speed;
        cube.rotation.x = rot;
        cube.rotation.y = rot;
      });

      renderer.render(scene, camera);

      requestAnimationFrame(render);
    }

    requestAnimationFrame(render);
  }, []);

  return (
    <div>
      <canvas id='text'></canvas>
    </div>
  );
};
