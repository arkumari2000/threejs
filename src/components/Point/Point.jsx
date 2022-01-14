import * as THREE from 'three'
import React, { useLayoutEffect } from 'react'
import { ThreeJS } from './threejs'

import './styles.css'

export const Point = () => {
    useLayoutEffect(() => {
        const camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.01,
            1000
        );

        const scene = new THREE.Scene()

        const canvas = document.querySelector('#point');

        const threeFunction = ThreeJS(camera, scene, canvas);
        threeFunction.init()
        threeFunction.animate()
        threeFunction.initEventListener()
    },[])

    return(
        <div>
            <canvas id="point"></canvas>
        </div>
    )
}