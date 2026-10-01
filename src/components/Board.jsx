import confetti from 'canvas-confetti';
import { motion, useReducedMotion } from 'framer-motion';
import { Eraser, RotateCcw } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useSound } from '../hooks/useSound';
import { calculateDraw, calculateWinner, findAiMove } from '../utils';
import { ModeSelector } from './ModeSelector';
import { Scoreboard } from './Scoreboard';
import { WinningLine } from './WinningLine';

const createEmptyBoard = () => Array(9).fill(null);
const INITIAL_SCORE = {
  X: 0,
  O: 0,
  draws: 0
};

function Square ({
  index,
  value,
  onSquareClick,
  disabled,
  isWinningCell
}) {
  const reduceMotion = useReducedMotion();
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
      whileTap={disabled || reduceMotion ? undefined : { scale: 0.97 }}
    >
      {value && (
        <motion.span
          key={`${index}-${value}`}
          initial={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.55, rotate: value === 'X' ? -16 : 16 }}
          animate={reduceMotion ? { opacity: 1 } : { opacity: 1, scale: 1, rotate: 0 }}
          transition={reduceMotion ? { duration: 0.12 } : { type: 'spring', stiffness: 280, damping: 18 }}
        >
          {value}
        </motion.span>
      )}
    </motion.button>
  );
}

export function Board ({ soundEnabled }) {
  const [xIsNext, setXIsNext] = useState(true);
  const [squares, setSquares] = useState(createEmptyBoard);
  const [score, setScore] = useState(INITIAL_SCORE);
  const [isResetting, setIsResetting] = useState(false);
  const [mode, setMode] = useState('pvp');
  const [difficulty, setDifficulty] = useState('normal');
  const [isAiThinking, setIsAiThinking] = useState(false);
  const resolutionKeyRef = useRef('');
  const resetPulseRef = useRef(null);
  const { play, warmup } = useSound(soundEnabled);

  function randomInRange (min, max) {
    return Math.random() * (max - min) + min;
  }

  const winnerState = calculateWinner(squares);
  const draw = calculateDraw(squares);
  const winningCells = new Set(winnerState?.line ?? []);
  const currentPlayer = xIsNext ? 'X' : 'O';
  const statusTone = winnerState
    ? `Gana ${winnerState.winner}`
    : draw
      ? 'Empate'
      : mode === 'ai'
        ? xIsNext
          ? 'Tu turno'
          : 'La IA está pensando'
        : `Turno de ${currentPlayer}`;
  const statusCaption = winnerState
    ? 'Pulsa Nueva ronda para seguir jugando.'
    : draw
      ? 'No quedan casillas libres.'
      : mode === 'ai'
        ? xIsNext
          ? 'Juegas con X. La IA responde con O.'
          : 'La IA mueve con una pequeña pausa.'
        : 'Dos jugadores en el mismo dispositivo.';

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
        origin: { y: 0.58 },
        disableForReducedMotion: true
      });
      confetti({
        angle: randomInRange(235, 305),
        spread: randomInRange(70, 95),
        particleCount: randomInRange(90, 130),
        origin: { y: 0.58 },
        disableForReducedMotion: true
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
      const nextMove = findAiMove(squares, difficulty, 'O', 'X');

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
  }, [difficulty, draw, mode, play, squares, warmup, winnerState, xIsNext]);

  function triggerResetPulse () {
    setIsResetting(true);
    if (resetPulseRef.current) {
      window.clearTimeout(resetPulseRef.current);
    }
    resetPulseRef.current = window.setTimeout(() => {
      setIsResetting(false);
    }, 260);
  }

  function resetRound () {
    triggerResetPulse();
    setSquares(createEmptyBoard());
    setXIsNext(true);
    setIsAiThinking(false);
    warmup();
    play('reset');
  }

  function resetSession (nextMode = mode) {
    setMode(nextMode);
    setScore(INITIAL_SCORE);
    setSquares(createEmptyBoard());
    setXIsNext(true);
    setIsAiThinking(false);
    triggerResetPulse();
    warmup();
    play('reset');
  }

  function handleClick (i) {
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
        <h2 className='board-heading'>Tu partida</h2>
        <ModeSelector
          mode={mode}
          onChange={(nextMode) => resetSession(nextMode)}
        />
      </div>

      {mode === 'ai' && (
        <div className='difficulty-control'>
          <label htmlFor='ai-difficulty'>Dificultad</label>
          <select
            id='ai-difficulty'
            className='difficulty-select'
            value={difficulty}
            onChange={(event) => {
              setDifficulty(event.target.value);
              resetSession('ai');
            }}
            aria-describedby='difficulty-hint'
          >
            <option value='easy'>Fácil</option>
            <option value='normal'>Normal</option>
            <option value='impossible'>Imposible</option>
          </select>
          <span className='difficulty-hint' id='difficulty-hint'>
            Cambiar dificultad reinicia la ronda y el marcador.
          </span>
        </div>
      )}

      <div
        className='status-panel'
        aria-live='polite'
        aria-atomic='true'
      >
        <div className='status-copy'>
          <h3
            className={[
              'status-value',
              winnerState ? `status-win-${winnerState.winner.toLowerCase()}` : '',
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
          <span className='status-chip-label'>
            {winnerState ? 'Ganador' : draw ? 'Resultado' : 'Turno'}
          </span>
          <strong
            className={`player-chip player-chip-${
              winnerState
                ? winnerState.winner.toLowerCase()
                : draw
                  ? 'neutral'
                  : currentPlayer.toLowerCase()
            }`}
          >
            {winnerState
              ? winnerState.winner
              : draw
                ? '='
                : mode === 'ai' && !xIsNext
                  ? 'IA · O'
                  : currentPlayer}
          </strong>
        </div>
      </div>

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

      <Scoreboard
        score={score}
        activePlayer={draw ? null : currentPlayer}
        winner={winnerState?.winner}
      />

      <div className='board-actions'>
        <button
          type='button'
          className='action-button action-button-primary'
          onClick={resetRound}
        >
          <RotateCcw size={17} />
          <span>Nueva ronda</span>
        </button>
        <button
          type='button'
          className='action-button action-button-secondary'
          onClick={() => resetSession(mode)}
          aria-describedby='reset-score-hint'
        >
          <Eraser size={17} />
          <span>Borrar marcador</span>
        </button>
        <span className='action-hint' id='reset-score-hint'>
          Borrar marcador también reinicia la ronda.
        </span>
      </div>

      <div className='board-footer-note'>
        {mode === 'ai'
          ? difficulty === 'easy'
            ? 'La IA elige una casilla al azar.'
            : difficulty === 'normal'
              ? 'La IA busca ganar y bloquea tus líneas.'
              : 'La IA juega sin errores. ¿Puedes conseguir un empate?'
          : 'X empieza. Después, alternad turnos.'}
      </div>
    </section>
  );
}
