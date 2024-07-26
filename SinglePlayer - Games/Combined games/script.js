function showGame(gameNumber) {
    const games = document.querySelectorAll('.game');
    games.forEach((game, index) => {
        game.style.display = index === gameNumber - 1 ? 'block' : 'none';
        if (index === gameNumber - 1) initializeGame(gameNumber);
    });
}

function initializeGame(gameNumber) {
    switch(gameNumber) {
        case 1: initMazeGame(); break;
        case 2: initShootingGame(); break;
        case 3: initMatchingGame(); break;
        case 4: initRacingGame(); break;
        case 5: initPuzzleGame(); break;
    }
}

// Maze Game
function initMazeGame() {
    const canvas = document.getElementById('mazeCanvas');
    const ctx = canvas.getContext('2d');
    const gridSize = 40;
    const rows = canvas.width / gridSize;
    const cols = canvas.height / gridSize;
    const maze = createMaze(rows, cols);
    const player = { x: 0, y: 0 };

    function drawMaze() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let y = 0; y < rows; y++) {
            for (let x = 0; x < cols; x++) {
                if (maze[y][x] === 1) {
                    ctx.fillStyle = 'black';
                    ctx.fillRect(x * gridSize, y * gridSize, gridSize, gridSize);
                }
            }
        }
        drawPlayer();
    }

    function drawPlayer() {
        ctx.fillStyle = 'blue';
        ctx.fillRect(player.x * gridSize, player.y * gridSize, gridSize, gridSize);
    }

    document.addEventListener('keydown', (e) => {
        switch(e.key) {
            case 'ArrowUp': if (player.y > 0 && maze[player.y - 1][player.x] === 0) player.y--; break;
            case 'ArrowDown': if (player.y < rows - 1 && maze[player.y + 1][player.x] === 0) player.y++; break;
            case 'ArrowLeft': if (player.x > 0 && maze[player.y][player.x - 1] === 0) player.x--; break;
            case 'ArrowRight': if (player.x < cols - 1 && maze[player.y][player.x + 1] === 0) player.x++; break;
        }
        drawMaze();
    });

    drawMaze();
}

function createMaze(rows, cols) {
    const maze = Array.from({ length: rows }, () => Array(cols).fill(0));
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            maze[i][j] = Math.random() < 0.3 ? 1 : 0;
        }
    }
    maze[0][0] = 0;
    maze[rows - 1][cols - 1] = 0;
    return maze;
}

// Shooting Game
function initShootingGame() {
    const canvas = document.getElementById('shootingCanvas');
    const ctx = canvas.getContext('2d');
    const player = { x: canvas.width / 2, y: canvas.height - 30, width: 20, height: 20 };
    const bullets = [];
    const targets = [];
    let score = 0;

    function drawPlayer() {
        ctx.fillStyle = 'blue';
        ctx.fillRect(player.x, player.y, player.width, player.height);
    }

    function drawBullets() {
        ctx.fillStyle = 'black';
        bullets.forEach(bullet => {
            ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
        });
    }

    function drawTargets() {
        ctx.fillStyle = 'red';
        targets.forEach(target => {
            ctx.fillRect(target.x, target.y, target.width, target.height);
        });
    }

    function updateGame() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawPlayer();
        drawBullets();
        drawTargets();
        moveBullets();
        checkCollisions();
        requestAnimationFrame(updateGame);
    }

    function moveBullets() {
        bullets.forEach(bullet => {
            bullet.y -= 5;
        });
    }

    function checkCollisions() {
        bullets.forEach((bullet, bulletIndex) => {
            targets.forEach((target, targetIndex) => {
                if (bullet.x < target.x + target.width && bullet.x + bullet.width > target.x &&
                    bullet.y < target.y + target.height && bullet.y + bullet.height > target.y) {
                    targets.splice(targetIndex, 1);
                    bullets.splice(bulletIndex, 1);
                    score++;
                }
            });
        });
    }

    function shootBullet() {
        bullets.push({ x: player.x + player.width / 2 - 2.5, y: player.y, width: 5, height: 10 });
    }

    function spawnTarget() {
        targets.push({ x: Math.random() * (canvas.width - 20), y: 0, width: 20, height: 20 });
    }

    document.addEventListener('keydown', (e) => {
        switch(e.key) {
            case 'ArrowLeft': if (player.x > 0) player.x -= 10; break;
            case 'ArrowRight': if (player.x < canvas.width - player.width) player.x += 10; break;
            case ' ': shootBullet(); break;
        }
    });

    setInterval(spawnTarget, 1000);
    updateGame();
}

// Matching Game
function initMatchingGame() {
    const cardContainer = document.getElementById('matchingCards');
    const cards = [
        'A', 'A', 'B', 'B', 'C', 'C', 'D', 'D', 'E', 'E',
        'F', 'F', 'G', 'G', 'H', 'H', 'I', 'I', 'J', 'J'
    ];
    const shuffledCards = shuffleArray(cards);
    let firstCard = null;
    let secondCard = null;

    cardContainer.innerHTML = '';
    shuffledCards.forEach((card, index) => {
        const cardElement = document.createElement('div');
        cardElement.className = 'card';
        cardElement.dataset.value = card;
        cardElement.innerText = '?';
        cardElement.addEventListener('click', () => flipCard(cardElement, index));
        cardContainer.appendChild(cardElement);
    });

    function flipCard(card, index) {
        if (firstCard && secondCard) return;
        card.innerText = card.dataset.value;
        if (!firstCard) {
            firstCard = { card, index };
        } else {
            secondCard = { card, index };
            if (firstCard.card.dataset.value === secondCard.card.dataset.value) {
                firstCard = null;
                secondCard = null;
            } else {
                setTimeout(() => {
                    firstCard.card.innerText = '?';
                    secondCard.card.innerText = '?';
                    firstCard = null;
                    secondCard = null;
                }, 1000);
            }
        }
    }
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Racing Game
function initRacingGame() {
    const canvas = document.getElementById('racingCanvas');
    const ctx = canvas.getContext('2d');
    const car = { x: canvas.width / 2, y: canvas.height - 60, width: 30, height: 50 };
    const obstacles = [];
    let gameInterval;

    function drawCar() {
        ctx.fillStyle = 'blue';
        ctx.fillRect(car.x, car.y, car.width, car.height);
    }

    function drawObstacles() {
        ctx.fillStyle = 'red';
        obstacles.forEach(obstacle => {
            ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
        });
    }

    function updateGame() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawCar();
        drawObstacles();
        moveObstacles();
        checkCollisions();
        requestAnimationFrame(updateGame);
    }

    function moveObstacles() {
        obstacles.forEach(obstacle => {
            obstacle.y += 5;
        });
    }

    function checkCollisions() {
        obstacles.forEach(obstacle => {
            if (car.x < obstacle.x + obstacle.width && car.x + car.width > obstacle.x &&
                car.y < obstacle.y + obstacle.height && car.y + car.height > obstacle.y) {
                clearInterval(gameInterval);
                alert('Game Over!');
            }
        });
    }

    function spawnObstacle() {
        obstacles.push({
            x: Math.random() * (canvas.width - 30),
            y: 0,
            width: 30,
            height: 30
        });
    }

    document.addEventListener('keydown', (e) => {
        switch(e.key) {
            case 'ArrowLeft': if (car.x > 0) car.x -= 10; break;
            case 'ArrowRight': if (car.x < canvas.width - car.width) car.x += 10; break;
        }
    });

    gameInterval = setInterval(spawnObstacle, 1000);
    updateGame();
}

// Puzzle Game
function initPuzzleGame() {
    const puzzleContainer = document.getElementById('puzzlePieces');
    const pieces = [];
    for (let i = 0; i < 9; i++) {
        pieces.push(i);
    }
    const shuffledPieces = shuffleArray(pieces);

    puzzleContainer.innerHTML = '';
    shuffledPieces.forEach((piece, index) => {
        const pieceElement = document.createElement('div');
        pieceElement.className = 'puzzle-piece';
        pieceElement.dataset.value = piece;
        pieceElement.innerText = piece;
        pieceElement.addEventListener('click', () => selectPiece(index));
        puzzleContainer.appendChild(pieceElement);
    });

    function selectPiece(index) {
        const emptyIndex = shuffledPieces.indexOf(0);
        const validMoves = [emptyIndex - 1, emptyIndex + 1, emptyIndex - 3, emptyIndex + 3];
        if (validMoves.includes(index)) {
            [shuffledPieces[emptyIndex], shuffledPieces[index]] = [shuffledPieces[index], shuffledPieces[emptyIndex]];
            initPuzzleGame();
        }
    }
}

document.addEventListener('DOMContentLoaded', () => showGame(1));
