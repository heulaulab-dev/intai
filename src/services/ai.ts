import OpenAI from 'openai';
import { getOpenAIConfig, MODELS } from '../utils/env.js';

export async function analyzeWithAI<T>(
  prompt: string,
  content: string,
  model?: string
): Promise<T> {
  const { apiKey, baseURL, model: configModel } = getOpenAIConfig();
  const client = new OpenAI({ apiKey, baseURL });

  // Use provided model, config model, or default
  const effectiveModel = model || configModel || MODELS.ANALYSIS;

  const response = await client.chat.completions.create({
    model: effectiveModel,
    messages: [
      {
        role: 'system',
        content: prompt,
      },
      {
        role: 'user',
        content: `Website content to analyze:\n\n${content}`,
      },
    ],
    temperature: 0.3,
    max_tokens: 4000,
  });

  const text = response.choices[0]?.message?.content;

  if (!text) {
    throw new Error('No response from AI');
  }

  try {
    // Try to extract JSON, handling thinking blocks and other formats
    let cleaned = text
      // Remove thinking blocks (Claude/MiniMax extended format)
      .replace(/<thinking>[\s\S]*?<\/thinking>/gi, '')
      .replace(/<think>[\s\S]*?<\/think>/gi, '')
      // Remove markdown code blocks
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/\s*```$/i, '')
      .trim();

    return JSON.parse(cleaned) as T;
  } catch {
    // Log the raw response for debugging
    console.error('Raw AI response:', text.slice(0, 500));
    throw new Error('Failed to parse AI response as JSON');
  }
}