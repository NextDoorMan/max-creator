import { Volume2, VolumeX } from 'lucide-react';
import { useEffect, useState } from 'react';
import { audioManager } from '../utils/audioManager';

export default function MuteButton() {
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
    <button
      onClick={handleToggle}
      className="fixed top-6 left-6 p-4 bg-black border-2 border-cyan-400 pixel-corners transition-all duration-300 hover:border-pink-500"
      style={{
        boxShadow: isMuted
          ? '0 0 20px rgba(255, 16, 240, 0.6)'
          : '0 0 20px rgba(0, 240, 255, 0.6)',
        imageRendering: 'pixelated',
        zIndex: 9999
      }}
      aria-label={isMuted ? 'Unmute' : 'Mute'}
    >
      {isMuted ? (
        <VolumeX
          className="w-8 h-8 neon-pink"
          strokeWidth={2}
        />
      ) : (
        <Volume2
          className="w-8 h-8 neon-blue"
          strokeWidth={2}
        />
      )}
    </button>
  );
}
