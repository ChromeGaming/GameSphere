class Map {

	 constructor(g, o) {

      this.g = g;
      this.p = o.p;

      this.tileSize = 8;
      this.scale = 4;

      this.f = this.g.mkFont('w', 2);

      this.tileDim = this.tileSize * this.scale;
      this.tileX = this.g.w / this.tileDim;
      this.tileY = this.g.h / this.tileDim;

      this.w = g.w / ( this.tileSize * this.scale );
      this.vx = 0;
      this.vy = 1;

      this.cx = 0;
      this.cy = 0;

      let land = g.draw.scale(g.imgs['land'], this.scale);
      let land2 = g.draw.flip(land, -1);

      this.tileSet = [
        false,
        land,
        land2,
        g.draw.scale(g.imgs['poop0'], this.scale),
        g.draw.scale(g.imgs['cherry'], this.scale),
        g.draw.scale(g.imgs['orange'], this.scale),
        g.draw.scale(g.imgs['melon'], this.scale)
      ];

      this.poop0 = g.draw.scale(g.imgs['poop0'], this.scale);
      this.poop1 = g.draw.scale(g.imgs['poop1'], this.scale);

      this.data = [];

      while(this.data.length <= this.tileY / 2) {
        this.data.push(this.newRow());
      }

      while(this.data.length <= this.tileY + 6) {
        this.data.push(this.newRow(true));
      }

      this.data[this.data.length - 2][5] = 3;

      // this.data = this.data.reverse();


    this.fish = this.p.fish;


   }

   newRow(empty = false) {
        let row = [1],
            w = this.g.w / (this.tileSize * this.scale) - 2;
        for( let x = 0; x < w; x++ ) {
            row.push ( (empty) ? 0 : Math.random() > 0.97 ? this.randomBlock() : 0 );
        }

        row.push(2);
        return row;
    }


  randomBlock() {
    return Math.random() > 0.33 ? 3 :  $.H.rnd(4,6);
  }

  update(step) {
    this.cy += ~~(  this.p.speed  * step );
    // this.cy += this.p.speed;
    // this.dude = this.getDude();

    if (this.cy > this.tileDim) {
      this.data.shift();
      this.data.push(this.newRow());
      this.cy -= (this.tileDim);
    }

  }


  render() {
    let x = 0, y = this.cy, 
      g = this.g,
      c = $.H.mkCanvas(g.w, g.h),
      ctx = c.getContext('2d'),
      h = this.g.h / (this.tileSize * this.scale),
      cy = this.cy,
      tiles = this.tileSet,
      t = this,
      p = this.p,
      wh = this.tileDim,
      ripple;


    for (let i = 0; i < h; i += 1) {
      let row = this.data[this.data.length - i - 1];
      x = 0;
      row.forEach(function(cell) {
        if (cell) {
          if (cell == 3) {
            ctx.drawImage(p.fader > 0 ? t.poop0 : t.poop1,~~x, ~~y);
          } else {
            ctx.drawImage(tiles[cell],~~x, ~~y);
          }
        }
        x += wh;
      });
      y += wh;
    }

    g.ctx.drawImage(c, 0, 0);

   // let fish =  this.p.dude;
   // console.log(fish);
   // let hitRow = this.data[this.data.length - fish.y];
   // console.log(hitRow);
   // let hitL = hitRow[fish.x];
   // let hitR = hitRow[fish.x + 1];

   // g.draw.rect(fish.x * wh, fish.y * wh, wh, wh, $.cols.pigmeat);
   // g.draw.text(hitL, this.f, fish.x * wh, fish.y * wh);
   // g.draw.rect(( fish.x + 1 ) * wh, fish.y * wh, wh, wh, $.cols.oldpoop);
   // g.draw.text(hitR, this.f, ( ( fish.x + 1 ) * wh ) + wh / 2 , fish.y * wh);



  }


  checkEnt(o) {
    let x = Math.floor( o.x / this.tileDim );
    let y = Math.floor( Math.floor( o.y / this.tileDim ) - Math.floor( this.cy / this.tileDim ) );

   y = 12;

   let hitRow = this.data[this.data.length -  y];
   let hitL = hitRow[x];
   let hitR = hitRow[x + 1];


   // return (hitL + hitR > 0);
   return [hitL, hitR, [x, y]];

  }


  // getDude() {
  //   let x = Math.floor( this.p.dude.x / this.tileDim );
  //   let y = Math.floor( Math.floor( this.p.dude.y / this.tileDim ) - Math.floor( this.cy / this.tileDim ) );

  //   y += 1;
  //   y = 12;
  //   // x = ( x  ) * this.tileDim;
  //   // y = ( y + 1 ) * this.tileDim;

  //   return {x: x, y: y, w: this.p.dude.w, h: this.p.dude.h};
  // }


  checkCoords(x, y) {
    x = Math.floor( x / this.tileDim );
    y = Math.floor( ( y / this.tileDim ) - ( this.cy / this.tileDim ) );
    let row = this.data[y];
    row.toString().split('');
    return row[x];
  }


}
