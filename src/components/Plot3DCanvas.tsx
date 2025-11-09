import { useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Grid, Line, Text } from "@react-three/drei";
import * as THREE from "three";
import { QuadricSurface3D } from "./QuadricSurface3D";

type VisualizationType = "surface" | "parametric" | "contour" | "vector-field" | "implicit" | "quadric";

interface Plot3DCanvasProps {
  formula: string;
  xRange: [number, number];
  yRange: [number, number];
  tRange?: [number, number];
  resolution?: number;
  visualizationType?: VisualizationType;
}

function ParametricCurve({ formula, tRange = [0, 6.28], resolution = 100 }: { formula: string; tRange?: [number, number]; resolution?: number }) {
  const [xFunc, yFunc, zFunc] = formula.split("|");
  const points: THREE.Vector3[] = [];

  const evaluateParam = (func: string, t: number): number => {
    try {
      const f = func.replace(/t/g, `(${t})`).replace(/\^/g, "**");
      return eval(f);
    } catch {
      return 0;
    }
  };

  const [tMin, tMax] = tRange;
  const tStep = (tMax - tMin) / resolution;

  for (let i = 0; i <= resolution; i++) {
    const t = tMin + i * tStep;
    const x = evaluateParam(xFunc, t);
    const y = evaluateParam(yFunc, t);
    const z = evaluateParam(zFunc, t);
    points.push(new THREE.Vector3(x, y, z));
  }

  return (
    <Line
      points={points}
      color="#ff0066"
      lineWidth={3}
    />
  );
}

function Surface({ formula, xRange, yRange, resolution = 50, visualizationType = "surface" }: Plot3DCanvasProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  // Create surface geometry
  const geometry = new THREE.BufferGeometry();
  const vertices: number[] = [];
  const indices: number[] = [];
  const colors: number[] = [];

  const [xMin, xMax] = xRange;
  const [yMin, yMax] = yRange;
  const xStep = (xMax - xMin) / resolution;
  const yStep = (yMax - yMin) / resolution;

  // Function parser (simplified - in production use math.js or similar)
  const evaluateZ = (x: number, y: number): number => {
    try {
      // Simple evaluation - replace with proper parser in production
      const func = formula
        .replace(/\^/g, "**")
        .replace(/x/g, `(${x})`)
        .replace(/y/g, `(${y})`);
      return eval(func);
    } catch {
      return 0;
    }
  };

  let minZ = Infinity;
  let maxZ = -Infinity;

  // Generate vertices
  for (let i = 0; i <= resolution; i++) {
    for (let j = 0; j <= resolution; j++) {
      const x = xMin + i * xStep;
      const y = yMin + j * yStep;
      const z = evaluateZ(x, y);
      
      vertices.push(x, y, z);
      minZ = Math.min(minZ, z);
      maxZ = Math.max(maxZ, z);
    }
  }

  // Generate colors based on height
  for (let i = 0; i < vertices.length; i += 3) {
    const z = vertices[i + 2];
    const normalized = (z - minZ) / (maxZ - minZ || 1);
    
    // Blue to red gradient
    colors.push(normalized, 0.3, 1 - normalized);
  }

  // Generate indices for triangles
  for (let i = 0; i < resolution; i++) {
    for (let j = 0; j < resolution; j++) {
      const a = i * (resolution + 1) + j;
      const b = a + 1;
      const c = a + (resolution + 1);
      const d = c + 1;

      indices.push(a, b, c);
      indices.push(b, d, c);
    }
  }

  geometry.setIndex(indices);
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
  geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
  geometry.computeVertexNormals();

  return (
    <>
      <mesh ref={meshRef} geometry={geometry}>
        <meshPhongMaterial vertexColors side={THREE.DoubleSide} />
      </mesh>
      {/* Z range indicator */}
      <Text position={[-5, maxZ + 0.5, 0]} fontSize={0.25} color="#95e1d3">
        Max: {maxZ.toFixed(2)}
      </Text>
      <Text position={[-5, minZ - 0.5, 0]} fontSize={0.25} color="#95e1d3">
        Min: {minZ.toFixed(2)}
      </Text>
    </>
  );
}

function AxisLabels({ xRange, yRange }: { xRange: [number, number]; yRange: [number, number] }) {
  const [xMin, xMax] = xRange;
  const [yMin, yMax] = yRange;
  
  return (
    <>
      {/* X axis labels */}
      <Text position={[xMax + 0.5, 0, 0]} fontSize={0.3} color="#ff6b6b">
        X
      </Text>
      <Text position={[xMin, -0.3, 0]} fontSize={0.2} color="#888">
        {xMin.toFixed(1)}
      </Text>
      <Text position={[xMax, -0.3, 0]} fontSize={0.2} color="#888">
        {xMax.toFixed(1)}
      </Text>
      
      {/* Y axis labels */}
      <Text position={[0, 0, yMax + 0.5]} fontSize={0.3} color="#4ecdc4">
        Y
      </Text>
      <Text position={[0, -0.3, yMin]} fontSize={0.2} color="#888">
        {yMin.toFixed(1)}
      </Text>
      <Text position={[0, -0.3, yMax]} fontSize={0.2} color="#888">
        {yMax.toFixed(1)}
      </Text>
      
      {/* Z axis label */}
      <Text position={[0, 5.5, 0]} fontSize={0.3} color="#95e1d3">
        Z
      </Text>
      
      {/* Origin marker */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
    </>
  );
}

export const Plot3DCanvas = (props: Plot3DCanvasProps) => {
  const { visualizationType = "surface" } = props;

  return (
    <div className="w-full h-[500px] bg-card rounded-lg overflow-hidden border">
      <Canvas camera={{ position: [8, 8, 8], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        
        {visualizationType === "parametric" ? (
          <ParametricCurve formula={props.formula} tRange={props.tRange} />
        ) : visualizationType === "quadric" ? (
          <QuadricSurface3D 
            formula={props.formula}
            xRange={props.xRange}
            yRange={props.yRange}
            resolution={props.resolution}
            showBothSides={true}
          />
        ) : (
          <Surface {...props} />
        )}
        
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
        
        <AxisLabels xRange={props.xRange} yRange={props.yRange} />
        
        <OrbitControls enableDamping dampingFactor={0.05} />
        
        <axesHelper args={[5]} />
      </Canvas>
    </div>
  );
};