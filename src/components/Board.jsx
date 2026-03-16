import 'animate.css';
import confetti from 'canvas-confetti';
import { motion } from 'framer-motion';
import { RotateCcw, Sparkles } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useSound } from '../hooks/useSound';
import { calculateDraw, calculateWinner, findBestMove } from '../utils';
import { ModeSelector } from './ModeSelector';
import { Scoreboard } from './Scoreboard';
import { WinningLine } from './WinningLine';

const createEmptyBoard = () => Array(9).fill(null);
const INITIAL_SCORE = {
  X: 0,
  O: 0,
  draws: 0
};

function Square({
  index,
  value,
  onSquareClick,
  disabled,
  isWinningCell
}) {
  const squareClass = [
    'square',
    value ? `square-${value.toLowerCase()}` : '',
    isWinningCell ? 'square-winning' : ''
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <motion.button
      type='button'
      className={squareClass}
      onClick={onSquareClick}
      disabled={disabled}
      aria-label={
        value
          ? `Casilla ${index + 1} ocupada por ${value}`
          : `Jugar en casilla ${index + 1}`
      }
      whileHover={disabled ? undefined : { y: -3, scale: 1.01 }}
      whileTap={disabled ? undefined : { scale: 0.97 }}
    >
      {value && (
        <motion.span
          key={`${index}-${value}`}
          initial={{ opacity: 0, scale: 0.55, rotate: value === 'X' ? -16 : 16 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 280, damping: 18 }}
        >
          {value}
        </motion.span>
      )}
    </motion.button>
  );
}

export function Board({ soundEnabled }) {
  const [xIsNext, setXIsNext] = useState(true);
  const [squares, setSquares] = useState(createEmptyBoard);
  const [score, setScore] = useState(INITIAL_SCORE);
  const [isResetting, setIsResetting] = useState(false);
  const [mode, setMode] = useState('pvp');
  const [isAiThinking, setIsAiThinking] = useState(false);
  const resolutionKeyRef = useRef('');
  const resetPulseRef = useRef(null);
  const { play, warmup } = useSound(soundEnabled);

  function randomInRange(min, max) {
    return Math.random() * (max - min) + min;
  }

  const winnerState = calculateWinner(squares);
  const draw = calculateDraw(squares);
  const winningCells = new Set(winnerState?.line ?? []);
  const currentPlayer = xIsNext ? 'X' : 'O';
  const statusTone = winnerState
    ? `Victoria de ${winnerState.winner}`
    : draw
      ? 'Empate perfecto'
      : mode === 'ai' && !xIsNext
        ? 'La IA está leyendo el tablero'
        : `Turno de ${mode === 'ai' ? 'ti' : `jugador ${currentPlayer}`}`;
  const statusCaption = winnerState
    ? 'Pulsa reiniciar para abrir la siguiente ronda.'
    : draw
      ? 'Ningún hueco libre. Buen pulso por ambas partes.'
      : mode === 'ai'
        ? xIsNext
          ? 'Tú juegas con X. La IA responde con O.'
          : 'La IA mueve con una pequeña pausa para sentirse más natural.'
        : 'Modo local para dos jugadores en el mismo dispositivo.';

  useEffect(() => {
    return () => {
      if (resetPulseRef.current) {
        window.clearTimeout(resetPulseRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!winnerState && !draw) {
      resolutionKeyRef.current = '';
      return;
    }

    const resolutionKey = winnerState
      ? `${winnerState.winner}-${squares.join('')}`
      : `draw-${squares.join('')}`;

    if (resolutionKeyRef.current === resolutionKey) {
      return;
    }

    resolutionKeyRef.current = resolutionKey;

    if (winnerState) {
      setScore((previous) => ({
        ...previous,
        [winnerState.winner]: previous[winnerState.winner] + 1
      }));
      play('win');
      confetti({
        angle: randomInRange(55, 125),
        spread: randomInRange(70, 95),
        particleCount: randomInRange(90, 130),
        origin: { y: 0.58 }
      });
      confetti({
        angle: randomInRange(235, 305),
        spread: randomInRange(70, 95),
        particleCount: randomInRange(90, 130),
        origin: { y: 0.58 }
      });
      return;
    }

    setScore((previous) => ({
      ...previous,
      draws: previous.draws + 1
    }));
    play('draw');
  }, [draw, play, squares, winnerState]);

  useEffect(() => {
    if (mode !== 'ai' || xIsNext || winnerState || draw) {
      setIsAiThinking(false);
      return;
    }

    setIsAiThinking(true);

    const timeoutId = window.setTimeout(() => {
      const nextMove = findBestMove([...squares], 'O', 'X');

      if (nextMove === null) {
        setIsAiThinking(false);
        return;
      }

      setSquares((previous) => {
        if (previous[nextMove] || calculateWinner(previous) || calculateDraw(previous)) {
          return previous;
        }

        const nextSquares = previous.slice();
        nextSquares[nextMove] = 'O';
        return nextSquares;
      });
      setXIsNext(true);
      setIsAiThinking(false);
      warmup();
      play('moveO');
    }, 620);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [draw, mode, play, squares, warmup, winnerState, xIsNext]);

  function triggerResetPulse() {
    setIsResetting(true);
    if (resetPulseRef.current) {
      window.clearTimeout(resetPulseRef.current);
    }
    resetPulseRef.current = window.setTimeout(() => {
      setIsResetting(false);
    }, 260);
  }

  function resetRound() {
    triggerResetPulse();
    setSquares(createEmptyBoard());
    setXIsNext(true);
    setIsAiThinking(false);
    warmup();
    play('reset');
  }

  function resetSession(nextMode = mode) {
    setMode(nextMode);
    setScore(INITIAL_SCORE);
    setSquares(createEmptyBoard());
    setXIsNext(true);
    setIsAiThinking(false);
    triggerResetPulse();
    warmup();
    play('reset');
  }

  function handleClick(i) {
    if (winnerState || draw || squares[i] || isAiThinking) {
      return;
    }

    if (mode === 'ai' && !xIsNext) {
      return;
    }

    const nextSquares = squares.slice();
    const nextPlayer = xIsNext ? 'X' : 'O';
    nextSquares[i] = nextPlayer;
    setSquares(nextSquares);
    setXIsNext(!xIsNext);
    warmup();
    play(nextPlayer === 'X' ? 'moveX' : 'moveO');
  }

  return (
    <section className='game-surface'>
      <div className='board-topbar'>
        <div>
          <span className='section-kicker'>Partida</span>
          <h2 className='board-heading'>Edición premium</h2>
        </div>
        <ModeSelector
          mode={mode}
          onChange={(nextMode) => resetSession(nextMode)}
        />
      </div>

      <div className='status-panel'>
        <div className='status-copy'>
          <span className='status-label'>Estado actual</span>
          <h3
            className={[
              'status-value',
              winnerState ? 'status-win' : '',
              draw ? 'status-draw' : ''
            ]
              .filter(Boolean)
              .join(' ')}
          >
            {statusTone}
          </h3>
          <p className='status-caption'>{statusCaption}</p>
        </div>
        <div className='status-player-chip'>
          <span className='status-chip-label'>Siguiente símbolo</span>
          <strong className={`player-chip player-chip-${currentPlayer.toLowerCase()}`}>
            {mode === 'ai' && !xIsNext && !winnerState && !draw ? 'IA · O' : currentPlayer}
          </strong>
        </div>
      </div>

      <Scoreboard
        score={score}
        activePlayer={currentPlayer}
        winner={winnerState?.winner}
      />

      <div className='board-stage'>
        <div className={isResetting ? 'board-grid board-grid-resetting' : 'board-grid'}>
          {squares.map((value, index) => (
            <Square
              key={index}
              index={index}
              value={value}
              onSquareClick={() => handleClick(index)}
              disabled={Boolean(value) || Boolean(winnerState) || draw || isAiThinking}
              isWinningCell={winningCells.has(index)}
            />
          ))}
          <WinningLine
            lineIndex={winnerState?.lineIndex}
            winner={winnerState?.winner}
          />
        </div>
      </div>

      <div className='board-actions'>
        <button
          type='button'
          className='action-button action-button-primary'
          onClick={resetRound}
        >
          <RotateCcw size={18} />
          <span>Reiniciar ronda</span>
        </button>
        <button
          type='button'
          className='action-button action-button-secondary'
          onClick={() => resetSession(mode)}
        >
          <Sparkles size={18} />
          <span>Resetear marcador</span>
        </button>
      </div>

      <div className='board-footer-note'>
        {mode === 'ai'
          ? 'La IA juega perfecto con minimax, así que ganar requiere provocar un error imposible.'
          : 'Modo local pensado para una experiencia rápida, limpia y visualmente cuidada.'}
      </div>
    </section>
  );
}
