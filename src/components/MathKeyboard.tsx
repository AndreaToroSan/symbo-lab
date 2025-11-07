import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface MathKeyboardProps {
  onInsert: (latex: string) => void;
}

export const MathKeyboard = ({ onInsert }: MathKeyboardProps) => {
  const basicSymbols = [
    { label: "x²", value: "^2" },
    { label: "xⁿ", value: "^{ }" },
    { label: "√", value: "\\sqrt{ }" },
    { label: "ⁿ√", value: "\\sqrt[n]{ }" },
    { label: "π", value: "\\pi" },
    { label: "e", value: "e" },
    { label: "∞", value: "\\infty" },
    { label: "|x|", value: "\\left| \\right|" },
    { label: "x/y", value: "\\frac{ }{ }" },
  ];

  const trigSymbols = [
    { label: "sin", value: "\\sin\\left( \\right)" },
    { label: "cos", value: "\\cos\\left( \\right)" },
    { label: "tan", value: "\\tan\\left( \\right)" },
    { label: "cot", value: "\\cot\\left( \\right)" },
    { label: "sec", value: "\\sec\\left( \\right)" },
    { label: "csc", value: "\\csc\\left( \\right)" },
    { label: "arcsin", value: "\\arcsin\\left( \\right)" },
    { label: "arccos", value: "\\arccos\\left( \\right)" },
    { label: "arctan", value: "\\arctan\\left( \\right)" },
  ];

  const advancedSymbols = [
    { label: "ln", value: "\\ln\\left( \\right)" },
    { label: "log", value: "\\log\\left( \\right)" },
    { label: "exp", value: "\\exp\\left( \\right)" },
    { label: "sinh", value: "\\sinh\\left( \\right)" },
    { label: "cosh", value: "\\cosh\\left( \\right)" },
    { label: "tanh", value: "\\tanh\\left( \\right)" },
    { label: "∂/∂x", value: "\\frac{\\partial }{\\partial x}" },
    { label: "∫", value: "\\int_{ }^{ } " },
  ];

  const operators = [
    { label: "+", value: "+" },
    { label: "−", value: "-" },
    { label: "×", value: "\\cdot" },
    { label: "÷", value: "/" },
  ];

  return (
    <Card className="p-4">
      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="basic">Básico</TabsTrigger>
          <TabsTrigger value="trig">Trig</TabsTrigger>
          <TabsTrigger value="advanced">Avanzado</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-2 mt-4">
          <div className="grid grid-cols-4 gap-2 mb-2">
            {operators.map((op) => (
              <Button
                key={op.label}
                variant="outline"
                size="sm"
                onClick={() => onInsert(op.value)}
                className="font-semibold"
              >
                {op.label}
              </Button>
            ))}
          </div>
          <div className="grid grid-cols-4 gap-2">
            {basicSymbols.map((symbol) => (
              <Button
                key={symbol.label}
                variant="outline"
                size="sm"
                onClick={() => onInsert(symbol.value)}
              >
                {symbol.label}
              </Button>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="trig" className="mt-4">
          <div className="grid grid-cols-3 gap-2">
            {trigSymbols.map((symbol) => (
              <Button
                key={symbol.label}
                variant="outline"
                size="sm"
                onClick={() => onInsert(symbol.value)}
              >
                {symbol.label}
              </Button>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="advanced" className="mt-4">
          <div className="grid grid-cols-4 gap-2">
            {advancedSymbols.map((symbol) => (
              <Button
                key={symbol.label}
                variant="outline"
                size="sm"
                onClick={() => onInsert(symbol.value)}
              >
                {symbol.label}
              </Button>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
};
