class Touch extends State {

  init() {


    this.bgCol = $.cols.oldpoop;

    this.h1 = this.g.mkFont('o', 7);
    this.p = this.g.mkFont('r', 5);
    this.hi = this.g.mkFont('w', 3);



  }

  update()  {
    
    super.update();

    if (this.g.input.m.click) {
      this.g.ents.push(new Circle(this.g, {
        x: this.g.input.m.x - 5, y: this.g.input.m.y - 5
      }));
    }

  }

  render()  {

    let m = this.g.input.m;
    
    super.render();
    this.g.draw.text(parseInt( m.x, 10 ), this.hi, 10, 10);
    this.g.draw.text(parseInt( m.y, 10 ), this.hi, 60, 10);
    if (m.click) {
      this.g.draw.text('X', this.hi, 10, 40);
    }

  }

}


class Circle extends Sprite {

  constructor(g, o) {
    o.vx = 0;
    o.vy = 0;
    o.gravity = 0.1,
    o.scale = 3;
    o.i = 'circle';
    o.group = 'baddie';
    super(g, o);
    this.name = 'drop';
    this.alpha = 1;
  }

  update() {

    this.alpha -= 0.1;
    if (this.alpha < 0) {
      this.kill();
    }
  }


  render() {
    this.g.ctx.globalAlpha = this.alpha;
    super.render();
    this.g.ctx.globalAlpha = 1;
  }


}
