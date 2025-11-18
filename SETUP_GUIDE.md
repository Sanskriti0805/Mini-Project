# Local Setup Guide for Multimodal Conversation Evaluator

This guide will help you run your Google AI Studio project locally on your machine.

## Project Overview

This is a **React + TypeScript + Vite** application that evaluates user answers to questions using Google's Gemini AI. The app can evaluate:
- **Text answers** (linguistic analysis)
- **Voice/audio answers** (vocal delivery analysis)
- **Both text and audio** (comprehensive multimodal evaluation)

The evaluation covers:
- Formality (language style)
- Grammar
- Technical correctness
- Speech delivery (clarity, confidence, pronunciation, tone)

## Prerequisites

1. **Node.js** (version 16 or higher recommended)
   - Download from: https://nodejs.org/
   - Verify installation: `node --version`

2. **Google Gemini API Key**
   - Get your API key from: https://aistudio.google.com/apikey
   - You'll need a Google account

## Setup Steps

### Step 1: Install Dependencies

Open a terminal in the project directory and run:

```bash
cd C:\Users\Sanskriti\Mini-Project
npm install
```

This will install all required packages:
- React & React DOM
- TypeScript
- Vite (build tool)
- @google/genai (Google Gemini API client)

### Step 2: Configure API Key

Create a `.env.local` file in the project root directory with your Gemini API key:

**Create file:** `C:\Users\Sanskriti\Mini-Project\.env.local`

**Add this content:**
```
GEMINI_API_KEY=your_actual_api_key_here
```

Replace `your_actual_api_key_here` with your actual Gemini API key from Google AI Studio.

**Important:** 
- The `.env.local` file is already in `.gitignore`, so it won't be committed to version control
- Never share your API key publicly

### Step 3: Run the Development Server

Start the development server:

```bash
npm run dev
```

The app will start on `http://localhost:3000`

You should see output like:
```
  VITE v6.x.x  ready in xxx ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: http://192.168.x.x:3000/
```

### Step 4: Open in Browser

Open your browser and navigate to:
```
http://localhost:3000
```

## How to Use the App

1. **Select a Question**: Choose from predefined questions or generate a random one
2. **Provide Your Answer**: 
   - Type your answer in the text box, OR
   - Click the microphone to record your voice, OR
   - Do both (text + voice)
3. **Submit**: Click the submit button to evaluate
4. **View Results**: See detailed evaluation across all dimensions with scores and feedback

## Troubleshooting

### Issue: "API_KEY is not defined" or API errors

**Solution:** 
- Make sure `.env.local` exists in the project root
- Verify the API key is correct (no extra spaces)
- Restart the dev server after creating/modifying `.env.local`

### Issue: Port 3000 is already in use

**Solution:**
- Change the port in `vite.config.ts` (line 9) to another port like `3001`
- Or stop the process using port 3000

### Issue: npm install fails

**Solution:**
- Make sure Node.js is installed: `node --version`
- Try clearing npm cache: `npm cache clean --force`
- Delete `node_modules` folder and `package-lock.json`, then run `npm install` again

### Issue: Microphone not working

**Solution:**
- Grant microphone permissions in your browser
- Use HTTPS or localhost (required for microphone access)
- Check browser console for errors

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Project Structure

```
Mini-Project/
├── components/          # React components
│   ├── AnswerInput.tsx
│   ├── EvaluationResult.tsx
│   ├── QuestionSelector.tsx
│   └── icons/          # Icon components
├── services/
│   └── geminiService.ts # Gemini API integration
├── App.tsx             # Main app component
├── constants.ts        # Questions and system prompts
├── types.ts            # TypeScript type definitions
├── vite.config.ts      # Vite configuration
├── package.json        # Dependencies and scripts
└── .env.local          # API key (create this file)
```

## Notes

- The app uses **Tailwind CSS** via CDN for styling
- Audio recording uses the browser's MediaRecorder API
- The evaluation uses Gemini 2.5 Flash Lite model
- All API calls are made from the client-side (browser)

## Next Steps

Once running locally, you can:
- Customize questions in `constants.ts`
- Modify evaluation criteria in the `SYSTEM_PROMPT` in `constants.ts`
- Add new features or UI improvements
- Deploy to production using `npm run build`

