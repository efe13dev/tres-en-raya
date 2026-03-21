import { Bot, Palette, Sparkles, Trophy } from 'lucide-react';
import { useState } from 'react';
import { Board } from './components/Board';
import { FloatingLetters } from './components/FloatingLetters';
import { GameTitle } from './components/GameTitle';
import { SoundToggle } from './components/SoundToggle';
import { ThemeToggle } from './components/ThemeToggle';
import { useTheme } from './hooks/useTheme';
import './styles/premium.css';

function App () {
  const { theme, toggleTheme } = useTheme();
  const [soundEnabled, setSoundEnabled] = useState(true);
  const featureCards = [
    {
      icon: Sparkles,
      title: 'Acabado de producto',
      description: 'Glassmorphism, animaciones suaves y un layout que se siente más cerca de una app premium que de una simple demo.'
    },
    {
      icon: Bot,
      title: 'Modo IA integrado',
      description: 'Puedes alternar entre duelo local y partida contra una IA con minimax y un pequeño delay cinematográfico.'
    },
    {
      icon: Trophy,
      title: 'Sesiones con ritmo',
      description: 'Marcador, línea ganadora animada, tema claro/oscuro y sonidos sintéticos para una experiencia más cuidada.'
    }
  ];

  return (
    <>
      <div className='gradient-bg'></div>
      <FloatingLetters />
      <div className='app-shell'>
        <div className='app-chrome'>
          <header className='app-header'>
            <div className='hero-copy-block'>
              <span className='section-kicker'>Arcade Signature</span>
              <GameTitle />
              <p className='hero-copy'>
                Un tres en raya rediseñado como producto: visual más elegante,
                microinteracciones premium y una base mejor pensada para crecer
                hacia una experiencia monetizable.
              </p>
              <div className='hero-pills'>
                <span className='hero-pill'>Tema dinámico</span>
                <span className='hero-pill'>Marcador en directo</span>
                <span className='hero-pill'>Modo IA</span>
                <span className='hero-pill'>Sonido inmersivo</span>
              </div>
            </div>
            <div className='header-actions'>
              <div className='header-actions-card'>
                <ThemeToggle
                  theme={theme}
                  onToggle={toggleTheme}
                />
                <SoundToggle
                  enabled={soundEnabled}
                  onToggle={() => setSoundEnabled((previous) => !previous)}
                />
              </div>
            </div>
          </header>

          <main className='app-main'>
            <section className='game-column'>
              <Board soundEnabled={soundEnabled} />
            </section>

            <aside className='info-column'>
              <div className='info-card info-card-highlight'>
                <span className='info-card-kicker'>Visión premium</span>
                <h2>Una base visual lista para vender mejor la experiencia</h2>
                <p>
                  El tablero ya no vive aislado: ahora se presenta como un
                  producto con narrativa, capas visuales y control del ritmo
                  de juego.
                </p>
                <div className='insight-row'>
                  <Palette size={18} />
                  <span>
                    Dirección visual híbrida: lujo digital, cristal difuso y
                    brillo controlado.
                  </span>
                </div>
              </div>

              <div className='feature-grid'>
                {featureCards.map(({ icon: Icon, title, description }) => (
                  <article
                    key={title}
                    className='feature-card'
                  >
                    <div className='feature-icon-wrap'>
                      <Icon size={20} />
                    </div>
                    <div>
                      <h3>{title}</h3>
                      <p>{description}</p>
                    </div>
                  </article>
                ))}
              </div>
            </aside>
          </main>
        </div>
      </div>
    </>
  );
}

export default App;
