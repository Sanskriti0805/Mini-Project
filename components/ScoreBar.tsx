
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
         <div className="flex items-center gap-3">
            <span className="w-28 text-sm font-semibold text-slate-500 dark:text-slate-400">{label}</span>
            <div className="flex-1 bg-gray-200 dark:bg-slate-700 rounded-full h-3 relative overflow-hidden">
                <div className="bg-slate-400 h-3 rounded-full" style={{ width: `100%` }}></div>
            </div>
            <span className="w-12 text-right text-sm font-semibold text-slate-500 dark:text-slate-400">N/A</span>
        </div>
      );
  }

  return (
    <div className="flex items-center gap-3">
      <span className="w-28 text-sm font-semibold text-slate-700 dark:text-slate-200">{label}</span>
      <div className="flex-1 bg-gray-200 dark:bg-slate-700 rounded-full h-3 relative overflow-hidden shadow-inner">
        <div 
          className={`${colorClass} h-3 rounded-full transition-all duration-700 ease-out shadow-sm relative`} 
          style={{ width: `${percentage}%` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
        </div>
      </div>
      <span className="w-12 text-right text-sm font-bold text-slate-700 dark:text-slate-200">{score.toFixed(1)}/10</span>
    </div>
  );
};
