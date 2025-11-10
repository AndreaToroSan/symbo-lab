import { useEffect, useRef } from "react";
import "katex/dist/katex.min.css";
import katex from "katex";

interface MathDisplayProps {
  math: string;
  displayMode?: boolean;
}

export const MathDisplay = ({ math, displayMode = true }: MathDisplayProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      try {
        katex.render(math, containerRef.current, {
          displayMode,
          throwOnError: false,
          strict: false,
        });
      } catch (error) {
        console.error("KaTeX rendering error:", error);
        if (containerRef.current) {
          containerRef.current.textContent = math;
        }
      }
    }
  }, [math, displayMode]);

  return <div ref={containerRef} className="p-4 bg-muted/30 rounded-lg overflow-x-auto max-w-full" />;
};