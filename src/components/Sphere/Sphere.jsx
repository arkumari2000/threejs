import React, { useLayoutEffect } from 'react';
import * as THREE from 'three';
import needResize from '../../utils/needResize';

import './styles.css';

export const Sphere = () => {
  useLayoutEffect(() => {
    const canvas = document.querySelector('#sphere-inside');
    const renderer = new THREE.WebGLRenderer({ canvas });
    const scene = new THREE.Scene();

    const fov = 40;
    const aspect = 2; // the canvas default
    const near = 0.1;
    const far = 1000;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.z = 100;

    scene.background = new THREE.Color(0xaaaaaa);

    const loadManager = new THREE.LoadingManager();
    const loader = new THREE.TextureLoader(loadManager);

    const radius = 500;
    const widthSegments = 60;
    const heightSegments = 40;
    const geometry = new THREE.SphereBufferGeometry(
      radius,
      widthSegments,
      heightSegments
    );

    const material1 = new THREE.MeshBasicMaterial( {
        map: loader.load( 'https://thumbs.dreamstime.com/b/interior-visualization-spherical-panorama-d-illustration-spherical-panorama-interior-d-illustration-180779331.jpg'),
        color: 0xffffff, 
        specular: 0x222222,
        shininess: 100,
        alphaTest: 0,
        visible: true,
        side: THREE.BackSide
    } );

    const SphereMesh = new THREE.Mesh(geometry, material1);
    // const alphaTexture = loader.load('https://threejsfundamentals.org/threejs/resources/images/flower-2.jpg')
    // SphereMesh.material.normalMap = alphaTexture;
    // SphereMesh.material.transparent = true;   
    // SphereMesh.material.opacity = 0.5;

    scene.add(SphereMesh);

    function render(time) {
      time *= 0.0001;

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
    <div>
      <canvas id='sphere-inside'></canvas>
    </div>
  );
};
