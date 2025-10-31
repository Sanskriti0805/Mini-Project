
import { GoogleGenAI, Type } from "@google/genai";
import { SYSTEM_PROMPT } from '../constants';
import { EvaluationResponse } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

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
            description: "Detailed feedback on vocal tone, including enthusiasm, monotony, and conviction."
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
  required: ["formality", "grammar", "technical_correctness", "speech_delivery", "feedback", "score_summary", "follow_up_questions"],
};

export async function evaluateAnswer(
  question: string,
  textAnswer: string,
  audioData: { mimeType: string; data: string } | null
): Promise<EvaluationResponse> {
  const model = 'gemini-2.5-flash-lite';

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
    throw new Error("Invalid JSON response from API.");
  }
}

export async function generateRandomQuestion(): Promise<string> {
  const model = 'gemini-2.5-flash-lite';
  const prompt = "Generate a single, interesting interview-style question on a random topic like technology, science, history, or art. Provide only the question text without any quotation marks, preamble, or formatting.";

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
  });

  return response.text.trim();
}