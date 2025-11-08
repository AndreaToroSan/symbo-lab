import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MathDisplay } from "@/components/MathDisplay";
import { Calculator } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Derivatives = () => {
  const [functionInput, setFunctionInput] = useState("x^2 * y + y^3");
  const [variable, setVariable] = useState("x");
  const [result, setResult] = useState<string | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const { toast } = useToast();

  const handleCalculate = async () => {
    setIsCalculating(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('calculate-derivatives', {
        body: { 
          functionText: functionInput,
          variable: variable 
        }
      });

      if (error) throw error;

      if (data?.error) {
        toast({
          title: "Error",
          description: data.error,
          variant: "destructive"
        });
        setResult("\\text{Error al calcular}");
      } else {
        setResult(`\\frac{\\partial}{\\partial ${variable}}(${functionInput}) = ${data.result}`);
        toast({
          title: "Cálculo completado",
          description: "Derivada parcial calculada exitosamente"
        });
      }
    } catch (error) {
      console.error("Calculation error:", error);
      toast({
        title: "Error",
        description: "Error al calcular la derivada",
        variant: "destructive"
      });
      setResult("\\text{Error al calcular derivada}");
    } finally {
      setIsCalculating(false);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-4xl font-bold mb-2 text-foreground">Partial Derivatives</h1>
        <p className="text-muted-foreground">Calculate partial derivatives of multivariable functions</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Input Function</CardTitle>
            <CardDescription>Enter your function and select variable</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="function">Function f(x,y)</Label>
              <Input
                id="function"
                value={functionInput}
                onChange={(e) => setFunctionInput(e.target.value)}
                placeholder="e.g., x^2 * y + y^3"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="variable">Differentiate with respect to</Label>
              <Select value={variable} onValueChange={setVariable}>
                <SelectTrigger id="variable">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="x">x</SelectItem>
                  <SelectItem value="y">y</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button onClick={handleCalculate} disabled={isCalculating} className="w-full">
              <Calculator className="mr-2 h-4 w-4" />
              {isCalculating ? "Calculating..." : "Calculate Derivative"}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Result</CardTitle>
            <CardDescription>Partial derivative result</CardDescription>
          </CardHeader>
          <CardContent>
            {result ? (
              <MathDisplay math={result} />
            ) : (
              <p className="text-muted-foreground text-center py-8">
                Enter a function and click calculate to see the result
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Derivatives;