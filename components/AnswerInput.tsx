import React, { useState, useRef, useCallback } from 'react';
import { MicIcon } from './icons/MicIcon.tsx';
import { StopIcon } from './icons/StopIcon.tsx';
import { SendIcon } from './icons/SendIcon.tsx';

interface AnswerInputProps {
  onEvaluate: (textAnswer: string, audioBlob: Blob | null) => void;
  isLoading: boolean;
}

export const AnswerInput: React.FC<AnswerInputProps> = ({ onEvaluate, isLoading }) => {
  const [textAnswer, setTextAnswer] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const handleStartRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const mimeType = mediaRecorderRef.current?.mimeType || 'audio/webm';
        const blob = new Blob(audioChunksRef.current, { type: mimeType });
        setAudioBlob(blob);
        stream.getTracks().forEach(track => track.stop()); // Stop microphone access
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setAudioBlob(null);
    } catch (err) {
      console.error("Error accessing microphone:", err);
      alert("Could not access microphone. Please ensure permissions are granted.");
    }
  }, []);

  const handleStopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onEvaluate(textAnswer, audioBlob);
  };
  
  const recordButtonClass = isRecording 
    ? "bg-red-600 hover:bg-red-700 focus:ring-red-500"
    : "bg-brand-secondary hover:bg-blue-700 focus:ring-blue-500";
    
  return (
    <form onSubmit={handleSubmit} className="p-6 sm:p-8 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-200/50 dark:border-slate-700/50 hover:shadow-2xl transition-all duration-300">
      <div className="mb-5">
        <h3 className="text-xl font-bold mb-1 text-slate-800 dark:text-slate-100">Your Answer</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">Type your response or record your voice</p>
      </div>
      <div className="mb-5">
        <textarea
          value={textAnswer}
          onChange={(e) => setTextAnswer(e.target.value)}
          placeholder="Type your answer here, or use the microphone to record your voice..."
          className="w-full h-36 p-4 border-2 border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-brand-secondary focus:border-brand-secondary transition-all duration-200 bg-gradient-to-br from-slate-50 to-white dark:from-slate-700 dark:to-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 resize-none font-medium"
          disabled={isLoading}
        />
      </div>
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={isRecording ? handleStopRecording : handleStartRecording}
            disabled={isLoading}
            className={`flex items-center justify-center w-14 h-14 rounded-full text-white shadow-lg transition-all duration-200 transform hover:scale-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-slate-800 ${recordButtonClass} ${isRecording ? 'animate-pulse' : ''}`}
          >
            {isRecording ? <StopIcon className="w-7 h-7" /> : <MicIcon className="w-7 h-7" />}
          </button>
          <div className="text-sm">
            {isRecording && (
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                <p className="text-red-600 dark:text-red-400 font-semibold">Recording...</p>
              </div>
            )}
            {audioBlob && !isRecording && (
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <p className="text-green-600 dark:text-green-400 font-semibold">Audio ready!</p>
              </div>
            )}
            {!isRecording && !audioBlob && (
              <p className="text-slate-500 dark:text-slate-400">Click to record</p>
            )}
          </div>
        </div>
        <button
          type="submit"
          disabled={isLoading || (!textAnswer && !audioBlob)}
          className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 border border-transparent text-base font-semibold rounded-xl shadow-lg text-white bg-gradient-to-r from-brand-primary to-brand-secondary hover:from-blue-900 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-slate-800 focus:ring-brand-primary disabled:bg-slate-400 dark:disabled:bg-slate-600 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 active:scale-95"
        >
          <SendIcon className="w-5 h-5 mr-2" />
          {isLoading ? 'Evaluating...' : 'Evaluate Answer'}
        </button>
      </div>
    </form>
  );
};