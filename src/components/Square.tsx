import React from 'react';
import { Player, getPlayerEmoji } from '../utils/gameUtils';

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
      <span className="player-symbol">{getPlayerEmoji(value)}</span>
    </button>
  );
};

export default Square;
