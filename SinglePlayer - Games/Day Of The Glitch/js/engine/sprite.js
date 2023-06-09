class Sprite {

  constructor(g, o = {}) {
    this.g = g;

    this.dead = false;
    this.remove = false;

    this.id = Date.now() + '-' + g.ents.length;
    this.angle = 0;
    // this.tick = 0;

    this.lastPos = { x: this.x, y: this.y };
    this.flip = { x: 0, y: 0 };

    this.restrict = true;

    this.scale = o.scale || 1;
    this.frame = o.frame || 1;
    this.frames = o.frames || 1;
    this.frameRate = o.frameRate || 80;
    this.frameNext = o.frameNext || 0;


    for (let n in o) {
      this[n] = o[n];
    }

    this.o = o;

    if (o.i) {
      this.mkImg(o.i);
    }

    this.bound = o.bound || {
      w: this.w, h: this.h, x: 0, y: 0
    };

    this.init();
  }


  init() {
    this.anims = { idle: { frames: [1], rate: 80 } };
    this.changeAnim('idle');
  }

  update(step) {

    this.lastPos.x = this.x;
    this.lastPos.y = this.y;

    if (this.collidesWith) {
      this.hitGroup(this.collidesWith);
    }


    this.updateAnim(step);
    this.updateMove(step);
    if (this.restrict) {
      this.restrictToScreen();
    }


    if (this.gravity) {
      this.vy += this.gravity * this.g.dt;
    }



  }

  updateAnim(step) {


    if (this.frameNext < 0) {
      this.frameNext = this.anim.rate;
      this.anim.counter += 1;

      if (this.anim.counter >= this.anim.frames.length) {
        if (this.anim.next) {
          this.changeAnim(this.anim.next);
        }
        else {
          this.anim.counter = 0;
        }
      }

      this.frame = this.anim.frames[this.anim.counter];
    }
    this.frameNext -= step * 1000;
  }


  updateMove(step) { }

  restrictToScreen() {
    if (this.x < 0) { this.x = 0; }
    if (this.x > this.g.w - this.w) { this.x = this.g.w - this.w; }
    // if (this.y < 0) { this.y = 0; }
    if (this.y > this.g.h - this.h) { this.y = this.g.h - this.h; }
  }

  render() {

    let g = this.g,
        i = this.i,
        frame = this.frame;

    if (i) {

      if (this.flip.y) {
        i = g.draw.flip(i, 0, 1);
      }
      if (this.flip.x) {
        i = g.draw.flip(i, 1, 0);

        frame = this.frames - this.frame + 1;

      }


      g.ctx.drawImage(i, 
        ( frame * this.w ) - this.w, 0,
        this.w, this.h,
        ~~this.x, ~~this.y,
        this.w, this.h
        );

      // this.g.ctx.globalAlpha = 0.3;
      // this.g.draw.rect(
      //   this.x + this.bound.x, this.y + this.bound.y,
      //   this.bound.w, this.bound.h, $.cols.bloodred
      // );
      // this.g.ctx.globalAlpha = 1;

    } else {
      this.g.draw.rect(~~this.x, ~~this.y, this.w, this.h, this.col);
    }


  }

  doDamage(o) {
    // this.kill();
  }

  receiveDamage(o) {
    // this.kill();
  }


  kill() {
    this.dead = true;
    this.remove = true;
  }

  hitGroup(group) {

    let g = this.g,
      i = g.ents.length;

      while (i--) {

      if (g.ents[i] && g.ents[i].group === group && 
          g.ents[i].id !== this.id && this.hit(g.ents[i]) &&
          g.ents[i].dead === false) {
        this.doDamage(g.ents[i]);
        g.ents[i].receiveDamage(this);
      } 
    }

  }

  hit(o) {

    return !((o.y+o.h<this.y) || (o.y>this.y+this.h) ||
      (o.x+o.w<this.x) || (o.x>this.x+this.w));
      
  }

  mkImg(name) {
      
      let g = this.g;

      this.i = g.draw.scale(g.imgs[name], this.scale);

      this.w = ( this.i.width / this.frames);
      this.h = this.i.height;
      this.iHurt = g.draw.scale(g.imgs[name + '_w'], this.scale);


  }


  changeAnim(name) {

    if (this.anim && this.anim.name && this.anim.name === name) {
      return;
    }

    this.anim = this.anims[name];
    this.anim.name = name;
    this.anim.counter = 0;
    this.frame = this.anim.frames[0];
    this.frameNext = this.anim.rate;
  }


  rotate(img, angle) {
    var c = document.createElement('canvas'),
        ctx = c.getContext('2d'),
        size = Math.max(img.width, img.height) + 6,
        deg =  angle* (180 / Math.PI);

    c.width = size;
    c.height = size;

    ctx.translate(size/2, size/2);
    ctx.rotate(angle + Math.PI/2);
    ctx.drawImage(img, -(img.width/2), -(img.height/2));

    return c;
  }

}
