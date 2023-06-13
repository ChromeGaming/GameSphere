let menu = new Menu();
let game = new Game();
let messenger = new Messenger();

(function() {
    menu.play();
    // messenger.playIntro();
    // game.play();

    document.addEventListener("contextmenu", event => event.preventDefault());
})();
