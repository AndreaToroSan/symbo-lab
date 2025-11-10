import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { operation, functionText, constraint } = await req.json();
    console.log('Calculating optimization:', { operation, functionText, constraint });

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    let systemPrompt, userPrompt;

    if (operation === 'lagrange') {
      systemPrompt = `Eres un profesor experto en cálculo multivariable que enseña optimización con restricciones.
Tu tarea es resolver problemas usando Multiplicadores de Lagrange Y EXPLICAR el significado de los resultados de forma educativa.

MÉTODO DE MULTIPLICADORES DE LAGRANGE:
1. Dado: Optimizar f(x,y) sujeto a la restricción g(x,y) = 0
2. Principio: Los gradientes de f y g son paralelos en el óptimo: ∇f = λ∇g
3. Sistema a resolver:
   - fx = λ·gx  (derivada parcial de f respecto a x = λ × derivada parcial de g respecto a x)
   - fy = λ·gy  (derivada parcial de f respecto a y = λ × derivada parcial de g respecto a y)
   - g(x,y) = 0 (la restricción)

Responde ÚNICAMENTE con un objeto JSON con este formato:
{
  "system": "sistema de ecuaciones de Lagrange en LaTeX (sin $)",
  "points": "puntos críticos encontrados en LaTeX (sin $)",
  "values": "valores de f en cada punto en LaTeX (sin $)",
  "explanation": "explicación detallada en español: explica qué son los puntos críticos encontrados, cuál da el valor máximo y cuál el mínimo de la función sobre la restricción, y el significado práctico de estos resultados"
}

IMPORTANTE: 
- NO uses símbolos $ 
- La explicación debe ser clara y educativa, mencionando si son máximos o mínimos condicionados
- Usa la terminología: máximo/mínimo condicionado, restricción, curva de nivel`;

      userPrompt = `Resuelve usando Multiplicadores de Lagrange:
Función objetivo: f(x,y) = ${functionText}
Restricción: g(x,y) = ${constraint} = 0

Aplica el método, encuentra los puntos críticos sobre la restricción, evalúa f en esos puntos, y explica el significado.`;
    } else {
      systemPrompt = `Eres un profesor experto en cálculo multivariable que enseña optimización.
Tu tarea es encontrar y clasificar puntos críticos Y EXPLICAR el significado de los resultados de forma educativa.

MÉTODO PARA ENCONTRAR PUNTOS CRÍTICOS:
1. Calcular derivadas parciales: fx(x,y) y fy(x,y)
2. Resolver el sistema fx = 0, fy = 0 para encontrar puntos críticos
3. Clasificar usando el Hessiano (criterio de la segunda derivada):
   - Calcular: fxx, fyy, fxy
   - Determinante Hessiano: D = fxx·fyy - (fxy)²
   
CLASIFICACIÓN:
- Si D > 0 y fxx > 0: MÍNIMO LOCAL (la función tiene su valor más bajo en una vecindad)
- Si D > 0 y fxx < 0: MÁXIMO LOCAL (la función tiene su valor más alto en una vecindad)
- Si D < 0: PUNTO DE SILLA (no es ni máximo ni mínimo)
- Si D = 0: PRUEBA INCONCLUSA

Responde ÚNICAMENTE con un objeto JSON con este formato:
{
  "criticalPoints": "lista de puntos críticos en LaTeX (sin $)",
  "classification": "clasificación detallada mostrando D, fxx, y la conclusión en LaTeX (sin $)",
  "explanation": "explicación en español del significado: qué representan estos puntos, si son máximos locales, mínimos locales o puntos de silla, qué significa esto en la práctica"
}

IMPORTANTE: 
- NO uses símbolos $
- Muestra el cálculo del Hessiano D para cada punto
- Usa la terminología correcta: punto crítico, gradiente, Hessiano, mínimo/máximo local, punto de silla`;

      userPrompt = `Encuentra y clasifica los puntos críticos de:
f(x,y) = ${functionText}

Calcula derivadas parciales, resuelve fx=0 y fy=0, encuentra puntos críticos, calcula el Hessiano para clasificarlos, y explica el significado.`;
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Límite de solicitudes excedido. Por favor intenta más tarde." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Fondos insuficientes. Por favor agrega créditos a tu workspace." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    let content = data.choices[0].message.content.trim();
    
    // Remove $ symbols if present
    content = content.replace(/\$/g, '');
    
    // Try to parse JSON from the response
    let result;
    try {
      // Remove markdown code blocks if present
      const cleanContent = content.replace(/```json\n?|\n?```/g, '');
      const parsed = JSON.parse(cleanContent);
      
      if (operation === 'lagrange') {
        result = {
          system: parsed.system?.replace(/\$/g, '') || "\\text{Error}",
          points: parsed.points?.replace(/\$/g, '') || "\\text{Error}",
          values: parsed.values?.replace(/\$/g, '') || "",
          explanation: parsed.explanation?.replace(/\$/g, '') || ""
        };
      } else {
        result = {
          criticalPoints: parsed.criticalPoints?.replace(/\$/g, '') || "\\text{Error}",
          classification: parsed.classification?.replace(/\$/g, '') || "\\text{Error}",
          explanation: parsed.explanation?.replace(/\$/g, '') || ""
        };
      }
    } catch (e) {
      // If parsing fails, return a formatted error
      result = {
        criticalPoints: "\\text{Error procesando respuesta}",
        classification: "\\text{Por favor intenta de nuevo}"
      };
    }
    
    console.log('Optimization result:', result);

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error('Error in calculate-optimization:', error);
    const errorMessage = error instanceof Error ? error.message : "Error calculando optimización";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
