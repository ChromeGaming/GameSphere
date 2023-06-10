game.store = {};
game.store.currentSelected;


game.store.antivirus = {
    x: 0,
    y: 0,
    width: 40,
    height: 40,
    name: "Anti virus",
    description: "Purchase an auto shooting antivirus.",
    price: 750,
    id: "antivirus",
    update: function () {
        this.x = (game.canvas.width / 2) - 80;
        this.y = 120;
    },
};
game.store.fasterbullets = {
    x: 0,
    y: 0,
    width: 40,
    height: 40,
    name: "faster defence",
    description: "upgrades bullet speed.",
    price: 250,
    id: "fasterdefence",
    update: function () {
        this.x = (game.canvas.width / 2) - 20;
        this.y = 120;
    },
};
game.store.seekingbullet = {
    x: 0,
    y: 0,
    width: 40,
    height: 40,
    name: "searching code",
    description: "shoot seeking code.",
    price: 500,
    id: "searchingcode",
    update: function () {
        this.x = (game.canvas.width / 2) + 40;
        this.y = 120;
    },
};

game.store.diskdefrag = {
    x: 0,
    y: 0,
    width: 40,
    height: 40,
    name: "disk defrag",
    description: "use to fix your hard drive.",
    price: 50,
    id: "diskdefrag",
    update: function () {
        this.x = (game.canvas.width / 2) - 110;
        this.y = 180;
    },
};
game.store.virusscanner = {
    x: 0,
    y: 0,
    width: 40,
    height: 40,
    name: "virus scanner",
    description: "finds and destroys all viruses.",
    price: 60,
    id: "virusscanner",
    update: function () {
        this.x = (game.canvas.width / 2) - 50;
        this.y = 180;
    },
};
game.store.moremoney = {
    x: 0,
    y: 0,
    width: 40,
    height: 40,
    name: "double money",
    description: "earn 2x more bits for ten seconds.",
    price: 50,
    id: "doublemoney",
    update: function () {
        this.x = (game.canvas.width / 2) + 10;
        this.y = 180;
    },
};
game.store.firewall = {
    x: 0,
    y: 0,
    width: 40,
    height: 40,
    name: "firewall",
    description: "extra layer of protection.",
    id: "firewall",
    price: 125,
    update: function () {
        this.x = (game.canvas.width / 2) + 70;
        this.y = 180;
    },
};
game.store.buy = {
    x: 0,
    y: 0,
    width: 4 * 3 * 5,
    height: 4 * 5,
    update: function () {
        if (game.store.currentSelected != undefined) {
            if (game.canvas.width < 600 || game.canvas.height < 600) {
                this.x = game.canvas.width - this.width - 20;
                this.y = game.canvas.height - this.height - 20;
            } else {
                this.x = (game.canvas.width / 2) + 80;
                this.y = 360;
            };

        } else {
            this.x = -1000;
            this.y = -1000;
        }
    },
};

game.store.menu = {
    x: 0,
    y: 0,
    width: 4 * 5 * 5,
    height: 4 * 5,
    update: function () {
        if (game.canvas.width < 600 || game.canvas.height < 600) {
            this.x = 20;
            this.y = game.canvas.height - this.height - 20;
        } else {
            this.x = (game.canvas.width / 2 - 140);
            this.y = 360;
        }


    },
};

game.store.init = function () {
    game.currentState = "store";
    saveData("items", game.items);
    saveData("money", game.money);
    saveData("score", game.score);
    saveData("highScore", game.highscore);
};
game.store.update = function () {

    game.store.antivirus.update();
    game.store.fasterbullets.update();
    game.store.seekingbullet.update();
    game.store.diskdefrag.update();
    game.store.virusscanner.update();
    game.store.moremoney.update();
    game.store.firewall.update();
    game.store.buy.update();
    game.store.menu.update();
};
game.store.render = function () {
    drawText("store", (game.canvas.width / 2) - (5 * 5 * 4) / 2, 20, 4, "#00ffff");
    drawText("bits: " + game.money, 20, 60, 4, "#00ffff");

    if (hoverOn(game.store.menu) == true) {
        drawText("menu", game.store.menu.x, game.store.menu.y, 5, "#ffffff");
    } else {
        drawText("menu", game.store.menu.x, game.store.menu.y, 5, "#00ffff");
    }

    if (hoverOn(game.store.buy) == true) {
        drawText("buy", game.store.buy.x, game.store.buy.y, 5, "#ffffff");
    } else {
        drawText("buy", game.store.buy.x, game.store.buy.y, 5, "#00ffff");
    }


    game.ctx.drawImage(game.image, 8, 8, 8, 8, game.store.antivirus.x, game.store.antivirus.y, 40, 40);
    drawText(game.items[game.store.antivirus.id] + "", game.store.antivirus.x, game.store.antivirus.y, 5, "#ffffff");

    game.ctx.drawImage(game.image, 16, 24, 8, 8, game.store.fasterbullets.x, game.store.fasterbullets.y, 40, 40);
    drawText(game.items[game.store.fasterbullets.id] + "", game.store.fasterbullets.x, game.store.fasterbullets.y, 5, "#ffffff");

    game.ctx.drawImage(game.image, 24, 16, 8, 8, game.store.seekingbullet.x, game.store.seekingbullet.y, 40, 40);
    drawText(game.items[game.store.seekingbullet.id] + "", game.store.seekingbullet.x, game.store.seekingbullet.y, 5, "#ffffff");

    game.ctx.drawImage(game.image, 24, 8, 8, 8, game.store.diskdefrag.x, game.store.diskdefrag.y, 40, 40);
    drawText(game.items[game.store.diskdefrag.id] + "", game.store.diskdefrag.x, game.store.diskdefrag.y, 5, "#ffffff");

    game.ctx.drawImage(game.image, 16, 8, 8, 8, game.store.virusscanner.x, game.store.virusscanner.y, 40, 40);
    drawText(game.items[game.store.virusscanner.id] + "", game.store.virusscanner.x, game.store.virusscanner.y, 5, "#ffffff");

    game.ctx.drawImage(game.image, 16, 16, 8, 8, game.store.moremoney.x, game.store.moremoney.y, 40, 40);
    drawText(game.items[game.store.moremoney.id] + "", game.store.moremoney.x, game.store.moremoney.y, 5, "#ffffff");

    game.ctx.drawImage(game.image, 8, 16, 8, 8, game.store.firewall.x, game.store.firewall.y, 40, 40);
    drawText(game.items[game.store.firewall.id] + "", game.store.firewall.x, game.store.firewall.y, 5, "#ffffff");


    if (game.store.currentSelected != undefined) {
        drawText(game.store.currentSelected.name, (game.canvas.width / 2) - 150, 240, 5, "#00ffff");
        drawText("bits: " + game.store.currentSelected.price, (game.canvas.width / 2) - 150, 280, 5, "#00ffff");
        drawText(game.store.currentSelected.description, (game.canvas.width / 2) - 150, 320, 2.5, "#00ffff");
    }
};
game.store.onclick = function () {
    if (hoverOn(game.store.antivirus)) {
        game.store.currentSelected = game.store.antivirus;
        aa.play('jitter');
    }
    if (hoverOn(game.store.fasterbullets)) {
        game.store.currentSelected = game.store.fasterbullets;
        aa.play('jitter');
    }
    if (hoverOn(game.store.seekingbullet)) {
        game.store.currentSelected = game.store.seekingbullet;
        aa.play('jitter');
    }
    if (hoverOn(game.store.diskdefrag)) {
        game.store.currentSelected = game.store.diskdefrag;
        aa.play('jitter');
    }
    if (hoverOn(game.store.virusscanner)) {
        game.store.currentSelected = game.store.virusscanner;
        aa.play('jitter');
    }
    if (hoverOn(game.store.moremoney)) {
        game.store.currentSelected = game.store.moremoney;
        aa.play('jitter');
    }
    if (hoverOn(game.store.firewall)) {
        game.store.currentSelected = game.store.firewall;
        aa.play('jitter');
    }
    if (hoverOn(game.store.menu)) {
        game.currentState = "start";
        aa.play('fade');
        game.fade = 1; //noclick
        saveData("items", game.items);
        saveData("money", game.money);
        saveData("score", game.score);
        saveData("highScore", game.highscore);
    }
    if (game.store.currentSelected != undefined) {
        if (hoverOn(game.store.buy)) {
            if (game.money >= game.store.currentSelected.price) {
                game.money -= game.store.currentSelected.price;
                game.items[game.store.currentSelected.id] = game.items[game.store.currentSelected.id] || 0;
                game.items[game.store.currentSelected.id]++;
                game.spawnAlert("bought", "#00ff00");
                aa.play('powerup');
            } else {
                game.spawnAlert("not enough money", "#ff0000");
                aa.play('noclick');
            }
        }
    }
};