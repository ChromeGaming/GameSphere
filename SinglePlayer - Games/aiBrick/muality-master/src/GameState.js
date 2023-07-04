function GameState() {
}

GameState.prototype.init = function() {
  var soundPath = 'res/sounds/';
  for (var soundName in SOUNDS.byName) {
    if (SOUNDS.byName.hasOwnProperty(soundName)) {
      createjs.Sound.registerSound(soundPath + soundName, soundName);
    }
  }
};

GameState.prototype.pause = function() {
};

GameState.prototype.resume = function() {
  this.elements = [
    [function() {
      mm.audioButton.toggleActivated();
    }, {x: 15, y: 0, w: 1, h: 1}]
  ];
  this.player = new Player(this);
  this.spawner = new Spawner(this);
};

GameState.prototype.render = function(ctx) {
  ctx.save();
  ctx.translate(CENTER.x * GU, CENTER.y * GU);

  ctx.restore();

  this.spawner.render();
  this.player.render();

  mm.audioButton.render();
};

GameState.prototype.update = function() {
  this.player.update();
  this.spawner.update();
};

GameState.prototype.playSound = function(soundName) {
  createjs.Sound.play(soundName);
};
