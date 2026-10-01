import { MotionConfig } from 'framer-motion';
import { useState } from 'react';
import { Board } from './components/Board';
import { GameTitle } from './components/GameTitle';
import { SoundToggle } from './components/SoundToggle';
import { ThemeToggle } from './components/ThemeToggle';
import { useTheme } from './hooks/useTheme';
import './styles/premium.css';

function App () {
  const { theme, toggleTheme } = useTheme();
  const [soundEnabled, setSoundEnabled] = useState(true);

  return (
    <MotionConfig reducedMotion='user'>
      <div className='app-shell'>
        <div className='app-chrome'>
          <header className='app-header'>
            <div className='brand'>
              <span className='brand-badge' aria-hidden='true'>
                <span className='brand-x'>X</span>
                <span className='brand-o'>O</span>
              </span>
              <p className='brand-tagline'>Un clásico, otra ronda.</p>
            </div>
            <div className='header-actions'>
              <ThemeToggle
                theme={theme}
                onToggle={toggleTheme}
              />
              <SoundToggle
                enabled={soundEnabled}
                onToggle={() => setSoundEnabled((previous) => !previous)}
              />
            </div>
          </header>

          <main className='app-main'>
            <section className='intro-column'>
              <GameTitle />
              <p className='hero-copy'>
                Dos símbolos. Un tablero. La próxima jugada es tuya.
              </p>
            </section>

            <section className='game-column'>
              <Board soundEnabled={soundEnabled} />
            </section>

            <section className='guide-column'>
              <h2 className='guide-title'>Tres en línea y ganas.</h2>
              <p className='guide-copy'>
                Coloca tu símbolo en una casilla libre por turno. El primero
                en alinear tres en horizontal, vertical o diagonal se lleva
                la ronda.
              </p>
              <div className='guide-diagram' aria-hidden='true'>
                <span className='guide-diagram-cell guide-diagram-x'>X</span>
                <span className='guide-diagram-cell guide-diagram-x'>X</span>
                <span className='guide-diagram-cell guide-diagram-x'>X</span>
                <span className='guide-diagram-cell'></span>
                <span className='guide-diagram-cell guide-diagram-o'>O</span>
                <span className='guide-diagram-cell'></span>
                <span className='guide-diagram-cell guide-diagram-o'>O</span>
                <span className='guide-diagram-cell'></span>
                <span className='guide-diagram-cell'></span>
              </div>
              <p className='guide-note'>
                Juega con alguien en el mismo dispositivo o reta a la IA
                desde el selector de modo.
              </p>
            </section>
          </main>

          <footer className='app-footer'>
            Tres en raya, hecho con React.
          </footer>
        </div>
      </div>
    </MotionConfig>
  );
}

export default App;
