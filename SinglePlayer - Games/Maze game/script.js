const canvas = document.getElementById('mazeCanvas');
const ctx = canvas.getContext('2d');
const resetButton = document.getElementById('resetButton');
const hintButton = document.getElementById('hintButton');

canvas.width = 500;
canvas.height = 500;

const rows = 10;
const cols = 10;
const cellSize = canvas.width / cols;

let player = { x: 0, y: 0 };
const goal = { x: cols - 1, y: rows - 1 };
let walls;

function generateMaze(rows, cols) {
    const maze = new Array(rows).fill(0).map(() => new Array(cols).fill(false));
    // Ensure solvability by creating a simple path
    for (let i = 0; i < rows; i++) {
        maze[i][0] = false;
    }
    for (let j = 0; j < cols; j++) {
        maze[rows - 1][j] = false;
    }
    // Add random walls
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            if (Math.random() < 0.3 && !(i === 0 && j === 0) && !(i === rows - 1 && j === cols - 1)) {
                maze[i][j] = true;
            }
        }
    }
    return maze;
}

function drawMaze() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Draw boundary
    ctx.fillStyle = '#333';
    ctx.fillRect(0, 0, canvas.width, cellSize);
    ctx.fillRect(0, canvas.height - cellSize, canvas.width, cellSize);
    ctx.fillRect(0, 0, cellSize, canvas.height);
    ctx.fillRect(canvas.width - cellSize, 0, cellSize, canvas.height);
    
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            if (walls[i][j]) {
                ctx.fillStyle = '#333';
                ctx.fillRect(j * cellSize, i * cellSize, cellSize, cellSize);
            }
        }
    }

    // Draw goal
    ctx.fillStyle = 'green';
    ctx.fillRect(goal.x * cellSize, goal.y * cellSize, cellSize, cellSize);

    // Draw player
    ctx.fillStyle = 'blue';
    ctx.fillRect(player.x * cellSize, player.y * cellSize, cellSize, cellSize);
}

function movePlayer(dx, dy) {
    const newX = player.x + dx;
    const newY = player.y + dy;
    if (newX >= 0 && newX < cols && newY >= 0 && newY < rows && !walls[newY][newX]) {
        player.x = newX;
        player.y = newY;
        drawMaze();
        checkGoal();
    }
}

function checkGoal() {
    if (player.x === goal.x && player.y === goal.y) {
        alert('Congratulations! You reached the goal!');
        resetGame();
    }
}

function resetGame() {
    player = { x: 0, y: 0 };
    walls = generateMaze(rows, cols);
    drawMaze();
}

function getHint() {
    // Simple hint: Move towards the goal in steps
    if (player.x < goal.x) {
        movePlayer(1, 0);
    } else if (player.x > goal.x) {
        movePlayer(-1, 0);
    } else if (player.y < goal.y) {
        movePlayer(0, 1);
    } else if (player.y > goal.y) {
        movePlayer(0, -1);
    }
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
    }
});

resetButton.addEventListener('click', resetGame);
hintButton.addEventListener('click', getHint);

// Initial drawing
resetGame();
