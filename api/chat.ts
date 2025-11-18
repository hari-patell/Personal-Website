import type { VercelRequest, VercelResponse } from '@vercel/node';
import OpenAI from 'openai';

export default async function handler(
  request: VercelRequest,
  response: VercelResponse,
) {
  console.log('API handler called:', {
    method: request.method,
    url: request.url,
    hasBody: !!request.body,
  });

  // Only allow POST requests
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method not allowed' });
  }

  const { question, context } = request.body;

  if (!question || !context) {
    console.error('Missing required fields:', { hasQuestion: !!question, hasContext: !!context });
    return response.status(400).json({ error: 'Question and context are required' });
  }

  const apiKey = process.env.HUGGING_FACE_API_KEY || process.env.HF_TOKEN;
  
  if (!apiKey) {
    console.error('API key not found in environment variables');
    return response.status(500).json({ error: 'API key not configured' });
  }

  console.log('API key found, making request to Hugging Face...');

  try {
    // Using Hugging Face's OpenAI-compatible API via router
    const client = new OpenAI({
      baseURL: 'https://router.huggingface.co/v1',
      apiKey: apiKey,
    });

    // Add timeout to prevent hanging requests (60 seconds max)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000);

    try {
      // Use a chat completion model - trying a fast, efficient model
      // You can change the model if needed. Some options:
      // - "meta-llama/Llama-3.2-3B-Instruct" (fast, good quality)
      // - "mistralai/Mistral-7B-Instruct-v0.2" (good balance)
      // - "google/gemma-2-2b-it" (very fast)
      const completion = await client.chat.completions.create({
        model: 'meta-llama/Llama-3.2-3B-Instruct',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant that answers questions about Hari\'s resume. Be concise, accurate, and professional.',
          },
          {
            role: 'user',
            content: `Based on the following resume information, answer this question: ${question}\n\nResume Information:\n${context}`,
          },
        ],
        max_tokens: 300,
        temperature: 0.7,
      }, {
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const answer = completion.choices[0]?.message?.content || 'I apologize, but I could not generate an answer to that question. Please try rephrasing your question.';

      console.log('Successfully got response from Hugging Face');
      return response.status(200).json({ 
        answer: answer,
        model: completion.model,
      });
    } catch (fetchError: any) {
      clearTimeout(timeoutId);
      
      if (fetchError.name === 'AbortError' || fetchError.message?.includes('timeout')) {
        return response.status(504).json({ 
          error: 'Request timed out after 60 seconds. The AI model may still be loading. Please wait 10-20 seconds and try again.',
          retry: true
        });
      }

      // Handle model loading or rate limiting
      if (fetchError.status === 503 || fetchError.status === 429) {
        return response.status(503).json({ 
          error: 'AI model is loading or rate limited. Please try again in 10-20 seconds.',
          retry: true
        });
      }

      throw fetchError;
    }
  } catch (error) {
    console.error('Error calling Hugging Face API:', error);
    return response.status(500).json({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

