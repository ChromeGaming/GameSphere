const holes = document.querySelectorAll('.hole');
const scoreDisplay = document.getElementById('score');
let score = 0;
let lastHole;
let timeUp = false;

function randomTime(min, max) {
    return Math.round(Math.random() * (max - min) + min);
}

function randomHole(holes) {
    const index = Math.floor(Math.random() * holes.length);
    const hole = holes[index];
    if (hole === lastHole) {
        return randomHole(holes);
    }
    lastHole = hole;
    return hole;
}

function peep() {
    const time = randomTime(200, 1000);
    const hole = randomHole(holes);
    hole.classList.add('mole');
    setTimeout(() => {
        hole.classList.remove('mole');
        if (!timeUp) peep();
    }, time);
}

function startGame() {
    scoreDisplay.textContent = 'Score: 0';
    score = 0;
    timeUp = false;
    peep();
    setTimeout(() => timeUp = true, 10000); // 10 seconds game
}

function whack(e) {
    if (!e.isTrusted) return; // Prevent cheating
    if (e.target.classList.contains('mole')) {
        score++;
        e.target.classList.remove('mole');
        scoreDisplay.textContent = 'Score: ' + score;
    }
}

holes.forEach(hole => hole.addEventListener('click', whack));
startGame();
