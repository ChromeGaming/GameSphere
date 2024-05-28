const colors = ['#F44336','#4CAF50','#03A9F4','#FFEB3B',"#673AB7","#795548","#FF5722","#212121"]
let sequence = []
let numberOfColors=0
let sequenceSize =0
let maxAttemps=0
let currentAttemp = 0
let currentGuess = []
let currentGuessDots=[]
let currentGuessIndex=0

let confettiInterval

function GenerateSequence()
{
    for(let i = 0;i<sequenceSize;i++)
    {
        randomColor = Math.floor(Math.random()*numberOfColors)
        sequence.push(colors[randomColor])
    }
}

function createGuessColors()
{
    for(let i = 0;i<numberOfColors;i++)
    {
        var newGuessColor = document.createElement("span")
        newGuessColor.classList.add("dot");
        newGuessColor.style.backgroundColor = colors[i]
        newGuessColor.setAttribute("color",colors[i])
        newGuessColor.addEventListener("click",function()
        {
            clickGuessColor(this.getAttribute("color"))
        })
        var guessDiv = document.getElementById('colors')
        guessDiv.appendChild(newGuessColor)
    }
}

function createGuessSequence()
{
    var newGuessSequence = document.createElement("div")
    newGuessSequence.classList.add("guess")
    for(let i = 0;i<sequenceSize;i++)
    {
        var guess = document.createElement("span")
        guess.classList.add("dot")
        guess.style.backgroundColor="#313b4b";
        guess.setAttribute("index",i)
        currentGuessDots.push(guess)
        newGuessSequence.appendChild(guess)
    }
    var guessesDiv = document.getElementById("guesses")
    guessesDiv.appendChild(newGuessSequence)
}

function clickGuessColor(color)
{
    currentGuess.push(color)
    currentGuessDots[currentGuessIndex].style.backgroundColor = color
    currentGuessIndex++
}

function checkAnswer()
{
    var newResultSequence = document.createElement("div")
    newResultSequence.classList.add("result")
    won = true
    let correctColorPosition = Array(sequenceSize)
    for(let i =0;i<sequenceSize;i++)
    {
        if(currentGuess[i]==sequence[i])
        {
            correctColorPosition[i] = currentGuess[i]
        }
    }

    for(let i = 0;i<sequenceSize;i++)
    {
        var guess = document.createElement("span")
        guess.classList.add("dot")
        let answerColor
        let currentColorGuess = currentGuess[i]
        let currentColorGuesses
        if(currentGuess[i]==sequence[i])
            answerColor = "black"
        else if (sequence.includes(currentGuess[i]))
        {
            won = false
            numberOfColorInSequence = sequence.filter(element => element ==currentGuess[i]).length
            if(correctColorPosition.filter(element => element ==currentGuess[i]).length < numberOfColorInSequence)
            {
                let k = 0
                for(let j=0;j<i;j++)
                {
                    if(currentGuess[j]==currentGuess[i])
                    {
                        k++
                    }
                }
                if(k < numberOfColorInSequence)
                    answerColor = "white"
                else answerColor = "grey"
            }
            else 
            {
                answerColor = "grey"
            }
        }
        else 
        {
            answerColor = "grey"
            won = false
        }
        guess.style.backgroundColor=answerColor
            
        newResultSequence.appendChild(guess)
    }
    if(!won)
    {
        var guessesDiv = document.getElementById("results")
        guessesDiv.appendChild(newResultSequence)
        currentAttemp++;
        document.getElementById("attempsLeft").innerText="Attempts left: " + (maxAttemps - currentAttemp).toString() + "  "
        if(currentAttemp!=maxAttemps)
        {
            currentGuess = []
            currentGuessDots = []
            currentGuessIndex = 0
            createGuessSequence()
        }
        else
        {
            document.getElementById("confetti-container").style.visibility = "visible"
            document.getElementById("resultText").innerHTML = "You lost"
        }
    }
    else
    {
        document.getElementById("confetti-container").style.visibility = "visible"
        confettiInterval =  setInterval(() => {
            showConfetti();
          }, 400);
    }
}

const showConfetti = () => {
    
    const confettiContainer = document.querySelector('#confetti-container');
    const confetti = document.createElement('div');
    confetti.textContent = '🎉';
    confetti.classList.add('confetti');
    confetti.style.left = Math.random() * innerWidth + 'px';
    confettiContainer.appendChild(confetti);
    setTimeout(() => {
      confetti.remove();
    }, 5000);
  };

function newGame()
{
    document.getElementById("confetti-container").style.visibility = "hidden"
    document.getElementById("menu").style.visibility = "hidden"
    sequence = []
    difficultySelect = document.getElementById("difficulty").options;
    difficultyValue = difficultySelect[difficultySelect.selectedIndex].value
    if(difficultyValue === "Easy")
    {
        numberOfColors = 4
        sequenceSize  = 3
        maxAttemps = 6
    }
    else if(difficultyValue === "Medium")
    {
        numberOfColors = 5
        sequenceSize  = 4
        maxAttemps = 6
    }
    else if(difficultyValue === "Hard")
    {
        numberOfColors = 6
        sequenceSize  = 5
        maxAttemps = 6
    }
    currentAttemp = 0
    currentGuess = []
    currentGuessDots=[]
    currentGuessIndex=0
    const colorsContainer = document.getElementById("colors")
    while (colorsContainer.firstChild) colorsContainer.removeChild(colorsContainer.firstChild);
    const guessesContainer = document.getElementById("guesses")
    while (guessesContainer.firstChild) guessesContainer.removeChild(guessesContainer.firstChild);
    const resultsContainer = document.getElementById("results")
    while (resultsContainer.firstChild) resultsContainer.removeChild(resultsContainer.firstChild);

    document.getElementById("attempsLeft").innerText="Attempts left: " + (maxAttemps - currentAttemp).toString()

    GenerateSequence()
    createGuessColors();
    createGuessSequence()
}

function wonButton()
{
    clearInterval(confettiInterval)
    showMenu()
}

function showMenu()
{
    document.getElementById("confetti-container").style.visibility = "hidden"
    document.getElementById("menu").style.visibility = "visible"
}


window.onload = function(){  
    showMenu()

}