import React from 'react';
import { Player } from '../utils/gameUtils';

interface SquareProps {
  value: Player;
  onClick: () => void;
}

const Square: React.FC<SquareProps> = ({ value, onClick }) => {
  return (
    <button 
      className="square" 
      onClick={onClick}
    >
      {value}
    </button>
  );
};

export default Square;
