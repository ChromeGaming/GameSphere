import * as gfx from './gfx.js';
import * as canvas from './canvas.js';
import bus from './bus.js';

function Poof(engine, x, y, color, size, duration) {
  var anim = 0;

  this.update = (dT) => {
    anim += dT * 1.0;
    if (anim > duration) {
      this.destroyed = true;
    }
  }
  this.render = (ctx) => {
    ctx.save();
    var s = engine.laneScale();
    ctx.translate(x, y);
    ctx.beginPath();
    var opacity = 1 - anim/duration;
    var p = 0.5 + 1.5 * (1 - Math.exp(-anim/duration*3));
    ctx.fillStyle = `rgba(${color[0]},${color[1]},${color[2]},${opacity})`;
    ctx.arc(0,0,size*s*p,0,6.29);
    ctx.fill();
    ctx.restore();
  }
}
export default Poof;