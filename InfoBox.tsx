import React from 'react';
import { useState, useEffect } from 'react';

interface InfoBoxProps {
  header: string;
  line: string;
  color: 'cyan' | 'pink' | 'green' | 'yellow';
  increasedPadding?: boolean;
}

const colorMap = {
  cyan: '#00FFFF',
  pink: '#FF1493',
  green: '#00FF00',
  yellow: '#FFD700'
};

export const InfoBox: React.FC<InfoBoxProps> = ({ header, line, color, increasedPadding = false }) => {
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    const checkHeight = () => {
      setIsSmallScreen(window.innerHeight <= 800);
    };

    checkHeight();
    window.addEventListener('resize', checkHeight);

    return () => window.removeEventListener('resize', checkHeight);
  }, []);

  const borderColor = colorMap[color];
  const basePadding = 16;
  const verticalPadding = increasedPadding ? basePadding * 1.5 : basePadding;

  const scaleFactor = isSmallScreen ? 0.8 : 1;
  const headerFontSize = 0.77 * scaleFactor;
  const lineFontSize = 0.715 * scaleFactor;
  const minHeight = 100 * scaleFactor;
  const scaledVerticalPadding = verticalPadding * scaleFactor;
  const scaledHorizontalPadding = 16 * scaleFactor;
  const marginBottom = 16 * scaleFactor;

  return (
    <div
      className="flex-1 border-2"
      style={{
        borderColor,
        boxShadow: `0 0 10px ${borderColor}50`,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        minHeight: `${minHeight}px`,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
        textAlign: 'center',
        imageRendering: 'pixelated',
        paddingTop: `${scaledVerticalPadding}px`,
        paddingBottom: `${scaledVerticalPadding}px`,
        paddingLeft: `${scaledHorizontalPadding}px`,
        paddingRight: `${scaledHorizontalPadding}px`
      }}
    >
      <div
        style={{
          fontFamily: "'Press Start 2P', cursive",
          fontSize: `${headerFontSize}rem`,
          color: borderColor,
          textShadow: `0 0 8px ${borderColor}`,
          marginBottom: `${marginBottom}px`,
          lineHeight: '1.4',
          width: '100%'
        }}
      >
        {header}
      </div>
      <div
        style={{
          fontFamily: "'Press Start 2P', cursive",
          fontSize: `${lineFontSize}rem`,
          color: '#ffffff',
          lineHeight: '1.5',
          width: '100%'
        }}
        dangerouslySetInnerHTML={{ __html: line }}
      />
    </div>
  );
};
