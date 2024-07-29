const gameBoard = document.getElementById('game-board');
const scoreElement = document.getElementById('score');
const resetButton = document.getElementById('reset-button');

const boardSize = 10;
const playerPosition = { x: 0, y: 0 };
let score = 0;

function createBoard() {
  gameBoard.innerHTML = '';
  for (let i = 0; i < boardSize; i++) {
    for (let j = 0; j < boardSize; j++) {
      const cell = document.createElement('div');
      cell.classList.add('grid-cell');
      cell.dataset.x = j;
      cell.dataset.y = i;
      gameBoard.appendChild(cell);
    }
  }
  placePlayer();
}

function placePlayer() {
  const playerCell = document.querySelector(`.grid-cell[data-x='${playerPosition.x}'][data-y='${playerPosition.y}']`);
  const player = document.createElement('div');
  player.classList.add('player');
  playerCell.appendChild(player);
}

function movePlayer(dx, dy) {
  const newX = playerPosition.x + dx;
  const newY = playerPosition.y + dy;
  if (newX >= 0 && newX < boardSize && newY >= 0 && newY < boardSize) {
    playerPosition.x = newX;
    playerPosition.y = newY;
    createBoard();
  }
}

function placeBomb() {
  const bombCell = document.querySelector(`.grid-cell[data-x='${playerPosition.x}'][data-y='${playerPosition.y}']`);
  const bomb = document.createElement('div');
  bomb.classList.add('bomb');
  bombCell.appendChild(bomb);
  setTimeout(() => explodeBomb(bombCell), 2000);
}

function explodeBomb(cell) {
  const bomb = cell.querySelector('.bomb');
  if (bomb) {
    bomb.remove();
    cell.classList.add('explosion');
    setTimeout(() => {
      cell.classList.remove('explosion');
      score += 10;
      updateScore();
    }, 500);
  }
}

function updateScore() {
  scoreElement.textContent = score;
}

document.addEventListener('keydown', (e) => {
  switch (e.key) {
    case 'ArrowUp':
      movePlayer(0, -1);
      break;
    case 'ArrowDown':
      movePlayer(0, 1);
      break;
    case 'ArrowLeft':
      movePlayer(-1, 0);
      break;
    case 'ArrowRight':
      movePlayer(1, 0);
      break;
    case ' ':
      placeBomb();
      break;
  }
});

resetButton.addEventListener('click', () => {
  score = 0;
  updateScore();
  playerPosition.x = 0;
  playerPosition.y = 0;
  createBoard();
});

createBoard();
