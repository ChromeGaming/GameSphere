game.over = {};
game.over.timer = 0;
game.over.init = function () {
    game.currentState = "gameover";
    game.hits = 0;
    game.over.timer = 0;
    for (var i = 0; i < game.bugs.length; i++) {
        game.spawnParticles(game.bugs[i].x, game.bugs[i].y, 2);
    }
    for (var i = 0; i < game.files.length; i++) {
        game.spawnParticles(game.files[i].x, game.files[i].y, 2);
    }
    for (var i = 0; i < game.bullets.length; i++) {
        game.spawnParticles(game.bullets[i].x, game.bullets[i].y, 5);
    }
    aa.play("explosion");
    game.bugs = [];
    game.files = [];
    game.bullets = [];

};

game.over.update = function () {
    if (random(0, 6) == 3) {
        game.spawnParticles(random(0, game.canvas.width), random(0, game.canvas.height), 30);
    }
    game.over.timer++;
};
game.over.render = function () {
    drawText("game over", (game.canvas.width / 2) - (9 * 4 * 7) / 2, (game.canvas.height / 2) - 100, 7, "#ffffff");
    drawText("High score: " + game.highscore, (game.canvas.width / 2) - (9 * 4 * 7) / 2, (game.canvas.height / 2) - 50, 4, "#ffffff");
    drawText("Score: " + game.score, (game.canvas.width / 2) - (9 * 4 * 7) / 2, (game.canvas.height / 2) - 20, 4, "#ffffff");
    drawText("Bits: " + game.money, (game.canvas.width / 2) - (9 * 4 * 7) / 2, (game.canvas.height / 2) + 10, 4, "#ffffff");
};