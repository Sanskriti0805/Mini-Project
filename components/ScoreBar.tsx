
import React from 'react';

interface ScoreBarProps {
  label: string;
  score: number;
}

export const ScoreBar: React.FC<ScoreBarProps> = ({ label, score }) => {
  const percentage = (score / 10) * 100;
  
  const getColor = (s: number) => {
    if (s < 4) return 'bg-red-500';
    if (s < 7) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const colorClass = getColor(score);
  
  // Disable for speech delivery if score is 0 (as it may mean N/A)
  if (label === 'Speech Delivery' && score === 0) {
      return (
         <div className="flex items-center">
            <span className="w-32 text-sm font-medium text-slate-500 dark:text-slate-400">{label}</span>
            <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2.5">
                <div className="bg-slate-400 h-2.5 rounded-full" style={{ width: `100%` }}></div>
            </div>
            <span className="ml-3 text-sm font-semibold text-slate-500 dark:text-slate-400">N/A</span>
        </div>
      );
  }

  return (
    <div className="flex items-center">
      <span className="w-32 text-sm font-medium text-slate-700 dark:text-slate-300">{label}</span>
      <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-4 relative">
        <div className={`${colorClass} h-4 rounded-full transition-all duration-500 ease-out`} style={{ width: `${percentage}%` }}></div>
      </div>
      <span className="ml-3 w-8 text-right text-sm font-semibold text-slate-700 dark:text-slate-200">{score}/10</span>
    </div>
  );
};
