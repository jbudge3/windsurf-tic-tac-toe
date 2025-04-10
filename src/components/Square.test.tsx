import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Square from './Square';
import { getPlayerEmoji } from '../utils/gameUtils';

describe('Square Component', () => {
  test('renders with null value', () => {
    const handleClick = jest.fn();
    render(<Square value={null} onClick={handleClick} />);
    
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button.textContent).toBe('');
  });

  test('renders with X value', () => {
    const handleClick = jest.fn();
    render(<Square value="X" onClick={handleClick} />);
    
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button.textContent).toBe(getPlayerEmoji('X'));
  });

  test('renders with O value', () => {
    const handleClick = jest.fn();
    render(<Square value="O" onClick={handleClick} />);
    
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button.textContent).toBe(getPlayerEmoji('O'));
  });

  test('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Square value={null} onClick={handleClick} />);
    
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
