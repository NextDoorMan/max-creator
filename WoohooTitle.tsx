import { useState, useEffect, useRef } from 'react';

export const WoohooTitle = () => {
  const [scale, setScale] = useState(1);
  const [colorIndex, setColorIndex] = useState(0);
  const [shake, setShake] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(1);
  const [visibleRows, setVisibleRows] = useState<number[]>([]);
  const [typingTexts, setTypingTexts] = useState<string[]>(['', '', '', '', '']);
  const hasStartedRef = useRef(false);

  const colors = [
    '#ffffff',
    '#ff00ff',
    '#00ffff',
    '#ffff00',
    '#ff0080',
    '#00ff80',
    '#ff8000',
    '#8000ff'
  ];

  const fullTexts = ['WOO', 'HOO', 'OOO', 'OOO', 'OO!'];

  useEffect(() => {
    if (hasStartedRef.current) return;
    hasStartedRef.current = true;

    const typeRow = (rowIndex: number, charIndex: number) => {
      if (charIndex <= fullTexts[rowIndex].length) {
        setTypingTexts(prev => {
          const newTexts = [...prev];
          newTexts[rowIndex] = fullTexts[rowIndex].substring(0, charIndex);
          return newTexts;
        });

        setTimeout(() => {
          typeRow(rowIndex, charIndex + 1);
        }, 100);
      } else if (rowIndex < fullTexts.length - 1) {
        setVisibleRows(prev => [...prev, rowIndex + 1]);
        setTimeout(() => {
          typeRow(rowIndex + 1, 0);
        }, 100);
      }
    };

    setVisibleRows([0]);
    typeRow(0, 0);
  }, []);

  useEffect(() => {
    const pulseInterval = setInterval(() => {
      setScale(1 + Math.random() * 0.15);
      setShake({
        x: Math.random() * 6 - 3,
        y: Math.random() * 6 - 3
      });
    }, 60);

    const colorInterval = setInterval(() => {
      setColorIndex(prev => (prev + 1) % colors.length);
    }, 100);

    return () => {
      clearInterval(pulseInterval);
      clearInterval(colorInterval);
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center pointer-events-none"
      style={{
        opacity,
        transition: 'opacity 0.3s ease-out'
      }}
    >
      <div
        className="flex flex-col items-center justify-center w-full px-2"
        style={{
          transform: `translate(${shake.x}px, ${shake.y}px) scale(${scale})`,
          gap: 'min(2vw, 1.5vh)'
        }}
      >
        {visibleRows.map((rowIndex) => (
          <div
            key={rowIndex}
            className="mobile-white-pixel text-center w-full"
            style={{
              fontSize: 'min(22vw, 16vh)',
              color: colors[colorIndex],
              textShadow: `0 0 25px ${colors[colorIndex]}, 0 0 50px ${colors[colorIndex]}, 5px 5px 0px rgba(0,0,0,0.9)`,
              imageRendering: 'pixelated',
              letterSpacing: '0.2em',
              filter: 'brightness(1.5)',
              lineHeight: '1'
            }}
          >
            {typingTexts[rowIndex]}
          </div>
        ))}
      </div>
    </div>
  );
};
