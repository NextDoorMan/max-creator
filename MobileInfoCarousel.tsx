import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface InfoBox {
  header: string;
  line: string;
  color: string;
  increasedPadding?: boolean;
}

interface MobileInfoCarouselProps {
  infoBoxes: InfoBox[];
}

const colorMap: Record<string, string> = {
  'pink': '#BE3455',
  'purple': '#A855F7',
  'cyan': '#22C55E',
  'green': '#22C55E',
  'yellow': '#EAB308',
  'magenta': '#BE3455'
};

const playButtonSound = () => {
  const audio = new Audio('https://res.cloudinary.com/djihbhmzz/video/upload/v1771488770/%D0%BA%D0%BD%D0%BE%D0%BF%D0%BA%D0%B0_oztdlq.mp3');
  audio.volume = 0.4;
  audio.play().catch(() => {});
};

export const MobileInfoCarousel = ({ infoBoxes }: MobileInfoCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrevious = () => {
    playButtonSound();
    setCurrentIndex((prev) => prev - 1);
  };

  const handleNext = () => {
    playButtonSound();
    setCurrentIndex((prev) => prev + 1);
  };

  const currentBox = infoBoxes[currentIndex];
  const headerColor = colorMap[currentBox.color] || '#BE3455';

  const showLeftArrow = currentIndex > 0;
  const showRightArrow = currentIndex < infoBoxes.length - 1;

  return (
    <div className="w-full my-6 relative">
      <div className="flex items-center justify-center relative">
        {showLeftArrow && (
          <motion.button
            onClick={handlePrevious}
            className="absolute left-2 z-20 active:scale-90 transition-transform duration-100"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              width: '45.9px',
              height: '45.9px',
              imageRendering: 'pixelated'
            }}
          >
            <img
              src="https://res.cloudinary.com/djihbhmzz/image/upload/v1772894626/%D1%81%D1%82%D1%80%D0%B5%D0%BB%D0%BA%D0%B0_%D0%B2%D0%BB%D0%B5%D0%B2%D0%BE_2_kc7far.png"
              alt="Previous"
              style={{
                width: '100%',
                height: '100%',
                imageRendering: 'pixelated'
              }}
            />
          </motion.button>
        )}

        <div className="flex-1 px-16">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="min-h-[280px] flex flex-col justify-center"
              style={{
                background: `${headerColor}1A`,
                border: '3px solid #FFFFFF',
                borderRadius: '8px',
                padding: currentBox.increasedPadding ? '20px' : '16px',
                imageRendering: 'pixelated'
              }}
            >
              <h3
                style={{
                  fontFamily: "'Press Start 2P', cursive",
                  fontSize: '11px',
                  color: headerColor,
                  textAlign: 'center',
                  marginBottom: '12px',
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                  lineHeight: '1.6'
                }}
              >
                {currentBox.header}
              </h3>
              <p
                style={{
                  fontFamily: "'Press Start 2P', cursive",
                  fontSize: '9px',
                  color: '#FFFFFF',
                  textAlign: 'center',
                  lineHeight: '1.8',
                  letterSpacing: '0.02em'
                }}
                dangerouslySetInnerHTML={{ __html: currentBox.line }}
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {showRightArrow && (
          <motion.button
            onClick={handleNext}
            className="absolute right-2 z-20 active:scale-90 transition-transform duration-100"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              width: '45.9px',
              height: '45.9px',
              imageRendering: 'pixelated'
            }}
          >
            <img
              src="https://res.cloudinary.com/djihbhmzz/image/upload/v1772894626/%D1%81%D1%82%D1%80%D0%B5%D0%BB%D0%BA%D0%B0_%D0%B2%D0%BF%D1%80%D0%B0%D0%B2%D0%BE_1_hjrgy2.png"
              alt="Next"
              style={{
                width: '100%',
                height: '100%',
                imageRendering: 'pixelated'
              }}
            />
          </motion.button>
        )}
      </div>

      <div className="flex justify-center gap-1 mt-4">
        {infoBoxes.map((_, index) => (
          <div
            key={index}
            style={{
              width: '6px',
              height: '6px',
              background: index === currentIndex ? headerColor : '#FFFFFF33',
              imageRendering: 'pixelated'
            }}
          />
        ))}
      </div>
    </div>
  );
};
