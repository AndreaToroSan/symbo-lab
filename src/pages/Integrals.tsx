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

const Integrals = () => {
  const [functionInput, setFunctionInput] = useState("x^2+y^2");
  const [integralType, setIntegralType] = useState<"double" | "triple">("double");
  const [xMin, setXMin] = useState("-1");
  const [xMax, setXMax] = useState("1");
  const [yMin, setYMin] = useState("-1");
  const [yMax, setYMax] = useState("1");
  const [zMin, setZMin] = useState("-1");
  const [zMax, setZMax] = useState("1");
  const [result, setResult] = useState<string | null>(null);
  const [setup, setSetup] = useState<string | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const mathInputRef = useRef<MathInputRef>(null);
  const { toast } = useToast();

  const handleCalculate = async () => {
    setIsCalculating(true);
    
    try {
      const bounds = integralType === "double" 
        ? { x: [parseFloat(xMin), parseFloat(xMax)], y: [parseFloat(yMin), parseFloat(yMax)] }
        : { x: [parseFloat(xMin), parseFloat(xMax)], y: [parseFloat(yMin), parseFloat(yMax)], z: [parseFloat(zMin), parseFloat(zMax)] };

      const { data, error } = await supabase.functions.invoke('calculate-integrals', {
        body: { 
          functionText: functionInput,
          integralType,
          bounds
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
        setSetup(null);
      } else {
        setSetup(data.setup);
        setResult(data.result);
        toast({
          title: "Cálculo completado",
          description: "Integral calculada exitosamente"
        });
      }
    } catch (error) {
      console.error("Calculation error:", error);
      toast({
        title: "Error",
        description: "Error al calcular la integral",
        variant: "destructive"
      });
      setResult("\\text{Error al calcular integral}");
      setSetup(null);
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
              <MathInput
                ref={mathInputRef}
                value={functionInput}
                onChange={setFunctionInput}
                placeholder="e.g., x^2 + y^2"
              />
            </div>

            <MathKeyboard onInsert={(latex) => mathInputRef.current?.write(latex)} />

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

        <div className="space-y-6">
          {setup && (
            <Card>
              <CardHeader>
                <CardTitle>Configuración</CardTitle>
                <CardDescription>Integral configurada</CardDescription>
              </CardHeader>
              <CardContent>
                <MathDisplay math={setup} />
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Resultado</CardTitle>
              <CardDescription>Valor de la integral</CardDescription>
            </CardHeader>
            <CardContent>
              {result ? (
                <MathDisplay math={result} />
              ) : (
                <p className="text-muted-foreground text-center py-8">
                  Ingresa una función y haz clic en calcular para ver el resultado
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Integrals;