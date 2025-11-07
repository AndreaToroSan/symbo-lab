import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { MathDisplay } from "@/components/MathDisplay";
import { Calculator } from "lucide-react";

const DomainLimits = () => {
  const [functionInput, setFunctionInput] = useState("1/(x^2 + y^2 - 1)");
  const [point, setPoint] = useState("(0, 0)");
  const [domain, setDomain] = useState<string | null>(null);
  const [limit, setLimit] = useState<string | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const handleCalculateDomain = async () => {
    setIsCalculating(true);
    
    try {
      // TODO: Replace with actual API call
      const response = await fetch("/api/calculate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          operation: "domain",
          function: functionInput,
        }),
      });

      // Placeholder result
      setDomain(`D = \\{(x,y) \\in \\mathbb{R}^2 : x^2 + y^2 \\neq 1\\}`);
    } catch (error) {
      console.error("Calculation error:", error);
      setDomain("\\text{Error calculating domain}");
    } finally {
      setIsCalculating(false);
    }
  };

  const handleCalculateLimit = async () => {
    setIsCalculating(true);
    
    try {
      // TODO: Replace with actual API call
      const response = await fetch("/api/calculate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          operation: "limit",
          function: functionInput,
          point: point,
        }),
      });

      // Placeholder result
      setLimit(`\\lim_{(x,y) \\to ${point}} ${functionInput} = \\text{Result will appear here}`);
    } catch (error) {
      console.error("Calculation error:", error);
      setLimit("\\text{Error calculating limit}");
    } finally {
      setIsCalculating(false);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-4xl font-bold mb-2 text-foreground">Domain & Limits</h1>
        <p className="text-muted-foreground">Analyze function domains and calculate multivariable limits</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Domain Analysis</CardTitle>
              <CardDescription>Find the domain of a multivariable function</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="domainFunction">Function f(x,y)</Label>
                <Input
                  id="domainFunction"
                  value={functionInput}
                  onChange={(e) => setFunctionInput(e.target.value)}
                  placeholder="e.g., 1/(x^2 + y^2 - 1)"
                />
              </div>

              <Button onClick={handleCalculateDomain} disabled={isCalculating} className="w-full">
                <Calculator className="mr-2 h-4 w-4" />
                {isCalculating ? "Calculating..." : "Find Domain"}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Limit Calculation</CardTitle>
              <CardDescription>Calculate limit at a point</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="limitFunction">Function f(x,y)</Label>
                <Input
                  id="limitFunction"
                  value={functionInput}
                  onChange={(e) => setFunctionInput(e.target.value)}
                  placeholder="e.g., (x*y)/(x^2 + y^2)"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="point">Point (x₀, y₀)</Label>
                <Input
                  id="point"
                  value={point}
                  onChange={(e) => setPoint(e.target.value)}
                  placeholder="e.g., (0, 0)"
                />
              </div>

              <Button onClick={handleCalculateLimit} disabled={isCalculating} className="w-full">
                <Calculator className="mr-2 h-4 w-4" />
                {isCalculating ? "Calculating..." : "Calculate Limit"}
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {domain && (
            <Card>
              <CardHeader>
                <CardTitle>Domain Result</CardTitle>
              </CardHeader>
              <CardContent>
                <MathDisplay math={domain} />
              </CardContent>
            </Card>
          )}

          {limit && (
            <Card>
              <CardHeader>
                <CardTitle>Limit Result</CardTitle>
              </CardHeader>
              <CardContent>
                <MathDisplay math={limit} />
              </CardContent>
            </Card>
          )}

          {!domain && !limit && (
            <Card>
              <CardHeader>
                <CardTitle>Results</CardTitle>
                <CardDescription>Results will appear here</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center py-8">
                  Calculate domain or limits to see results
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default DomainLimits;