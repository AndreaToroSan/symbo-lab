import { useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { MathDisplay } from "@/components/MathDisplay";
import { MathInput, MathInputRef } from "@/components/MathInput";
import { MathKeyboard } from "@/components/MathKeyboard";
import { Calculator } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Optimization = () => {
  const [functionInput, setFunctionInput] = useState("x^2+y^2-2x-4y");
  const [constraint, setConstraint] = useState("x+y-1");
  const [useConstraint, setUseConstraint] = useState(false);
  const [criticalPoints, setCriticalPoints] = useState<string | null>(null);
  const [classification, setClassification] = useState<string | null>(null);
  const [lagrangeResult, setLagrangeResult] = useState<any>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const mathInputRef = useRef<MathInputRef>(null);
  const constraintInputRef = useRef<MathInputRef>(null);
  const { toast } = useToast();

  const handleCalculate = async () => {
    setIsCalculating(true);
    setCriticalPoints(null);
    setClassification(null);
    setLagrangeResult(null);
    
    try {
      const body: any = { 
        functionText: functionInput,
        operation: useConstraint ? 'lagrange' : 'unconstrained'
      };
      
      if (useConstraint && constraint) {
        body.constraint = constraint;
      }

      const { data, error } = await supabase.functions.invoke('calculate-optimization', {
        body
      });

      if (error) throw error;

      if (data?.error) {
        toast({
          title: "Error",
          description: data.error,
          variant: "destructive"
        });
      } else {
        if (useConstraint) {
          setLagrangeResult(data);
          toast({
            title: "Cálculo completado",
            description: "Optimización con restricciones completada"
          });
        } else {
          setCriticalPoints(data.criticalPoints);
          setClassification(data.classification);
          toast({
            title: "Cálculo completado",
            description: "Puntos críticos encontrados exitosamente"
          });
        }
      }
    } catch (error) {
      console.error("Calculation error:", error);
      toast({
        title: "Error",
        description: "Error al optimizar",
        variant: "destructive"
      });
    } finally {
      setIsCalculating(false);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-4xl font-bold mb-2 text-foreground">Optimización</h1>
        <p className="text-muted-foreground">Encuentra puntos críticos y optimiza con restricciones usando Multiplicadores de Lagrange</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Función de Entrada</CardTitle>
            <CardDescription>Ingresa tu función a optimizar</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="function">Function f(x,y)</Label>
              <MathInput
                ref={mathInputRef}
                value={functionInput}
                onChange={setFunctionInput}
                placeholder="e.g., x^2 + y^2 - 2*x - 4*y"
              />
            </div>

            <MathKeyboard onInsert={(latex) => mathInputRef.current?.write(latex)} />

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="use-constraint"
                checked={useConstraint}
                onChange={(e) => setUseConstraint(e.target.checked)}
                className="rounded"
              />
              <Label htmlFor="use-constraint">Usar restricción (Multiplicadores de Lagrange)</Label>
            </div>

            {useConstraint && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="constraint">Restricción g(x,y) = 0</Label>
                  <MathInput
                    ref={constraintInputRef}
                    value={constraint}
                    onChange={setConstraint}
                    placeholder="ej: x + y - 1"
                  />
                </div>
                <MathKeyboard onInsert={(latex) => constraintInputRef.current?.write(latex)} />
              </>
            )}

            <Button onClick={handleCalculate} disabled={isCalculating} className="w-full">
              <Calculator className="mr-2 h-4 w-4" />
              {isCalculating ? "Calculando..." : useConstraint ? "Optimizar con Restricción" : "Encontrar Puntos Críticos"}
            </Button>
          </CardContent>
        </Card>

        <div className="space-y-6">
          {criticalPoints && (
            <Card>
              <CardHeader>
                <CardTitle>Puntos Críticos</CardTitle>
              </CardHeader>
              <CardContent>
                <MathDisplay math={criticalPoints} />
              </CardContent>
            </Card>
          )}

          {classification && (
            <Card>
              <CardHeader>
                <CardTitle>Clasificación</CardTitle>
              </CardHeader>
              <CardContent>
                <MathDisplay math={classification} />
              </CardContent>
            </Card>
          )}

          {lagrangeResult && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Sistema de Lagrange</CardTitle>
                </CardHeader>
                <CardContent>
                  <MathDisplay math={lagrangeResult.system} />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Puntos Críticos con Restricción</CardTitle>
                </CardHeader>
                <CardContent>
                  <MathDisplay math={lagrangeResult.points} />
                </CardContent>
              </Card>
              {lagrangeResult.values && (
                <Card>
                  <CardHeader>
                    <CardTitle>Valores de la Función</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <MathDisplay math={lagrangeResult.values} />
                  </CardContent>
                </Card>
              )}
            </>
          )}

          {!criticalPoints && !classification && !lagrangeResult && (
            <Card>
              <CardHeader>
                <CardTitle>Resultados</CardTitle>
                <CardDescription>Los resultados aparecerán aquí</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center py-8">
                  Ingresa una función y haz clic en calcular para ver los resultados
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