interface PixelFrameProps {
  children: React.ReactNode;
  className?: string;
  color?: 'white' | 'magenta';
}

export const PixelFrame = ({ children, className = '', color = 'white' }: PixelFrameProps) => {
  const borderColor = color === 'magenta' ? '#FF00FF' : '#FFFFFF';

  return (
    <div
      className={`relative ${className}`}
      style={{
        background: 'rgba(0, 0, 0, 0.3)',
        imageRendering: 'pixelated',
      }}
    >
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ imageRendering: 'pixelated' }}
      >
        <rect
          x="2"
          y="0"
          width="calc(100% - 4px)"
          height="2"
          fill={borderColor}
        />
        <rect
          x="2"
          y="calc(100% - 2px)"
          width="calc(100% - 4px)"
          height="2"
          fill={borderColor}
        />
        <rect
          x="0"
          y="2"
          width="2"
          height="calc(100% - 4px)"
          fill={borderColor}
        />
        <rect
          x="calc(100% - 2px)"
          y="2"
          width="2"
          height="calc(100% - 4px)"
          fill={borderColor}
        />
        <rect x="0" y="0" width="2" height="2" fill={borderColor} opacity="0.5" />
        <rect x="calc(100% - 2px)" y="0" width="2" height="2" fill={borderColor} opacity="0.5" />
        <rect x="0" y="calc(100% - 2px)" width="2" height="2" fill={borderColor} opacity="0.5" />
        <rect x="calc(100% - 2px)" y="calc(100% - 2px)" width="2" height="2" fill={borderColor} opacity="0.5" />
      </svg>
      {children}
    </div>
  );
};
