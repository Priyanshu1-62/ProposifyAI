import { AIConfig } from "../../../../types/aiInterface/AIConfig";

export async function fetchOpenRouterAI(systemPrompt: string, userPrompt: string, model: string, config: AIConfig){
  const controller = new AbortController();
  const timeout = setTimeout(() => {controller.abort()}, 30000);
  try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
            'HTTP-Referer': 'https://proposifyai.online', // Optional. Site URL for rankings on openrouter.ai.
            'X-Title': 'ProposifyAI',                    // Optional. Site title for rankings on openrouter.ai.
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model,
            messages: [
              {
                  role: 'system',
                  content: systemPrompt
              },
              {
                role: 'user',
                content: userPrompt,
              },
            ],
            temperature: config.temperature,
            top_p: config.topP,
            maxTokens: config.maxTokens
          }),
      });
      
      if(!(response.ok)) {
          const errorText = await response.text();
          return {
            status: response.status,
            error: errorText
          }
      }
      
      const data = await response.json();
      return {
        status: response.status,
        content: data.choices?.[0]?.message?.content ?? "",
        raw: data
      }
  } 
  catch (error) {
    throw error;  
  }
  finally {
    clearTimeout(timeout);
  }
}