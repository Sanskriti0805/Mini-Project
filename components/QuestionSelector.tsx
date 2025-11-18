import React from 'react';
import { SparkleIcon } from './icons/SparkleIcon.tsx';

interface QuestionSelectorProps {
  questions: string[];
  selectedQuestion: string;
  onQuestionChange: (question: string) => void;
  onGenerateQuestion: () => void;
  isGenerating: boolean;
}

export const QuestionSelector: React.FC<QuestionSelectorProps> = ({ questions, selectedQuestion, onQuestionChange, onGenerateQuestion, isGenerating }) => {
  return (
    <div className="p-6 sm:p-8 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-200/50 dark:border-slate-700/50 hover:shadow-2xl transition-all duration-300">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
        <div>
          <label htmlFor="question-select" className="block text-xl font-bold text-slate-800 dark:text-slate-100 mb-1">
            Select a Question to Answer
          </label>
          <p className="text-sm text-slate-500 dark:text-slate-400">Choose from existing questions or generate a new one</p>
        </div>
        <button
          type="button"
          onClick={onGenerateQuestion}
          disabled={isGenerating}
          className="w-full sm:w-auto inline-flex items-center justify-center px-5 py-2.5 border border-transparent text-sm font-semibold rounded-xl shadow-lg text-white bg-gradient-to-r from-brand-secondary to-brand-primary hover:from-blue-600 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-slate-800 focus:ring-brand-secondary disabled:bg-slate-400 dark:disabled:bg-slate-600 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 active:scale-95"
        >
          {isGenerating ? (
            <><svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Generating...</>
          ) : (
            <><SparkleIcon className="w-5 h-5 mr-2" /> Generate New</>
          )}
        </button>
      </div>
      <div className="relative">
        <select
          id="question-select"
          value={selectedQuestion}
          onChange={(e) => onQuestionChange(e.target.value)}
          className="block w-full px-4 py-3.5 pr-10 text-base text-slate-900 dark:text-slate-100 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-700 dark:to-slate-800 border-2 border-slate-300 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-secondary focus:border-brand-secondary appearance-none transition-all duration-200 hover:border-brand-secondary/50 dark:hover:border-brand-secondary/50 font-medium"
        >
          {questions.map((q, index) => (
            <option key={index} value={q}>
              {q}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-600 dark:text-slate-300">
          <svg className="fill-current h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
        </div>
      </div>
    </div>
  );
};