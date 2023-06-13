class Circle extends Sprite {

  constructor(g, o) {
    o.vx = 0;
    o.vy = 0;
    o.gravity = 0.1,
    o.scale = 2;
    o.i = 'circle';
    o.group = 'fire';
    super(g, o);
    this.name = 'fire';
    this.alpha = 1;
  }

  update() {

    this.alpha -= 0.125;
    if (this.alpha < 0) {
      this.kill();
    }
  }

  doDamage(o) {
    this.kill();
  }

  receiveDamage(o) {
    this.kill();
  }


  render() {
    this.i = this.iHurt;
    this.g.ctx.globalAlpha = this.alpha;
    super.render();
    this.g.ctx.globalAlpha = 1;
  }




}

