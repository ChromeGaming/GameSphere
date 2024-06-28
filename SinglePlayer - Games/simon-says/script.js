const round = document.getElementById('round');
const simonButtons = document.getElementsByClassName('square');
const startButton = document.getElementById('startButton');


class Simon {
    constructor(simonButtons, startButton, round) {
        this.round = 0;
        this.userPosition = 0;
        this.sequence = [];
        this.speed = 1000;
        this.blockedButtons = true;
        this.buttons = Array.from(simonButtons);
        this.display = {
            startButton,
            round
        }
        this.errorSound = new Audio('./sounds/error.wav');
        this.buttonSounds = [
            new Audio('./sounds/1.mp3'),
            new Audio('./sounds/2.mp3'),
            new Audio('./sounds/3.mp3'),
            new Audio('./sounds/4.mp3'),
        ]
    }

    init() {
        this.display.startButton.onclick = () => this.startGame();
    }

    startGame() {
        let totalRound=document.getElementById('total-round').value
       this.totalRounds=Number(totalRound)
       console.log(totalRound)
        this.display.startButton.disabled = true; 
        this.updateRound(0);
        this.userPosition = 0;
        this.sequence = this.createSequence();
        this.buttons.forEach((element, i) => {
            element.classList.remove('winner');
            element.onclick = () => this.buttonClick(i);
        });
        this.showSequence();
    }

   
    updateRound(value) {
        this.round = value;
        this.display.round.textContent = `Round ${this.round}`;
    }

   
    createSequence() {
        return Array.from({length: this.totalRounds}, () =>  this.getRandomColor());
    }

   
    getRandomColor() {
        return Math.floor(Math.random() * 4);
    }

   
    buttonClick(value) {
        !this.blockedButtons && this.validateChosenColor(value);
    }

   
    validateChosenColor(value) {
        if(this.sequence[this.userPosition] === value) {
            this.buttonSounds[value].play();
            if(this.round === this.userPosition) {
                this.updateRound(this.round + 1);
                this.speed /= 1.02;
                this.isGameOver();
            } else {
                this.userPosition++;
            }
        } else {
            this.gameLost();
        }
    }

   
    isGameOver() {
        if (this.round === this.totalRounds) {
            this.gameWon();
        } else {
            this.userPosition = 0;
            this.showSequence();
        };
    }

   
    showSequence() {
        this.blockedButtons = true;
        let sequenceIndex = 0;
        let timer = setInterval(() => {
            const button = this.buttons[this.sequence[sequenceIndex]];
            this.buttonSounds[this.sequence[sequenceIndex]].play();
            this.toggleButtonStyle(button)
            setTimeout( () => this.toggleButtonStyle(button), this.speed / 2)
            sequenceIndex++;
            if (sequenceIndex > this.round) {
                this.blockedButtons = false;
                clearInterval(timer);
            }
        }, this.speed);
    }

   
    toggleButtonStyle(button) {
        button.classList.toggle('active');
    }

   
    gameLost() {
        this.errorSound.play();
        this.display.startButton.disabled = false; 
        this.blockedButtons = true;
        round.innerHTML=`You Lost.<br>Your score : ${this.round}`;
    }

   
    gameWon() {
        this.display.startButton.disabled = false; 
        this.blockedButtons = true;
        this.buttons.forEach(element =>{
            element.classList.add('winner');
        });
        round.innerHTML=`You Win 🏆<br>Your score : ${this.round}`;
    }
}

const simon = new Simon(simonButtons, startButton, round);
simon.init();