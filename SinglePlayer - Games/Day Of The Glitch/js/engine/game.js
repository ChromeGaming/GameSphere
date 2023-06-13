class Game {

  constructor() {

    let ua = navigator.userAgent.toLowerCase(),
        w, h;

    this.l = document.getElementById('l');
    this.h = document.getElementById('h');

    w = 320, h = 480;

    this.c = document.getElementsByTagName('canvas')[0];
    this.ctx = this.c.getContext('2d');
    this.w = w;
    this.h = h;
    this.c.width = w;
    this.c.height = h;
    this.c.style.width = w + 'px';
    this.c.style.height = h + 'px';

		this.dt   = 0;
		this.fps  = 60;
		this.frameStep = 1/ this.fps;
		this.frameCurr = 0;
		this.framePrev = $.H.timeStamp();

		this.mobile = 'createTouch' in document || false;
    this.android = ua.indexOf('android') > -1;
    this.ios = /ipad|iphone|ipod/.test(ua);
    this.firefox = ua.indexOf('firefox') > -1;

    this.plays = 0;

    this.events = [];
    this.ents = [];
    this.imgs = [];
    this.fonts = [];
    this.sfx = [];

    document.title = $.data.title;

    this.load();

  }


  load() {

    this.draw = new Draw(this.ctx, this.w, this.h);
    this.input = new Input(this);
    this.emitter = new Emitter(this);
    this.shake = new Shake(this);

    if ( this.ios) {
      this.audio = { play: function() {}, say: function() {} };
    } else {
      this.audio = $.Audio;
      this.audio.init(this);
    }

    this.load = new Load(this);


  }


  init() {

    this.scale();

    $.H.mkFavicon(this.draw.scale(this.imgs.face, 4));
    this.changeState('Title');

    this.loop();


    window.addEventListener('resize', 
      () => this.scale(), 
      false);

  }

  loop() {

		this.frameCurr = $.H.timeStamp();
		this.dt = this.dt + Math.min(1, (this.frameCurr - this.framePrev) / 1000);
    this.c.className = '';
    this.input.poll();

		while(this.dt > this.frameStep) {
			this.dt = this.dt - this.frameStep;
			this.state.update(this.frameStep);
		}

    this.shake.update(this.dt);
		this.state.render(this.dt);

		this.framePrev = this.frameCurr;

    requestAnimationFrame(() => this.loop());

  }

  update(step) {

    for (let n of this.ents) {
      console.log('ok');
      n.update(step);
    }

  }

  render() {

    this.draw.clear();

    for (let n of this.ents) {
      n.render();
    }

  }

  scale() {


    this.scalePortrait();

  }

  scalePortrait() {
    let winH = window.innerHeight,
        ratio = this.w / this.h,
        w2 = winH * ratio,
        scale = w2 / this.w;

      if (this.mobile && winH < window.innerWidth) {
          this.l.style.display = 'block';
          $.H.el('h').innerHTML = 'Rotate Device';
          this.c.style.display = 'none';
      } else {
          this.l.style.display = 'none';
          this.c.style.display = 'block';
      }

    if (window.navigator.standalone == true && this.ios) {
      return;
    }

    this.c.width = this.w;
    this.c.height = this.h;

    this.cx = this.w / 2;
    this.cy = this.h / 2;

    this.c.style.width = ~~(w2)+ 'px';
    this.c.style.height = ~~(winH) + 'px';
  }


  changeState(state) {

    this.ents = [];
    this.events = [];

    switch (state) {

      case 'Title':
        this.state = new Title(this);
      break;

      case 'Splash':
        this.state = new Splash(this);
      break;

      case 'Play':
        this.state = new Play(this);
      break;

    }

  }

  mkFont(col, scale) {
    let g = this,
        f = g.draw.scale(g.fonts[col], scale);

    f.scale = scale;
    return f;
  };

  addEvent(e) {
    this.events.push(e); 
  }


}
