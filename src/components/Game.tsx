import React, { useState } from 'react';
import Board from './Board';
import {
  Board as BoardType,
  GameState,
  calculateWinner,
  handleMove,
  jumpToMove,
  getGameStatus
} from '../utils/gameUtils';

const Game: React.FC = () => {
  // Initialize game state using the types from gameUtils
  const [gameState, setGameState] = useState<GameState>({
    history: [{
      squares: Array(9).fill(null)
    }],
    stepNumber: 0,
    xIsNext: true
  });

  // Handler for when a square is clicked
  const handleClick = (i: number) => {
    // Use the utility function to get the new game state
    const newGameState = handleMove(gameState, i);
    setGameState(newGameState);
  };

  // Handler for jumping to a previous move
  const handleJumpTo = (step: number) => {
    // Use the utility function to get the new game state after time travel
    const newGameState = jumpToMove(gameState, step);
    setGameState(newGameState);
  };

  // Get the current board state
  const { history, stepNumber, xIsNext } = gameState;
  const current = history[stepNumber];
  
  // Generate move history buttons
  const moves = history.map((_, move) => {
    const desc = move ?
      `Go to move #${move}` :
      'Go to game start';
    return (
      <li key={move}>
        <button onClick={() => handleJumpTo(move)}>{desc}</button>
      </li>
    );
  });

  // Get the game status message
  const status = getGameStatus(current.squares, xIsNext, history.length - 1);

  return (
    <div className="game">
      <div className="game-board">
        <Board
          squares={current.squares}
          onClick={(i) => handleClick(i)}
        />
      </div>
      <div className="game-info">
        <div>{status}</div>
        <ol>{moves}</ol>
      </div>
    </div>
  );
};

export default Game;
