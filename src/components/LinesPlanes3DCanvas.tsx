import { Canvas } from "@react-three/fiber";
import { OrbitControls, Grid, Line } from "@react-three/drei";
import * as THREE from "three";

export const LinesPlanes3DCanvas = () => {
  // Sample line: y = x, z = 0
  const line1Points = [
    new THREE.Vector3(-3, -3, 0),
    new THREE.Vector3(3, 3, 0),
  ];

  // Sample plane: z = 0 (XY plane)
  const planeGeometry = new THREE.PlaneGeometry(6, 6);
  
  // Sample line 2: z = y, x = 0
  const line2Points = [
    new THREE.Vector3(0, -3, -3),
    new THREE.Vector3(0, 3, 3),
  ];

  return (
    <div className="w-full h-[400px] bg-card rounded-lg overflow-hidden border">
      <Canvas camera={{ position: [8, 8, 8], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        
        {/* Grid */}
        <Grid
          args={[20, 20]}
          cellSize={1}
          cellThickness={0.5}
          cellColor="#6366f1"
          sectionSize={5}
          sectionThickness={1}
          sectionColor="#818cf8"
          fadeDistance={30}
          fadeStrength={1}
          followCamera={false}
        />
        
        {/* Sample Line 1 (red) */}
        <Line
          points={line1Points}
          color="red"
          lineWidth={3}
        />
        
        {/* Sample Line 2 (green) */}
        <Line
          points={line2Points}
          color="green"
          lineWidth={3}
        />
        
        {/* Sample Plane (semi-transparent blue) */}
        <mesh geometry={planeGeometry} rotation={[-Math.PI / 2, 0, 0]}>
          <meshPhongMaterial 
            color="#4f46e5" 
            transparent 
            opacity={0.3} 
            side={THREE.DoubleSide}
          />
        </mesh>
        
        {/* Axes helper */}
        <axesHelper args={[5]} />
        
        <OrbitControls enableDamping dampingFactor={0.05} />
      </Canvas>
    </div>
  );
};
