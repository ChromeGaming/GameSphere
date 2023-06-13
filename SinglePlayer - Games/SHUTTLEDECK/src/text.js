import * as canvas from './canvas.js';

function Text(str, x, y, color = '#fff', size='1', align='left') {
  this.str = str;
  this.x = x;
  this.y = y;
  this.color = color;
  this.size = size;

  this.render = (ctx) => {
    var uiScale = canvas.width() * 0.08;
    ctx.textAlign = align;
    ctx.textBaseline = 'middle';
    ctx.fillStyle = this.color;
    ctx.font = `${this.size * uiScale}px monospace`;
    ctx.fillText(this.str, this.x(), this.y());
  }
}
export default Text;