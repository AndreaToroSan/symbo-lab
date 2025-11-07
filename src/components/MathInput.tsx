import { useEffect, useRef } from "react";
import "mathquill/build/mathquill.css";

// @ts-ignore
const MQ = window.MathQuill?.getInterface(2);

interface MathInputProps {
  value: string;
  onChange: (latex: string) => void;
  onMathFieldReady?: (field: any) => void;
  placeholder?: string;
}

export const MathInput = ({ value, onChange, onMathFieldReady, placeholder }: MathInputProps) => {
  const spanRef = useRef<HTMLSpanElement>(null);
  const mathFieldRef = useRef<any>(null);

  useEffect(() => {
    if (spanRef.current && MQ && !mathFieldRef.current) {
      const mathField = MQ.MathField(spanRef.current, {
        spaceBehavesLikeTab: true,
        leftRightIntoCmdGoes: 'up',
        restrictMismatchedBrackets: true,
        sumStartsWithNEquals: true,
        supSubsRequireOperand: true,
        charsThatBreakOutOfSupSub: '+-=<>',
        autoSubscriptNumerals: true,
        autoCommands: 'pi theta sqrt sum prod int',
        autoOperatorNames: 'sin cos tan arcsin arccos arctan sinh cosh tanh ln log exp abs',
        handlers: {
          edit: function() {
            const latex = mathField.latex();
            onChange(latex);
          }
        }
      });

      mathFieldRef.current = mathField;
      
      if (value) {
        mathField.latex(value);
      }

      if (onMathFieldReady) {
        onMathFieldReady(mathField);
      }
    }
  }, []);

  useEffect(() => {
    if (mathFieldRef.current && value !== mathFieldRef.current.latex()) {
      mathFieldRef.current.latex(value);
    }
  }, [value]);

  return (
    <div className="border border-input rounded-md bg-background">
      <span 
        ref={spanRef}
        className="mathquill-editor p-3 block min-h-[42px] text-base"
        style={{ fontSize: '16px' }}
      >
        {!MQ && placeholder}
      </span>
    </div>
  );
};
