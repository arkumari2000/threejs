import React, { useLayoutEffect } from 'react';
import * as THREE from 'three';
import needResize from '../../utils/needResize';

import { useAudio } from './useAudio';

import sound from './assets/om.mp3';

import './styles.css';

export const Translation = () => {
  const [toggle] = useAudio(sound);

  useLayoutEffect(() => {
    const canvas = document.querySelector('#translate');
    const renderer = new THREE.WebGLRenderer({ canvas });
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      40,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 2;

    const geometry = new THREE.BoxGeometry(0.01, 0.01, 0.01);

    const cubes = []; // just an array we can use to rotate the cubes

    const material = new THREE.MeshBasicMaterial();

    for (let i = 0; i < 1000; i++) {
      const cube = new THREE.Mesh(geometry, material);
      cube.position.x = (Math.random() - 0.5) * 10;
      cube.position.y = (Math.random() - 0.5) * 10;
      cube.position.z = (Math.random() - 0.5) * 10;
      scene.add(cube);
      cubes.push(cube);
    }

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
      <canvas id='translate'></canvas>
      <button onClick={toggle} className='enter-button'>
        Ask your question here!
      </button>
    </div>
  );
};
