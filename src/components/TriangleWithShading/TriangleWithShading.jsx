import React, { useLayoutEffect } from 'react';
import * as THREE from 'three';
import needResize from '../../utils/needResize';

import './styles.css';

export const TriangleWithShading = () => {
  useLayoutEffect(() => {
    const canvas = document.querySelector('#triangles');
    const renderer = new THREE.WebGLRenderer({ canvas });

    const fov = 75;
    const aspect = 2; // the canvas default
    const near = 0.1;
    const far = 5;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.z = 2;

    const scene = new THREE.Scene();

    const geometry = new THREE.Triangle(
      new THREE.Vector3(100, 0, 0),
      new THREE.Vector3(0, 100, 0),
      new THREE.Vector3(0, 0, 100)
    );
    const material = new THREE.MeshBasicMaterial({
      vertexColors: THREE.VertexColors,
      side: THREE.DoubleSide,
    });

    const color1 = new THREE.Color(0xff0000);
    const color2 = new THREE.Color(0x00ff00);
    const color3 = new THREE.Color(0x0000ff);

    const triangles = []; // just an array we can use to rotate the triangles

    geometry.faces[0].vertexColors = [color1, color2, color3];

    const mesh = new THREE.Mesh(geometry, material);

    triangles.push(mesh);

    function render(time) {
      time *= 0.001;

      if (needResize(renderer)) {
        const canvas = renderer.domElement;
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
      }

      triangles.forEach((triangle, ndx) => {
        const speed = 0.2 + ndx * 0.1;
        const rot = time * speed;
        triangle.rotation.x = rot;
        triangle.rotation.y = rot;
      });

      renderer.render(scene, camera);

      requestAnimationFrame(render);
    }

    requestAnimationFrame(render);
  }, []);

  return (
    <div>
      <canvas id='triangles'></canvas>
    </div>
  );
};
