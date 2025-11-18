# Personal-Website

Hari Patel's personal portfolio website with AI-powered resume chat built with React, TypeScript, and Vite.

## Local Development

This project requires running two servers simultaneously:
1. **API Server** - Handles the AI chat API requests to Hugging Face
2. **Vite Dev Server** - Serves the frontend React application

### Quick Start

You need to run two servers in separate terminal windows:

**Terminal 1 - Start the API server:**
```bash
npm run dev:api
```

**Terminal 2 - Start the frontend:**
```bash
npm run dev
```

Then open your browser to: **`http://localhost:5173`**

The Vite dev server will automatically proxy API requests to the API server running on port 3000.

### Environment Variables

Create a `.env.local` file in the root directory with your Hugging Face API key:

```env
HUGGING_FACE_API_KEY=your_huggingface_api_key_here
```

The API server will automatically load this file on startup.

### How It Works

- **Frontend**: React + TypeScript + Vite (runs on port 5173)
- **API Server**: Node.js server (`dev-server.mjs`) that handles chat requests to Hugging Face (runs on port 3000)
- **Vite Proxy**: Configured to forward `/api/*` requests from port 5173 to port 3000
- **Production**: Deployed on Vercel using serverless functions (`/api/chat.ts`)

### Troubleshooting

- Make sure both servers are running before testing the AI chat
- If the chat doesn't work, check that port 3000 isn't in use by another process
- Check the API server terminal for logs when making requests
- Verify your `.env.local` file exists and contains a valid Hugging Face API key
