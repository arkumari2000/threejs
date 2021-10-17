import React, { useLayoutEffect } from 'react';
import { init, animate } from '../Threejs/Threejs';

import './styles.css'

export const PanoViewer = () => {
  useLayoutEffect(() => {
    init();
    animate();
  }, []);

  return (
    <div id='container'>
    </div>
  );
};