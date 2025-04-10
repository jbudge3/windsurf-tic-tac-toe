import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Board from './Board';
import { Board as BoardType } from '../utils/gameUtils';

describe('Board Component', () => {
  test('renders 9 squares', () => {
    const squares: BoardType = Array(9).fill(null);
    const handleClick = jest.fn();
    
    render(<Board squares={squares} onClick={handleClick} />);
    
    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(9);
  });

  test('renders squares with correct values', () => {
    const squares: BoardType = [
      'X', 'O', 'X',
      null, 'O', null,
      null, null, 'X'
    ];
    const handleClick = jest.fn();
    
    render(<Board squares={squares} onClick={handleClick} />);
    
    const buttons = screen.getAllByRole('button');
    
    // Check that each square has the correct value
    expect(buttons[0].textContent).toBe('X');
    expect(buttons[1].textContent).toBe('O');
    expect(buttons[2].textContent).toBe('X');
    expect(buttons[3].textContent).toBe('');
    expect(buttons[4].textContent).toBe('O');
    expect(buttons[5].textContent).toBe('');
    expect(buttons[6].textContent).toBe('');
    expect(buttons[7].textContent).toBe('');
    expect(buttons[8].textContent).toBe('X');
  });

  test('calls onClick with correct index when a square is clicked', () => {
    const squares: BoardType = Array(9).fill(null);
    const handleClick = jest.fn();
    
    render(<Board squares={squares} onClick={handleClick} />);
    
    const buttons = screen.getAllByRole('button');
    
    // Click the middle square (index 4)
    fireEvent.click(buttons[4]);
    
    expect(handleClick).toHaveBeenCalledTimes(1);
    expect(handleClick).toHaveBeenCalledWith(4);
    
    // Click another square (index 8)
    fireEvent.click(buttons[8]);
    
    expect(handleClick).toHaveBeenCalledTimes(2);
    expect(handleClick).toHaveBeenCalledWith(8);
  });
});
