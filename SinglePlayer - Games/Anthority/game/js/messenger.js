class Messenger {
    constructor() {
        this.initUI();
    }

    initUI() {
        this.container = gId("messenger");
        this.list = qSel("#messenger ul");
        this.continue = gId("btnContinue");
    }

    hide() {
        this.container.classList.add("screenhidden");
    }
    
    show() {
        this.container.classList.remove("screenhidden");
    }
    
    resetList() {
        this.list.innerHTML = "";
        this.deactivateContinue();
    }

    addMessage(t) {
        this.list.appendChild(cEl(repltxt("<li><span></span><p>%1</p></li>", [t])));
        this.list.scrollTop = this.list.scrollHeight;
        playaudio(SOUNDS.message);
    }

    activateContinue(callback) {
        this.continue.classList.remove("disabled");
        this.continue.onclick = callback;
    }

    deactivateContinue() {
        this.continue.classList.add("disabled");
        this.continue.onclick = null;
    }

    playMessage(text, callback) {
        this.resetList();
        this.show();
        co((function*() {
            yield 1;
            for (let [m, t] of text) {
                this.addMessage(m);
                yield t;
            }
            
            this.activateContinue(callback);
            playaudio(SOUNDS.warn);
        }).bind(this));
    }
    
    playIntro() {
        this.playMessage(MESSAGE_INTRO, this.startGame.bind(this));
    }
    
    playWinGame() {
        this.playMessage(MESSAGE_WIN, this.endGame.bind(this));
    }
        
    playGameOver() {
        this.playMessage(MESSAGE_GAMEOVER, this.endGame.bind(this));
    }
    
    // Routines

    startGame() {
        co((function*() {
            yield .2;
            fadeOut();
            yield 1;
            this.hide();
            game.play();
            yield .1;
            fadeIn();
        }).bind(this));
    }

    endGame() {
        co((function*() {
            yield .2;
            fadeOut();
            yield 1;
            window.location.reload();
        }).bind(this));
    }
}
