import { useRef } from "react";
import * as THREE from "three";

interface QuadricSurface3DProps {
  formula: string;
  xRange: [number, number];
  yRange: [number, number];
  resolution?: number;
  showBothSides?: boolean;
}

export function QuadricSurface3D({ 
  formula, 
  xRange, 
  yRange, 
  resolution = 50,
  showBothSides = true 
}: QuadricSurface3DProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const meshRef2 = useRef<THREE.Mesh>(null);

  // Create surface geometry
  const geometry = new THREE.BufferGeometry();
  const geometry2 = new THREE.BufferGeometry();
  const vertices: number[] = [];
  const vertices2: number[] = [];
  const indices: number[] = [];
  const colors: number[] = [];
  const colors2: number[] = [];

  const [xMin, xMax] = xRange;
  const [yMin, yMax] = yRange;
  const xStep = (xMax - xMin) / resolution;
  const yStep = (yMax - yMin) / resolution;

  const evaluateZ = (x: number, y: number): number => {
    try {
      const func = formula
        .replace(/\*\*/g, "^")
        .replace(/x/g, `(${x})`)
        .replace(/y/g, `(${y})`);
      
      // Use math evaluation
      const result = eval(func.replace(/\^/g, "**"));
      
      // Check if result is valid
      if (isNaN(result) || !isFinite(result)) {
        return NaN;
      }
      
      return result;
    } catch {
      return NaN;
    }
  };

  let minZ = Infinity;
  let maxZ = -Infinity;
  let hasValidPoints = false;

  // Generate vertices for upper surface
  for (let i = 0; i <= resolution; i++) {
    for (let j = 0; j <= resolution; j++) {
      const x = xMin + i * xStep;
      const y = yMin + j * yStep;
      const z = evaluateZ(x, y);
      
      if (!isNaN(z) && isFinite(z)) {
        vertices.push(x, y, z);
        minZ = Math.min(minZ, z);
        maxZ = Math.max(maxZ, z);
        hasValidPoints = true;
        
        // Lower surface (negative z)
        if (showBothSides && z > 0) {
          vertices2.push(x, y, -z);
        }
      } else {
        vertices.push(x, y, 0);
        if (showBothSides) {
          vertices2.push(x, y, 0);
        }
      }
    }
  }

  // Generate colors based on height
  for (let i = 0; i < vertices.length; i += 3) {
    const z = vertices[i + 2];
    const normalized = hasValidPoints ? (z - minZ) / (maxZ - minZ || 1) : 0.5;
    
    // Blue to red gradient
    colors.push(normalized, 0.3, 1 - normalized);
    
    if (showBothSides && i < vertices2.length) {
      colors2.push(normalized, 0.3, 1 - normalized);
    }
  }

  // Generate indices for triangles
  for (let i = 0; i < resolution; i++) {
    for (let j = 0; j < resolution; j++) {
      const a = i * (resolution + 1) + j;
      const b = a + 1;
      const c = a + (resolution + 1);
      const d = c + 1;

      // Check if all vertices are valid
      const aValid = !isNaN(vertices[a * 3 + 2]) && isFinite(vertices[a * 3 + 2]);
      const bValid = !isNaN(vertices[b * 3 + 2]) && isFinite(vertices[b * 3 + 2]);
      const cValid = !isNaN(vertices[c * 3 + 2]) && isFinite(vertices[c * 3 + 2]);
      const dValid = !isNaN(vertices[d * 3 + 2]) && isFinite(vertices[d * 3 + 2]);

      if (aValid && bValid && cValid) {
        indices.push(a, b, c);
      }
      if (bValid && dValid && cValid) {
        indices.push(b, d, c);
      }
    }
  }

  geometry.setIndex(indices);
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
  geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
  geometry.computeVertexNormals();

  if (showBothSides && vertices2.length > 0) {
    geometry2.setIndex(indices);
    geometry2.setAttribute("position", new THREE.Float32BufferAttribute(vertices2, 3));
    geometry2.setAttribute("color", new THREE.Float32BufferAttribute(colors2, 3));
    geometry2.computeVertexNormals();
  }

  return (
    <>
      <mesh ref={meshRef} geometry={geometry}>
        <meshPhongMaterial vertexColors side={THREE.DoubleSide} />
      </mesh>
      {showBothSides && vertices2.length > 0 && (
        <mesh ref={meshRef2} geometry={geometry2}>
          <meshPhongMaterial vertexColors side={THREE.DoubleSide} opacity={0.8} transparent />
        </mesh>
      )}
    </>
  );
}
