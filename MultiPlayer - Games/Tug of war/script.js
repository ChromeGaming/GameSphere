let player1Score = 0;
let player2Score = 0;
const winningScore = 10;
const scoreIncrement = 1;
const marker = document.getElementById('marker');
const result = document.getElementById('result');
const startBtn = document.getElementById('start-btn');
const resetBtn = document.getElementById('reset-btn');
const countdownEl = document.getElementById('countdown');
let gameStarted = false;

document.addEventListener('keydown', function(event) {
    if (gameStarted) {
        if (event.key === 'a' || event.key === 'A') {
            player1Score += scoreIncrement;
            updateMarker();
        } else if (event.key === 'l' || event.key === 'L') {
            player2Score += scoreIncrement;
            updateMarker();
        }
    }
});

startBtn.addEventListener('click', function() {
    startGame();
});

resetBtn.addEventListener('click', function() {
    resetGame();
});

function startGame() {
    startBtn.disabled = true;
    resetBtn.disabled = true;
    let countdown = 5;
    countdownEl.style.display = 'block';
    countdownEl.textContent = countdown;

    const countdownInterval = setInterval(() => {
        countdown--;
        countdownEl.textContent = countdown;
        if (countdown <= 0) {
            clearInterval(countdownInterval);
            countdownEl.style.display = 'none';
            gameStarted = true;
            startBtn.disabled = true;
            resetBtn.disabled = false;
        }
    }, 1000);
}

function updateMarker() {
    const totalScore = player1Score + player2Score;
    const player1Ratio = player1Score / totalScore;
    const newLeftPosition = 50 - (player1Ratio * 50) + (player2Score / totalScore * 50);
    marker.style.left = `${newLeftPosition}%`;

    document.getElementById('player1-score').textContent = `Player 1: ${player1Score}`;
    document.getElementById('player2-score').textContent = `Player 2: ${player2Score}`;

    if (player1Score >= winningScore) {
        endGame('Player 1');
    } else if (player2Score >= winningScore) {
        endGame('Player 2');
    }
}

function endGame(winner) {
    result.textContent = `Congratulations ${winner}, you win!`;
    result.style.display = 'block';
    gameStarted = false;
    startBtn.disabled = false;
    resetBtn.disabled = true;
}

function resetGame() {
    window.location.reload();
}

updateMarker();
