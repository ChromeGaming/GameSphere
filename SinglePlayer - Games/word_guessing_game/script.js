document.addEventListener("DOMContentLoaded", function() {
    const words = [
        { word: "javascript", hint: "I am a programming language commonly used for web development." },
        { word: "programming", hint: "I involve writing instructions for computers to execute." },
        { word: "html", hint: "I am the standard markup language for creating web pages." },
        { word: "css", hint: "I am used for styling web pages and making them look attractive." },
        { word: "developer", hint: "I am someone who creates software applications or websites." },
        { word: "coding", hint: "I am the process of writing instructions for a computer to execute." },
        { word: "algorithm", hint: "I am a set of rules or steps for solving a problem." },
        { word: "function", hint: "I am a block of reusable code that performs a specific task." },
        { word: "variable", hint: "I am a container for storing data values." },
        { word: "loop", hint: "I am a programming construct used to repeat a block of code." }
    ];

    let randomWord;
    let guessedLetters = [];
    let remainingAttempts;

    function initGame() {
        // Select a random word from the words array
        const randomIndex = Math.floor(Math.random() * words.length);
        randomWord = words[randomIndex].word;
        const hint = words[randomIndex].hint;

        // Display placeholders for each letter in the word
        const wordContainer = document.getElementById("word-container");
        wordContainer.innerHTML = "";
        for (let i = 0; i < randomWord.length; i++) {
            const letterContainer = document.createElement("span");
            letterContainer.textContent = "_";
            letterContainer.className = "letter";
            wordContainer.appendChild(letterContainer);
        }

        // Reset guessed letters and remaining attempts
        guessedLetters = [];
        remainingAttempts = 6;
        document.getElementById("hint").textContent = hint;
        document.getElementById("attempts-left").textContent = remainingAttempts;
        document.getElementById("result").textContent = "";
    }

    function checkLetter(letter) {
        if (guessedLetters.includes(letter)) {
            return; // Already guessed this letter
        }

        guessedLetters.push(letter);

        const wordContainer = document.getElementById("word-container");
        let correctGuess = false;

        // Check if the letter exists in the word
        for (let i = 0; i < randomWord.length; i++) {
            if (randomWord[i] === letter) {
                wordContainer.children[i].textContent = letter;
                correctGuess = true;
            }
        }

        // Update remaining attempts and check for win or loss
        if (!correctGuess) {
            remainingAttempts--;
            updateResult();
        } else {
            if (wordContainer.textContent === randomWord) {
                document.getElementById("result").textContent = "Congratulations! You guessed the word.";
            }
        }

        document.getElementById("attempts-left").textContent = remainingAttempts;
    }

    function updateResult() {
        if (remainingAttempts === 0) {
            document.getElementById("result").textContent = "Sorry, you've run out of attempts. The word was: " + randomWord + ".";
        }
    }

    // Initialize the game when the page loads
    initGame();

    // Event listener for the guess button
    document.getElementById("guess-button").addEventListener("click", function() {
        const letterInput = document.getElementById("letter-input").value.trim().toLowerCase();

        if (letterInput.length !== 1 || !/^[a-z]+$/.test(letterInput)) {
            alert("Please enter a single letter from A to Z.");
            return;
        }

        checkLetter(letterInput);
        document.getElementById("letter-input").value = "";
    });

    // Event listener for the hint button
    document.getElementById("hint-button").addEventListener("click", function() {
        const hintContainer = document.getElementById("hint");
        hintContainer.style.display = "block";
    });
});
