import { motion } from 'framer-motion';

interface MobileDialogueProps {
  text: string;
  heroPortrait: string;
  onComplete: () => void;
}

export default function MobileDialogue({ text, heroPortrait, onComplete }: MobileDialogueProps) {
  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      transition={{
        y: { type: 'spring', stiffness: 200, damping: 20 },
        opacity: { duration: 0.4 }
      }}
      onAnimationComplete={() => {
        setTimeout(onComplete, 4000);
      }}
      style={{
        position: 'fixed',
        bottom: '20px',
        left: '16px',
        right: '16px',
        zIndex: 150,
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}
    >
      <div
        style={{
          width: '48.3px',
          height: '48.3px',
          flexShrink: 0,
          background: '#ffffff',
          padding: '2px',
          imageRendering: 'pixelated',
          borderRadius: '50%',
          boxShadow: '0 0 12px rgba(255, 255, 255, 0.4)'
        }}
      >
        <div
          style={{
            width: '100%',
            height: '100%',
            background: 'rgba(0, 0, 0, 0.9)',
            borderRadius: '50%',
            imageRendering: 'pixelated',
            overflow: 'hidden'
          }}
        >
          <img
            src={heroPortrait}
            alt="Hero"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              imageRendering: 'pixelated',
              transform: 'scale(1.15)',
              transformOrigin: 'center'
            }}
          />
        </div>
      </div>

      <div
        style={{
          background: '#000000',
          border: '2px solid #FFFFFF',
          borderRadius: '20px',
          padding: '10px 14px',
          flex: 1,
          imageRendering: 'pixelated',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.6)'
        }}
      >
        <p
          style={{
            fontFamily: "'Press Start 2P', monospace",
            fontSize: '0.7rem',
            lineHeight: '1.5',
            color: '#FFFFFF',
            margin: 0,
            textShadow: 'none',
            imageRendering: 'pixelated',
            WebkitFontSmoothing: 'none',
            MozOsxFontSmoothing: 'grayscale'
          }}
        >
          {text}
        </p>
      </div>
    </motion.div>
  );
}
