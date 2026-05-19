import OpenAI from 'openai';
import { getOpenAIConfig, MODELS } from '../utils/env.js';

export async function analyzeWithAI<T>(
  prompt: string,
  content: string,
  model: string = MODELS.ANALYSIS
): Promise<T> {
  const { apiKey } = getOpenAIConfig();
  const client = new OpenAI({ apiKey });

  const response = await client.chat.completions.create({
    model,
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
    const cleaned = text.replace(/^```json\s*/i, '').replace(/\s*```$/i, '').trim();
    return JSON.parse(cleaned) as T;
  } catch {
    throw new Error('Failed to parse AI response as JSON');
  }
}