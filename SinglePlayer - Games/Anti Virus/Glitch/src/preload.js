game.preload = {};
game.preload.tick = 0;
game.preload.text = "";
game.preload.placement = {
    x: 0,
    y: 0
}
if (loadData("item") == "true") {

    game.items = JSON.parse(loadData("items")) || game.items;
    game.money = parseInt(loadData("money")) || 0;
    game.score = parseInt(loadData("score")) || 0;
    game.highscore = parseInt(loadData("highScore")) || 0;
}


game.preload.update = function () {

    if (game.preload.tick == 0) {
        game.fade = 1;
        game.preload.tick += 60;
    }
    if (game.preload.tick == 100) {

        game.preload.text += "f";
        aa.play('keypress');
    }
    if (game.preload.tick == 105) {
        game.preload.text += "i";
        aa.play('keypress');
    }
    if (game.preload.tick == 110) {
        game.preload.text += "r";
        aa.play('keypress');
    }
    if (game.preload.tick == 115) {
        game.preload.text += "e";
        aa.play('keypress');
    }
    if (game.preload.tick == 120) {
        game.preload.text += "n";
        aa.play('keypress');
    }
    if (game.preload.tick == 125) {
        game.preload.text += "i";
        aa.play('keypress');
    }
    if (game.preload.tick == 130) {
        game.preload.text += "b";
        aa.play('keypress');
    }
    if (game.preload.tick == 135) {
        game.preload.text += "b";
        aa.play('keypress');
    }
    if (game.preload.tick == 140) {
        game.preload.text += "l";
        aa.play('keypress');
    }
    if (game.preload.tick == 145) {
        game.preload.text += "e";
        aa.play('keypress');
    }
    if (game.preload.tick == 150) {
        game.preload.text += "r";
        aa.play('keypress');
    }
    if (game.preload.tick == 155) {
        game.preload.text += " ";
        //aa.play('keypress');
    }
    if (game.preload.tick == 165) {
        game.preload.text += "s";
        aa.play('keypress');
    }
    if (game.preload.tick == 170) {
        game.preload.text += "t";
        aa.play('keypress');
    }
    if (game.preload.tick == 175) {
        game.preload.text += "u";
        aa.play('keypress');
    }
    if (game.preload.tick == 180) {
        game.preload.text += "d";
        aa.play('keypress');
    }
    if (game.preload.tick == 185) {
        game.preload.text += "i";
        aa.play('keypress');
    }
    if (game.preload.tick == 190) {
        game.preload.text += "o";
        aa.play('keypress');
    }
    if (game.preload.tick == 195) {
        game.preload.text += "s";
        aa.play('keypress');
    }
    if (game.preload.tick == 200) {
        game.preload.text += " ";
        //aa.play('keypress');
    }
    if (game.preload.tick == 205) {
        game.preload.text += "p";
        aa.play('keypress');
    }
    if (game.preload.tick == 210) {
        game.preload.text += "r";
        aa.play('keypress');
    }
    if (game.preload.tick == 215) {
        game.preload.text += "e";
        aa.play('keypress');
    }
    if (game.preload.tick == 220) {
        game.preload.text += "s";
        aa.play('keypress');
    }
    if (game.preload.tick == 225) {
        game.preload.text += "e";
        aa.play('keypress');
    }
    if (game.preload.tick == 230) {
        game.preload.text += "n";
        aa.play('keypress');
    }
    if (game.preload.tick == 235) {
        game.preload.text += "t";
        aa.play('keypress');
    }
    if (game.preload.tick == 240) {
        game.preload.text += "s";
        aa.play('keypress');
    }
    if (game.preload.tick == 245) {
        game.preload.text += ".";
        aa.play('keypress');
    }
    if (game.preload.tick == 250) {
        game.preload.text += ".";
        aa.play('keypress');
    }
    if (game.preload.tick == 255) {
        game.preload.text += ".";
        aa.play('keypress');
    }
    if (game.preload.tick == 260) {
        game.preload.text = "firenibbler studios presents..._";
    }
    if (game.preload.tick == 280) {
        game.preload.text = "firenibbler studios presents...";
    }
    if (game.preload.tick == 300) {
        game.preload.text = "firenibbler studios presents..._";
    }
    if (game.preload.tick == 320) {
        game.preload.text = "firenibbler studios presents...";
    }
    if (game.preload.tick == 340) {
        game.preload.text = "firenibbler studios presents..._";
    }
    if (game.preload.tick == 360) {
        game.preload.text = "firenibbler studios presents...";
    }
    if (game.preload.tick == 380) {
        game.preload.text = "";
        game.fade = 1;
        aa.play('fade');
        game.preload.title = true;
    }
    if (game.preload.tick == 560) {
        game.fade = 1;
        aa.play('fade');
        game.currentState = "start";
    }
    game.preload.tick += 1.25;
};
game.preload.render = function () {
    game.ctx.fillStyle = "#000000";
    game.ctx.globalAlpha = 1;
    game.ctx.fillRect(0, 0, game.canvas.width, game.canvas.height);
    if (game.canvas.width > (32 * 4 * 3) + 20) {
        drawText(game.preload.text, (game.canvas.width / 2) - ((32 * 4 * 3) / 2), (game.canvas.height / 2) - (5 * 3), 3, "#ffffff");
    } else {
        drawText(game.preload.text, (game.canvas.width / 2) - ((32 * 4 * 2) / 2), (game.canvas.height / 2) - (5 * 3), 2, "#ffffff");
    }



    if (game.preload.title) {
        if (random(0, 18) == 10) {
            game.preload.placement.x = random(0, game.canvas.width) - 200;
            game.preload.placement.y = random(0, game.canvas.height) - 20;
            aa.play('jitter');
        }
        drawText("anti virus", game.preload.placement.x, game.preload.placement.y, 5, "#ffffff"); //game.preload.placement
        game.preload.placement.x = (game.canvas.width / 2) - ((10 * 4 * 5) / 2);
        game.preload.placement.y = (game.canvas.height / 2) - (3.5 * 3);


    }
}