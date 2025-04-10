// Define types for the game
export type Player = 'X' | 'O' | null;

// Emoji mapping for players
export const PLAYER_EMOJIS: Record<'X' | 'O', string> = {
  'X': '🏄',  // Surfer emoji
  'O': '🌊'   // Wave emoji
};

// Function to get emoji for a player
export const getPlayerEmoji = (player: Player): string => {
  if (!player) return '';
  return PLAYER_EMOJIS[player];
};
export type Board = Player[];

export interface GameState {
  history: { squares: Board }[];
  stepNumber: number;
  xIsNext: boolean;
}

/**
 * All possible winning line combinations in a 3x3 tic-tac-toe board
 * Each sub-array represents indices that form a winning line
 */
const WINNING_LINES: number[][] = [
  [0, 1, 2], // top row
  [3, 4, 5], // middle row
  [6, 7, 8], // bottom row
  [0, 3, 6], // left column
  [1, 4, 7], // middle column
  [2, 5, 8], // right column
  [0, 4, 8], // diagonal top-left to bottom-right
  [2, 4, 6], // diagonal top-right to bottom-left
];

/**
 * Determines if there is a winner based on the current board state
 * @param squares - Current board state
 * @returns The winning player ('X' or 'O') or null if no winner
 */
export const calculateWinner = (squares: Board): Player => {
  
  // Find the first winning line or return null if none found
  const winningLine = WINNING_LINES.find(line => {
    const [a, b, c] = line;
    return squares[a] && squares[a] === squares[b] && squares[a] === squares[c];
  });
  
  // Return the winner (X or O) or null if no winner
  return winningLine ? squares[winningLine[0]] : null;
};

/**
 * Checks if the game is a draw (all squares filled with no winner)
 * @param squares - Current board state
 * @returns True if the game is a draw, false otherwise
 */
export const isDraw = (squares: Board): boolean => {
  // First check if there's a winner - if so, it can't be a draw
  if (calculateWinner(squares)) {
    return false;
  }
  
  // If no winner, check if all squares are filled
  return squares.every(square => square !== null);
};

/**
 * Get the current player based on xIsNext state
 * @param xIsNext - Boolean indicating if it's X's turn
 * @returns The current player ('X' or 'O')
 */
export const getCurrentPlayer = (xIsNext: boolean): 'X' | 'O' => {
  return xIsNext ? 'X' : 'O';
};

/**
 * Creates a new board state after a move
 * @param squares - Current board state
 * @param index - Index where the move is made
 * @param player - Player making the move ('X' or 'O')
 * @returns New board state after the move
 */
export const makeMove = (squares: Board, index: number, player: 'X' | 'O'): Board => {
  // If square is already filled or there's a winner, return the original board
  if (squares[index] || calculateWinner(squares)) {
    return squares;
  }
  
  // Create a new board with the move applied using immutable approach
  return squares.map((square, i) => i === index ? player : square);
};

/**
 * Creates a new game state after a move
 * @param gameState - Current game state
 * @param index - Index where the move is made
 * @returns New game state after the move
 */
export const handleMove = (gameState: GameState, index: number): GameState => {
  const { history, stepNumber, xIsNext } = gameState;
  const currentHistory = history.slice(0, stepNumber + 1);
  const current = currentHistory[currentHistory.length - 1];
  const squares = current.squares.slice();
  
  // If square is already filled or there's a winner, return the original state
  if (calculateWinner(squares) || squares[index]) {
    return gameState;
  }
  
  // Get the current player
  const currentPlayer = getCurrentPlayer(xIsNext);
  
  // Create a new board with the move applied
  const newSquares = squares.slice();
  newSquares[index] = currentPlayer;
  
  // Return new game state
  return {
    history: [...currentHistory, { squares: newSquares }],
    stepNumber: currentHistory.length,
    xIsNext: !xIsNext,
  };
};

/**
 * Determines whose turn it is based on the step number
 * @param step - The step number in the game history
 * @returns Boolean indicating if it's X's turn (true) or O's turn (false)
 */
export const isXTurn = (step: number): boolean => {
  // X starts the game (step 0) and plays on even-numbered steps
  return (step % 2) === 0;
};

/**
 * Creates a new game state after jumping to a specific move
 * @param gameState - Current game state
 * @param step - Step number to jump to
 * @returns New game state after the time travel
 */
export const jumpToMove = (gameState: GameState, step: number): GameState => {
  // Validate step is within bounds
  if (step < 0 || step >= gameState.history.length) {
    console.warn(`Invalid step: ${step}. History length: ${gameState.history.length}`);
    return gameState;
  }
  
  // Create a new game state with the updated step number and player turn
  return {
    ...gameState,
    stepNumber: step,
    xIsNext: isXTurn(step),
  };
};

/**
 * Game status types for better type safety
 */
export type GameStatus = 
  | { type: 'winner'; player: 'X' | 'O' }
  | { type: 'draw' }
  | { type: 'next'; player: 'X' | 'O' };

/**
 * Gets the game status object based on current state
 * @param squares - Current board state
 * @param xIsNext - Boolean indicating if it's X's turn
 * @param moveCount - Total number of moves made
 * @returns Game status object describing the current state
 */
export const getGameStatusObject = (squares: Board, xIsNext: boolean, moveCount: number): GameStatus => {
  // Check for a winner first
  const winner = calculateWinner(squares);
  if (winner) {
    return { type: 'winner', player: winner };
  }
  
  // Check for a draw (all squares filled)
  if (moveCount === 9) {
    return { type: 'draw' };
  }
  
  // Game in progress - next player's turn
  return { type: 'next', player: getCurrentPlayer(xIsNext) };
};

/**
 * Gets the game status message based on current state
 * @param squares - Current board state
 * @param xIsNext - Boolean indicating if it's X's turn
 * @param moveCount - Total number of moves made
 * @returns Status message describing the game state
 */
export const getGameStatus = (squares: Board, xIsNext: boolean, moveCount: number): string => {
  const status = getGameStatusObject(squares, xIsNext, moveCount);
  
  switch (status.type) {
    case 'winner':
      return `Winner: ${getPlayerEmoji(status.player)} (${status.player})`;
    case 'draw':
      return 'Game ended in a draw';
    case 'next':
      return moveCount === 0 
        ? `First player: ${getPlayerEmoji(status.player)} (${status.player})` 
        : `Next player: ${getPlayerEmoji(status.player)} (${status.player})`;
  }
};
