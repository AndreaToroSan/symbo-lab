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
    const { equation } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const prompt = `Analiza la siguiente ecuación de superficie cuádrica y clasifícala según la tabla de identificación:

Ecuación: ${equation}

Tabla de Clasificación:
1. Elipsoide: (x²/a²) + (y²/b²) + (z²/c²) = 1 (todos términos cuadrados con coeficientes positivos)
2. Hiperboloide de una hoja: (x²/a²) + (y²/b²) - (z²/c²) = 1 (un término negativo en cuadrado)
3. Hiperboloide de dos hojas: (x²/a²) - (y²/b²) - (z²/c²) = 1 (dos términos negativos en cuadrado)
4. Paraboloide elíptico: z = (x²/a²) + (y²/b²) (variable sola a un lado, términos cuadrados positivos)
5. Paraboloide hiperbólico (silla de montar): z = (x²/a²) - (y²/b²) (un término positivo y otro negativo)
6. Cono cuádrico: (x²/a²) + (y²/b²) - (z²/c²) = 0 (igual a cero, con un negativo)
7. Cilindro elíptico: (x²/a²) + (y²/b²) = 1 (solo x e y en cuadrado, sin z)

Devuelve un JSON con el siguiente formato:
{
  "type": "nombre de la superficie (español)",
  "canonical_form": "forma canónica en LaTeX puro sin símbolos $ ni delimitadores",
  "characteristics": ["característica 1", "característica 2", ...],
  "parameters": {
    "a": valor o null,
    "b": valor o null,
    "c": valor o null
  },
  "description": "descripción en texto plano",
  "center": "(x0, y0, z0) o null si está en el origen",
  "axes": "descripción de los ejes principales"
}

REGLAS CRÍTICAS PARA LA DESCRIPCIÓN:
1. Escribe en TEXTO PLANO normal, sin LaTeX
2. DEBE tener ESPACIOS entre TODAS las palabras
3. USA ACENTOS NORMALES (á, é, í, ó, ú) NO símbolos especiales
4. Escribe números y letras normalmente (a, b, c NO a², b², c²)
5. Máximo 3-4 oraciones cortas y claras
6. Ejemplo CORRECTO: "El hiperboloide de dos hojas es una superficie no acotada que consta de dos partes separadas. Cada parte se extiende infinitamente en direcciones opuestas. Tiene simetría con respecto a los tres ejes coordenados."

Si la ecuación no está en forma canónica, primero conviértela y luego clasifícala.`;

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
            content: "Eres un experto matemático especializado en geometría analítica y superficies cuádricas. Proporciona respuestas en formato JSON válido."
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
    let aiResponse = result.choices[0].message.content;

    // Extract JSON from markdown code blocks if present
    const jsonMatch = aiResponse.match(/```json\n([\s\S]*?)\n```/) || aiResponse.match(/```\n([\s\S]*?)\n```/);
    if (jsonMatch) {
      aiResponse = jsonMatch[1];
    }

    // Parse the JSON response
    const classification = JSON.parse(aiResponse);
    
    // Clean up description: ensure proper spacing and encoding
    if (classification.description) {
      classification.description = classification.description
        .replace(/([a-záéíóúñ])([A-ZÁÉÍÓÚÑ])/g, '$1 $2') // Add space between lowercase and uppercase
        .replace(/([a-z])([A-Z])/g, '$1 $2') // Add space between words stuck together
        .replace(/\s+/g, ' ') // Normalize multiple spaces to single space
        .trim();
    }

    return new Response(JSON.stringify({ classification }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in classify-quadric-surface:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), 
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
