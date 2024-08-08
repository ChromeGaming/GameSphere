// script.js
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 600;

let player = { x: 375, y: 550, width: 50, height: 50, speed: 5, color: '#61dafb' };
let items = [];
let obstacles = [];
let score = 0;
let level = 1;
let missed = 0;
let gameOver = false;
let gameStarted = false;

document.getElementById('login-form').addEventListener('submit', function(e) {
    e.preventDefault();
    document.getElementById('login-container').style.display = 'none';
    document.getElementById('game-container').style.display = 'block';
    gameStarted = true;
    update();
});

function drawPlayer() {
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

function createItem() {
    const x = Math.random() * (canvas.width - 20);
    items.push({ x, y: 0, width: 20, height: 20, color: '#4caf50' });
}

function createObstacle() {
    const x = Math.random() * (canvas.width - 20);
    obstacles.push({ x, y: 0, width: 20, height: 20, color: '#f44336' });
}

function createSpeedItem() {
    const x = Math.random() * (canvas.width - 20);
    items.push({ x, y: 0, width: 20, height: 20, color: '#ffeb3b', type: 'speed' });
}

function drawItems() {
    items.forEach(item => {
        ctx.fillStyle = item.color;
        ctx.fillRect(item.x, item.y, item.width, item.height);
        item.y += 3;
    });
}

function drawObstacles() {
    obstacles.forEach(obstacle => {
        ctx.fillStyle = obstacle.color;
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
        obstacle.y += 5;
    });
}

function update() {
    if (!gameStarted || gameOver) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPlayer();
    drawItems();
    drawObstacles();
    checkCollisions();
    requestAnimationFrame(update);
}

function checkCollisions() {
    items = items.filter(item => {
        if (item.y > canvas.height) {
            missed++;
            document.getElementById('missed').textContent = missed;
            if (missed > 3) {
                gameOver = true;
                alert(`Game Over! You missed more than 3 blocks. Your score: ${score}`);
            }
            return false;
        }
        if (isColliding(player, item)) {
            if (item.type === 'speed') {
                player.speed += 2;
                setTimeout(() => player.speed -= 2, 5000);
            } else {
                score++;
                document.getElementById('score').textContent = score;
                player.color = '#' + Math.floor(Math.random() * 16777215).toString(16);
            }
            return false;
        }
        return true;
    });

    obstacles = obstacles.filter(obstacle => {
        if (obstacle.y > canvas.height) return false;
        if (isColliding(player, obstacle)) {
            gameOver = true;
            alert(`Game Over! Your score: ${score}`);
            return false;
        }
        return true;
    });

    if (score >= 10 && level === 1) {
        nextLevel();
    } else if (score >= 20 && level === 2) {
        nextLevel();
    }
}

function isColliding(rect1, rect2) {
    return rect1.x < rect2.x + rect2.width &&
           rect1.x + rect1.width > rect2.x &&
           rect1.y < rect2.y + rect2.height &&
           rect1.height + rect1.y > rect2.y;
}

function nextLevel() {
    level++;
    document.getElementById('level').textContent = level;
    if (level === 2) {
        items = [];
        obstacles = [];
        player.speed = 5;
        createNewChallenge();
    } else if (level === 3) {
        items = [];
        obstacles = [];
        startMiniGame();
    }
}

function createNewChallenge() {
    setInterval(createItem, 800);
    setInterval(createObstacle, 1500);
    setInterval(createSpeedItem, 8000);
}

function startMiniGame() {
    alert("Welcome to Level 3! Survive the incoming obstacles!");
    player.color = '#ff6347';
    setInterval(createObstacle, 1000);
}

document.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft' && player.x > 0) player.x -= player.speed;
    if (e.key === 'ArrowRight' && player.x < canvas.width - player.width) player.x += player.speed;
});

setInterval(createItem, 1000);
setInterval(createObstacle, 2000);
setInterval(createSpeedItem, 10000);
