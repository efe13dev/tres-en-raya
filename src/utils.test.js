import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateDraw, calculateWinner, findAiMove, findBestMove } from './utils.js';

function withRandom (value, fn) {
  const original = Math.random;
  Math.random = () => value;
  try {
    return fn();
  } finally {
    Math.random = original;
  }
}

test('easy devuelve una casilla libre segun Math.random', () => {
  const squares = ['X', null, 'O', null, null, null, null, null, null];
  assert.equal(withRandom(0, () => findAiMove(squares, 'easy')), 1);
  assert.equal(withRandom(0.999, () => findAiMove(squares, 'easy')), 8);
});

test('normal prioriza ganar sobre bloquear', () => {
  const squares = ['O', 'O', null, 'X', 'X', null, 'X', null, null];
  assert.equal(findAiMove(squares, 'normal'), 2);
});

test('normal bloquea la linea del rival cuando no puede ganar', () => {
  const squares = ['X', 'X', null, 'O', null, null, null, null, null];
  assert.equal(findAiMove(squares, 'normal'), 2);
});

test('normal sin amenaza elige una casilla libre', () => {
  const squares = ['X', null, 'O', null, null, null, null, null, null];
  assert.equal(withRandom(0, () => findAiMove(squares, 'normal')), 1);
});

const terminalBoards = [
  ['X', 'X', 'X', 'O', 'O', null, null, null, null],
  ['X', 'O', 'X', 'X', 'O', 'O', 'O', 'X', 'O']
];

for (const difficulty of ['easy', 'normal', 'impossible']) {
  test(`${difficulty} devuelve null en tablero terminal`, () => {
    for (const squares of terminalBoards) {
      assert.equal(findAiMove(squares, difficulty), null);
    }
  });
}

test('impossible responde al centro ante X en una esquina', () => {
  const squares = ['X', null, null, null, null, null, null, null, null];
  assert.equal(findAiMove(squares, 'impossible'), 4);
});

test('impossible coincide con findBestMove en posiciones normales', () => {
  const fixtures = [
    ['X', null, null, null, 'O', null, null, null, 'X'],
    [null, 'X', null, null, 'O', null, 'X', null, null],
    ['O', 'X', null, null, 'X', null, null, 'O', null]
  ];
  for (const squares of fixtures) {
    assert.equal(findAiMove(squares, 'impossible'), findBestMove([...squares], 'O', 'X'));
  }
});

test('findAiMove no muta el tablero de entrada en ningun nivel', () => {
  for (const difficulty of ['easy', 'normal', 'impossible']) {
    const squares = ['X', null, 'O', null, 'X', null, null, null, null];
    const snapshot = squares.slice();
    findAiMove(squares, difficulty);
    assert.deepEqual(squares, snapshot);
  }
});

test('impossible nunca pierde jugando como O', () => {
  function playHumanTurns (squares) {
    const results = [];
    for (let i = 0; i < squares.length; i++) {
      if (squares[i] === null) {
        const next = squares.slice();
        next[i] = 'X';
        results.push(next);
      }
    }
    return results;
  }

  function resolve (squares) {
    const win = calculateWinner(squares);
    if (win || calculateDraw(squares)) {
      return win?.winner ?? 'draw';
    }
    let outcome = null;
    for (const next of playHumanTurns(squares)) {
      const aiIndex = findAiMove(next, 'impossible', 'O', 'X');
      const afterAi = next.slice();
      if (aiIndex !== null) {
        afterAi[aiIndex] = 'O';
      }
      const result = resolve(afterAi);
      if (result === 'X') {
        return 'X';
      }
      outcome = outcome === 'O' ? 'O' : result;
    }
    return outcome;
  }

  assert.notEqual(resolve(Array(9).fill(null)), 'X');
});
