function Projectile(gameState, rotationIndex, color) {
  this.gameState = gameState;

  this.rotationIndex = rotationIndex;
  this.rotation = this.rotationIndex * Math.PI / 4;
  this.x = Math.cos(this.rotation);  // offset from center
  this.y = Math.sin(this.rotation);  // offset from center
  this.dx = 0.068 * Math.cos(this.rotation);
  this.dy = 0.068 * Math.sin(this.rotation);
  this.color = color;
  this.renderColor = this.color === 'yellow' ? '#FFF399' : '#A8DDFF';
  this.timeSpawned = t;
  this.state = 'travelling';
}

Projectile.prototype.update = function() {
  this.x += this.dx;
  this.y += this.dy;

  let timeSinceSpawned = t - this.timeSpawned;
  if (timeSinceSpawned > 5000) {
    this.state = 'removed';
  } else if (this.state === 'travelling' &&
    timeSinceSpawned >= mm.timePerBeat * 1000 &&
    timeSinceSpawned < 1.2 * mm.timePerBeat * 1000 &&
    this.rotationIndex % 4 === this.gameState.player.rotationIndex) {
    if (this.color === 'blue') {
      this.gameState.player.score++;
    } else {
      this.gameState.player.score--;
    }
    this.state = 'collided';
    const r = this.color === 'yellow' ? 255 : 168;
    const g = this.color === 'yellow' ? 243 : 221;
    const b = this.color === 'yellow' ? 153 : 255;
    this.gameState.spawner.particleSystem.explode(
      CENTER.x + this.x, CENTER.y + this.y, r, g, b, this.rotation
    );
  }
};

Projectile.prototype.render = function() {
  ctx.save();
  ctx.translate(CENTER.x * GU + this.x * GU, CENTER.y * GU + this.y * GU);
  ctx.rotate(this.rotation);
  ctx.fillStyle = this.renderColor;
  ctx.fillRect(-GU / 6, -GU / 2, GU / 3, GU);
  ctx.restore();
};
