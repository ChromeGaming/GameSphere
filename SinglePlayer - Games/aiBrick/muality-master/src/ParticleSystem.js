function ParticleSystem() {
  this.numParticles = 0;
  this.particles = [];
  for (let i = 0; i < 512; i++) {
    this.particles[i] = {x: 0, y: 0, dx: 0, dy: 0, t: 0, rotation: 0};
  }
}


ParticleSystem.prototype.update = function() {
  for (let i = 0; i < this.numParticles; i++) {
    let p = this.particles[i];
    if (p.t <= 0) {
      this.numParticles--;
      let q = this.particles[this.numParticles];
      p.x = q.x;
      p.y = q.y;
      p.dx = q.dx;
      p.dy = q.dy;
      p.t = q.t;
      p.r = q.r;
      p.g = q.g;
      p.b = q.b;
      p.rotation = q.rotation;
    } else {
      p.x += p.dx;
      p.y += p.dy;
      p.dx *= 0.95;
      p.dy *= 0.95;
      p.t--;
    }
  }
};

ParticleSystem.prototype.render = function() {
  ctx.save();
  for (let i = 0; i < this.numParticles; i++) {
    ctx.save();
    let p = this.particles[i];
    ctx.translate(p.x * GU, p.y * GU);
    ctx.rotate(p.rotation);
    ctx.fillStyle = 'rgba(' + p.r + ',' + p.g + ',' + p.b + ',' + Math.min(1, p.t / 20) + ')';
    ctx.fillRect(0, 0, GU * 0.1, GU * 0.1);
    ctx.restore();
  }
  ctx.restore();
};


ParticleSystem.prototype.explode = function(x, y, r, g, b, rotation) {
  for (let i = 0; i < 80; i++) {
    if (this.numParticles >= 511) return;
    this.numParticles++;
    let p = this.particles[this.numParticles];
    let direction = Math.random() * Math.PI * 2;
    let magnitude = Math.random() * 0.025;
    p.r = r;
    p.g = g;
    p.b = b;
    p.rotation = rotation;
    const rotatedPoint = rotate(
      x, y, x - 1 / 6 + 1 / 3 * Math.random(), y - 1 / 2 + Math.random(), -rotation
    );
    p.x = rotatedPoint.x;
    p.y = rotatedPoint.y;
    p.dx = Math.sin(direction) * magnitude;
    p.dy = Math.cos(direction) * magnitude;
    p.t = 20;
  }
};
