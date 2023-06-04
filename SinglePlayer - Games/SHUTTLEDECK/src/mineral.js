import * as gfx from './gfx.js';
import bus from './bus.js';
import * as canvas from './canvas.js';

function Mineral(engine, tick, slot, type) {
  var anim = Math.random() * 100;
  this.x = 0;
  this.y = 0;
  var homing = false;
  var ht = 0;
  var value = 1;
  if (Math.random() > 0.6) {
    value = 3;
    if (Math.random() > 0.6) {
      value = 7;
    }
  }
  var mineFn = () => {
    homing = true;
    bus.emit('poof', {x: this.x, y: this.y, color: [255,130,255], size: 0.6, t: 0.3});
    bus.off('mine', mineFn);
  };
  bus.on('mine', mineFn);

  this.update = (dT) => {
    anim += dT * 1.0;
    if (homing) {
      var dx = engine.getShipX() - this.x;
      var dy = engine.getShipY() - this.y;
      var m = Math.sqrt(dx*dx+dy*dy);
      var s = canvas.width() * ht;
      ht += dT;
      this.x += dx/m*s*dT;
      this.y += dy/m*s*dT;
    } else {
      this.x = engine.laneX(tick);
      this.y = engine.laneY(slot);
    }
    if (engine.getTick() > tick + 6 && !homing) {
      this.destroyed = true;
      bus.off('mine', mineFn);
    }
    if (engine.closeToShip(this.x, this.y, 1.4)) {
      this.destroyed = true;
      bus.off('mine', mineFn);
      bus.emit('mineral', value);
    }
  }
  this.render = (ctx) => {
    var s = engine.laneScale();
    if (value == 1) {
      gfx.drawMineral(ctx, this.x, this.y, anim, s * 0.4);
    } else if (value == 3) {
      gfx.drawMineral(ctx, this.x-s/3, this.y, anim, s * 0.3);
      gfx.drawMineral(ctx, this.x+s/3, this.y-s/2, anim, s * 0.3);
      gfx.drawMineral(ctx, this.x+s/3, this.y+s/2, anim, s * 0.3);
    } else if (value == 7) {
      for (let i = 0; i < 6; i++) {
        gfx.drawMineral(ctx, this.x+Math.sin(i*1.04)*s*0.8, this.y+Math.cos(i*1.04)*s*0.8, anim, s * 0.25);
      }
      gfx.drawMineral(ctx, this.x, this.y, anim, s * 0.3);
    }
  }
}
export default Mineral;