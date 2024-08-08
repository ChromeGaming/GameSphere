const gameContainer = document.getElementById('game-container');
const playerHand = document.getElementById('player-hand');
const opponentHand = document.getElementById('opponent-hand');
const drawCardButton = document.getElementById('draw-card');
const message = document.getElementById('message');
const scoreDisplay = document.getElementById('score');
const gameOverDisplay = document.getElementById('game-over');
const resultMessage = document.getElementById('result-message');

let playerScore = 0;
let opponentScore = 0;
let gameRunning = true;

const cardValues = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

drawCardButton.addEventListener('click', drawCard);

function drawCard() {
    if (!gameRunning) return;

    const playerCardValue = getRandomCardValue();
    const opponentCardValue = getRandomCardValue();

    const playerCard = createCard(playerCardValue);
    const opponentCard = createCard(opponentCardValue);

    playerHand.appendChild(playerCard);
    opponentHand.appendChild(opponentCard);

    if (playerCardValue > opponentCardValue) {
        playerScore++;
        message.textContent = 'You win this round!';
    } else if (playerCardValue < opponentCardValue) {
        opponentScore++;
        message.textContent = 'You lose this round!';
    } else {
        message.textContent = 'It\'s a draw!';
    }

    scoreDisplay.textContent = `Player Score: ${playerScore} | Opponent Score: ${opponentScore}`;

    checkGameOver();
}

function getRandomCardValue() {
    return cardValues[Math.floor(Math.random() * cardValues.length)];
}

function createCard(value) {
    const card = document.createElement('div');
    card.classList.add('card');
    card.textContent = value;
    return card;
}

function checkGameOver() {
    if (playerHand.childElementCount >= 10 || opponentHand.childElementCount >= 10) {
        gameRunning = false;
        drawCardButton.disabled = true;
        if (playerScore > opponentScore) {
            resultMessage.textContent = 'You win!';
        } else if (playerScore < opponentScore) {
            resultMessage.textContent = 'You lose!';
        } else {
            resultMessage.textContent = 'It\'s a draw!';
        }
        gameOverDisplay.classList.remove('hidden');
    }
}
