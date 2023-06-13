import * as gfx from './gfx.js';
function PlayedCard(x, y, card, cs) {
  var anim = 0;

  this.update = (dT) => {
    y -= 500 * (0.5 - anim) * dT;
    cs += cs * 3.0 * (0.5 - anim) * dT;
    anim += dT * 1.2;
    if (anim > 0.5) {
      this.destroyed = true;
    }
  }
  this.render = (ctx) => {
    gfx.drawCard(ctx, x, y, cs, card, false, (0.5 - anim) * 2);
  }
}
export default PlayedCard;