const FPS = 30 / 1000;
var game = {};
game.tick = 0;
var random = function (min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}
console.error = function () {}

game.moneycount = 0;
game.canvas = document.getElementById("canvas");
game.fade = 1;
game.ctx = game.canvas.getContext("2d");
game.money = 0;
game.currentState = "preload";
game.highscore = 0;
game.score = 0;
game.hits = 0;
game.assets = {};
game.image = new Image();
game.image.src = "assets.png";


game.image.onload = function () {
    game.init();

};

document.addEventListener("onerror", function (e) {
    e.preventDefault();
});
game.updateSize = function () {
    if (window.innerWidth != game.canvas.width || window.innerHeight != game.canvas.height) {
        game.canvas.width = window.innerWidth;
        game.canvas.height = window.innerHeight;
        game.canvas.style.width = window.innerWidth;
        game.canvas.style.height = window.innerHeight;
        game.canvas.style.imageRendering = "pixelated";
        game.ctx.imageSmoothingEnabled = false;
        //console.log("hello");
    }
}; // Create out function rect1 and rect2 are the objects we will be colliding
function collision(rect1, rect2) {
    // check if they are overlapping
    if (typeof rect1 != "undefined" && typeof rect2 != "undefined") {
        if (rect1.x <= rect2.x + rect2.width && rect1.x + rect1.width >= rect2.x &&
            rect1.y <= rect2.y + rect2.height && rect1.y + rect1.height > rect2.y) {
            // If they are colliding, return true
            return true;
        } else {
            // If they are not colliding, return false
            return false;
        }
    } else {
        return false;
    }

};

function hoverOn(obj) {
    if (pointer.x >= obj.x && pointer.x <= obj.x + obj.width && pointer.y >= obj.y && pointer.y <= obj.y + obj.height) {
        return true;
    } else {
        return false;
    }
}
game.update = function () {

    for (var i = 0; i < game.canvas.width; i += 40) {
        if (game.tick % 10 == 0) {
            game.spawnBckParticle(i, -80);
        }

    }

    game.updateBckParticle();
    if (game.currentState == "start") {
        if (random(0, 100) <= 3) {
            game.spawnBug();

        }
        if (random(0, 50) <= 2) {
            if (random(0, 100) <= 3) {
                game.spawnBug();

            }
            game.spawnSeakingBullet(game.canvas.width / 2 - 20, game.canvas.height - 80);


        }
        game.score = 0;
    } else if (game.currentState == "play") {
        game.play.update();
    } else if (game.currentState == "preload") {
        game.preload.update();
    } else if (game.currentState == "gameover") {
        game.over.update();
    } else if (game.currentState == "store") {
        game.store.update();
    }


    game.updateBug();

    if (game.highscore < game.score) {
        game.highscore = game.score;
    }

    for (var i = 0; i < game.bugs.length; i++) {
        for (var j = 0; j < game.bullets.length; j++) {
            if (collision(game.bugs[i], game.bullets[j])) {
                game.spawnParticles(game.bugs[i].x, game.bugs[i].y, 30);


                if (game.score / 2000 < 30) {
                    if (random(0, 50) > game.score / 2000) {
                        game.deleteBug(i);
                        if (game.currentState == "play") {
                            game.score += 100;
                            if (game.moneycount > 0) {
                                game.money += 2;
                            } else {
                                game.money += 1;
                            }
                        }
                    }
                } else {
                    if (random(0, 50) > 30) {
                        game.deleteBug(i);
                        if (game.currentState == "play") {
                            game.score += 100;
                            if (game.moneycount > 0) {
                                game.money += 2;
                            } else {
                                game.money += 1;
                            }

                        }
                    }
                }

                if (game.score % 1000 == 0 && game.score > 0) {
                    game.spawnAlert("score: " + game.score, "#00ff00");
                }

                game.deleteBullet(j);
            }
        }
    }
    for (var i = 0; i < game.bugs.length; i++) {
        for (var j = 0; j < game.files.length; j++) {
            if (collision(game.bugs[i], game.files[j])) {
                game.spawnParticles(game.bugs[i].x, game.bugs[i].y, 30);
                game.spawnParticles(game.files[j].x, game.files[j].y, 30);
                game.hits++;
                game.files[j].HP--;
                game.deleteBug(i);
                game.spawnAlert("file hit", "#ff0000")

            }
        }
    }
    game.gui.update();
    game.updateBullet();
    game.updateParticle();
    game.updateFile();


};
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
        game.ctx.rect(-10, -10, game.canvas.width + 10, game.canvas.height + 10);
        game.ctx.fill();
        game.ctx.stroke();
        game.ctx.globalAlpha = 1;
        game.fade -= 0.05;
    }
};
var letters = letters = {
    'A': [
            [, 1],
            [1, , 1],
            [1, , 1],
            [1, 1, 1],
            [1, , 1]
        ],
    'B': [
            [1, 1],
            [1, , 1],
            [1, 1, 1],
            [1, , 1],
            [1, 1]
        ],
    'C': [
            [1, 1, 1],
            [1],
            [1],
            [1],
            [1, 1, 1]
        ],
    'D': [
            [1, 1],
            [1, , 1],
            [1, , 1],
            [1, , 1],
            [1, 1]
        ],
    'E': [
            [1, 1, 1],
            [1],
            [1, 1, 1],
            [1],
            [1, 1, 1]
        ],
    'F': [
            [1, 1, 1],
            [1],
            [1, 1],
            [1],
            [1]
        ],
    'G': [
            [, 1, 1],
            [1],
            [1, , 1, 1],
            [1, , , 1],
            [, 1, 1]
        ],
    'H': [
            [1, , 1],
            [1, , 1],
            [1, 1, 1],
            [1, , 1],
            [1, , 1]
        ],
    'I': [
            [1, 1, 1],
            [, 1],
            [, 1],
            [, 1],
            [1, 1, 1]
        ],
    'J': [
            [1, 1, 1],
            [, , 1],
            [, , 1],
            [1, , 1],
            [1, 1, 1]
        ],
    'K': [
            [1, , , 1],
            [1, , 1],
            [1, 1],
            [1, , 1],
            [1, , , 1]
        ],
    'L': [
            [1],
            [1],
            [1],
            [1],
            [1, 1, 1]
        ],
    'M': [
            [1, 1, 1, 1, 1],
            [1, , 1, , 1],
            [1, , 1, , 1],
            [1, , , , 1],
            [1, , , , 1]
        ],
    'N': [
            [1, , , 1],
            [1, 1, , 1],
            [1, , 1, 1],
            [1, , , 1],
            [1, , , 1]
        ],
    'O': [
            [1, 1, 1],
            [1, , 1],
            [1, , 1],
            [1, , 1],
            [1, 1, 1]
        ],
    'P': [
            [1, 1, 1],
            [1, , 1],
            [1, 1, 1],
            [1],
            [1]
        ],
    'Q': [
            [0, 1, 1],
            [1, , , 1],
            [1, , , 1],
            [1, , 1, 1],
            [1, 1, 1, 1]
        ],
    'R': [
            [1, 1],
            [1, , 1],
            [1, , 1],
            [1, 1],
            [1, , 1]
        ],
    'S': [
            [1, 1, 1],
            [1],
            [1, 1, 1],
            [, , 1],
            [1, 1, 1]
        ],
    'T': [
            [1, 1, 1],
            [, 1],
            [, 1],
            [, 1],
            [, 1]
        ],
    'U': [
            [1, , 1],
            [1, , 1],
            [1, , 1],
            [1, , 1],
            [1, 1, 1]
        ],
    'V': [
            [1, , , , 1],
            [1, , , , 1],
            [, 1, , 1],
            [, 1, , 1],
            [, , 1]
        ],
    'W': [
            [1, , , , 1],
            [1, , , , 1],
            [1, , , , 1],
            [1, , 1, , 1],
            [1, 1, 1, 1, 1]
        ],
    'X': [
            [1, , , , 1],
            [, 1, , 1],
            [, , 1],
            [, 1, , 1],
            [1, , , , 1]
        ],
    'Y': [
            [1, , 1],
            [1, , 1],
            [, 1],
            [, 1],
            [, 1]
        ],
    'Z': [
            [1, 1, 1, 1, 1],
            [, , , 1],
            [, , 1],
            [, 1],
            [1, 1, 1, 1, 1]
        ],
    '0': [
            [, 1, ],
            [1, , 1],
            [1, , 1],
            [1, , 1],
            [, 1, ]
        ],
    '1': [
            [, 1],
            [1, 1],
            [, 1],
            [, 1],
            [1, 1, 1]
        ],
    '2': [
            [, 1, 1],
            [1, , , 1],
            [, , 1],
            [, 1],
            [1, 1, 1, 1]
        ],
    '3': [
            [1, 1, 1],
            [, , , 1],
            [, 1, 1],
            [, , , 1],
            [1, 1, 1, ]
        ],
    '4': [
            [, , 1, 1],
            [, 1, , 1],
            [1, , , 1],
            [1, 1, 1, 1],
            [, , , 1]
        ],
    '5': [
            [1, 1, 1, 1],
            [1],
            [1, 1, 1, 1],
            [, , , 1],
            [1, 1, 1]
        ],
    '6': [
            [, 1, 1],
            [1],
            [1, 1, 1],
            [1, , , 1],
            [, 1, 1]
        ],
    '7': [
            [1, 1, 1, 1],
            [, , , 1],
            [, , 1],
            [, , 1],
            [, , 1]
        ],
    '8': [
            [, 1, 1],
            [1, , , 1],
            [, 1, 1],
            [1, , , 1],
            [, 1, 1]
        ],
    '9': [
            [, 1, 1],
            [1, , , 1],
            [, 1, 1, 1],
            [, , , 1],
            [, 1, 1]
        ],
    '.': [
            [, , ],
            [, , ],
            [, , ],
            [, , ],
            [, , 1]
        ],
    ' ': [
            [, , ],
            [, , ],
            [, , ],
            [, , ],
            [, , ]
        ],
    '_': [
            [, , ],
            [, , ],
            [, , ],
            [, , ],
            [1, 1, 1, 1]
        ],
    ':': [
            [, , ],
            [1, , ],
            [, , ],
            [1, , ],
            [, , ]
        ]
};

function drawText(string, X, Y, size, color) {

    var needed = [];
    string = string.toUpperCase(); // because I only did uppercase letters
    for (var i = 0; i < string.length; i++) {
        var letter = letters[string.charAt(i)];
        if (letter) { // because there's letters I didn't do
            needed.push(letter);
        }
    }

    game.ctx.fillStyle = color || "#000000";
    var currX = X;
    for (i = 0; i < needed.length; i++) {
        letter = needed[i];
        var currY = Y;
        var addX = 0;
        for (var y = 0; y < letter.length; y++) {
            var row = letter[y];
            for (var x = 0; x < row.length; x++) {
                if (row[x]) {
                    game.ctx.fillRect(currX + x * size, currY, size, size);
                }
            }
            addX = Math.max(addX, row.length * size);
            currY += size;
        }
        currX += size + addX;
    }

}
game.gui = {};
game.gui.fullscreenBTN = {
    x: 0,
    y: 0,
    width: 40,
    height: 40,
    toggled: false,
};
game.gui.update = function () {
    game.gui.fullscreenBTN.x = game.canvas.width - 20 - game.gui.fullscreenBTN.width;
    game.gui.fullscreenBTN.y = 20;
};
game.gui.render = function () {
    if (hoverOn(game.gui.fullscreenBTN) == true && game.gui.fullscreenBTN.toggled == false) {
        game.ctx.drawImage(game.image, 0, 16, 8, 8, game.gui.fullscreenBTN.x - 5, game.gui.fullscreenBTN.y - 5, game.gui.fullscreenBTN.width + 10, game.gui.fullscreenBTN.height + 10);
    } else if (hoverOn(game.gui.fullscreenBTN) == true && game.gui.fullscreenBTN.toggled == true) {
        game.ctx.drawImage(game.image, 0, 16, 8, 8, game.gui.fullscreenBTN.x + 5, game.gui.fullscreenBTN.y + 5, game.gui.fullscreenBTN.width - 10, game.gui.fullscreenBTN.height - 10);
    } else {
        game.ctx.drawImage(game.image, 0, 16, 8, 8, game.gui.fullscreenBTN.x, game.gui.fullscreenBTN.y, game.gui.fullscreenBTN.width, game.gui.fullscreenBTN.height);
    }

}
game.preload = {};
game.preload.tick = 0;
game.preload.text = "";
game.preload.placement = {
    x: 0,
    y: 0
}
game.preload.update = function () {

    if (game.preload.tick == 0) {
        game.fade = 1;
        game.preload.tick += 60;
    }
    if (game.preload.tick == 100) {
        game.preload.text += "f";
    }
    if (game.preload.tick == 105) {
        game.preload.text += "i";
    }
    if (game.preload.tick == 110) {
        game.preload.text += "r";
    }
    if (game.preload.tick == 115) {
        game.preload.text += "e";
    }
    if (game.preload.tick == 120) {
        game.preload.text += "n";
    }
    if (game.preload.tick == 125) {
        game.preload.text += "i";
    }
    if (game.preload.tick == 130) {
        game.preload.text += "b";
    }
    if (game.preload.tick == 135) {
        game.preload.text += "b";
    }
    if (game.preload.tick == 140) {
        game.preload.text += "l";
    }
    if (game.preload.tick == 145) {
        game.preload.text += "e";
    }
    if (game.preload.tick == 150) {
        game.preload.text += "r";
    }
    if (game.preload.tick == 155) {
        game.preload.text += " ";
    }
    if (game.preload.tick == 165) {
        game.preload.text += "s";
    }
    if (game.preload.tick == 170) {
        game.preload.text += "t";
    }
    if (game.preload.tick == 175) {
        game.preload.text += "u";
    }
    if (game.preload.tick == 180) {
        game.preload.text += "d";
    }
    if (game.preload.tick == 185) {
        game.preload.text += "i";
    }
    if (game.preload.tick == 190) {
        game.preload.text += "o";
    }
    if (game.preload.tick == 195) {
        game.preload.text += "s";
    }
    if (game.preload.tick == 200) {
        game.preload.text += " ";
    }
    if (game.preload.tick == 205) {
        game.preload.text += "p";
    }
    if (game.preload.tick == 210) {
        game.preload.text += "r";
    }
    if (game.preload.tick == 215) {
        game.preload.text += "e";
    }
    if (game.preload.tick == 220) {
        game.preload.text += "s";
    }
    if (game.preload.tick == 225) {
        game.preload.text += "e";
    }
    if (game.preload.tick == 230) {
        game.preload.text += "n";
    }
    if (game.preload.tick == 235) {
        game.preload.text += "t";
    }
    if (game.preload.tick == 240) {
        game.preload.text += "s";
    }
    if (game.preload.tick == 245) {
        game.preload.text += ".";
    }
    if (game.preload.tick == 250) {
        game.preload.text += ".";
    }
    if (game.preload.tick == 255) {
        game.preload.text += ".";
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
        game.preload.title = true;
    }
    if (game.preload.tick == 480) {
        game.fade = 1;
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
        if (random(0, 20) == 10) {
            game.preload.placement.x = random(0, game.canvas.width) - 200;
            game.preload.placement.y = random(0, game.canvas.height) - 20;
        }
        drawText("anti virus", game.preload.placement.x, game.preload.placement.y, 7, "#ffffff"); //game.preload.placement
        game.preload.placement.x = (game.canvas.width / 2) - ((10 * 4 * 7) / 2);
        game.preload.placement.y = (game.canvas.height / 2) - (3.5 * 3);


    }
}
game.start = {};
game.start.playBTN = {
    x: 40,
    y: 40,
    width: 32 * 4,
    height: 40,
};

game.start.controlBTN = {
    x: 40,
    y: 120,
    width: 32 * 8,
    height: 40,
};

game.start.storeBTN = {
    x: 40,
    y: 200,
    width: 32 * 5,
    height: 40,
};

game.start.render = function () {
    if (hoverOn(game.start.playBTN) == true) {
        drawText("play", game.start.playBTN.x, game.start.playBTN.y, 8, "#ffffff");
    } else {
        drawText("play", game.start.playBTN.x, game.start.playBTN.y, 8, "#00ffff");
    }

    if (hoverOn(game.start.controlBTN) == true) {
        drawText("controls", game.start.controlBTN.x, game.start.controlBTN.y, 8, "#ffffff");
    } else {
        drawText("controls", game.start.controlBTN.x, game.start.controlBTN.y, 8, "#00ffff");
    }

    if (hoverOn(game.start.storeBTN) == true) {
        drawText("store", game.start.storeBTN.x, game.start.storeBTN.y, 8, "#ffffff");
    } else {
        drawText("store", game.start.storeBTN.x, game.start.storeBTN.y, 8, "#00ffff");
    }



};
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
        for (var i = 0; i < game.canvas.width; i += 40) {
            game.spawnParticles(i, game.canvas.height - 40, 10);
        }
        game.spawnAlert("All files healed", "#ffffff");
        game.items.diskdefrag -= 1;
    } else if (hoverOn(game.play.defragBTN) == true && game.items.diskdefrag <= 0) {
        game.spawnAlert("all out", "#ff0000");
    } else if (hoverOn(game.play.moneyBTN) == true && game.items.doublemoney > 0) {
        if (game.moneycount < 0) {
            game.moneycount = 0;
        }
        game.spawnAlert("double money activated", "#ffffff");
        game.moneycount += 300;
        game.items.doublemoney -= 1;
    } else if (hoverOn(game.play.moneyBTN) == true && game.items.doublemoney <= 0) {
        game.spawnAlert("all out", "#ff0000");
    } else if (hoverOn(game.play.firewallBTN) == true && game.items.firewall > 0) {
        for (var i = -40; i < game.canvas.width; i += 20) {
            game.spawnFireBullet(i, game.canvas.height - 120);
        }
        game.spawnAlert("firewall activated", "#ffffff");
        game.items.firewall--;
    } else if (hoverOn(game.play.firewallBTN) == true && game.items.firewall <= 0) {
        game.spawnAlert("all out", "#ff0000");
    } else if (hoverOn(game.play.scannerBTN) == true && game.items.virusscanner > 0) {
        for (var i = -40; i < game.canvas.width; i += 20) {
            game.spawnScanBullet(i, game.canvas.height - 120);
        }
        game.spawnAlert("virus scanner activated", "#ffffff");
        game.items.virusscanner--;
    } else if (hoverOn(game.play.scannerBTN) == true && game.items.virusscanner <= 0) {
        game.spawnAlert("all out", "#ff0000");
    } else {
        game.spawnBullet(game.canvas.width / 2 - 20, game.canvas.height - 80);
        if (random(0, game.items.searchingcode + 10) < game.items.searchingcode) {
            game.spawnSearchingBullet(game.canvas.width / 2 - 20, game.canvas.height - 80);
        }
    }
};

game.play.init = function () {
    game.fade = 1;
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
    if (random(0, 50) <= (game.score) / 5000) {
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
        game.ctx.drawImage(game.image, 8, 8, 8, 8, game.play.antivirus[i].x, game.play.antivirus[i].y, 40, 40);
    }



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


    drawText("score: " + game.score, 40, 40, 4, "#00ffff");
    drawText("bits: " + game.money, 40, 100, 4, "#00ffff");
};
game.over = {};
game.over.timer = 0;
game.over.init = function () {
    game.currentState = "gameover";
    game.hits = 0;
    game.over.timer = 0;
    for (var i = 0; i < game.bugs.length; i++) {
        game.spawnParticles(game.bugs[i].x, game.bugs[i].y, 10);
    }
    for (var i = 0; i < game.files.length; i++) {
        game.spawnParticles(game.files[i].x, game.files[i].y, 10);
    }
    for (var i = 0; i < game.bullets.length; i++) {
        game.spawnParticles(game.bullets[i].x, game.bullets[i].y, 10);
    }
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
game.store = {};
game.store.currentSelected;
game.items = {};
game.items.antivirus = 0;
game.items.fasterdefence = 0;
game.items.searchingcode = 0;
game.items.diskdefrag = 0;
game.items.virusscanner = 0;
game.items.doublemoney = 0;
game.items.firewall = 0;

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
    price: 250,
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
        drawText(game.store.currentSelected.name, (game.canvas.width / 2) - 130, 240, 4, "#00ffff");
        drawText("bits: " + game.store.currentSelected.price, (game.canvas.width / 2) - 130, 280, 4, "#00ffff");
        drawText(game.store.currentSelected.description, (game.canvas.width / 2) - 130, 320, 2, "#00ffff");
    }
};
game.store.onclick = function () {
    if (hoverOn(game.store.antivirus)) {
        game.store.currentSelected = game.store.antivirus;
    }
    if (hoverOn(game.store.fasterbullets)) {
        game.store.currentSelected = game.store.fasterbullets;
    }
    if (hoverOn(game.store.seekingbullet)) {
        game.store.currentSelected = game.store.seekingbullet;
    }
    if (hoverOn(game.store.diskdefrag)) {
        game.store.currentSelected = game.store.diskdefrag;
    }
    if (hoverOn(game.store.virusscanner)) {
        game.store.currentSelected = game.store.virusscanner;
    }
    if (hoverOn(game.store.moremoney)) {
        game.store.currentSelected = game.store.moremoney;
    }
    if (hoverOn(game.store.firewall)) {
        game.store.currentSelected = game.store.firewall;
    }
    if (hoverOn(game.store.menu)) {
        game.currentState = "start";
    }
    if (game.store.currentSelected != undefined) {
        if (hoverOn(game.store.buy)) {
            if (game.money >= game.store.currentSelected.price) {
                game.money -= game.store.currentSelected.price;
                game.items[game.store.currentSelected.id] = game.items[game.store.currentSelected.id] || 0;
                game.items[game.store.currentSelected.id]++;
                game.spawnAlert("bought", "#00ff00");
            } else {
                game.spawnAlert("not enough money", "#ff0000");
            }
        }
    }
};
game.bugs = [];
game.spawnBug = function () {
    game.bugs.push({
        x: random(0, game.canvas.width - 40),
        y: -40,
        width: 40,
        height: 40,
        speed: (Math.random() * 3) + 1,
    });
};
game.updateBug = function () {
    for (var i = 0; i < game.bugs.length; i++) {
        game.bugs[i].y += game.bugs[i].speed;
        if (random(0, 200) === 20) {
            game.bugs[i].x += random(-100, 100);
            game.bugs[i].y += random(-100, 100);
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
            }

            game.deleteBug(i);
        }
    }
};
game.bugJitter = 15;
game.renderBug = function () {
    for (var i = 0; i < game.bugs.length; i++) {
        if (random(0, 40) > 0) {
            game.ctx.drawImage(game.image, 16, 0, 8, 8, game.bugs[i].x, game.bugs[i].y, game.bugs[i].width, game.bugs[i].height);
        } else {
            game.ctx.drawImage(game.image, 16, 0, 8, 8, game.bugs[i].x + random(-game.bugJitter, game.bugJitter), game.bugs[i].y + random(-game.bugJitter, game.bugJitter), game.bugs[i].width, game.bugs[i].height);
        }
    }
};
game.deleteBug = function (id) {
    game.bugs.splice(id, 1);
}
game.bullets = [];
game.spawnBullet = function (x, y) {

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
        life: -300,
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
            game.spawnParticles(game.bullets[i].x, game.bullets[i].y, 15);
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
        game.ctx.drawImage(game.image, 0, 8, 8, 8, game.canvas.width / 2 - 20, game.canvas.height - 80, 40, 40);
    }

};
game.particles = [];
game.spawnParticles = function (x, y, number) {
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
    var number = 40;
    game.bckParticles.push({
        x: x,
        y: y,
        size: number,
        velX: 0,
        velY: 10 - (number / 8),
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
                if (game.bckParticles[i].y > game.canvas.height + 80) {
                    game.deleteBckParticle(i);
                }
            }
        }
    }
};
game.renderBckParticle = function () {
    for (var i = 0; i < game.bckParticles.length; i++) {
        if (typeof game.bckParticles[i] != "undefined") {
            if (game.bckParticles[i].dead == false) {
                game.ctx.globalAlpha = 0.1;
                if (game.bckParticles[i].img == 0) {
                    game.ctx.drawImage(game.image, 0, 0, 8, 8, game.bckParticles[i].x, game.bckParticles[i].y, game.bckParticles[i].size, game.bckParticles[i].size);
                } else {
                    game.ctx.drawImage(game.image, 8, 0, 8, 8, game.bckParticles[i].x, game.bckParticles[i].y, game.bckParticles[i].size, game.bckParticles[i].size);
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
        drawText(game.alerts[i].text, (game.canvas.width / 2) - (game.alerts[i].length * 4 * 5) / 2, 75 - (game.alerts[i].life * 0.75), 5, game.alerts[i].color);
        if (game.alerts[i].life > 100) {
            game.deleteAlert(i);
        }
    }
};
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
        if (game.files[i].HP == 2) {
            game.ctx.drawImage(game.image, 0, 24, 8, 8, game.files[i].x, game.files[i].y, game.files[i].width, game.files[i].height);
        } else {
            game.ctx.drawImage(game.image, 8, 24, 8, 8, game.files[i].x, game.files[i].y, game.files[i].width, game.files[i].height);
        }
    }
};
game.spawnFileSheild = function () {
    for (var i = 0; i < game.canvas.width; i += 40) {
        game.spawnFile(i, canvas.height - 40);
    }

}
var pointer = {
    x: 0,
    y: 0,
};
/*
function toggleFullScreen() {
    if (!document.fullscreenElement) {
        if (game.canvas.requestFullscreen) {
            game.canvas.requestFullscreen();
        } else if (game.canvas.mozRequestFullScreen) {
            game.canvas.mozRequestFullScreen();
        } else if (game.canvas.webkitRequestFullscreen) {
            game.canvas.webkitRequestFullscreen();
        } else if (game.canvas.msRequestFullscreen) {
            game.canvas.msRequestFullscreen();
        }
    } else {
        document.webkitExitFullscreen();
        document.mozCancelFullScreen();
        document.msExitFullscreen();
        document.exitFullscreen();
    }
}*/

function toggleFullScreen() {
    var doc = window.document;
    var docEl = doc.documentElement;

    var requestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;
    var cancelFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen;

    if (!doc.fullscreenElement && !doc.mozFullScreenElement && !doc.webkitFullscreenElement && !doc.msFullscreenElement) {
        requestFullScreen.call(docEl);
    } else {
        cancelFullScreen.call(doc);
    }
}

function click(e) {
    if (game.currentState == "play") {

        game.play.onclick();
    }
    if (hoverOn(game.start.playBTN) == true && game.currentState == "start") {
        game.play.init();
        game.particles = [];
    }
    if (hoverOn(game.start.storeBTN) == true && game.currentState == "start") {
        game.store.init();
        game.fade = 1;
        game.particles = [];
        game.bugs = [];
        game.bullets = [];
    }
    if (game.currentState == "store") {
        game.store.onclick();
    }
    if (game.currentState == "gameover" && game.over.timer >= 60) {
        game.fade = 1;
        game.particles = [];
        game.currentState = "start";
    }
    if (hoverOn(game.gui.fullscreenBTN) == true && game.currentState != "preload") {
        if (game.gui.fullscreenBTN.toggled == true) {
            game.gui.fullscreenBTN.toggled = false;
            toggleFullScreen();
        } else {
            game.gui.fullscreenBTN.toggled = true;
            toggleFullScreen();
        }
    }
    pointer.x = e.pageX - game.canvas.offsetLeft;
    pointer.y = e.pageY - game.canvas.offsetTop;
    e.preventDefault();
}
document.addEventListener("mousemove", function (e) {
    pointer.x = e.pageX - game.canvas.offsetLeft;
    pointer.y = e.pageY - game.canvas.offsetTop;
    e.cancelBubble = true;
    e.returnValue = false;
    if (e.stopPropagation) e.stopPropagation();
    if (e.preventDefault) e.preventDefault();
}, false);

document.addEventListener("mousedown", click, false);

document.addEventListener("contextmenu", function (e) {
    e.cancelBubble = true;
    e.returnValue = false;
    if (e.stopPropagation) e.stopPropagation();
    if (e.preventDefault) e.preventDefault();
}, false);

document.addEventListener("drag", function (e) {
    e.cancelBubble = true;
    e.returnValue = false;
    if (e.stopPropagation) e.stopPropagation();
    if (e.preventDefault) e.preventDefault();
}, false);
var fps = 30;
var now;
var then = Date.now();
var interval = 1000 / fps;
var delta;

function draw() {

    requestAnimationFrame(draw);

    now = Date.now();
    delta = now - then;

    if (delta > interval) {
        // update time stuffs

        // Just `then = now` is not enough.
        // Lets say we set fps at 10 which means
        // each frame must take 100ms
        // Now frame executes in 16ms (60fps) so
        // the loop iterates 7 times (16*7 = 112ms) until
        // delta > interval === true
        // Eventually this lowers down the FPS as
        // 112*10 = 1120ms (NOT 1000ms).
        // So we have to get rid of that extra 12ms
        // by subtracting delta (112) % interval (100).
        // Hope that makes sense.

        then = now - (delta % interval);

        game.updateSize();

        game.update();

        game.tick++;

        if (delta >= 1000 / 15) {
            game.update();

            game.tick++;
        }

        game.ctx.globalAlpha = 0.7;
        game.ctx.fillStyle = "#1C4145"; //1C4145
        game.ctx.fillRect(0, 0, game.canvas.width, game.canvas.height);
        game.ctx.globalAlpha = 1;
        game.render();
    }
}


game.init = function () {
    draw();

};