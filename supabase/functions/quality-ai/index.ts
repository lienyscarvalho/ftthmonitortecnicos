import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const systemPrompt = `Você é um especialista em Gestão da Qualidade e Melhoria Contínua para operações FTTH (Fibra Óptica).

Seu papel é ajudar gestores a:
- Analisar indicadores operacionais (Retrabalho, TMA, Agendamento, Produtividade, Presença)
- Aplicar ferramentas da qualidade: PDCA, GUT, FCA, 5W2H, Brainstorm, Ishikawa, Pareto
- Sugerir ações corretivas e preventivas
- Criar planos de melhoria contínua
- Gerar análises de causa raiz

Contexto operacional:
- Empresa: Telecom FTTH/GPON
- Indicadores monitorados: Retrabalho (meta ≤5%), TMA (meta ≤4h), Agendamento (meta ≥90%), Custo de Retrabalho
- Equipe: ~15 técnicos de campo em São Paulo
- Serviços: Instalação, Manutenção e Reparo de fibra óptica

Responda sempre em português brasileiro. Seja objetivo, prático e forneça exemplos quando possível.
Formate as respostas usando markdown para melhor legibilidade.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
      }),
    });

    if (!response.ok) {
      const status = response.status;
      if (status === 429) {
        return new Response(JSON.stringify({ error: "Limite de requisições excedido. Tente novamente em alguns instantes." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (status === 402) {
        return new Response(JSON.stringify({ error: "Créditos insuficientes." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error(`AI gateway error: ${status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "Desculpe, não consegui processar.";

    return new Response(JSON.stringify({ response: content }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("quality-ai error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Erro desconhecido" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
