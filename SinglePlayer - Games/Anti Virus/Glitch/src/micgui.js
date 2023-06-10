game.gui = {};
game.gui.fullscreenBTN = {
    x: 0,
    y: 0,
    width: 40,
    height: 40,
    toggled: false,
};
game.gui.update = function () {
    game.gui.fullscreenBTN.x = game.canvas.width - 20 - game.gui.fullscreenBTN.width;
    game.gui.fullscreenBTN.y = 20;
};
game.gui.render = function () {
    if (game.currentState != "play") {
        if (hoverOn(game.gui.fullscreenBTN) == true && game.gui.fullscreenBTN.toggled == false) {
            game.ctx.drawImage(game.image, 0, 16, 8, 8, game.gui.fullscreenBTN.x - 5, game.gui.fullscreenBTN.y - 5, game.gui.fullscreenBTN.width + 10, game.gui.fullscreenBTN.height + 10);
        } else if (hoverOn(game.gui.fullscreenBTN) == true && game.gui.fullscreenBTN.toggled == true) {
            game.ctx.drawImage(game.image, 0, 16, 8, 8, game.gui.fullscreenBTN.x + 5, game.gui.fullscreenBTN.y + 5, game.gui.fullscreenBTN.width - 10, game.gui.fullscreenBTN.height - 10);
        } else {
            game.ctx.drawImage(game.image, 0, 16, 8, 8, game.gui.fullscreenBTN.x, game.gui.fullscreenBTN.y, game.gui.fullscreenBTN.width, game.gui.fullscreenBTN.height);
        }
    }
}