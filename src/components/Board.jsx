import 'animate.css';
import confetti from 'canvas-confetti';
import { useState } from 'react';
import { calculateDraw, calculateWinner } from '../utils';

function Square({ value, onSquareClick, isResetting }) {
  const squareClass = value 
    ? `square square-${value.toLowerCase()}${isResetting ? ' square-reset' : ''}` 
    : 'square';
  return (
    <button
      className={squareClass}
      onClick={onSquareClick}
    >
      <span>{value}</span>
    </button>
  );
}

export function Board() {
  const [xIsNext, setXIsNext] = useState(true);
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [isResetting, setIsResetting] = useState(false);

  function randomInRange(min, max) {
    return Math.random() * (max - min) + min;
  }

  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    setSquares(nextSquares);
    setXIsNext(!xIsNext);
  }

  const winner = calculateWinner(squares);
  const draw = calculateDraw(squares);

  let status;
  if (winner) {
    status = `Ganador: ${winner}`;
    confetti({
      angle: randomInRange(55, 125),
      spread: randomInRange(50, 70),
      particleCount: randomInRange(50, 100),
      origin: { y: 0.6 }
    });
  } else if (draw) {
    status = 'Empate';
  } else {
    const currentPlayer = xIsNext ? 'X' : 'O';
    status = (
      <>
        Turno de jugador: <span className={`current-player current-player-${currentPlayer.toLowerCase()}`}>{currentPlayer}</span>
      </>
    );
  }

  const resetGame = () => {
    setIsResetting(true);
    setTimeout(() => {
      setSquares(Array(9).fill(null));
      setXIsNext(true);
      setIsResetting(false);
    }, 500);
  };

  return (
    <div className='board'>
      <div
        className={
          status === `Ganador: ${winner}` ? 'status winner' : 'status'
        }
      >
        {status}
      </div>
      <div className='board-row'>
        <Square
          value={squares[0]}
          onSquareClick={() => handleClick(0)}
          isResetting={isResetting}
        />
        <Square
          value={squares[1]}
          onSquareClick={() => handleClick(1)}
          isResetting={isResetting}
        />
        <Square
          value={squares[2]}
          onSquareClick={() => handleClick(2)}
          isResetting={isResetting}
        />
      </div>
      <div className='board-row'>
        <Square
          value={squares[3]}
          onSquareClick={() => handleClick(3)}
          isResetting={isResetting}
        />
        <Square
          value={squares[4]}
          onSquareClick={() => handleClick(4)}
          isResetting={isResetting}
        />
        <Square
          value={squares[5]}
          onSquareClick={() => handleClick(5)}
          isResetting={isResetting}
        />
      </div>
      <div className='board-row'>
        <Square
          value={squares[6]}
          onSquareClick={() => handleClick(6)}
          isResetting={isResetting}
        />
        <Square
          value={squares[7]}
          onSquareClick={() => handleClick(7)}
          isResetting={isResetting}
        />
        <Square
          value={squares[8]}
          onSquareClick={() => handleClick(8)}
          isResetting={isResetting}
        />
      </div>
      <button
        className='reset'
        onClick={resetGame}
      >
        Reiniciar juego
      </button>
    </div>
  );
}
