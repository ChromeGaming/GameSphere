class Robo extends Sprite {
  constructor(g, o) {

    o.group = 'baddie';
    o.collidesWith = 'fire';
    o.frames = 1;
    o.scale = 3;
    o.i = o.i || $.H.rndArray(['robo', 'mono', 'stomper', 'drone']);
    o.x = o.x || $.H.rnd(30, g.w - 30);
    o.y = o.y || 0;
    o.restrict = false;

    switch (o.i) {

    
      case 'robo':
        o.vy = $.H.rnd(110, 130);
        o.vx = $.H.rnd(0,300) - 150;
      break;

      case 'mono':
        o.vy = 200;
        o.vx = 0;
      break;

      case 'drone':
        o.vy = 270;
        o.vx = 0;
        o.shadow = g.draw.scale(g.imgs.shadow, o.scale);
      break;

      case 'stomper':
      default:
        o.vy = 180;
        o.vx = 0;
        o.canChangeDir = false;
      break;
    }

    o.changeDir = 1;
    o.doFlip = 1;

    super(g, o); 

  }



  doDamage(o) {

    if (o.alpha < 0.8 || this.dead) {
      return;
    }

    this.p.score += this.scale;
    this.remove = true;
    this.g.audio.play('explode');
    this.g.ents.push(new Explosion(this.g, {x: this.x + ( this.w / 2 ), y: this.y + (this.h / 2)}));

    this.p.splats.push({i: 'mark', x: this.x, y: this.y});

    this.g.shake.start(10, 10);
    this.g.emitter.particle(13, this.x + (this.w / 2), this.y + (this.h / 2),
        ['blaze', 'zornskin']);
    this.p.combo += 1;
    this.p.flash = $.cols.blaze;

    super.kill();
  }


  update(step) {

    super.update(step);
    this.y += this.vy * step;
    this.x += this.vx * step;
    if (this.canChangeDir) {
      this.changeDir -= step * 10;
    }

    this.doFlip -= step * 10;

    if (this.doFlip < 0) {
      this.doFlip = 1;
      this.flip.x = (this.flip.x === 1) ? 0 : 1;
    }

    if (this.changeDir < 0 || this.x <= 1 || this.x >= this.g.w - (this.w)) {
      this.changeDir = $.H.rnd(2,7);
      this.vx *= -1;
    }

    if (this.i == 'drone') {
      this.vx += 50;
    }

    if (this.y > this.g.h - this.h) {

      if (!this.p.gameOver) {
          this.g.ents.push(new Explosion(this.g, {x: this.x, 
            y: this.y,
            p: this,
            vy: 100,
            magnitude: 18, white: true}));

        this.g.shake.start(30, 20);

        this.g.emitter.particle(20, this.x, this.y,
            ['blind']);
        this.g.audio.play('explode');
        this.p.lives -= 1;
        this.p.flash = '#fff';
      } else {
        this.g.emitter.particle(20, this.x, this.y,
            ['bloodred']);
        this.p.flash = $.cols.bloodred;
      }

      super.kill();

    }

  }

  render() {

    if (this.shadow) {
      this.g.ctx.globalAlpha = 0.5;
      this.g.ctx.drawImage(this.shadow, this.x, this.y + 30);
      this.g.ctx.globalAlpha = 1;
    }

    super.render();

  }


}

