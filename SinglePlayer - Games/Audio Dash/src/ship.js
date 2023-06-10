//------------------------------------------------------------
// Ship
//------------------------------------------------------------
let ship = kontra.sprite({
  x: kontra.canvas.width / 2 - waveWidth / 2,
  y: kontra.canvas.height / 2 - waveWidth / 2,
  width: waveWidth,
  height: waveWidth,
  gravity: 5,
  points: [],
  maxAcc: 8,
  update() {
    if (kontra.keys.pressed('space') || touchPressed || (gamepad && gamepad.buttons[0].pressed)) {
      this.ddy = -this.gravity;

      isTutorial = false;
    }
    else {
      this.ddy = this.gravity;
    }

    if (isTutorial) return;

    this.y += this.dy;
    this.dy += this.ddy;

    let maxAcc = this.maxAcc// / (1 / audio.playbackRate);
    if (Math.sqrt(this.dy * this.dy) > maxAcc) {
      this.dy = this.dy < 0 ? -maxAcc : maxAcc;
    }
  },
  render(move) {
    if (numUpdates >= 1 && !gameOverScene.active && !winScene.active) {
      this.points.push({x: this.x + move, y: this.y + 1});
    }

    neonRect(this.x, this.y, this.width, this.height, 0, 163, 220);
    neonLine(this.points, move, 0, 163, 220);
  }
});