import { useEffect, useRef, useImperativeHandle, forwardRef } from "react";
import { loadMathQuill } from "@/lib/mathquill-loader";

interface MathInputProps {
  value: string;
  onChange: (latex: string) => void;
  placeholder?: string;
}

export interface MathInputRef {
  write: (latex: string) => void;
  focus: () => void;
}

export const MathInput = forwardRef<MathInputRef, MathInputProps>(
  ({ value, onChange, placeholder }, ref) => {
    const mathFieldRef = useRef<any>(null);
    const spanRef = useRef<HTMLSpanElement>(null);

    useImperativeHandle(ref, () => ({
      write: (latex: string) => {
        if (mathFieldRef.current) {
          mathFieldRef.current.write(latex);
          // Move cursor into the first empty box
          mathFieldRef.current.keystroke('Left');
          mathFieldRef.current.focus();
        }
      },
      focus: () => {
        if (mathFieldRef.current) {
          mathFieldRef.current.focus();
        }
      },
    }));

    useEffect(() => {
      let mounted = true;

      const initMathQuill = async () => {
        try {
          await loadMathQuill();
          
          if (!mounted || !spanRef.current) return;

          const MQ = (window as any).MathQuill.getInterface(2);
          
          const mathField = MQ.MathField(spanRef.current, {
            spaceBehavesLikeTab: true,
            leftRightIntoCmdGoes: 'up',
            restrictMismatchedBrackets: true,
            supSubsRequireOperand: false,
            charsThatBreakOutOfSupSub: '+-=<>',
            autoSubscriptNumerals: true,
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
        } catch (error) {
          console.error("Error initializing MathQuill:", error);
        }
      };

      initMathQuill();

      return () => {
        mounted = false;
      };
    }, []);

    useEffect(() => {
      if (mathFieldRef.current && value !== mathFieldRef.current.latex()) {
        mathFieldRef.current.latex(value);
      }
    }, [value]);

    return (
      <div className="space-y-2">
        <span
          ref={spanRef}
          className="mathquill-editable border border-input rounded-md bg-background p-3 min-h-[42px] block overflow-x-auto"
        />
      </div>
    );
  }
);
