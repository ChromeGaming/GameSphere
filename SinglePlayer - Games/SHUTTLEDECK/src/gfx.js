import * as canvas from './canvas.js';

export function drawStars(ctx, x, y, vx, vy) {
  const w = canvas.width();
  const h = canvas.height();
  const N = Math.sqrt(w * h) / 10;
  ctx.beginPath();
  ctx.strokeStyle = '#aaa';
  ctx.fillStyle = '#ddd';
  ctx.lineWidth = 0.5;
  for (let i = 0; i < N; i++) {
    let s = 1 + (Math.sin(i * i * 1217 + i * i * i * 983) * 0.5 + 0.5) * 5;
    let ax = (1234918 * i * i + i * i * i * i * 2291722 + x * s) % (w+100)-50;
    let ay = (3000182 * i * i * i * i + i * i * i * i * i * 500291 + y * s) % (h+100)-50;
    ctx.moveTo(ax, ay);
    ctx.lineTo(ax+vx*s, ay+vy*s);
    ctx.fillRect(ax-1, ay-1, 2, 2);
  }
  ctx.stroke();
}

export function drawCard(ctx, x, y, cs, card, hovering, opacity) {
  ctx.save();

  if (hovering) {
    cs *= 1.04;
  }

  // faded color
  var netColor = `rgba(${card.color[0]},${card.color[1]},${card.color[2]},${opacity})`;

  // dimensions
  var csw = cs / 2;
  var csh = csw * 1.5;

  // position
  ctx.translate(x, y);

  // background
  if (hovering) {
    ctx.fillStyle = `rgb(80,80,80,${0.7 * opacity})`;
  } else {
    ctx.fillStyle = `rgb(50,50,50,${0.7 * opacity})`;
  }
  ctx.fillRect(-csw,-csh,csw*2,csh*2);

  // light sheen
  ctx.save();
  ctx.beginPath();
  ctx.rect(-csw,-csh,csw*2,csh*2);
  ctx.clip();
  ctx.fillStyle = `rgba(220,230,250,${0.3 * opacity})`;
  ctx.rotate(-0.3);
  ctx.translate(cs/2, (Date.now() % 2000) / 1000 * (cs * 5) - cs*1.2);
  ctx.fillRect(-cs*2,0,cs*4,cs*0.2);
  ctx.fillRect(-cs*2,-cs*0.2,cs*4,cs*0.05);
  ctx.restore();

  // outline
  ctx.beginPath();
  ctx.lineWidth = cs / 20;
  ctx.lineJoin = 'round';
  ctx.strokeStyle = netColor;
  ctx.moveTo(-csw, -csh);
  ctx.lineTo(csw, -csh);
  ctx.lineTo(csw, csh);
  ctx.lineTo(-csw, csh);
  ctx.closePath();
  ctx.stroke();

  // glyph
  ctx.save();
  ctx.translate(0, -cs * 0.15);
  card.glyph(ctx, cs);

  // cost
  ctx.translate(0, -cs * 0.52);
  ctx.fillStyle = `rgba(255,255,51,${opacity})`;
  var es = cs * 0.12;
  for (let i = 0; i < card.cost; i++) {
    ctx.fillRect((i - (card.cost - 1) / 2) * es * 1.1 - es * 0.45, 0, es * 0.9, es * 0.9);
  }
  ctx.restore();

  // text
  ctx.fillStyle = netColor;
  ctx.textBaseline = 'middle';
  ctx.font = `${cs/6}px monospace`;
  ctx.textAlign = 'center';
  var lines = card.title;
  for (let i = 0; i < lines.length; i++) {
    ctx.fillText(lines[i], 0, csh * 0.65 + (i - (lines.length - 1) / 2) * csh * 0.2);
  }
  ctx.restore();
}

export function drawMineral(ctx, x, y, angle, s) {
  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = '#f3f';
  ctx.rotate(angle);
  ctx.fillRect(-s, -s, 2*s, 2*s);
  s *= 0.6;
  ctx.fillStyle = '#fbf';
  ctx.fillRect(-s, -s, 2*s, 2*s);
  ctx.restore();
}

export function drawShield(ctx, x, y, r, isFull) {
  ctx.fillStyle = '#333';
  ctx.beginPath();
  ctx.arc(x, y, r, 0, 6.28);
  ctx.fill();
  if (isFull) {
    ctx.fillStyle = '#3ff';
    ctx.beginPath();
    ctx.arc(x, y, r*0.65, 0, 6.28);
    ctx.fill();
  }
}

export function drawEnergy(ctx, x, y, r, isFull) {
  ctx.fillStyle = '#333';
  ctx.fillRect(x, y, r*0.8, r);
  if (isFull) {
    ctx.fillStyle = '#ff3';
    ctx.fillRect(x + r*0.175, y + r*0.175, r*0.45, r*0.65);
  }
}

export function drawDeck(ctx, x, y, s) {
  ctx.save();
  ctx.strokeStyle = '#ccc';
  ctx.fillStyle = '#222';
  ctx.lineWidth = s*0.1;
  var step = s * 0.5;
  ctx.translate(x-step, y+step);
  ctx.fillRect(-s, -s*1.5, 2*s, 3*s);
  ctx.strokeRect(-s, -s*1.5, 2*s, 3*s);
  ctx.translate(step, -step);
  ctx.fillRect(-s, -s*1.5, 2*s, 3*s);
  ctx.strokeRect(-s, -s*1.5, 2*s, 3*s);
  ctx.translate(step, -step);
  ctx.fillRect(-s, -s*1.5, 2*s, 3*s);
  ctx.strokeRect(-s, -s*1.5, 2*s, 3*s);
  ctx.restore();
}

export function drawCharPlayer(ctx) {
  var w = canvas.width();
  var h = canvas.height();
  var s = Math.min(h * 0.075, w * 0.1);
  ctx.save();
  ctx.translate(s*1.2, h + Math.sin(Date.now()*0.003)*s*0.1);
  // Torso
  ctx.fillStyle='#bbb';
  ctx.beginPath();
  ctx.arc(-s*0.1, s*0.1, s*1.4, 0, 6.29);
  ctx.fill();
  // Head
  ctx.fillStyle='#eee';
  ctx.beginPath();
  ctx.arc(0, -s*1.9, s, 0, 6.29);
  ctx.fill();
  // Visor
  ctx.fillStyle='#3af';
  ctx.fillRect(-s*0.1,-s*2.1,s,s*0.4);
  ctx.restore();
}

export function drawCharZoren(ctx, col='#3b5') {
  var w = canvas.width();
  var h = canvas.height();
  var s = Math.min(h * 0.075, w * 0.1);
  ctx.save();
  ctx.translate(w-s*1.2, h+Math.sin(Date.now()*0.0021+3)*s*0.1);
  // Torso
  ctx.fillStyle=col;//'#8a8';
  ctx.fillRect(-s*0.5,-s*1.5,s*1.4,s*2);
  ctx.fillStyle='#666';
  ctx.fillRect(-s*0.2,-s*1.5,s*0.1,s*2);
  ctx.fillRect(-s*0.35,-s*0.8,s*0.1,s*0.1);
  ctx.fillRect(-s*0.35,-s*0.6,s*0.1,s*0.1);
  // Head
  ctx.fillStyle='#fdb';
  ctx.beginPath();
  ctx.arc(0, -s*1.8, s, 0, 6.29);
  ctx.fill();
  // Glasses
  ctx.fillStyle='#333';
  ctx.fillRect(-s*1,-s*1.95,s*1.6,s*0.1);
  ctx.fillStyle=col;
  ctx.beginPath();
  ctx.arc(-s*0.8,-s*1.8,s*0.3,0,6.29);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(-s*0.1,-s*1.8,s*0.3,0,6.29);
  ctx.fill();
  ctx.restore();
}

export function drawCharWeaponTech(ctx) {
  var w = canvas.width();
  var h = canvas.height();
  var s = Math.min(h * 0.075, w * 0.1);
  ctx.save();
  ctx.translate(w-s*1.2, h+Math.sin(Date.now()*0.0021+3)*s*0.1);
  // Torso
  ctx.fillStyle='#d72';
  ctx.beginPath();
  ctx.ellipse(s*0.1, s*0.1, s*1.0, s*1.4, 0, 0, 6.29);
  ctx.fill();
  // Head
  ctx.fillStyle='#f94';
  ctx.beginPath();
  ctx.arc(0, -s*1.9, s, 0, 6.29);
  ctx.fill();
  // Ears
  ctx.fillRect(-s*0.8,-s*2.3,s*0.4,-s);
  ctx.fillRect(s*0.4,-s*2.4,s*0.4,-s);
  // Eye
  ctx.fillStyle='#fff';
  ctx.beginPath();
  ctx.ellipse(-s*0.3, -s*2, s*0.5, s*0.3, 0, 0, 6.29);
  ctx.fill();
  ctx.fillStyle='#222';
  ctx.beginPath();
  ctx.arc(-s*0.4, -s*2, s*0.2, 0, 6.29);
  ctx.fill();
  ctx.restore();
}

export function drawCharShipMech(ctx) {
  var w = canvas.width();
  var h = canvas.height();
  var s = Math.min(h * 0.075, w * 0.1);
  ctx.save();
  ctx.translate(w-s*1.2, h+Math.sin(Date.now()*0.0021+3)*s*0.1);
  // Torso
  ctx.fillStyle='#77b';
  ctx.fillRect(-s*1.1, -s*1.5, s*2.2, s*2);
  ctx.fillStyle='#669';
  ctx.fillRect(s*0.9, -s*1.5, s*0.2, s*2);
  // Head
  ctx.fillStyle='#338';
  ctx.fillRect(s*0.5, -s*2.7, s*0.3, s*1.25);
  ctx.fillRect(-s*0.2, -s*2.7, s*0.1, -s*0.8);
  ctx.fillStyle='#55a';
  ctx.fillRect(-s*0.8, -s*2.7, s*1.3, s*1.25);
  // Eyes
  ctx.fillStyle='#ff4';
  ctx.fillRect(-s*0.25, -s*3.4, s*0.2, -s*0.2);
  ctx.fillRect(-s*0.7, -s*2.5, s*0.4, s*0.2);
  ctx.fillRect(-s*0.2, -s*2.5, s*0.4, s*0.2);
  ctx.restore();
}

export function drawCharMerchant(ctx) {
  var w = canvas.width();
  var h = canvas.height();
  var s = Math.min(h * 0.075, w * 0.1);
  ctx.save();
  ctx.translate(w-s*1.2, h+Math.sin(Date.now()*0.0021+3)*s*0.1);
  // Torso
  ctx.fillStyle='#b31';
  ctx.beginPath();
  ctx.ellipse(s*0.4, s*0.1, s*0.8, s*1.8, 0, 0, 6.29);
  ctx.fill();
  // Head
  ctx.fillStyle='#d74';
  ctx.beginPath();
  ctx.arc(0, -s*1.6, s*0.6, 0, 6.29);
  ctx.fill();
  // Eye holders
  ctx.strokeStyle='#d74';
  ctx.beginPath();
  ctx.lineWidth = s * 0.1;
  ctx.moveTo(-s*0.4, -s*2.0);
  ctx.lineTo(-s*0.7, -s*3.0);
  ctx.moveTo(-s*0.1, -s*2.0);
  ctx.lineTo(-s*0.1, -s*3.2);
  ctx.moveTo(s*0.2, -s*2.0);
  ctx.lineTo(s*0.4, -s*3.0);
  ctx.stroke();
  // Eye balls
  ctx.fillStyle='#eee';
  ctx.beginPath();
  ctx.arc(-s*0.7, -s*3.0,s*0.2,0,6.29);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(-s*0.1, -s*3.2,s*0.2,0,6.29);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(s*0.4, -s*3.0,s*0.2,0,6.29);
  ctx.fill();
  // Eye pupils
  ctx.fillStyle='#611';
  ctx.beginPath();
  ctx.arc(-s*0.78, -s*3.0,s*0.1,0,6.29);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(-s*0.18, -s*3.2,s*0.1,0,6.29);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(s*0.32, -s*3.0,s*0.1,0,6.29);
  ctx.fill();
  ctx.restore();
}

export function drawCharSmuggler(ctx) {
  var w = canvas.width();
  var h = canvas.height();
  var s = Math.min(h * 0.075, w * 0.1);
  ctx.save();
  ctx.translate(w-s*1.2, h+Math.sin(Date.now()*0.0021+3)*s*0.1);
  // Torso
  ctx.fillStyle='#343';
  ctx.beginPath();
  ctx.arc(s*0.2, 0, s*0.6, 0, 6.29);
  ctx.fill();
  ctx.fillStyle='#353';
  ctx.beginPath();
  ctx.arc(s*0.5, -s*0.7, s*0.6, 0, 6.29);
  ctx.fill();
  ctx.fillStyle='#363';
  ctx.beginPath();
  ctx.arc(s*0.4, -s*1.4, s*0.6, 0, 6.29);
  ctx.fill();
  // Head
  ctx.fillStyle='#474';
  ctx.beginPath();
  ctx.arc(0, -s*1.9, s*0.8, 0, 6.29);
  ctx.fill();
  // Eyes
  ctx.fillStyle='#3f3';
  ctx.beginPath();
  ctx.arc(-s*0.6, -s*2.1, s*0.07, 0, 6.29);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(-s*0.4, -s*2.08, s*0.07, 0, 6.29);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(-s*0.65, -s*1.9, s*0.07, 0, 6.29);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(-s*0.45, -s*1.88, s*0.07, 0, 6.29);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(-s*0.62, -s*1.7, s*0.07, 0, 6.29);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(-s*0.42, -s*1.68, s*0.07, 0, 6.29);
  ctx.fill();
  ctx.restore();
}

export function drawCharTemplar(ctx) {
  var w = canvas.width();
  var h = canvas.height();
  var s = Math.min(h * 0.075, w * 0.1);
  ctx.save();
  ctx.translate(w-s*1.2, h+Math.sin(Date.now()*0.0021+3)*s*0.1-s*0.5);
  // Brain
  ctx.fillStyle='#46c';
  ctx.beginPath();
  ctx.arc(-s*0.2, -s*1.5, s*0.4, 0, 6.29);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(s*0.2, -s*1.4, s*0.3, 0, 6.29);
  ctx.fill();
  // Mount
  ctx.fillStyle='rgba(100,100,255,0.3)';
  ctx.beginPath();
  ctx.arc(0, -s*0.95, s*1.1, -3.14, 0);
  ctx.fill();
  ctx.fillStyle='#db3';
  ctx.fillRect(-s*1.2, -s, s*2.4, s*0.3);
  ctx.fillRect(-s*0.6, -s*0.55, s*1.2, s*0.2);
  ctx.fillRect(-s*0.3, -s*0.2, s*0.6, s*0.1);
  ctx.restore();
}

var lineBreaks = (ctx, txt, maxWidth) => {
  var str = '';
  var lines = [];
  for (let i = 0; i < txt.length; i++) {
    str += txt[i];
    if (ctx.measureText(str).width > maxWidth) {
      var ls = str.lastIndexOf(' ');
      var ps = str.substring(0, ls);
      lines.push(ps.trim());
      str = str.substring(ls);
    }
  }
  if (str.trim().length > 0) {
    lines.push(str.trim());
  }
  return lines;
}
var getTextLines = (ctx, txt, w, h, maxWidth) => {
  var r = textLineMap[txt];
  if (r) {
    if (r.w == w && r.h == h) {
      return r.lines;
    }
  }
  var l = lineBreaks(ctx, txt, maxWidth);
  textLineMap[txt] = {w,h,lines:l};
  return l;
}
var textLineMap = {};

export function drawDialogBox(ctx, title, txt) {
  var w = canvas.width();
  var h = canvas.height();
  var s = Math.min(h * 0.075, w * 0.1);
  var ts = Math.max(w * 0.09, h * 0.08);
  ctx.save();
  // Dialog box
  ctx.fillStyle = '#236';
  ctx.strokeStyle = '#3af';
  ctx.lineWidth = s * 0.1;
  ctx.beginPath();
  ctx.moveTo(s*2.8,h*0.75);
  ctx.lineTo(w-s*2.8,h*0.75);
  ctx.lineTo(w-s*2.8,h-s*1.8);
  ctx.lineTo(w-s*2.5,h-s*1.6);
  ctx.lineTo(w-s*2.8,h-s*1.4);
  ctx.lineTo(w-s*2.8,h-s*0.2);
  ctx.lineTo(s*2.8,h-s*0.2);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // title text
  ctx.fillStyle='#ff3';
  ctx.textAlign='left';
  ctx.font=`${ts*0.3}px monospace`;
  ctx.fillText(title, s*3, h*0.75+ts*0.25);

  // title text
  ctx.fillStyle='#fff';
  ctx.textAlign='left';
  ctx.font=`${ts*0.25}px monospace`;

  var lines = getTextLines(ctx, txt, w, h, w - s*6);
  for (let i = 0; i < lines.length; i++) {
    ctx.fillText(lines[i], s*3, h*0.75+ts*(2.1 + i)*0.3);
  }
  // Split line text
  ctx.restore();
}

export function drawItemShell(ctx, x, y, s) {
  ctx.save();
  ctx.translate(x, y);
  s/=2;
  ctx.fillStyle = '#333';
  ctx.strokeStyle = '#666';
  ctx.lineWidth = s*0.1;
  ctx.beginPath();
  ctx.arc(0, 0, s, 0, 6.29);
  ctx.fill();
  ctx.stroke();
  ctx.restore();
}

export function drawItemXeno(ctx, x, y, s) {
  ctx.save();
  ctx.translate(x, y);
  s/=2;
  ctx.fillStyle = '#ccd';
  ctx.fillRect(s*0.07, -s*0.7, s*0.15, s*0.7);
  ctx.beginPath();
  ctx.arc(s*0.1,-s*0.54,s*0.24,0,6.29);
  ctx.fill();
  ctx.fillStyle = '#b94';
  ctx.fillRect(-s*0.6, -s*0.1, s*1.2, s*0.7);
  ctx.fillRect(s*0.3, -s*0.3, s*0.4, s*0.5);
  ctx.fillStyle = '#aaa';
  ctx.textAlign='center';
  ctx.textBaseline='bottom';
  ctx.font=`${s*0.2}px monospace`;
  ctx.fillText('Xenotransponder',0,s*1.4);
  ctx.restore();
}