import { useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MathDisplay } from "@/components/MathDisplay";
import { MathInput, MathInputRef } from "@/components/MathInput";
import { MathKeyboard } from "@/components/MathKeyboard";
import { Calculator } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Derivatives = () => {
  const [functionInput, setFunctionInput] = useState("x^2y+y^3");
  const [variable, setVariable] = useState("x");
  const [pointX, setPointX] = useState("1");
  const [pointY, setPointY] = useState("2");
  const [result, setResult] = useState<string | null>(null);
  const [gradient, setGradient] = useState<any>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const mathInputRef = useRef<MathInputRef>(null);
  const { toast } = useToast();

  const handleCalculate = async () => {
    setIsCalculating(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('calculate-derivatives', {
        body: { 
          operation: 'partial',
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
        setResult(data.result);
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

  const handleCalculateGradient = async () => {
    setIsCalculating(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('calculate-derivatives', {
        body: { 
          operation: 'gradient',
          functionText: functionInput,
          point: { x: parseFloat(pointX), y: parseFloat(pointY) }
        }
      });

      if (error) throw error;

      if (data?.error) {
        toast({
          title: "Error",
          description: data.error,
          variant: "destructive"
        });
        setGradient(null);
      } else {
        setGradient(data);
        toast({
          title: "Cálculo completado",
          description: "Gradiente calculado exitosamente"
        });
      }
    } catch (error) {
      console.error("Calculation error:", error);
      toast({
        title: "Error",
        description: "Error al calcular el gradiente",
        variant: "destructive"
      });
      setGradient(null);
    } finally {
      setIsCalculating(false);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-4xl font-bold mb-2 text-foreground">Derivadas y Gradientes</h1>
        <p className="text-muted-foreground">Calcula derivadas parciales y gradientes de funciones multivariables</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Derivadas Parciales</CardTitle>
              <CardDescription>Calcula ∂f/∂x o ∂f/∂y</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="function">Function f(x,y)</Label>
                <MathInput
                  ref={mathInputRef}
                  value={functionInput}
                  onChange={setFunctionInput}
                  placeholder="e.g., x^2 * y + y^3"
                />
              </div>

              <MathKeyboard onInsert={(latex) => mathInputRef.current?.write(latex)} />

                <div className="space-y-2">
                  <Label htmlFor="variable">Derivar con respecto a</Label>
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
                  {isCalculating ? "Calculando..." : "Calcular Derivada"}
                </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Vector Gradiente</CardTitle>
              <CardDescription>Calcula ∇f en un punto específico</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Usa la misma función que Derivadas Parciales
              </p>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="point-x">Punto x</Label>
                  <Input
                    id="point-x"
                    value={pointX}
                    onChange={(e) => setPointX(e.target.value)}
                    placeholder="1"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="point-y">Punto y</Label>
                  <Input
                    id="point-y"
                    value={pointY}
                    onChange={(e) => setPointY(e.target.value)}
                    placeholder="2"
                  />
                </div>
              </div>

              <Button onClick={handleCalculateGradient} disabled={isCalculating} className="w-full">
                <Calculator className="mr-2 h-4 w-4" />
                {isCalculating ? "Calculando..." : "Calcular Gradiente"}
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {result && (
            <Card>
              <CardHeader>
                <CardTitle>Derivada Parcial ∂f/∂{variable}</CardTitle>
              </CardHeader>
              <CardContent>
                <MathDisplay math={result} />
              </CardContent>
            </Card>
          )}

          {gradient && (
            <Card>
              <CardHeader>
                <CardTitle>Gradiente en ({pointX}, {pointY})</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium mb-2">Vector Gradiente</h3>
                  <MathDisplay math={gradient.vector} />
                </div>
                <div>
                  <h3 className="text-sm font-medium mb-2">Magnitud</h3>
                  <MathDisplay math={gradient.magnitude} />
                </div>
                {gradient.direction && (
                  <div>
                    <h3 className="text-sm font-medium mb-2">Dirección de Máximo Crecimiento</h3>
                    <MathDisplay math={gradient.direction} />
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {!result && !gradient && (
            <Card>
              <CardHeader>
                <CardTitle>Resultados</CardTitle>
                <CardDescription>Los resultados aparecerán aquí</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center py-8">
                  Calcula una derivada o gradiente para ver los resultados
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Derivatives;