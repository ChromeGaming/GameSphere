class Menu {
    constructor() {
        this.initUI();
    }

    initUI() {
        this.container = gId("menu");
        this.actionPlay = gId("btnPlay");
        this.actionPlay.onclick = this.startGame.bind(this);
    }

    hide() {
        this.container.classList.add("screenhidden");
    }
    
    show() {
        this.container.classList.remove("screenhidden");
    }

    play() {
        this.show();
    }
    
    startGame() {
        co((function*() {
            yield .2;
            fadeOut();
            yield 2;
            this.hide();
            messenger.playIntro();
            yield .1;
            fadeIn();
        }).bind(this));
    }
}
