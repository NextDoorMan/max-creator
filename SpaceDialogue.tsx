import { motion } from 'framer-motion';

interface SpaceDialogueProps {
  text: string;
  heroPortrait: string;
  onComplete: () => void;
}

export default function SpaceDialogue({ text, heroPortrait, onComplete }: SpaceDialogueProps) {
  return (
    <motion.div
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{
        y: { type: 'spring', stiffness: 200, damping: 20 },
        opacity: { duration: 0.4 }
      }}
      onAnimationComplete={() => {
        setTimeout(onComplete, 2500);
      }}
      style={{
        position: 'fixed',
        top: '85px',
        left: '12px',  
        transform: 'none',
        zIndex: 150,
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        maxWidth: 'calc(100vw - 32px)',
        padding: '0 16px'
      }}
    >
      <div
        style={{
          width: '42px',
          height: '42px',
          flexShrink: 0,
          background: '#ffffff',
          padding: '2px',
          imageRendering: 'pixelated',
          clipPath: `polygon(
            0 8px, 2px 8px, 2px 6px, 4px 6px, 4px 4px, 6px 4px, 6px 2px, 8px 2px, 8px 0,
            calc(100% - 8px) 0, calc(100% - 8px) 2px, calc(100% - 6px) 2px, calc(100% - 6px) 4px,
            calc(100% - 4px) 4px, calc(100% - 4px) 6px, calc(100% - 2px) 6px, calc(100% - 2px) 8px, 100% 8px,
            100% calc(100% - 8px), calc(100% - 2px) calc(100% - 8px), calc(100% - 2px) calc(100% - 6px),
            calc(100% - 4px) calc(100% - 6px), calc(100% - 4px) calc(100% - 4px), calc(100% - 6px) calc(100% - 4px),
            calc(100% - 6px) calc(100% - 2px), calc(100% - 8px) calc(100% - 2px), calc(100% - 8px) 100%,
            8px 100%, 8px calc(100% - 2px), 6px calc(100% - 2px), 6px calc(100% - 4px),
            4px calc(100% - 4px), 4px calc(100% - 6px), 2px calc(100% - 6px), 2px calc(100% - 8px), 0 calc(100% - 8px)
          )`,
          boxShadow: '0 0 12px rgba(255, 255, 255, 0.4)'
        }}
      >
        <div
          style={{
            width: '100%',
            height: '100%',
            background: 'rgba(0, 0, 0, 0.9)',
            clipPath: `polygon(
              0 6px, 2px 6px, 2px 4px, 4px 4px, 4px 2px, 6px 2px, 6px 0,
              calc(100% - 6px) 0, calc(100% - 6px) 2px, calc(100% - 4px) 2px, calc(100% - 4px) 4px,
              calc(100% - 2px) 4px, calc(100% - 2px) 6px, 100% 6px,
              100% calc(100% - 6px), calc(100% - 2px) calc(100% - 6px), calc(100% - 2px) calc(100% - 4px),
              calc(100% - 4px) calc(100% - 4px), calc(100% - 4px) calc(100% - 2px), calc(100% - 6px) calc(100% - 2px),
              calc(100% - 6px) 100%, 6px 100%, 6px calc(100% - 2px), 4px calc(100% - 2px),
              4px calc(100% - 4px), 2px calc(100% - 4px), 2px calc(100% - 6px), 0 calc(100% - 6px)
            )`,
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
          borderRadius: '8px',
          padding: '8px 12px',
          maxWidth: '300px',
          imageRendering: 'pixelated'
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
