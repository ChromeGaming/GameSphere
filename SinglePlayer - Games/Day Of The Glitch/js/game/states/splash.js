class Splash extends State {

  init() {

    
    this.bgCol = $.cols.nightblue;

    this.dude = new Dude(this.g, {  x: 130, y: 300, vx: 0, vy: 0, i: 'dude'});
    this.g.ents.push(this.dude);

    this.girl = new Dude(this.g, {  x: 170, y: 300, vx: 0, vy: 0, i: 'girl'});
    this.g.ents.push(this.girl);

    this.g.ents.push(
      new Bot(this.g, {  x: 170, y: 220, vx: 0, vy: 0, i: 'stomper'})
    );
    this.g.ents.push(
      new Bot(this.g, {  x: 130, y: 220, vx: 0, vy: 0, i: 'stomper'})
    );
    this.g.ents.push(
      new Bot(this.g, {  x: 100, y: 170, vx: 0, vy: 0, i: 'robo'}),
      new Bot(this.g, {  x: 140, y: 170, vx: 0, vy: 0, i: 'robo'}),
      new Bot(this.g, {  x: 220, y: 170, vx: 0, vy: 0, i: 'robo'}),
      new Bot(this.g, {  x: 180, y: 170, vx: 0, vy: 0, i: 'robo'}),
      new Bot(this.g, {  x: 140, y: 120, vx: 0, vy: 0, i: 'mono'}),
      new Bot(this.g, {  x: 180, y: 120, vx: 0, vy: 0, i: 'mono'})

    );


  }

}

class Bot extends Sprite {

  constructor(g, o) {
    o.frames = 1;
    o.scale = 3;
    o.i = o.i;
    o.x = o.x;
    o.y = o.y;
    o.doFlip = 0;
    super(g, o); 
  }


  update(step) {

    super.update(step);

    this.doFlip -= step * 10;

    if (this.doFlip < 0) {
      this.doFlip = 1;
      this.flip.x = (this.flip.x === 1) ? 0 : 1;
    }

    console.log(this.doFlip);

  }

}


class Dude extends Sprite {

  constructor(g, o) {

    o.frames = 2;
    o.scale = 4;
    o.i = o.i;

    o.vy = o.vy;
    o.vx = o.vx;

    o.changeDir = 0;
    o.doFlip = 1;
    o.phrase = $.H.rndArray( ['HELP', 'ARRGH', 'RUN'] );

    super(g, o); 


  }


  init() {
    this.anims = {
      run: { frames: [1,2], rate: 100 }
    };
    this.changeAnim('run');
  }
}
