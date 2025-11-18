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
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6">
        <div className="flex items-center mb-3">
            {icon}
            <h4 className="text-lg font-semibold ml-2 text-slate-800 dark:text-slate-100">{title}</h4>
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
            <div className="text-center">
              <p className="text-5xl font-bold text-brand-primary dark:text-brand-light">{score_summary.overall_score.toFixed(1)}<span className="text-2xl text-slate-400">/10</span></p>
              <p className="text-slate-500 dark:text-slate-400 mt-2">A summary of your performance.</p>
            </div>
          </ResultCard>
          <ResultCard title="Score Breakdown" icon={<InfoIcon className="h-6 w-6 text-brand-secondary"/>}>
            <div className="space-y-3">
                <ScoreBar label="Formality" score={score_summary.formality_score} />
                <ScoreBar label="Grammar" score={score_summary.grammar_score} />
                <ScoreBar label="Technical" score={score_summary.technical_score} />
                <ScoreBar label="Speech Delivery" score={score_summary.speech_delivery_score} />
            </div>
          </ResultCard>
      </div>
      
      <ResultCard title="Detailed Feedback" icon={<InfoIcon className="h-6 w-6 text-brand-secondary"/>}>
        <div className="space-y-4 text-slate-600 dark:text-slate-300">
            <div>
                <h5 className="font-semibold text-slate-700 dark:text-slate-200">Formality: <span className="font-normal">{result.formality}</span></h5>
                <p>{feedback.formality_explanation}</p>
            </div>
             <div>
                <h5 className="font-semibold text-slate-700 dark:text-slate-200">Grammar: <span className="font-normal">{result.grammar}</span></h5>
                <p>{feedback.grammar_explanation}</p>
            </div>
             <div>
                <h5 className="font-semibold text-slate-700 dark:text-slate-200">Technical Correctness: <span className="font-normal">{result.technical_correctness}</span></h5>
                <p>{feedback.technical_explanation}</p>
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
            <div className="space-y-4">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                    <SpeechMetric label="Clarity" value={speech_delivery.clarity} isGood={speech_delivery.clarity === 'Clear'} />
                    <SpeechMetric label="Confidence" value={speech_delivery.confidence} isGood={speech_delivery.confidence === 'Confident'} />
                    <SpeechMetric label="Pronunciation" value={speech_delivery.pronunciation} isGood={speech_delivery.pronunciation === 'Correct'} />
                    <SpeechMetric label="Tone" value={speech_delivery.tone} isGood={speech_delivery.tone === 'Appropriate'} />
                </div>
                <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                  {speech_delivery.tone_feedback && speech_delivery.tone_feedback !== 'N/A' && (
                    <div>
                        <h5 className="font-semibold text-slate-700 dark:text-slate-200">Detailed Tone Analysis</h5>
                        <p className="text-slate-600 dark:text-slate-300">{speech_delivery.tone_feedback}</p>
                    </div>
                  )}
                  <div>
                      <h5 className="font-semibold text-slate-700 dark:text-slate-200">Overall Vocal Feedback</h5>
                      <p className="text-slate-600 dark:text-slate-300">{speech_delivery.feedback}</p>
                  </div>
                </div>
            </div>
        </ResultCard>
      )}

      {follow_up_questions && follow_up_questions.length > 0 && (
        <ResultCard title="Suggested Follow-Up Questions" icon={<SparkleIcon className="h-6 w-6 text-brand-secondary"/>}>
            <ul className="space-y-2 list-disc list-inside text-slate-600 dark:text-slate-300">
                {follow_up_questions.map((question, index) => (
                    <li key={index}>{question}</li>
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
    <div className="flex flex-col items-center p-3 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</p>
        <div className={`flex items-center mt-1 font-semibold ${isGood ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
            {isGood ? <ThumbsUpIcon className="h-5 w-5 mr-1" /> : <ThumbsDownIcon className="h-5 w-5 mr-1" />}
            <span>{value}</span>
        </div>
    </div>
);