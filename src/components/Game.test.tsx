import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Game from './Game';
import { getPlayerEmoji } from '../utils/gameUtils';

describe('Game Component', () => {
  test('renders the game board with 9 squares', () => {
    render(<Game />);
    
    // Check that the board is rendered with 9 squares
    const squares = screen.getAllByRole('button').filter(button => 
      button.className === 'square'
    );
    expect(squares).toHaveLength(9);
  });

  test('renders initial game status without history', () => {
    render(<Game />);
    
    // Check that there's a status element showing "First player" for the initial state
    const statusElement = screen.getByText(/first player/i);
    expect(statusElement).toBeInTheDocument();
    
    // Verify that the "Go to game start" button is not present initially
    const historyButton = screen.queryByText(/go to game start/i);
    expect(historyButton).not.toBeInTheDocument();
    
    // Verify that the ordered list for move history is not present initially
    const movesList = screen.queryByRole('list');
    expect(movesList).not.toBeInTheDocument();
  });

  test('updates the board when a square is clicked', () => {
    render(<Game />);
    
    // Get all squares
    const squares = screen.getAllByRole('button').filter(button => 
      button.className === 'square'
    );
    
    // Initially all squares should be empty
    squares.forEach(square => {
      expect(square.textContent).toBe('');
    });
    
    // Click the first square
    fireEvent.click(squares[0]);
    
    // The first square should now have the X emoji (surfer)
    expect(squares[0].textContent).toBe(getPlayerEmoji('X'));
    
    // The status should indicate it's O's turn
    expect(screen.getByText(/next player/i)).toBeInTheDocument();
    expect(screen.getByText(new RegExp(getPlayerEmoji('O'), 'i'))).toBeInTheDocument();
  });

  test('allows playing a full game with alternating turns', () => {
    render(<Game />);
    
    // Get all squares
    const squares = screen.getAllByRole('button').filter(button => 
      button.className === 'square'
    );
    
    // Play a sequence of moves
    fireEvent.click(squares[0]); // X plays at index 0
    expect(squares[0].textContent).toBe(getPlayerEmoji('X'));
    
    fireEvent.click(squares[4]); // O plays at index 4
    expect(squares[4].textContent).toBe(getPlayerEmoji('O'));
    
    fireEvent.click(squares[1]); // X plays at index 1
    expect(squares[1].textContent).toBe(getPlayerEmoji('X'));
    
    // After 3 moves, there should be 4 history entries (3 moves + go to start)
    const historyButtons = screen.getAllByRole('button').filter(button => 
      button.textContent?.includes('Go to move') || button.textContent?.includes('Go to game start')
    );
    expect(historyButtons).toHaveLength(4);
  });

  test('allows time travel to previous moves', () => {
    render(<Game />);
    
    // Get all squares
    const squares = screen.getAllByRole('button').filter(button => 
      button.className === 'square'
    );
    
    // Play a sequence of moves
    fireEvent.click(squares[0]); // X plays at index 0
    fireEvent.click(squares[4]); // O plays at index 4
    fireEvent.click(squares[1]); // X plays at index 1
    
    // Find and click the "Go to move #1" button
    const moveButtons = screen.getAllByText(/go to move #/i);
    fireEvent.click(moveButtons[0]); // Go to move #1
    
    // After going back to move 1, only the first move should be visible
    expect(squares[0].textContent).toBe(getPlayerEmoji('X'));
    expect(squares[4].textContent).toBe('');
    expect(squares[1].textContent).toBe('');
    
    // The status should indicate it's O's turn
    expect(screen.getByText(/next player/i)).toBeInTheDocument();
    expect(screen.getByText(new RegExp(getPlayerEmoji('O'), 'i'))).toBeInTheDocument();
  });
});
