const WINNING_LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];

export function calculateWinner(squares) {
  for (let i = 0; i < WINNING_LINES.length; i++) {
    const [a, b, c] = WINNING_LINES[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return {
        winner: squares[a],
        line: WINNING_LINES[i],
        lineIndex: i
      };
    }
  }
  return null;
}

export function calculateDraw(squares) {
  for (let i = 0; i < squares.length; i++) {
    if (squares[i] === null) {
      return false;
    }
  }
  return true;
}

function minimax(board, isMaximizing, aiPlayer, humanPlayer, depth) {
  const result = calculateWinner(board);

  if (result?.winner === aiPlayer) {
    return 10 - depth;
  }

  if (result?.winner === humanPlayer) {
    return depth - 10;
  }

  if (calculateDraw(board)) {
    return 0;
  }

  if (isMaximizing) {
    let bestScore = -Infinity;

    for (let i = 0; i < board.length; i++) {
      if (board[i] !== null) {
        continue;
      }

      board[i] = aiPlayer;
      bestScore = Math.max(
        bestScore,
        minimax(board, false, aiPlayer, humanPlayer, depth + 1)
      );
      board[i] = null;
    }

    return bestScore;
  }

  let bestScore = Infinity;

  for (let i = 0; i < board.length; i++) {
    if (board[i] !== null) {
      continue;
    }

    board[i] = humanPlayer;
    bestScore = Math.min(
      bestScore,
      minimax(board, true, aiPlayer, humanPlayer, depth + 1)
    );
    board[i] = null;
  }

  return bestScore;
}

export function findBestMove(squares, aiPlayer = 'O', humanPlayer = 'X') {
  let bestScore = -Infinity;
  let bestMove = null;

  for (let i = 0; i < squares.length; i++) {
    if (squares[i] !== null) {
      continue;
    }

    squares[i] = aiPlayer;
    const score = minimax(squares, false, aiPlayer, humanPlayer, 0);
    squares[i] = null;

    if (score > bestScore) {
      bestScore = score;
      bestMove = i;
    }
  }

  return bestMove;
}
