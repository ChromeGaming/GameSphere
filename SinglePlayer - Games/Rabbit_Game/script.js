const holes = document.querySelectorAll('.hole');
const scoreBoard = document.querySelector('.score');
const bunnys = document.querySelectorAll('.bunny');
const countdownNum = document.querySelector('#countdown');


let lastHole;
let timeUp = false;
let score = 0;
let timeleft = 15;

function randomTime(min, max) {
  return Math.round(Math.random() * (max - min) + min);
}

function randomHole(holes) {
  const idx = Math.floor(Math.random() * holes.length);
  const hole = holes[idx];
  if (hole === lastHole) {
    return randomHole(holes);
  }

  lastHole = hole;
  return hole;
}

function peep() {
  const time = randomTime(400, 2000);
  const hole = randomHole(holes);
  hole.classList.add('up');
  setTimeout(() => {
    hole.classList.remove('up');
    if (!timeUp) peep();
  }, time);
}

function startGame() {
  scoreBoard.textContent = 0;
  timeleft = 15;
  timeUp = false;
  score = 0;
  peep();
  setTimeout(() => timeUp = true, 10000)
  countdownTimer();
}

function countdownTimer() {
  var timer = setInterval(function() {
      timeleft--;
      countdownNum.textContent = timeleft;
      if (timeleft <= 0)
        clearInterval(timer);
      }, 1000);

      setTimeout(() => {
        countdownNum.textContent = '15';
      }, 11500)
}

function whack(e) {
  if(!e.isTrusted) return; 
  score++;
  this.classList.remove('up');
  scoreBoard.textContent = score;
}

bunnys.forEach(bunny => bunny.addEventListener('click', whack));