import React, { useState, useEffect } from 'react';
import Board from './Board';
import Confetti from 'react-confetti';
import {
  Board as BoardType,
  GameState,
  calculateWinner,
  handleMove,
  jumpToMove,
  getGameStatus,
  getPlayerEmoji,
  Player,
  isDraw
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
  
  // State for confetti animation
  const [showConfetti, setShowConfetti] = useState(false);
  const [winner, setWinner] = useState<Player>(null);
  const [windowDimensions, setWindowDimensions] = useState({ width: window.innerWidth, height: window.innerHeight });
  const [isGameOver, setIsGameOver] = useState(false);

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
    
    // Reset confetti when jumping to a previous move
    setShowConfetti(false);
  };
  
  // Handler for starting a new game
  const handleNewGame = () => {
    setGameState({
      history: [{
        squares: Array(9).fill(null)
      }],
      stepNumber: 0,
      xIsNext: true
    });
    setShowConfetti(false);
    setWinner(null);
    setIsGameOver(false);
  };

  // Get the current board state
  const { history, stepNumber, xIsNext } = gameState;
  const current = history[stepNumber];
  
  // Update window dimensions for confetti
  useEffect(() => {
    const handleResize = () => {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Check for winner and trigger confetti
  useEffect(() => {
    const currentWinner = calculateWinner(current.squares);
    const gameIsDraw = isDraw(current.squares);
    
    if (currentWinner) {
      setWinner(currentWinner);
      setShowConfetti(true);
      setIsGameOver(true);
      
      // Hide confetti after 5 seconds
      const timer = setTimeout(() => {
        setShowConfetti(false);
      }, 5000);
      
      return () => clearTimeout(timer);
    } else if (gameIsDraw) {
      setIsGameOver(true);
      setShowConfetti(false);
      setWinner(null);
    } else {
      setShowConfetti(false);
      setWinner(null);
      setIsGameOver(false);
    }
  }, [current.squares]);
  
  // Generate move history buttons
  const moves = history.map((_, move) => {
    // Don't show "Go to game start" when we're already at the start (history.length === 1)
    if (move === 0 && history.length === 1) {
      return null;
    }
    
    const desc = move ?
      `Go to move #${move}` :
      'Go to game start';
    return (
      <li key={move}>
        <button onClick={() => handleJumpTo(move)}>{desc}</button>
      </li>
    );
  }).filter(Boolean); // Filter out null values

  // Get the game status message
  const status = getGameStatus(current.squares, xIsNext, history.length - 1);

  return (
    <div className="game">
      {showConfetti && (
        <div className="confetti-container">
          <Confetti
            width={windowDimensions.width}
            height={windowDimensions.height}
            numberOfPieces={200}
            recycle={false}
            confettiSource={{
              x: windowDimensions.width / 2,
              y: windowDimensions.height / 3,
              w: 0,
              h: 0
            }}
          />
          {winner && (
            <div className="winner-emoji">
              {getPlayerEmoji(winner)}
            </div>
          )}
        </div>
      )}
      <div className="game-board">
        <Board
          squares={current.squares}
          onClick={(i) => handleClick(i)}
        />
      </div>
      <div className="game-info">
        <div className={winner ? "status winner-status" : isGameOver ? "status draw-status" : "status"}>{status}</div>
        
        {isGameOver && (
          <button 
            className="new-game-button" 
            onClick={handleNewGame}
          >
            New Game 🎮
          </button>
        )}
        
        {moves.length > 0 && <ol>{moves}</ol>}
      </div>
    </div>
  );
};

export default Game;
