import React, { useState } from 'react';
import { QuestionSelector } from './components/QuestionSelector';
import { AnswerInput } from './components/AnswerInput';
import { EvaluationResult } from './components/EvaluationResult';
import { evaluateAnswer, generateRandomQuestion } from './services/geminiService';
import { EvaluationResponse } from './types';
import { QUESTIONS } from './constants';
import { LogoIcon } from './components/icons/LogoIcon';

const App: React.FC = () => {
  const [questions, setQuestions] = useState<string[]>(QUESTIONS);
  const [selectedQuestion, setSelectedQuestion] = useState<string>(QUESTIONS[0]);
  const [evaluation, setEvaluation] = useState<EvaluationResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isGeneratingQuestion, setIsGeneratingQuestion] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [submissionAudio, setSubmissionAudio] = useState<Blob | null>(null);

  const handleEvaluate = async (textAnswer: string, audioBlob: Blob | null) => {
    setIsLoading(true);
    setError(null);
    setEvaluation(null);
    setSubmissionAudio(audioBlob);

    let audioData: { mimeType: string; data: string } | null = null;
    if (audioBlob) {
      const reader = new FileReader();
      reader.readAsDataURL(audioBlob);
      await new Promise<void>((resolve, reject) => {
        reader.onloadend = () => {
          const base64Audio = (reader.result as string).split(',')[1];
          audioData = {
            mimeType: audioBlob.type,
            data: base64Audio,
          };
          resolve();
        };
        reader.onerror = reject;
      });
    }
    
    if (!textAnswer && !audioBlob) {
        setError("Please provide an answer either by text or voice.");
        setIsLoading(false);
        return;
    }

    try {
      const result = await evaluateAnswer(selectedQuestion, textAnswer, audioData);
      setEvaluation(result);
    } catch (e) {
      console.error(e);
      setError('An error occurred during evaluation. Please check the console and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateQuestion = async () => {
    setIsGeneratingQuestion(true);
    setError(null);
    try {
      const newQuestion = await generateRandomQuestion();
      if (!questions.includes(newQuestion)) {
        setQuestions(prev => [newQuestion, ...prev]);
      }
      setSelectedQuestion(newQuestion);
    } catch (e) {
      console.error(e);
      setError("Failed to generate a new question. Please try again.");
    } finally {
      setIsGeneratingQuestion(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-sans">
      <header className="bg-white dark:bg-slate-800 shadow-md">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-4">
          <LogoIcon className="h-10 w-10 text-brand-secondary" />
          <h1 className="text-2xl sm:text-3xl font-bold text-brand-primary dark:text-white">Multimodal Conversation Evaluator</h1>
        </div>
      </header>
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto">
          <QuestionSelector
            questions={questions}
            selectedQuestion={selectedQuestion}
            onQuestionChange={setSelectedQuestion}
            onGenerateQuestion={handleGenerateQuestion}
            isGenerating={isGeneratingQuestion}
          />

          <AnswerInput onEvaluate={handleEvaluate} isLoading={isLoading} />
          
          {isLoading && (
            <div className="mt-8 flex flex-col items-center justify-center p-8 bg-white dark:bg-slate-800 rounded-lg shadow-lg">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-brand-secondary"></div>
              <p className="mt-4 text-lg font-semibold text-slate-600 dark:text-slate-300">Evaluating your answer...</p>
              <p className="mt-2 text-sm text-slate-500">This may take a moment.</p>
            </div>
          )}

          {error && (
            <div className="mt-8 p-4 bg-red-100 dark:bg-red-900/50 border border-red-400 text-red-700 dark:text-red-200 rounded-lg" role="alert">
              <p className="font-bold">Error</p>
              <p>{error}</p>
            </div>
          )}

          {evaluation && !isLoading && (
            <div className="mt-8">
              <h2 className="text-2xl font-bold mb-4 text-slate-700 dark:text-slate-200">Evaluation Results</h2>
              <EvaluationResult result={evaluation} audioBlob={submissionAudio} />
            </div>
          )}
        </div>
      </main>
      <footer className="text-center py-4 text-sm text-slate-500 dark:text-slate-400">
        Powered by Gemini API
      </footer>
    </div>
  );
};

export default App;