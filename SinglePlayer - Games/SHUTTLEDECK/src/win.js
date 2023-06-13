import * as canvas from './canvas.js';
import * as gameobjects from './gameobjects.js';
import * as gfx from './gfx.js';
import * as scene from './scene.js';
import bus from './bus.js';
import StartButton from './startbutton.js';
import Text from './text.js';

export default function Win() {
  gameobjects.add(new Text('Planet Korva-6', ()=>canvas.width()*0.03, ()=>canvas.width()*0.05, '#fff', 0.5, 'left'));
  gameobjects.add(new Text('Package Delivered!', ()=>canvas.width()/2, ()=>canvas.height()/2, '#5f5', 0.6, 'center'));
  gameobjects.add(new StartButton('Main Menu'));
  bus.on('start', () => { scene.transition(0); });

  this.render = (ctx) => {
    var uiScale = canvas.height() * 0.3;
    gfx.drawCharPlayer(ctx);
    gfx.drawCharZoren(ctx, '#f55');
    gfx.drawDialogBox(ctx,
      'Professor Quinn',
      'Is that a Xenotransponder?? My brother Zorn must have sent this. Thank you, Courier!'
    );
  }
};