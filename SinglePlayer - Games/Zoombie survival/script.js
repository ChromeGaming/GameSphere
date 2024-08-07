const gameContainer = document.getElementById('game-container');
const player = document.getElementById('player');
const scoreDisplay = document.getElementById('score');
const gameOverDisplay = document.getElementById('game-over');
const finalScoreDisplay = document.getElementById('final-score');
let score = 0;
let playerSpeed = 5;
let bulletSpeed = 10;
let zombieSpeed = 2;
let zombies = [];
let bullets = [];
let gameRunning = true;

document.addEventListener('keydown', movePlayer);
document.addEventListener('click', shootBullet);

function movePlayer(e) {
    if (!gameRunning) return;
    const playerRect = player.getBoundingClientRect();
    switch(e.key) {
        case 'ArrowUp':
            if (playerRect.top > 0) player.style.top = playerRect.top - playerSpeed + 'px';
            break;
        case 'ArrowDown':
            if (playerRect.bottom < window.innerHeight) player.style.top = playerRect.top + playerSpeed + 'px';
            break;
        case 'ArrowLeft':
            if (playerRect.left > 0) player.style.left = playerRect.left - playerSpeed + 'px';
            break;
        case 'ArrowRight':
            if (playerRect.right < window.innerWidth) player.style.left = playerRect.left + playerSpeed + 'px';
            break;
    }
}

function shootBullet(e) {
    if (!gameRunning) return;
    const bullet = document.createElement('div');
    bullet.classList.add('bullet');
    const playerRect = player.getBoundingClientRect();
    bullet.style.left = playerRect.left + playerRect.width / 2 - 10 + 'px';
    bullet.style.top = playerRect.top + 'px';
    gameContainer.appendChild(bullet);
    bullets.push(bullet);
}

function spawnZombie() {
    if (!gameRunning) return;
    const zombie = document.createElement('div');
    zombie.classList.add('zombie');
    zombie.style.left = Math.random() * window.innerWidth + 'px';
    zombie.style.top = 0;
    gameContainer.appendChild(zombie);
    zombies.push(zombie);
}

function updateGame() {
    if (!gameRunning) return;
    bullets.forEach((bullet, index) => {
        const bulletRect = bullet.getBoundingClientRect();
        bullet.style.top = bulletRect.top - bulletSpeed + 'px';
        if (bulletRect.top < 0) {
            bullet.remove();
            bullets.splice(index, 1);
        }
    });

    zombies.forEach((zombie, zIndex) => {
        const zombieRect = zombie.getBoundingClientRect();
        zombie.style.top = zombieRect.top + zombieSpeed + 'px';

        // Check for collision with bullets
        bullets.forEach((bullet, bIndex) => {
            const bulletRect = bullet.getBoundingClientRect();
            if (
                bulletRect.top < zombieRect.bottom &&
                bulletRect.bottom > zombieRect.top &&
                bulletRect.left < zombieRect.right &&
                bulletRect.right > zombieRect.left
            ) {
                bullet.remove();
                zombie.remove();
                bullets.splice(bIndex, 1);
                zombies.splice(zIndex, 1);
                score++;
                scoreDisplay.textContent = 'Score: ' + score;
            }
        });

        // Check for collision with player
        const playerRect = player.getBoundingClientRect();
        if (
            playerRect.top < zombieRect.bottom &&
            playerRect.bottom > zombieRect.top &&
            playerRect.left < zombieRect.right &&
            playerRect.right > zombieRect.left
        ) {
            endGame();
        }

        if (zombieRect.top > window.innerHeight) {
            zombie.remove();
            zombies.splice(zIndex, 1);
        }
    });
}

function endGame() {
    gameRunning = false;
    finalScoreDisplay.textContent = score;
    gameOverDisplay.classList.remove('hidden');
}

setInterval(spawnZombie, 2000);
setInterval(updateGame, 50);
