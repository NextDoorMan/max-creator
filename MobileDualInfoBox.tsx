import { motion } from 'framer-motion';

interface InfoBox {
  header: string;
  line: string;
  color: string;
  increasedPadding?: boolean;
}

interface MobileDualInfoBoxProps {
  infoBoxes: [InfoBox, InfoBox];
}

const colorMap: Record<string, string> = {
  'pink': '#BE3455',
  'purple': '#A855F7',
  'cyan': '#22C55E',
  'green': '#22C55E',
  'yellow': '#EAB308',
  'magenta': '#BE3455',
  'blue': '#3B82F6'
};

export const MobileDualInfoBox = ({ infoBoxes }: MobileDualInfoBoxProps) => {
  return (
    <div className="w-full my-6 flex flex-row gap-2">
      {infoBoxes.map((box, index) => {
        const headerColor = colorMap[box.color] || '#BE3455';

        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
            className="flex-1"
            style={{
              background: `${headerColor}1A`,
              border: '3px solid #FFFFFF',
              borderRadius: '8px',
              padding: '12px',
              imageRendering: 'pixelated'
            }}
          >
            <h3
              style={{
                fontFamily: "'Press Start 2P', cursive",
                fontSize: '9px',
                color: headerColor,
                textAlign: 'center',
                marginBottom: '10px',
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                lineHeight: '1.6'
              }}
            >
              {box.header}
            </h3>
            <p
              style={{
                fontFamily: "'Press Start 2P', cursive",
                fontSize: '8px',
                color: '#FFFFFF',
                textAlign: 'center',
                lineHeight: '1.8',
                letterSpacing: '0.02em'
              }}
              dangerouslySetInnerHTML={{ __html: box.line }}
            />
          </motion.div>
        );
      })}
    </div>
  );
};
