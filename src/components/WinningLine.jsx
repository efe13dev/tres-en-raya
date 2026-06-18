import { motion } from 'framer-motion';

const lineStyles = {
  0: { top: '16.66%', left: '7%', width: '86%', height: '4px', axis: 'h' },
  1: { top: '50%', left: '7%', width: '86%', height: '4px', axis: 'h' },
  2: { top: '83.34%', left: '7%', width: '86%', height: '4px', axis: 'h' },
  3: { top: '7%', left: '16.66%', width: '4px', height: '86%', axis: 'v' },
  4: { top: '7%', left: '50%', width: '4px', height: '86%', axis: 'v' },
  5: { top: '7%', left: '83.34%', width: '4px', height: '86%', axis: 'v' },
  6: { top: '50%', left: '50%', width: '122%', height: '4px', axis: 'd', rotate: 45 },
  7: { top: '50%', left: '50%', width: '122%', height: '4px', axis: 'd', rotate: -45 }
};

export function WinningLine ({ lineIndex, winner }) {
  if (lineIndex === undefined || lineIndex === null || !winner) {
    return null;
  }

  const s = lineStyles[lineIndex];
  const vertical = s.axis === 'v';
  const centered = s.axis === 'd';

  return (
    <motion.span
      className={`winning-line winning-line-${winner.toLowerCase()}`}
      style={{
        top: s.top,
        left: s.left,
        width: s.width,
        height: s.height,
        rotate: s.rotate ?? 0,
        x: centered ? '-50%' : 0,
        y: centered ? '-50%' : 0
      }}
      initial={vertical ? { scaleY: 0 } : { scaleX: 0 }}
      animate={vertical ? { scaleY: 1 } : { scaleX: 1 }}
      transition={{ duration: 0.36, ease: 'easeOut' }}
    />
  );
}
