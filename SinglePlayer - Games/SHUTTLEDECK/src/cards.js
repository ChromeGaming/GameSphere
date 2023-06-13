import bus from './bus.js';
import persist from './persist.js';

const cards = [
{
  color: [255, 51, 51],
  title: ['Rho', 'Channel'],
  cost: 1,
  price: 5,
  glyph: function (ctx, cs) {
    ctx.save();
    ctx.lineWidth = cs * 0.05;
    ctx.beginPath();
    ctx.arc(0, -cs/6, cs / 7, 0, 6.29);
    ctx.stroke();
    ctx.strokeRect(-cs/6, cs/10, cs/3, 0);
    ctx.strokeRect(-cs/6, cs/4, cs/3, 0);
    ctx.restore();
  },
  use: () => { bus.emit('lane', 0) }
},
{
  color: [51, 255, 51],
  title: ['Gamma', 'Sector'],
  cost: 1,
  price: 5,
  glyph: function (ctx, cs) {
    ctx.save();
    ctx.lineWidth = cs * 0.05;
    ctx.beginPath();
    ctx.arc(0, 0, cs / 7, 0, 6.29);
    ctx.stroke();
    ctx.strokeRect(-cs/6, -cs/4, cs/3, 0);
    ctx.strokeRect(-cs/6, cs/4, cs/3, 0);
    ctx.restore();
  },
  use: () => { bus.emit('lane', 1) }
},
{
  color: [51, 51, 255],
  title: ['Beta', 'Stream'],
  cost: 1,
  price: 5,
  glyph: function (ctx, cs) {
    ctx.save();
    ctx.lineWidth = cs * 0.05;
    ctx.beginPath();
    ctx.arc(0, cs/6, cs / 7, 0, 6.29);
    ctx.stroke();
    ctx.strokeRect(-cs/6, -cs/10, cs/3, 0);
    ctx.strokeRect(-cs/6, -cs/4, cs/3, 0);
    ctx.restore();
  },
  use: () => { bus.emit('lane', 2) }
},
{
  // Basic missile that destroys first target in direct line of fire
  color: [255, 160, 30],
  title: ['Kepler', 'Missile'],
  cost: 2,
  price: 10,
  glyph: function (ctx, cs, ls = 0.05) {
    ctx.save();
    ctx.translate(cs/20, 0);
    ctx.rotate(0.6);
    ctx.lineWidth = cs * ls;
    ctx.beginPath();
    ctx.moveTo(-cs/18, -cs/6);
    ctx.lineTo(0, -cs/4);
    ctx.lineTo(cs/18, -cs/6);
    ctx.lineTo(cs/18, cs/4);
    ctx.lineTo(-cs/18, cs/4);
    ctx.closePath();
    ctx.moveTo(-cs/8, cs/4);
    ctx.lineTo(-cs/6, cs/4);
    ctx.lineTo(-cs/8, cs/10);
    ctx.closePath();
    ctx.moveTo(cs/8, cs/4);
    ctx.lineTo(cs/6, cs/4);
    ctx.lineTo(cs/8, cs/10);
    ctx.closePath();
    ctx.stroke();
    ctx.restore();
  },
  use: () => { bus.emit('projectile', 1) }
},
{
  // Powerful beam that destroys all content on this channel (good and bad)
  color: [255, 160, 30],
  title: ['Sigma', 'Cannon'],
  cost: 3,
  price: 15,
  glyph: function (ctx, cs) {
    ctx.save();
    ctx.translate(cs/12, cs/15);
    ctx.rotate(0.6);
    ctx.lineWidth = cs * 0.05;
    ctx.lineCap='round';
    ctx.beginPath();
    ctx.moveTo(-cs/4, -cs/4);
    ctx.lineTo(-cs/14, -cs/4);
    ctx.lineTo(-cs/14, -cs/10);
    ctx.lineTo(cs/10, -cs/10);
    ctx.lineTo(cs/10, cs/4);
    ctx.lineTo(-cs/4, cs/4);
    ctx.closePath();
    ctx.moveTo(-cs/6, 0);
    ctx.lineTo(0, 0);
    ctx.lineTo(-cs/12, cs/12);
    ctx.lineTo(0, cs/6);
    ctx.lineTo(-cs/6, cs/6);
    ctx.stroke();
    ctx.restore();
  },
  use: () => { bus.emit('projectile', 2) }
},
{
  // 3 parallel pulses that break the first obstacle on each channel
  color: [255, 160, 30],
  title: ['Pulse', 'Breaker'],
  cost: 3,
  price: 15,
  glyph: function (ctx, cs) {
    ctx.save();
    ctx.translate(-cs/30, 0);
    ctx.lineWidth = cs * 0.05;
    ctx.lineCap='round';
    ctx.beginPath();
    ctx.arc(0, 0, cs/16, 0, 6.29);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(0, 0, cs/5, -1, 1);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(0, 0, cs/3, -0.8, 0.8);
    ctx.stroke();
    ctx.rotate(0.5);
    ctx.strokeRect(-cs/8, -cs/30, -cs/8, cs/15);
    ctx.rotate(-1.0);
    ctx.strokeRect(-cs/8, -cs/30, -cs/8, cs/15);
    ctx.restore();
  },
  use: () => { bus.emit('projectile', 3) }
},
{
  // Twin rockets that will destroy two random obstacles
  color: [255, 160, 30],
  title: ['Crazy', 'Rockets'],
  cost: 2,
  price: 10,
  glyph: function (ctx, cs) {
    ctx.save();
    ctx.lineWidth = cs * 0.05;
    ctx.lineCap='round';
    for (let i = 0; i < 2; i++) {
      ctx.beginPath();
      ctx.moveTo(-cs/4, cs/8);
      ctx.lineTo(-cs/6, -cs/8);
      ctx.lineTo(cs/14, cs/20);
      ctx.lineTo(cs/8, -cs/6);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(cs/8+cs/12, -cs/6);
      ctx.lineTo(cs/8-cs/12, -cs/6);
      ctx.lineTo(cs/8, -cs/6-cs/8);
      ctx.closePath();
      ctx.stroke();
      ctx.translate(cs/16, cs/5);
      ctx.rotate(0.2);
    }
    ctx.restore();
  },
  use: () => { bus.emit('projectile', 4) }
},
{
  // Blows up everything on the screen
  color: [255, 160, 30],
  title: ['Tactical', 'Nuke'],
  cost: 4,
  price: 20,
  glyph: function (ctx, cs) {
    ctx.save();
    ctx.lineWidth = cs * 0.05;
    ctx.lineCap='round';
    ctx.beginPath();
    ctx.arc(0, 0, cs/3, 0, 6.29);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(0, 0, cs/20, 0, 6.29);
    ctx.stroke();
    ctx.rotate(0.5);
    for (let i = 0; i < 3; i++) {
      ctx.beginPath();
      ctx.arc(0,0, cs/4, -0.4, 0.4, false);
      ctx.arc(0,0, cs/8, 0.4, -0.4, true);
      ctx.closePath();
      ctx.stroke();
      ctx.rotate(2.1);
    }
    ctx.restore();
  },
  use: () => { bus.emit('projectile', 5) }
},
{
  // Move to a new random channel
  color: [255, 70, 255],
  title: ['Quantum', 'Hopper'],
  cost: 1,
  price: 5,
  glyph: function (ctx, cs) {
    ctx.save();
    ctx.lineWidth = cs * 0.05;
    ctx.lineCap='round';
    ctx.beginPath();
    ctx.arc(0, cs/5, cs/14, 0, 6.29);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(0, 0, cs/14, 0, 6.29);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(0, -cs/5, cs/14, 0, 6.29);
    ctx.stroke();
    ctx.restore();
  },
  use: () => { bus.emit('hop', 2) }
},
{
  // Jump through obstacle in front of you
  color: [255, 70, 255],
  title: ['Shadow', 'Dash'],
  cost: 2,
  price: 10,
  glyph: function (ctx, cs) {
    ctx.save();
    ctx.lineWidth = cs * 0.05;
    ctx.lineCap='round';
    ctx.translate(-cs/20, cs/10);
    ctx.rotate(0.6);
    ctx.beginPath();
    ctx.arc(0, 0, cs/10, 0, 6.29);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, -cs/6);
    ctx.lineTo(0, -cs/3);
    ctx.moveTo(0, cs/6);
    ctx.lineTo(0, cs/4);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(-cs/12, -cs/3);
    ctx.lineTo(cs/12, -cs/3);
    ctx.lineTo(0, -cs/2);
    ctx.closePath();
    ctx.stroke();
    ctx.restore();
  },
  use: () => { bus.emit('dash') }
},
{
  // Regenerate one shield
  color: [255, 70, 255],
  title: ['Shield', 'Charger'],
  cost: 3,
  price: 15,
  glyph: function (ctx, cs) {
    ctx.save();
    ctx.lineWidth = cs * 0.05;
    ctx.lineCap='round';
    ctx.beginPath();
    ctx.arc(0, 0, cs/4, 0, 6.29);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(-cs/7, 0);
    ctx.lineTo(cs/7, 0);
    ctx.moveTo(0, -cs/7);
    ctx.lineTo(0, cs/7);
    ctx.stroke();
    ctx.restore();
  },
  use: () => { bus.emit('heal') }
},
{
  // Siphon all minerals on screen toward you
  color: [255, 70, 255],
  title: ['Mineral', 'Siphon'],
  cost: 3,
  price: 15,
  glyph: function (ctx, cs) {
    ctx.save();
    ctx.lineWidth = cs * 0.05;
    ctx.lineCap='round';
    for (let i = 0; i < 3; i++) {
      ctx.save();
      ctx.translate((1-(i-1)*(i-1))*cs/5, (i-1) * cs/5);
      ctx.beginPath();
      ctx.moveTo(-cs/12, 0);
      ctx.lineTo(0, -cs/10);
      ctx.lineTo(cs/12, 0);
      ctx.lineTo(0, cs/10);
      ctx.closePath();
      ctx.stroke();
      ctx.restore();
    }
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(-cs/3, 0);
    ctx.moveTo(-cs/8, cs/10);
    ctx.lineTo(-cs/3, 0);
    ctx.moveTo(-cs/8, -cs/10);
    ctx.lineTo(-cs/3, 0);
    ctx.stroke();
    ctx.restore();
  },
  use: () => { bus.emit('mine') }
},
{
  // Advance 15% of the journey with no damage
  color: [255, 70, 255],
  title: ['Hyper', 'Drive'],
  cost: 4,
  price: 20,
  glyph: function (ctx, cs) {
    ctx.save();
    ctx.lineWidth = cs * 0.05;
    ctx.lineCap='round';
    ctx.beginPath();
    ctx.moveTo(-cs/6, -cs/4);
    ctx.lineTo(cs/6, -cs/4);
    ctx.lineTo(-cs/6, cs/4);
    ctx.lineTo(cs/6, cs/4);
    ctx.closePath()
    ctx.stroke();
    ctx.restore();
  },
  use: () => { bus.emit('hyper') }
},
{
  // Increase max shield
  color: [0, 255, 255],
  title: ['Defense', 'Blessing'],
  cost: 0,
  price: 25,
  glyph: function (ctx, cs) {
    ctx.save();
    ctx.lineWidth = cs * 0.05;
    ctx.beginPath();
    ctx.arc(0,0,cs/3,0,6.29);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(0,0,cs/7,0,6.29);
    ctx.stroke();
    ctx.restore();
  },
  use: () => { persist.setMaxShield(persist.getMaxShield() + 1) }
},
{
  // Increase max energy
  color: [255, 255, 0],
  title: ['Strength', 'Blessing'],
  cost: 0,
  price: 25,
  glyph: function (ctx, cs) {
    ctx.save();
    ctx.lineWidth = cs * 0.05;
    ctx.lineCap='round';
    ctx.translate(0,-cs/10);
    ctx.strokeRect(-cs/4,-cs/6, cs/2,cs*0.6);
    ctx.strokeRect(-cs/10,-cs/4, cs/5,-cs/8);
    ctx.translate(0,cs/7);
    ctx.beginPath();
    ctx.moveTo(-cs/10, -cs/6);
    ctx.lineTo(cs/10, -cs/6);
    ctx.lineTo(-cs/20, 0);
    ctx.lineTo(cs/20, 0);
    ctx.lineTo(0, cs/6);
    ctx.stroke();
    ctx.restore();
  },
  use: () => { persist.setMaxEnergy(persist.getMaxEnergy() + 1) }
},
{
  // Increase max hand size
  color: [200, 200, 200],
  title: ['Vision', 'Blessing'],
  cost: 0,
  price: 25,
  glyph: function (ctx, cs) {
    ctx.save();
    ctx.lineWidth = cs * 0.05;
    ctx.lineCap='round';
    ctx.strokeRect(-cs*0.25,0,cs*0.2,cs*0.3);
    ctx.strokeRect(cs*0.05,0,cs*0.2,cs*0.3);
    ctx.strokeRect(-cs*0.1,-cs*0.4,cs*0.2,cs*0.3);
    ctx.restore();
  },
  use: () => { persist.setHandSize(persist.getHandSize() + 1) }
},
];
export default cards;