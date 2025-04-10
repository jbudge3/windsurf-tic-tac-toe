import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Game from './Game';

describe('Game Component', () => {
  test('renders the game board with 9 squares', () => {
    render(<Game />);
    
    // Check that the board is rendered with 9 squares
    const squares = screen.getAllByRole('button').filter(button => 
      button.className === 'square'
    );
    expect(squares).toHaveLength(9);
  });

  test('renders initial game status and history', () => {
    render(<Game />);
    
    // Check that there's a status element (exact text may vary based on implementation)
    const statusElement = screen.getByText(/next player/i);
    expect(statusElement).toBeInTheDocument();
    
    // Check that the history list has the initial move
    const historyButton = screen.getByText(/go to game start/i);
    expect(historyButton).toBeInTheDocument();
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
    
    // The first square should now have an X
    expect(squares[0].textContent).toBe('X');
    
    // The status should indicate it's O's turn
    expect(screen.getByText(/next player: o/i)).toBeInTheDocument();
  });

  test('allows playing a full game with alternating turns', () => {
    render(<Game />);
    
    // Get all squares
    const squares = screen.getAllByRole('button').filter(button => 
      button.className === 'square'
    );
    
    // Play a sequence of moves
    fireEvent.click(squares[0]); // X plays at index 0
    expect(squares[0].textContent).toBe('X');
    
    fireEvent.click(squares[4]); // O plays at index 4
    expect(squares[4].textContent).toBe('O');
    
    fireEvent.click(squares[1]); // X plays at index 1
    expect(squares[1].textContent).toBe('X');
    
    // After 3 moves, there should be 4 history entries (including start)
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
    expect(squares[0].textContent).toBe('X');
    expect(squares[4].textContent).toBe('');
    expect(squares[1].textContent).toBe('');
    
    // The status should indicate it's O's turn
    expect(screen.getByText(/next player: o/i)).toBeInTheDocument();
  });
});
