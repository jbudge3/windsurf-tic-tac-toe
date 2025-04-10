import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Tic Tac Toe heading', () => {
  render(<App />);
  const headingElement = screen.getByText(/tic tac toe/i);
  expect(headingElement).toBeInTheDocument();
});
