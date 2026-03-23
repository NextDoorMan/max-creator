import { useState, useEffect } from 'react';
import { audioManager } from '../../utils/audioManager';

export const AudioToggle = () => {
  const [isMuted, setIsMuted] = useState(audioManager.getMuted());

  useEffect(() => {
    const unsubscribe = audioManager.subscribe((muted) => {
      setIsMuted(muted);
    });
    return unsubscribe;
  }, []);

  const handleToggle = () => {
    audioManager.toggleMute();
  };

  return (
    <div
      style={{
        position: 'relative',
        width: '44px',
        height: '44px',
        border: '2px solid #FFFFFF',
        background: 'transparent',
        imageRendering: 'pixelated',
        clipPath: 'polygon(0 3px, 3px 3px, 3px 0, calc(100% - 3px) 0, calc(100% - 3px) 3px, 100% 3px, 100% calc(100% - 3px), calc(100% - 3px) calc(100% - 3px), calc(100% - 3px) 100%, 3px 100%, 3px calc(100% - 3px), 0 calc(100% - 3px))'
      }}
    >
      <button
        onClick={handleToggle}
        className="w-full h-full flex items-center justify-center cursor-pointer active:scale-95 transition-transform"
        aria-label={isMuted ? "Unmute" : "Mute"}
        style={{ imageRendering: 'pixelated', touchAction: 'manipulation', background: 'transparent', border: 'none' }}
      >
        <svg
          width="32"
          height="32"
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ imageRendering: 'pixelated' }}
        >
          <rect x="4" y="14" width="4" height="12" fill="#FFFFFF"/>
          <rect x="8" y="12" width="3" height="16" fill="#FFFFFF"/>
          <rect x="11" y="10" width="3" height="20" fill="#FFFFFF"/>
          <rect x="14" y="8" width="4" height="24" fill="#FFFFFF"/>
          <rect x="18" y="10" width="3" height="20" fill="#FFFFFF"/>

          <path d="M22 12 Q26 12 26 20 Q26 28 22 28" stroke="#FFFFFF" strokeWidth="2" fill="none"/>
          <path d="M26 8 Q32 8 32 20 Q32 32 26 32" stroke="#FFFFFF" strokeWidth="2" fill="none"/>

          {isMuted && (
            <>
              <rect x="8" y="8" width="3" height="3" fill="#FF1493"/>
              <rect x="11" y="11" width="3" height="3" fill="#FF1493"/>
              <rect x="14" y="14" width="3" height="3" fill="#FF1493"/>
              <rect x="17" y="17" width="3" height="3" fill="#FF1493"/>
              <rect x="20" y="20" width="3" height="3" fill="#FF1493"/>
              <rect x="23" y="23" width="3" height="3" fill="#FF1493"/>
              <rect x="26" y="26" width="3" height="3" fill="#FF1493"/>
              <rect x="29" y="29" width="3" height="3" fill="#FF1493"/>
            </>
          )}
        </svg>
      </button>
    </div>
  );
};
