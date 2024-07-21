const gameBoard = document.getElementById('game-board');
const cells = gameBoard.querySelectorAll('.cell');

let player1 = { x: 0, y: 0, symbol: '1' };
let player2 = { x: 4, y: 4, symbol: '2' };
let flag1 = { x: 0, y: 4, symbol: 'F1' };
let flag2 = { x: 4, y: 0, symbol: 'F2' };

let currentPlayer = player1;

function render() {
    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('player1', 'player2', 'flag1', 'flag2');
    });

    const player1Cell = gameBoard.querySelector(`[data-x='${player1.x}'][data-y='${player1.y}']`);
    const player2Cell = gameBoard.querySelector(`[data-x='${player2.x}'][data-y='${player2.y}']`);
    const flag1Cell = gameBoard.querySelector(`[data-x='${flag1.x}'][data-y='${flag1.y}']`);
    const flag2Cell = gameBoard.querySelector(`[data-x='${flag2.x}'][data-y='${flag2.y}']`);

    player1Cell.textContent = player1.symbol;
    player1Cell.classList.add('player1');
    player2Cell.textContent = player2.symbol;
    player2Cell.classList.add('player2');
    flag1Cell.textContent = flag1.symbol;
    flag1Cell.classList.add('flag1');
    flag2Cell.textContent = flag2.symbol;
    flag2Cell.classList.add('flag2');
}

function movePlayer(player, direction) {
    switch (direction) {
        case 'up':
            if (player.y > 0) player.y--;
            break;
        case 'down':
            if (player.y < 4) player.y++;
            break;
        case 'left':
            if (player.x > 0) player.x--;
            break;
        case 'right':
            if (player.x < 4) player.x++;
            break;
    }

    if (player.x === flag1.x && player.y === flag1.y) {
        alert('Player 2 wins!');
        resetGame();
    } else if (player.x === flag2.x && player.y === flag2.y) {
        alert('Player 1 wins!');
        resetGame();
    }

    currentPlayer = currentPlayer === player1 ? player2 : player1;
    render();
}

function handleCellClick(event) {
    const x = parseInt(event.target.getAttribute('data-x'));
    const y = parseInt(event.target.getAttribute('data-y'));

    if (currentPlayer.x === x && currentPlayer.y === y) {
        const direction = prompt('Enter direction (up, down, left, right):');
        movePlayer(currentPlayer, direction);
    }
}

function resetGame() {
    player1 = { x: 0, y: 0, symbol: '1' };
    player2 = { x: 4, y: 4, symbol: '2' };
    currentPlayer = player1;
    render();
}

cells.forEach(cell => cell.addEventListener('click', handleCellClick));
render();
