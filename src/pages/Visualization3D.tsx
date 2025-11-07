import { useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Plot3DCanvas } from "@/components/Plot3DCanvas";
import { MathKeyboard } from "@/components/MathKeyboard";
import { RefreshCw, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Visualization3D = () => {
  const [functionInput, setFunctionInput] = useState("x**2 + y**2");
  const [xMin, setXMin] = useState("-3");
  const [xMax, setXMax] = useState("3");
  const [yMin, setYMin] = useState("-3");
  const [yMax, setYMax] = useState("3");
  const [currentFunction, setCurrentFunction] = useState("x**2 + y**2");
  const { toast } = useToast();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleInsertSymbol = (symbol: string) => {
    if (inputRef.current) {
      const start = inputRef.current.selectionStart || 0;
      const end = inputRef.current.selectionEnd || 0;
      const newValue = functionInput.slice(0, start) + symbol + functionInput.slice(end);
      setFunctionInput(newValue);
      
      // Set cursor position after inserted symbol
      setTimeout(() => {
        if (inputRef.current) {
          const newPosition = start + symbol.length;
          inputRef.current.focus();
          inputRef.current.setSelectionRange(newPosition, newPosition);
        }
      }, 0);
    } else {
      setFunctionInput(functionInput + symbol);
    }
  };

  const handleVisualize = () => {
    setCurrentFunction(functionInput);
  };

  const handleSave = async () => {
    // TODO: Implement Supabase save functionality
    toast({
      title: "Function saved",
      description: "Your function has been saved to favorites.",
    });
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-4xl font-bold mb-2 text-foreground">3D Visualization</h1>
        <p className="text-muted-foreground">Visualize functions of two variables z = f(x, y)</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Function Input</CardTitle>
            <CardDescription>Enter your function and ranges</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="function">Function z = f(x,y)</Label>
              <Input
                ref={inputRef}
                id="function"
                value={functionInput}
                onChange={(e) => setFunctionInput(e.target.value)}
                placeholder="e.g., x**2 + y**2"
              />
              <p className="text-xs text-muted-foreground">
                Usa el teclado matemático o escribe directamente
              </p>
            </div>

            <MathKeyboard onInsert={handleInsertSymbol} />

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="xMin">x min</Label>
                <Input
                  id="xMin"
                  type="number"
                  value={xMin}
                  onChange={(e) => setXMin(e.target.value)}
                  placeholder="-3"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="xMax">x max</Label>
                <Input
                  id="xMax"
                  type="number"
                  value={xMax}
                  onChange={(e) => setXMax(e.target.value)}
                  placeholder="3"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="yMin">y min</Label>
                <Input
                  id="yMin"
                  type="number"
                  value={yMin}
                  onChange={(e) => setYMin(e.target.value)}
                  placeholder="-3"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="yMax">y max</Label>
                <Input
                  id="yMax"
                  type="number"
                  value={yMax}
                  onChange={(e) => setYMax(e.target.value)}
                  placeholder="3"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleVisualize} className="flex-1">
                <RefreshCw className="mr-2 h-4 w-4" />
                Visualize
              </Button>
              <Button onClick={handleSave} variant="outline">
                <Save className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>3D Plot</CardTitle>
            <CardDescription>Interactive 3D visualization</CardDescription>
          </CardHeader>
          <CardContent>
            <Plot3DCanvas
              formula={currentFunction}
              xRange={[parseFloat(xMin), parseFloat(xMax)]}
              yRange={[parseFloat(yMin), parseFloat(yMax)]}
            />
            <p className="text-xs text-muted-foreground mt-4 text-center">
              Click and drag to rotate • Scroll to zoom • Right-click to pan
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Visualization3D;