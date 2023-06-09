class Explosion extends Sprite {

  constructor(g, o){

    let i;

    o.i = o.i || 'boom';
    o.white = o.white || false;

    super(g, o);

    this.name = 'explosion';
    this.group = 'na';
    this.startX = o.x;
    this.startY = o.y;
    this.magnitude = o.magnitude || 10;
    this.factor = 1;
    this.p = o.p || false;

    this.angle = 0;
    this.grow = 1;
    this.opacity = o.opacity || 1;
    this.scale = ~~(this.magnitude / 2);
    

  }


  update(step) {

    let g = this.g;

    if (this.scale >= this.magnitude) {
      this.factor *= -1;
    }

    if (this.scale <= this.magnitude) {
      this.scale += this.factor;
    }

    if (this.scale <= 1) {
      this.remove = true;
    }

    this.mkImg(this.o.i);

  }


  render() {

    let x = this.startX - (this.w /2),
        y = this.y - (this.h / 2),
        g = this.g,
        i = (this.white) ? this.iHurt : this.i;

    if (this.opacity < 1) {
      g.ctx.globalAlpha = this.opacity;
    }
    g.ctx.drawImage(i, x, y);

    if (this.opacity < 1) {
      g.ctx.globalAlpha = 1;
    }
  }


}


