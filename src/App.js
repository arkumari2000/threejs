import './App.css';

// import { CubeWithImage } from './components/CubeWithImage/CubeWithImage'
// import { SphereGeometry } from './components/SphereGeometry/SphereGeometry'
// import { SolarSystem } from './components/SolarSystem/SolarSystem';
// import { Sphere } from './components/Sphere/Sphere';
// import { PanoViewer } from './components/PanoViewer/PanoViewer'
import { Picking } from './components/Picking/Picking'

function App() {
  return (
    <div className="App">
      {/* <CubeWithImage/>
      <SphereGeometry/>
      <SolarSystem/>
      <Sphere/>
      <PanoViewer/> */}
      <Picking />
    </div>
  );
}

export default App;
