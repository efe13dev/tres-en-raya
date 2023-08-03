import { useState } from 'react';
import { calculateWinner } from '../utils';
import { calculateDraw } from '../utils';
import 'animate.css';
import confetti from 'canvas-confetti';

function Square({ value, onSquareClick }) {
  return (
    <button
      className='square'
      onClick={onSquareClick}
    >
      {value}
    </button>
  );
}

export function Board() {
  const [xIsNext, setXIsNext] = useState(true);
  const [squares, setSquares] = useState(Array(9).fill(null));
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
    status = 'Turno de jugador: ' + (xIsNext ? 'X' : 'O');
  }
  const resetGame = () => {
    setSquares(Array(9).fill(null));
    setXIsNext(true);
  };

  return (
    <div className='board'>
      <div
        className={
          status === `Ganador: ${winner}` ? 'status, winner' : 'status'
        }
      >
        {status}
      </div>
      <div className='board-row'>
        <Square
          value={squares[0]}
          onSquareClick={() => handleClick(0)}
        />
        <Square
          value={squares[1]}
          onSquareClick={() => handleClick(1)}
        />
        <Square
          value={squares[2]}
          onSquareClick={() => handleClick(2)}
        />
      </div>
      <div className='board-row'>
        <Square
          value={squares[3]}
          onSquareClick={() => handleClick(3)}
        />
        <Square
          value={squares[4]}
          onSquareClick={() => handleClick(4)}
        />
        <Square
          value={squares[5]}
          onSquareClick={() => handleClick(5)}
        />
      </div>
      <div className='board-row'>
        <Square
          value={squares[6]}
          onSquareClick={() => handleClick(6)}
        />
        <Square
          value={squares[7]}
          onSquareClick={() => handleClick(7)}
        />
        <Square
          value={squares[8]}
          onSquareClick={() => handleClick(8)}
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
