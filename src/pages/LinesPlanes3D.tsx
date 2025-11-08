import { useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MathKeyboard } from "@/components/MathKeyboard";
import { MathInput, MathInputRef } from "@/components/MathInput";
import { MathDisplay } from "@/components/MathDisplay";
import { LinesPlanes3DCanvas } from "@/components/LinesPlanes3DCanvas";
import { supabase } from "@/integrations/supabase/client";
import { Calculator, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const LinesPlanes3D = () => {
  const [activeTab, setActiveTab] = useState("intersections");
  const [isCalculating, setIsCalculating] = useState(false);
  const [result, setResult] = useState("");
  const { toast } = useToast();

  // Refs for intersections
  const lineInput1Ref = useRef<MathInputRef>(null);
  const lineInput2Ref = useRef<MathInputRef>(null);
  const planeInput1Ref = useRef<MathInputRef>(null);
  const planeInput2Ref = useRef<MathInputRef>(null);

  // Refs for angles
  const angleLineInput1Ref = useRef<MathInputRef>(null);
  const angleLineInput2Ref = useRef<MathInputRef>(null);
  const anglePlaneInput1Ref = useRef<MathInputRef>(null);
  const anglePlaneInput2Ref = useRef<MathInputRef>(null);
  const linePlaneAngleLineRef = useRef<MathInputRef>(null);
  const linePlaneAnglePlaneRef = useRef<MathInputRef>(null);

  // Refs for distances
  const distPointRef = useRef<MathInputRef>(null);
  const distLineRef = useRef<MathInputRef>(null);
  const distPlaneRef = useRef<MathInputRef>(null);
  const distLine1Ref = useRef<MathInputRef>(null);
  const distLine2Ref = useRef<MathInputRef>(null);

  // State for inputs
  const [line1, setLine1] = useState("");
  const [line2, setLine2] = useState("");
  const [plane1, setPlane1] = useState("");
  const [plane2, setPlane2] = useState("");
  const [point, setPoint] = useState("");

  const handleInsertSymbol = (latex: string, refName: string) => {
    const refs: { [key: string]: React.RefObject<MathInputRef> } = {
      line1: lineInput1Ref,
      line2: lineInput2Ref,
      plane1: planeInput1Ref,
      plane2: planeInput2Ref,
      angleLine1: angleLineInput1Ref,
      angleLine2: angleLineInput2Ref,
      anglePlane1: anglePlaneInput1Ref,
      anglePlane2: anglePlaneInput2Ref,
      linePlaneAngleLine: linePlaneAngleLineRef,
      linePlaneAnglePlane: linePlaneAnglePlaneRef,
      distPoint: distPointRef,
      distLine: distLineRef,
      distPlane: distPlaneRef,
      distLine1: distLine1Ref,
      distLine2: distLine2Ref,
    };
    
    if (refs[refName]?.current) {
      refs[refName].current!.write(latex);
    }
  };

  const handleCalculate = async (type: string, data: any) => {
    setIsCalculating(true);
    setResult("");

    try {
      const { data: functionData, error: functionError } = await supabase.functions.invoke(
        'calculate-lines-planes',
        { body: { type, data } }
      );

      if (functionError) throw functionError;

      if (functionData?.error) {
        if (functionData.error === "Rate limit exceeded") {
          toast({
            title: "Rate limit excedido",
            description: "Por favor espera un momento antes de intentar de nuevo.",
            variant: "destructive",
          });
        } else if (functionData.error === "Payment required") {
          toast({
            title: "Créditos agotados",
            description: "Por favor agrega créditos a tu cuenta de Lovable AI.",
            variant: "destructive",
          });
        } else {
          throw new Error(functionData.error);
        }
        return;
      }

      setResult(functionData.result);
      toast({
        title: "Cálculo completado",
        description: "El resultado se muestra a continuación.",
      });
    } catch (error) {
      console.error("Error calculating:", error);
      toast({
        title: "Error",
        description: "Hubo un error al calcular. Por favor verifica tus entradas.",
        variant: "destructive",
      });
    } finally {
      setIsCalculating(false);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-4xl font-bold mb-2 text-foreground">Rectas y Planos en 3D</h1>
        <p className="text-muted-foreground">
          Cálculo de intersecciones, ángulos, distancias y visualización interactiva
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Cálculos Vectoriales</CardTitle>
            <CardDescription>Selecciona el tipo de cálculo que deseas realizar</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="intersections">Intersecciones</TabsTrigger>
                <TabsTrigger value="angles">Ángulos</TabsTrigger>
                <TabsTrigger value="distances">Distancias</TabsTrigger>
              </TabsList>

              <TabsContent value="intersections" className="space-y-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Recta - Plano</Label>
                    <div className="space-y-2">
                      <MathInput
                        ref={lineInput1Ref}
                        value={line1}
                        onChange={setLine1}
                        placeholder="P = (x_0, y_0, z_0) + t(a, b, c)"
                      />
                      <MathInput
                        ref={planeInput1Ref}
                        value={plane1}
                        onChange={setPlane1}
                        placeholder="Ax + By + Cz + D = 0"
                      />
                      <Button 
                        onClick={() => handleCalculate("line-plane-intersection", { line: line1, plane: plane1 })}
                        disabled={isCalculating || !line1 || !plane1}
                        className="w-full"
                      >
                        {isCalculating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Calculator className="mr-2 h-4 w-4" />}
                        Calcular Intersección Recta-Plano
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Recta - Recta</Label>
                    <div className="space-y-2">
                      <MathInput
                        ref={lineInput1Ref}
                        value={line1}
                        onChange={setLine1}
                        placeholder="Recta 1"
                      />
                      <MathInput
                        ref={lineInput2Ref}
                        value={line2}
                        onChange={setLine2}
                        placeholder="Recta 2"
                      />
                      <Button 
                        onClick={() => handleCalculate("line-line-intersection", { line1, line2 })}
                        disabled={isCalculating || !line1 || !line2}
                        className="w-full"
                      >
                        {isCalculating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Calculator className="mr-2 h-4 w-4" />}
                        Calcular Intersección Recta-Recta
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Plano - Plano</Label>
                    <div className="space-y-2">
                      <MathInput
                        ref={planeInput1Ref}
                        value={plane1}
                        onChange={setPlane1}
                        placeholder="Plano 1"
                      />
                      <MathInput
                        ref={planeInput2Ref}
                        value={plane2}
                        onChange={setPlane2}
                        placeholder="Plano 2"
                      />
                      <Button 
                        onClick={() => handleCalculate("plane-plane-intersection", { plane1, plane2 })}
                        disabled={isCalculating || !plane1 || !plane2}
                        className="w-full"
                      >
                        {isCalculating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Calculator className="mr-2 h-4 w-4" />}
                        Calcular Intersección Plano-Plano
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="angles" className="space-y-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Ángulo entre Rectas</Label>
                    <div className="space-y-2">
                      <MathInput
                        ref={angleLineInput1Ref}
                        value={line1}
                        onChange={setLine1}
                        placeholder="Recta 1"
                      />
                      <MathInput
                        ref={angleLineInput2Ref}
                        value={line2}
                        onChange={setLine2}
                        placeholder="Recta 2"
                      />
                      <Button 
                        onClick={() => handleCalculate("angle-between-lines", { line1, line2 })}
                        disabled={isCalculating || !line1 || !line2}
                        className="w-full"
                      >
                        {isCalculating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Calculator className="mr-2 h-4 w-4" />}
                        Calcular Ángulo
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Ángulo entre Planos</Label>
                    <div className="space-y-2">
                      <MathInput
                        ref={anglePlaneInput1Ref}
                        value={plane1}
                        onChange={setPlane1}
                        placeholder="Plano 1"
                      />
                      <MathInput
                        ref={anglePlaneInput2Ref}
                        value={plane2}
                        onChange={setPlane2}
                        placeholder="Plano 2"
                      />
                      <Button 
                        onClick={() => handleCalculate("angle-between-planes", { plane1, plane2 })}
                        disabled={isCalculating || !plane1 || !plane2}
                        className="w-full"
                      >
                        {isCalculating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Calculator className="mr-2 h-4 w-4" />}
                        Calcular Ángulo
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Ángulo Recta-Plano</Label>
                    <div className="space-y-2">
                      <MathInput
                        ref={linePlaneAngleLineRef}
                        value={line1}
                        onChange={setLine1}
                        placeholder="Recta"
                      />
                      <MathInput
                        ref={linePlaneAnglePlaneRef}
                        value={plane1}
                        onChange={setPlane1}
                        placeholder="Plano"
                      />
                      <Button 
                        onClick={() => handleCalculate("angle-line-plane", { line: line1, plane: plane1 })}
                        disabled={isCalculating || !line1 || !plane1}
                        className="w-full"
                      >
                        {isCalculating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Calculator className="mr-2 h-4 w-4" />}
                        Calcular Ángulo
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="distances" className="space-y-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Distancia Punto-Recta</Label>
                    <div className="space-y-2">
                      <MathInput
                        ref={distPointRef}
                        value={point}
                        onChange={setPoint}
                        placeholder="Punto (x, y, z)"
                      />
                      <MathInput
                        ref={distLineRef}
                        value={line1}
                        onChange={setLine1}
                        placeholder="Recta"
                      />
                      <Button 
                        onClick={() => handleCalculate("distance-point-line", { point, line: line1 })}
                        disabled={isCalculating || !point || !line1}
                        className="w-full"
                      >
                        {isCalculating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Calculator className="mr-2 h-4 w-4" />}
                        Calcular Distancia
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Distancia Punto-Plano</Label>
                    <div className="space-y-2">
                      <MathInput
                        ref={distPointRef}
                        value={point}
                        onChange={setPoint}
                        placeholder="Punto (x, y, z)"
                      />
                      <MathInput
                        ref={distPlaneRef}
                        value={plane1}
                        onChange={setPlane1}
                        placeholder="Plano"
                      />
                      <Button 
                        onClick={() => handleCalculate("distance-point-plane", { point, plane: plane1 })}
                        disabled={isCalculating || !point || !plane1}
                        className="w-full"
                      >
                        {isCalculating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Calculator className="mr-2 h-4 w-4" />}
                        Calcular Distancia
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Distancia entre Rectas Alabeadas</Label>
                    <div className="space-y-2">
                      <MathInput
                        ref={distLine1Ref}
                        value={line1}
                        onChange={setLine1}
                        placeholder="Recta 1"
                      />
                      <MathInput
                        ref={distLine2Ref}
                        value={line2}
                        onChange={setLine2}
                        placeholder="Recta 2"
                      />
                      <Button 
                        onClick={() => handleCalculate("distance-line-line", { line1, line2 })}
                        disabled={isCalculating || !line1 || !line2}
                        className="w-full"
                      >
                        {isCalculating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Calculator className="mr-2 h-4 w-4" />}
                        Calcular Distancia
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <div className="mt-4">
              <MathKeyboard 
                onInsert={(latex) => {
                  // Insert to the most recently focused input in the active tab
                  if (activeTab === "intersections") {
                    handleInsertSymbol(latex, "line1");
                  } else if (activeTab === "angles") {
                    handleInsertSymbol(latex, "angleLine1");
                  } else {
                    handleInsertSymbol(latex, "distPoint");
                  }
                }} 
              />
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Resultado</CardTitle>
              <CardDescription>Solución del cálculo</CardDescription>
            </CardHeader>
            <CardContent>
              {isCalculating ? (
                <div className="flex items-center justify-center p-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : result ? (
                <MathDisplay math={result} />
              ) : (
                <p className="text-sm text-muted-foreground text-center p-8">
                  Ingresa los datos y presiona calcular para ver el resultado
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Visualización 3D</CardTitle>
              <CardDescription>Vista interactiva</CardDescription>
            </CardHeader>
            <CardContent>
              <LinesPlanes3DCanvas />
              <p className="text-xs text-muted-foreground mt-4 text-center">
                Arrastra para rotar • Rueda para zoom
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LinesPlanes3D;
