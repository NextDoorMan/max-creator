import { useState, useEffect } from 'react';

interface Slice {
  id: number;
  offset: number;
  height: number;
  top: number;
}

export const GlitchOverlay = () => {
  const [glitchOffset, setGlitchOffset] = useState(0);
  const [rgbShift, setRgbShift] = useState({ r: 0, g: 0, b: 0 });
  const [screenShake, setScreenShake] = useState({ x: 0, y: 0 });
  const [aberration, setAberration] = useState(0);
  const [screenSlices, setScreenSlices] = useState<Slice[]>([]);
  const [noiseOpacity, setNoiseOpacity] = useState(0);
  const [fullScreenRgb, setFullScreenRgb] = useState({ r: 0, g: 0, b: 0 });
  const [flashOpacity, setFlashOpacity] = useState(0);
  const [flashColor, setFlashColor] = useState('#ffffff');
  const [invert, setInvert] = useState(false);

  useEffect(() => {
    const generateSlices = (): Slice[] => {
      const sliceCount = 10 + Math.floor(Math.random() * 3);
      const slices: Slice[] = [];
      for (let i = 0; i < sliceCount; i++) {
        slices.push({
          id: i,
          offset: (Math.random() - 0.5) * 60,
          height: 100 / sliceCount,
          top: (100 / sliceCount) * i
        });
      }
      return slices;
    };

    const glitchInterval = setInterval(() => {
      setGlitchOffset(Math.random() > 0.5 ? (Math.random() * 20 - 10) : 0);
      setRgbShift({
        r: Math.random() * 24 - 12,
        g: Math.random() * 24 - 12,
        b: Math.random() * 24 - 12
      });
      setScreenShake({
        x: Math.random() * 20 - 10,
        y: Math.random() * 20 - 10
      });
      setAberration(Math.random() * 4);
      setScreenSlices(generateSlices());
      setNoiseOpacity(Math.random() * 0.4);
      setFullScreenRgb({
        r: Math.random() * 60 - 30,
        g: Math.random() * 60 - 30,
        b: Math.random() * 60 - 30
      });

      if (Math.random() > 0.4) {
        setFlashOpacity(Math.random() * 0.7 + 0.3);
        const colors = ['#ff0080', '#00ff80', '#0080ff', '#ffff00', '#ff00ff', '#00ffff'];
        setFlashColor(colors[Math.floor(Math.random() * colors.length)]);
        setTimeout(() => setFlashOpacity(0), 50);
      }

      setInvert(Math.random() > 0.7);
    }, 80);

    return () => clearInterval(glitchInterval);
  }, []);

  return (
    <>
      <div
        className="fixed inset-0 z-[10000]"
        style={{
          filter: `${invert ? 'invert(1) hue-rotate(180deg) ' : ''}saturate(${1.5 + Math.random() * 0.5}) contrast(${1.1 + Math.random() * 0.3}) drop-shadow(${fullScreenRgb.r}px 0 0 #ff0080) drop-shadow(${fullScreenRgb.g}px 0 0 #00ff80) drop-shadow(0 ${fullScreenRgb.b}px 0 #0080ff) drop-shadow(${fullScreenRgb.r * 0.5}px ${fullScreenRgb.b * 0.5}px 0 #ff00ff)`,
          pointerEvents: 'none',
          transform: `translate(${screenShake.x}px, ${screenShake.y}px)`
        }}
      >
        {screenSlices.map((slice) => (
          <div
            key={slice.id}
            className="absolute w-full overflow-hidden"
            style={{
              height: `${slice.height}%`,
              top: `${slice.top}%`,
              transform: `translateX(${slice.offset}px)`,
              borderTop: Math.random() > 0.6 ? '2px solid rgba(255, 255, 255, 0.4)' : 'none',
              borderBottom: Math.random() > 0.6 ? '2px solid rgba(255, 255, 255, 0.4)' : 'none',
              background: Math.random() > 0.8 ? 'rgba(255, 0, 128, 0.1)' : 'transparent'
            }}
          />
        ))}
      </div>

      <div
        className="fixed inset-0 z-[10001] pointer-events-none"
        style={{
          opacity: noiseOpacity,
          background: `repeating-linear-gradient(
            0deg,
            transparent 0px,
            rgba(255, 255, 255, ${Math.random() * 0.15}) 1px,
            transparent 2px,
            rgba(255, 255, 255, ${Math.random() * 0.15}) 3px
          )`,
          backgroundSize: '100% 4px',
          mixBlendMode: 'overlay'
        }}
      />

      <div
        className="fixed inset-0 z-[10001] pointer-events-none transition-opacity duration-75"
        style={{
          opacity: flashOpacity,
          background: flashColor,
          mixBlendMode: 'screen'
        }}
      />
    </>
  );
};
