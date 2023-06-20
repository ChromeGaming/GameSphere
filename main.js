var roundNumber;
var trackRounds = 0;
let compNames = ["Smith", "David", "John", "bonny", "Shivv"];
let compName = document.getElementById("computer-name");
let chosenCompName = compNames[Math.floor(Math.random() * 5)];
let player;

function login() {
    player = document.getElementById("player").value;
    roundNumber = document.getElementById("round-number").value;
    let startButton = document.getElementById("submit");
    let faq = document.getElementById("faq");

    if (/\w{2,10}/.test(player) == false || /\d/.test(roundNumber) == false) {
        alert(
            "Please enter a valid name of atleast 2 letters, don't forget the number of rounds."
        );
        return 0;
    } else if (roundNumber > 10 || roundNumber < 3) {
        alert("Please enter a round number between 3 and 10.");
        return 0;
    }

    startButton.value = "LET'S GO";
    startButton.style.background = "#5AC994";

    document.getElementById("computer-name").innerText = chosenCompName;
    document.getElementById("player-name").innerText = player;

    function closeWindow() {
        document.getElementById("player-login").style.display = "none";
        document.getElementById("game").style.display = "block";
    }

    setTimeout(() => closeWindow(), 790);
}

function faq() {
    document.getElementById("faq").style.display = "none";
    document.getElementById("player-login").style.display = "block";
}

//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
/*/////////////////--PLAYGROUND--//////////////// */
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

let trackCompScore = 0;
let trackPlayerScore = 0;

function chose(n) {
    let playerChoice = document.getElementById(n).innerText;
    let playerDisplay = document.getElementById("player-choice");
    let compDisplay = document.getElementById("comp-choice");
    let comments = document.getElementById("commentary");
    let compScore = document.getElementById("computer-score");
    let playerScore = document.getElementById("player-score");
    let controls = document.getElementsByClassName("controls");

    if (roundNumber == 0) {
        if (trackCompScore > trackPlayerScore) {
            document.getElementById("winner-name").innerText = chosenCompName;
        } else {
            document.getElementById("winner-name").innerText = player;
        }
        document.getElementById("player-wins").innerText = trackPlayerScore;
        document.getElementById("player-losses").innerText = trackCompScore;
        document.getElementById("computer-wins").innerText = trackCompScore;
        document.getElementById("computer-losses").innerText = trackPlayerScore;

        document.getElementById("final-computer-score").innerText =
            trackCompScore;
        document.getElementById("final-player-score").innerText =
            trackPlayerScore;
        document.getElementById("final-computer-name").innerText =
            chosenCompName;
        document.getElementById("final-player-name").innerText = player;
        document.getElementById("draws").innerText =
            trackRounds - (trackCompScore + trackPlayerScore);
        document.getElementById("results-section").style.display = "block";
        document.getElementById("game").style.display = "none";
        return 0;
    }
    roundNumber--;

    compDisplay.innerText = "🤜";
    playerDisplay.innerText = "🤜";
    playerDisplay.classList.add("handshaking");
    compDisplay.classList.add("handshaking-comp");
    for (control of controls) {
        control.style.display = "none";
    }

    function gameplay() {
        playerDisplay.classList.remove("handshaking");
        compDisplay.classList.remove("handshaking-comp");
        function computer() {
            let options = ["🖐", "👊", "✌"];
            playerDisplay.innerText = playerChoice;
            compDisplay.innerText = options[Math.floor(Math.random() * 3)];
        }
        computer();

        function modifyScore() {
            let choices = playerDisplay.innerText + compDisplay.innerText;
            trackRounds += 1;
            if (compDisplay.innerText == playerDisplay.innerText) {
                comments.innerText = "Draw❕❕😄";
                comments.classList.add("exclame");
            } else if (compDisplay.innerText !== playerDisplay.innerText) {
                comments.classList.add("exclame");
                switch (choices) {
                    case "👊🖐":
                        compScore.innerText = trackCompScore + 1;
                        trackCompScore += 1;
                        comments.innerText = "Lost❕❕😆";
                        break;
                    case "👊✌":
                        playerScore.innerText = trackPlayerScore + 1;
                        trackPlayerScore += 1;
                        comments.innerText = "Won❕❕😒";
                        break;
                    case "🖐✌":
                        compScore.innerText = trackCompScore + 1;
                        trackCompScore += 1;
                        comments.innerText = "Lost❕❕😝";
                        break;
                    case "🖐👊":
                        playerScore.innerText = trackPlayerScore + 1;
                        trackPlayerScore += 1;
                        comments.innerText = "Haaaa❕❕😲";
                        break;
                    case "✌🖐":
                        playerScore.innerText = trackPlayerScore + 1;
                        trackPlayerScore += 1;
                        comments.innerText = "Hhmmm❕❕😑";
                        break;
                    case "✌👊":
                        compScore.innerText = trackCompScore + 1;
                        trackCompScore += 1;
                        comments.innerText = "Woooo❕❕😝";
                        break;
                }
            }
        }
        modifyScore();
        setTimeout(() => comments.classList.remove("exclame"), 1000);

        for (control of controls) {
            control.style.display = "block";
        }
    }

    setTimeout(() => gameplay(), 2000);
}