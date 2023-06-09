class Intro extends State {

  init() {

    this.p = this.g.mkFont('w', 4);
    this.hills = this.g.draw.scale(this.g.imgs.hills, 2);
    this.grass = this.g.draw.scale(this.g.imgs.grass, 2);
    this.floor = 377;

    this.p1 = new P1(this.g, { x: 100, y: this.floor, p: this});
    this.g.ents.push(this.p1);

    this.cloud = new Sprite(this.g, { x: 0, y: 50, p: this, frames: 3, scale: 4, i: 'cloud'});
    this.cloud.x = this.g.w / 2 - (this.cloud.w / 2);
    this.g.ents.push(this.cloud);

    this.flip = 0;

    this.addText('OHAI', 0.1);

    this.addText('BEJAYSUS', 2);
    this.addText('LOOK UP', 3);
    this.addText('WHISKEY CLOUD', 4);

    this.addText('LIQUID GOLD', 6);
    this.addText('RAINING FROM ABOVE', 7);
    this.addText('DRINK UP BOYO', 8);

    this.addText('DONT', 10, 4, 'r');
    this.addText('SPILL', 10.7, 4, 'r');
    this.addText('A', 11.4, 4, 'r');
    this.addText('DROP', 12.1, 4, 'r');

    this.g.addEvent({
      time: 15,
      cb: () => {
        console.log('OK');
        this.g.changeState('Play');
      }
    });

    this.skip = this.g.ents.push(new Button(this.g, {
      y: 450,
      triggerOnEnter: false,
      col: $.cols.oldpoop,
      state: 'Play',
      text: 'SKIP',
      cb: () => { 
        this.g.changeState('Play');
        }
    }));


  }

  update() {


    super.update();
    this.p1.changeAnim('stand');
    this.p1.x = this.g.w / 2 - (this.p1.w / 2);
    this.p1.flip.x = this.flip;


  }


  render() {
    
    this.g.draw.clear($.cols.cloudblue);

    this.g.ctx.drawImage(this.hills, 0, 290);

    this.g.ctx.drawImage(this.grass, 0, 400);

    for (let n of this.g.ents) {
      n.render();
    }

  }


  addText(text, delay, scale = 3, col = 'w') {

    this.g.addEvent({
      time: delay,
      cb: () => {
        this.g.audio.play('tap');
        this.g.ents.push(new Text(this.g, {x: false, y: 350, text: text, 
                        scale: scale, col: col}));
        this.flip = (this.flip) ? 0 : 1;
      }
    });

  }

};
