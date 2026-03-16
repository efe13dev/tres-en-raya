import { motion } from 'framer-motion';

const lineStyles = {
  0: { top: '16.66%', left: '7%', width: '86%', height: '4px', orientation: 'horizontal' },
  1: { top: '50%', left: '7%', width: '86%', height: '4px', orientation: 'horizontal' },
  2: { top: '83.34%', left: '7%', width: '86%', height: '4px', orientation: 'horizontal' },
  3: { top: '7%', left: '16.66%', width: '4px', height: '86%', orientation: 'vertical' },
  4: { top: '7%', left: '50%', width: '4px', height: '86%', orientation: 'vertical' },
  5: { top: '7%', left: '83.34%', width: '4px', height: '86%', orientation: 'vertical' },
  6: { top: '50%', left: '50%', width: '122%', height: '4px', transform: 'translate(-50%, -50%) rotate(45deg)', orientation: 'diagonal' },
  7: { top: '50%', left: '50%', width: '122%', height: '4px', transform: 'translate(-50%, -50%) rotate(-45deg)', orientation: 'diagonal' }
};

export function WinningLine({ lineIndex, winner }) {
  if (lineIndex === undefined || lineIndex === null || !winner) {
    return null;
  }

  const style = lineStyles[lineIndex];
  const animateProp = style.orientation === 'vertical' ? { scaleY: 1 } : { scaleX: 1 };
  const initialProp = style.orientation === 'vertical' ? { scaleY: 0 } : { scaleX: 0 };

  return (
    <motion.span
      className={`winning-line winning-line-${winner.toLowerCase()}`}
      style={style}
      initial={initialProp}
      animate={animateProp}
      transition={{ duration: 0.36, ease: 'easeOut' }}
    />
  );
}
