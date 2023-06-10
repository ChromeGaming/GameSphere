game.particles = [];
game.spawnParticles = function (x, y, number) {
    if (number >= 10) aa.play('explosion');
    for (var i = 0; i < number; i++) {
        game.particles.push({
            x: x,
            y: y,
            velX: random(-3, 3),
            velY: random(-3, 3),
            life: 30,
            img: random(0, 2),
        });
    };
};
game.deleteParticle = function (id) {
    game.particles.splice(id, 1);
}
game.updateParticle = function () {
    for (var i = 0; i < game.particles.length; i++) {
        if (typeof game.particles[i] != "undefined") {
            game.particles[i].x += game.particles[i].velX;
            game.particles[i].y += game.particles[i].velY;
            game.particles[i].life--;

            if (game.particles[i].x > game.canvas.width || game.particles[i].x < -40 || game.particles[i].y > game.canvas.height || game.particles[i].y < -40) {
                game.deleteParticle(i);
            } else if (game.particles[i].life <= 0) {
                game.deleteParticle(i);
            }
        }

    }
};
game.renderParticle = function () {
    for (var i = 0; i < game.particles.length; i++) {
        for (var i = 0; i < game.particles.length; i++) {
            game.ctx.globalAlpha = game.particles[i].life / 30;
            if (game.particles[i].img == 0) {
                game.ctx.drawImage(game.image, 0, 0, 8, 8, game.particles[i].x, game.particles[i].y, 20, 20);
            } else {
                game.ctx.drawImage(game.image, 8, 0, 8, 8, game.particles[i].x, game.particles[i].y, 20, 20);
            }
            game.ctx.globalAlpha = 1;
        }
    }
};

game.bckParticles = [];
game.spawnBckParticle = function (x, y) {
    var number = 80;
    game.bckParticles.push({
        x: x,
        y: y,
        size: number,
        velX: 0,
        velY: 7,
        img: random(0, 2),
        dead: false,
    });
};

game.deleteBckParticle = function (id) {
    game.bckParticles.splice(id, 1);
}
game.updateBckParticle = function () {
    for (var i = 0; i < game.bckParticles.length; i++) {
        if (typeof game.bckParticles[i] != "undefined") {
            if (game.bckParticles[i].dead == false) {
                game.bckParticles[i].x += game.bckParticles[i].velX;
                game.bckParticles[i].y += game.bckParticles[i].velY;
                if (random(0, 200) == 10) {
                    game.bckParticles[i].img = random(0, 2);
                }
                if (game.bckParticles[i].y > game.canvas.height * 2) {
                    game.deleteBckParticle(i);
                }
            }
        }
    }
};
game.renderBckParticle = function () {
    for (var i = 0; i < game.bckParticles.length; i++) {
        if (typeof game.bckParticles[i] != "undefined") {
            if (game.bckParticles[i].x <= game.canvas.width && game.bckParticles[i].y < game.canvas.height) {
                game.ctx.globalAlpha = 0.1;
                if (random(0, 400) < game.hits) {
                    if (game.bckParticles[i].img == 0) {
                        game.ctx.drawImage(game.image, 0, 0, 8, 8, game.bckParticles[i].x + random(-5, 5), game.bckParticles[i].y + random(-5, 5), game.bckParticles[i].size, game.bckParticles[i].size);
                    } else {
                        game.ctx.drawImage(game.image, 8, 0, 8, 8, game.bckParticles[i].x + random(-5, 5), game.bckParticles[i].y + random(-5, 5), game.bckParticles[i].size, game.bckParticles[i].size);
                    }
                } else {
                    if (game.bckParticles[i].img == 0) {
                        game.ctx.drawImage(game.image, 0, 0, 8, 8, game.bckParticles[i].x, game.bckParticles[i].y, game.bckParticles[i].size, game.bckParticles[i].size);
                    } else {
                        game.ctx.drawImage(game.image, 8, 0, 8, 8, game.bckParticles[i].x, game.bckParticles[i].y, game.bckParticles[i].size, game.bckParticles[i].size);
                    }
                }
                game.ctx.globalAlpha = 1;
            }

        }
    }
};









game.alerts = [];

game.spawnAlert = function (text, color) {
    game.alerts.push({
        text: text,
        color: color,
        length: text.length,
        life: 0,
    });
}
game.deleteAlert = function (id) {
    game.alerts.splice(id, 1);
};
game.renderAlert = function () {
    for (var i = 0; i < game.alerts.length; i++) {
        game.ctx.globalAlpha = (100 - game.alerts[i].life) / 100;
        game.alerts[i].life += 2;
        drawText(game.alerts[i].text, (game.canvas.width / 2) - (game.alerts[i].length * 4 * 5) / 2, 75 - (game.alerts[i].life * 0.75), 5, game.alerts[i].color,true);
        if (game.alerts[i].life > 100) {
            game.deleteAlert(i);
        }
    }
};