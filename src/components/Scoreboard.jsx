import { motion } from 'framer-motion';

export function Scoreboard ({ score, activePlayer, winner }) {
  const items = [
    {
      key: 'X',
      label: 'X',
      value: score.X,
      accent: 'x'
    },
    {
      key: 'draws',
      label: 'Empates',
      value: score.draws,
      accent: 'draw'
    },
    {
      key: 'O',
      label: 'O',
      value: score.O,
      accent: 'o'
    }
  ];

  return (
    <div className='scoreboard'>
      {items.map((item) => {
        const isHighlighted = item.key === winner || (!winner && item.key === activePlayer);

        return (
          <motion.div
            key={item.key}
            className={[
              'score-card',
              `score-card-${item.accent}`,
              isHighlighted ? 'score-card-highlighted' : ''
            ]
              .filter(Boolean)
              .join(' ')}
            layout
          >
            <span className='score-label'>{item.label}</span>
            <motion.strong
              key={item.value}
              className='score-value'
              initial={{ opacity: 0.45, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.24 }}
            >
              {item.value}
            </motion.strong>
          </motion.div>
        );
      })}
    </div>
  );
}
