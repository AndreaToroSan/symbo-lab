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
    const { operation, functionText, point } = await req.json();
    console.log('Calculating domain/limit/range:', { operation, functionText, point });

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    let systemPrompt, userPrompt;

    if (operation === "domain") {
      systemPrompt = `Eres un experto en cálculo multivariable. Tu tarea es determinar el dominio de funciones multivariables y responder SOLAMENTE con la expresión matemática en formato LaTeX.

Reglas:
1. Responde SOLO con la expresión del dominio en LaTeX
2. Usa notación de conjuntos: \\{(x,y) \\in \\mathbb{R}^2 : condiciones\\}
3. Identifica restricciones: denominadores no nulos, raíces no negativas, logaritmos positivos, etc.
4. Simplifica las condiciones cuando sea posible
5. Si la función está definida en todo R², indica: D = \\mathbb{R}^2
6. NO uses símbolos $ en tu respuesta (no uses $, escribe LaTeX directo)`;

      userPrompt = `Determina el dominio de: ${functionText}`;
    } else if (operation === "range") {
      systemPrompt = `Eres un experto en cálculo multivariable. Tu tarea es determinar el rango de funciones multivariables y responder SOLAMENTE con la expresión matemática en formato LaTeX.

Reglas:
1. Responde SOLO con la expresión del rango en LaTeX
2. Usa notación de intervalos o conjuntos: [a, b], (a, \\infty), \\mathbb{R}, etc.
3. Analiza valores máximos, mínimos y comportamiento asintótico
4. Simplifica la expresión cuando sea posible
5. Si el rango es todo R, indica: R = \\mathbb{R}
6. NO uses símbolos $ en tu respuesta (no uses $, escribe LaTeX directo)`;

      userPrompt = `Determina el rango de: ${functionText}`;
    } else {
      systemPrompt = `Eres un experto en cálculo multivariable. Tu tarea es calcular límites de funciones multivariables y responder con un objeto JSON.

Debes responder ÚNICAMENTE con un objeto JSON con este formato exacto:
{
  "exists": true o false,
  "result": "expresión LaTeX con el resultado o explicación",
  "note": "nota opcional sobre la existencia del límite"
}

Reglas:
1. Evalúa si el límite existe verificando diferentes trayectorias
2. Si existe, calcula su valor
3. Si no existe, explica por qué (diferentes valores por diferentes trayectorias)
4. Usa notación LaTeX estándar
5. NO uses símbolos $ en tu respuesta (no uses $, escribe LaTeX directo)
6. Responde SOLO con el JSON, sin texto adicional`;

      userPrompt = `Calcula el límite de ${functionText} cuando (x,y) → ${point}`;
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
    if (operation === "domain" || operation === "range") {
      result = { result: content };
    } else {
      try {
        const cleanContent = content.replace(/```json\n?|\n?```/g, '');
        const parsed = JSON.parse(cleanContent);
        result = {
          exists: parsed.exists,
          result: parsed.result?.replace(/\$/g, '') || "\\text{Error}",
          note: parsed.note || ""
        };
      } catch (e) {
        result = {
          exists: false,
          result: "\\text{Error procesando límite}",
          note: "Por favor intenta de nuevo"
        };
      }
    }
    
    console.log('Domain/Limit result:', result);

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error('Error in calculate-domain-limits:', error);
    const errorMessage = error instanceof Error ? error.message : "Error calculando dominio/límite";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
