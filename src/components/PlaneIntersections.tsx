import { Line, Text } from "@react-three/drei";
import * as THREE from "three";

interface PlaneIntersectionsProps {
  formula: string;
  xRange: [number, number];
  yRange: [number, number];
}

export function PlaneIntersections({ formula, xRange, yRange }: PlaneIntersectionsProps) {
  const [xMin, xMax] = xRange;
  const [yMin, yMax] = yRange;
  const resolution = 100;

  const evaluateZ = (x: number, y: number): number => {
    try {
      const func = formula
        .replace(/\^/g, "**")
        .replace(/sqrt/g, 'Math.sqrt')
        .replace(/sin/g, 'Math.sin')
        .replace(/cos/g, 'Math.cos')
        .replace(/x/g, `(${x})`)
        .replace(/y/g, `(${y})`)
        .replace(/Math\.Math\./g, 'Math.');
      const result = eval(func);
      return isNaN(result) || !isFinite(result) ? 0 : result;
    } catch {
      return 0;
    }
  };

  // Intersection with plane x = 0 (YZ plane)
  const yzPoints: THREE.Vector3[] = [];
  for (let i = 0; i <= resolution; i++) {
    const y = yMin + (i / resolution) * (yMax - yMin);
    const z = evaluateZ(0, y);
    if (isFinite(z)) {
      yzPoints.push(new THREE.Vector3(0, y, z));
    }
  }

  // Intersection with plane y = 0 (XZ plane)
  const xzPoints: THREE.Vector3[] = [];
  for (let i = 0; i <= resolution; i++) {
    const x = xMin + (i / resolution) * (xMax - xMin);
    const z = evaluateZ(x, 0);
    if (isFinite(z)) {
      xzPoints.push(new THREE.Vector3(x, 0, z));
    }
  }

  // Intersection with plane z = 0 (XY plane)
  const xyPoints: THREE.Vector3[] = [];
  const tolerance = 0.1;
  for (let i = 0; i <= resolution; i++) {
    for (let j = 0; j <= resolution; j++) {
      const x = xMin + (i / resolution) * (xMax - xMin);
      const y = yMin + (j / resolution) * (yMax - yMin);
      const z = evaluateZ(x, y);
      if (Math.abs(z) < tolerance) {
        xyPoints.push(new THREE.Vector3(x, y, 0));
      }
    }
  }

  return (
    <>
      {/* YZ Plane intersection (x = 0) */}
      {yzPoints.length > 1 && (
        <>
          <Line points={yzPoints} color="#ff6b6b" lineWidth={3} />
          <Text position={[0.5, yMax, 2]} fontSize={0.3} color="#ff6b6b">
            x = 0
          </Text>
        </>
      )}

      {/* XZ Plane intersection (y = 0) */}
      {xzPoints.length > 1 && (
        <>
          <Line points={xzPoints} color="#4ecdc4" lineWidth={3} />
          <Text position={[xMax, 0.5, 2]} fontSize={0.3} color="#4ecdc4">
            y = 0
          </Text>
        </>
      )}

      {/* XY Plane intersection (z = 0) */}
      {xyPoints.length > 1 && (
        <>
          <Line points={xyPoints} color="#95e1d3" lineWidth={3} />
          <Text position={[xMax, yMax, 0.5]} fontSize={0.3} color="#95e1d3">
            z = 0
          </Text>
        </>
      )}

      {/* Draw the coordinate planes semi-transparent */}
      <mesh position={[0, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[10, 10]} />
        <meshBasicMaterial color="#ff6b6b" transparent opacity={0.1} side={THREE.DoubleSide} />
      </mesh>
      
      <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[10, 10]} />
        <meshBasicMaterial color="#4ecdc4" transparent opacity={0.1} side={THREE.DoubleSide} />
      </mesh>
      
      <mesh position={[0, 0, 0]}>
        <planeGeometry args={[10, 10]} />
        <meshBasicMaterial color="#95e1d3" transparent opacity={0.1} side={THREE.DoubleSide} />
      </mesh>
    </>
  );
}
