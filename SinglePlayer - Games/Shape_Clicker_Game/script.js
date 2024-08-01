let score = 0;
let gameInterval;

document.getElementById('start-button').addEventListener('click', startGame);

function startGame() {
    score = 0;
    document.getElementById('score').textContent = 'Score: ' + score;
    document.getElementById('start-button').disabled = true;

    gameInterval = setInterval(createShape, 1000);

    setTimeout(endGame, 30000);
}

function createShape() {
    const gameContainer = document.getElementById('game-container');
    const shape = document.createElement('div');
    const size = Math.random() * 50 + 20;
    const x = Math.random() * (gameContainer.offsetWidth - size);
    const y = Math.random() * (gameContainer.offsetHeight - size);
    const shapeType = Math.random() > 0.5 ? 'circle' : 'square';

    shape.classList.add('shape', shapeType);
    shape.style.width = `${size}px`;
    shape.style.height = `${size}px`;
    shape.style.left = `${x}px`;
    shape.style.top = `${y}px`;
    shape.style.backgroundColor = getRandomColor();

    shape.addEventListener('click', () => {
        score++;
        document.getElementById('score').textContent = 'Score: ' + score;
        shape.remove();
    });

    gameContainer.appendChild(shape);

    setTimeout(() => {
        if (shape.parentElement) {
            shape.remove();
        }
    }, 2000);
}

function endGame() {
    clearInterval(gameInterval);
    document.getElementById('start-button').disabled = false;
    alert('Game over! Your score is ' + score);
}

function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}
