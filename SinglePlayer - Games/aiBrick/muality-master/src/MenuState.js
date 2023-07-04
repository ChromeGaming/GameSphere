function MenuState() {
}

MenuState.prototype.init = function() {
  this.bg_img = loadImage('res/menu.png');

  var that = this;
  this.elements = [
    [function() {
      that.startGame();
    }, {x: 13.35, y: 3.9, w: 1.9, h: 1.2, hover: function() {
    }}],
    [function() {
      mm.audioButton.toggleActivated();
    }, {x: 15, y: 0, w: 1, h: 1}]
  ];

  this.selected = 0;
};

MenuState.prototype.pause = function() {
};

MenuState.prototype.resume = function() {
};

MenuState.prototype.render = function(ctx) {
  ctx.save();
  var scaler = 16 * GU / this.bg_img.width;
  ctx.translate(CENTER.x * GU, CENTER.y * GU);
  ctx.scale(scaler, scaler);
  ctx.translate(-this.bg_img.width / 2, -this.bg_img.height / 2);
  ctx.drawImage(this.bg_img, 0, 0);
  ctx.restore();

  mm.audioButton.render(ctx);
};

MenuState.prototype.startGame = function() {
  if (mm.loaded) {
    sm.changeState('game');
    mm.changeState('game');
  } else {
    alert('The music has not finished loading yet. Try again soon')
  }

};

MenuState.prototype.update = function() {
  if (KEYS[13]) { /* key enter */
    this.startGame();
  }
};
