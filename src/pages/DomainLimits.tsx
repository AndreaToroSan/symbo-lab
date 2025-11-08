import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { MathDisplay } from "@/components/MathDisplay";
import { Calculator } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const DomainLimits = () => {
  const [functionInput, setFunctionInput] = useState("sqrt(4 - x^2 - y^2)");
  const [point, setPoint] = useState("(0,0)");
  const [domain, setDomain] = useState<string | null>(null);
  const [range, setRange] = useState<string | null>(null);
  const [limit, setLimit] = useState<any>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const { toast } = useToast();

  const handleCalculateDomain = async () => {
    setIsCalculating(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('calculate-domain-limits', {
        body: { 
          operation: 'domain',
          functionText: functionInput 
        }
      });

      if (error) throw error;

      if (data?.error) {
        toast({
          title: "Error",
          description: data.error,
          variant: "destructive"
        });
        setDomain("\\text{Error al calcular}");
      } else {
        setDomain(data.result);
        toast({
          title: "Cálculo completado",
          description: "Dominio calculado exitosamente"
        });
      }
    } catch (error) {
      console.error("Calculation error:", error);
      toast({
        title: "Error",
        description: "Error al calcular el dominio",
        variant: "destructive"
      });
      setDomain("\\text{Error al calcular dominio}");
    } finally {
      setIsCalculating(false);
    }
  };

  const handleCalculateRange = async () => {
    setIsCalculating(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('calculate-domain-limits', {
        body: { 
          operation: 'range',
          functionText: functionInput 
        }
      });

      if (error) throw error;

      if (data?.error) {
        toast({
          title: "Error",
          description: data.error,
          variant: "destructive"
        });
        setRange("\\text{Error al calcular}");
      } else {
        setRange(data.result);
        toast({
          title: "Cálculo completado",
          description: "Rango calculado exitosamente"
        });
      }
    } catch (error) {
      console.error("Calculation error:", error);
      toast({
        title: "Error",
        description: "Error al calcular el rango",
        variant: "destructive"
      });
      setRange("\\text{Error al calcular rango}");
    } finally {
      setIsCalculating(false);
    }
  };

  const handleCalculateLimit = async () => {
    setIsCalculating(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('calculate-domain-limits', {
        body: { 
          operation: 'limit',
          functionText: functionInput,
          point: point 
        }
      });

      if (error) throw error;

      if (data?.error) {
        toast({
          title: "Error",
          description: data.error,
          variant: "destructive"
        });
        setLimit(null);
      } else {
        setLimit(data);
        toast({
          title: "Cálculo completado",
          description: "Límite calculado exitosamente"
        });
      }
    } catch (error) {
      console.error("Calculation error:", error);
      toast({
        title: "Error",
        description: "Error al calcular el límite",
        variant: "destructive"
      });
      setLimit(null);
    } finally {
      setIsCalculating(false);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-4xl font-bold mb-2 text-foreground">Domain, Range & Limits</h1>
        <p className="text-muted-foreground">Analyze domain, range and calculate limits of multivariable functions</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Domain Analysis</CardTitle>
              <CardDescription>Find the domain of a function</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="function-domain">Function f(x,y)</Label>
                <Input
                  id="function-domain"
                  value={functionInput}
                  onChange={(e) => setFunctionInput(e.target.value)}
                  placeholder="e.g., sqrt(4 - x^2 - y^2)"
                />
              </div>

              <Button onClick={handleCalculateDomain} disabled={isCalculating} className="w-full">
                <Calculator className="mr-2 h-4 w-4" />
                {isCalculating ? "Calculating..." : "Calculate Domain"}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Range Analysis</CardTitle>
              <CardDescription>Find the range of a function</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="function-range">Function f(x,y)</Label>
                <Input
                  id="function-range"
                  value={functionInput}
                  onChange={(e) => setFunctionInput(e.target.value)}
                  placeholder="e.g., x^2 + y^2"
                />
              </div>

              <Button onClick={handleCalculateRange} disabled={isCalculating} className="w-full">
                <Calculator className="mr-2 h-4 w-4" />
                {isCalculating ? "Calculating..." : "Calculate Range"}
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
                <Label htmlFor="function-limit">Function f(x,y)</Label>
                <Input
                  id="function-limit"
                  value={functionInput}
                  onChange={(e) => setFunctionInput(e.target.value)}
                  placeholder="e.g., (x*y)/(x^2 + y^2)"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="point">Point (x,y)</Label>
                <Input
                  id="point"
                  value={point}
                  onChange={(e) => setPoint(e.target.value)}
                  placeholder="e.g., (0,0)"
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
                <CardTitle>Domain</CardTitle>
              </CardHeader>
              <CardContent>
                <MathDisplay math={domain} />
              </CardContent>
            </Card>
          )}

          {range && (
            <Card>
              <CardHeader>
                <CardTitle>Range</CardTitle>
              </CardHeader>
              <CardContent>
                <MathDisplay math={range} />
              </CardContent>
            </Card>
          )}

          {limit && (
            <Card>
              <CardHeader>
                <CardTitle>Limit</CardTitle>
              </CardHeader>
              <CardContent>
                {limit.exists ? (
                  <div className="space-y-2">
                    <MathDisplay math={limit.result} />
                    {limit.note && (
                      <p className="text-sm text-muted-foreground">{limit.note}</p>
                    )}
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-destructive">Limit does not exist</p>
                    <MathDisplay math={limit.result} />
                    {limit.note && (
                      <p className="text-sm text-muted-foreground">{limit.note}</p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {!domain && !range && !limit && (
            <Card>
              <CardHeader>
                <CardTitle>Results</CardTitle>
                <CardDescription>Results will appear here</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center py-8">
                  Calculate domain, range or limit to see results
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