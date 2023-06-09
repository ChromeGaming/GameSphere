class Draw {

  constructor(ctx, w, h) {
    this.ctx = ctx;
    this.w = w;
    this.h = h;
  }

  clear(col = '#000') {
    this.ctx.fillStyle = col;
    this.ctx.fillRect(0, 0, this.w, this.h);
  }

  rect(x, y, w, h, c) {
    this.ctx.fillStyle = c;
    this.ctx.fillRect(x, y, w, h);
  }

  circle(x, y, r) {
    this.ctx.beginPath();
    this.ctx.fillStyle = '#fff';
    this.ctx.arc(x, y, r, 0, Math.PI*2);
    this.ctx.closePath();
  }


  scale(i, scale, n) {

    let c = $.H.mkCanvas(i.width * scale, i.height * scale),
        ctx = c.getContext('2d');

    if (c.width) {
      ctx.save();
      ctx.scale(scale, scale);
      ctx.drawImage(i, 0, 0);
      ctx.restore();
    }


		return c;
  };


  flip(i, flipH, flipV) {

    let c = $.H.mkCanvas(i.width, i.height),
        ctx = c.getContext('2d'),
        scaleH = flipH ? -1 : 1, 
        scaleV = flipV ? -1 : 1,
        posX = flipH ? i.width * -1 : 0,
        posY = flipV ? i.height * -1 : 0;
    
    c.width = i.width;
    c.height = i.height;

    ctx.save();
    ctx.scale(scaleH, scaleV);
    ctx.drawImage(i, posX, posY, i.width, i.height);
    ctx.restore();

		return c;

  };


  text(s,f,x,y, outline) {

    let i = 0,
        ctx = this.ctx,
        firstChar = 65,
        offset = 0,
        w = 3 * f.scale,
        h = 5 * f.scale,
        spacing = 1 * f.scale,
        sW =  $.H.textWidth(s, f),
        charPos = 0;

    if (typeof(s) === 'number' || s[0] === '0') {
        s += '';
        offset = 43;
    }

    x = x || (this.w - sW) / 2;

    if (outline) {
     this.text(s,outline.f,x+outline.offset,y);
     this.text(s,outline.f,x-outline.offset,y); 
     this.text(s,outline.f,x,y+outline.offset); 
     this.text(s,outline.f,x,y-outline.offset); 
    }


    for (i = 0; i < s.length; i += 1) {
        charPos = ( ( s.charCodeAt(i) - firstChar ) + offset ) * (w + spacing);
          if (charPos > -1) {
            ctx.drawImage(f, 
                charPos, 0, 
                w, h,
                ~~x, ~~y,
                w, h);
          }
            x += w + spacing;
    }
  }

}
