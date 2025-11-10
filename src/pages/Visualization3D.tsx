import { useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Plot3DCanvas } from "@/components/Plot3DCanvas";
import { MathKeyboard } from "@/components/MathKeyboard";
import { MathInput, MathInputRef } from "@/components/MathInput";
import { MathDisplay } from "@/components/MathDisplay";
import { Eye, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type VisualizationType = "surface" | "parametric" | "contour" | "vector-field" | "implicit";

const Visualization3D = () => {
  const [functionLatex, setFunctionLatex] = useState("x^2+y^2");
  const [currentFunction, setCurrentFunction] = useState("x**2 + y**2");
  const [currentType, setCurrentType] = useState<VisualizationType>("surface");
  const [detectedType, setDetectedType] = useState<VisualizationType>("surface");
  const { toast } = useToast();
  const mathInputRef = useRef<MathInputRef>(null);

  const latexToPlotly = (latex: string): string => {
    let result = latex
      .replace(/\\cdot/g, '*')
      .replace(/\\left\(/g, '(')
      .replace(/\\right\)/g, ')')
      .replace(/\\left\|/g, 'abs(')
      .replace(/\\right\|/g, ')')
      .replace(/\\sin/g, 'sin')
      .replace(/\\cos/g, 'cos')
      .replace(/\\tan/g, 'tan')
      .replace(/\\ln/g, 'log')
      .replace(/\\log/g, 'log10')
      .replace(/\\exp/g, 'exp')
      .replace(/\\sqrt\{([^}]+)\}/g, 'sqrt($1)')
      .replace(/\\pi/g, 'Math.PI')
      .replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, '(($1)/($2))')
      .replace(/\^(\d)/g, '**$1')
      .replace(/\^\{([^}]+)\}/g, '**($1)')
      .replace(/\s+/g, ' ')
      .trim();
    
    return result;
  };

  // Detecta automáticamente el tipo de visualización basándose en la ecuación
  const detectVisualizationType = (latex: string): VisualizationType => {
    const normalized = latex.toLowerCase().replace(/\s+/g, '');
    
    // Detectar paramétrica: x(t), y(t), z(t) o formato (cos(t), sin(t), t)
    if (normalized.includes('(t)') || 
        (normalized.includes('cos') && normalized.includes('sin') && normalized.includes('t'))) {
      return "parametric";
    }
    
    // Detectar implícita: tiene x, y, z y un signo igual
    if (normalized.includes('x') && normalized.includes('y') && normalized.includes('z') && 
        (normalized.includes('=0') || normalized.includes('=1'))) {
      return "implicit";
    }
    
    // Detectar campo vectorial: formato vectorial (-y, x) o similar
    if (normalized.match(/\(-?[xy],\s*-?[xy]\)/)) {
      return "vector-field";
    }
    
    // Default: superficie z = f(x,y)
    return "surface";
  };

  const handleInsertSymbol = (latex: string) => {
    if (mathInputRef.current) {
      mathInputRef.current.write(latex);
    }
  };

  const handleVisualize = () => {
    const type = detectVisualizationType(functionLatex);
    setDetectedType(type);
    
    const plotlyFunction = latexToPlotly(functionLatex);
    setCurrentFunction(plotlyFunction);
    setCurrentType(type);
    
    const typeNames: Record<VisualizationType, string> = {
      "surface": "Superficie z = f(x,y)",
      "parametric": "Curva Paramétrica 3D",
      "contour": "Curvas de Nivel",
      "vector-field": "Campo Vectorial",
      "implicit": "Superficie Implícita"
    };
    
    toast({
      title: "Visualización actualizada",
      description: `Detectado: ${typeNames[type]}`,
    });
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-4xl font-bold mb-2 text-foreground">Visualización 3D</h1>
        <p className="text-muted-foreground">El sistema detecta automáticamente el tipo de visualización según tu ecuación</p>
      </div>

      <Card className="border-primary/20 bg-muted/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5 text-primary" />
            Tipos de Visualización Automática
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant="outline">Superficie</Badge>
              <span>z = f(x,y), ejemplo:</span>
            </div>
            <MathDisplay math="x^2 + y^2" displayMode={false} />
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant="outline">Paramétrica</Badge>
              <span>ejemplo:</span>
            </div>
            <MathDisplay math="(\cos(t), \sin(t), t)" displayMode={false} />
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant="outline">Implícita</Badge>
              <span>F(x,y,z) = c, ejemplo:</span>
            </div>
            <MathDisplay math="x^2 + y^2 + z^2 = 1" displayMode={false} />
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant="outline">Campo Vectorial</Badge>
              <span>ejemplo:</span>
            </div>
            <MathDisplay math="(-y, x)" displayMode={false} />
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Ingresa tu Función</CardTitle>
            <CardDescription className="space-y-1">
              {detectedType === "surface" && (
                <div>Detectado: Superficie <MathDisplay math="z = f(x,y)" displayMode={false} /></div>
              )}
              {detectedType === "parametric" && (
                <div>Detectado: Curva Paramétrica 3D</div>
              )}
              {detectedType === "implicit" && (
                <div>Detectado: Superficie Implícita <MathDisplay math="F(x,y,z) = 0" displayMode={false} /></div>
              )}
              {detectedType === "vector-field" && (
                <div>Detectado: Campo Vectorial</div>
              )}
              {detectedType === "contour" && (
                <div>Detectado: Curvas de Nivel</div>
              )}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Ecuación o Función</Label>
              <MathInput
                ref={mathInputRef}
                value={functionLatex}
                onChange={setFunctionLatex}
                placeholder="x^2 + y^2"
              />
              <div className="text-xs text-muted-foreground space-y-1">
                <p>Ejemplos:</p>
                <div className="pl-2 space-y-1">
                  <MathDisplay math="x^2+y^2" displayMode={false} />
                  <MathDisplay math="(\cos(t), \sin(t), t)" displayMode={false} />
                  <MathDisplay math="x^2+y^2+z^2=1" displayMode={false} />
                </div>
              </div>
            </div>

            <MathKeyboard onInsert={handleInsertSymbol} />

            <Button onClick={handleVisualize} className="w-full">
              <Eye className="mr-2 h-4 w-4" />
              Visualizar
            </Button>
          </CardContent>
        </Card>

        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Visualización 3D Interactiva</CardTitle>
              <CardDescription className="space-y-1">
                {currentType === "surface" && (
                  <div>Superficie: <MathDisplay math="z = f(x,y)" displayMode={false} /></div>
                )}
                {currentType === "parametric" && (
                  <div>Curva Paramétrica 3D: <MathDisplay math="\mathbf{r}(t) = (x(t), y(t), z(t))" displayMode={false} /></div>
                )}
                {currentType === "implicit" && (
                  <div>Superficie Implícita: <MathDisplay math="F(x,y,z) = 0" displayMode={false} /></div>
                )}
                {currentType === "vector-field" && (
                  <div>Campo Vectorial 2D: <MathDisplay math="\mathbf{F}(x,y) = (P(x,y), Q(x,y))" displayMode={false} /></div>
                )}
                {currentType === "contour" && (
                  <div>Curvas de Nivel: <MathDisplay math="f(x,y) = k" displayMode={false} /></div>
                )}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Plot3DCanvas
                formula={currentFunction}
                xRange={[-5, 5]}
                yRange={[-5, 5]}
                tRange={[0, 6.28]}
                visualizationType={currentType}
              />
              <p className="text-xs text-muted-foreground mt-4 text-center">
                Arrastra para rotar • Rueda para zoom • Click derecho para mover
              </p>
            </CardContent>
          </Card>

          {currentType === "surface" && (
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="h-5 w-5 text-primary" />
                  Análisis de la Función
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2 text-sm">Intersecciones con los Planos Coordenados</h4>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-start gap-2">
                      <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20 shrink-0">x = 0</Badge>
                      <p>Intersección con el plano YZ (línea roja). Muestra el perfil de la función cuando x es cero.</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <Badge variant="outline" className="bg-teal-500/10 text-teal-500 border-teal-500/20 shrink-0">y = 0</Badge>
                      <p>Intersección con el plano XZ (línea turquesa). Muestra el perfil de la función cuando y es cero.</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20 shrink-0">z = 0</Badge>
                      <p>Intersección con el plano XY (línea verde). Puntos donde la función toca el plano base.</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2 text-sm">Curvas de Nivel</h4>
                  <p className="text-sm text-muted-foreground">
                    Las líneas de colores sobre la superficie representan curvas donde la función mantiene un valor constante. 
                    Son útiles para visualizar cómo cambia la pendiente y encontrar máximos, mínimos o puntos de silla.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold mb-2 text-sm">Interpretación Geométrica</h4>
                  <p className="text-sm text-muted-foreground">
                    La superficie coloreada muestra los valores de z = f(x,y). Los colores van del azul (valores bajos) 
                    al rojo (valores altos), ayudando a identificar regiones de la función.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Visualization3D;