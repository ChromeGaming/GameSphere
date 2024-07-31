const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let character = {
    x: 50,
    y: 350,
    width: 30,
    height: 30,
    element: 'fire'
};

let obstacles = [
    { x: 200, y: 300, width: 50, height: 50, type: 'fire' },
    { x: 300, y: 200, width: 50, height: 50, type: 'water' },
    { x: 400, y: 100, width: 50, height: 50, type: 'earth' }
];

let goal = { x: 550, y: 350, width: 30, height: 30 };

function switchElement(element) {
    character.element = element;
}

document.addEventListener('keydown', (e) => {
    switch (e.key) {
        case 'ArrowUp': character.y -= 10; break;
        case 'ArrowDown': character.y += 10; break;
        case 'ArrowLeft': character.x -= 10; break;
        case 'ArrowRight': character.x += 10; break;
    }
    checkCollisions();
    drawGame();
});

function checkCollisions() {
    obstacles.forEach(obstacle => {
        if (character.x < obstacle.x + obstacle.width &&
            character.x + character.width > obstacle.x &&
            character.y < obstacle.y + obstacle.height &&
            character.y + character.height > obstacle.y) {
            if (character.element !== obstacle.type) {
                alert('Game Over! You hit an obstacle.');
                resetGame();
            }
        }
    });

    if (character.x < goal.x + goal.width &&
        character.x + character.width > goal.x &&
        character.y < goal.y + goal.height &&
        character.y + character.height > goal.y) {
        alert('You Win! You reached the goal.');
        resetGame();
    }
}

function resetGame() {
    character.x = 50;
    character.y = 350;
    character.element = 'fire';
    drawGame();
}

function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = getColor(character.element);
    ctx.fillRect(character.x, character.y, character.width, character.height);

    obstacles.forEach(obstacle => {
        ctx.fillStyle = getColor(obstacle.type);
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    });

    ctx.fillStyle = 'gold';
    ctx.fillRect(goal.x, goal.y, goal.width, goal.height);
}

function getColor(element) {
    switch (element) {
        case 'fire': return 'red';
        case 'water': return 'blue';
        case 'earth': return 'green';
        default: return 'black';
    }
}

drawGame();
