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
      systemPrompt = `Eres un experto en cálculo multivariable y optimización con restricciones usando Multiplicadores de Lagrange. Responde ÚNICAMENTE con un objeto JSON con este formato exacto:

{
  "system": "expresión LaTeX del sistema de ecuaciones de Lagrange: \\nabla f = \\lambda \\nabla g y g = 0",
  "points": "expresión LaTeX de los puntos críticos encontrados",
  "values": "expresión LaTeX de los valores de f en cada punto crítico (para identificar máximos y mínimos)"
}

Reglas:
1. Plantea el sistema ∇f = λ∇g y g(x,y) = 0
2. Resuelve el sistema para encontrar los puntos críticos
3. Evalúa f en cada punto para determinar cuál es máximo y mínimo
4. Usa notación LaTeX estándar
5. NO uses símbolos $ en tu respuesta (no uses $, escribe LaTeX directo)
6. Responde SOLO con el JSON, sin texto adicional`;

      userPrompt = `Optimiza ${functionText} sujeto a la restricción ${constraint} = 0 usando Multiplicadores de Lagrange`;
    } else {
      systemPrompt = `Eres un experto en cálculo multivariable y optimización. Tu tarea es encontrar y clasificar puntos críticos de funciones multivariables. Responde ÚNICAMENTE con un objeto JSON con este formato exacto:

{
  "criticalPoints": "expresión LaTeX de los puntos críticos, ej: (1, 2), (0, 0)",
  "classification": "expresión LaTeX con la clasificación usando el criterio de la segunda derivada (Hessiano), ej: \\text{Mínimo local en } (1, 2) \\text{ y punto silla en } (0, 0)"
}

Reglas:
1. Calcula las derivadas parciales y encuentra donde ambas son cero
2. Evalúa el Hessiano (matriz de segundas derivadas) en cada punto crítico
3. Clasifica cada punto: mínimo local (D>0, fxx>0), máximo local (D>0, fxx<0), punto silla (D<0), o indeterminado (D=0)
4. Usa notación LaTeX estándar
5. NO uses símbolos $ en tu respuesta (no uses $, escribe LaTeX directo)
6. Responde SOLO con el JSON, sin texto adicional`;

      userPrompt = `Encuentra y clasifica los puntos críticos de: ${functionText}`;
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
          values: parsed.values?.replace(/\$/g, '') || ""
        };
      } else {
        result = {
          criticalPoints: parsed.criticalPoints?.replace(/\$/g, '') || "\\text{Error}",
          classification: parsed.classification?.replace(/\$/g, '') || "\\text{Error}"
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
