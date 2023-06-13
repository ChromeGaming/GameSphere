class Play extends State {

  init() {


    this.bgCol = $.cols.nightblue;
    this.bgCol = false;

    this.floor = this.g.mkFont('w', 10);
    this.h1 = this.g.mkFont('w', 7);
    this.p = this.g.mkFont('r', 6);
    this.pS = this.g.mkFont('p', 6);
    this.hi = this.g.mkFont('w', 3);

    this.charge = 0;
    this.maxCharge = 140;
    this.chargeRate = 15;
    this.shootDelay = 2;

    this.waveMgr = new WaveMgr(this.g, {p: this});

    this.heart = this.g.draw.scale(this.g.imgs.heart, 4);

    this.score = 0;
    this.hiScore = parseInt( localStorage.getItem('hiScore'), 10 ) || 20;
    this.newHi = false;

    this.holding = false;
    this.lastClick = false;

    this.combo = 0;
    this.g.audio.say('RESISTANCE IS FUTILE!');
    this.sight = this.g.draw.scale(this.g.imgs.sight, 4);
    this.static = new Static(this.g, {ttl: -20 });

    this.lives = 2;
    this.gameOver = false;
    this.flash = 0;

    this.splats = [];
    this.splatImgs = {
      skull: this.g.draw.scale(this.g.imgs.skull, 3),
      mark: this.g.draw.scale(this.g.imgs.mark, 6)
    };

    this.wave = 0;
    this.waveComplete = false;
    this.nextWave();
  }

  update(step)  {

    this.flash = 0;
    super.update(step);
    this.static.update(step);

    if (this.lives < 0 && !this.gameOver) {
      this.gameOverSequence();

    }

    if (this.score > this.hiScore && !this.newHi) {
      this.newHi = true;

      this.g.audio.say('NEW HISCORE!');
      this.g.ents.push(new Text(this.g, {text: 'NEW HISCORE', col: 'p', accel: 0, x: 90, y: this.g.h, vy: 10}));
    }

    this.checkWave();

    if (!this.gameOver && this.lastClick && this.charge < this.maxCharge && this.shootDelay <= 0) {
      this.charge += this.chargeRate;
      this.shootDelay = 2;
      this.g.audio.play('shoot');
      this.g.ents.push(new Circle(this.g, {
        x: this.g.input.m.x - 5, y: this.g.input.m.y - 5
      }));
    } else if (!this.lastClick) {
      this.charge -= this.chargeRate;
    }

    if (this.charge < 0) {
      this.charge = 0;
    } else if (this.charge > this.maxCharge) {
      this.charge = this.maxCharge;
    }

    this.lastClick = this.g.input.m.click;
    this.holding = (this.g.input.m.click && this.lastClick) ? true : false;
    this.shootDelay -= 1;

    if (!this.holding) {
      if (this.combo > 2) {
        this.g.audio.play('coin');
        this.g.audio.say('COMBO! '+this.combo);
        this.g.ents.push(new Text(this.g, {text: 'COMBO', col: 'g', x: 120, y: this.g.h - 180}));
        this.g.ents.push(new Text(this.g, {text: this.combo, col: 'g', x: 150, y: this.g.h - 140}));
      }
      this.combo = 0;
    }


  }

  render()  {

    let m = this.g.input.m,
      splat,
      i;
    
    this.g.ctx.drawImage(this.g.imgs.floor, 0, 0);

    for (i = 0; i < this.splats.length; i += 1) {
      splat = this.splats[i];
      if (splat.i == 'mark') {
        this.g.ctx.drawImage(this.splatImgs[splat.i], splat.x, splat.y);
      }
    }
    for (i = 0; i < this.splats.length; i += 1) {
      splat = this.splats[i];
      if (splat.i == 'skull') {
        this.g.ctx.drawImage(this.splatImgs[splat.i], splat.x, splat.y);
      }
    }
    super.render();

    this.g.ctx.globalAlpha = 0.05;
    this.g.draw.text('ZONE', this.floor, 90, 100);
    this.g.draw.text(this.wave, this.floor, 150, 160);
    this.g.ctx.globalAlpha = 1;

    this.g.draw.text(this.score, this.hi, this.g.w - 20 - (this.score.toString().length * 12), this.g.h - 30);

    this.g.draw.rect(20,20, this.g.w - 40, 20, '#000');
    this.g.draw.rect(20,20, this.charge * 2, 20, $.cols.bloodred);

    for (i = 0; i < this.lives; i += 1) {
      this.g.ctx.drawImage(this.heart, 20 + (i * 27), this.g.h - 30);
    }

    if (this.gameOver && this.fader > 0) {
      this.g.draw.text('GAME OVER', this.pS, false, 200, {f: this.p, offset: 2});
    }

    if (this.flash) {
      this.g.draw.rect(0, 0, this.g.w, this.g.h, this.flash);
    }
    
    this.g.ctx.drawImage(this.sight, this.g.input.m.x - 15, this.g.input.m.y - 15);

    this.static.render();
  }

  gameOverSequence() {

      let i = this.g.ents.length;
      while(i--) {
        if (this.g.ents[i].group == 'human') {
          this.g.ents[i].doDamage({alpha: 1});
        }
      }

      this.gameOver = true;
      this.g.audio.say('GAME! OVER!');
      this.waveMgr.robos = $.H.shuffle(this.waveMgr.robos);
      this.waveMgr._waveCount = 0;

      if (this.newHi) {
        // ios in incognito mode will hang when trying to set localstorage
        try {
          localStorage.setItem('hiScore', this.score); 
        } catch (e) { }
      }


      this.g.addEvent({
        time: 200,
        cb: () => {
          this.g.audio.say('HA! HUMANS ARE DOOMED');
          this.startButton = this.g.ents.push(new Button(this.g, {
            y: 280,
            triggerOnEnter: true,
            col: $.cols.blaze,
            state: 'Play',
            text: 'RETRY',
            cb: () => { 
              this.g.audio.play('tap');
              this.g.changeState('Play');
              }
          }));
          this.quitButton = this.g.ents.push(new Button(this.g, {
            y: 360,
            col: $.cols.skyblue,
            state: 'Title',
            text: 'TWEET',
            cb: () => { 

            location = 'https://twitter.com/intent/tweet?&text=I+scored+'+this.score+'+in+Day+Of+The+Glitch&via=eoinmcg&url='+encodeURI(location.href); }
          }));
        }
      });
  }


  checkWave() {
    let i = this.g.ents.length, robos = 0;

    if (this.inWave <= 0 && !this.waveComplete) {
      while (i--) {
        if (this.g.ents[i].group === 'baddie' || this.g.ents[i].group === 'human') {
          robos += 1;
        } 
      }


      if (robos <= 0) {
        this.waveComplete = true;
        this.static.reset();
        this.nextWave();
      }
    }
  }


  nextWave() {
    if (this.wave > 0) {
      this.g.audio.play('glitch');
    }
    this.splats = [];
    this.g.addEvent({
      time: 0.7,
      cb: () => {
        if (!this.gameOver) {
          this.wave += 1;
          this.waveComplete = false;
          this.waveMgr.nextWave();
          this.spawn();
        }
      }
    });
  }

 spawn() {

  if (this.gameOver || this.inWave <= 0) { return; }

  this.waveMgr.spawn();
 
 }

}





