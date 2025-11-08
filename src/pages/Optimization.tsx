import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { MathDisplay } from "@/components/MathDisplay";
import { Calculator } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Optimization = () => {
  const [functionInput, setFunctionInput] = useState("x^2 + y^2 - 2*x - 4*y");
  const [criticalPoints, setCriticalPoints] = useState<string | null>(null);
  const [classification, setClassification] = useState<string | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const { toast } = useToast();

  const handleCalculate = async () => {
    setIsCalculating(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('calculate-optimization', {
        body: { functionText: functionInput }
      });

      if (error) throw error;

      if (data?.error) {
        toast({
          title: "Error",
          description: data.error,
          variant: "destructive"
        });
        setCriticalPoints("\\text{Error al calcular}");
        setClassification("");
      } else {
        setCriticalPoints(data.criticalPoints);
        setClassification(data.classification);
        toast({
          title: "Cálculo completado",
          description: "Puntos críticos encontrados exitosamente"
        });
      }
    } catch (error) {
      console.error("Calculation error:", error);
      toast({
        title: "Error",
        description: "Error al encontrar puntos críticos",
        variant: "destructive"
      });
      setCriticalPoints("\\text{Error al encontrar puntos críticos}");
      setClassification("");
    } finally {
      setIsCalculating(false);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-4xl font-bold mb-2 text-foreground">Optimization</h1>
        <p className="text-muted-foreground">Find critical points, maxima, and minima</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Input Function</CardTitle>
            <CardDescription>Enter your function to optimize</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="function">Function f(x,y)</Label>
              <Input
                id="function"
                value={functionInput}
                onChange={(e) => setFunctionInput(e.target.value)}
                placeholder="e.g., x^2 + y^2 - 2*x - 4*y"
              />
            </div>

            <Button onClick={handleCalculate} disabled={isCalculating} className="w-full">
              <Calculator className="mr-2 h-4 w-4" />
              {isCalculating ? "Calculating..." : "Find Critical Points"}
            </Button>
          </CardContent>
        </Card>

        <div className="space-y-6">
          {criticalPoints && (
            <Card>
              <CardHeader>
                <CardTitle>Critical Points</CardTitle>
              </CardHeader>
              <CardContent>
                <MathDisplay math={criticalPoints} />
              </CardContent>
            </Card>
          )}

          {classification && (
            <Card>
              <CardHeader>
                <CardTitle>Classification</CardTitle>
              </CardHeader>
              <CardContent>
                <MathDisplay math={classification} />
              </CardContent>
            </Card>
          )}

          {!criticalPoints && !classification && (
            <Card>
              <CardHeader>
                <CardTitle>Results</CardTitle>
                <CardDescription>Results will appear here</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center py-8">
                  Enter a function and click calculate to see the results
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Optimization;