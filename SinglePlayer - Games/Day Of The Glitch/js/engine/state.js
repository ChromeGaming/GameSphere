class State {

  constructor(g) {
    this.g = g;
    this.init();
  }

  init() {
    this.bgCol = false;
    this.fader = 0;
  }

  update(step) {

    let g = this.g,
        i = g.ents.length;

    // for (let n of g.ents) {
    while (i--) {
      g.ents[i].update(step);
      // n.update(step);
    }

    i = g.ents.length;
    while (i--) {
          if (g.ents[i].remove) {
              g.ents.splice(i, 1);
          }
    }


    i = g.events.length;
    while(i--) {
      let e = g.events[i]; 
      if (!e) {
        break;
      }
      // e.time -= ( g.dt );
      e.time -= 1;
      if (e.time < 0) {
        e.cb.call(this);
        g.events.splice(i, 1);
      }
    }

    this.fader = Math.sin(new Date().getTime() * 0.005);
  }

  render() {

    let i = this.g.ents.length;
    if (this.bgCol) {
      this.g.draw.clear(this.bgCol);
    }

    // for (let n of this.g.ents) {
    for (i = 0; i < this.g.ents.length; i += 1) {
      this.g.ents[i].render();
    }


  }

}
