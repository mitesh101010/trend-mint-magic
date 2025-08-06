interface OpenRouterResponse {
  id: string;
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

export class OpenRouterService {
  private apiKey: string;
  private baseUrl = "https://openrouter.ai/api/v1/chat/completions";

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async generateImage(prompt: string): Promise<string> {
    try {
      const response = await fetch(this.baseUrl, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer": window.location.origin,
          "X-Title": "TrendMint NFT Generator",
        },
        body: JSON.stringify({
          model: "microsoft/kosmos-2-patch14-224:free",
          messages: [
            {
              role: "user",
              content: `Generate a detailed, artistic description for an NFT image based on this prompt: "${prompt}". Make it vivid, creative, and suitable for digital art generation.`,
            },
          ],
          max_tokens: 500,
          temperature: 0.8,
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenRouter API error: ${response.status}`);
      }

      const data: OpenRouterResponse = await response.json();
      const description = data.choices[0]?.message?.content;

      // For now, return a placeholder image URL
      // In a real implementation, you would use the description to generate an actual image
      // using a service like DALL-E, Midjourney, or Stable Diffusion
      return `https://picsum.photos/512/512?random=${Date.now()}`;

    } catch (error) {
      console.error("Error generating image:", error);
      throw new Error("Failed to generate image");
    }
  }
}

export const createOpenRouterService = (apiKey: string) => {
  return new OpenRouterService(apiKey);
};