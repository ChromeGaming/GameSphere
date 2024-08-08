const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let lightBeam = {
    x: 50,
    y: 200,
    dx: 2,
    dy: 0,
    width: 10,
    height: 10
};

let mirrors = [
    { x: 200, y: 150, width: 10, height: 100, angle: 45 },
    { x: 400, y: 100, width: 10, height: 100, angle: -45 }
];

let goal = { x: 550, y: 200, width: 30, height: 30 };

function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw light beam
    ctx.fillStyle = 'yellow';
    ctx.fillRect(lightBeam.x, lightBeam.y, lightBeam.width, lightBeam.height);

    // Draw mirrors
    mirrors.forEach(mirror => {
        ctx.save();
        ctx.translate(mirror.x + mirror.width / 2, mirror.y + mirror.height / 2);
        ctx.rotate((mirror.angle * Math.PI) / 180);
        ctx.fillStyle = 'silver';
        ctx.fillRect(-mirror.width / 2, -mirror.height / 2, mirror.width, mirror.height);
        ctx.restore();
    });

    // Draw goal
    ctx.fillStyle = 'gold';
    ctx.fillRect(goal.x, goal.y, goal.width, goal.height);
}

function updateGame() {
    lightBeam.x += lightBeam.dx;
    lightBeam.y += lightBeam.dy;

    checkCollisions();
    drawGame();

    requestAnimationFrame(updateGame);
}

function checkCollisions() {
    mirrors.forEach(mirror => {
        if (lightBeam.x < mirror.x + mirror.width &&
            lightBeam.x + lightBeam.width > mirror.x &&
            lightBeam.y < mirror.y + mirror.height &&
            lightBeam.y + lightBeam.height > mirror.y) {
            // Reflect the light beam
            if (mirror.angle === 45) {
                lightBeam.dx = -lightBeam.dy;
                lightBeam.dy = -lightBeam.dx;
            } else if (mirror.angle === -45) {
                lightBeam.dx = lightBeam.dy;
                lightBeam.dy = lightBeam.dx;
            }
        }
    });

    if (lightBeam.x < goal.x + goal.width &&
        lightBeam.x + lightBeam.width > goal.x &&
        lightBeam.y < goal.y + goal.height &&
        lightBeam.y + lightBeam.height > goal.y) {
        alert('You Win! You reached the goal.');
        resetGame();
    }

    if (lightBeam.x < 0 || lightBeam.x > canvas.width ||
        lightBeam.y < 0 || lightBeam.y > canvas.height) {
        alert('Game Over! You went out of bounds.');
        resetGame();
    }
}

function resetGame() {
    lightBeam.x = 50;
    lightBeam.y = 200;
    lightBeam.dx = 2;
    lightBeam.dy = 0;
    drawGame();
}

document.addEventListener('keydown', (e) => {
    switch (e.key) {
        case 'ArrowUp': lightBeam.dy = -2; lightBeam.dx = 0; break;
        case 'ArrowDown': lightBeam.dy = 2; lightBeam.dx = 0; break;
        case 'ArrowLeft': lightBeam.dx = -2; lightBeam.dy = 0; break;
        case 'ArrowRight': lightBeam.dx = 2; lightBeam.dy = 0; break;
    }
});

drawGame();
updateGame();
