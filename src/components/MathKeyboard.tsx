import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface MathKeyboardProps {
  onInsert: (latex: string) => void;
}

export const MathKeyboard = ({ onInsert }: MathKeyboardProps) => {
  const pages = [
    // Página 1: Operaciones básicas y potencias
    [
      { label: "x²", value: "^{ }" },
      { label: "xⁿ", value: "^{ }" },
      { label: "√", value: "\\sqrt{ }" },
      { label: "ⁿ√", value: "\\sqrt[ ]{ }" },
      { label: "x/y", value: "\\frac{ }{ }" },
      { label: "|x|", value: "\\left| \\right|" },
      { label: "()", value: "\\left( \\right)" },
      { label: "[]", value: "\\left[ \\right]" },
      { label: "()ⁿ", value: "\\left( \\right)^{ }" },
      { label: "x̄", value: "\\bar{ }" },
      { label: "·", value: "\\cdot" },
      { label: "÷", value: "/" },
      { label: "≥", value: "\\geq" },
      { label: "≤", value: "\\leq" },
      { label: "π", value: "\\pi" },
      { label: "θ", value: "\\theta" },
      { label: "∞", value: "\\infty" },
      { label: "eˣ", value: "e^{ }" },
    ],
    // Página 2: Funciones trigonométricas
    [
      { label: "sin", value: "\\sin\\left( \\right)" },
      { label: "cos", value: "\\cos\\left( \\right)" },
      { label: "tan", value: "\\tan\\left( \\right)" },
      { label: "cot", value: "\\cot\\left( \\right)" },
      { label: "sec", value: "\\sec\\left( \\right)" },
      { label: "csc", value: "\\csc\\left( \\right)" },
      { label: "arcsin", value: "\\arcsin\\left( \\right)" },
      { label: "arccos", value: "\\arccos\\left( \\right)" },
      { label: "arctan", value: "\\arctan\\left( \\right)" },
      { label: "sinh", value: "\\sinh\\left( \\right)" },
      { label: "cosh", value: "\\cosh\\left( \\right)" },
      { label: "tanh", value: "\\tanh\\left( \\right)" },
      { label: "ln", value: "\\ln\\left( \\right)" },
      { label: "log", value: "\\log_{ }\\left( \\right)" },
      { label: "f(x)", value: "f\\left( \\right)" },
      { label: "f∘g", value: "f\\circ g" },
    ],
    // Página 3: Cálculo diferencial e integral
    [
      { label: "∂/∂x", value: "\\frac{\\partial }{ \\partial }" },
      { label: "∂/∂", value: "\\frac{\\partial }{ \\partial }" },
      { label: "∂²/∂x²", value: "\\frac{\\partial^2 }{\\partial ^2}" },
      { label: "∇", value: "\\nabla" },
      { label: "∇²", value: "\\nabla^2" },
      { label: "∫", value: "\\int_{ }^{ } " },
      { label: "∫∫", value: "\\int_{ }^{ } \\int_{ }^{ } " },
      { label: "∫∫∫", value: "\\int_{ }^{ } \\int_{ }^{ } \\int_{ }^{ } " },
      { label: "lim", value: "\\lim_{ \\to }" },
      { label: "Σ", value: "\\sum_{ }^{ }" },
      { label: "Π", value: "\\prod_{ }^{ }" },
    ],
  ];

  return (
    <Card className="p-4">
      <Carousel className="w-full">
        <CarouselContent>
          {pages.map((page, pageIndex) => (
            <CarouselItem key={pageIndex}>
              <div className="grid grid-cols-6 gap-2">
                {page.map((symbol, index) => (
                  <Button
                    key={`${symbol.label}-${index}`}
                    variant="outline"
                    size="sm"
                    onClick={() => onInsert(symbol.value)}
                    className="text-sm h-10"
                  >
                    {symbol.label}
                  </Button>
                ))}
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="flex justify-center gap-2 mt-3">
          <CarouselPrevious className="static translate-y-0" />
          <CarouselNext className="static translate-y-0" />
        </div>
      </Carousel>
    </Card>
  );
};
