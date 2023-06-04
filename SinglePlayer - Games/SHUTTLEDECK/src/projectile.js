import * as gfx from './gfx.js';
import * as canvas from './canvas.js';
import bus from './bus.js';
import * as gameobjects from './gameobjects.js';

function Projectile(engine, x, y, targetLane, projectileType) {
  var anim = 0;
  this.x = x;
  this.y = y;
  var trail = [];

  this.update = (dT) => {
    anim += dT * 1.0;
    // Nuke
    if (projectileType == 5) {
      this.x += dT * canvas.width() * (1 - anim/0.35);
      if (anim > 0.35) {
        // Destroy all obstacles
        gameobjects.get().forEach((g) => {
          if (g.obstacle) {
            g.destroyed = true;
            bus.emit('poof', {x: g.x, y: g.y, color: [255,50,50], size: 1, t: 0.5});
          }
        });
        // A bunch of poof
        var w = canvas.width(), h = canvas.height(), n = Math.sqrt(w*h)/20;
        for (let i = 0; i < n; i++) {
          bus.emit('poof', {x: Math.random()*w, y: Math.random()*h, color: [255,244,50], size: Math.random()*1+1, t: Math.random()*0.4+0.4});
        }
        // For audio cue...
        bus.emit('boom');
        this.destroyed = true;
      }
    }
    // Forward-moving projectiles
    else if (projectileType != 2) {
      if (projectileType != 4) {
        this.x += dT * canvas.width() / 2;
      } else {
        // crazy rockets homing
        var angle = Math.sin(Date.now()/30)*0.4;
        if (this.homing && !this.homing.destroyed) {
          angle += Math.atan2(this.homing.y-this.y, this.homing.x-this.x);
        }
        this.y += dT * canvas.width()*0.8 * Math.sin(angle);
        this.x += dT * canvas.width()*0.8 * Math.cos(angle);
      }
      if (anim > 4) {
        this.destroyed = true;
      }
      if (engine.collideTargets(this.x, this.y, 1.5)) {
        this.destroyed = true;
        // Audio cue...
        bus.emit('boom');
        if (projectileType == 1) {
          bus.emit('poof', {x: this.x, y: this.y, color: [255,200,100], size: 1, t: 0.5});
        }
        if (projectileType == 3) {
          bus.emit('poof', {x: this.x, y: this.y, color: [100,255,100], size: 1, t: 0.5});
        }
        if (projectileType == 4) {
          bus.emit('poof', {x: this.x, y: this.y, color: [255,200,140], size: 0.6, t: 0.5});
        }
      }
    }
    // Laser beam
    else {
      var s = engine.laneScale();
      var ly = engine.getShipY();
      var lx = engine.getShipX();
      gameobjects.get().forEach((g) => {
        if (g.obstacle) {
          var dy = ly - g.y;
          if (dy * dy < s * s && g.x>lx && !g.destroyed) {
            g.destroyed = true;
            bus.emit('poof', {x: g.x, y: ly, color: [50,130,255], size: 0.7, t: 0.5});
          }
        }
      });
      if (anim > 1) {
        this.destroyed = true;
      }
    }
  }
  this.render = (ctx) => {
    ctx.save();
    var s = engine.laneScale();

    // KEPLER MISSILE
    if (projectileType == 1) {
      ctx.fillStyle='#fff';
      ctx.translate(this.x, this.y);
      ctx.fillRect(-s*0.2,-s*0.2,s*1.2,s*0.4);
      ctx.fillRect(-s*0.4,-s*0.35,s*0.4,s*0.2);
      ctx.fillRect(-s*0.4,s*0.15,s*0.4,s*0.2);
      ctx.fillStyle='#fa3';
      // Flicker flame
      if (Math.sin(Date.now() / 14) > 0) {
        ctx.fillRect(-s*0.3,-s*0.05,-s*0.8,s*0.1);
      }
    }

    // SIGMA CANNON
    if (projectileType == 2) {
      ctx.translate(engine.getShipX(), engine.getShipY());
      ctx.fillStyle='#338';
      ctx.fillRect(s*0.8,-s*0.3,s*0.6,s*0.6);
      ctx.fillRect(s*0.9,-s*0.2,canvas.width(),s*0.4);
      ctx.fillStyle='#3af';
      if (Math.sin(Date.now() / 14) > 0) {
        ctx.fillRect(s,-s*0.1,canvas.width(),s*0.2);
        ctx.fillRect(s*0.9,-s*0.2,s*0.4,s*0.4);
      }
    }

    // PULSE BREAKER
    if (projectileType == 3) {
      ctx.fillStyle='#383';
      ctx.translate(this.x, this.y);
      ctx.beginPath();
      ctx.arc(0, 0, s*0.6, 0, 6.29);
      ctx.fill();
      // Flicker flame
      if (Math.sin(Date.now() / 14) > 0) {
        ctx.fillStyle='#8f8';
        ctx.beginPath();
        ctx.arc(0, 0, s*0.4, 0, 6.29);
        ctx.fill();
      }
    }

      // CRAZY ROCKETS
    if (projectileType == 4) {
      ctx.fillStyle='#fa4';
      ctx.beginPath();
      ctx.arc(this.x, this.y, s*0.3, 0, 6.29);
      ctx.fill();
      trail.unshift({x: this.x, y: this.y});
      if (trail.length > 14) { trail.pop(); }
      ctx.lineWidth = s * 0.1;
      ctx.strokeStyle='#fa4';
      ctx.beginPath();
      ctx.moveTo(this.x, this.y);
      for (let i = 0; i < trail.length; i++) {
        ctx.lineTo(trail[i].x, trail[i].y);
      }
      ctx.stroke();
    }

    // TACTICAL NUKE
    if (projectileType == 5) {
      ctx.fillStyle='#ff0';
      ctx.translate(this.x,this.y);
      ctx.beginPath();
      ctx.arc(0, 0, s*0.4, 0, 6.29);
      ctx.fill();
      ctx.fillStyle='#333';
      ctx.fillRect(-s*0.2, -s*0.2, s*0.4, s*0.4);
    }

    ctx.restore();
  }
}
export default Projectile;