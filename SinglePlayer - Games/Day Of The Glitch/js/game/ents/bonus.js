class Bonus extends Sprite {

  constructor(g, o) {
    o.group = 'bonus';
    o.vx = $.H.rnd(-40, 40);
    o.vy = -180;
    o.w = 10;
    o.w = 10;
    o.scale = 1;
    o.i = 'circle';
    o.o = 1;
    super(g, o);
    this.fader = 0;

  }

  update() {

    this.mkImg('circle');
    this.fader = Math.sin(new Date().getTime() * 0.002);

    if (this.y < 0 || this.o <= 0.1) {
      this.kill();
    }

    let dt = this.g.dt/ 1000;
    this.x += ( this.vx * dt ) + this.fader; 
    this.y += this.vy * dt; 
    this.o -= dt; 

  }


  render() {
    this.g.ctx.globalAlpha = this.o;
    this.g.ctx.drawImage(this.iHurt, this.x, this.y);
    this.g.ctx.globalAlpha = 1;
  }

}
