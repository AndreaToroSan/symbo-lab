import { Line } from "@react-three/drei";
import * as THREE from "three";

interface ContourLinesProps {
  formula: string;
  xRange: [number, number];
  yRange: [number, number];
  levels?: number;
}

export function ContourLines({ formula, xRange, yRange, levels = 8 }: ContourLinesProps) {
  const [xMin, xMax] = xRange;
  const [yMin, yMax] = yRange;
  const resolution = 50;
  
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

  // Calculate z values to determine contour levels
  const zValues: number[] = [];
  for (let i = 0; i <= resolution; i++) {
    for (let j = 0; j <= resolution; j++) {
      const x = xMin + (i / resolution) * (xMax - xMin);
      const y = yMin + (j / resolution) * (yMax - yMin);
      const z = evaluateZ(x, y);
      if (isFinite(z)) zValues.push(z);
    }
  }

  const minZ = Math.min(...zValues);
  const maxZ = Math.max(...zValues);
  const zStep = (maxZ - minZ) / levels;

  // Generate contour lines for each level
  const contourLines: JSX.Element[] = [];
  
  for (let level = 0; level <= levels; level++) {
    const targetZ = minZ + level * zStep;
    const points: THREE.Vector3[] = [];
    
    // Trace contour at this z level
    for (let i = 0; i < resolution; i++) {
      for (let j = 0; j < resolution; j++) {
        const x = xMin + (i / resolution) * (xMax - xMin);
        const y = yMin + (j / resolution) * (yMax - yMin);
        const z = evaluateZ(x, y);
        
        if (Math.abs(z - targetZ) < zStep * 0.1) {
          points.push(new THREE.Vector3(x, y, targetZ));
        }
      }
    }

    if (points.length > 2) {
      const color = new THREE.Color().setHSL(level / levels, 0.8, 0.6);
      contourLines.push(
        <Line
          key={level}
          points={points}
          color={color}
          lineWidth={2}
        />
      );
    }
  }

  return <>{contourLines}</>;
}
