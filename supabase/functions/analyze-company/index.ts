import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { companyName } = await req.json();

    if (!companyName) {
      return new Response(
        JSON.stringify({ error: "Company name is required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const anthropicApiKey = Deno.env.get("ANTHROPIC_API_KEY");
    if (!anthropicApiKey) {
      return new Response(
        JSON.stringify({ error: "API key not configured" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": anthropicApiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-3-5-sonnet-20240620",
        max_tokens: 8192,
        messages: [
          {
            role: "user",
            content: `You are a strategic analyst using Michael Mauboussin's investment frameworks. Analyze ${companyName} using the following structured format. Be rigorous, probabilistic, and intellectually honest.\n\nYour response MUST be valid JSON in this EXACT format (no additional text, no markdown, no code blocks):\n\n{\n  \"companyName\": \"Official company name\",\n  \"businessModel\": \"2-3 sentence description of how the company makes money\",\n  \"industry\": \"Primary industry\",\n  \"moatAssessment\": {\n    \"supplyScale\": {\n      \"score\": 1-5,\n      \"assessment\": \"Detailed analysis with evidence\"\n    },\n    \"networkEffects\": {\n      \"score\": 1-5,\n      \"assessment\": \"Detailed analysis with evidence\"\n    },\n    \"switchingCosts\": {\n      \"score\": 1-5,\n      \"assessment\": \"Detailed analysis with evidence\"\n    },\n    \"intangibles\": {\n      \"score\": 1-5,\n      \"assessment\": \"Detailed analysis with evidence\"\n    },\n    \"costAdvantages\": {\n      \"score\": 1-5,\n      \"assessment\": \"Detailed analysis with evidence\"\n    },\n    \"overallRating\": \"Wide Moat / Narrow Moat / No Moat\",\n    \"trajectory\": \"Strengthening / Stable / Weakening\",\n    \"moatSummary\": \"2-3 sentences on overall competitive position\"\n  },\n  \"expectations\": {\n    \"currentValuation\": \"Brief valuation metrics (P/E, market cap, etc)\",\n    \"impliedExpectations\": \"What growth/margins/position is priced in?\",\n    \"upwardTriggers\": \"What could cause positive revision?\",\n    \"downwardTriggers\": \"What could cause negative revision?\",\n    \"valuationAssessment\": \"Is it priced for perfection or opportunity?\"\n  },\n  \"probabilistic\": {\n    \"baseRate\": \"What do historical statistics tell us about similar companies?\",\n    \"outcomeRange\": \"Bull/base/bear cases with rough probabilities\",\n    \"skillVsLuck\": \"How much is skill vs favorable circumstances?\",\n    \"keyUncertainties\": \"What are the major unknowns?\"\n  },\n  \"management\": {\n    \"capitalAllocation\": \"Track record of M&A, buybacks, reinvestment\",\n    \"strategicThinking\": \"Do they understand their moat? Long-term focus?\",\n    \"overallAssessment\": \"Summary of management quality\"\n  },\n  \"conclusion\": {\n    \"investmentThesis\": \"2-3 sentence thesis\",\n    \"keyRisks\": \"Primary risks to the thesis\",\n    \"whatWouldChange\": \"What would make you change your mind?\",\n    \"recommendation\": \"Context on whether this is attractive\"\n  }\n}\n\nCRITICAL: Your response must be ONLY valid JSON. Do NOT include any text before or after the JSON. Do NOT use markdown code blocks. Do NOT include explanations. ONLY the raw JSON object.`,
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Anthropic API error:", response.status, errorText);
      return new Response(
        JSON.stringify({
          error: `Anthropic API error: ${response.status}`,
          details: errorText,
          requestInfo: {
            model: "claude-3-5-sonnet-20240620",
            maxTokens: 8192
          }
        }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const data = await response.json();
    let responseText = data.content[0].text;

    responseText = responseText.replace(/```json\\n?/g, "").replace(/```\\n?/g, "").trim();

    const analysisData = JSON.parse(responseText);

    return new Response(JSON.stringify(analysisData), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: `Failed to analyze company: ${err.message}` }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});