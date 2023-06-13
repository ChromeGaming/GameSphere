class Static {

  constructor(g, o = {}) {
    this.g = g;
    this.face = g.draw.scale(g.imgs.face, 10);
    this.faceX = g.w / 2- (this.face.width / 2);
    this.faceY = g.h / 2- (this.face.height / 2);
    this.reset();
  }
  

  update(step) {

    this.ttl -= ( step * 10 );

  }


  render() {

    let xc, x, y, ctx = this.g.ctx;


    if (this.ttl > 0) {


        for (xc = 0; xc < 500; xc += 1) {
            x = ~~(Math.random() * this.g.w);
            y = ~~(Math.random() * this.g.h);
            ctx.fillStyle = $.H.rndArray([ $.cols.ash, $.cols.black ]);
            ctx.fillRect(x, y+4, 4, 2);
        }
    } else if (this.ttl > -2) {

      ctx.globalAlpha = 0.2;
      ctx.drawImage(this.face, this.faceX, this.faceY);
      ctx.globalAlpha = 1;
      
      ctx.fillStyle = $.cols.slimegreen;
      ctx.fillRect(0, $.H.rnd(0, this.g.h), this.g.w, $.H.rnd(1,5));
    } 

  }

  reset(val = 10) {
    if (this.g.gameOver !== false) {
      this.g.audio.play('noise');
    }
    this.ttl = val;
  }


}
