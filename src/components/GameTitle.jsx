import { motion } from 'framer-motion';

const titleLetters = ['T', 'r', 'e', 's', ' ', 'e', 'n', ' ', 'R', 'a', 'y', 'a'];

export function GameTitle() {
  return (
    <h1 className='game-title'>
      {titleLetters.map((letter, index) => (
        <motion.span
          key={`${letter}-${index}`}
          className='title-letter'
          initial={{ opacity: 0, y: 26, filter: 'blur(10px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.45, delay: index * 0.04 }}
        >
          {letter === ' ' ? '\u00A0' : letter}
        </motion.span>
      ))}
    </h1>
  );
}
