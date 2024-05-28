let userScore = 0;
let compScore = 0;

let msg=document.querySelector("#msg");
let user=document.querySelector("#user-score");
let comp=document.querySelector("#comp-score");

const genComputerChoice =() =>{
    const options = ["rock","paper","scissors"];
    const randIdx = Math.floor(Math.random()*3);
    return options[randIdx];
}

const drawGame = () =>{
    console.log("The game was a draw");
}
const playGame = (userChoice) =>{
    console.log("user choice = ",userChoice);
    const compChoice = genComputerChoice();
    console.log("computer choice = ",compChoice);
    if(userChoice===compChoice){
        drawGame();
        msg.innerHTML="The game was a draw";
    }
    else{
        let userWin=true;
        if(userChoice==="rock"){
            userWin = compChoice === "paper" ? false : true;
            console.log(userWin);
            if(userWin===false){
                compScore++;
                msg.innerHTML="Better luck next time!";
                msg.style.backgroundColor = "red";
                user.innerHTML=userScore;
                comp.innerHTML=compScore;
            }
            else{
                userScore++;
                msg.innerHTML="Yayy! You won";
                msg.style.backgroundColor = "green";
                user.innerHTML=userScore;
                comp.innerHTML=compScore;
            }
        }
        else if(userChoice==="paper"){
            userWin = compChoice === "rock" ? true : false;
            console.log(userWin);
            if(userWin===false){
                compScore++;
                msg.innerHTML="Better luck next time!";
                msg.style.backgroundColor = "red";
                user.innerHTML=userScore;
                comp.innerHTML=compScore;
            }
            else{
                userScore++;
                msg.innerHTML="Yayy! You won";
                msg.style.backgroundColor = "green";
                user.innerHTML=userScore;
                comp.innerHTML=compScore;
            }
        }
        else{
            userWin = compChoice === "paper" ? true : false;
            console.log(userWin);
            if(userWin===false){
                compScore++;
                msg.innerHTML="Better luck next time!";
                msg.style.backgroundColor = "red";
                user.innerHTML=userScore;
                comp.innerHTML=compScore;
            }
            else{
                userScore++;
                msg.innerHTML="Yayy! You won";
                msg.style.backgroundColor = "green";
                user.innerHTML=userScore;
                comp.innerHTML=compScore;
            }
        }
    }
}

const choices = document.querySelectorAll(".choice");
choices.forEach((choice)=>{
    console.log(choice);
    choice.addEventListener("click", ()=>{
        const userChoice=choice.getAttribute("id");
        console.log("choice was clicked ",userChoice);
        playGame(userChoice);
    })
})