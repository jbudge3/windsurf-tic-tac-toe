import React from 'react';
import './App.css';
import Game from './components/Game';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>🏄 Surf & Wave Tic Tac Toe 🌊</h1>
        <p className="tagline">Catch the perfect wave and surf to victory!</p>
      </header>
      <main>
        <Game />
      </main>
    </div>
  );
}

export default App;
