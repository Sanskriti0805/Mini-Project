import React, { useState, useRef, useEffect } from 'react';
import { PlayIcon } from './icons/PlayIcon.tsx';
import { PauseIcon } from './icons/PauseIcon.tsx';

interface AudioPlayerProps {
    audioBlob: Blob;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({ audioBlob }) => {
    const audioRef = useRef<HTMLAudioElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio || !audioBlob) return;

        const objectUrl = URL.createObjectURL(audioBlob);
        audio.src = objectUrl;

        const setAudioData = () => {
            if (isFinite(audio.duration)) {
                setDuration(audio.duration);
            }
            setCurrentTime(audio.currentTime);
        };

        const setAudioTime = () => setCurrentTime(audio.currentTime);
        const onEnded = () => setIsPlaying(false);

        audio.addEventListener('loadedmetadata', setAudioData);
        audio.addEventListener('timeupdate', setAudioTime);
        audio.addEventListener('ended', onEnded);

        return () => {
            audio.removeEventListener('loadedmetadata', setAudioData);
            audio.removeEventListener('timeupdate', setAudioTime);
            audio.removeEventListener('ended', onEnded);
            URL.revokeObjectURL(objectUrl);
        };
    }, [audioBlob]);

    const togglePlayPause = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (audioRef.current) {
            const newTime = Number(e.target.value);
            audioRef.current.currentTime = newTime;
            setCurrentTime(newTime);
        }
    };
    
    const formatTime = (time: number) => {
        if (isNaN(time)) return '0:00';
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

    return (
        <div className="flex items-center gap-4 w-full p-4 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-700/50 dark:to-slate-800/50 rounded-xl">
            <audio ref={audioRef} preload="metadata"></audio>
            <button
                onClick={togglePlayPause}
                className="flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-brand-secondary to-brand-primary text-white flex-shrink-0 hover:from-blue-600 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-slate-800 focus:ring-brand-secondary transition-all duration-200 transform hover:scale-110 active:scale-95 shadow-lg"
                aria-label={isPlaying ? 'Pause' : 'Play'}
            >
                {isPlaying ? <PauseIcon className="w-7 h-7" /> : <PlayIcon className="w-7 h-7 ml-0.5" />}
            </button>
            <div className="flex items-center gap-3 w-full">
                <span className="text-sm font-semibold text-slate-600 dark:text-slate-300 w-12 text-center tabular-nums">{formatTime(currentTime)}</span>
                <div className="relative w-full h-3 group">
                    <input
                        type="range"
                        value={currentTime}
                        step="0.01"
                        min="0"
                        max={duration || 0}
                        onChange={handleProgressChange}
                        className="absolute w-full h-3 appearance-none bg-transparent cursor-pointer z-10 opacity-0 group-hover:opacity-100 transition-opacity"
                        aria-label="Audio progress"
                    />
                    <div className="absolute top-0 left-0 w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full shadow-inner"></div>
                    <div 
                        className="absolute top-0 left-0 h-3 bg-gradient-to-r from-brand-secondary to-brand-primary rounded-full shadow-sm transition-all duration-100" 
                        style={{ width: `${progressPercentage}%` }}>
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </div>
                </div>
                <span className="text-sm font-semibold text-slate-600 dark:text-slate-300 w-12 text-center tabular-nums">{formatTime(duration)}</span>
            </div>
        </div>
    );
};