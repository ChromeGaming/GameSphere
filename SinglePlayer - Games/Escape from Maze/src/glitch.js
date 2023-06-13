class Glitch {

  constructor(max) {
    this.x = Util.rand(1, max) * 40;
    this.y = Util.rand(1, max) * 40;
    this.r = 0;//radius
    this.g = 0.2;
    this.isDead=false;
    this.isHit = false;
  }

  update(p) {
    if(Util.rand(1, 100)%10){this.r = Util.rand(1, 40);this.flip=Util.rand(1, 10)};
 
    if ((!this.isHit) && (p.x < this.x + cell &&  p.x + cell > this.x &&  p.y < this.y + cell && cell + p.y > this.y)) {
        this._gen();
         Snd.glitch();
        let gi = setInterval(() => {
             setTimeout(() => { this._gen() }, Util.rand(250, 1000));
        }, 500);

        setTimeout(() => { 
          clearInterval(gi);
          this.isDead = true;
        }, 2000);

        this.isHit = true;
    }    
}
  

  _gen() {
    this.lines = [];

    let h = this.h;
    let w = this.w;
    let ln = Util.rand(1, 13);

    for (let i = 0; i < ln; i++) {

      let xv = Math.random() * w;
      let ln = {
        x: xv,
        y: Math.random() * h,
        spliceWidth: w - xv,
        spliceHeight: Util.rand(5, h / 3)
      }

      this.lines.push(ln);
    }
  }

  render(c) {

    this.w = c.canvas.width;
    this.h = c.canvas.height;

    if(this.isDead)
      return;

    c.save();
    c.translate(this.x, this.y);

    if(this.flip%2==0){c.moveTo(0, this.r);c.lineTo(40, this.r);}else{c.moveTo(this.r, 0);c.lineTo(this.r, 40);}

    c.strokeStyle = "#6f6";
    c.stroke();
    c.restore();
  
      if (this.isHit && this.lines) {
        this.lines.forEach(function (ln) {
          c.globalAlpha = 0.7;
          c.drawImage(c.canvas, 0, ln.y, ln.spliceWidth, ln.spliceHeight, ln.x, ln.y, ln.spliceWidth, ln.spliceHeight);
          c.drawImage(c.canvas, ln.spliceWidth, ln.y, ln.x, ln.spliceHeight, 0, ln.y, ln.x, ln.spliceHeight);
        });
      }
    }
  }
 