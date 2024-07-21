
document.addEventListener("DOMContentLoaded", () => {
    const gameBoard = document.getElementById("game-board");
    const message = document.getElementById("message");
    const restartButton = document.getElementById("restart");
    const rows = 10;
    const cols = 10;
    let characterPosition = 0;
    let goalPosition = 99;

    // Initialize game board
    function initBoard() {
        gameBoard.innerHTML = "";
        characterPosition = 0;
        goalPosition = 99;
        for (let i = 0; i < rows * cols; i++) {
            const hex = document.createElement("div");
            hex.classList.add("hex");
            if (i === characterPosition) hex.classList.add("character");
            if (i === goalPosition) hex.classList.add("goal");
            if (Math.random() < 0.1 && i !== characterPosition && i !== goalPosition) hex.classList.add("obstacle");
            hex.addEventListener("click", () => moveCharacter(i));
            gameBoard.appendChild(hex);
        }
        updateMessage("Find the goal!");
    }

    // Move character
    function moveCharacter(position) {
        const distance = Math.abs(position - characterPosition);
        if (distance === 1 || distance === cols) {
            const hexes = document.querySelectorAll(".hex");
            hexes[characterPosition].classList.remove("character");
            characterPosition = position;
            hexes[characterPosition].classList.add("character");

            if (characterPosition === goalPosition) {
                updateMessage("You found the goal! Click Restart to play again.");
            } else if (hexes[characterPosition].classList.contains("obstacle")) {
                updateMessage("You hit an obstacle! Click Restart to try again.");
            } else {
                updateMessage("Keep going!");
            }
        }
    }

    // Update message
    function updateMessage(text) {
        message.textContent = text;
    }

    // Restart game
    restartButton.addEventListener("click", initBoard);

    initBoard();
});
