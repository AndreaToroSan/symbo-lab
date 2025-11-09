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
    const { operation, functionText, variable, point } = await req.json();
    console.log('Calculating derivative/gradient:', { operation, functionText, variable, point });

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    let systemPrompt, userPrompt;

    if (operation === 'gradient') {
      systemPrompt = `Eres un experto en cálculo multivariable. Tu tarea es calcular el gradiente de una función en un punto específico y responder con un objeto JSON.

Debes responder ÚNICAMENTE con un objeto JSON con este formato exacto:
{
  "vector": "expresión LaTeX del gradiente como vector, ej: \\nabla f(${point.x}, ${point.y}) = \\langle valor_x, valor_y \\rangle",
  "magnitude": "expresión LaTeX de la magnitud ||\\nabla f|| = valor",
  "direction": "expresión LaTeX del vector unitario normalizado"
}

Reglas:
1. Calcula las derivadas parciales ∂f/∂x y ∂f/∂y
2. Evalúa ambas en el punto dado
3. Calcula la magnitud del gradiente
4. Normaliza el vector para obtener la dirección
5. Usa notación LaTeX estándar SIN símbolos $ (no uses $, escribe LaTeX directo)
6. Responde SOLO con el JSON, sin texto adicional`;

      userPrompt = `Calcula el gradiente de ${functionText} en el punto (${point.x}, ${point.y})`;
    } else {
      systemPrompt = `Eres un experto en cálculo multivariable. Tu tarea es calcular derivadas parciales de funciones multivariables y responder SOLAMENTE con la expresión derivada en formato LaTeX.

Reglas:
1. Calcula la derivada parcial correctamente
2. Simplifica el resultado lo más posible
3. Responde SOLO con la expresión en LaTeX, sin explicaciones adicionales
4. Usa notación matemática estándar de LaTeX
5. NO uses símbolos $ en tu respuesta (no uses $, escribe LaTeX directo)
6. No incluyas el símbolo de derivada parcial en tu respuesta, solo el resultado`;

      userPrompt = `Calcula la derivada parcial de ${functionText} con respecto a ${variable}`;
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
    
    let result;
    if (operation === 'gradient') {
      try {
        const cleanContent = content.replace(/```json\n?|\n?```/g, '');
        const parsed = JSON.parse(cleanContent);
        // Clean $ from all fields
        result = {
          vector: parsed.vector?.replace(/\$/g, '') || "\\text{Error}",
          magnitude: parsed.magnitude?.replace(/\$/g, '') || "\\text{Error}",
          direction: parsed.direction?.replace(/\$/g, '') || "\\text{Error}"
        };
      } catch (e) {
        result = {
          vector: "\\text{Error procesando gradiente}",
          magnitude: "\\text{Error}",
          direction: "\\text{Error}"
        };
      }
    } else {
      result = { result: content };
    }
    
    console.log('Derivative/Gradient result:', result);

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error('Error in calculate-derivatives:', error);
    const errorMessage = error instanceof Error ? error.message : "Error calculando derivada";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
