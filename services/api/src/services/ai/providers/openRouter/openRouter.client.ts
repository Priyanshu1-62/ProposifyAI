import { AIConfig } from "../../../../types/AIConfig";

export async function fetchOpenRouterAI(systemPrompt: string, userPrompt: string, model: string, config: AIConfig){
    try {
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
              'HTTP-Referer': 'https://proposifyai.online', // Optional. Site URL for rankings on openrouter.ai.
              'X-Title': 'ProposifyAI', // Optional. Site title for rankings on openrouter.ai.
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
        
        if(!(response.ok)){
            const errorText = await response.text();
            throw new Error(`OpenRouter error: ${errorText}`);
        }
        
    } 
    catch (error) {
      throw error;  
    }
}