game.bugs = [];
game.spawnBug = function () {
    var setHP = 1;
    if (game.score > 5000) {
        setHP = random(1, 3)
    }
    if (game.score > 10000) {
        setHP = random(1, 4);
    }
    if (game.score > 20000) {
        setHP = random(1, 5);
    }
    game.bugs.push({
        x: random(0, game.canvas.width - 40),
        y: -40,
        width: 40,
        height: 40,
        HP: setHP,
        speed: (Math.random() * 3) + 1,
    });
};
game.updateBug = function () {
    for (var i = 0; i < game.bugs.length; i++) {
        game.bugs[i].y += 5 - (game.bugs[i].HP);
        if (random(0, 200) === 20) {

            game.bugs[i].x += random(-100, 100);
            game.bugs[i].y += random(-100, 100);
            game.spawnParticles(game.bugs[i].x, game.bugs[i].y, 2);
        }
        if (game.bugs[i].x > game.canvas.width - game.bugs[i].width) {
            game.bugs[i].x += random(-200, -100);
        }
        if (game.bugs[i].x < 0) {
            game.bugs[i].x += random(100, 200);
        }
        if (game.bugs[i].y >= game.canvas.height + 10) {
            if (game.currentState == "play") {
                game.over.init();
                game.currentState = "gameover";
                aa.play('fade');
                saveData("items", game.items);
                saveData("money", game.money);
                saveData("score", game.score);
                saveData("highScore", game.highscore);
            }

            game.deleteBug(i);
        }
    }
};
game.bugJitter = 15;
game.renderBug = function () {
    for (var i = 0; i < game.bugs.length; i++) {
        if (game.bugs[i].HP <= 1) {
            if (random(0, 40) > 0) {
                game.ctx.drawImage(game.image, 16, 0, 8, 8, game.bugs[i].x, game.bugs[i].y, game.bugs[i].width, game.bugs[i].height);
            } else {
                game.ctx.drawImage(game.image, 16, 0, 8, 8, game.bugs[i].x + random(-game.bugJitter, game.bugJitter), game.bugs[i].y + random(-game.bugJitter, game.bugJitter), game.bugs[i].width, game.bugs[i].height);
                aa.play('jitter');
            }
        } else if (game.bugs[i].HP == 2) {
            if (random(0, 40) > 0) {
                game.ctx.drawImage(game.image, 8, 32, 8, 8, game.bugs[i].x, game.bugs[i].y, game.bugs[i].width, game.bugs[i].height);
            } else {
                game.ctx.drawImage(game.image, 8, 32, 8, 8, game.bugs[i].x + random(-game.bugJitter, game.bugJitter), game.bugs[i].y + random(-game.bugJitter, game.bugJitter), game.bugs[i].width, game.bugs[i].height);
                aa.play('jitter');
            }
        } else if (game.bugs[i].HP == 3) {
            if (random(0, 40) > 0) {
                game.ctx.drawImage(game.image, 24, 24, 8, 8, game.bugs[i].x, game.bugs[i].y, game.bugs[i].width, game.bugs[i].height);
            } else {
                game.ctx.drawImage(game.image, 24, 24, 8, 8, game.bugs[i].x + random(-game.bugJitter, game.bugJitter), game.bugs[i].y + random(-game.bugJitter, game.bugJitter), game.bugs[i].width, game.bugs[i].height);
                aa.play('jitter');
            }
        } else if (game.bugs[i].HP >= 4) {
            if (random(0, 40) > 0) {
                game.ctx.drawImage(game.image, 0, 32, 8, 8, game.bugs[i].x, game.bugs[i].y, game.bugs[i].width, game.bugs[i].height);
            } else {
                game.ctx.drawImage(game.image, 0, 32, 8, 8, game.bugs[i].x + random(-game.bugJitter, game.bugJitter), game.bugs[i].y + random(-game.bugJitter, game.bugJitter), game.bugs[i].width, game.bugs[i].height);
                aa.play('jitter');
            }
        }
    }
};
game.deleteBug = function (id) {
    game.bugs.splice(id, 1);
}