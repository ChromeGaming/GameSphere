// script.js
document.addEventListener('DOMContentLoaded', () => {
    const board = document.getElementById('board');
    const rollDiceButton = document.getElementById('rollDice');
    const diceResult = document.getElementById('diceResult');
    const playerTurnDisplay = document.getElementById('playerTurn');

    let player1Position = 1;
    let player2Position = 1;
    let currentPlayer = 1;
    const boardSize = 100;

    // Define snakes and ladders
    const snakes = {
        17: 7,
        54: 34,
        62: 19,
        64: 60,
        87: 24,
        93: 73,
        95: 75,
        99: 78
    };

    const ladders = {
        1: 38,
        4: 14,
        9: 31,
        21: 42,
        28: 84,
        51: 67,
        72: 91,
        80: 99
    };

    // Create the board
    for (let i = 0; i < boardSize; i++) {
        const cell = document.createElement('div');
        cell.id = `cell-${i + 1}`;
        cell.innerText = i + 1;
        board.appendChild(cell);
    }

    // Create player pieces
    const player1 = document.createElement('div');
    player1.classList.add('player', 'player1');
    board.appendChild(player1);

    const player2 = document.createElement('div');
    player2.classList.add('player', 'player2');
    board.appendChild(player2);

    const positions = [null, player1, player2];

    function movePlayer(player, position) {
        const cell = document.getElementById(`cell-${position}`);
        const rect = cell.getBoundingClientRect();
        const boardRect = board.getBoundingClientRect();
        player.style.transform = `translate(${rect.left - boardRect.left}px, ${rect.top - boardRect.top}px)`;
    }

    function handleSpecialSquares(player, position) {
        if (snakes[position]) {
            position = snakes[position];
        } else if (ladders[position]) {
            position = ladders[position];
        }
        return position;
    }

    function checkWin(position) {
        if (position >= boardSize) {
            alert(`Player ${currentPlayer} wins!`);
            resetGame();
        }
    }

    function resetGame() {
        player1Position = 1;
        player2Position = 1;
        currentPlayer = 1;
        movePlayer(player1, player1Position);
        movePlayer(player2, player2Position);
        diceResult.innerText = `Dice Result: `;
        playerTurnDisplay.innerText = `Player Turn: ${currentPlayer}`;
    }

    rollDiceButton.addEventListener('click', () => {
        const diceRoll = Math.floor(Math.random() * 6) + 1;
        diceResult.innerText = `Dice Result: ${diceRoll}`;
        
        if (currentPlayer === 1) {
            player1Position = Math.min(player1Position + diceRoll, boardSize);
            movePlayer(player1, player1Position);
            player1Position = handleSpecialSquares(player1, player1Position);
            movePlayer(player1, player1Position);
            checkWin(player1Position);
            currentPlayer = 2;
        } else {
            player2Position = Math.min(player2Position + diceRoll, boardSize);
            movePlayer(player2, player2Position);
            player2Position = handleSpecialSquares(player2, player2Position);
            movePlayer(player2, player2Position);
            checkWin(player2Position);
            currentPlayer = 1;
        }

        playerTurnDisplay.innerText = `Player Turn: ${currentPlayer}`;
    });

    // Initial positions
    movePlayer(player1, player1Position);
    movePlayer(player2, player2Position);
});
