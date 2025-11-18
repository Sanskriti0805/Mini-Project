
import { GoogleGenAI, Type } from "@google/genai";
import { SYSTEM_PROMPT } from '../constants.ts';
import { EvaluationResponse } from "../types.ts";

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    formality: { type: Type.STRING },
    grammar: { type: Type.STRING },
    technical_correctness: { type: Type.STRING },
    speech_delivery: {
      type: Type.OBJECT,
      properties: {
        clarity: { type: Type.STRING },
        confidence: { type: Type.STRING },
        pronunciation: { type: Type.STRING },
        tone: { type: Type.STRING },
        tone_feedback: { 
            type: Type.STRING,
            description: "Detailed feedback on vocal tone, including enthusiasm, monotony, conviction, pacing, volume variations, and the use of pauses."
        },
        feedback: { type: Type.STRING },
      },
      required: ["clarity", "confidence", "pronunciation", "tone", "tone_feedback", "feedback"],
    },
    feedback: {
      type: Type.OBJECT,
      properties: {
        formality_explanation: { type: Type.STRING },
        grammar_explanation: { type: Type.STRING },
        technical_explanation: { type: Type.STRING },
      },
      required: ["formality_explanation", "grammar_explanation", "technical_explanation"],
    },
    score_summary: {
      type: Type.OBJECT,
      properties: {
        formality_score: { type: Type.NUMBER },
        grammar_score: { type: Type.NUMBER },
        technical_score: { type: Type.NUMBER },
        speech_delivery_score: { type: Type.NUMBER },
        overall_score: { type: Type.NUMBER },
      },
      required: ["formality_score", "grammar_score", "technical_score", "speech_delivery_score", "overall_score"],
    },
    follow_up_questions: {
        type: Type.ARRAY,
        items: {
            type: Type.STRING
        },
        description: "1-2 relevant follow-up questions based on the user's answer."
    }
  },
  required: ["formality", "grammar", "technical_correctness", "speech_delivery", "feedback", "score_summary"],
};

const handleApiError = (error: any, context: string): Error => {
  console.error(`Gemini API call failed during ${context}:`, error);
  const errorMessage = error.message?.toLowerCase() || '';

  if (errorMessage.includes('api key not valid')) {
    return new Error("Invalid API Key. Please ensure your API key is correctly configured.");
  }
  if (errorMessage.includes('rate limit')) {
    return new Error("You have exceeded the API rate limit. Please wait a moment and try again.");
  }
  if (error.name === 'AbortError' || errorMessage.includes('network request failed') || errorMessage.includes('failed to fetch')) {
      return new Error("A network error occurred. Please check your internet connection and try again.");
  }
  
  return new Error(`An unexpected error occurred with the AI service during ${context}. Please try again later.`);
};

export async function evaluateAnswer(
  question: string,
  textAnswer: string,
  audioData: { mimeType: string; data: string } | null
): Promise<EvaluationResponse> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
  const model = 'gemini-2.5-flash';

  const textPart = {
    text: `
      Question: ${question}
      User's Text Answer: ${textAnswer || "(No text answer provided)"}
    `,
  };

  const parts: ({ text: string } | { inlineData: { mimeType: string; data: string } })[] = [textPart];
  if (audioData) {
    parts.push({
      inlineData: {
        mimeType: audioData.mimeType,
        data: audioData.data,
      },
    });
  }

  try {
    const response = await ai.models.generateContent({
      model,
      contents: { parts },
      config: {
        systemInstruction: SYSTEM_PROMPT,
        responseMimeType: "application/json",
        responseSchema,
      },
    });
    
    const jsonText = response.text.trim();
    try {
      return JSON.parse(jsonText) as EvaluationResponse;
    } catch (error) {
      console.error("Failed to parse JSON response:", jsonText);
      throw new Error("The AI returned a response in an invalid format. This may be a temporary issue.");
    }
  } catch (error: any) {
    throw handleApiError(error, 'evaluation');
  }
}

export async function generateRandomQuestion(): Promise<string> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
  const model = 'gemini-2.5-flash';
  const prompt = "Generate a single, interesting interview-style question on a random topic like technology, science, history, or art. Provide only the question text without any quotation marks, preamble, or formatting.";

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
    });

    return response.text.trim();
  } catch(error: any) {
    throw handleApiError(error, 'question generation');
  }
}
