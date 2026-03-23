import { motion } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';

interface PixelSpeechBubbleProps {
  text: string;
  isTyping: boolean;
}

export default function PixelSpeechBubble({ text, isTyping }: PixelSpeechBubbleProps) {
  const [dimensions, setDimensions] = useState({ width: 280, height: 110 });
  const textRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateDimensions = () => {
      const screenWidth = window.innerWidth;
      const maxWidth = Math.min(screenWidth - 32, 340);

      setDimensions({
        width: maxWidth,
        height: 110
      });
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  const { width, height } = dimensions;
  const rightEdge = width - 8;
  const topCornerEnd = width - 12;

  const tailStartX = width / 2 + 5;
  const tailTipX = width / 2 - 17;

  return (
    <motion.div
      ref={containerRef}
      initial={{ scale: 0, y: 20 }}
      animate={{ scale: 1, y: 0 }}
      exit={{ scale: 0, y: 20 }}
      transition={{ type: 'spring', stiffness: 500, damping: 25 }}
      style={{
        position: 'absolute',
        top: '-57.6px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 100,
        imageRendering: 'pixelated',
        filter: 'drop-shadow(0 4px 12px rgba(0, 0, 0, 0.3))',
        width: `${width}px`,
        maxWidth: '100%'
      }}
    >
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        xmlns="http://www.w3.org/2000/svg"
        style={{
          imageRendering: 'pixelated',
          shapeRendening: 'crispEdges'
        }}
      >
        <defs>
          <path
            id="bubble-outline"
            d={`
              M 8 0 L ${topCornerEnd} 0
              L ${topCornerEnd} 2 L ${topCornerEnd + 2} 2 L ${topCornerEnd + 2} 4 L ${topCornerEnd + 4} 4 L ${topCornerEnd + 4} 6 L ${topCornerEnd + 6} 6 L ${topCornerEnd + 6} 8
              L ${topCornerEnd + 8} 8 L ${topCornerEnd + 8} 70
              L ${topCornerEnd + 6} 70 L ${topCornerEnd + 6} 72 L ${topCornerEnd + 4} 72 L ${topCornerEnd + 4} 74 L ${topCornerEnd + 2} 74 L ${topCornerEnd + 2} 76
              L ${topCornerEnd} 76 L ${topCornerEnd} 78 L ${tailStartX + 20} 78
              L ${tailStartX + 20} 80 L ${tailStartX + 18} 80 L ${tailStartX + 18} 82
              L ${tailStartX + 16} 82 L ${tailStartX + 16} 84 L ${tailStartX + 14} 84 L ${tailStartX + 14} 86
              L ${tailStartX + 12} 86 L ${tailStartX + 12} 88 L ${tailStartX + 10} 88 L ${tailStartX + 10} 90
              L ${tailStartX + 8} 90 L ${tailStartX + 8} 92 L ${tailStartX + 6} 92 L ${tailStartX + 6} 94
              L ${tailStartX + 4} 94 L ${tailStartX + 4} 96 L ${tailStartX + 2} 96 L ${tailStartX + 2} 98
              L ${tailStartX} 98 L ${tailStartX} 100 L ${tailStartX - 2} 100
              L ${tailStartX - 2} 98 L ${tailStartX} 98 L ${tailStartX} 96
              L ${tailStartX + 2} 96 L ${tailStartX + 2} 94 L ${tailStartX + 4} 94 L ${tailStartX + 4} 92
              L ${tailStartX + 6} 92 L ${tailStartX + 6} 78 L 12 78
              L 12 76 L 10 76 L 10 74 L 8 74 L 8 72 L 6 72 L 6 70 L 4 70 L 4 68
              L 2 68 L 2 8
              L 4 8 L 4 6 L 6 6 L 6 4 L 8 4 L 8 2 L 10 2 L 10 0
              Z
            `}
          />
          <path
            id="bubble-fill"
            d={`
              M 10 2 L ${topCornerEnd} 2
              L ${topCornerEnd} 4 L ${topCornerEnd + 2} 4 L ${topCornerEnd + 2} 6 L ${topCornerEnd + 4} 6 L ${topCornerEnd + 4} 8
              L ${topCornerEnd + 6} 8 L ${topCornerEnd + 6} 70
              L ${topCornerEnd + 4} 70 L ${topCornerEnd + 4} 72 L ${topCornerEnd + 2} 72 L ${topCornerEnd + 2} 74 L ${topCornerEnd} 74
              L ${topCornerEnd} 76 L ${tailStartX + 20} 76
              L ${tailStartX + 20} 78 L ${tailStartX + 18} 78 L ${tailStartX + 18} 80
              L ${tailStartX + 16} 80 L ${tailStartX + 16} 82 L ${tailStartX + 14} 82 L ${tailStartX + 14} 84
              L ${tailStartX + 12} 84 L ${tailStartX + 12} 86 L ${tailStartX + 10} 86 L ${tailStartX + 10} 88
              L ${tailStartX + 8} 88 L ${tailStartX + 8} 90 L ${tailStartX + 6} 90 L ${tailStartX + 6} 92
              L ${tailStartX + 4} 92 L ${tailStartX + 4} 94 L ${tailStartX + 2} 94 L ${tailStartX + 2} 96
              L ${tailStartX} 96 L ${tailStartX} 98
              L ${tailStartX + 2} 98 L ${tailStartX + 2} 96 L ${tailStartX + 4} 96 L ${tailStartX + 4} 94
              L ${tailStartX + 6} 94 L ${tailStartX + 6} 76 L 12 76
              L 12 74 L 10 74 L 10 72 L 8 72 L 8 70 L 6 70 L 6 68
              L 4 68 L 4 8
              L 6 8 L 6 6 L 8 6 L 8 4 L 10 4
              Z
            `}
          />
        </defs>

        <use href="#bubble-outline" fill="#ffffff" />
        <use href="#bubble-fill" fill="#000000" />
      </svg>

      <div
        ref={textRef}
        style={{
          position: 'absolute',
          top: '14px',
          left: '20px',
          right: '20px',
          bottom: '40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'none',
          overflow: 'hidden'
        }}
      >
        <p
          className="mobile-white-pixel text-white text-center leading-relaxed font-bold"
          style={{
            imageRendering: 'pixelated',
            fontSize: '0.875rem',
            wordWrap: 'break-word',
            overflowWrap: 'break-word',
            whiteSpace: 'normal',
            width: '100%',
            maxWidth: '100%'
          }}
        >
          {text}
          {isTyping && <span className="animate-pulse ml-1">█</span>}
        </p>
      </div>
    </motion.div>
  );
}
