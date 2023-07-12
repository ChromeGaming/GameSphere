DEBUG = true;
GU = 10;
module = {};
function require() {}

CENTER = {
  x: 8,
  y: 4.5
};

RATIO = window.devicePixelRatio;

MOUSE = {x: 0, y: 0, left: false, right: false};

missedGFXFrames = 0;

Number.prototype.mod = function(n) {
  return ((this%n)+n)%n;
};

/* smoothstep interpolates between a and b, at time t from 0 to 1 */
function smoothstep(a, b, t) {
  var v = t * t * (3 - 2 * t);
  return b * v + a * (1 - v);
}

function lerp(a, b, t){
      return (a * t) + (b * (1 - t));
}

function clamp(low, x, high) {
  return Math.max(low, Math.min(x, high));
}

function loadImage(path) {
  var img = new Image();
  loaded++;
  img.onload = function() {
    loaded--;
  };
  img.src = path;
  return img;
}

window.requestAnimFrame = (function() {
  return window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function(callback) {
      window.setTimeout(callback, 0);
    };
})();

var MS_PER_UPDATE_FRAME = 1000 / 60;
var RENDER_FRAMES_SO_FAR_THIS_COUNT_PERIOD = 0;
var TIME_AT_RENDER_FRAME_COUNT_PERIOD_START = performance.now();
var UPDATE_FRAME = 0;
function loop() {
  requestAnimFrame(loop);
  if (loaded > 0) {
    canvas.width = canvas.width;
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "black";
    ctx.fillText("Loading " + loaded, CENTER.x * GU, CENTER.y * GU);
    t = old_time = performance.now();
    return;
  }
  t = performance.now();
  dt += (t - old_time);
  old_time = t;
  songTime = mm.music.currentTime;
  while (dt >= MS_PER_UPDATE_FRAME) {
    mm.update();
    sm.update();
    MOUSE.scrollX = 0;
    MOUSE.scrollY = 0;
    tick++;
    dt -= MS_PER_UPDATE_FRAME;
    UPDATE_FRAME++;
  }
  /* clearing canvas */
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  sm.render(ctx);
  RENDER_FRAMES_SO_FAR_THIS_COUNT_PERIOD += 1;

  var msSinceFPSCountPeriodStart = (performance.now() -
    TIME_AT_RENDER_FRAME_COUNT_PERIOD_START);
  if(msSinceFPSCountPeriodStart >= 1000) {
    FPS = RENDER_FRAMES_SO_FAR_THIS_COUNT_PERIOD * 1000 / msSinceFPSCountPeriodStart;
    RENDER_FRAMES_SO_FAR_THIS_COUNT_PERIOD = 0;
    TIME_AT_RENDER_FRAME_COUNT_PERIOD_START = performance.now();
  }
}

function bootstrap() {

  loaded = 1;

  /* global on purpose */
  canvas = document.createElement("canvas");
  ctx = canvas.getContext("2d");
  canvas.style.zIndex = 999;

  sm = new StateManager();
  mm = new MusicManager();

  AudioButton.prototype.sprite_on = loadImage("res/audio_on.png");
  AudioButton.prototype.sprite_off = loadImage("res/audio_off.png");

  dt = 0;
  tick = 0;
  t = 0;
  time = performance.now();
  old_time = time;
  KEYS = [];
  for (var i = 0; i < 256; i++) {
    KEYS[i] = false;
  }

  document.addEventListener("keydown", function(e) {
    KEYS[e.keyCode] = true;
  });

  document.addEventListener("keyup", function(e) {
    KEYS[e.keyCode] = false;
  });

  // prevent context menu from appearing on right click
  document.addEventListener('contextmenu', function(e) {
    if (e.button === 2) {
      e.preventDefault();
      return false;
    }
  }, false);

  document.addEventListener("mousedown", function(e) {
    if (e.button === 0) {
      MOUSE.left = true;
    } else if (e.button === 2) {
      MOUSE.right = true;
    }
  });

  document.addEventListener("mouseup", function(e) {
    if (e.button === 0) {
      MOUSE.left = false;
    } else if (e.button === 2) {
      MOUSE.right = false;
    }
  });

  MOUSE.scrollX = 0;
  MOUSE.scrollY = 0;
  document.addEventListener('wheel', function(e) {
    MOUSE.scrollX += e.deltaX;
    MOUSE.scrollY += e.deltaY;
  });

  /* add game states here */

  sm.addState("game", new GameState());
  sm.addState("menu", new MenuState());

  document.body.appendChild(canvas);

  resize({});

  /* start the game */

  sm.changeState("menu");
  mm.changeState('menu');
  if (DEBUG) {
    //sm.changeState("game"); // temporary hack to get in the game quickly
  }

  loaded--;
  requestAnimFrame(loop);
}

function resize(e) {
  if (window.innerWidth / window.innerHeight > 16 / 9) {
    GU = (window.innerHeight / 9) * RATIO;
  } else {
    GU = (window.innerWidth / 16) * RATIO;
  }
  if (typeof canvas !== "undefined") {
    canvas.width = 16 * GU;
    canvas.height = 9 * GU;
    var transform =  'scale3d(' + (1 / RATIO) + ', ' + (1 / RATIO) + ', 1)';
    if(RATIO == 1) {
      transform = '';
    }
    canvas.style.transform = transform;
    canvas.style.position = 'fixed';
    canvas.style.top = '50%';
    canvas.style.left = '50%';
    canvas.style.marginLeft = (-canvas.width / 2) + 'px';
    canvas.style.marginTop = (-canvas.height / 2) + 'px';
    var wrapper = document.getElementById('wrapper');
    wrapper.style.position = 'fixed';
    wrapper.style.transform = transform;
    wrapper.style.top = '50%';
    wrapper.style.left = '50%';
    wrapper.style.width = 16 * GU + 'px';
    wrapper.style.height = 9 * GU + 'px';
    wrapper.style.marginLeft = -16 * GU / 2 + 'px';
    wrapper.style.marginTop = -9 * GU / 2 + 'px';
    wrapper.style.fontSize = 0.15 * GU + 'px';
    wrapper.style.zIndex = 99999999;
  }
}

function relMouseCoords(e) {
  if (e.type !== "touchstart") {
    e.preventDefault();
  }
  if (typeof this.canvas === "undefined") {
    return {x: 0, y: 0};
  }
  var currentElement = this.canvas;
  var totalOffsetX = 0;
  var totalOffsetY = 0;
  var canvasX = 0;
  var canvasY = 0;

  do {
    totalOffsetX += currentElement.offsetLeft;
    totalOffsetY += currentElement.offsetTop;
  }
  while (currentElement = currentElement.offsetParent);

  canvasX = (e.pageX || (e.touches && e.touches[0] && e.touches[0].pageX) || (this.cached_coords.x + totalOffsetX)) - totalOffsetX;
  canvasY = (e.pageY || (e.touches && e.touches[0] && e.touches[0].pageY) || (this.cached_coords.y + totalOffsetY)) - totalOffsetY;

  return {x: (canvasX / GU - 8) * RATIO + 8, y: (canvasY / GU - 4.5) * RATIO + 4.5}
}

if (window.navigator.msPointerEnabled) {
  document.addEventListener("MSPointerDown", handleEvent);
  document.addEventListener("MSPointerMove", function(e) {
    e.preventDefault();
    e.stopPropagation();
    handleEvent(e);
    return false;
  });
} else {
  document.addEventListener('touchstart', handleEvent);
  document.addEventListener('click', handleEvent);
  document.addEventListener("mousemove", handleEvent);
  document.addEventListener('touchmove', function(e) {
    e.preventDefault();
    e.stopPropagation();
    handleEvent(e);
    return false;
  });
}

function handleEvent(e) {
  e.preventDefault();
  var position = relMouseCoords(e);
  MOUSE.x = position.x;
  MOUSE.y = position.y;
  var eventType = (e.type === "mousemove" || e.type === "touchmove" || e.type === "pointermove" ? "hover" : "click");
  var clickables = [];
  if (typeof sm === "undefined") {
    return;
  } else {
    clickables = sm.activeState.elements;
  }
  var coordX, coordY, sizeX, sizeY;
  var hoverOverClickable = false;
  for (var i = 0; i < clickables.length; i++) {
    coordX = clickables[i][1].x;
    coordY = clickables[i][1].y;
    sizeX = clickables[i][1].w;
    sizeY = clickables[i][1].h;
    if (MOUSE.x >= coordX && MOUSE.x <= coordX + sizeX && MOUSE.y >= coordY && MOUSE.y <= coordY + sizeY) {
      if (eventType === "click") {
        clickables[i][0](clickables[i].slice(2));
      } else if (eventType === "hover") {
        hoverOverClickable = true;
      }
      break;
    }
  }
  clickables && clickables[i] && clickables[i][1].hover && clickables[i][1].hover();
  $("body").css('cursor', hoverOverClickable ? "pointer" : "crosshair");
}

window.addEventListener('resize', resize);

/* global mixin for position/size-objects that do AABB collision with another posititon/size-object */
function contains(obj) {
  return obj.position.x < this.position.x + this.size.w &&
    obj.position.x + obj.size.w > this.position.x &&
    obj.position.y < this.position.y + this.size.h &&
    obj.position.y + obj.size.h > this.position.y;
}

// Array Remove - By John Resig (MIT Licensed)
Array.remove = function(array, from, to) {
  var rest = array.slice((to || from) + 1 || array.length);
  array.length = from < 0 ? array.length + from : from;
  return array.push.apply(array, rest);
};

function rotate(centerX, centerY, x, y, angle) {
  // https://stackoverflow.com/a/17411276/2319697
  const cos = Math.cos(angle),
    sin = Math.sin(angle),
    nx = (cos * (x - centerX)) + (sin * (y - centerY)) + centerX,
    ny = (cos * (y - centerY)) - (sin * (x - centerX)) + centerY;
  return {x: nx, y: ny};
}
