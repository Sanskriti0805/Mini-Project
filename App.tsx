import React, { useState } from 'react';
import { QuestionSelector } from './components/QuestionSelector.tsx';
import { AnswerInput } from './components/AnswerInput.tsx';
import { EvaluationResult } from './components/EvaluationResult.tsx';
import { evaluateAnswer, generateRandomQuestion } from './services/geminiService.ts';
import { EvaluationResponse } from './types.ts';
import { QUESTIONS } from './constants.ts';
import { LogoIcon } from './components/icons/LogoIcon.tsx';

const App: React.FC = () => {
  console.log('App component rendering...');
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
      const errorMessage = e instanceof Error ? e.message : 'An error occurred during evaluation.';
      if (errorMessage.includes('GEMINI_API_KEY') || errorMessage.includes('API_KEY')) {
        setError('API Key not configured. Please create a .env.local file with your GEMINI_API_KEY. See SETUP_GUIDE.md for instructions.');
      } else {
        setError(`Error: ${errorMessage}. Please check the console for details.`);
      }
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
      const errorMessage = e instanceof Error ? e.message : 'Failed to generate a new question.';
      if (errorMessage.includes('GEMINI_API_KEY') || errorMessage.includes('API_KEY')) {
        setError('API Key not configured. Please create a .env.local file with your GEMINI_API_KEY. See SETUP_GUIDE.md for instructions.');
      } else {
        setError(`Error: ${errorMessage}. Please try again.`);
      }
    } finally {
      setIsGeneratingQuestion(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 text-slate-800 dark:text-slate-200 font-sans">
      <header className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg shadow-lg border-b border-slate-200/50 dark:border-slate-700/50 sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-5 flex items-center gap-4">
          <div className="p-2 bg-gradient-to-br from-brand-secondary to-brand-primary rounded-xl shadow-lg">
            <LogoIcon className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-brand-primary to-brand-secondary bg-clip-text text-transparent dark:from-blue-400 dark:to-indigo-300">
              Multimodal Conversation Evaluator
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">AI-Powered Speech & Text Evaluation</p>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="max-w-5xl mx-auto space-y-6">
          <QuestionSelector
            questions={questions}
            selectedQuestion={selectedQuestion}
            onQuestionChange={setSelectedQuestion}
            onGenerateQuestion={handleGenerateQuestion}
            isGenerating={isGeneratingQuestion}
          />

          <AnswerInput onEvaluate={handleEvaluate} isLoading={isLoading} />
          
          {isLoading && (
            <div className="mt-8 flex flex-col items-center justify-center p-12 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-200/50 dark:border-slate-700/50">
              <div className="relative">
                <div className="animate-spin rounded-full h-20 w-20 border-4 border-slate-200 dark:border-slate-700"></div>
                <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-brand-secondary absolute top-0 left-0"></div>
              </div>
              <p className="mt-6 text-xl font-semibold text-slate-700 dark:text-slate-200">Evaluating your answer...</p>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Analyzing content, grammar, and delivery</p>
              <div className="mt-4 flex gap-1">
                <div className="w-2 h-2 bg-brand-secondary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-brand-secondary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-brand-secondary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          )}

          {error && (
            <div className="mt-8 p-5 bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/30 dark:to-orange-900/30 border-l-4 border-red-500 dark:border-red-400 rounded-xl shadow-lg backdrop-blur-sm" role="alert">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-red-500 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="font-bold text-red-800 dark:text-red-200">Error</p>
                  <p className="mt-1 text-sm text-red-700 dark:text-red-300">{error}</p>
                </div>
              </div>
            </div>
          )}

          {evaluation && !isLoading && (
            <div className="mt-8 animate-fadeIn">
              <div className="mb-6 flex items-center gap-3">
                <div className="h-1 w-12 bg-gradient-to-r from-brand-secondary to-brand-primary rounded-full"></div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-slate-700 to-slate-900 dark:from-slate-200 dark:to-slate-100 bg-clip-text text-transparent">
                  Evaluation Results
                </h2>
                <div className="h-1 flex-1 bg-gradient-to-r from-brand-secondary to-brand-primary rounded-full"></div>
              </div>
              <EvaluationResult result={evaluation} audioBlob={submissionAudio} />
            </div>
          )}
        </div>
      </main>
      <footer className="text-center py-6 text-sm text-slate-500 dark:text-slate-400 border-t border-slate-200/50 dark:border-slate-700/50 mt-12">
        <p>Powered by <span className="font-semibold text-brand-secondary">Gemini API</span></p>
      </footer>
    </div>
  );
};

export default App;