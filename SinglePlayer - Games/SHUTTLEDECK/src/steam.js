import * as canvas from './canvas.js';

export default function Steam(x, y) {
  var ttl = Math.random() * 0.4 + 0.2;
  var size = (Math.random() + 1) * canvas.width() * 0.02;
  var vy = (Math.random() - 0.5) * canvas.height() * 0.08 * size;

  this.update = (dT) => {
    ttl -= dT;
    if (ttl < 0) {
      this.destroyed = false;
    }
    size += size * ttl * dT;
    y += vy * dT;
    vy -= vy * dT * 2.0;
    x -= (Math.random() - 0.5) * size * dT * 5;
  }
  this.render = (ctx) => {
    var w = canvas.width();
    var opacity = ttl;
    ctx.fillStyle = `rgba(255,255,255,${opacity})`;
    ctx.beginPath();
    ctx.arc(x,y,Math.max(size,1),0,6.29);
    ctx.fill();
  }
}