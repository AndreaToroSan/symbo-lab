import { useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { MathKeyboard } from "@/components/MathKeyboard";
import { MathInput, MathInputRef } from "@/components/MathInput";
import { MathDisplay } from "@/components/MathDisplay";
import { Plot3DCanvas } from "@/components/Plot3DCanvas";
import { supabase } from "@/integrations/supabase/client";
import { Calculator, Loader2, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface QuadricClassification {
  type: string;
  canonical_form: string;
  characteristics: string[];
  parameters: {
    a: number | null;
    b: number | null;
    c: number | null;
  };
  description: string;
  center: string;
  axes: string;
}

const QuadricSurfaces = () => {
  const [equation, setEquation] = useState("");
  const [isClassifying, setIsClassifying] = useState(false);
  const [classification, setClassification] = useState<QuadricClassification | null>(null);
  const { toast } = useToast();
  const mathInputRef = useRef<MathInputRef>(null);

  const handleInsertSymbol = (latex: string) => {
    if (mathInputRef.current) {
      mathInputRef.current.write(latex);
    }
  };

  const handleClassify = async () => {
    if (!equation.trim()) {
      toast({
        title: "Error",
        description: "Por favor ingresa una ecuación.",
        variant: "destructive",
      });
      return;
    }

    setIsClassifying(true);
    setClassification(null);

    try {
      const { data: functionData, error: functionError } = await supabase.functions.invoke(
        'classify-quadric-surface',
        { body: { equation } }
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

      setClassification(functionData.classification);
      toast({
        title: "Clasificación completada",
        description: `Superficie identificada: ${functionData.classification.type}`,
      });
    } catch (error) {
      console.error("Error classifying:", error);
      toast({
        title: "Error",
        description: "Hubo un error al clasificar la superficie. Verifica la ecuación.",
        variant: "destructive",
      });
    } finally {
      setIsClassifying(false);
    }
  };

  // Convert classification to formula for visualization
  const getVisualizationFormula = (): string => {
    if (!classification) return "x**2 + y**2";
    
    const type = classification.type.toLowerCase();
    if (type.includes("elipsoide")) {
      return "(x**2 + y**2 + (z**2)*0.5)**0.5";
    } else if (type.includes("hiperboloide de una hoja")) {
      return "(x**2 + y**2 - z**2 + 1)**0.5";
    } else if (type.includes("paraboloide elíptico")) {
      return "x**2 + y**2";
    } else if (type.includes("paraboloide hiperbólico") || type.includes("silla")) {
      return "x**2 - y**2";
    } else if (type.includes("cono")) {
      return "(x**2 + y**2)**0.5";
    }
    return "x**2 + y**2";
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-4xl font-bold mb-2 text-foreground">Superficies Cuádricas</h1>
        <p className="text-muted-foreground">
          Identificación y clasificación automática de superficies cuádricas
        </p>
      </div>

      <Card className="border-primary/20 bg-muted/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5 text-primary" />
            Tabla de Identificación Rápida
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div><Badge variant="outline">Elipsoide</Badge>: Todos términos cuadrados positivos</div>
            <div><Badge variant="outline">Hiperboloide 1 hoja</Badge>: Un término negativo</div>
            <div><Badge variant="outline">Hiperboloide 2 hojas</Badge>: Dos términos negativos</div>
            <div><Badge variant="outline">Paraboloide elíptico</Badge>: Variable sola, términos +</div>
            <div><Badge variant="outline">Paraboloide hiperbólico</Badge>: Un + y un -</div>
            <div><Badge variant="outline">Cono cuádrico</Badge>: = 0, con un negativo</div>
            <div><Badge variant="outline">Cilindro elíptico</Badge>: Solo x,y sin z</div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Ingresa la Ecuación</CardTitle>
            <CardDescription>Escribe la ecuación de la superficie cuádrica</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Ecuación</Label>
              <MathInput
                ref={mathInputRef}
                value={equation}
                onChange={setEquation}
                placeholder="x^2/4 + y^2/9 + z^2/16 = 1"
              />
            </div>

            <MathKeyboard onInsert={handleInsertSymbol} />

            <Button 
              onClick={handleClassify}
              disabled={isClassifying || !equation}
              className="w-full"
            >
              {isClassifying ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Calculator className="mr-2 h-4 w-4" />
              )}
              Clasificar Superficie
            </Button>
          </CardContent>
        </Card>

        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Clasificación</CardTitle>
              <CardDescription>Tipo y características de la superficie</CardDescription>
            </CardHeader>
            <CardContent>
              {isClassifying ? (
                <div className="flex items-center justify-center p-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : classification ? (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Tipo de Superficie</h3>
                    <Badge variant="default" className="text-base px-4 py-2">
                      {classification.type}
                    </Badge>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2">Forma Canónica</h3>
                    <MathDisplay math={classification.canonical_form} displayMode={true} />
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2">Características</h3>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                      {classification.characteristics.map((char, idx) => (
                        <li key={idx}>{char}</li>
                      ))}
                    </ul>
                  </div>

                  {classification.parameters.a && (
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Parámetros</h3>
                      <div className="flex gap-4">
                        {classification.parameters.a && (
                          <Badge variant="secondary">a = {classification.parameters.a}</Badge>
                        )}
                        {classification.parameters.b && (
                          <Badge variant="secondary">b = {classification.parameters.b}</Badge>
                        )}
                        {classification.parameters.c && (
                          <Badge variant="secondary">c = {classification.parameters.c}</Badge>
                        )}
                      </div>
                    </div>
                  )}

                  <div>
                    <h3 className="text-lg font-semibold mb-2">Descripción</h3>
                    <MathDisplay math={classification.description} displayMode={false} />
                  </div>

                  {classification.center && (
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Centro</h3>
                      <p className="text-muted-foreground">{classification.center}</p>
                    </div>
                  )}

                  {classification.axes && (
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Ejes</h3>
                      <p className="text-muted-foreground">{classification.axes}</p>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center p-8">
                  Ingresa una ecuación y presiona "Clasificar" para ver los resultados
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Visualización 3D</CardTitle>
              <CardDescription>Representación interactiva de la superficie</CardDescription>
            </CardHeader>
            <CardContent>
              <Plot3DCanvas
                formula={getVisualizationFormula()}
                xRange={[-3, 3]}
                yRange={[-3, 3]}
                visualizationType="surface"
              />
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

export default QuadricSurfaces;
