game.files = [];
game.spawnFile = function (x, y) {
    game.files.push({
        x: x,
        y: y,
        width: 40,
        height: 40,
        HP: 2,
    });
};
game.deleteFile = function (id) {
    game.files.splice(id, 1);
};
game.updateFile = function () {
    for (var i = 0; i < game.files.length; i++) {
        game.files[i].y = game.canvas.height - 40;
        if (game.files[i].HP <= 0) {
            game.deleteFile(i);
        }
    }
}
game.renderFile = function () {
    for (var i = 0; i < game.files.length; i++) {
        if (game.files[i].x < game.canvas.width) {
            if (random(0, 400) < game.hits) {
                if (game.files[i].HP == 2) {
                    game.ctx.drawImage(game.image, 0, 24, 8, 8, game.files[i].x + random(-5, 5), game.files[i].y + random(-5, 5), game.files[i].width, game.files[i].height);
                } else {
                    game.ctx.drawImage(game.image, 8, 24, 8, 8, game.files[i].x + random(-5, 5), game.files[i].y + random(-5, 5), game.files[i].width, game.files[i].height);
                }
            } else {
                if(game.files[i].HP == 2) {
                    game.ctx.drawImage(game.image, 0, 24, 8, 8, game.files[i].x, game.files[i].y, game.files[i].width, game.files[i].height);
                } else {
                    game.ctx.drawImage(game.image, 8, 24, 8, 8, game.files[i].x, game.files[i].y, game.files[i].width, game.files[i].height);
                }
            }
        }
    }
};
game.spawnFileSheild = function () {
    for (var i = 0; i < game.canvas.width * 4; i += 40) {
        game.spawnFile(i, canvas.height - 40);
    }

}