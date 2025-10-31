
export interface SpeechDelivery {
  clarity: "Clear" | "Unclear" | "N/A";
  confidence: "Confident" | "Hesitant" | "N/A";
  pronunciation: "Correct" | "Incorrect" | "N/A";
  tone: "Appropriate" | "Inappropriate" | "N/A";
  tone_feedback: string | "N/A";
  feedback: string | "N/A";
}

export interface Feedback {
  formality_explanation: string;
  grammar_explanation: string;
  technical_explanation: string;
}

export interface ScoreSummary {
  formality_score: number;
  grammar_score: number;
  technical_score: number;
  speech_delivery_score: number;
  overall_score: number;
}

export interface EvaluationResponse {
  formality: "Formal" | "Informal";
  grammar: "Correct" | "Incorrect";
  technical_correctness: "Accurate" | "Inaccurate";
  speech_delivery: SpeechDelivery;
  feedback: Feedback;
  score_summary: ScoreSummary;
  follow_up_questions?: string[];
}