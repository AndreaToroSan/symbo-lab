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
    const { functionText, integralType, bounds } = await req.json();
    console.log('Calculating integral:', { functionText, integralType, bounds });

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const isTriple = integralType === "triple";
    const integralSymbol = isTriple ? "\\iiint" : "\\iint";
    
    let boundsDescription = `x de ${bounds.x[0]} a ${bounds.x[1]}, y de ${bounds.y[0]} a ${bounds.y[1]}`;
    if (isTriple) {
      boundsDescription += `, z de ${bounds.z[0]} a ${bounds.z[1]}`;
    }

    const systemPrompt = `Eres un experto en cálculo integral multivariable. Tu tarea es calcular integrales dobles o triples y responder con la configuración completa y el resultado.

Debes responder ÚNICAMENTE con un objeto JSON con este formato exacto:
{
  "setup": "expresión LaTeX con la integral configurada",
  "result": "expresión LaTeX con el resultado numérico o simbólico"
}

Reglas:
1. Usa notación LaTeX estándar (\\iint, \\iiint, \\int)
2. Muestra los límites de integración claramente
3. Calcula el resultado final (puede ser numérico o simbólico)
4. Si la integral es muy compleja, proporciona el setup y una aproximación
5. Responde SOLO con el JSON, sin texto adicional`;

    const userPrompt = `Calcula la integral ${isTriple ? 'triple' : 'doble'} de: ${functionText}
Con límites: ${boundsDescription}`;

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
    
    let result;
    try {
      const cleanContent = content.replace(/```json\n?|\n?```/g, '');
      result = JSON.parse(cleanContent);
    } catch (e) {
      result = {
        setup: `${integralSymbol} (${functionText})`,
        result: "\\text{Error procesando resultado}"
      };
    }
    
    console.log('Integral result:', result);

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error('Error in calculate-integrals:', error);
    const errorMessage = error instanceof Error ? error.message : "Error calculando integral";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
