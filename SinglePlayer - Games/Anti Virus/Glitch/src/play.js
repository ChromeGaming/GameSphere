game.play = {};


game.play.antivirus = [];

game.play.spawnAntivirus = function () {
    game.play.antivirus.push({
        x: random(10, game.canvas.width - 60),
        y: random((game.canvas.height / 2), game.canvas.height - 60),
        width: 40,
        height: 40,
        update: function () {
            if (random(0, 60) == 10) {
                game.spawnSearchingBullet(this.x, this.y);
            }
        },
    });
};

game.play.defragBTN = {
    x: 20,
    y: 160,
    width: 40,
    height: 40,
};
game.play.moneyBTN = {
    x: 20,
    y: 220,
    width: 40,
    height: 40,
};
game.play.firewallBTN = {
    x: game.canvas.width - 20,
    y: 160,
    width: 40,
    height: 40,
};
game.play.scannerBTN = {
    x: game.canvas.width - 20,
    y: 220,
    width: 40,
    height: 40,
};

game.play.onclick = function () {
    if (hoverOn(game.play.defragBTN) == true && game.items.diskdefrag > 0) {
        game.files = [];
        game.spawnFileSheild();
        game.hits = 0;
        for (var i = 0; i < game.canvas.width; i += 40) {
            game.spawnParticles(i, game.canvas.height - 40, 10);
        }
        game.spawnAlert("All files healed", "#ffffff");
        aa.play('powerup');
        game.items.diskdefrag -= 1;
    } else if (hoverOn(game.play.defragBTN) == true && game.items.diskdefrag <= 0) {
        aa.play('noclick');
        game.spawnAlert("all out", "#ff0000");
    } else if (hoverOn(game.play.moneyBTN) == true && game.items.doublemoney > 0) {
        if (game.moneycount < 0) {
            game.moneycount = 0;
        }
        game.spawnAlert("double money activated", "#ffffff");
        aa.play('powerup');
        game.moneycount += 300;
        game.items.doublemoney -= 1;
    } else if (hoverOn(game.play.moneyBTN) == true && game.items.doublemoney <= 0) {
        game.spawnAlert("all out", "#ff0000");
        aa.play('noclick');
    } else if (hoverOn(game.play.firewallBTN) == true && game.items.firewall > 0) {
        for (var j = 0; j < 4; j++) {
            for (var i = -40; i < game.canvas.width; i += 20) {
                game.spawnFireBullet(i, game.canvas.height - 120);
            }
        }

        game.spawnAlert("firewall activated", "#ffffff");
        aa.play('powerup');
        game.items.firewall--;
    } else if (hoverOn(game.play.firewallBTN) == true && game.items.firewall <= 0) {
        game.spawnAlert("all out", "#ff0000");
        aa.play('noclick');
    } else if (hoverOn(game.play.scannerBTN) == true && game.items.virusscanner > 0) {
        for (var i = -40; i < game.canvas.width; i += 20) {
            game.spawnScanBullet(i, game.canvas.height - 120);
        }
        game.spawnAlert("virus scanner activated", "#ffffff");
        aa.play('powerup');
        game.items.virusscanner--;
    } else if (hoverOn(game.play.scannerBTN) == true && game.items.virusscanner <= 0) {
        game.spawnAlert("all out", "#ff0000");
        aa.play('noclick');
    } else {
        game.spawnBullet(game.canvas.width / 2 - 20, game.canvas.height - 80);
        if (random(0, game.items.searchingcode + 10) < game.items.searchingcode) {
            game.spawnSearchingBullet(game.canvas.width / 2 - 20, game.canvas.height - 80);
        }
    }
};

game.play.init = function () {
    saveData("items", game.items);
    saveData("money", game.money);
    saveData("score", game.score);
    saveData("highScore", game.highscore);
    game.fade = 1;
    game.play.antivirus = [];
    game.currentState = "play";
    game.spawnFileSheild();
    game.bugs = [];
    game.bullets = [];
    game.score = 0;
    for (var i = 0; i < game.items.antivirus; i++) {
        game.play.spawnAntivirus();
    }
};
game.play.update = function () {
    game.moneycount--;
    if (random(0, 50) <= (game.score + (game.highscore / 5)) / 5000) {
        game.spawnBug();

    }
    for (var i = 0; i < game.play.antivirus.length; i++) {
        game.play.antivirus[i].update();
    }
    game.play.scannerBTN.x = game.canvas.width - 60;
    game.play.firewallBTN.x = game.canvas.width - 60;
};

game.play.render = function () {


    for (var i = 0; i < game.play.antivirus.length; i++) {
        if (random(0, 400) < game.hits) {
            game.ctx.drawImage(game.image, 8, 8, 8, 8, game.play.antivirus[i].x + random(-5, 5), game.play.antivirus[i].y + random(-5, 5), 40, 40);
        } else {
            game.ctx.drawImage(game.image, 8, 8, 8, 8, game.play.antivirus[i].x, game.play.antivirus[i].y, 40, 40);
        }
    }



    if (random(0, 200) < game.hits) {
        game.ctx.drawImage(game.image, 24, 8, 8, 8, game.play.defragBTN.x + random(-5, 5), game.play.defragBTN.y + random(-5, 5), game.play.defragBTN.width, game.play.defragBTN.height);
        drawText(game.items.diskdefrag + "", game.play.defragBTN.x + 5 + random(-5, 5), game.play.defragBTN.y + 5 + random(-5, 5), 5, "#ffffff");
        game.ctx.drawImage(game.image, 16, 16, 8, 8, game.play.moneyBTN.x + random(-5, 5), game.play.moneyBTN.y + random(-5, 5), game.play.moneyBTN.width, game.play.moneyBTN.height);
        drawText(game.items.doublemoney + "", game.play.moneyBTN.x + 5 + random(-5, 5), game.play.moneyBTN.y + random(-5, 5) + 5, 5, "#ffffff");
        game.ctx.drawImage(game.image, 8, 16, 8, 8, game.play.firewallBTN.x + random(-5, 5), game.play.firewallBTN.y + random(-5, 5), game.play.firewallBTN.width, game.play.firewallBTN.height);
        drawText(game.items.firewall + "", game.play.firewallBTN.x + 5 + random(-5, 5), game.play.firewallBTN.y + 5 + random(-5, 5), 5, "#ffffff");
        game.ctx.drawImage(game.image, 16, 8, 8, 8, game.play.scannerBTN.x + random(-5, 5), game.play.scannerBTN.y + random(-5, 5), game.play.scannerBTN.width, game.play.scannerBTN.height);
        drawText(game.items.virusscanner + "", game.play.scannerBTN.x + 5 + random(-5, 5), game.play.scannerBTN.y + 5 + random(-5, 5), 5, "#ffffff");
        if (game.moneycount > 0) {
            drawText("2x " + Math.floor(game.moneycount / 30), (game.canvas.width / 2) - (5 * 4 * 5) + random(-5, 5), 80 + random(-5, 5), 5, "#00ff00");
        }
    } else {
        game.ctx.drawImage(game.image, 24, 8, 8, 8, game.play.defragBTN.x, game.play.defragBTN.y, game.play.defragBTN.width, game.play.defragBTN.height);
        drawText(game.items.diskdefrag + "", game.play.defragBTN.x + 5, game.play.defragBTN.y + 5, 5, "#ffffff");
        game.ctx.drawImage(game.image, 16, 16, 8, 8, game.play.moneyBTN.x, game.play.moneyBTN.y, game.play.moneyBTN.width, game.play.moneyBTN.height);
        drawText(game.items.doublemoney + "", game.play.moneyBTN.x + 5, game.play.moneyBTN.y + 5, 5, "#ffffff");
        game.ctx.drawImage(game.image, 8, 16, 8, 8, game.play.firewallBTN.x, game.play.firewallBTN.y, game.play.firewallBTN.width, game.play.firewallBTN.height);
        drawText(game.items.firewall + "", game.play.firewallBTN.x + 5, game.play.firewallBTN.y + 5, 5, "#ffffff");
        game.ctx.drawImage(game.image, 16, 8, 8, 8, game.play.scannerBTN.x, game.play.scannerBTN.y, game.play.scannerBTN.width, game.play.scannerBTN.height);
        drawText(game.items.virusscanner + "", game.play.scannerBTN.x + 5, game.play.scannerBTN.y + 5, 5, "#ffffff");
        if (game.moneycount > 0) {
            drawText("2x " + Math.floor(game.moneycount / 30), (game.canvas.width / 2) - (5 * 4 * 5), 80, 5, "#00ff00");
        }
    }


    if (random(0, 200) < game.hits) {
        drawText("score: " + game.score, 40 + random(-5, 5), 40 + random(-5, 5), 5, "#00ffff");
        drawText("bits: " + game.money, 40 + random(-5, 5), 100 + random(-5, 5), 5, "#00ffff");
    } else {
        drawText("score: " + game.score, 40, 40, 5, "#00ffff");
        drawText("bits: " + game.money, 40, 100, 5, "#00ffff");
    }

};