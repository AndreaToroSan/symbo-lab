import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MathDisplay } from "@/components/MathDisplay";
import { Calculator } from "lucide-react";

const Derivatives = () => {
  const [functionInput, setFunctionInput] = useState("x^2 * y + y^3");
  const [variable, setVariable] = useState("x");
  const [result, setResult] = useState<string | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const handleCalculate = async () => {
    setIsCalculating(true);
    
    try {
      // TODO: Replace with actual API call
      const response = await fetch("/api/calculate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          operation: "derivative",
          function: functionInput,
          variable: variable,
        }),
      });

      // Placeholder result
      setResult(`\\frac{\\partial}{\\partial ${variable}}(${functionInput}) = \\text{Result will appear here}`);
    } catch (error) {
      console.error("Calculation error:", error);
      setResult("\\text{Error calculating derivative}");
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