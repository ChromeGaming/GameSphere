import React from 'react';
import Game from './components/Game';

function App() {
  return (
    <div className="App" style={{ 
      width: '100vw', 
      height: '100vh', 
      overflow: 'hidden',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <Game />
    </div>
  );
}

export default App;