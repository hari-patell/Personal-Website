// Simple development API server
// Run with: node dev-server.mjs
import { createServer } from 'http';
import { readFileSync } from 'fs';
import OpenAI from 'openai';

// Load environment variables
try {
  const envFile = readFileSync('.env.local', 'utf-8');
  envFile.split('\n').forEach(line => {
    const [key, ...valueParts] = line.split('=');
    if (key && valueParts.length > 0) {
      process.env[key.trim()] = valueParts.join('=').trim();
    }
  });
} catch (error) {
  console.warn('Could not load .env.local:', error.message);
}

const PORT = 3000;

const server = createServer(async (req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  if (req.url === '/api/chat' && req.method === 'POST') {
    console.log('API handler called');
    
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', async () => {
      try {
        const { question, context } = JSON.parse(body);
        
        if (!question || !context) {
          console.error('Missing required fields');
          res.statusCode = 400;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: 'Question and context are required' }));
          return;
        }

        const apiKey = process.env.HUGGING_FACE_API_KEY || process.env.HF_TOKEN;
        
        if (!apiKey) {
          console.error('API key not configured');
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: 'API key not configured' }));
          return;
        }

        console.log('Making request to Hugging Face...');

        const client = new OpenAI({
          baseURL: 'https://router.huggingface.co/v1',
          apiKey: apiKey,
        });

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 60000);

        try {
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

          const answer = completion.choices[0]?.message?.content || 'I apologize, but I could not generate an answer to that question.';

          console.log('Successfully got response from Hugging Face');
          
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ 
            answer: answer,
            model: completion.model,
          }));
        } catch (fetchError) {
          clearTimeout(timeoutId);
          
          console.error('Hugging Face API error:', fetchError.message);
          
          if (fetchError.name === 'AbortError' || fetchError.message?.includes('timeout')) {
            res.statusCode = 504;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ 
              error: 'Request timed out after 60 seconds. The AI model may still be loading. Please wait 10-20 seconds and try again.',
              retry: true
            }));
            return;
          }

          if (fetchError.status === 503 || fetchError.status === 429) {
            res.statusCode = 503;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ 
              error: 'AI model is loading or rate limited. Please try again in 10-20 seconds.',
              retry: true
            }));
            return;
          }

          throw fetchError;
        }
      } catch (error) {
        console.error('Error:', error);
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ 
          error: 'Internal server error',
          message: error.message
        }));
      }
    });
  } else if (req.url === '/api/test') {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ 
      message: 'API is working!',
      hasApiKey: !!(process.env.HUGGING_FACE_API_KEY || process.env.HF_TOKEN),
    }));
  } else {
    res.statusCode = 404;
    res.end('Not found');
  }
});

server.listen(PORT, () => {
  console.log(`\n✅ API server running on http://localhost:${PORT}`);
  console.log(`✅ API key loaded: ${!!(process.env.HUGGING_FACE_API_KEY || process.env.HF_TOKEN)}`);
  console.log(`\n📝 Test the API:`);
  console.log(`   curl http://localhost:${PORT}/api/test\n`);
  console.log(`🌐 Now start Vite in another terminal:`);
  console.log(`   npm run dev\n`);
  console.log(`🚀 Then open: http://localhost:5173\n`);
});

