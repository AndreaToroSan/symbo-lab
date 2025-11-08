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
    const { type, data } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    let prompt = "";
    
    if (type === "line-plane-intersection") {
      prompt = `Calcula la intersección entre la recta y el plano dados.
      
Recta (forma paramétrica): ${data.line}
Plano: ${data.plane}

Devuelve el resultado en formato LaTeX, indicando:
1. El punto de intersección (si existe)
2. Si la recta es paralela al plano
3. Si la recta está contenida en el plano

Formato de respuesta:
{
  "intersection_point": "punto en LaTeX o null",
  "relationship": "intersects/parallel/contained",
  "explanation": "explicación breve en LaTeX"
}`;
    } else if (type === "line-line-intersection") {
      prompt = `Calcula la intersección entre dos rectas en 3D.
      
Recta 1: ${data.line1}
Recta 2: ${data.line2}

Devuelve en formato LaTeX:
1. Si las rectas se intersectan (punto de intersección)
2. Si son paralelas
3. Si son alabeadas (se cruzan sin intersectar)

Formato:
{
  "intersection_point": "punto o null",
  "relationship": "intersect/parallel/skew",
  "distance": "distancia si son alabeadas",
  "explanation": "explicación"
}`;
    } else if (type === "plane-plane-intersection") {
      prompt = `Calcula la intersección entre dos planos.
      
Plano 1: ${data.plane1}
Plano 2: ${data.plane2}

Devuelve:
1. La recta de intersección (en forma paramétrica y vectorial)
2. Si son paralelos
3. Si son coincidentes

Formato LaTeX de respuesta.`;
    } else if (type === "angle-between-lines") {
      prompt = `Calcula el ángulo entre dos rectas en 3D.
      
Recta 1: ${data.line1}
Recta 2: ${data.line2}

Devuelve el ángulo en radianes y grados en formato LaTeX.`;
    } else if (type === "angle-between-planes") {
      prompt = `Calcula el ángulo entre dos planos.
      
Plano 1: ${data.plane1}
Plano 2: ${data.plane2}

Devuelve el ángulo en radianes y grados en formato LaTeX.`;
    } else if (type === "angle-line-plane") {
      prompt = `Calcula el ángulo entre una recta y un plano.
      
Recta: ${data.line}
Plano: ${data.plane}

Devuelve el ángulo en radianes y grados en formato LaTeX.`;
    } else if (type === "distance-point-line") {
      prompt = `Calcula la distancia de un punto a una recta en 3D.
      
Punto: ${data.point}
Recta: ${data.line}

Devuelve la distancia y el punto más cercano en la recta en formato LaTeX.`;
    } else if (type === "distance-point-plane") {
      prompt = `Calcula la distancia de un punto a un plano.
      
Punto: ${data.point}
Plano: ${data.plane}

Devuelve la distancia en formato LaTeX.`;
    } else if (type === "distance-line-line") {
      prompt = `Calcula la distancia entre dos rectas alabeadas en 3D.
      
Recta 1: ${data.line1}
Recta 2: ${data.line2}

Devuelve la distancia mínima en formato LaTeX.`;
    } else if (type === "parallel-plane") {
      prompt = `Encuentra la ecuación de un plano paralelo que pasa por un punto.
      
Plano dado: ${data.plane}
Punto: ${data.point}

Devuelve la ecuación del nuevo plano en formato LaTeX.`;
    } else if (type === "perpendicular-plane") {
      prompt = `Encuentra la ecuación de un plano perpendicular que pasa por un punto.
      
Plano dado: ${data.plane}
Punto: ${data.point}

Devuelve la ecuación del nuevo plano en formato LaTeX.`;
    } else {
      throw new Error("Invalid calculation type");
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
          { 
            role: "system", 
            content: "Eres un experto en geometría analítica y cálculo vectorial. Proporciona respuestas matemáticamente precisas en formato LaTeX. Siempre verifica tus cálculos."
          },
          { role: "user", content: prompt }
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded" }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Payment required" }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const result = await response.json();
    const aiResponse = result.choices[0].message.content;

    return new Response(JSON.stringify({ result: aiResponse }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in calculate-lines-planes:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), 
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
