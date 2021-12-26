import './App.css';

import { CubeWithImage } from './components/CubeWithImage/CubeWithImage'
import { SphereGeometry } from './components/SphereGeometry/SphereGeometry'
import { SolarSystem } from './components/SolarSystem/SolarSystem';
import { Sphere } from './components/Sphere/Sphere';
import { PanoViewer } from './components/PanoViewer/PanoViewer'
import { Translation } from './components/Translation/Translation';

function App() {
  return (
    <div className="App">
      <Translation/>
      <CubeWithImage/>
      <SphereGeometry/>
      <SolarSystem/>
      <Sphere/>
      <PanoViewer/>
    </div>
  );
}

export default App;
