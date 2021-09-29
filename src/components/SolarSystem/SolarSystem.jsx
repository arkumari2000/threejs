import React, { useLayoutEffect } from 'react';
import * as THREE from 'three';
import needResize from '../../utils/needResize';

import './styles.css';

export const SolarSystem = () => {
  useLayoutEffect(() => {
    const canvas = document.querySelector('#solar-system');
    const renderer = new THREE.WebGLRenderer({ canvas });
    const scene = new THREE.Scene();
    // an array of objects whose rotation to update
    const objects = [];

    // use just one sphere for everything
    const radius = 1;
    const widthSegments = 6;
    const heightSegments = 6;
    const sphereGeometry = new THREE.SphereGeometry(
      radius,
      widthSegments,
      heightSegments
    );

    const solarSystem = new THREE.Object3D();
    scene.add(solarSystem);
    objects.push(solarSystem);

    const earthOrbit = new THREE.Object3D();
    earthOrbit.position.x = 10;
    solarSystem.add(earthOrbit);
    objects.push(earthOrbit);

    const moonOrbit = new THREE.Object3D();
    moonOrbit.position.x = 2;
    earthOrbit.add(moonOrbit);
 

    const sunMaterial = new THREE.MeshPhongMaterial({ emissive: 0xffff00 });
    const sunMesh = new THREE.Mesh(sphereGeometry, sunMaterial);
    sunMesh.scale.set(5, 5, 5); // make the sun large
    solarSystem.add(sunMesh);
    objects.push(sunMesh);

    const earthMaterial = new THREE.MeshPhongMaterial({
      color: 0x2233ff,
      emissive: 0x112244,
    });
    const earthMesh = new THREE.Mesh(sphereGeometry, earthMaterial);
    earthOrbit.add(earthMesh);
    objects.push(earthMesh);

    const moonMaterial = new THREE.MeshPhongMaterial({color: 0x888888, emissive: 0x222222});
    const moonMesh = new THREE.Mesh(sphereGeometry, moonMaterial);
    moonMesh.scale.set(.5, .5, .5);
    moonOrbit.add(moonMesh);
    objects.push(moonMesh);

    //adding point light in the center
    {
      const color = 0xffffff;
      const intensity = 3;
      const light = new THREE.PointLight(color, intensity);
      scene.add(light);
    }

    //setting camera to look down at origin
    const fov = 40;
    const aspect = 2; 
    const near = 0.1;
    const far = 1000;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.set(0, 50, 0);
    camera.up.set(0, 0, 1);
    camera.lookAt(0, 0, 0);

    function render(time) {
      time *= 0.001;

      if (needResize(renderer)) {
        const canvas = renderer.domElement;
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
      }

      objects.forEach((obj) => {
        obj.rotation.y = time;
      });

      renderer.render(scene, camera);

      requestAnimationFrame(render);
    }

    requestAnimationFrame(render);
  }, []);
  return (
    <div>
      <canvas id='solar-system'></canvas>
    </div>
  );
};
