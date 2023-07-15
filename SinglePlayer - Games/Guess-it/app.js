
let audio = new Audio("gameaudio.wav")         //for adding audio 

// random number genreating function
let computerGuessses                  //it store the random num between 1 to 100 gnerated by computer

const randomNumber = () => {
    computerGuessses = Math.floor(Math.random() * 100)
    console.log(computerGuessses)

    // hidding the new Game button
    document.getElementById("newGameButton").style.display = "none";

    //hidding second screen gameArea
    document.getElementById("gameArea").style.display = "none"
}


const easyMode = () => {

    audio.play()            //inbuilt method to play music

    //hidding landing page when someone click on easy button
    document.getElementById("landing-page").style.display = "none"

    //display gameArea screen when someone click on easy button
    document.getElementById("gameArea").style.display = "block"

    maxGuess = 10                //isse zada input nhi h
}

const hardMode = () => {

    audio.play()            //inbuilt method to play music

    //hidding landing page when someone click on hard button
    document.getElementById("landing-page").style.display = "none"

    //display gameArea screen when someone click on hard button
    document.getElementById("gameArea").style.display = "block"

    maxGuess = 5                 //isse zada input nhi h
}


// startNewGame()--> this function is run after the user guess the correct number or also run this func when the user loose
const startNewGame = () => {
    audio.play()            //inbuilt method to play music
    // display the new Game button
    document.getElementById("newGameButton").style.display = "inline";

    //now input box ko disable krna hai so user input nhi insert kr sake
    document.getElementById("inputBox").setAttribute("disabled", true)
}



//so hum new Game button click krne par sabkuch reload krdenge
const newGame = () => {
    audio.play()            //inbuilt method to play music

    window.location.reload()

}




//^^^^^^^^^^^^^ MAIN LOGIC OF GAME  ^^^^^^^^^^^^^^^^^^^^^^
let userGuesses = []

const guesses = () => {

    audio.play()            //inbuilt method to play music

    const userNumbers = Number(document.getElementById("inputBox").value)
    userGuesses = [...userGuesses, userNumbers]                            //userGuesses previous gusses store krega and storeNoOfGuesses next new number of gusess store krega

    //To show previous guesses on second screen
    document.getElementById("guesses").innerHTML = userGuesses

    //To show previous attemts on second screen
    document.getElementById("attempts").innerHTML = userGuesses.length


    //check the value low or high  ( Second Screen ka msg update hoga)  
    if (userGuesses.length < maxGuess) {
        if (userNumbers > computerGuessses) {
            document.getElementById("textTitle").innerHTML = "Your guess is High 😶‍🌫️ "

            //input box ki value ko empty krna hai every attempt k badd
            document.getElementById("inputBox").value = ''
        }

        else if (userNumbers < computerGuessses) {
            document.getElementById("textTitle").innerHTML = "Your guess is Low 🤦‍♂️ "

            //input box ki value ko empty krna hai every attempt k badd
            document.getElementById("inputBox").value = ''
        }

        else {
            document.getElementById("textTitle").innerHTML = "Correct Guess 🤩 " 

            //input box ki value ko empty krna hai every attempt k badd
            document.getElementById("inputBox").value = ''

            startNewGame()
        }
    }


    //this else is for last attempt of user either 10th or 5th attempt
    else {
        if (userNumbers > computerGuessses) {
            document.getElementById("textTitle").innerHTML = `You loose 🙁 Correct number was ${computerGuessses}`

            //input box ki value ko empty krna hai every attempt k badd
            document.getElementById("inputBox").value = ''

            startNewGame()
        }

        else if (userNumbers < computerGuessses) {
            document.getElementById("textTitle").innerHTML = `You loose 🙁 Correct number was ${computerGuessses}`

            //input box ki value ko empty krna hai every attempt k badd
            document.getElementById("inputBox").value = ''

            startNewGame()
        }

        else {
            document.getElementById("textTitle").innerHTML = "Correct Guess 🤩 "

            //input box ki value ko empty krna hai every attempt k badd
            document.getElementById("inputBox").value = ''

            startNewGame()
        }
    }

}