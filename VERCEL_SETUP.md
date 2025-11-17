# Vercel Setup Guide for Resume AI Chat

This guide will help you deploy your personal website with the AI resume chat feature on Vercel.

## Prerequisites

- A Vercel account (sign up at https://vercel.com)
- Your Hugging Face API key: `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`

## Deployment Steps

### 1. Push your code to GitHub

Make sure all your changes are committed and pushed to your GitHub repository.

### 2. Import your project to Vercel

1. Go to https://vercel.com/new
2. Import your GitHub repository
3. Vercel will auto-detect Vite as your framework

### 3. Add Environment Variable

**IMPORTANT**: Add your Hugging Face API key as an environment variable:

1. In your Vercel project dashboard, go to **Settings** → **Environment Variables**
2. Add a new environment variable:
   - **Name**: `HUGGING_FACE_API_KEY` (or `HF_TOKEN`)
   - **Value**: `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`
   - **Environment**: Select all (Production, Preview, Development)
3. Click **Save**

### 4. Deploy

1. Vercel will automatically deploy your project
2. Once deployed, your site will be live with the AI chat feature!

## Local Development

To test locally with Vercel's development server:

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Link your project:
   ```bash
   vercel link
   ```

3. Add environment variable locally:
   ```bash
   vercel env add HUGGING_FACE_API_KEY
   ```
   Enter your API key when prompted. (You can also use `HF_TOKEN` as the variable name)

4. Run the development server:
   ```bash
   vercel dev
   ```

## Features

- ✅ Secure API key handling (never exposed to client)
- ✅ AI-powered resume Q&A using Hugging Face
- ✅ Beautiful chat interface matching your site's design
- ✅ Responsive design for mobile and desktop

## Troubleshooting

- If the chat doesn't work, verify the environment variable is set correctly in Vercel
- Check Vercel function logs in the dashboard for any API errors
- The Hugging Face model may take a few seconds to load on first request

