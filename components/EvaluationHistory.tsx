import React from 'react';
import { EvaluationHistoryItem as EvaluationHistoryItemType } from '../types.ts';
import { HistoryItem } from './HistoryItem.tsx';
import { HistoryIcon } from './icons/HistoryIcon.tsx';
import { TrashIcon } from './icons/TrashIcon.tsx';

interface EvaluationHistoryProps {
  history: EvaluationHistoryItemType[];
  onClearHistory: () => void;
}

export const EvaluationHistory: React.FC<EvaluationHistoryProps> = ({ history, onClearHistory }) => {
  return (
    <div className="p-6 bg-white dark:bg-slate-800 rounded-lg shadow-lg">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center">
            <HistoryIcon className="h-7 w-7 text-brand-secondary" />
            <h2 className="text-2xl font-bold ml-2 text-slate-700 dark:text-slate-200">Evaluation History</h2>
        </div>
        {history.length > 0 && (
            <button
                onClick={onClearHistory}
                className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 border border-red-500 text-sm font-medium rounded-md shadow-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/40 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-slate-800 focus:ring-red-500 transition"
            >
                <TrashIcon className="w-5 h-5 mr-2" />
                Clear History
            </button>
        )}
      </div>
      
      {history.length === 0 ? (
        <p className="text-center text-slate-500 dark:text-slate-400 py-8">
            No past evaluations found. Complete an evaluation to see your history here.
        </p>
      ) : (
        <div className="space-y-3">
          {history.map(item => (
            <HistoryItem key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
};
