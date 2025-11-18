import React from 'react';
import { EvaluationResponse } from '../types.ts';
import { ScoreBar } from './ScoreBar.tsx';
import { ThumbsUpIcon } from './icons/ThumbsUpIcon.tsx';
import { ThumbsDownIcon } from './icons/ThumbsDownIcon.tsx';
import { InfoIcon } from './icons/InfoIcon.tsx';
import { SparkleIcon } from './icons/SparkleIcon.tsx';
import { AudioPlayer } from './AudioPlayer.tsx';
import { MicIcon } from './icons/MicIcon.tsx';

interface EvaluationResultProps {
  result: EvaluationResponse;
  audioBlob: Blob | null;
}

const ResultCard: React.FC<{ title: string; children: React.ReactNode; icon: React.ReactNode }> = ({ title, children, icon }) => (
    <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-200/50 dark:border-slate-700/50 p-6 sm:p-8 hover:shadow-2xl transition-all duration-300 animate-slideUp">
        <div className="flex items-center mb-4 pb-3 border-b border-slate-200 dark:border-slate-700">
            <div className="p-2 bg-gradient-to-br from-brand-secondary/20 to-brand-primary/20 rounded-lg">
                {icon}
            </div>
            <h4 className="text-xl font-bold ml-3 text-slate-800 dark:text-slate-100">{title}</h4>
        </div>
        {children}
    </div>
);


export const EvaluationResult: React.FC<EvaluationResultProps> = ({ result, audioBlob }) => {
  const { feedback, score_summary, speech_delivery, follow_up_questions } = result;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ResultCard title="Overall Score" icon={<InfoIcon className="h-6 w-6 text-brand-secondary"/>}>
            <div className="text-center py-4">
              <div className="inline-block p-6 bg-gradient-to-br from-brand-secondary/10 to-brand-primary/10 rounded-2xl mb-4">
                <p className="text-6xl font-extrabold bg-gradient-to-r from-brand-primary to-brand-secondary bg-clip-text text-transparent dark:from-blue-400 dark:to-indigo-300">
                  {score_summary.overall_score.toFixed(1)}
                </p>
                <p className="text-2xl text-slate-400 dark:text-slate-500 mt-1">/10</p>
              </div>
              <p className="text-slate-600 dark:text-slate-300 font-medium">A summary of your performance</p>
            </div>
          </ResultCard>
          <ResultCard title="Score Breakdown" icon={<InfoIcon className="h-6 w-6 text-brand-secondary"/>}>
            <div className="space-y-4">
                <ScoreBar label="Formality" score={score_summary.formality_score} />
                <ScoreBar label="Grammar" score={score_summary.grammar_score} />
                <ScoreBar label="Technical" score={score_summary.technical_score} />
                <ScoreBar label="Speech Delivery" score={score_summary.speech_delivery_score} />
            </div>
          </ResultCard>
      </div>
      
      <ResultCard title="Detailed Feedback" icon={<InfoIcon className="h-6 w-6 text-brand-secondary"/>}>
        <div className="space-y-5 text-slate-600 dark:text-slate-300">
            <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border-l-4 border-brand-secondary">
                <h5 className="font-bold text-slate-800 dark:text-slate-100 mb-2">Formality: <span className="font-semibold text-brand-secondary">{result.formality}</span></h5>
                <p className="leading-relaxed">{feedback.formality_explanation}</p>
            </div>
             <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border-l-4 border-green-500">
                <h5 className="font-bold text-slate-800 dark:text-slate-100 mb-2">Grammar: <span className="font-semibold text-green-600 dark:text-green-400">{result.grammar}</span></h5>
                <p className="leading-relaxed">{feedback.grammar_explanation}</p>
            </div>
             <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl border-l-4 border-purple-500">
                <h5 className="font-bold text-slate-800 dark:text-slate-100 mb-2">Technical Correctness: <span className="font-semibold text-purple-600 dark:text-purple-400">{result.technical_correctness}</span></h5>
                <p className="leading-relaxed">{feedback.technical_explanation}</p>
            </div>
        </div>
      </ResultCard>

      {audioBlob && (
        <ResultCard title="Vocal Response Playback" icon={<MicIcon className="h-6 w-6 text-brand-secondary"/>}>
            <AudioPlayer audioBlob={audioBlob} />
        </ResultCard>
      )}

      {speech_delivery.clarity !== 'N/A' && (
        <ResultCard title="Speech Delivery Analysis" icon={<InfoIcon className="h-6 w-6 text-brand-secondary"/>}>
            <div className="space-y-5">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <SpeechMetric label="Clarity" value={speech_delivery.clarity} isGood={speech_delivery.clarity === 'Clear'} />
                    <SpeechMetric label="Confidence" value={speech_delivery.confidence} isGood={speech_delivery.confidence === 'Confident'} />
                    <SpeechMetric label="Pronunciation" value={speech_delivery.pronunciation} isGood={speech_delivery.pronunciation === 'Correct'} />
                    <SpeechMetric label="Tone" value={speech_delivery.tone} isGood={speech_delivery.tone === 'Appropriate'} />
                </div>
                <div className="space-y-4 pt-5 border-t border-slate-200 dark:border-slate-700">
                  {speech_delivery.tone_feedback && speech_delivery.tone_feedback !== 'N/A' && (
                    <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                        <h5 className="font-bold text-slate-800 dark:text-slate-100 mb-2">Detailed Tone Analysis</h5>
                        <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{speech_delivery.tone_feedback}</p>
                    </div>
                  )}
                  <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl border-l-4 border-amber-500">
                      <h5 className="font-bold text-slate-800 dark:text-slate-100 mb-2">Overall Vocal Feedback</h5>
                      <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{speech_delivery.feedback}</p>
                  </div>
                </div>
            </div>
        </ResultCard>
      )}

      {follow_up_questions && follow_up_questions.length > 0 && (
        <ResultCard title="Suggested Follow-Up Questions" icon={<SparkleIcon className="h-6 w-6 text-brand-secondary"/>}>
            <ul className="space-y-3 text-slate-600 dark:text-slate-300">
                {follow_up_questions.map((question, index) => (
                    <li key={index} className="flex items-start gap-3 p-3 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-700/50 dark:to-slate-800/50 rounded-lg hover:shadow-md transition-all duration-200">
                        <span className="flex-shrink-0 w-6 h-6 bg-gradient-to-br from-brand-secondary to-brand-primary rounded-full text-white text-xs font-bold flex items-center justify-center mt-0.5">
                            {index + 1}
                        </span>
                        <span className="flex-1 leading-relaxed">{question}</span>
                    </li>
                ))}
            </ul>
        </ResultCard>
      )}
    </div>
  );
};

interface SpeechMetricProps {
    label: string;
    value: string;
    isGood: boolean;
}

const SpeechMetric: React.FC<SpeechMetricProps> = ({ label, value, isGood }) => (
    <div className={`flex flex-col items-center p-4 rounded-xl transition-all duration-200 hover:scale-105 ${
        isGood 
            ? 'bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 border-2 border-green-200 dark:border-green-700' 
            : 'bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/30 dark:to-orange-900/30 border-2 border-red-200 dark:border-red-700'
    }`}>
        <p className="text-xs font-semibold text-slate-600 dark:text-slate-300 mb-2 uppercase tracking-wide">{label}</p>
        <div className={`flex items-center font-bold text-sm ${isGood ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
            {isGood ? <ThumbsUpIcon className="h-5 w-5 mr-1.5" /> : <ThumbsDownIcon className="h-5 w-5 mr-1.5" />}
            <span>{value}</span>
        </div>
    </div>
);