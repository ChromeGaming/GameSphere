import React, { useState, useEffect } from 'react';

const COLORS = ['red', 'blue', 'green'];

function Game() {
  const [playerPosition, setPlayerPosition] = useState({ x: 0, y: 0 });
  const [boxes, setBoxes] = useState([]);
  const [playerSize, setPlayerSize] = useState(1);
  const [gridSize, setGridSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateGridSize = () => {
      const cellSize = 30; // Each cell is 30x30 pixels
      setGridSize({
        width: Math.floor(window.innerWidth / cellSize),
        height: Math.floor(window.innerHeight / cellSize),
      });
    };

    updateGridSize();
    window.addEventListener('resize', updateGridSize);

    return () => window.removeEventListener('resize', updateGridSize);
  }, []);

  useEffect(() => {
    // Initialize boxes
    const initialBoxes = [];
    for (let i = 0; i < 20; i++) {
      initialBoxes.push({
        x: Math.floor(Math.random() * gridSize.width),
        y: Math.floor(Math.random() * gridSize.height),
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
      });
    }
    setBoxes(initialBoxes);
  }, [gridSize]);

  useEffect(() => {
    const handleKeyPress = (e) => {
      const key = e.key.toLowerCase();
      switch (key) {
        case 'arrowup':
        case 'w':
          setPlayerPosition(prev => ({ ...prev, y: Math.max(0, prev.y - 1) }));
          break;
        case 'arrowdown':
        case 's':
          setPlayerPosition(prev => ({ ...prev, y: Math.min(gridSize.height - 1, prev.y + 1) }));
          break;
        case 'arrowleft':
        case 'a':
          setPlayerPosition(prev => ({ ...prev, x: Math.max(0, prev.x - 1) }));
          break;
        case 'arrowright':
        case 'd':
          setPlayerPosition(prev => ({ ...prev, x: Math.min(gridSize.width - 1, prev.x + 1) }));
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gridSize]);

  useEffect(() => {
    // Check for collisions
    boxes.forEach((box, index) => {
      if (box.x === playerPosition.x && box.y === playerPosition.y) {
        if (box.color === 'red') {
          setPlayerSize(prev => prev + 1);
        } else {
          setPlayerSize(prev => Math.max(1, prev - 1));
        }
        setBoxes(prev => prev.filter((_, i) => i !== index));
      }
    });
  }, [playerPosition, boxes]);

  return (
    <div style={{ display: 'inline-block' }}>
      {Array(gridSize.height).fill().map((_, y) => (
        <div key={y} style={{ display: 'flex', height: '30px' }}>
          {Array(gridSize.width).fill().map((_, x) => {
            const isPlayer = x === playerPosition.x && y === playerPosition.y;
            const box = boxes.find(box => box.x === x && box.y === y);
            return (
              <div
                key={x}
                style={{
                  width: '30px',
                  height: '30px',
                  backgroundColor: isPlayer ? 'red' : (box ? box.color : 'white'),
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  fontSize: '12px',
                  color: 'white',
                  fontWeight: 'bold',
                }}
              >
                {isPlayer && playerSize}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
export default Game;