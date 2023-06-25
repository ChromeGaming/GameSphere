const FPS = 30 / 1000;
var game = {};
game.tick = 0;
var random = function (min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function round5(x) {
    return Math.ceil(x / 5) * 5;
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
game.image.src = "https://github.com/GameSphere-MultiPlayer/GameSphere/assets/56786344/dfb04677-4162-406c-b568-6e6b3cb2fb80";


game.image.onload = function () {
    game.init();

};

document.addEventListener("onerror", function (e) {
    e.preventDefault();
});
game.items = {};
game.items.antivirus = 0;
game.items.fasterdefence = 0;
game.items.searchingcode = 0;
game.items.diskdefrag = 0;
game.items.virusscanner = 0;
game.items.doublemoney = 0;
game.items.firewall = 0;