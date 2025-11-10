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
  const meshRefUpper = useRef<THREE.Mesh>(null);
  const meshRefLower = useRef<THREE.Mesh>(null);

  // Create surface geometry
  const geometryUpper = new THREE.BufferGeometry();
  const geometryLower = new THREE.BufferGeometry();
  const verticesUpper: number[] = [];
  const verticesLower: number[] = [];
  const indicesUpper: number[] = [];
  const indicesLower: number[] = [];
  const colorsUpper: number[] = [];
  const colorsLower: number[] = [];

  const [xMin, xMax] = xRange;
  const [yMin, yMax] = yRange;
  const xStep = (xMax - xMin) / resolution;
  const yStep = (yMax - yMin) / resolution;

  const evaluateZ = (x: number, y: number): { upper: number; lower: number } => {
    try {
      const func = formula
        .replace(/\*\*/g, "^")
        .replace(/x/g, `(${x})`)
        .replace(/y/g, `(${y})`);
      
      // Use math evaluation
      const result = eval(func.replace(/\^/g, "**"));
      
      // Check if result is valid (must be a real number)
      if (isNaN(result) || !isFinite(result)) {
        return { upper: NaN, lower: NaN };
      }
      
      // For square root results (always positive), create both ± surfaces
      // This handles surfaces like ellipsoids, hyperboloids, cones
      if (showBothSides) {
        return { upper: result, lower: -result };
      } else {
        // For explicit z = f(x,y) surfaces like paraboloids
        return { upper: result, lower: NaN };
      }
    } catch {
      return { upper: NaN, lower: NaN };
    }
  };

  let minZ = Infinity;
  let maxZ = -Infinity;
  let hasValidPoints = false;

  // Generate vertices for both surfaces
  for (let i = 0; i <= resolution; i++) {
    for (let j = 0; j <= resolution; j++) {
      const x = xMin + i * xStep;
      const y = yMin + j * yStep;
      const { upper, lower } = evaluateZ(x, y);
      
      // Upper surface
      if (!isNaN(upper) && isFinite(upper)) {
        verticesUpper.push(x, y, upper);
        minZ = Math.min(minZ, upper);
        maxZ = Math.max(maxZ, upper);
        hasValidPoints = true;
      } else {
        verticesUpper.push(x, y, 0);
      }
      
      // Lower surface
      if (showBothSides) {
        if (!isNaN(lower) && isFinite(lower)) {
          verticesLower.push(x, y, lower);
          minZ = Math.min(minZ, lower);
          maxZ = Math.max(maxZ, lower);
          hasValidPoints = true;
        } else {
          verticesLower.push(x, y, 0);
        }
      }
    }
  }

  // Generate colors based on height for upper surface
  for (let i = 0; i < verticesUpper.length; i += 3) {
    const z = verticesUpper[i + 2];
    const normalized = hasValidPoints ? (z - minZ) / (maxZ - minZ || 1) : 0.5;
    
    // Blue to red gradient
    colorsUpper.push(normalized, 0.3, 1 - normalized);
  }
  
  // Generate colors for lower surface
  if (showBothSides) {
    for (let i = 0; i < verticesLower.length; i += 3) {
      const z = verticesLower[i + 2];
      const normalized = hasValidPoints ? (z - minZ) / (maxZ - minZ || 1) : 0.5;
      
      // Blue to red gradient
      colorsLower.push(normalized, 0.3, 1 - normalized);
    }
  }

  // Generate indices for triangles - upper surface
  for (let i = 0; i < resolution; i++) {
    for (let j = 0; j < resolution; j++) {
      const a = i * (resolution + 1) + j;
      const b = a + 1;
      const c = a + (resolution + 1);
      const d = c + 1;

      // Check if all vertices are valid for upper surface
      const aValid = !isNaN(verticesUpper[a * 3 + 2]) && isFinite(verticesUpper[a * 3 + 2]);
      const bValid = !isNaN(verticesUpper[b * 3 + 2]) && isFinite(verticesUpper[b * 3 + 2]);
      const cValid = !isNaN(verticesUpper[c * 3 + 2]) && isFinite(verticesUpper[c * 3 + 2]);
      const dValid = !isNaN(verticesUpper[d * 3 + 2]) && isFinite(verticesUpper[d * 3 + 2]);

      if (aValid && bValid && cValid) {
        indicesUpper.push(a, b, c);
      }
      if (bValid && dValid && cValid) {
        indicesUpper.push(b, d, c);
      }
    }
  }
  
  // Generate indices for triangles - lower surface
  if (showBothSides) {
    for (let i = 0; i < resolution; i++) {
      for (let j = 0; j < resolution; j++) {
        const a = i * (resolution + 1) + j;
        const b = a + 1;
        const c = a + (resolution + 1);
        const d = c + 1;

        // Check if all vertices are valid for lower surface
        const aValid = !isNaN(verticesLower[a * 3 + 2]) && isFinite(verticesLower[a * 3 + 2]);
        const bValid = !isNaN(verticesLower[b * 3 + 2]) && isFinite(verticesLower[b * 3 + 2]);
        const cValid = !isNaN(verticesLower[c * 3 + 2]) && isFinite(verticesLower[c * 3 + 2]);
        const dValid = !isNaN(verticesLower[d * 3 + 2]) && isFinite(verticesLower[d * 3 + 2]);

        if (aValid && bValid && cValid) {
          indicesLower.push(a, b, c);
        }
        if (bValid && dValid && cValid) {
          indicesLower.push(b, d, c);
        }
      }
    }
  }

  geometryUpper.setIndex(indicesUpper);
  geometryUpper.setAttribute("position", new THREE.Float32BufferAttribute(verticesUpper, 3));
  geometryUpper.setAttribute("color", new THREE.Float32BufferAttribute(colorsUpper, 3));
  geometryUpper.computeVertexNormals();

  if (showBothSides && verticesLower.length > 0) {
    geometryLower.setIndex(indicesLower);
    geometryLower.setAttribute("position", new THREE.Float32BufferAttribute(verticesLower, 3));
    geometryLower.setAttribute("color", new THREE.Float32BufferAttribute(colorsLower, 3));
    geometryLower.computeVertexNormals();
  }

  return (
    <>
      <mesh ref={meshRefUpper} geometry={geometryUpper}>
        <meshPhongMaterial vertexColors side={THREE.DoubleSide} />
      </mesh>
      {showBothSides && verticesLower.length > 0 && (
        <mesh ref={meshRefLower} geometry={geometryLower}>
          <meshPhongMaterial vertexColors side={THREE.DoubleSide} />
        </mesh>
      )}
    </>
  );
}
