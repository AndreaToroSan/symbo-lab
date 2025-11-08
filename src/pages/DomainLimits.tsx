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
  const [functionInput, setFunctionInput] = useState("1/(x^2 + y^2 - 1)");
  const [point, setPoint] = useState("(0, 0)");
  const [domain, setDomain] = useState<string | null>(null);
  const [limit, setLimit] = useState<string | null>(null);
  const [limitNote, setLimitNote] = useState<string | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const { toast } = useToast();

  const handleCalculateDomain = async () => {
    setIsCalculating(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('calculate-domain-limits', {
        body: { 
          operation: "domain",
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
        setDomain("\\text{Error al calcular dominio}");
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

  const handleCalculateLimit = async () => {
    setIsCalculating(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('calculate-domain-limits', {
        body: { 
          operation: "limit",
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
        setLimit("\\text{Error al calcular límite}");
        setLimitNote(null);
      } else {
        const exists = data.exists ? "\\text{Existe}" : "\\text{No existe}";
        setLimit(`${exists}: ${data.result}`);
        setLimitNote(data.note || null);
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
      setLimit("\\text{Error al calcular límite}");
      setLimitNote(null);
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
                <CardTitle>Resultado del Límite</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <MathDisplay math={limit} />
                {limitNote && (
                  <p className="text-sm text-muted-foreground">{limitNote}</p>
                )}
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