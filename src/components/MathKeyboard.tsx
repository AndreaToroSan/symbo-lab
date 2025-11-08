import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface MathKeyboardProps {
  onInsert: (latex: string) => void;
}

export const MathKeyboard = ({ onInsert }: MathKeyboardProps) => {
  const allSymbols = [
    // Row 1
    { label: "x²", value: "^2" },
    { label: "xⁿ", value: "^{ }" },
    { label: "√", value: "\\sqrt{ }" },
    { label: "ⁿ√", value: "\\sqrt[n]{ }" },
    { label: "x/y", value: "\\frac{ }{ }" },
    { label: "log", value: "\\log_{ }\\left( \\right)" },
    { label: "π", value: "\\pi" },
    { label: "θ", value: "\\theta" },
    { label: "∞", value: "\\infty" },
    { label: "∫", value: "\\int_{ }^{ } " },
    { label: "∂/∂x", value: "\\frac{\\partial }{ \\partial x}" },
    
    // Row 2
    { label: "≥", value: "\\geq" },
    { label: "≤", value: "\\leq" },
    { label: "·", value: "\\cdot" },
    { label: "÷", value: "/" },
    { label: "x̄", value: "\\bar{ }" },
    { label: "()", value: "\\left( \\right)" },
    { label: "[]", value: "\\left[ \\right]" },
    { label: "f∘g", value: "f\\circ g" },
    { label: "f(x)", value: "f\\left( \\right)" },
    { label: "ln", value: "\\ln\\left( \\right)" },
    { label: "eˣ", value: "e^{ }" },
    
    // Row 3
    { label: "()ⁿ", value: "\\left( \\right)^{ }" },
    { label: "∂/∂", value: "\\frac{\\partial }{ \\partial }" },
    { label: "∫∫", value: "\\int \\int " },
    { label: "lim", value: "\\lim_{ \\to }" },
    { label: "Σ", value: "\\sum_{ }^{ }" },
    { label: "sin", value: "\\sin\\left( \\right)" },
    { label: "cos", value: "\\cos\\left( \\right)" },
    { label: "tan", value: "\\tan\\left( \\right)" },
    { label: "cot", value: "\\cot\\left( \\right)" },
    { label: "csc", value: "\\csc\\left( \\right)" },
    { label: "sec", value: "\\sec\\left( \\right)" },
    
    // Row 4 - Additional calculus symbols
    { label: "|x|", value: "\\left| \\right|" },
    { label: "∇", value: "\\nabla" },
    { label: "∇²", value: "\\nabla^2" },
    { label: "∂²/∂x²", value: "\\frac{\\partial^2 }{\\partial x^2}" },
    { label: "∫∫∫", value: "\\int \\int \\int " },
    { label: "arcsin", value: "\\arcsin\\left( \\right)" },
    { label: "arccos", value: "\\arccos\\left( \\right)" },
    { label: "arctan", value: "\\arctan\\left( \\right)" },
    { label: "sinh", value: "\\sinh\\left( \\right)" },
    { label: "cosh", value: "\\cosh\\left( \\right)" },
    { label: "tanh", value: "\\tanh\\left( \\right)" },
  ];

  return (
    <Card className="p-4">
      <div className="grid grid-cols-11 gap-1.5">
        {allSymbols.map((symbol, index) => (
          <Button
            key={`${symbol.label}-${index}`}
            variant="outline"
            size="sm"
            onClick={() => onInsert(symbol.value)}
            className="text-xs h-9 px-1"
          >
            {symbol.label}
          </Button>
        ))}
      </div>
    </Card>
  );
};
