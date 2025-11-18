import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(
  request: VercelRequest,
  response: VercelResponse,
) {
  return response.status(200).json({ 
    message: 'API is working!',
    method: request.method,
    hasApiKey: !!(process.env.HUGGING_FACE_API_KEY || process.env.HF_TOKEN),
    timestamp: new Date().toISOString(),
  });
}

