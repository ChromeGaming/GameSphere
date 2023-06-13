game.start = {};
game.start.playBTN = {
    x: 20,
    y: 40,
    width: 4 * 5 * 4,
    height: 5 * 5,
};

game.start.controlBTN = {
    x: 20,
    y: 120,
    width: 4 * 5 * 8,
    height: 5 * 5,
};

game.start.storeBTN = {
    x: 20,
    y: 200,
    width: 4 * 5 * 5,
    height: 5 * 5,
};

game.start.render = function () {

    game.start.playBTN.x = (game.canvas.width / 2) - (game.start.playBTN.width / 2);
    game.start.controlBTN.x = (game.canvas.width / 2) - (game.start.controlBTN.width / 2);
    game.start.storeBTN.x = (game.canvas.width / 2) - (game.start.storeBTN.width / 2);

    game.start.playBTN.y = (game.canvas.height / 2) - 120;
    game.start.controlBTN.y = (game.canvas.height / 2) - 40;
    game.start.storeBTN.y = (game.canvas.height / 2) + 40;

    if (hoverOn(game.start.playBTN) == true) {
        drawText("play", game.start.playBTN.x, game.start.playBTN.y, 5, "#ffffff");
    } else {
        drawText("play", game.start.playBTN.x, game.start.playBTN.y, 5, "#00ffff");
    }

    if (hoverOn(game.start.controlBTN) == true) {
        drawText("controls", game.start.controlBTN.x, game.start.controlBTN.y, 5, "#ffffff");
    } else {
        drawText("controls", game.start.controlBTN.x, game.start.controlBTN.y, 5, "#00ffff");
    }

    if (hoverOn(game.start.storeBTN) == true) {
        drawText("store", game.start.storeBTN.x, game.start.storeBTN.y, 5, "#ffffff");
    } else {
        drawText("store", game.start.storeBTN.x, game.start.storeBTN.y, 5, "#00ffff");
    }

    if (game.start.controls) {
        game.ctx.globalAlpha = 0.9;
        game.ctx.fillStyle = "#000000";
        game.ctx.fillRect(0, 0, game.canvas.width, game.canvas.height);
        game.ctx.globalAlpha = 1;
        drawText("Controls:", 20, 20, 5, "#ffffff");
        drawText("Tap or click to shoot viruses", 10, 60, 2.5, "#ffffff");
        drawText("before they get past your files.", 10, 90, 2.5, "#ffffff");
        drawText("you must protect your", 10, 120, 2.5, "#ffffff");
        drawText("hard drive at all costs.", 10, 150, 2.5, "#ffffff");
        drawText("WARNING", 20, 180, 5, "#ff0000");
        drawText("the more files destroyed,", 10, 220, 2.5, "#ffffff");
        drawText("the glitchier your system gets.", 10, 250, 2.5, "#ffffff");



    }



};