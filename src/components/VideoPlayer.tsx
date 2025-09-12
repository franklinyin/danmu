import React, { useRef, useState, useEffect } from 'react';
import { formatTime } from '../utils';
import DanmuContainer from './DanmuContainer';
import { Danmu } from '../types';

interface VideoPlayerProps {
  danmus: Danmu[];
  isDanmuEnabled: boolean;
  onSeek?: () => void;
  videoUrl?: string;
}

export default function VideoPlayer({ danmus, isDanmuEnabled, onSeek, videoUrl }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const danmuContainerRef = useRef<HTMLDivElement>(null);
  const progressContainerRef = useRef<HTMLDivElement>(null);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateTime = () => {
      setCurrentTime(video.currentTime);
      setDuration(video.duration || 0);
      const percent = video.duration ? (video.currentTime / video.duration) * 100 : 0;
      setProgress(percent);
    };

    const handleSeek = () => {
      clearActiveDanmus();
      checkDanmuAtCurrentTime();
      if (onSeek) onSeek();
    };

    video.addEventListener('timeupdate', updateTime);
    video.addEventListener('seeked', handleSeek);
    video.addEventListener('loadedmetadata', updateTime);

    return () => {
      video.removeEventListener('timeupdate', updateTime);
      video.removeEventListener('seeked', handleSeek);
      video.removeEventListener('loadedmetadata', updateTime);
    };
  }, [danmus, onSeek]);

  // Load video when videoUrl changes
  useEffect(() => {
    if (videoUrl) {
      loadVideo(videoUrl);
    }
  }, [videoUrl]);

  const clearActiveDanmus = () => {
    if (!danmuContainerRef.current) return;
    
    const activeDanmus = danmuContainerRef.current.querySelectorAll('.danmu');
    activeDanmus.forEach(danmu => danmu.remove());
    
    // Reset displayed status of all danmus
    danmus.forEach(danmu => {
      danmu.displayed = false;
    });
  };

  const checkDanmuAtCurrentTime = () => {
    // This is handled by DanmuContainer component
  };

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const setProgressTime = (e: React.MouseEvent<HTMLDivElement>) => {
    const container = progressContainerRef.current;
    const video = videoRef.current;
    if (!container || !video) return;

    const width = container.clientWidth;
    const clickX = e.nativeEvent.offsetX;
    const newTime = (clickX / width) * duration;
    video.currentTime = newTime;
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video) return;

    const newVolume = parseFloat(e.target.value);
    video.volume = newVolume;
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const toggleFullscreen = async () => {
    const video = videoRef.current;
    if (!video) return;

    try {
      if (!document.fullscreenElement) {
        await video.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (err) {
      alert(`Fullscreen error: ${(err as Error).message}`);
    }
  };

  const loadVideo = (videoUrl: string) => {
    const video = videoRef.current;
    if (!video || !videoUrl) return;

    video.src = videoUrl;
    video.load();
  };

  return (
    <div className="player-container" style={{
      width: '800px',
      position: 'relative',
      backgroundColor: '#000',
      borderRadius: '4px',
      boxShadow: '0 0 10px rgba(0, 0, 0, 0.3)'
    }}>
      <video
        ref={videoRef}
        style={{
          width: '100%',
          display: 'block',
          borderRadius: '4px 4px 0 0'
        }}
        onClick={togglePlay}
      />
      
      <DanmuContainer 
        danmus={danmus}
        currentTime={currentTime}
        isEnabled={isDanmuEnabled}
        containerRef={danmuContainerRef}
      />
      
      <div style={{
        backgroundColor: '#222',
        padding: '10px',
        display: 'flex',
        alignItems: 'center',
        borderRadius: '0 0 4px 4px'
      }}>
        <button
          onClick={togglePlay}
          style={{
            background: 'none',
            border: 'none',
            color: '#fff',
            cursor: 'pointer',
            fontSize: '16px',
            margin: '0 5px',
            outline: 'none'
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = '#00a1d6'}
          onMouseLeave={(e) => e.currentTarget.style.color = '#fff'}
        >
          {isPlaying ? '❚❚' : '▶'}
        </button>
        
        <div
          ref={progressContainerRef}
          onClick={setProgressTime}
          style={{
            flexGrow: 1,
            height: '4px',
            backgroundColor: '#444',
            margin: '0 10px',
            borderRadius: '2px',
            cursor: 'pointer',
            position: 'relative'
          }}
        >
          <div style={{
            height: '100%',
            backgroundColor: '#00a1d6',
            borderRadius: '2px',
            width: `${progress}%`
          }} />
        </div>
        
        <div style={{
          color: '#fff',
          fontSize: '12px',
          minWidth: '80px',
          textAlign: 'center'
        }}>
          {formatTime(currentTime)} / {formatTime(duration)}
        </div>
        
        <button
          onClick={toggleFullscreen}
          style={{
            background: 'none',
            border: 'none',
            color: '#fff',
            cursor: 'pointer',
            fontSize: '16px',
            margin: '0 5px',
            outline: 'none'
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = '#00a1d6'}
          onMouseLeave={(e) => e.currentTarget.style.color = '#fff'}
        >
          ⛶
        </button>
        
        <div style={{
          display: 'flex',
          alignItems: 'center',
          marginLeft: '10px'
        }}>
          <button
            onClick={toggleMute}
            style={{
              background: 'none',
              border: 'none',
              color: '#fff',
              cursor: 'pointer',
              fontSize: '16px',
              margin: '0 5px',
              outline: 'none'
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#00a1d6'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#fff'}
          >
            {isMuted ? '🔇' : '🔊'}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={volume}
            onChange={handleVolumeChange}
            style={{
              width: '60px',
              marginLeft: '5px'
            }}
          />
        </div>
      </div>
      
    </div>
  );
}