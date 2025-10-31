
import React, { useState, useRef, useCallback } from 'react';
import { MicIcon } from './icons/MicIcon';
import { StopIcon } from './icons/StopIcon';
import { SendIcon } from './icons/SendIcon';

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
    <form onSubmit={handleSubmit} className="p-6 bg-white dark:bg-slate-800 rounded-lg shadow-lg">
      <h3 className="text-lg font-semibold mb-3 text-slate-700 dark:text-slate-200">Your Answer</h3>
      <div className="mb-4">
        <textarea
          value={textAnswer}
          onChange={(e) => setTextAnswer(e.target.value)}
          placeholder="Type your answer here, or use the microphone to record your voice."
          className="w-full h-32 p-3 border border-slate-300 dark:border-slate-600 rounded-md focus:ring-2 focus:ring-brand-secondary focus:border-brand-secondary transition duration-150 bg-gray-50 dark:bg-slate-700 text-slate-900 dark:text-slate-100"
          disabled={isLoading}
        />
      </div>
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={isRecording ? handleStopRecording : handleStartRecording}
            disabled={isLoading}
            className={`flex items-center justify-center w-12 h-12 rounded-full text-white shadow-md transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-slate-800 ${recordButtonClass}`}
          >
            {isRecording ? <StopIcon className="w-6 h-6" /> : <MicIcon className="w-6 h-6" />}
          </button>
          <div className="text-sm text-slate-500 dark:text-slate-400">
            {isRecording && <p className="animate-pulse">Recording...</p>}
            {audioBlob && !isRecording && <p className="text-green-600 dark:text-green-400 font-medium">Audio ready!</p>}
          </div>
        </div>
        <button
          type="submit"
          disabled={isLoading || (!textAnswer && !audioBlob)}
          className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-brand-primary hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-slate-800 focus:ring-brand-primary disabled:bg-slate-400 dark:disabled:bg-slate-600 disabled:cursor-not-allowed transition"
        >
          <SendIcon className="w-5 h-5 mr-2" />
          {isLoading ? 'Evaluating...' : 'Evaluate Answer'}
        </button>
      </div>
    </form>
  );
};
