import React, { useState, useMemo } from 'react';
import { EvaluationHistoryItem } from '../types.ts';
import { EvaluationResult } from './EvaluationResult.tsx';
import { dataUrlToBlob } from '../utils/blobUtils.ts';
import { ChevronDownIcon } from './icons/ChevronDownIcon.tsx';

interface HistoryItemProps {
  item: EvaluationHistoryItem;
}

export const HistoryItem: React.FC<HistoryItemProps> = ({ item }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const audioBlob = useMemo(() => (item.audioDataUrl ? dataUrlToBlob(item.audioDataUrl) : null), [item.audioDataUrl]);

  const overallScore = item.evaluation.score_summary.overall_score.toFixed(1);
  
  const getScoreColor = (score: number) => {
    if (score < 4) return 'text-red-500 dark:text-red-400';
    if (score < 7) return 'text-yellow-500 dark:text-yellow-400';
    return 'text-green-500 dark:text-green-400';
  };

  return (
    <div className="border border-slate-200 dark:border-slate-700 rounded-lg">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full text-left p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition duration-150 flex justify-between items-center"
        aria-expanded={isExpanded}
      >
        <div className="flex-1 overflow-hidden">
          <p className="font-semibold text-slate-800 dark:text-slate-100 truncate pr-4">{item.question}</p>
          <div className="text-sm text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-4">
            <span>{new Date(item.submittedAt).toLocaleString()}</span>
            <span className={`font-bold ${getScoreColor(Number(overallScore))}`}>
              Score: {overallScore}/10
            </span>
          </div>
        </div>
        <ChevronDownIcon
          className={`w-6 h-6 text-slate-500 transform transition-transform ${
            isExpanded ? 'rotate-180' : ''
          }`}
        />
      </button>
      {isExpanded && (
        <div className="p-4 border-t border-slate-200 dark:border-slate-700">
          <EvaluationResult result={item.evaluation} audioBlob={audioBlob} />
        </div>
      )}
    </div>
  );
};
