import logo from './logo.svg';
import './App.css';

import { CubeWithImage } from './components/CubeWithImage/CubeWithImage'
import { SphereGeometry } from './components/SphereGeometry/SphereGeometry'
import { SolarSystem } from './components/SolarSystem/SolarSystem';
import { Sphere } from './components/Sphere/Sphere';

function App() {
  return (
    <div className="App">
      <CubeWithImage></CubeWithImage>
      <SphereGeometry></SphereGeometry>
      <SolarSystem></SolarSystem>
      <Sphere></Sphere>
    </div>
  );
}

export default App;
