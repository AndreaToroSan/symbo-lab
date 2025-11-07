import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MathDisplay } from "@/components/MathDisplay";
import { Calculator } from "lucide-react";

const Integrals = () => {
  const [functionInput, setFunctionInput] = useState("x^2 + y^2");
  const [integralType, setIntegralType] = useState<"double" | "triple">("double");
  const [xMin, setXMin] = useState("-1");
  const [xMax, setXMax] = useState("1");
  const [yMin, setYMin] = useState("-1");
  const [yMax, setYMax] = useState("1");
  const [zMin, setZMin] = useState("-1");
  const [zMax, setZMax] = useState("1");
  const [result, setResult] = useState<string | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const handleCalculate = async () => {
    setIsCalculating(true);
    
    // TODO: Replace with actual API call
    try {
      // Simulated API call to /api/calculate
      const response = await fetch("/api/calculate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          operation: "integral",
          function: functionInput,
          type: integralType,
          bounds: integralType === "double" 
            ? { x: [xMin, xMax], y: [yMin, yMax] }
            : { x: [xMin, xMax], y: [yMin, yMax], z: [zMin, zMax] }
        }),
      });

      // For now, show a placeholder result
      const integralSymbol = integralType === "double" ? "\\iint" : "\\iiint";
      const bounds = integralType === "double"
        ? `_{${yMin}}^{${yMax}} \\int_{${xMin}}^{${xMax}}`
        : `_{${zMin}}^{${zMax}} \\int_{${yMin}}^{${yMax}} \\int_{${xMin}}^{${xMax}}`;
      
      setResult(`${integralSymbol}${bounds} (${functionInput}) \\, dx \\, dy ${integralType === "triple" ? "\\, dz" : ""} = \\text{Result will appear here}`);
    } catch (error) {
      console.error("Calculation error:", error);
      setResult("\\text{Error calculating integral}");
    } finally {
      setIsCalculating(false);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-4xl font-bold mb-2 text-foreground">Multiple Integrals</h1>
        <p className="text-muted-foreground">Calculate double and triple integrals</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Input Function</CardTitle>
            <CardDescription>Enter your function and integration bounds</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="function">Function f(x,y) or f(x,y,z)</Label>
              <Input
                id="function"
                value={functionInput}
                onChange={(e) => setFunctionInput(e.target.value)}
                placeholder="e.g., x^2 + y^2"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="integralType">Integral Type</Label>
              <Select value={integralType} onValueChange={(value: "double" | "triple") => setIntegralType(value)}>
                <SelectTrigger id="integralType">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="double">Double Integral (∬)</SelectItem>
                  <SelectItem value="triple">Triple Integral (∭)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="xMin">x min</Label>
                <Input
                  id="xMin"
                  value={xMin}
                  onChange={(e) => setXMin(e.target.value)}
                  placeholder="-1"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="xMax">x max</Label>
                <Input
                  id="xMax"
                  value={xMax}
                  onChange={(e) => setXMax(e.target.value)}
                  placeholder="1"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="yMin">y min</Label>
                <Input
                  id="yMin"
                  value={yMin}
                  onChange={(e) => setYMin(e.target.value)}
                  placeholder="-1"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="yMax">y max</Label>
                <Input
                  id="yMax"
                  value={yMax}
                  onChange={(e) => setYMax(e.target.value)}
                  placeholder="1"
                />
              </div>
              {integralType === "triple" && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="zMin">z min</Label>
                    <Input
                      id="zMin"
                      value={zMin}
                      onChange={(e) => setZMin(e.target.value)}
                      placeholder="-1"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="zMax">z max</Label>
                    <Input
                      id="zMax"
                      value={zMax}
                      onChange={(e) => setZMax(e.target.value)}
                      placeholder="1"
                    />
                  </div>
                </>
              )}
            </div>

            <Button onClick={handleCalculate} disabled={isCalculating} className="w-full">
              <Calculator className="mr-2 h-4 w-4" />
              {isCalculating ? "Calculating..." : "Calculate Integral"}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Result</CardTitle>
            <CardDescription>Integral calculation result</CardDescription>
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

export default Integrals;