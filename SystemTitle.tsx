import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface SystemTitleProps {
  lines: string[];
  onComplete: () => void;
  show: boolean;
}

export default function SystemTitle({ lines, onComplete, show }: SystemTitleProps) {
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [isBlinking, setIsBlinking] = useState(false);
  const [hasCompleted, setHasCompleted] = useState(false);

  useEffect(() => {
    if (!show) {
      setCurrentLineIndex(0);
      setCurrentCharIndex(0);
      setIsBlinking(false);
      setHasCompleted(false);
      return;
    }

    const charSpeed = 80;
    const lineDelay = 400;

    if (currentLineIndex < lines.length) {
      const currentLine = lines[currentLineIndex];

      if (currentCharIndex < currentLine.length) {
        const timer = setTimeout(() => {
          setCurrentCharIndex(prev => prev + 1);
        }, charSpeed);
        return () => clearTimeout(timer);
      } else if (currentLineIndex < lines.length - 1) {
        const timer = setTimeout(() => {
          setCurrentLineIndex(prev => prev + 1);
          setCurrentCharIndex(0);
        }, lineDelay);
        return () => clearTimeout(timer);
      } else {
        const blinkTimer = setTimeout(() => {
          setIsBlinking(true);
        }, 2000);
        return () => clearTimeout(blinkTimer);
      }
    }
  }, [show, currentLineIndex, currentCharIndex, lines]);

  useEffect(() => {
    if (isBlinking && !hasCompleted) {
      const completeTimer = setTimeout(() => {
        setHasCompleted(true);
        onComplete();
      }, 1500);
      return () => clearTimeout(completeTimer);
    }
  }, [isBlinking, hasCompleted, onComplete]);

  if (!show) return null;

  return (
    <>
      <style>{`
        @keyframes sharp-blink {
          0%, 49% { opacity: 1; }
          50%, 99% { opacity: 0; }
        }
        @keyframes cursor-blink {
          0%, 49% { opacity: 1; }
          50%, 99% { opacity: 0; }
        }
        .sharp-blink-anim {
          animation: sharp-blink 0.5s steps(1) 3;
        }
      `}</style>

      <motion.div
        className={isBlinking ? 'sharp-blink-anim' : ''}
        style={{
          position: 'fixed',
          top: '35%',
          left: 0,
          right: 0,
          transform: 'translateY(-50%)',
          zIndex: 60,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'none',
          willChange: 'transform, opacity',
          backfaceVisibility: 'hidden'
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          {lines.map((line, lineIdx) => {
            const isCurrentLine = lineIdx === currentLineIndex;
            const isCompletedLine = lineIdx < currentLineIndex;
            const revealedCount = isCompletedLine
              ? line.length
              : isCurrentLine
                ? currentCharIndex
                : 0;

            const isLastLine = lineIdx === lines.length - 1;
            const isTypingComplete = currentLineIndex === lines.length - 1 && currentCharIndex >= lines[lines.length - 1].length;

            return (
              <div
                key={lineIdx}
                style={{
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: 'clamp(2rem, 8vw, 3rem)',
                  minWidth: '80vw'
                }}
              >
                <h1
                  style={{
                    fontSize: 'clamp(1.4rem, 7vw, 2.2rem)',
                    fontFamily: '"Press Start 2P", monospace',
                    textAlign: 'center',
                    lineHeight: '1.2',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    filter: 'drop-shadow(2px 2px 0px #000000) drop-shadow(0 0 10px rgba(225, 20, 98, 0.9))',
                    display: 'inline-block',
                    position: 'relative',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {line.split('').map((char, charIdx) => {
                    const isRevealed = charIdx < revealedCount;
                    const hasCursor = isCurrentLine && charIdx === currentCharIndex && !isBlinking;
                    const isLastCharWithCursor = isTypingComplete && isLastLine && charIdx === line.length - 1 && !isBlinking;
                    const showCursorHere = hasCursor || isLastCharWithCursor;

                    return (
                      <span
                        key={charIdx}
                        style={{
                          display: 'inline-block',
                          position: 'relative'
                        }}
                      >
                        <span
                          style={{
                            display: 'inline-block',
                            background: 'linear-gradient(to bottom, #FFFFFF 0%, #D0D0D0 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                            opacity: isRevealed ? 1 : 0,
                            transition: 'opacity 0.05s linear'
                          }}
                        >
                          {char === ' ' ? '\u00A0' : char}
                        </span>
                        {showCursorHere && (
                          <span
                            style={{
                              position: 'absolute',
                              top: '10%',
                              right: '-0.55em',
                              width: '0.5em',
                              height: '80%',
                              backgroundColor: '#FFFFFF',
                              boxShadow: '0 0 12px rgba(255, 255, 255, 0.9)',
                              animation: 'cursor-blink 0.8s steps(1) infinite',
                              imageRendering: 'pixelated',
                              opacity: 1,
                              zIndex: 10
                            }}
                          />
                        )}
                      </span>
                    );
                  })}
                </h1>
              </div>
            );
          })}
        </div>
      </motion.div>
    </>
  );
}
