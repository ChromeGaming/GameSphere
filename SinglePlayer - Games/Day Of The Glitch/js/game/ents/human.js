class Human extends Sprite {

  constructor(g, o) {

    o.group = 'human';
    o.collidesWith = 'fire';
    o.frames = 2;
    o.scale = 4;
    o.i = $.H.rndArray(['dude', 'girl']);
    o.y = o.y || 0;

    o.vy = $.H.rnd(140, 160);
    o.vx = $.H.rnd(0,300) - 150;

    o.changeDir = 0;
    o.doFlip = 1;
    o.phrase = $.H.rndArray( ['HELP', 'ARRGH', 'RUN'] );

    super(g, o); 

  }


  init() {

    this.fader = 0;
    this.f = this.g.mkFont('w', 2);

    this.anims = {
      run: { frames: [1,2], rate: 100 }
    };

    this.changeAnim('run');

  }


  update(step) {

    super.update(step);

    if (this.master && !this.master.dead) {
      if (this.x > this.g.w - this.w) {
        this.master.changeDir = 0;
      }
      this.x = this.master.x + this.offX;
      this.y = this.master.y - this.offY;
    } else {
      this.y += this.vy * step;
      this.x += this.vx * step;
      this.changeDir -= step * 10;
    }

    if (this.changeDir < 0 || this.x <= 1 || this.x >= this.g.w - (this.w)) {
      this.changeDir = $.H.rnd(5,15);
      this.vx *= -1;
      this.flip.x = this.vx > 0 ? 0 : 1;
    }

    if (this.y > this.g.h - this.h) {
      if (!this.p.gameOver) {
        this.p.score += 5;
        if (!this.g.ios) {
       this.g.ents.push(new Text(this.g, {text: 'THANKS', col: 'w', accel: 0, x: this.x, y: this.g.h, vy: 10, vx: this.x > this.g.w/2 ? -100 : 100, scale: 2})); }
        
      }
      this.g.audio.play('jump');
      super.kill();
    }

    this.fader = Math.sin(new Date().getTime() * 0.005);

  }


  render() {

    super.render();

    if (this.fader > 0) {
      this.g.draw.text(this.phrase, this.f, this.x, this.y - this.h / 2);
    }

  }



  doDamage(o) {

    if (o.alpha < 0.8 || this.dead) {
      return;
    }

    this.g.audio.play('die');

    this.g.emitter.particle(5, this.x + (this.w / 2), this.y + (this.h / 2),
        ['pigmeat', 'bloodred']);

    
    this.p.splats.push({i: 'skull', x: this.x, y: this.y});

    this.p.lives -= 1;

    super.kill();

  }


}
