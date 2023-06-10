game.bullets = [];
game.spawnBullet = function (x, y) {
    aa.play('laser');
    var tx = pointer.x - 20 - x,
        ty = pointer.y - 20 - y,
        dist = Math.sqrt(tx * tx + ty * ty);

    var velX = (tx / dist) * (13 + game.items.fasterdefence);
    var velY = (ty / dist) * (13 + game.items.fasterdefence);

    game.bullets.push({
        x: x,
        y: y,
        width: 40,
        height: 40,
        velX: velX,
        life: 0,
        velY: velY,
        img: "blue",
        update: function () {},
        
    });
};
game.spawnSeakingBullet = function (x, y) {
    aa.play('laser');
    var randomBug = random(1, game.bugs.length - 1);
    if (game.bugs[randomBug] != undefined) {
        var tx = game.bugs[randomBug].x - 20 - x,
            ty = game.bugs[randomBug].y - 20 - y + 100,
            dist = Math.sqrt(tx * tx + ty * ty);

        var velX = (tx / dist) * (13 + game.items.fasterdefence);
        var velY = (ty / dist) * (13 + game.items.fasterdefence);

        game.bullets.push({
            x: x,
            y: y,
            width: 40,
            height: 40,
            life: 0,
            velX: velX,
            velY: velY,
            img: "blue",
            update: function () {},
        });
    }
};

game.spawnFireBullet = function (x, y) {
    game.bullets.push({
        x: x,
        y: y,
        width: 40,
        height: 40,
        life: -900,
        velX: 0,
        velY: 0,
        img: "red",
        update: function () {},
    });
};
game.spawnScanBullet = function (x, y) {
    game.bullets.push({
        x: x,
        y: y,
        width: 40,
        height: 40,
        life: -300,
        velX: 0,
        velY: -10,
        img: "blue",
        update: function () {},
    });
};

game.spawnSearchingBullet = function (x, y) {
    aa.play('laser');
    var randomBug = random(1, game.bugs.length - 1);
    if (game.bugs[randomBug] != undefined) {


        game.bullets.push({
            randomBug: randomBug,
            x: x,
            y: y,
            width: 40,
            height: 40,
            velX: 0,
            velY: 0,
            accX: 0,
            accY: 0,
            life: 0,
            img: "red",
            update: function () {
                if (typeof game.bugs[this.randomBug] == "undefined") {
                    this.randomBug = random(0, game.bugs.length - 1);
                } else {
                    var tx = game.bugs[this.randomBug].x - 20 - this.x,
                        ty = game.bugs[this.randomBug].y - 20 - this.y,
                        dist = Math.sqrt(tx * tx + ty * ty);

                    this.accX = ((tx / dist) * (13 + game.items.fasterdefence / 2)) / 7;
                    this.accY = ((ty / dist) * (13 + game.items.fasterdefence / 2)) / 7;
                    this.velX += this.accX;
                    this.velY += this.accY;
                    if (this.velX > (13 + game.items.fasterdefence / 2)) {
                        this.velX = (13 + game.items.fasterdefence / 2);
                    } else if (this.velX < -(13 + game.items.fasterdefence / 2)) {
                        this.velX = -(13 + game.items.fasterdefence / 2);
                    }

                    if (this.velY > (13 + game.items.fasterdefence / 2)) {
                        this.velY = (13 + game.items.fasterdefence / 2);
                    } else if (this.velY < -(13 + game.items.fasterdefence / 2)) {
                        this.velY = -(13 + game.items.fasterdefence / 2);
                    }
                }

            },
        });
    }
};

game.deleteBullet = function (id) {
    game.bullets[id].kill = true;
}
game.updateBullet = function () {
    for (var i = 0; i < game.bullets.length; i++) {
        game.bullets[i].life++;
        game.bullets[i].update();
        game.bullets[i].x += game.bullets[i].velX;
        game.bullets[i].y += game.bullets[i].velY;

        if (game.bullets[i].life > 120) {
            game.bullets[i].kill = true;
            game.spawnParticles(game.bullets[i].x, game.bullets[i].y, 3);
        }
        if (game.bullets[i].x > game.canvas.width + 200 || game.bullets[i].x < -200 || game.bullets[i].y > game.canvas.height + 200 || game.bullets[i].y < -200) {
            game.deleteBullet(i);
        }
        if (game.bullets[i].kill == true) {
            game.bullets.splice(i, 1);
        }
    }
};
game.renderBullet = function () {
    for (var i = 0; i < game.bullets.length; i++) {
        if (random(0, 200) <= game.hits) {
            if (game.bullets[i].img == "blue") {
                game.ctx.drawImage(game.image, 24, 0, 8, 8, game.bullets[i].x + random(-10, 10), game.bullets[i].y + random(-10, 10), game.bullets[i].width, game.bullets[i].height);
            } else if (game.bullets[i].img == "red") {
                game.ctx.drawImage(game.image, 24, 16, 8, 8, game.bullets[i].x + random(-10, 10), game.bullets[i].y + random(-10, 10), game.bullets[i].width, game.bullets[i].height);
            }

        } else {
            if (game.bullets[i].img == "blue") {
                game.ctx.drawImage(game.image, 24, 0, 8, 8, game.bullets[i].x, game.bullets[i].y, game.bullets[i].width, game.bullets[i].height);
            } else if (game.bullets[i].img == "red") {
                game.ctx.drawImage(game.image, 24, 16, 8, 8, game.bullets[i].x, game.bullets[i].y, game.bullets[i].width, game.bullets[i].height);
            }
        }


    }
    if (game.currentState == "play" || game.currentState == "start") {
        if (random(0, 400) < game.hits) {
            game.ctx.drawImage(game.image, 0, 8, 8, 8, game.canvas.width / 2 - 20 + random(-5, 5), game.canvas.height - 80 + random(-5, 5), 40, 40);
        } else {
            game.ctx.drawImage(game.image, 0, 8, 8, 8, game.canvas.width / 2 - 20, game.canvas.height - 80, 40, 40);
        }
    }

};