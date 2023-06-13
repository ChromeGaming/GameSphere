import * as gameobjects from './gameobjects.js';
import * as canvas from './canvas.js';
import * as gfx from './gfx.js';
import * as scene from './scene.js';
import persist from './persist.js';
import bus from './bus.js';
import cards from './cards.js';
import PlayedCard from './playedcard.js';
import PullCard from './pullcard.js';
import Asteroid from './asteroid.js';
import Mineral from './mineral.js';
import Projectile from './projectile.js';
import Poof from './poof.js';

export default function Engine() {
  var currLevel = persist.getLevel();

  // Card handling
  var cloneCard = (card) => Object.assign({}, card);
  var shuffle = (d) => d.sort(() => Math.random() - 0.5)
  var removeFromHand = (idx) => {
    discardPile.push(hand[idx]);
    hand[idx] = null;
  };
  var pullFromDeckToSlot = (slot) => {
    var idx = parseInt(Math.random() * deck.length);
    var pulledCard = deck[idx];
    deck.splice(idx, 1);

    // pull card animation
    var w = canvas.width();
    var h = canvas.height();
    var cs = getCardScale(w, h);
    var x = getCardPosX(slot, cs, w);
    var y = getCardPosY(h);
    gameobjects.add(new PullCard(this, x, y, pulledCard, cs, slot));

    // reshuffle deck
    if (deck.length == 0) {
      deck = discardPile;
      shuffle(deck);
      discardPile = [];
    }
  };
  var getCardScale = (w, h) => Math.min(w * (0.95 / (1 + handSize)), h * 0.185);
  var getCardPosX = (q, cs, w) => w * 0.5 + (q - (handSize - 1) / 2) * cs * 1.17;
  var getCardPosY = (h) => h * 0.735;

  // The cards in the deck
  var deck = persist.getDeck().map(cloneCard);
  var discardPile = [];
  shuffle(deck);

  // The cards in hand
  var handSize = persist.getHandSize();
  var hand = [];
  for (let i = 0; i < handSize; i++) {
    pullFromDeckToSlot(i);
  }
  var hovering = -1;

  // Ship position
  var currentLane = 1;
  var laneAnim = 1;
  var shipAngle = 0;
  var dashing = 0;
  var dashSpeed = 0;

  // Shields = HP, Energy = MP
  var maxShield = persist.getMaxShield();
  var shield = maxShield;
  var maxEnergy = persist.getMaxEnergy();
  var energy = maxEnergy;
  var energyRefill = 0;
  var energyRefillRate = 0.75;

  var totalTicks = 20 + currLevel * 2;
  var currentTick = 0;
  var tickAnim = 0;
  var anim = 0;

  // events handlers
  // HOVERING animation may be worth removing for some bytes :O
  const getHoverIndex = (evt) => {
    const w = canvas.width();
    const h = canvas.height();
    const mx = evt.x, my = evt.y;

    var hov = -1;
    var cardsInHand = hand.length;
    var cs = Math.min(w * (0.95 / (1 + cardsInHand)), h * 0.185);

    for (let q = 0; q < cardsInHand; q++) {
      var x = w * 0.5 + (q - (cardsInHand - 1) / 2) * cs * 1.17;
      var y = h * 0.735;
      if (mx > x - cs/2 && mx < x + cs/2 && my > y - cs*3/4 && my < y + cs*3/4) {
        hov = q;
      }
    }
    return hov;
  };

  bus.on('tap', (evt) => {
    var hov = getHoverIndex(evt);
    if (hov>=0 && hand[hov] != null) {
      cost = hand[hov].cost;
      if (energy >= cost) {
        energy -= cost;
        hand[hov].use();
        var w = canvas.width();
        var h = canvas.height();
        var cs = getCardScale(w, h);
        var x = getCardPosX(hov, cs, w);
        var y = getCardPosY(h);
        gameobjects.add(new PlayedCard(x, y, hand[hov], cs));
        removeFromHand(hov);
        pullFromDeckToSlot(hov);
      }
    }
  });

  bus.on('move', (evt) => {
    hovering = getHoverIndex(evt);
  });

  bus.on('lane', (lane) => {
    currentLane = lane;
  });

  bus.on('hop', () => {
    var newLane = currentLane;
    while (newLane == currentLane) {
      newLane = parseInt(Math.random() * 3);
    }
    var sx = this.getShipX();
    var sc = this.laneScale();
    for (let i = 0; i < 3; i++) {
      sz = 0.3;
      var col = [255, 0, 255];
      if (i == newLane) { sz = 1; col = [100, 255, 100]; }
      gameobjects.add(new Poof(this, sx+sc*2, this.laneY(i), col, sz, 0.7));
    }
    currentLane = newLane;
  });

  bus.on('dash', () => {
    dashing = 0.5;
    dashSpeed = 2;
  });

  bus.on('hyper', () => {
    dashing = 0.4;
    dashSpeed = 10;
  });

  bus.on('heal', () => {
    shield = Math.min(shield + 1, maxShield);
    gameobjects.add(new Poof(this, this.getShipX(), this.getShipY(), [0, 255, 0], 1, 0.5));
  });

  bus.on('poof', ({x, y, color, size, t}) => {
    gameobjects.add(new Poof(this, x, y, color, size, t));
  });

  bus.on('projectile', (projectileType) => {
    // Kepler Missile, Sigma Cannon, Tactical Nuke
    if (projectileType == 1 || projectileType == 2 || projectileType == 5) {
      gameobjects.add(new Projectile(this, this.getShipX(), this.getShipY(), currentLane, projectileType));
    }
    // Pulse breaker
    if (projectileType == 3) {
      gameobjects.add(new Projectile(this, this.getShipX(), this.laneY(0), 0, projectileType));
      gameobjects.add(new Projectile(this, this.getShipX(), this.laneY(1), 1, projectileType));
      gameobjects.add(new Projectile(this, this.getShipX(), this.laneY(2), 2, projectileType));
    }
    // Crazy Rockets
    if (projectileType == 4) {
      var s = this.laneScale();
      var p1 = new Projectile(this, this.getShipX(), this.getShipY()-s/2, currentLane, projectileType);
      var p2 = new Projectile(this, this.getShipX(), this.getShipY()+s/2, currentLane, projectileType);
      var targets = gameobjects.get().filter((g) => g.obstacle && g.x > s*3);
      var idx = parseInt(Math.random() * targets.length);
      p1.homing = targets[idx]; targets.splice(idx,1);
      var idx = parseInt(Math.random() * targets.length);
      p2.homing = targets[idx]; targets.splice(idx,1);
      gameobjects.add(p1);
      gameobjects.add(p2);
    }
  });

  bus.on('place', ({slot, card}) => {
    hand[slot] = card;
  });

  bus.on('hit', (dmg) => {
    shield -= dmg;
    if (shield <= 0) {
      scene.transition(4);
    }
    bus.emit('poof', {x: this.getShipX(), y: this.getShipY(), color: [255,255,255], size: 1, t: 0.5});
  });

  bus.on('mineral', (m) => {
    persist.addMineral(m);
  });

  // Actually put stuff on the playing field.
  var generateContent = () => {
    if (currentTick > totalTicks - 7 || dashSpeed > 4) {
      return;
    }
    var lanes = {};

    // Asteroid (more frequent as levels progress)
    for (let q = 0; q < 0.1 + currLevel * 0.15; q++) {
      if (Math.random() > 0.7 / (1 + currLevel * 0.04)) {
        var lane = parseInt(Math.random()*3);
        if (!lanes[lane]) {
          lanes[lane] = 1;
          gameobjects.add(new Asteroid(this, currentTick, lane));
        }
      }
    }

    // Minerals
    if (Math.random() > 0.6) {
      var lane = parseInt(Math.random()*3);
      if (!lanes[lane]) {
        lanes[lane] = 1;
        gameobjects.add(new Mineral(this, currentTick, lane, 1));
      }
    }
  };

  this.hasEnergy = (card) => energy >= card.cost;

  this.laneY = (slot) => {
    var h = canvas.height();
    if (slot == 0) return h * 0.18;
    if (slot == 1) return h * 0.34;
    return h * 0.5;
  }

  this.laneX = (tick) => {
    var w = canvas.width(), h = canvas.height();
    var ticksInView = 5;
    var shipX = 50 + w/40 + this.laneScale();
    return shipX + (1 - (currentTick + tickAnim - tick) / ticksInView) * (w + shipX);
  }

  this.laneScale = () => {
    var w = canvas.width(), h = canvas.height();
    const ph = h * 0.16;
    return Math.min(ph, w/8) * 0.3;
  }

  this.getTick = () => currentTick;

  this.getShipX = () => {
    var w = canvas.width();
    return 50 + w/40 + this.laneScale();
  };

  this.getShipY = () => {
    var h = canvas.height();
    return h * 0.18 + laneAnim * h * 0.16;
  };

  this.closeToShip = (x, y, dist) => {
    if (dashing > 0) return false;
    var s = this.laneScale();
    var dx = x - this.getShipX();
    var dy = y - this.getShipY();
    return dx * dx + dy * dy < s * s * dist;
  };

  this.collideTargets = (x, y, dist) => {
    var s = this.laneScale();
    var hit = false;
    gameobjects.get().forEach((g) => {
      if (g.obstacle) {
        var dx = x - g.x;
        var dy = y - g.y;
        if (dx * dx + dy * dy < s * s * dist) {
          hit = true;
          g.destroyed = true;
        }
      }
    });
    return hit;
  };

  this.update = (dT) => {
    anim += dT;
    if (anim > 1) {
      if (dashing > 0) {
        dashing -= dT;
        tickAnim += dT * dashSpeed;
        anim += dT * dashSpeed * 2;
      } else {
        dashSpeed = 0;
      }
      tickAnim += dT * 2;
    }
    if (tickAnim > 1) {
      tickAnim--;
      currentTick++;
      generateContent();

      // Journey finished -- visit planet now
      if (currentTick > totalTicks) {
        // 13'th zero indexed planet ==> Korva-6
        if (currLevel == 13) {
          // Victory!
          scene.transition(5);
        } else {
          // Planet Event
          scene.transition(3);
        }
      }
    }

    // Energy refill
    if (energy < maxEnergy) {
      energyRefill += energyRefillRate * dT;
      if (energyRefill >= 1) {
        energyRefill -= 1;
        energy++;
      }
    } else {
      energyRefill = 0;
    }

    // Animate tween
    shipAngle += ((currentLane - laneAnim) * 0.5 - shipAngle) * 7.0 * dT;
    laneAnim += (currentLane - laneAnim) * 5.0 * dT;
  };

  this.render = (ctx) => {
    // Screen dimensions
    const w = canvas.width();
    const h = canvas.height();

    // Lane placements (PillWidth, PillHeight, Top, Mid, Bottom)
    const pw = w / 40;
    const ph = h * 0.16;
    const th = h * 0.1;
    const mh = th + ph;
    const bh = mh + ph;

    // Scale of the art
    const s = Math.min(ph, w/8) * 0.3;

    // Starmap
    gfx.drawStars(ctx, -anim*20, 0, 3 + dashSpeed, 0);

    // Planets
    var r = h * 0.3;
    ctx.fillStyle = '#224';
    ctx.beginPath();
    ctx.arc(-(currentTick + tickAnim) / 10 * w, h * 0.34, r, 0, 6.28);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(-(currentTick + tickAnim - totalTicks) / 10 * w + w*0.4, h * 0.34, r, 0, 6.28);
    ctx.fill();

    // Minimap
    // Progress path
    var pr=h*0.02;
    ctx.fillStyle = '#446';
    ctx.fillRect(15 + pw, th/2, w - 30 - 2*pw, 1);
    // Source planet
    ctx.fillStyle = '#446';
    ctx.beginPath();
    ctx.arc(15 + pr, th/2, pr, 0, 6.28);
    ctx.fill();
    // Dest planet
    ctx.fillStyle = '#446';
    ctx.beginPath();
    ctx.arc(w - 15 - pr, th/2, pr, 0, 6.28);
    ctx.fill();
    // Progress ship
    ctx.fillStyle = '#fff';
    var px = 15 + pw + (w - 30 - 2*pw) * ((currentTick + tickAnim)/(totalTicks+1));
    ctx.beginPath();
    ctx.moveTo(px+pw/3, th/2);
    ctx.lineTo(px-pw/3, th/2-pw/3);
    ctx.lineTo(px-pw/3, th/2+pw/3);
    ctx.closePath();
    ctx.fill();

    // Draw the lanes
    ctx.fillStyle = '#f33'; ctx.fillRect(15, th, pw, ph);
    ctx.fillStyle = '#3f3'; ctx.fillRect(15, mh, pw, ph);
    ctx.fillStyle = '#33f'; ctx.fillRect(15, bh, pw, ph);
    ctx.fillStyle = '#f33'; ctx.fillRect(w-15, th, -pw, ph);
    ctx.fillStyle = '#3f3'; ctx.fillRect(w-15, mh, -pw, ph);
    ctx.fillStyle = '#33f'; ctx.fillRect(w-15, bh, -pw, ph);
    ctx.fillStyle = 'rgba(100,100,100,0.4)';
    ctx.fillRect(15, th, w-30, 1);
    ctx.fillRect(15, mh, w-30, 1);
    ctx.fillRect(15, bh, w-30, 1);
    ctx.fillRect(15, bh+ph, w-30, 1);

    // Draw the main ship
    ctx.save();

    // base ship position
    ctx.translate(50 + pw + s, th + ph/2 + laneAnim * ph );
    ctx.rotate(shipAngle);

    // ship flames
    for (let i = 5; i >= 0; i--) {
      if (i < 1) {
        ctx.fillStyle = '#fd6';
      } else if (i < 3) {
        ctx.fillStyle = '#fa1';
      } else {
        ctx.fillStyle = '#a41';
      }
      ctx.beginPath();
      var spot = (Math.sin(anim*(i+1)*20) * 0.2 + 0.5);
      ctx.arc(-s - s * i * 0.1, Math.sin(-anim*40+i)*i*s/30, (s * spot) / (1.5 + i*0.3), 0, 6.29);
      ctx.fill();
    }

    // ship body + shaking
    ctx.translate(Math.sin(anim*30) * s/60, Math.sin(anim*35) * s/40);
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.moveTo(s, 0);
    ctx.lineTo(-s*0.65,-s*0.8);
    ctx.lineTo(-s*0.65,-s*0.3);
    ctx.lineTo(-s,-s*0.5);
    ctx.lineTo(-s,s*0.5);
    ctx.lineTo(-s*0.65,s*0.3);
    ctx.lineTo(-s*0.65,s*0.8);
    ctx.closePath();
    if (dashing > 0) {
      ctx.lineWidth = s * 0.1;
      ctx.strokeStyle = '#fff';
      ctx.stroke();
    } else {
      ctx.fill();
    }
    ctx.fillRect(-s*0.4,s*0.4,s,s*0.15);
    ctx.fillRect(-s*0.4,-s*0.4,s,-s*0.15);
    ctx.restore();

    // Draw energy
    var uiScale = Math.min(h * 0.025, w*0.035);
    var shieldTextLevel = h - uiScale;
    ctx.textBaseline = 'bottom';
    ctx.font = `${uiScale}px monospace`;
    ctx.textAlign = 'right';
    ctx.fillStyle = '#ff3';
    ctx.fillText('Energy', w - pw, shieldTextLevel);
    ctx.textAlign = 'right';
    ctx.fillText(energy, w - (pw + uiScale * 6), shieldTextLevel);
    ctx.textAlign = 'left';
    ctx.fillStyle = '#888';
    ctx.font = `${uiScale*0.8}px monospace`;
    ctx.fillText(`/ ${maxEnergy}`, w - (pw + uiScale * 5.7), shieldTextLevel);
    var cellWidth = uiScale * 1.2;
    for (let i = 0; i < maxEnergy; i++) {
      var sx = w - (pw + i * (cellWidth*0.8 + 4) + cellWidth);
      var sy = shieldTextLevel - cellWidth*2.4;
      gfx.drawEnergy(ctx, sx, sy, cellWidth, i < energy);
    }
    // energy refill meter
    ctx.fillStyle = '#333';
    var fillMeterScale = (cellWidth*0.8 + 4) * maxEnergy;
    ctx.fillRect(w - pw, shieldTextLevel - cellWidth*1.07, -fillMeterScale, 2);
    ctx.fillStyle = '#ff3';
    ctx.fillRect(w - pw, shieldTextLevel - cellWidth*1.07, -energyRefill * fillMeterScale, 2);

    // Draw shield
    var cellRadius = uiScale * 0.6;
    var energyTextLevel = h - uiScale;
    ctx.textBaseline = 'bottom';
    ctx.font = `${uiScale}px monospace`;
    ctx.textAlign = 'left';
    ctx.fillStyle = '#3ff';
    ctx.fillText('Shield', pw, energyTextLevel);
    ctx.textAlign = 'right';
    ctx.fillText(shield, pw + uiScale * 5.3, energyTextLevel);
    ctx.textAlign = 'left';
    ctx.fillStyle = '#888';
    ctx.font = `${uiScale*0.8}px monospace`;
    ctx.fillText(`/ ${maxShield}`, pw + uiScale * 5.6, energyTextLevel);
    for (let i = 0; i < maxShield; i++) {
      var sx = pw + i * (cellRadius*2.5 + 4) + cellRadius;
      var sy =  energyTextLevel - cellRadius*4;
      gfx.drawShield(ctx, sx, sy, cellRadius, i < shield);
    }

    // Draw mineral count
    var mineralTextLevel = h - uiScale;
    ctx.textBaseline = 'bottom';
    ctx.font = `${uiScale}px monospace`;
    ctx.textAlign = 'center';
    ctx.fillStyle = '#f3f';
    ctx.fillText(persist.getMinerals(), w*0.4, mineralTextLevel);
    gfx.drawMineral(ctx, w*0.4, mineralTextLevel-uiScale*2.1,0.785,uiScale*0.5);

    // Draw deck size remaining
    ctx.fillStyle = '#aaa';
    ctx.fillText(deck.length, w*0.6, mineralTextLevel);
    gfx.drawDeck(ctx, w*0.6, mineralTextLevel-uiScale*2.1,uiScale*0.4);

    // Draw cards
    var cardsInHand = hand.length;
    var cs = getCardScale(w, h);
    for (let q = 0; q < cardsInHand; q++) {
      if (hand[q] == null) continue;
      var x = getCardPosX(q, cs, w);
      var y = getCardPosY(h);
      var opacity = 1;
      if (energy < hand[q].cost) { opacity = 0.15; }
      gfx.drawCard(ctx, x, y, cs, hand[q], hovering == q, opacity);
    }
  };
};





