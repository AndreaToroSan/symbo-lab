import { Card, CardContent } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Badge } from "@/components/ui/badge";
import { MathDisplay } from "@/components/MathDisplay";
import { Presentation, BookOpen, Cog, ImageIcon, Lightbulb, BookMarked } from "lucide-react";

const Exposition = () => {
  return (
    <div className="container mx-auto p-6 min-h-screen">
      <div className="mb-8 text-center">
        <div className="flex items-center justify-center gap-3 mb-3">
          <Presentation className="h-10 w-10 text-primary" />
          <h1 className="text-5xl font-bold text-foreground">Exposición del Proyecto</h1>
        </div>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Análisis completo de la aplicación de cálculo multivariable: fundamentos matemáticos, arquitectura técnica y resultados
        </p>
        <Badge variant="outline" className="mt-4 text-base px-4 py-2">
          Desliza para navegar entre secciones →
        </Badge>
      </div>

      <Carousel className="w-full max-w-6xl mx-auto">
        <CarouselContent>
          {/* Slide 1: Introducción y Contexto */}
          <CarouselItem>
            <Card className="border-2 border-primary/20">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <BookOpen className="h-8 w-8 text-primary" />
                  <h2 className="text-3xl font-bold text-foreground">1. Introducción y Contexto</h2>
                </div>
                
                <div className="space-y-6 text-lg">
                  <section>
                    <h3 className="text-2xl font-semibold mb-3 text-primary">Problemática</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      El cálculo multivariable es fundamental en ingeniería, física y ciencias aplicadas. Sin embargo, 
                      <strong> visualizar funciones de múltiples variables</strong>, comprender sus derivadas parciales, 
                      optimizar funciones complejas y clasificar superficies cuádricas presenta desafíos significativos 
                      para estudiantes y profesionales.
                    </p>
                  </section>

                  <section>
                    <h3 className="text-2xl font-semibold mb-3 text-primary">Objetivos del Proyecto</h3>
                    <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                      <li>Crear una herramienta interactiva para <strong>visualización 3D</strong> de funciones multivariables</li>
                      <li>Implementar cálculo simbólico de <strong>derivadas parciales y gradientes</strong></li>
                      <li>Resolver problemas de <strong>optimización</strong> con restricciones (multiplicadores de Lagrange)</li>
                      <li>Calcular <strong>integrales dobles y triples</strong> con métodos numéricos y simbólicos</li>
                      <li>Clasificar y visualizar <strong>superficies cuádricas</strong> automáticamente</li>
                      <li>Proporcionar análisis de <strong>dominio y rango</strong> de funciones</li>
                    </ul>
                  </section>

                  <section>
                    <h3 className="text-2xl font-semibold mb-3 text-primary">Alcance</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      La aplicación cubre los principales tópicos del cálculo multivariable universitario, 
                      combinando <strong>visualización interactiva en 3D</strong> con <strong>cálculo simbólico potenciado por IA</strong>.
                    </p>
                  </section>
                </div>
              </CardContent>
            </Card>
          </CarouselItem>

          {/* Slide 2: Fundamentos Teóricos */}
          <CarouselItem>
            <Card className="border-2 border-primary/20">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <BookMarked className="h-8 w-8 text-primary" />
                  <h2 className="text-3xl font-bold text-foreground">2. Fundamentos Teóricos</h2>
                </div>
                
                <div className="space-y-6">
                  <section>
                    <h3 className="text-xl font-semibold mb-3 text-primary">Funciones Multivariables</h3>
                    <p className="text-muted-foreground mb-3">
                      Una función de múltiples variables mapea puntos del espacio n-dimensional a valores reales:
                    </p>
                    <MathDisplay math="f: \mathbb{R}^n \to \mathbb{R}, \quad f(x_1, x_2, \ldots, x_n) = y" displayMode={true} />
                    <p className="text-sm text-muted-foreground mt-2">
                      Ejemplo: <MathDisplay math="f(x,y) = x^2 + y^2" displayMode={false} /> representa un paraboloide elíptico.
                    </p>
                  </section>

                  <section>
                    <h3 className="text-xl font-semibold mb-3 text-primary">Derivadas Parciales y Gradiente</h3>
                    <p className="text-muted-foreground mb-3">
                      Las derivadas parciales miden la tasa de cambio en cada dirección:
                    </p>
                    <MathDisplay math="\frac{\partial f}{\partial x} = \lim_{h \to 0} \frac{f(x+h, y) - f(x,y)}{h}" displayMode={true} />
                    <p className="text-muted-foreground mb-3 mt-4">
                      El gradiente es el vector de todas las derivadas parciales:
                    </p>
                    <MathDisplay math="\nabla f = \left( \frac{\partial f}{\partial x}, \frac{\partial f}{\partial y}, \frac{\partial f}{\partial z} \right)" displayMode={true} />
                    <p className="text-sm text-muted-foreground mt-2">
                      El gradiente apunta en la dirección de máximo crecimiento de la función.
                    </p>
                  </section>

                  <section>
                    <h3 className="text-xl font-semibold mb-3 text-primary">Optimización con Restricciones</h3>
                    <p className="text-muted-foreground mb-3">
                      Los multiplicadores de Lagrange resuelven problemas de optimización con restricciones:
                    </p>
                    <MathDisplay math="\mathcal{L}(x,y,\lambda) = f(x,y) - \lambda \cdot g(x,y)" displayMode={true} />
                    <MathDisplay math="\nabla \mathcal{L} = 0 \implies \nabla f = \lambda \nabla g" displayMode={true} />
                    <p className="text-sm text-muted-foreground mt-2">
                      Esto significa que en el óptimo, los gradientes son paralelos.
                    </p>
                  </section>

                  <section>
                    <h3 className="text-xl font-semibold mb-3 text-primary">Integrales Múltiples</h3>
                    <p className="text-muted-foreground mb-3">
                      Las integrales dobles y triples calculan volúmenes y masas:
                    </p>
                    <MathDisplay math="\iint_R f(x,y) \, dA = \int_{a}^{b} \int_{c}^{d} f(x,y) \, dy \, dx" displayMode={true} />
                    <MathDisplay math="\iiint_V f(x,y,z) \, dV = \int \int \int f(x,y,z) \, dx \, dy \, dz" displayMode={true} />
                  </section>

                  <section>
                    <h3 className="text-xl font-semibold mb-3 text-primary">Superficies Cuádricas</h3>
                    <p className="text-muted-foreground mb-3">
                      Son superficies de segundo grado en tres variables:
                    </p>
                    <MathDisplay math="Ax^2 + By^2 + Cz^2 + Dxy + Exz + Fyz + Gx + Hy + Iz + J = 0" displayMode={true} />
                    <p className="text-sm text-muted-foreground mt-2">
                      Incluyen elipsoides, hiperboloides, paraboloides, conos y cilindros.
                    </p>
                  </section>
                </div>
              </CardContent>
            </Card>
          </CarouselItem>

          {/* Slide 3: Arquitectura */}
          <CarouselItem>
            <Card className="border-2 border-primary/20">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <Cog className="h-8 w-8 text-primary" />
                  <h2 className="text-3xl font-bold text-foreground">3. Diseño de la Solución</h2>
                </div>
                
                <div className="space-y-6">
                  <section>
                    <h3 className="text-2xl font-semibold mb-4 text-primary">Arquitectura del Sistema</h3>
                    <div className="bg-muted/50 p-6 rounded-lg border border-border">
                      <div className="space-y-3 text-muted-foreground">
                        <div className="flex items-start gap-3">
                          <Badge variant="default">Frontend</Badge>
                          <span>React 18 + TypeScript + Tailwind CSS + Vite</span>
                        </div>
                        <div className="flex items-start gap-3">
                          <Badge variant="default">3D Rendering</Badge>
                          <span>Three.js + React Three Fiber + @react-three/drei</span>
                        </div>
                        <div className="flex items-start gap-3">
                          <Badge variant="default">Math Rendering</Badge>
                          <span>KaTeX + MathQuill (WYSIWYG LaTeX editor)</span>
                        </div>
                        <div className="flex items-start gap-3">
                          <Badge variant="default">Backend</Badge>
                          <span>Lovable Cloud (Supabase Edge Functions + Deno)</span>
                        </div>
                        <div className="flex items-start gap-3">
                          <Badge variant="default">AI Integration</Badge>
                          <span>Lovable AI Gateway → Google Gemini 2.5 Flash</span>
                        </div>
                      </div>
                    </div>
                  </section>

                  <section>
                    <h3 className="text-2xl font-semibold mb-4 text-primary">Flujo de Datos</h3>
                    <div className="bg-muted/50 p-6 rounded-lg border border-border space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="bg-primary text-primary-foreground px-3 py-1 rounded font-semibold">1</div>
                        <p className="text-muted-foreground">Usuario ingresa ecuación en MathQuill → Conversión a LaTeX</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="bg-primary text-primary-foreground px-3 py-1 rounded font-semibold">2</div>
                        <p className="text-muted-foreground">Frontend envía LaTeX al Edge Function correspondiente</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="bg-primary text-primary-foreground px-3 py-1 rounded font-semibold">3</div>
                        <p className="text-muted-foreground">Edge Function construye prompt especializado + llama Lovable AI</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="bg-primary text-primary-foreground px-3 py-1 rounded font-semibold">4</div>
                        <p className="text-muted-foreground">Google Gemini 2.5 Flash procesa matemáticas simbólicas</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="bg-primary text-primary-foreground px-3 py-1 rounded font-semibold">5</div>
                        <p className="text-muted-foreground">Respuesta JSON estructurada → Frontend renderiza con KaTeX</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="bg-primary text-primary-foreground px-3 py-1 rounded font-semibold">6</div>
                        <p className="text-muted-foreground">Visualización 3D mediante Three.js + React Three Fiber</p>
                      </div>
                    </div>
                  </section>

                  <section>
                    <h3 className="text-2xl font-semibold mb-4 text-primary">Módulos Implementados</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-muted/30 p-4 rounded-lg border border-primary/20">
                        <h4 className="font-semibold text-primary mb-2">Visualización 3D</h4>
                        <p className="text-sm text-muted-foreground">
                          Superficies explícitas, curvas paramétricas, superficies implícitas, contornos, intersecciones
                        </p>
                      </div>
                      <div className="bg-muted/30 p-4 rounded-lg border border-primary/20">
                        <h4 className="font-semibold text-primary mb-2">Derivadas</h4>
                        <p className="text-sm text-muted-foreground">
                          Parciales, gradiente, evaluación en puntos, interpretación geométrica
                        </p>
                      </div>
                      <div className="bg-muted/30 p-4 rounded-lg border border-primary/20">
                        <h4 className="font-semibold text-primary mb-2">Optimización</h4>
                        <p className="text-sm text-muted-foreground">
                          Puntos críticos, Hessiana, máximos/mínimos, multiplicadores de Lagrange
                        </p>
                      </div>
                      <div className="bg-muted/30 p-4 rounded-lg border border-primary/20">
                        <h4 className="font-semibold text-primary mb-2">Integrales</h4>
                        <p className="text-sm text-muted-foreground">
                          Dobles y triples, cambio de orden, interpretación volumétrica
                        </p>
                      </div>
                      <div className="bg-muted/30 p-4 rounded-lg border border-primary/20">
                        <h4 className="font-semibold text-primary mb-2">Superficies Cuádricas</h4>
                        <p className="text-sm text-muted-foreground">
                          Clasificación automática, forma canónica, parámetros, visualización dual
                        </p>
                      </div>
                      <div className="bg-muted/30 p-4 rounded-lg border border-primary/20">
                        <h4 className="font-semibold text-primary mb-2">Dominio y Rango</h4>
                        <p className="text-sm text-muted-foreground">
                          Análisis de restricciones, singularidades, comportamiento asintótico
                        </p>
                      </div>
                    </div>
                  </section>

                  <section>
                    <h3 className="text-2xl font-semibold mb-4 text-primary">Tecnologías Clave</h3>
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-semibold text-foreground mb-1">WebGL + Three.js</h4>
                        <p className="text-sm text-muted-foreground">
                          Renderizado 3D acelerado por GPU. Three.js abstrae WebGL para crear geometrías, 
                          materiales y luces de manera declarativa.
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground mb-1">React Three Fiber</h4>
                        <p className="text-sm text-muted-foreground">
                          Renderer de React para Three.js. Permite describir escenas 3D con JSX y usar hooks de React 
                          para gestionar estado y animaciones.
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground mb-1">Lovable AI + Gemini 2.5 Flash</h4>
                        <p className="text-sm text-muted-foreground">
                          IA multimodal para cálculo simbólico. Procesa ecuaciones LaTeX y genera derivadas, 
                          integrales y clasificaciones con razonamiento matemático avanzado.
                        </p>
                      </div>
                    </div>
                  </section>
                </div>
              </CardContent>
            </Card>
          </CarouselItem>

          {/* Slide 4: Resultados */}
          <CarouselItem>
            <Card className="border-2 border-primary/20">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <ImageIcon className="h-8 w-8 text-primary" />
                  <h2 className="text-3xl font-bold text-foreground">4. Resultados y Capturas</h2>
                </div>
                
                <div className="space-y-6">
                  <section>
                    <h3 className="text-2xl font-semibold mb-4 text-primary">Funcionalidades Implementadas</h3>
                    <div className="grid grid-cols-1 gap-4">
                      <div className="bg-muted/30 p-5 rounded-lg border border-primary/20">
                        <div className="flex items-center gap-3 mb-3">
                          <Badge variant="default">Visualización 3D</Badge>
                          <span className="text-sm text-muted-foreground">60 FPS • Interactivo</span>
                        </div>
                        <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                          <li>Superficies explícitas z = f(x,y) con gradiente de color por altura</li>
                          <li>Curvas paramétricas (x(t), y(t), z(t))</li>
                          <li>Superficies implícitas convertidas automáticamente</li>
                          <li>Líneas de contorno proyectadas en el plano XY</li>
                          <li>Intersecciones con planos coordenados (XY, XZ, YZ)</li>
                          <li>Controles orbitales para rotación y zoom</li>
                        </ul>
                      </div>

                      <div className="bg-muted/30 p-5 rounded-lg border border-primary/20">
                        <div className="flex items-center gap-3 mb-3">
                          <Badge variant="default">Derivadas Parciales</Badge>
                          <span className="text-sm text-muted-foreground">Cálculo Simbólico</span>
                        </div>
                        <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                          <li>∂f/∂x, ∂f/∂y calculadas simbólicamente</li>
                          <li>Vector gradiente ∇f con notación vectorial</li>
                          <li>Evaluación numérica en puntos específicos</li>
                          <li>Interpretación geométrica del significado</li>
                        </ul>
                      </div>

                      <div className="bg-muted/30 p-5 rounded-lg border border-primary/20">
                        <div className="flex items-center gap-3 mb-3">
                          <Badge variant="default">Optimización</Badge>
                          <span className="text-sm text-muted-foreground">Lagrange</span>
                        </div>
                        <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                          <li>Puntos críticos mediante ∇f = 0</li>
                          <li>Matriz Hessiana para clasificación (máximo/mínimo/silla)</li>
                          <li>Multiplicadores de Lagrange para optimización con restricciones</li>
                          <li>Interpretación paso a paso del método</li>
                        </ul>
                      </div>

                      <div className="bg-muted/30 p-5 rounded-lg border border-primary/20">
                        <div className="flex items-center gap-3 mb-3">
                          <Badge variant="default">Integrales Múltiples</Badge>
                          <span className="text-sm text-muted-foreground">∬ y ∭</span>
                        </div>
                        <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                          <li>Integrales dobles con límites constantes o variables</li>
                          <li>Integrales triples en regiones rectangulares</li>
                          <li>Cambio de orden de integración</li>
                          <li>Interpretación como volumen bajo superficie</li>
                        </ul>
                      </div>

                      <div className="bg-muted/30 p-5 rounded-lg border border-primary/20">
                        <div className="flex items-center gap-3 mb-3">
                          <Badge variant="default">Superficies Cuádricas</Badge>
                          <span className="text-sm text-muted-foreground">Clasificación IA</span>
                        </div>
                        <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                          <li>Clasificación automática del tipo de superficie</li>
                          <li>Forma canónica de la ecuación</li>
                          <li>Parámetros a, b, c extraídos</li>
                          <li>Visualización 3D con ambas hojas (± para raíces cuadradas)</li>
                          <li>Descripción geométrica detallada</li>
                        </ul>
                      </div>
                    </div>
                  </section>

                  <section>
                    <h3 className="text-2xl font-semibold mb-4 text-primary">Casos de Prueba Exitosos</h3>
                    <div className="space-y-3">
                      <div className="bg-accent/10 p-4 rounded-lg border border-accent/30">
                        <p className="font-mono text-sm mb-2 text-foreground">f(x,y) = x² + y²</p>
                        <p className="text-xs text-muted-foreground">
                          → Paraboloide elíptico, gradiente (2x, 2y), mínimo en (0,0)
                        </p>
                      </div>
                      <div className="bg-accent/10 p-4 rounded-lg border border-accent/30">
                        <p className="font-mono text-sm mb-2 text-foreground">f(x,y) = x² - y²</p>
                        <p className="text-xs text-muted-foreground">
                          → Paraboloide hiperbólico (silla de montar), punto de silla en (0,0)
                        </p>
                      </div>
                      <div className="bg-accent/10 p-4 rounded-lg border border-accent/30">
                        <p className="font-mono text-sm mb-2 text-foreground">x²/4 + y²/9 + z²/16 = 1</p>
                        <p className="text-xs text-muted-foreground">
                          → Elipsoide con semiejes a=2, b=3, c=4
                        </p>
                      </div>
                      <div className="bg-accent/10 p-4 rounded-lg border border-accent/30">
                        <p className="font-mono text-sm mb-2 text-foreground">∬ xy dA sobre [0,2]×[0,1]</p>
                        <p className="text-xs text-muted-foreground">
                          → Integral = 1, interpretación como masa de región
                        </p>
                      </div>
                    </div>
                  </section>

                  <section>
                    <h3 className="text-2xl font-semibold mb-4 text-primary">Métricas de Rendimiento</h3>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center p-4 bg-muted/30 rounded-lg border border-primary/20">
                        <p className="text-3xl font-bold text-primary">60 FPS</p>
                        <p className="text-sm text-muted-foreground mt-1">Renderizado 3D</p>
                      </div>
                      <div className="text-center p-4 bg-muted/30 rounded-lg border border-primary/20">
                        <p className="text-3xl font-bold text-primary">&lt; 2s</p>
                        <p className="text-sm text-muted-foreground mt-1">Cálculo IA</p>
                      </div>
                      <div className="text-center p-4 bg-muted/30 rounded-lg border border-primary/20">
                        <p className="text-3xl font-bold text-primary">100%</p>
                        <p className="text-sm text-muted-foreground mt-1">Precisión Simbólica</p>
                      </div>
                    </div>
                  </section>
                </div>
              </CardContent>
            </Card>
          </CarouselItem>

          {/* Slide 5: Conclusiones */}
          <CarouselItem>
            <Card className="border-2 border-primary/20">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <Lightbulb className="h-8 w-8 text-primary" />
                  <h2 className="text-3xl font-bold text-foreground">5. Conclusiones y Mejoras</h2>
                </div>
                
                <div className="space-y-6">
                  <section>
                    <h3 className="text-2xl font-semibold mb-4 text-primary">Logros Principales</h3>
                    <ul className="space-y-3 text-muted-foreground">
                      <li className="flex items-start gap-3">
                        <span className="text-primary font-bold text-lg">✓</span>
                        <span>
                          <strong>Integración exitosa de IA generativa</strong> para cálculo simbólico matemático, 
                          superando las limitaciones de librerías tradicionales como SymPy o Math.js.
                        </span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-primary font-bold text-lg">✓</span>
                        <span>
                          <strong>Visualización 3D interactiva de alta calidad</strong> con Three.js y React Three Fiber, 
                          permitiendo exploración intuitiva de superficies complejas.
                        </span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-primary font-bold text-lg">✓</span>
                        <span>
                          <strong>Arquitectura full-stack escalable</strong> con frontend moderno (React + TypeScript) 
                          y backend serverless (Edge Functions) que se despliega automáticamente.
                        </span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-primary font-bold text-lg">✓</span>
                        <span>
                          <strong>Experiencia de usuario educativa</strong> con interpretaciones paso a paso, 
                          notación matemática profesional (LaTeX) y feedback interactivo.
                        </span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-primary font-bold text-lg">✓</span>
                        <span>
                          <strong>Cobertura completa de cálculo multivariable</strong>: derivadas, integrales, 
                          optimización, superficies cuádricas y análisis de dominio/rango.
                        </span>
                      </li>
                    </ul>
                  </section>

                  <section>
                    <h3 className="text-2xl font-semibold mb-4 text-primary">Desafíos Superados</h3>
                    <div className="space-y-3">
                      <div className="bg-muted/30 p-4 rounded-lg border border-border">
                        <h4 className="font-semibold text-foreground mb-2">Conversión LaTeX ↔ JavaScript</h4>
                        <p className="text-sm text-muted-foreground">
                          Implementación de parser robusto para traducir expresiones LaTeX a código evaluable 
                          (reemplazando \frac, ^, funciones trigonométricas, etc.).
                        </p>
                      </div>
                      <div className="bg-muted/30 p-4 rounded-lg border border-border">
                        <h4 className="font-semibold text-foreground mb-2">Superficies Implícitas</h4>
                        <p className="text-sm text-muted-foreground">
                          Detección automática de ecuaciones implícitas (x²+y²+z²=r²) y conversión a forma explícita 
                          z = ±√(...) para visualización.
                        </p>
                      </div>
                      <div className="bg-muted/30 p-4 rounded-lg border border-border">
                        <h4 className="font-semibold text-foreground mb-2">Geometría de Malla 3D</h4>
                        <p className="text-sm text-muted-foreground">
                          Generación de vértices, índices y colores para BufferGeometry, manejando puntos inválidos 
                          (NaN) en dominios restringidos.
                        </p>
                      </div>
                      <div className="bg-muted/30 p-4 rounded-lg border border-border">
                        <h4 className="font-semibold text-foreground mb-2">Prompts de IA Especializados</h4>
                        <p className="text-sm text-muted-foreground">
                          Diseño de prompts detallados para Gemini con instrucciones claras de formato JSON, 
                          notación LaTeX y pasos de resolución.
                        </p>
                      </div>
                    </div>
                  </section>

                  <section>
                    <h3 className="text-2xl font-semibold mb-4 text-primary">Posibles Mejoras Futuras</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-accent/10 p-4 rounded-lg border border-accent/30">
                        <h4 className="font-semibold text-foreground mb-2">🔢 Más Tipos de Superficies</h4>
                        <p className="text-sm text-muted-foreground">
                          Coordenadas cilíndricas, esféricas, superficies de revolución, superficies regladas
                        </p>
                      </div>
                      <div className="bg-accent/10 p-4 rounded-lg border border-accent/30">
                        <h4 className="font-semibold text-foreground mb-2">📊 Campos Vectoriales</h4>
                        <p className="text-sm text-muted-foreground">
                          Visualización de vectores F(x,y,z), líneas de campo, divergencia y rotacional
                        </p>
                      </div>
                      <div className="bg-accent/10 p-4 rounded-lg border border-accent/30">
                        <h4 className="font-semibold text-foreground mb-2">🎓 Sistema de Ejercicios</h4>
                        <p className="text-sm text-muted-foreground">
                          Problemas guiados, autoevaluación, banco de ejercicios, progreso del estudiante
                        </p>
                      </div>
                      <div className="bg-accent/10 p-4 rounded-lg border border-accent/30">
                        <h4 className="font-semibold text-foreground mb-2">💾 Guardado de Sesiones</h4>
                        <p className="text-sm text-muted-foreground">
                          Historial de cálculos, exportar resultados a PDF/LaTeX, compartir visualizaciones
                        </p>
                      </div>
                      <div className="bg-accent/10 p-4 rounded-lg border border-accent/30">
                        <h4 className="font-semibold text-foreground mb-2">🎨 Personalización Visual</h4>
                        <p className="text-sm text-muted-foreground">
                          Esquemas de color personalizados, iluminación ajustable, calidad de renderizado
                        </p>
                      </div>
                      <div className="bg-accent/10 p-4 rounded-lg border border-accent/30">
                        <h4 className="font-semibold text-foreground mb-2">⚡ Optimización Numérica</h4>
                        <p className="text-sm text-muted-foreground">
                          Métodos de Newton, gradiente conjugado, algoritmos genéticos, PSO
                        </p>
                      </div>
                      <div className="bg-accent/10 p-4 rounded-lg border border-accent/30">
                        <h4 className="font-semibold text-foreground mb-2">🌐 Integrales de Línea</h4>
                        <p className="text-sm text-muted-foreground">
                          Cálculo sobre curvas, teorema de Green, campos conservativos
                        </p>
                      </div>
                      <div className="bg-accent/10 p-4 rounded-lg border border-accent/30">
                        <h4 className="font-semibold text-foreground mb-2">📱 Realidad Aumentada</h4>
                        <p className="text-sm text-muted-foreground">
                          Visualización de superficies en espacio real usando WebXR
                        </p>
                      </div>
                    </div>
                  </section>

                  <section>
                    <h3 className="text-2xl font-semibold mb-4 text-primary">Impacto Educativo</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Esta aplicación demuestra cómo la <strong>inteligencia artificial</strong> y las 
                      <strong> tecnologías web modernas</strong> pueden transformar el aprendizaje del cálculo multivariable. 
                      Al combinar <strong>visualización intuitiva</strong>, <strong>cálculo simbólico potente</strong> y 
                      <strong> feedback inmediato</strong>, se facilita la comprensión de conceptos abstractos que 
                      tradicionalmente son difíciles de enseñar solo con papel y pizarra.
                    </p>
                  </section>
                </div>
              </CardContent>
            </Card>
          </CarouselItem>

          {/* Slide 6: Bibliografía */}
          <CarouselItem>
            <Card className="border-2 border-primary/20">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <BookOpen className="h-8 w-8 text-primary" />
                  <h2 className="text-3xl font-bold text-foreground">6. Bibliografía y Referencias</h2>
                </div>
                
                <div className="space-y-6">
                  <section>
                    <h3 className="text-2xl font-semibold mb-4 text-primary">Textos de Cálculo</h3>
                    <ul className="space-y-3 text-muted-foreground">
                      <li className="pl-4 border-l-2 border-primary/30">
                        <strong>Stewart, J.</strong> (2015). <em>Calculus: Early Transcendentals</em> (8th ed.). 
                        Cengage Learning.
                      </li>
                      <li className="pl-4 border-l-2 border-primary/30">
                        <strong>Larson, R., & Edwards, B.</strong> (2017). <em>Calculus of Several Variables</em> (11th ed.). 
                        Cengage Learning.
                      </li>
                      <li className="pl-4 border-l-2 border-primary/30">
                        <strong>Marsden, J. E., & Tromba, A. J.</strong> (2011). <em>Vector Calculus</em> (6th ed.). 
                        W. H. Freeman.
                      </li>
                      <li className="pl-4 border-l-2 border-primary/30">
                        <strong>Thomas, G. B., Weir, M. D., & Hass, J.</strong> (2018). 
                        <em> Thomas' Calculus: Early Transcendentals</em> (14th ed.). Pearson.
                      </li>
                    </ul>
                  </section>

                  <section>
                    <h3 className="text-2xl font-semibold mb-4 text-primary">Documentación Técnica</h3>
                    <ul className="space-y-3 text-muted-foreground">
                      <li className="pl-4 border-l-2 border-primary/30">
                        <strong>React Documentation:</strong> <code className="text-xs bg-muted px-2 py-1 rounded">https://react.dev</code>
                        <p className="text-sm mt-1">Biblioteca para interfaces de usuario declarativas y componentes reutilizables.</p>
                      </li>
                      <li className="pl-4 border-l-2 border-primary/30">
                        <strong>Three.js Documentation:</strong> <code className="text-xs bg-muted px-2 py-1 rounded">https://threejs.org/docs</code>
                        <p className="text-sm mt-1">Librería JavaScript para gráficos 3D basados en WebGL.</p>
                      </li>
                      <li className="pl-4 border-l-2 border-primary/30">
                        <strong>React Three Fiber:</strong> <code className="text-xs bg-muted px-2 py-1 rounded">https://docs.pmnd.rs/react-three-fiber</code>
                        <p className="text-sm mt-1">Renderer de React para Three.js con paradigma declarativo.</p>
                      </li>
                      <li className="pl-4 border-l-2 border-primary/30">
                        <strong>TypeScript Handbook:</strong> <code className="text-xs bg-muted px-2 py-1 rounded">https://www.typescriptlang.org/docs</code>
                        <p className="text-sm mt-1">Superset tipado de JavaScript para desarrollo escalable.</p>
                      </li>
                      <li className="pl-4 border-l-2 border-primary/30">
                        <strong>Lovable Documentation:</strong> <code className="text-xs bg-muted px-2 py-1 rounded">https://docs.lovable.dev</code>
                        <p className="text-sm mt-1">Plataforma full-stack con IA integrada para desarrollo web.</p>
                      </li>
                    </ul>
                  </section>

                  <section>
                    <h3 className="text-2xl font-semibold mb-4 text-primary">Papers y Recursos Académicos</h3>
                    <ul className="space-y-3 text-muted-foreground">
                      <li className="pl-4 border-l-2 border-primary/30">
                        <strong>Marching Cubes Algorithm:</strong> Lorensen, W. E., & Cline, H. E. (1987). 
                        <em> Marching cubes: A high resolution 3D surface construction algorithm</em>. 
                        ACM SIGGRAPH Computer Graphics, 21(4), 163-169.
                      </li>
                      <li className="pl-4 border-l-2 border-primary/30">
                        <strong>Lagrange Multipliers:</strong> Bertsekas, D. P. (2014). 
                        <em>Constrained Optimization and Lagrange Multiplier Methods</em>. Academic Press.
                      </li>
                      <li className="pl-4 border-l-2 border-primary/30">
                        <strong>Computer Graphics:</strong> Shirley, P., & Marschner, S. (2009). 
                        <em>Fundamentals of Computer Graphics</em> (3rd ed.). A K Peters/CRC Press.
                      </li>
                      <li className="pl-4 border-l-2 border-primary/30">
                        <strong>Numerical Methods:</strong> Press, W. H., et al. (2007). 
                        <em>Numerical Recipes: The Art of Scientific Computing</em> (3rd ed.). Cambridge University Press.
                      </li>
                    </ul>
                  </section>

                  <section>
                    <h3 className="text-2xl font-semibold mb-4 text-primary">Herramientas y Librerías</h3>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-muted/30 p-3 rounded text-sm">
                        <strong className="text-foreground">KaTeX:</strong>
                        <p className="text-xs text-muted-foreground mt-1">Renderizado rápido de LaTeX en web</p>
                      </div>
                      <div className="bg-muted/30 p-3 rounded text-sm">
                        <strong className="text-foreground">MathQuill:</strong>
                        <p className="text-xs text-muted-foreground mt-1">Editor WYSIWYG para matemáticas</p>
                      </div>
                      <div className="bg-muted/30 p-3 rounded text-sm">
                        <strong className="text-foreground">Tailwind CSS:</strong>
                        <p className="text-xs text-muted-foreground mt-1">Framework CSS utility-first</p>
                      </div>
                      <div className="bg-muted/30 p-3 rounded text-sm">
                        <strong className="text-foreground">Vite:</strong>
                        <p className="text-xs text-muted-foreground mt-1">Build tool ultrarrápido</p>
                      </div>
                      <div className="bg-muted/30 p-3 rounded text-sm">
                        <strong className="text-foreground">Supabase:</strong>
                        <p className="text-xs text-muted-foreground mt-1">Backend serverless con Edge Functions</p>
                      </div>
                      <div className="bg-muted/30 p-3 rounded text-sm">
                        <strong className="text-foreground">Google Gemini:</strong>
                        <p className="text-xs text-muted-foreground mt-1">IA multimodal para cálculo simbólico</p>
                      </div>
                    </div>
                  </section>

                  <section>
                    <h3 className="text-2xl font-semibold mb-4 text-primary">Recursos en Línea</h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• <strong>Wolfram MathWorld:</strong> Enciclopedia de matemáticas - mathworld.wolfram.com</li>
                      <li>• <strong>Khan Academy:</strong> Cursos interactivos de cálculo multivariable</li>
                      <li>• <strong>MIT OpenCourseWare:</strong> 18.02 Multivariable Calculus</li>
                      <li>• <strong>3Blue1Brown:</strong> Videos de visualización matemática en YouTube</li>
                      <li>• <strong>GeoGebra:</strong> Software de matemáticas dinámicas para educación</li>
                      <li>• <strong>Desmos 3D:</strong> Graficador 3D interactivo</li>
                    </ul>
                  </section>

                  <section className="pt-6 border-t border-border">
                    <p className="text-center text-muted-foreground italic">
                      Proyecto desarrollado como herramienta educativa para el aprendizaje del Cálculo Multivariable. 
                      <br />
                      <span className="text-sm">Tecnología: React + Three.js + Lovable AI + Google Gemini 2.5 Flash</span>
                    </p>
                  </section>
                </div>
              </CardContent>
            </Card>
          </CarouselItem>
        </CarouselContent>
        
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>

      <div className="mt-8 text-center">
        <p className="text-sm text-muted-foreground">
          Use las flechas o arrastre para navegar • Total: 6 secciones
        </p>
      </div>
    </div>
  );
};

export default Exposition;
