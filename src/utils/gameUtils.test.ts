import {
  calculateWinner,
  isDraw,
  getCurrentPlayer,
  makeMove,
  handleMove,
  jumpToMove,
  getGameStatus,
  Board,
  GameState
} from './gameUtils';

describe('Game Utility Functions', () => {
  // Test calculateWinner function
  describe('calculateWinner', () => {
    it('should return null for an empty board', () => {
      const board: Board = Array(9).fill(null);
      expect(calculateWinner(board)).toBeNull();
    });

    it('should return null when there is no winner', () => {
      const board: Board = [
        'X', 'O', 'X',
        'O', 'X', 'O',
        'O', 'X', 'O'
      ];
      expect(calculateWinner(board)).toBeNull();
    });

    it('should detect a horizontal win for X', () => {
      const board: Board = [
        'X', 'X', 'X',
        'O', 'O', null,
        null, null, null
      ];
      expect(calculateWinner(board)).toBe('X');
    });

    it('should detect a vertical win for O', () => {
      const board: Board = [
        'X', 'O', 'X',
        'X', 'O', null,
        null, 'O', null
      ];
      expect(calculateWinner(board)).toBe('O');
    });

    it('should detect a diagonal win for X', () => {
      const board: Board = [
        'X', 'O', 'O',
        null, 'X', null,
        null, null, 'X'
      ];
      expect(calculateWinner(board)).toBe('X');
    });
  });

  // Test isDraw function
  describe('isDraw', () => {
    it('should return false for an empty board', () => {
      const board: Board = Array(9).fill(null);
      expect(isDraw(board)).toBe(false);
    });

    it('should return false when there is a winner', () => {
      const board: Board = [
        'X', 'X', 'X',
        'O', 'O', null,
        null, null, null
      ];
      expect(isDraw(board)).toBe(false);
    });

    it('should return true when all squares are filled and there is no winner', () => {
      const board: Board = [
        'X', 'O', 'X',
        'X', 'O', 'X',
        'O', 'X', 'O'
      ];
      expect(isDraw(board)).toBe(true);
    });

    it('should return false when not all squares are filled and there is no winner', () => {
      const board: Board = [
        'X', 'O', 'X',
        'X', 'O', null,
        null, null, null
      ];
      expect(isDraw(board)).toBe(false);
    });
  });

  // Test getCurrentPlayer function
  describe('getCurrentPlayer', () => {
    it('should return X when xIsNext is true', () => {
      expect(getCurrentPlayer(true)).toBe('X');
    });

    it('should return O when xIsNext is false', () => {
      expect(getCurrentPlayer(false)).toBe('O');
    });
  });

  // Test makeMove function
  describe('makeMove', () => {
    it('should return a new board with the move applied', () => {
      const board: Board = Array(9).fill(null);
      const newBoard = makeMove(board, 4, 'X');
      
      // Original board should be unchanged
      expect(board[4]).toBeNull();
      
      // New board should have the move
      expect(newBoard[4]).toBe('X');
    });

    it('should not modify the board if the square is already filled', () => {
      const board: Board = Array(9).fill(null);
      board[4] = 'O';
      
      const newBoard = makeMove(board, 4, 'X');
      
      // Should return the same board (move not applied)
      expect(newBoard[4]).toBe('O');
    });

    it('should not modify the board if there is already a winner', () => {
      const board: Board = [
        'X', 'X', 'X',
        'O', 'O', null,
        null, null, null
      ];
      
      const newBoard = makeMove(board, 5, 'O');
      
      // Should return the same board (move not applied)
      expect(newBoard[5]).toBeNull();
    });
  });

  // Test handleMove function
  describe('handleMove', () => {
    it('should update the game state after a valid move', () => {
      const gameState: GameState = {
        history: [{ squares: Array(9).fill(null) }],
        stepNumber: 0,
        xIsNext: true
      };
      
      const newGameState = handleMove(gameState, 4);
      
      // Check that history has a new entry
      expect(newGameState.history.length).toBe(2);
      
      // Check that the move was recorded
      expect(newGameState.history[1].squares[4]).toBe('X');
      
      // Check that stepNumber was incremented
      expect(newGameState.stepNumber).toBe(1);
      
      // Check that xIsNext was toggled
      expect(newGameState.xIsNext).toBe(false);
    });

    it('should not update the game state for an invalid move', () => {
      // Create a game state with a pre-filled square
      const initialBoard: Board = Array(9).fill(null);
      initialBoard[4] = 'X';
      
      const gameState: GameState = {
        history: [{ squares: initialBoard }],
        stepNumber: 0,
        xIsNext: false
      };
      
      // Try to make a move on the already filled square
      const newGameState = handleMove(gameState, 4);
      
      // Game state should remain unchanged
      expect(newGameState).toBe(gameState);
    });
  });

  // Test jumpToMove function
  describe('jumpToMove', () => {
    it('should update stepNumber and xIsNext when jumping to a move', () => {
      const gameState: GameState = {
        history: [
          { squares: Array(9).fill(null) },
          { squares: Array(9).fill(null) },
          { squares: Array(9).fill(null) },
          { squares: Array(9).fill(null) }
        ],
        stepNumber: 3,
        xIsNext: false
      };
      
      const newGameState = jumpToMove(gameState, 1);
      
      // Check that stepNumber was updated
      expect(newGameState.stepNumber).toBe(1);
      
      // Check that xIsNext was updated (odd step number means O's turn)
      expect(newGameState.xIsNext).toBe(false);
      
      // History should remain unchanged
      expect(newGameState.history).toBe(gameState.history);
    });
  });

  // Test getGameStatus function
  describe('getGameStatus', () => {
    it('should return "First player" when the game has not started yet', () => {
      const board: Board = Array(9).fill(null);
      const status = getGameStatus(board, true, 0);
      expect(status).toBe('First player: 🏄 (X)');
    });

    it('should return "Next player" when the game is in progress', () => {
      const board: Board = Array(9).fill(null);
      board[0] = 'X';
      const status = getGameStatus(board, false, 1);
      expect(status).toBe('Next player: 🌊 (O)');
    });

    it('should return the correct status when X wins', () => {
      const board: Board = [
        'X', 'X', 'X',
        'O', 'O', null,
        null, null, null
      ];
      const status = getGameStatus(board, false, 5);
      expect(status).toBe('Winner: 🏄 (X)');
    });

    it('should return the correct status when O wins', () => {
      const board: Board = [
        'X', 'O', 'X',
        'X', 'O', null,
        null, 'O', null
      ];
      const status = getGameStatus(board, true, 6);
      expect(status).toBe('Winner: 🌊 (O)');
    });

    it('should return the correct status for a draw', () => {
      const board: Board = [
        'X', 'O', 'X',
        'X', 'O', 'X',
        'O', 'X', 'O'
      ];
      const status = getGameStatus(board, true, 9);
      expect(status).toBe('Game ended in a draw');
    });
  });
});
