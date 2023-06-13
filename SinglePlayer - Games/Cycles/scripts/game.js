function Game(view) {
    let graphics = new Graphics(view);
    let data = {};
    let logic = new Logic();
    let input = new Input(view, data);

    this.start = function () {
        logic.init(data);
        input.listen();
        gameLoop();
    }

    function gameLoop() {
        window.requestAnimationFrame(gameLoop);
        updateTime();
        logic.update(data);
        graphics.update(data);
    };

    function updateTime() {
        data.time.now = Date.now();

        data.time.delta = (data.time.now - data.time.last) / 1000;
        data.time.last = data.time.now;
    }
}

Game.BOARD_SIZE = 7;
