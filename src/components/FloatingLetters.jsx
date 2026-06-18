import { useEffect, useRef } from 'react';

const LETTERS = ['X', 'O'];
const COUNT = 12;
const VARIANTS = ['float-a', 'float-b', 'float-c'];

export function FloatingLetters () {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const nodes = Array.from({ length: COUNT }, (_, i) => {
      const letter = LETTERS[i % 2];
      const el = document.createElement('div');
      el.textContent = letter;
      el.className = `floating-letter floating-${letter.toLowerCase()} ${VARIANTS[i % VARIANTS.length]}`;
      el.style.left = `${Math.random() * 100}vw`;
      el.style.top = `${Math.random() * 100}vh`;
      el.style.animationDuration = `${8 + Math.random() * 12}s, ${2 + Math.random() * 3}s, ${3 + Math.random() * 4}s`;
      el.style.animationDelay = `${-Math.random() * 8}s, ${-Math.random() * 3}s, ${-Math.random() * 4}s`;
      container.appendChild(el);
      return el;
    });

    return () => nodes.forEach((node) => node.remove());
  }, []);

  return <div ref={containerRef} className='floating-letters-container' />;
}
