function Spawner(gameState) {
  this.gameState = gameState;
  this.x = 0;  // in game units
  this.y = 0;  // in game units
  this.radius = GU;
  this.renderColor = '#FFF399';
  this.projectiles = [];
  this.lastProjectileSpawnedTime = -999;
  this.currentRotationIndex = (Math.random() * 8) | 0;
  this.particleSystem = new ParticleSystem();
}

Spawner.prototype.update = function() {
  if (mm.hasEnded) {
    return;
  }
  this.radius = GU + 0.3 * GU * mm.beat;

  if (mm.music.currentTime >= 4 * mm.timePerBeat &&
    mm.beat > 0.85 && t - this.lastProjectileSpawnedTime > 200) {
    let r = Math.random();
    if (r < 1 / 3) {
      this.currentRotationIndex++;
    } else if (r < 2 / 3) {
      this.currentRotationIndex--;
    }
    if (mm.music.currentTime >= 4 * 4 * mm.timePerBeat && Math.random() < 0.5) {
      this.currentRotationIndex += 4;
    }
    this.currentRotationIndex = this.currentRotationIndex.mod(8);

    let color = Math.random() < 0.5 ? 'blue' : 'yellow';
    let projectile = new Projectile(
      this.gameState, this.currentRotationIndex, color
    );
    this.renderColor = projectile.renderColor;
    this.projectiles.push(projectile);
    this.lastProjectileSpawnedTime = t;

    if (mm.music.currentTime > 12.5 * 4 * mm.timePerBeat) {
      // Spawn a second projectile
      let anotherProjectile = new Projectile(
        this.gameState, this.getOppositeRotationIndex(), color
      );
      this.projectiles.push(anotherProjectile);
    }
  }

  let newProjectiles = [];
  for (let i = 0; i < this.projectiles.length; i++) {
    let projectile = this.projectiles[i];
    projectile.update();
    if (projectile.state === 'travelling') {
      newProjectiles.push(projectile);
    }
  }
  this.projectiles = newProjectiles;

  this.particleSystem.update();
};

Spawner.prototype.getOppositeRotationIndex = function() {
  return (this.currentRotationIndex + 4) % 8;
};

Spawner.prototype.render = function() {
  ctx.save();
  ctx.translate(CENTER.x * GU + this.x, CENTER.y * GU + this.y);

  ctx.beginPath();
  ctx.fillStyle = this.renderColor;
  ctx.moveTo(
    this.radius * Math.cos(-Math.PI / 8),
    this.radius * Math.sin(-Math.PI / 8)
  );

  for (let i = 1; i < 8; i++) {
    ctx.lineTo(
      this.radius * Math.cos(i * Math.PI / 4 - Math.PI / 8),
      this.radius * Math.sin(i * Math.PI / 4 - Math.PI / 8)
    );
  }
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  for (let i = 0; i < this.projectiles.length; i++) {
    let projectile = this.projectiles[i];
    projectile.render();
  }

  this.particleSystem.render();
};
