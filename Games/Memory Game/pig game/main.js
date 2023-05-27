/*
GAME RULES:

- The game has 2 players, playing in rounds
- In each turn, a player rolls a dice as many times as he whishes. Each result get added to his ROUND score
- BUT, if the player rolls a 1, all his ROUND score gets lost. After that, it's the next player's turn
- The player can choose to 'Hold', which means that his ROUND score gets added to his GLBAL score. After that, it's the next player's turn
- The first player to reach 100 points on GLOBAL score wins the game

*/

var scores, roundScore, activePlayer, gamePlaying;
init();
var goal;

// document.querySelector("#current-" + activePlayer).textContent = dice;
// document.querySelector('#current-'+activePlayer).innerHTML='<em>'+dice+'</em>';
var diceP1, diceP2;
// document.querySelector(".dice").style.display = "none";

document.querySelector(".btn-roll").addEventListener("click", function() {
  if (gamePlaying) {
    //creating random value for dice

    var dice1 = diceValue();
    //displaying dice1 result
    var diceDOM1 = document.querySelector(".dice1");
    diceDOM1.style.display = "block";
    diceDOM1.src = "./images/dice-" + dice1 + ".png";

    var dice2 = diceValue();
    //displaying dice2 result
    var diceDOM2 = document.querySelector(".dice2");
    diceDOM2.style.display = "block";
    diceDOM2.src = "./images/dice-" + dice2 + ".png";
    // Update round score if rolled two 6 in a row
    if ((dice1 === 6 && diceP1 === 6) || (dice2 === 6 && diceP2 === 6)) {
      scores[activePlayer] = 0;

      // Upadte UI
      document.querySelector("#score-" + activePlayer).textContent =
        scores[activePlayer];
      nextPlayer();
    }
    diceP1 = dice1;
    diceP2 = dice2;
    //Update round score if rolled number was NOT a 1
    if (dice1 === 1 || dice2 == 1) {
      //Next player
      nextPlayer();
    } else {
      //Add score
      roundScore += dice1 + dice2;
      document.querySelector(
        "#current-" + activePlayer
      ).textContent = roundScore;
    }
  }
});

document.querySelector(".btn-hold").addEventListener("click", function() {
  if (gamePlaying) {
    // Add current score to global score
    scores[activePlayer] += roundScore;

    // Upadte UI
    document.querySelector("#score-" + activePlayer).textContent =
      scores[activePlayer];

    // Check if player won the game
    if (scores[activePlayer] >= goal) {
      document.querySelector("#name-" + activePlayer).textContent = "Winner!";
      document.querySelector(".dice1").style.display = "none";
      document.querySelector(".dice2").style.display = "none";
      document
        .querySelector(".player-" + activePlayer + "-panel")
        .classList.add("winner");
      document
        .querySelector(".player-" + activePlayer + "-panel")
        .classList.remove("active");
      gamePlaying = false;
    } else {
      // Next Player
      nextPlayer();
    }
  }
});

function nextPlayer() {
  activePlayer === 0 ? (activePlayer = 1) : (activePlayer = 0);
  roundScore = 0;

  document.getElementById("current-0").textContent = "0";
  document.getElementById("current-1").textContent = "0";

  document.querySelector(".player-0-panel").classList.toggle("active");
  document.querySelector(".player-1-panel").classList.toggle("active");

  //document.querySelector('.player-0-panel').classList.remove('active');
  //document.querySelector('.player-1-panel').classList.add('active');
  document.querySelector(".dice1").style.display = "none";
  document.querySelector(".dice2").style.display = "none";
}

document.querySelector(".btn-new").addEventListener("click", init);

function init() {
  scores = [0, 0];
  roundScore = 0;
  activePlayer = 0;
  goal = prompt("Enter score to become winner!");
  document.querySelector(".dice1").style.display = "none";
  document.querySelector(".dice2").style.display = "none";
  gamePlaying = true;
  document.getElementById("score-0").textContent = "0";
  document.getElementById("score-1").textContent = "0";
  document.getElementById("current-0").textContent = "0";
  document.getElementById("current-1").textContent = "0";
  document.getElementById("name-0").textContent = "Player 1";
  document.getElementById("name-1").textContent = "Player 2";

  document.querySelector(".player-0-panel").classList.remove("winner");
  document.querySelector(".player-1-panel").classList.remove("winner");
  document.querySelector(".player-0-panel").classList.remove("active");
  document.querySelector(".player-1-panel").classList.remove("active");
  document.querySelector(".player-0-panel").classList.add("active");
}

function diceValue() {
  return Math.floor(Math.random() * 6) + 1;
}
//////////////////////////////////////////////////////
//////////////////////////////////////////////////////
// Modal Elements
const modal = document.querySelector("#my-modal");
const modalBtn = document.querySelector("#modal-btn");
const closeBtn = document.querySelector(".close");

//Events
modalBtn.addEventListener("click", openModal);
closeBtn.addEventListener("click", closeModal);
window.addEventListener("click", outsideClick);

//open
function openModal() {
  modal.style.display = "block";
}
//Close
function closeModal() {
  modal.style.display = "none";
}

//Close if outside click
function outsideClick(e) {
  if (e.target == modal) {
    modal.style.display = "none";
  }
}