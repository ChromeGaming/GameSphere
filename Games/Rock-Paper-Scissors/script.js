var you
var yourscore = 0
var opponent
var opponentScore = 0

var choices = ["rock", "paper", "scissors"]

window.onload = function () {
    for (let i = 0; i < 3; i++) {
        let choice = document.createElement("img")
        choice.id = choices[i];
        choice.src = choices[i] + ".png"
        document.getElementById("choice").append(choice)
        choice.addEventListener("click", selectchoice)
    }
}

function selectchoice() {
    you = this.id
    document.getElementById("your-choice").src = you + ".png"
    opponent = choices[Math.floor(Math.random() * 3)]
    document.getElementById("opponent-choice").src = opponent + ".png"

    if(you == opponent){
        yourscore+=1
        opponentScore+=1
    }

    else{
        if(you == "rock"){
            if(opponent == "scissors"){
                yourscore+=1
            }
            else if (opponent == "paper"){
                opponentScore+=1
            }
        }

       else if(you == "scissors"){
            if(opponent == "paper"){
                yourscore+=1
            }
            else if (opponent == "rock"){
                opponentScore+=1
            }
        }

       else if(you == "paper"){
            if(opponent == "rock"){
                yourscore+=1
            }
            else if (opponent == "scissors"){
                opponentScore+=1
            }
        }
    }

    document.getElementById("your-score").innerText = yourscore
    document.getElementById("opponent-score").innerText = opponentScore
}



