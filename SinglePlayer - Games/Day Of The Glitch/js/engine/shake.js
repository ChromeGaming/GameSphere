class Shake {

  constructor(g) {
    this.g = g;
    this.c = g.c;
    this.ttl = 0;
    this.mag = 0;
  }

  start(mag, ttl) {
    this.mag = mag;
    this.ttl = ttl;
    this.l = (window.innerWidth - this.c.style.width) / 2;
  };

  update() {

    let g = this.g,
        c = this.c,
        m = $.H.rnd(-this.mag, this.mag);


    this.ttl -= 1;

    if (this.g.ios) {
      return;
    } else if (this.ttl === 0) {
        c.style.marginLeft = this.l + 'px';
        c.style.marginTop = '0px';
    } else if (this.ttl > 0) {
      c.style.marginTop = m + 'px';
      c.style.marginLeft = (m + this.l) + 'px';
    }


  };

};

