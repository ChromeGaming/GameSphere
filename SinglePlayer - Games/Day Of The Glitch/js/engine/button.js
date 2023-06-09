class Button extends Sprite {

  constructor(g, o = {}) {
    o.size = o.size || 4;
    o.w = o.w || 150;
    o.h = o.h || 50;
    o.delay = o.delay || 100;
    o.col = o.col || $.cols.slimegreen;
    o.triggerOnEnter = o.triggerOnEnter || false;
    o.fadeIn = o.fadeIn || 0;
    super(g, o);
    this.p = g.mkFont('w', o.size);
    this.pHover = g.mkFont('b', o.size);
    this.boxX = ~~( (this.g.w /2) - (this.w / 2) );
    this.boxY = this.y - 15;
    this.clicked = false;
    this.clickCol = o.clickCol || '#fff';
    this.currentCol = this.col;
    this.clicked = false;
    this.fontCol = 'p';
  }

  update() {

    let click = this.g.input.m.click;

    this.fontCol = 'p';
    this.fadeIn -= 1;
    this.hover = this.intersects();

    if (this.hover) {
      this.g.c.className = 'hover';
      this.fontCol = 'pHover';
    }

    this.currentCol = (this.hover || (this.hover && click)) ?
      this.clickCol : this.col;
      
    if (( !this.clicked && this.hover && click ) || 
        ( !this.clicked && this.triggerOnEnter && this.g.input.keys.enter )) {
      this.g.audio.play('tap');
      this.clicked = true;
      setTimeout( () => { this.cb.call(); }, this.delay);
    }
 


  }

  render() {
    let font = (this.hover) ?
      this.pHover : this.p;

    this.g.draw.rect(this.boxX, this.boxY, this.w, this.h, this.currentCol);

    this.g.draw.text(this.text, font, this.x, this.y);

  }


  intersects() {
    let m = this.g.input.m;
    return (m.x > this.boxX && m.x < this.boxX + this.w &&
      m.y > this.boxY && m.y < this.boxY + this.h);

  }


}
