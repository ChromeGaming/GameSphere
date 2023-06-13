"use strict";
game.render = function () {
    game.renderBckParticle();
    game.renderBug();
    game.renderBullet();
    game.renderParticle();
    game.renderFile();
    if (game.currentState == "start") {
        game.start.render();
    } else if (game.currentState == "play") {
        game.play.render();
    } else if (game.currentState == "preload") {
        game.preload.render();
    } else if (game.currentState == "gameover") {
        game.over.render();
    } else if (game.currentState == "store") {
        game.store.render();
    }

    if (game.currentState != "preload") {
        game.gui.render();
    }


    game.renderAlert();
    if (game.fade > 0) {

        game.ctx.fillStyle = "#ffffff";
        game.ctx.strokeStyle = "#ffffff";
        game.ctx.globalAlpha = game.fade;
        game.ctx.beginPath();
        game.ctx.rect(-10, -10, game.canvas.width + 10, game.canvas.height + 10);
        game.ctx.fill();
        game.ctx.stroke();
        game.ctx.closePath();
        game.ctx.globalAlpha = 1;
        game.fade -= 0.05;
    }

    game.ctx.strokeStyle = "#606060";
    game.ctx.globalAlpha = 0.2;
    game.ctx.beginPath();
    for (let x = 0; x < game.canvas.width; x += 5) {
        game.ctx.moveTo(x + 0.5, 0);
        game.ctx.lineTo(x + 0.5, game.canvas.height);
    }
    for (let y = 0; y < game.canvas.height; y += 5) {
        game.ctx.moveTo(0, y + 0.5);
        game.ctx.lineTo(game.canvas.width, y + 0.5);
    }
    game.ctx.stroke();
    game.ctx.closePath();
    game.ctx.globalAlpha = 1;
};