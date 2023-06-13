class Title extends State {


  init() {


    if (!this.g.hiScore) {
      this.g.hiScore = 20;
    }

    this.bgCol = $.cols.nightblue;

    this.title = this.g.mkFont('lg', 6);
    this.titleShadow = this.g.mkFont('g', 6);
    this.hi = this.g.mkFont('w', 3);
    this.sm = this.g.mkFont('w', 2);
    this.hiScore = parseInt( localStorage.getItem('hiScore'), 10 ) || 20;

    this.g.audio.say('DAY. OF. THE. GLITCH', 1.2);

    this.sight = this.g.draw.scale(this.g.imgs.sight, 4);
    this.static = new Static(this.g);


    this.g.ents.push(new Button(this.g, {
      y: 380,
      triggerOnEnter: true,
      col: $.cols.blaze,
      text: 'PLAY',
      cb: () => { 
        this.g.changeState('Play');
        }
    }));
    this.g.ents.push(new Button(this.g, {
      y: 450,
      size: 2,
      clickCol: 'transparent',
      col: 'transparent',
      text: 'BY EOINMCG',
      cb: () => { 
          window.location = '//twitter.com/eoinmcg';
        }
    }));


    this.g.addEvent( {
      time: 200,
      cb: () => {
        this.reGlitch();
      }
    });


  }

  update(step) {

    super.update(step);
    this.static.update(step);
  }



  render()  {
    
    this.g.draw.clear(this.bgCol);


    this.static.render();

    this.g.ctx.globalAlpha = 0.4;
    this.g.draw.text('HI', this.hi, 20, 20);
    this.g.draw.text(this.hiScore, this.hi, 60, 20);
    this.g.ctx.globalAlpha = 1;
    this.g.draw.text('DAY OF THE', this.title, false, 60, {f: this.titleShadow, offset: 2});
    this.g.draw.text('GLITCH', this.title, false, 105, {f: this.titleShadow, offset: 2});

    for (let n of this.g.ents) {
      n.render();
    }

    this.g.ctx.drawImage(this.sight, this.g.input.m.x - 15, this.g.input.m.y - 15);

  }

  reGlitch() {
    this.static.reset();
    this.g.addEvent({time: $.H.rnd(0,2) * 100, cb: () =>{ this.reGlitch(); } });
  }




}

