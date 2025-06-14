import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export function FloatingLetters() {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Crear letras flotantes
    const createFloatingLetter = (letter, index) => {
      const letterElement = document.createElement("div");
      letterElement.textContent = letter;
      letterElement.className = `floating-letter floating-${letter.toLowerCase()}`;

      // Posición inicial aleatoria
      const startX = Math.random() * window.innerWidth;
      const startY = Math.random() * window.innerHeight;

      letterElement.style.left = `${startX}px`;
      letterElement.style.top = `${startY}px`;

      container.appendChild(letterElement);

      // Animación con GSAP
      const tl = gsap.timeline({ repeat: -1 });

      // Movimiento aleatorio continuo
      const animateRandomMovement = () => {
        const newX = Math.random() * (window.innerWidth - 60);
        const newY = Math.random() * (window.innerHeight - 60);
        const duration = 8 + Math.random() * 12; // 8-20 segundos
        const rotation = Math.random() * 720 - 360; // -360 a 360 grados

        gsap.to(letterElement, {
          x: newX - startX,
          y: newY - startY,
          rotation: rotation,
          duration: duration,
          ease: "power2.inOut",
          onComplete: animateRandomMovement,
        });
      };

      // Iniciar animación con delay aleatorio
      gsap.delayedCall(Math.random() * 3, animateRandomMovement);

      // Animación de opacidad pulsante
      gsap.to(letterElement, {
        opacity: 0.3 + Math.random() * 0.4,
        duration: 2 + Math.random() * 3,
        repeat: -1,
        yoyo: true,
        ease: "power2.inOut",
      });

      // Animación de escala sutil
      gsap.to(letterElement, {
        scale: 0.8 + Math.random() * 0.4,
        duration: 3 + Math.random() * 4,
        repeat: -1,
        yoyo: true,
        ease: "power2.inOut",
      });

      return letterElement;
    };

    // Crear múltiples letras X y O
    const letters = [];
    const letterTypes = ["X", "O"];
    const numberOfLetters = 12; // 6 X y 6 O

    for (let i = 0; i < numberOfLetters; i++) {
      const letter = letterTypes[i % 2];
      const letterElement = createFloatingLetter(letter, i);
      letters.push(letterElement);
    }

    // Cleanup function
    return () => {
      letters.forEach((letter) => {
        gsap.killTweensOf(letter);
        if (letter.parentNode) {
          letter.parentNode.removeChild(letter);
        }
      });
    };
  }, []);

  return <div ref={containerRef} className="floating-letters-container"></div>;
}
