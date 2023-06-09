class Input {

  constructor(g) {

    let l = window.addEventListener;

    this.g = g;

    this.up = false;
    this.down = false;
    this.left = false;
    this.right = false;

    this.m = {
      x: g.w / 2, y: g.h / 2, click: 0
    };

    this.keys = {
      up: 0,
      down: 0,
      left: 0,
      right: 0,
      shoot: 0,
      enter: 0
    };

    this.keyMappings = {
      up: 38,
      down: 40,
      left: 37,
      right: 39,
      shoot: 32,
      enter: 13
    };

    l('keydown',
      (e) => this.press(e, 1), false);
    l('keyup',
      (e) => this.press(e, 0), false);

    l('mousemove',
      (e) => this.trackMove(e), false);

    l('mousedown',
      (e) => this.m.click = 1, false);

    l('mouseup',
      (e) => this.m.click = 0, false);

    l('touchstart',
      (e) => { this.m.click = 1; this.trackMove(e.touches[0]); }, false);

    l('touchend',
      (e) => { this.m.click = 0; this.trackMove(e.touches[0]); }, false);

    l('touchmove',
      (e) => { e.preventDefault(); this.trackMove(e.touches[0]); }, false);

  }

  poll() {
  }

  press(e, val) {
    let key = false;
    for (let n in this.keyMappings) {
      if (e.keyCode === this.keyMappings[n]) {
        this.keys[n] = val;
      }
    }

  }

  trackMove(e) {
    let g = this.g,
      offsetY = g.c.offsetTop,
      offsetX = g.c.offsetLeft,
      scale = parseInt(g.c.style.width, 10) / g.c.width,
      x = ~~((e.pageX - offsetX) / scale),
      y = ~~((e.pageY - offsetY) / scale);

    x = x > g.w ? g.w : x;
    x = x < 0 ? 0 : x;

    y = y > g.h ? g.h : y;
    y = y < 0 ? 0 : y;

    this.m.x = ~~x;
    this.m.y = ~~y;
    // console.log(this.m);
  }

}
