import React, { useState, useRef, useEffect } from 'react';
import { PlayIcon } from './icons/PlayIcon';
import { PauseIcon } from './icons/PauseIcon';

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
        <div className="flex items-center gap-4 w-full">
            <audio ref={audioRef} preload="metadata"></audio>
            <button
                onClick={togglePlayPause}
                className="flex items-center justify-center w-12 h-12 rounded-full bg-brand-secondary text-white flex-shrink-0 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-slate-800 focus:ring-blue-500 transition"
                aria-label={isPlaying ? 'Pause' : 'Play'}
            >
                {isPlaying ? <PauseIcon className="w-6 h-6" /> : <PlayIcon className="w-6 h-6" />}
            </button>
            <div className="flex items-center gap-2 w-full">
                <span className="text-sm text-slate-500 dark:text-slate-400 w-10 text-center">{formatTime(currentTime)}</span>
                <div className="relative w-full h-2">
                    <input
                        type="range"
                        value={currentTime}
                        step="0.01"
                        min="0"
                        max={duration || 0}
                        onChange={handleProgressChange}
                        className="absolute w-full h-2 appearance-none bg-transparent cursor-pointer"
                        aria-label="Audio progress"
                    />
                    <div className="absolute top-0 left-0 w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full pointer-events-none"></div>
                    <div 
                        className="absolute top-0 left-0 h-2 bg-brand-secondary rounded-full pointer-events-none" 
                        style={{ width: `${progressPercentage}%` }}>
                    </div>
                </div>
                <span className="text-sm text-slate-500 dark:text-slate-400 w-10 text-center">{formatTime(duration)}</span>
            </div>
        </div>
    );
};
