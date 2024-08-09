document.addEventListener('DOMContentLoaded', () => {
    const player = document.getElementById('player');
    const gameContainer = document.getElementById('game-container');
    const cloneButton = document.getElementById('clone-button');
    const resetButton = document.getElementById('reset-button');
    let clones = [];

    let playerPosition = { x: 10, y: 10 };
    let moveDistance = 10;

    function updatePlayerPosition() {
        player.style.left = playerPosition.x + 'px';
        player.style.top = playerPosition.y + 'px';
    }

    function createClone() {
        const clone = document.createElement('div');
        clone.classList.add('clone');
        clone.style.left = playerPosition.x + 'px';
        clone.style.top = playerPosition.y + 'px';
        gameContainer.appendChild(clone);
        clones.push(clone);
    }

    function resetGame() {
        playerPosition = { x: 10, y: 10 };
        updatePlayerPosition();
        clones.forEach(clone => gameContainer.removeChild(clone));
        clones = [];
    }

    function movePlayer(e) {
        switch (e.key) {
            case 'ArrowUp':
                if (playerPosition.y - moveDistance >= 0) {
                    playerPosition.y -= moveDistance;
                }
                break;
            case 'ArrowDown':
                if (playerPosition.y + moveDistance <= gameContainer.clientHeight - player.clientHeight) {
                    playerPosition.y += moveDistance;
                }
                break;
            case 'ArrowLeft':
                if (playerPosition.x - moveDistance >= 0) {
                    playerPosition.x -= moveDistance;
                }
                break;
            case 'ArrowRight':
                if (playerPosition.x + moveDistance <= gameContainer.clientWidth - player.clientWidth) {
                    playerPosition.x += moveDistance;
                }
                break;
        }
        updatePlayerPosition();
    }

    document.addEventListener('keydown', movePlayer);
    cloneButton.addEventListener('click', createClone);
    resetButton.addEventListener('click', resetGame);

    updatePlayerPosition();
});
