import React from 'react';
import { SparkleIcon } from './icons/SparkleIcon';

interface QuestionSelectorProps {
  questions: string[];
  selectedQuestion: string;
  onQuestionChange: (question: string) => void;
  onGenerateQuestion: () => void;
  isGenerating: boolean;
}

export const QuestionSelector: React.FC<QuestionSelectorProps> = ({ questions, selectedQuestion, onQuestionChange, onGenerateQuestion, isGenerating }) => {
  return (
    <div className="mb-6 p-6 bg-white dark:bg-slate-800 rounded-lg shadow-lg">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-3">
        <label htmlFor="question-select" className="block text-lg font-semibold text-slate-700 dark:text-slate-200">
          Select a Question to Answer
        </label>
        <button
          type="button"
          onClick={onGenerateQuestion}
          disabled={isGenerating}
          className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-brand-secondary hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-slate-800 focus:ring-brand-secondary disabled:bg-slate-400 dark:disabled:bg-slate-600 disabled:cursor-not-allowed transition"
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
          className="block w-full px-4 py-3 pr-8 text-base text-slate-900 dark:text-slate-100 bg-gray-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-secondary focus:border-brand-secondary appearance-none"
        >
          {questions.map((q, index) => (
            <option key={index} value={q}>
              {q}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-700 dark:text-slate-300">
          <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
        </div>
      </div>
    </div>
  );
};