import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface MathKeyboardProps {
  onInsert: (symbol: string) => void;
}

export const MathKeyboard = ({ onInsert }: MathKeyboardProps) => {
  const basicSymbols = [
    { label: "x²", value: "**2" },
    { label: "xⁿ", value: "**" },
    { label: "√", value: "sqrt(" },
    { label: "ⁿ√", value: "root(" },
    { label: "π", value: "pi" },
    { label: "e", value: "e" },
    { label: "∞", value: "inf" },
    { label: "|x|", value: "abs(" },
  ];

  const trigSymbols = [
    { label: "sin", value: "sin(" },
    { label: "cos", value: "cos(" },
    { label: "tan", value: "tan(" },
    { label: "cot", value: "cot(" },
    { label: "sec", value: "sec(" },
    { label: "csc", value: "csc(" },
    { label: "arcsin", value: "arcsin(" },
    { label: "arccos", value: "arccos(" },
    { label: "arctan", value: "arctan(" },
  ];

  const advancedSymbols = [
    { label: "ln", value: "ln(" },
    { label: "log", value: "log(" },
    { label: "exp", value: "exp(" },
    { label: "sinh", value: "sinh(" },
    { label: "cosh", value: "cosh(" },
    { label: "tanh", value: "tanh(" },
    { label: "(", value: "(" },
    { label: ")", value: ")" },
  ];

  const operators = [
    { label: "+", value: " + " },
    { label: "−", value: " - " },
    { label: "×", value: " * " },
    { label: "÷", value: " / " },
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
