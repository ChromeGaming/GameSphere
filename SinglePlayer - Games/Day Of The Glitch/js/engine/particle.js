class Particle extends Sprite {

  constructor(g, o) {
    super(g, o);

    this.name = 'particle';
    this.scale = 1;
    this.group = 'na';

    this.w = 4;
    this.h = 4;

    this.lifespan = $.H.rnd(20,50);
    this.ttl = this.lifespan;
    this.alpha = 1;


    this.vx = o.vx || ( $.H.rnd(0, 300) - 300 );  
    this.vy = o.vy || ( $.H.rnd(0, 300) * -1 );  
  }


  update(step) {
    super.update(step);

    this.x += this.vx * step; 
    this.y += this.vy * step; 


    this.ttl -= 1;
    if (this.ttl < 0) {
      this.remove = true;  
    }

  }


  render() {

    let g = this.g;

    if (g.ios) {
      return;
    }


    g.draw.rect(this.x, this.y, 5, 5, $.cols[this.col]);

  }


}
