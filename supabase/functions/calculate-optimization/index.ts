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
    const { functionText } = await req.json();
    console.log('Calculating optimization:', { functionText });

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `Eres un experto en cálculo multivariable y optimización. Tu tarea es encontrar puntos críticos y clasificarlos.

Debes responder ÚNICAMENTE con un objeto JSON con este formato exacto:
{
  "criticalPoints": "expresión LaTeX con los puntos críticos",
  "classification": "expresión LaTeX con la clasificación de cada punto"
}

Reglas:
1. Encuentra todos los puntos críticos igualando las derivadas parciales a cero
2. Clasifica cada punto usando el criterio de la segunda derivada (Hessiano)
3. Usa notación LaTeX estándar
4. Si no hay puntos críticos, indica: \\text{No hay puntos críticos}
5. Responde SOLO con el JSON, sin texto adicional`;

    const userPrompt = `Encuentra y clasifica los puntos críticos de: ${functionText}`;

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
    const content = data.choices[0].message.content.trim();
    
    // Try to parse JSON from the response
    let result;
    try {
      // Remove markdown code blocks if present
      const cleanContent = content.replace(/```json\n?|\n?```/g, '');
      result = JSON.parse(cleanContent);
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
