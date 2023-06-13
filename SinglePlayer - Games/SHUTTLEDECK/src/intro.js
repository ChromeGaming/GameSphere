import * as canvas from './canvas.js';
import * as gameobjects from './gameobjects.js';
import * as gfx from './gfx.js';
import * as scene from './scene.js';
import bus from './bus.js';
import StartButton from './startbutton.js';
import Text from './text.js';
import persist from './persist.js';

export default function Intro() {
  gameobjects.add(new Text('Professor Zorn\'s Lab', ()=>canvas.width()*0.03, ()=>canvas.width()*0.05, '#fff', 0.5, 'left'));
  gameobjects.add(new StartButton());
  bus.on('start', () => {
    persist.reset();
    scene.transition(2);
  });

  this.render = (ctx) => {
    var uiScale = canvas.height() * 0.3;
    gfx.drawCharPlayer(ctx);
    gfx.drawCharZoren(ctx);
    gfx.drawDialogBox(ctx,
      'Professor Zorn',
      'Hey there Courier, I need your help getting this Xenotransponder to Korva-6. It\'s only a few planets away.'
    );
    gfx.drawItemShell(ctx, canvas.width()*0.5, canvas.height()*0.4,uiScale);
    gfx.drawItemXeno(ctx, canvas.width()*0.5, canvas.height()*0.4,uiScale);
  }
};