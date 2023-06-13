import * as canvas from './canvas.js';
import * as gameobjects from './gameobjects.js';
import * as gfx from './gfx.js';
import * as scene from './scene.js';
import * as utils from './utils.js';
import persist from './persist.js';
import bus from './bus.js';
import StartButton from './startbutton.js';
import Text from './text.js';

export default function GameOver() {
  var currLevel = persist.getLevel();

  // Title card
  gameobjects.add(new Text('SHUTTLEDECK', ()=>canvas.width()/2, ()=>canvas.height()*0.2, '#fff', 1, 'center'));

  // Game over :(
  gameobjects.add(new Text('Game Over', ()=>canvas.width()/2, ()=>canvas.height()*0.35, '#f55', 1, 'center'));
  gameobjects.add(new Text(`Exploded approaching planet ${utils.planets[currLevel]}`, ()=>canvas.width()/2, ()=>canvas.height()*0.6, '#f55', 0.4, 'center'));

  // Push to play again
  gameobjects.add(new Text('[ Press to retry ]', ()=>canvas.width()/2, ()=>canvas.height()*0.8, '#777', 0.5, 'center'));
  var fn = () => {
    scene.transition(1);
    bus.off('tap', fn);
  };
  bus.on('tap', fn);

  // Starfield
  this.render = (ctx) => {
    var w = canvas.width();
    var h = canvas.height();
    var uiScale = Math.min(h * 0.03, w*0.03);
    gfx.drawStars(ctx,-Date.now()*0.03,0,3,0);

    // Progress meter
    ctx.lineWidth = uiScale * 0.2;

    // bg line
    ctx.strokeStyle='#555';
    ctx.beginPath();
    ctx.moveTo(w/2 - w*14/36, h/2);
    ctx.lineTo(w/2 + w*14/36, h/2);
    ctx.stroke();

    for (let i = 0; i < utils.planets.length + 1; i++) {
      var x = (i - 7) * w / 18 + w/2;
      if (i <= currLevel) {
        ctx.beginPath();
        ctx.arc(x, h*0.5,uiScale*0.6,0,6.29);
        ctx.fillStyle='#fff';
        ctx.fill();
      } else {
        ctx.beginPath();
        ctx.arc(x, h*0.5,uiScale*0.5,0,6.29);
        ctx.fillStyle='#000';
        ctx.strokeStyle='#f55';
        ctx.fill();
        ctx.stroke();
      }
    }
  }
};