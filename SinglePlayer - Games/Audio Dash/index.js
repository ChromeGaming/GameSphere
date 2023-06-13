/*
 * Kontra.js v4.0.1 (Custom Build on 2018-08-21) | MIT
 * Build: https://straker.github.io/kontra/download?files=gameLoop+keyboard+sprite+store
 */
kontra={init(t){var n=this.canvas=document.getElementById(t)||t||document.querySelector("canvas");this.context=n.getContext("2d")},_noop:new Function,_tick:new Function};
kontra.gameLoop=function(e){let t,n,a,r,o=(e=e||{}).fps||60,i=0,p=1e3/o,c=1/o,s=!1===e.clearCanvas?kontra._noop:function(){kontra.context.clearRect(0,0,kontra.canvas.width,kontra.canvas.height)};function d(){if(n=requestAnimationFrame(d),a=performance.now(),r=a-t,t=a,!(r>1e3)){for(kontra._tick(),i+=r;i>=p;)m.update(c),i-=p;s(),m.render()}}let m={update:e.update,render:e.render,isStopped:!0,start(){t=performance.now(),this.isStopped=!1,requestAnimationFrame(d)},stop(){this.isStopped=!0,cancelAnimationFrame(n)}};return m};
!function(){let n={},t={},e={13:"enter",27:"esc",32:"space",37:"left",38:"up",39:"right",40:"down"};for(let n=0;n<26;n++)e[65+n]=(10+n).toString(36);for(i=0;i<10;i++)e[48+i]=""+i;addEventListener("keydown",function(i){let c=e[i.which];t[c]=!0,n[c]&&n[c](i)}),addEventListener("keyup",function(n){t[e[n.which]]=!1}),addEventListener("blur",function(n){t={}}),kontra.keys={bind(t,e){[].concat(t).map(function(t){n[t]=e})},unbind(t,e){[].concat(t).map(function(t){n[t]=e})},pressed:n=>!!t[n]}}();
!function(){class t{constructor(t,i){this._x=t||0,this._y=i||0}add(t,i){this.x+=(t.x||0)*(i||1),this.y+=(t.y||0)*(i||1)}clamp(t,i,h,s){this._c=!0,this._a=t,this._b=i,this._d=h,this._e=s}get x(){return this._x}get y(){return this._y}set x(t){this._x=this._c?Math.min(Math.max(this._a,t),this._d):t}set y(t){this._y=this._c?Math.min(Math.max(this._b,t),this._e):t}}kontra.vector=((i,h)=>new t(i,h)),kontra.vector.prototype=t.prototype;class i{init(t,i,h,s){for(i in t=t||{},this.position=kontra.vector(t.x,t.y),this.velocity=kontra.vector(t.dx,t.dy),this.acceleration=kontra.vector(t.ddx,t.ddy),this.width=this.height=0,this.context=kontra.context,t)this[i]=t[i];if(h=t.image)this.image=h,this.width=h.width,this.height=h.height;else if(h=t.animations){for(i in h)this.animations[i]=h[i].clone(),s=s||h[i];this._ca=s,this.width=s.width,this.height=s.height}return this}get x(){return this.position.x}get y(){return this.position.y}get dx(){return this.velocity.x}get dy(){return this.velocity.y}get ddx(){return this.acceleration.x}get ddy(){return this.acceleration.y}set x(t){this.position.x=t}set y(t){this.position.y=t}set dx(t){this.velocity.x=t}set dy(t){this.velocity.y=t}set ddx(t){this.acceleration.x=t}set ddy(t){this.acceleration.y=t}isAlive(){return this.ttl>0}collidesWith(t){return this.x<t.x+t.width&&this.x+this.width>t.x&&this.y<t.y+t.height&&this.y+this.height>t.y}update(t){this.advance(t)}render(){this.draw()}playAnimation(t){this._ca=this.animations[t],this._ca.loop||this._ca.reset()}advance(t){this.velocity.add(this.acceleration,t),this.position.add(this.velocity,t),this.ttl--,this._ca&&this._ca.update(t)}draw(){this.image?this.context.drawImage(this.image,this.x,this.y):this._ca?this._ca.render(this):(this.context.fillStyle=this.color,this.context.fillRect(this.x,this.y,this.width,this.height))}}kontra.sprite=(t=>(new i).init(t)),kontra.sprite.prototype=i.prototype}();
kontra.store={set(t,e){void 0===e?localStorage.removeItem(t):localStorage.setItem(t,JSON.stringify(e))},get(t){let e=localStorage.getItem(t);try{e=JSON.parse(e)}catch(t){}return e}};
let mergedPeaks;
let splitPeaks;

/**
 * Wave code taken from wavesurfer.js
 * @see https://github.com/katspaugh/wavesurfer.js
 */
function exportPCM(length, accuracy, noWindow, start) {
  length = length || 1024;
  start = start || 0;
  accuracy = accuracy || 10000;
  const peaks = getPeaks(length, start);

  // find largest peak and treat it as peaks of 1 and normalize rest of peaks
  let maxPeak = 0;
  let arr = [].map.call(peaks, peak => {
    if (peak > maxPeak) {
      maxPeak = peak;
    }
    return peak;
  });
  let normalizePeak = 1 - maxPeak;
  arr = arr.map(peak =>  Math.round((peak + normalizePeak) * accuracy) / accuracy);

  return arr;
}

function setLength(length) {
  splitPeaks = [];
  mergedPeaks = [];
  // Set the last element of the sparse array so the peak arrays are
  // appropriately sized for other calculations.
  const channels = buffer ? buffer.numberOfChannels : 1;
  let c;
  for (c = 0; c < channels; c++) {
    splitPeaks[c] = [];
    splitPeaks[c][2 * (length - 1)] = 0;
    splitPeaks[c][2 * (length - 1) + 1] = 0;
  }
  mergedPeaks[2 * (length - 1)] = 0;
  mergedPeaks[2 * (length - 1) + 1] = 0;
}

function getPeaks(length, first, last) {
  first = first || 0;
  last = last || length - 1;

  setLength(length);

  /**
   * The following snippet fixes a buffering data issue on the Safari
   * browser which returned undefined It creates the missing buffer based
   * on 1 channel, 4096 samples and the sampleRate from the current
   * webaudio context 4096 samples seemed to be the best fit for rendering
   * will review this code once a stable version of Safari TP is out
   */
  // if (!buffer.length) {
  //     const newBuffer = this.createBuffer(1, 4096, this.sampleRate);
  //     buffer = newBuffer.buffer;
  // }

  const sampleSize = buffer.length / length;
  const sampleStep = ~~(sampleSize / 10) || 1;
  const channels = buffer.numberOfChannels;
  let c;

  for (c = 0; c < channels; c++) {
      const peaks = splitPeaks[c];
      const chan = buffer.getChannelData(c);
      let i;

      for (i = first; i <= last; i++) {
          const start = ~~(i * sampleSize);
          const end = ~~(start + sampleSize);
          let min = 0;
          let max = 0;
          let j;

          for (j = start; j < end; j += sampleStep) {
              const value = chan[j];

              if (value > max) {
                  max = value;
              }

              if (value < min) {
                  min = value;
              }
          }

          peaks[2 * i] = max;
          peaks[2 * i + 1] = min;

          if (c == 0 || max > mergedPeaks[2 * i]) {
              mergedPeaks[2 * i] = max;
          }

          if (c == 0 || min < mergedPeaks[2 * i + 1]) {
              mergedPeaks[2 * i + 1] = min;
          }
      }
  }

  return mergedPeaks;
}
kontra.init();

//------------------------------------------------------------
// Global variables
//------------------------------------------------------------
const ctx = kontra.context;
const mid = kontra.canvas.height / 2;  // midpoint of the canvas
const waveWidth = 2;
const waveHeight = 215;
const maxLength = kontra.canvas.width / waveWidth + 2 | 0; // maximum number of peaks to show on screen
const defaultOptions = {
  volume: 1,
  uiScale: 1,
  gameSpeed: 1
};

let audio;  // audio file for playing/pausing
let peaks;  // peak data of the audio file
let waveData;  // array of wave audio objects based on peak data
let startBuffer;  // duplicated wave data added to the front of waveData to let the game start in the middle of the screen
let loop;  // game loop
let songName = 'AudioDashDefault.mp3';  // name of the song
let bestTimes;  // object of best times for all songs
let bestTime;  // best time for a single song
let activeScenes = [];  // currently active scenes
let focusedBtn;  // currently focused button
let options = Object.assign(  // options for the game
  {},
  defaultOptions,
  JSON.parse(localStorage.getItem('js13k-2018:options'))
);
let fontMeasurement;  // size of text letter
let gamepad;  // gamepad state
let lastUsedInput;  // keep track of last used input device
let objectUrl;  // in-memory url of audio files
let fadeTime = 450;  // how long a scene takes to fade





//------------------------------------------------------------
// Helper functions
//------------------------------------------------------------

/**
 * Clamp a value between min and max values.
 * @param {number} value - Value to clamp.
 * @param {number} min - Min value.
 * @param {number} max - Max value.
 */
function clamp(value, min, max) {
  return Math.min( Math.max(min, value), max);
}

function getRandom(min, max) {
  return Math.random() * (max - min) + min;
}

function collidesWithShip(y, height) {
  return ship.y < y + height && ship.y + ship.height > y;
}





//------------------------------------------------------------
// Main functions
//------------------------------------------------------------

/**
 * Start the game.
 */
function start() {
  startMove = -kontra.canvas.width / 2 | 0;
  startCount = 0;

  audio.currentTime = 0;
  audio.volume = options.volume;
  audio.playbackRate = options.gameSpeed;

  ship.points = [];
  ship.y = mid;

  showTutorialBars = true;
  isTutorial = true;
  tutorialScene.show();
}

/**
 * Show game over scene.
 */
function gameOver() {
  audio.pause();
  setBestTime();
  gameOverScene.show(() => restartBtn.focus());
}

/**
 * Show win scene.
 */
function win() {
  audio.pause();
  setBestTime();
  winScene.show(() => winMenuBtn.focus());
}
//------------------------------------------------------------
// Button
//------------------------------------------------------------
let uiSpacer = 5;

/**
 * Set the dimensions of the UI element.
 * @param {object} uiEl - UI element
 */
function setDimensions(uiEl) {
  let text = typeof uiEl.text === 'function' ? uiEl.text() : uiEl.text;
  uiEl.width = text.length * fontMeasurement + fontMeasurement * 2;
  uiEl.height = fontMeasurement * 3;

  if (uiEl.center || uiEl.type === 'button') {
    uiEl.x = uiEl.orgX - uiEl.width / 2;
  }

  // set the y position based on the position of another element
  if (uiEl.prev) {
    uiEl.y = uiEl.prev.y + uiEl.prev.height * 1.5 + uiSpacer / options.uiScale;
  }
  else {
    uiEl.y = uiEl.orgY - uiEl.height / 2;
  }

  uiEl.y += uiEl.margin || 0;
}

/**
 * Button UI element.
 * @param {object} props - Properties of the button
 */
function Button(props) {
  props.orgX = props.x;
  props.orgY = props.y;
  props.type = 'button';

  setDimensions(props);

  props.render = function() {
    setDimensions(this);

    ctx.save();
    setFont(25);

    ctx.fillStyle = '#222';
    if (button.disabled) {
      ctx.globalAlpha = clamp(this.parent.alpha - 0.65, 0, 1);
    }

    let args = [this.x, this.y, this.width, this.height];

    ctx.fillRect.apply(ctx, args);

    if (this.focused) {
      args.push(255, 0, 0);
      }
    else if (this.disabled) {
      args.push(100, 100, 100);
    }
    else {
      args.push(0, 163, 220);
    }

    neonRect.apply(null, args);

    ctx.fillStyle = '#fff';
    ctx.fillText(this.text, this.x + fontMeasurement, this.y + fontMeasurement * 2);
    ctx.restore();
  };
  props.focus = function() {
    if (focusedBtn && focusedBtn.blur) focusedBtn.blur();

    focusedBtn = this;
    this.focused = true;
    this.domEl.focus();
  };
  props.blur = function() {
    this.focused = false;
    focusedBtn = null;
  };

  let button = kontra.sprite(props);

  // create accessible html button for screen readers
  let el = document.createElement('button');
  el.textContent = button.label || button.text;
  el.addEventListener('focus', button.focus.bind(button));
  button.domEl = el;

  Object.defineProperty(button, 'disabled', {
    get() { return this.domEl.disabled },
    set(value) { this.domEl.disabled = value }
  });

  return button;
}





//------------------------------------------------------------
// Text
//------------------------------------------------------------
function Text(props) {
  props.orgX = props.x;
  props.orgY = props.y;

  setDimensions(props);

  props.render = function() {
    setDimensions(this);

    let text = typeof this.text === 'function' ? this.text() : this.text;
    if (this.lastText !== text) {
      this.lastText = text;
      this.domEl.textContent = text;
    }

    ctx.save();
    ctx.fillStyle = '#fff';
    setFont(25);
    ctx.fillText(text, this.x + fontMeasurement, this.y + fontMeasurement * 2);
    ctx.restore();
  };

  let text = kontra.sprite(props);

  // create accessible html text for screen readers
  let el = document.createElement('div');

  // announce changes to screen reader
  if (typeof props.text === 'function') {
    el.setAttribute('role', 'alert');
    el.setAttribute('aria-live', 'assertive');
    el.setAttribute('aria-atomic', true);
  }
  text.domEl = el;

  return text;
}
//------------------------------------------------------------
// Audio functions
//------------------------------------------------------------
let context = new (window.AudioContext || window.webkitAudioContext)();
uploadFile.addEventListener('change', uploadAudio);

/**
 * Load audio file as an ArrayBuffer.
 * @param {string} url - URL of the audio file
 * @returns {Promise} resolves with decoded audio data
 */
function loadAudioBuffer(url) {

  // we can't use fetch because response.arrayBuffer() isn't supported
  // in lots of browsers
  return new Promise((resolve, reject) => {
    let request = new XMLHttpRequest();
    request.responseType = 'arraybuffer';

    request.onload = function() {
      context.decodeAudioData(request.response, decodedData => {
        resolve(decodedData)
      });
    };

    request.open('GET', url, true);
    request.send();
  });
}

/**
 * Load audio file as an Audio element.
 * @param {string} url - URL of the audio file
 * @returns {Promise} resolves with audio element
 */
function loadAudio(url) {
  return new Promise((resolve, reject) => {
    let audioEl = document.createElement('audio');

    audioEl.addEventListener('canplay', function() {
      resolve(this);
    });

    audioEl.onerror = function(e) {
      console.error('e:', e);
      reject(e);
    };

    audioEl.src = url;
    audioEl.load();
  })
}

/**
 * Upload an audio file from the users computer.
 * @param {Event} e - File change event
 */
async function uploadAudio(e) {
  menuScene.hide();
  loadingScene.show();

  // clear any previous uploaded song
  URL.revokeObjectURL(objectUrl);

  let file = e.currentTarget.files[0];
  objectUrl = URL.createObjectURL(file);
  songName = uploadFile.value.replace(/^.*fakepath/, '').substr(1);

  await fetchAudio(objectUrl);
  getBestTime();
  loadingScene.hide();
  startBtn.onDown();
}

/**
 * Generate the wave data for an audio file.
 * @param {string} url - URL of the audio file
 */
async function fetchAudio(url) {
  buffer = await loadAudioBuffer(url);
  audio = await loadAudio(url);

  generateWaveData();

  return Promise.resolve();
}

function generateWaveData() {
  // numPeaks determines the speed of the game, the less peaks per duration, the
  // slower the game plays
  let numPeaks = audio.duration / 8 | 0;
  peaks = exportPCM(1024 * numPeaks);  // change this by increments of 1024 to get more peaks

  startBuffer = new Array(maxLength / 2 | 0).fill(0);

  // remove all negative peaks
  let waves = peaks
    .map((peak, index) => peak >= 0 ? peak : peaks[index-1]);

  let pos = mid;  // position of next turn
  let lastPos = 0;  // position of the last turn
  let gapDistance = maxLength;  // how long to get to the next turn
  let step = 0;  // increment of each peak to pos
  let offset = 0;  // offset the wave data position to create curves

  let minBarDistance = 270;  // min distance between top and bottom wave bars
  let heightDt = minBarDistance - waveHeight + 10;  // distance between max height and wave height
  let heightStep = heightDt / (startBuffer.length + waves.length);  // game should reach the max bar height by end of the song
  let counter = 0;
  let peakVisited = false;
  let obstacle;
  let prevObstacle;

  let yPos = 0;
  let yLastPos = 0;
  let yGapDistance = maxLength;
  let yStep = 0;
  let yOffset = 0;
  let yCounter = 0;

  let isIntroSong = songName === 'AudioDashDefault.mp3';

  Random.setValues(peaks);

  waveData = startBuffer
    .concat(waves)
    .map((peak, index, waves) => {

      // if (index === 13146) {
      //   debugger;
      // }

      let maxPos = (190 - heightStep * index) / 2;

      // for the intro song give the player some time to get use to the controls
      // before adding curves (numbers are tailored to points in the song)
      let firstCurveIndex = maxLength * (isIntroSong ? 4 : 1);
      if (index >= firstCurveIndex) {
        offset += step;

        // the steeper the slope the less drastic position changes we should have
        yOffset += Math.abs(step) > 1
          ? yStep / (Math.abs(step) * 1.25)
          : yStep;

        if (yPos < 0 && yOffset < yPos ||
            yPos > 0 && yOffset > yPos) {
          yOffset = yPos;
        }

        // all calculations are based on the peaks data so that the path is the
        // same every time
        let peakIndex = index - startBuffer.length;
        Random.seed(peakIndex);

        if (++counter >= gapDistance) {
          counter = 0;
          lastPos = pos;
          pos = mid + Random.getNext(200);
          gapDistance = 300 + Random.getNext(100);
          step = (pos - lastPos) / gapDistance;
        }

        if (++yCounter >= yGapDistance) {
          yCounter = 0;
          lastYPos = yPos;
          yGapDistance = 110 + Random.getNext(23);
          yPos = Random.getNext(maxPos);
          yStep = (yPos - lastYPos) / yGapDistance;
        }
      }

      // a song is more or less "intense" based on how much it switches between
      // high and low peaks. a song like "Through the Fire and the Flames" has
      // a high rate of switching so is more intense. need to look a few peaks
      // before to ensure we find the low peaks
      let peakThreshold = 0.38; // increase or decrease to get less or more obstacles
      let lowPeak = 1;
      for (let i = index - 5; i < index; i++) {
        if (waves[i] < lowPeak) {
          lowPeak = waves[i];
        }
      }

      let maxPeak = 0;
      for (let i = index - 20; i < index+20; i++) {
        if (waves[i] > maxPeak) {
          maxPeak = waves[i];
        }
      }

      // for the intro song give the player some time to get use to the controls
      // before adding obstacles (numbers are tailored to points in the song)
      let firstObstacleIndex = maxLength * (isIntroSong ? 15 : 3);

      // don't create obstacles when the slope of the offset is too large
      let addObstacle = index > firstObstacleIndex && peak - lowPeak >= peakThreshold && Math.abs(step) < 1.35;
      let height = addObstacle
        ? kontra.canvas.height / 2 - Math.max(65, 35 * (1 / peak))
        : 160 + peak * waveHeight + heightStep * index;

      // a song that goes from a low peak to a really high peak while the current
      // yOffset is close to the top or bottom needs to drop the yOffset a bit so
      // there's enough of a gap between the peaks
      // if (Math.abs(yOffset) > (minBarDistance - heightStep * index) / 2 &&
      //     maxPeak - lowPeak > peakThreshold) {
      //   yOffset += -getSign(yOffset) * 65;
      //   console.log('hit here');
      // }

      // a song that goes from a low peak to a really high peak while in an obstacle
      // would create a spike in the obstacle that is too narrow to pass so we need
      // to match the height to the others
      // if (addObstacle && maxPeak - peak > peakThreshold) {
      //   height = kontra.canvas.height / 2 - Math.max(65, 35 * (1 / maxPeak));
      // }

      return {
        x: index * waveWidth,
        y: 0,
        width: waveWidth,
        height: height,
        offset: offset,
        yOffset: addObstacle && index > firstObstacleIndex ? yOffset : 0,
        yPos: yPos
      };
    });
}
//------------------------------------------------------------
// Drawing functions
//------------------------------------------------------------

/**
 * Draw a neon rectangle in the given color.
 * @see https://codepen.io/agar3s/pen/pJpoya?editors=0010#0
 * Don't use shadow blur as it is terrible for performance
 * @see https://stackoverflow.com/questions/15706856/how-to-improve-performance-when-context-shadow-canvas-html5-javascript
 *
 * @param {number} x - X position of the rectangle
 * @param {number} y - Y position of the rectangle
 * @param {number} w - Width of the rectangle
 * @param {number} h - Height of the rectangle
 * @param {number} r - Red value
 * @param {number} g - Green value
 * @param {number} b - Blue value
 */
function neonRect(x, y, w, h, r, g, b) {
  ctx.save();
  ctx.strokeStyle = "rgba(" + r + "," + g + "," + b + ",0.2)";
  ctx.lineWidth = 10.5;
  ctx.strokeRect(x, y, w, h);
  ctx.lineWidth = 8;
  ctx.strokeRect(x, y, w, h);
  ctx.lineWidth = 5.5;
  ctx.strokeRect(x, y, w, h);
  ctx.lineWidth = 3;
  ctx.strokeRect(x, y, w, h);
  ctx.strokeStyle = "#fff";
  ctx.lineWidth = 1.5;
  ctx.strokeRect(x, y, w, h);
  ctx.restore();
}

/**
 * Line to each point.
 * @param {object[]} points - Object of x, y positions
 * @param {number} move - distance to move each point by
 */
function drawLines(points, move) {
  ctx.beginPath();
  ctx.moveTo(points[0].x - move, points[0].y);
  points.forEach(point => {
    ctx.lineTo(point.x - move, point.y);
  });
  ctx.stroke();
}

/**
 * Draw a neon line between points in the given color.
 * @param {object[]} points - Object of x, y positions
 * @param {number} move - Distance to move each point by
 * @param {number} r - Red value
 * @param {number} g - Green value
 * @param {number} b - Blue value
 */
function neonLine(points, move, r, g, b) {
  if (!points.length) return;

  ctx.save();
  ctx.strokeStyle = "rgba(" + r + "," + g + "," + b + ",0.2)";

  ctx.lineWidth = 10.5;
  drawLines(points, move);

  ctx.lineWidth = 8;
  drawLines(points, move);

  ctx.lineWidth = 5.5;
  drawLines(points, move);

  ctx.lineWidth = 3;
  drawLines(points, move);

  ctx.strokeStyle = "#fff";
  ctx.lineWidth = 1.5;
  drawLines(points, move);

  ctx.restore();
}

/**
 * Draw neon text in the given color
 * @param {string} text - Text to render
 * @param {number} x - X position of the text
 * @param {number} y - Y position of the text
 * @param {number} r - Red value
 * @param {number} g - Green value
 * @param {number} b - Blue value
 */
function neonText(text, x, y, r, g, b, alhpa) {
  ctx.save();
  ctx.globalAlpha = 0.2;
  ctx.strokeStyle = "rgb(" + r + "," + g + "," + b + ")";
  ctx.lineWidth = 10.5;
  ctx.strokeText(text, x, y);
  ctx.lineWidth = 8;
  ctx.strokeText(text, x, y);
  ctx.lineWidth = 5.5;
  ctx.strokeText(text, x, y);
  ctx.lineWidth = 3;
  ctx.strokeText(text, x, y);
  ctx.globalAlpha = 1;
  ctx.strokeStyle = "#fff";
  ctx.lineWidth = 1.5;
  ctx.strokeText(text, x, y);
  ctx.restore();
};

/**
 * Draw the top and bottom time bars
 */
function drawTimeUi() {
  ctx.save();
  ctx.fillStyle = '#222';

  // top bar
  ctx.beginPath();
  ctx.moveTo(0, 43 * options.uiScale);
  ctx.lineTo(80 * options.uiScale, 43 * options.uiScale);
  for (let i = 1; i <= 10 * options.uiScale | 0; i++) {
    ctx.lineTo(80 * options.uiScale +i*2, 43 * options.uiScale -i*2);
    ctx.lineTo(80 * options.uiScale +i*2+2, 43 * options.uiScale -i*2);
  }
  ctx.lineTo(170 * options.uiScale, 23 * options.uiScale);
  for (let i = 1; i <= 10 * options.uiScale | 0; i++) {
    ctx.lineTo(170 * options.uiScale +i*2, 23 * options.uiScale -i*2);
    ctx.lineTo(170 * options.uiScale +i*2+2, 23 * options.uiScale -i*2);
  }
  ctx.lineTo(192 * options.uiScale, 0);
  ctx.lineTo(0, 0);
  ctx.closePath();
  ctx.fill();

  // bottom bar
  ctx.beginPath();
  let y = kontra.canvas.height - 25 * options.uiScale;
  ctx.moveTo(0, y);
  ctx.lineTo(125 * options.uiScale, y);
  for (let i = 1; i <= 10 * options.uiScale | 0; i++) {
    ctx.lineTo(125 * options.uiScale +i*2, y+i*2);
    ctx.lineTo(125 * options.uiScale +i*2+2, y+i*2);
  }
  ctx.lineTo(147 * options.uiScale, kontra.canvas.height);
  ctx.lineTo(0, kontra.canvas.height);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = '#fdfdfd';
  let time = getTime(audio.currentTime);

  setFont(40);
  ctx.fillText(getSeconds(time).padStart(3, ' '), 5 * options.uiScale, 35 * options.uiScale);
  setFont(18);
  ctx.fillText(':' + getMilliseconds(time).padStart(2, '0') + '\nTIME', 80 * options.uiScale, 17 * options.uiScale);
  ctx.fillText(bestTime.padStart(6, ' ') + '\nBEST', 5 * options.uiScale, kontra.canvas.height - 5 * options.uiScale);
  ctx.restore();
}

/**
 * Draw the XBOX A button.
 * @param {number} x - X position
 * @param {number} y - Y position
 */
function drawAButton(x, y) {
  ctx.save();
  ctx.fillStyle = 'green';
  ctx.beginPath();
  ctx.arc(x, y, fontMeasurement, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = 'black';
  setFont(27);
  ctx.fillText('A', x - fontMeasurement / 2, y + fontMeasurement / 2);
  ctx.fillStyle = 'white';
  setFont(25);
  ctx.fillText('A', x - fontMeasurement / 2, y + fontMeasurement / 2);
  ctx.restore();
}

/**
 * Show help text in bottom left corner of screen base don input.
 */
function showHelpText() {
  ctx.save();

  if (lastUsedInput === 'keyboard') {
    setFont(18);
    ctx.fillStyle = 'white';
    ctx.fillText('[Spacebar] Select', 50 - fontMeasurement, kontra.canvas.height - 50 + fontMeasurement / 2.5);
  }
  else if (lastUsedInput === 'gamepad') {
    drawAButton(50, kontra.canvas.height - 50);
    setFont(18);
    ctx.fillStyle = 'white';
    ctx.fillText('Select', 50 + fontMeasurement * 1.75, kontra.canvas.height - 50 + fontMeasurement / 2.5);
  }

  ctx.restore();
}
/**
 * Set font size.
 * @param {number} size - Size of font
 */
function setFont(size) {
  ctx.font = size * options.uiScale + "px 'Lucida Console', Monaco, monospace";
}

/**
 * Set font measurement
 */
function setFontMeasurement() {
  fontMeasurement = 15 * options.uiScale;
}
//------------------------------------------------------------
// Input Handlers
//------------------------------------------------------------
let touchPressed;
let lastInputTime = 0;
window.addEventListener('mousedown', handleOnDown);
window.addEventListener('touchstart', handleOnDown);
window.addEventListener('mouseup', handleOnUp);
window.addEventListener('touchend', handleOnUp);
window.addEventListener('blur', handleOnUp);
window.addEventListener('beforeunload', () => {
  URL.revokeObjectURL(objectUrl);
});

// remove contextmenu as holding tap on mobile opens it
window.addEventListener('contextmenu', e => {
  e.preventDefault();
  e.stopPropagation();
  return false;
});

/**
 * Detect if a button was clicked.
 */
function handleOnDown(e) {
  touchPressed = true;
  uploadBtn.disabled = false;

  let pageX, pageY;
  if (e.type.indexOf('mouse') !== -1) {

    // there's a bug in chrome where it fires a mousedown event right after
    // tapping, so we need to ignore them to get the correct last input
    if (lastUsedInput === 'touch' && performance.now() - lastInputTime < 1000) return;

    lastUsedInput = 'mouse';
    pageX = e.pageX;
    pageY = e.pageY;
  }
  else {
    lastUsedInput = 'touch';

    // touchstart uses touches while touchend uses changedTouches
    // @see https://stackoverflow.com/questions/17957593/how-to-capture-touchend-coordinates
    pageX = (e.touches[0] || e.changedTouches[0]).pageX;
    pageY = (e.touches[0] || e.changedTouches[0]).pageY;
  }

  let x = pageX - kontra.canvas.offsetLeft;
  let y = pageY - kontra.canvas.offsetTop;
  let el = kontra.canvas;

  while ( (el = el.offsetParent) ) {
    x -= el.offsetLeft;
    y -= el.offsetTop;
  }

  // take into account the canvas scale
  let scale = kontra.canvas.offsetHeight / kontra.canvas.height;
  x /= scale;
  y /= scale;

  // last added scene is on top
  for (let i = activeScenes.length - 1, activeScene; activeScene = activeScenes[i]; i--) {
    if (activeScene.children) {
      activeScene.children.forEach(child => {
        if (!child.disabled && child.parent.active && child.onDown && child.collidesWith({
          // center the click
          x: x - 5,
          y: y - 5,
          width: 10,
          height: 10
        })) {
          child.onDown();
          child.blur();
          return;
        }
      });
    }
  }

  lastInputTime = performance.now();
}

/**
 * Release button press.
 */
function handleOnUp() {
  touchPressed = false;
}

/**
 * Move the focused button up or down.
 * @param {number} inc - Direction to move the focus button (1 = down, -1 = up).
 */
function handleArrowDownUp(inc) {
  let activeScene = activeScenes[activeScenes.length - 1];
  let index = activeScene.children.indexOf(focusedBtn);

  while (true) {
    index += inc;

    // if we get to the beginning or end we're already focused on the first/last
    // element
    if (index < 0 || index > activeScene.children.length - 1) {
      return;
    }

    let child = activeScene.children[index];
    if (child && child.focus && !child.disabled) {
      child.focus();
      break;
    }
  }
}

// select button
kontra.keys.bind('space', () => {
  lastUsedInput = 'keyboard';
  uploadBtn.disabled = false;

  if (focusedBtn && focusedBtn.onDown) {
    focusedBtn.onDown();
  }
});

// move focus button with arrow keys
kontra.keys.bind('up', (e) => {
  lastUsedInput = 'keyboard';
  uploadBtn.disabled = false;

  e.preventDefault();
  handleArrowDownUp(-1);
});
kontra.keys.bind('down', (e) => {
  lastUsedInput = 'keyboard';
  uploadBtn.disabled = false;

  e.preventDefault();
  handleArrowDownUp(1);
});

/**
 * Don't active controller sticks unless it passes a threshold.
 * @see https://www.smashingmagazine.com/2015/11/gamepad-api-in-web-games/
 * @param {number} number - Thumbstick axes
 * @param {number} threshold
 */
function applyDeadzone(number, threshold){
  percentage = (Math.abs(number) - threshold) / (1 - threshold);

  if(percentage < 0) {
    percentage = 0;
  }

  return percentage * (number > 0 ? 1 : -1);
}

/**
 * Track gamepad use every frame.
 */
let aDt = 1;
let aDuration = 0;
let axesDt = 1;
let axesDuration = 0;
function updateGamepad() {
  if (!navigator.getGamepads) return;
  gamepad = navigator.getGamepads()[0];

  if (!gamepad) return;

  // A button press
  if (gamepad.buttons[0].pressed) {
    lastUsedInput = 'gamepad';
    aDuration += 1/60;
    aDt += 1/60;

    // it seems the browser won't open the file dialog window when using a
    // controller as the input, even when programmatically calling the click
    // event on the file input
    uploadBtn.disabled = true;
  }
  else {
    aDuration = 0;
    aDt = 1;
  }

  // run the first time immediately then hold for a bit before letting the user
  // continue to press the button down
  if ((aDt > 0.30 || (aDuration > 0.3 && aDt > 0.10)) &&
      gamepad.buttons[0].pressed && focusedBtn && focusedBtn.onDown) {
    aDt = 0;
    focusedBtn.onDown()
  }

  let axes = applyDeadzone(gamepad.axes[1], 0.5);
  let upPressed = axes < 0 || gamepad.buttons[12].pressed;
  let downPressed = axes > 0 || gamepad.buttons[13].pressed

  if (upPressed || downPressed) {
    lastUsedInput = 'gamepad';
    axesDuration += 1/60;
    axesDt += 1/60;
    uploadBtn.disabled = true;
  }
  else {
    axesDuration = 0;
    axesDt = 1;
  }

  if (axesDt > 0.30 || (axesDuration > 0.3 && axesDt > 0.10)) {
    if (upPressed) {
      axesDt = 0;
      handleArrowDownUp(-1);
    }
    else if (downPressed) {
      axesDt = 0;
      handleArrowDownUp(1);
    }
  }
}
//------------------------------------------------------------
// Game loop
//------------------------------------------------------------
let updateCounter = 0;
let numUpdates = 0;
loop = kontra.gameLoop({
  update() {
    updateGamepad();

    activeScenes.forEach(scene => scene.update())

    if ((tutorialScene.active || gameScene.active) && !gameOverScene.active && !winScene.active) {
      numUpdates = 0;
      updateCounter += audio.playbackRate;

      while (updateCounter >= 1) {
        numUpdates++
        updateCounter--;
        ship.update();
      }
    }

    if (tutorialScene.active && !isTutorial && !tutorialScene.isHidding) {
      tutorialScene.hide(() => {

        // reset ship points to line up with gameScene move (which starts at 0);
        for (let count = 0, i = ship.points.length - 1, point; point = ship.points[i]; i--) {
          point.x = 0 - tutorialMoveInc * count++;
        }
        gameScene.show();
      });
    }
  },
  render() {
    if (showTutorialBars) {
      ctx.fillStyle = '#00a3dc';
      ctx.fillRect(0, 0, kontra.canvas.width, 160);
      ctx.fillRect(0, kontra.canvas.height - 160, kontra.canvas.width, 160);
    }

    activeScenes.forEach(scene => scene.render())

    if (menuScene.active || optionsScene.active) {
      showHelpText();
    }

    if (tutorialScene.active) {
      tutorialMove += tutorialMoveInc;
      ship.render(tutorialMove);

      if (ship.points.length > maxLength / 2) {
        ship.points.shift();
      }
    }
  }
});

loop.start();
function getSign(num) {
  return num < 0 ? -1 : num > 0 ? 1 : 0;
}

let Random = {
  values: [],
  value: null,
  index: null,
  numNegatives: 0,
  numPositives: 0,
  setValues: function(values) {
    this.values = values;
    this.numNegatives = 0;
    this.numPositives = 0;
  },
  seed: function(index) {
    this.index = index;
    this.value = this.values[index];
  },
  getNext: function(num) {
    let sign = getSign(this.value);

    if ((sign === -1 && this.numNegatives - this.numPositives > 100) ||
        (sign === 1 && this.numPositives - this.numNegatives > 100)) {
      sign = -sign
    }

    if (sign === -1) {
      this.numNegatives++;
    }
    else {
      this.numPositives++;
    }

    let rand = sign * (num - num * Math.abs(this.value));
    let randIndex = (this.value * 10000 % 100 * 5 | 0);
    let index = this.index - randIndex;

    if (index < 0 || index > this.values.length - 1) {
      index = this.index + randIndex;
    }
    this.seed(index);

    return rand;
  }
};
//------------------------------------------------------------
// Scene
//------------------------------------------------------------
let scenes = [];
function Scene(name) {

  // create dom element to hold scene dom elements for screen readers.
  // this lets me hide the parent element and not each child, which caused
  // lag
  let sceneEl = document.createElement('div');
  sceneEl.hidden = true;
  uiScenes.appendChild(sceneEl);

  let scene = {
    name: name,
    alpha: 0,
    active: false,
    children: [],
    inc: 0.05,
    isHidding: false,

    // create a fade in/out transitions when hiding and showing scenes
    hide(cb) {
      if (focusedBtn) focusedBtn.blur();

      this.isHidding = true;
      sceneEl.hidden = true;
      this.alpha = 1;
      this.inc = -0.05;
      setTimeout(() => {
        this.isHidding = false;
        this.active = false;
        activeScenes.splice(activeScenes.indexOf(this), 1);
        cb && cb();
      }, fadeTime);
    },
    show(cb) {
      this.active = true;
      sceneEl.hidden = false;
      activeScenes.push(this);
      this.alpha = 0;
      this.inc = 0.05;
      setTimeout(() => {
        if (this.onShow) this.onShow();
        cb && cb();
      }, fadeTime)
    },
    add() {
      Array.from(arguments).forEach(child => {
        child.parent = this;
        this.children.push(child);

        if (child.domEl) {
          sceneEl.appendChild(child.domEl);
        }
      });
    },
    update() {
      this.children.forEach(child => {
        if (child.update) {
          child.update()
        }
      });
    },
    render() {
      this.alpha = clamp(this.alpha + this.inc, 0, 1);

      ctx.save();
      ctx.globalAlpha = this.alpha;

      this.children.forEach(child => child.render());

      ctx.restore();
    }
  };

  scenes.push(scene);
  return scene;
}





//------------------------------------------------------------
// Menu Scene
//------------------------------------------------------------
let menuScene = Scene('menu');
menuScene.add({
  render() {
    ctx.save();

    let points = [
      {x: 50, y: 262},

      {x: 80, y: 262},
      {x: 88, y: 270},
      {x: 96, y: 278},

      {x: 104, y: 281},
      {x: 112, y: 279},
      {x: 120, y: 272},
      {x: 128, y: 264},

      {x: 136, y: 256},
      {x: 144, y: 249},
      {x: 152, y: 247},
      {x: 160, y: 250},

      {x: 168, y: 258},
      {x: 176, y: 266},
      {x: 206, y: 266}
    ];

    neonLine(points, 0, 0, 163, 220);
    ctx.font = "150px 'Lucida Console', Monaco, monospace"
    neonText('AUDIO', 50, 200, 0, 163, 220);
    neonText('DASH', 231, 315, 255, 0, 0);
    ctx.restore();
    // ctx.font = "40px 'Lucida Console', Monaco, monospace"
    // neonText('Ride the Wave', 200, 360, 0, 163, 220);
    ctx.fillStyle = '#fff';
    ctx.font = "30px 'Lucida Console', Monaco, monospace"
    ctx.fillText('Play the Wave', 202, 360);

    return '';
  }
});
let startBtn = Button({
  x: kontra.canvas.width / 2,
  y: kontra.canvas.height / 2,
  text: 'START',
  onDown() {
    audio.play();
    audio.pause();
    menuScene.hide(() => {
      start();
    });
  }
});
let uploadBtn = Button({
  x: kontra.canvas.width / 2,
  prev: startBtn,
  text: 'UPLOAD SONG',
  onDown() {
    uploadFile.click();
  }
});
let optionsBtn = Button({
  x: kontra.canvas.width / 2,
  prev: uploadBtn,
  text: 'OPTIONS',
  onDown() {
    menuScene.hide(() => {
      optionsScene.show();
    });
  }
});
menuScene.add(startBtn, uploadBtn, optionsBtn);





//------------------------------------------------------------
// Loading Scene
//------------------------------------------------------------
let loadingScene = Scene('upload');
let loadingTimer = 0;
let loadingText = Text({
  x: 245,
  y: kontra.canvas.height / 2,
  text() {
    ++loadingTimer;
    let text = 'LOADING';
    if (loadingTimer >= 60) {
      text += '.'
    }
    if (loadingTimer >= 120) {
      text += '.'
    }
    if (loadingTimer >= 180) {
      text += '.'
    }
    if (loadingTimer >= 240) {
      loadingTimer = 0;
    }

    return text;
  }
});
loadingScene.add(loadingText);





//------------------------------------------------------------
// Options Scene
//------------------------------------------------------------
let opts = [{
  name: 'volume',
  minValue: 0,
  maxValue: 1,
  inc: 0.05
},
{
  name: 'uiScale',
  minValue: 1,
  maxValue: 1.5,
  inc: 0.05
},
{
  name: 'gameSpeed',
  minValue: 0.1,
  maxValue: 2,
  inc: 0.05
}];
let beforeOptions;
let optionsScene = Scene('options');
let focusEl;
optionsScene.onShow = () => {
  beforeOptions = Object.assign({}, options);
  focusEl.domEl.focus();
};

let startY = 200;
let optionTexts = [];

opts.forEach((opt, index) => {
  let name = opt.name.replace(/([A-Z])/g, ' $1').toUpperCase();

  let optionText = Text({
    x: 50,
    y: index === 0 ? startY : null,
    prev: index > 0 ? optionTexts[index-1] : null,
    text: name
  });
  let optionValue = Text({
    x: 475,
    y: index === 0 ? startY : null,
    center: true,
    prev: index > 0 ? optionTexts[index-1] : null,
    text() {
      return (''+Math.round(options[opt.name] * 100)).padStart(3, ' ') + '%';
    }
  });

  let decBtn = Button({
    x: 375,
    y: index === 0 ? startY : null,
    prev: index > 0 ? optionTexts[index-1] : null,
    text: '−',
    label: 'Decrease ' + name,
    update() {
      this.disabled = options[opt.name] === opt.minValue;
    },
    onDown() {
      changeValue(-opt.inc);
    }
  });
  if (index === 0) {
    focusEl = decBtn;
  }

  let incBtn = Button({
    x: 575,
    y: index === 0 ? startY : null,
    prev: index > 0 ? optionTexts[index-1] : null,
    text: '+',
    label: 'Increase ' + name,
    update() {
      this.disabled = options[opt.name] === opt.maxValue;
    },
    onDown() {
      changeValue(opt.inc);
    }
  });

  function changeValue(inc) {
    let value = clamp(options[opt.name] + inc, opt.minValue, opt.maxValue);
    options[opt.name] = value;
    setFontMeasurement();
  }

  optionsScene.add(optionText, optionValue, decBtn, incBtn);
  optionTexts.push(optionText);
});

let saveBtn = Button({
  x: kontra.canvas.width / 2,
  prev: optionTexts[optionTexts.length-1],
  margin: 45,
  text: 'SAVE',
  onDown() {
    localStorage.setItem('js13k-2018:options', JSON.stringify(options));

    optionsScene.hide(() => {
      menuScene.show(() => startBtn.domEl.focus());
    });
  }
});
let cancelBtn = Button({
  x: kontra.canvas.width / 2,
  prev: saveBtn,
  text: 'CANCEL',
  onDown() {
    optionsScene.hide(() => {
      options = beforeOptions;
      setFontMeasurement();
      menuScene.show(() => startBtn.domEl.focus());
    });
  }
});
optionsScene.add(saveBtn, cancelBtn);





//------------------------------------------------------------
// Tutorial Scene
//------------------------------------------------------------
let isTutorial = true;
let tutorialMove = 0;
let tutorialMoveInc = 5;
let showTutorialBars = false;

let tutorialScene = Scene('tutorial');
let tutorialText = Text({
  x: kontra.canvas.width / 2,
  y: kontra.canvas.height / 2 - 200,
  center: true,
  text() {
    let text = 'Tap or Hold';

    if (lastUsedInput === 'gamepad') {
      drawAButton(this.x - fontMeasurement, this.y + fontMeasurement * 1.5);
    }
    else if (lastUsedInput === 'keyboard' || lastUsedInput === 'mouse') {
      text = '[Spacebar] ' + text;
    }

    return text;
  }
});
tutorialScene.add(tutorialText);





//------------------------------------------------------------
// Game Scene
//------------------------------------------------------------
let startMove;
let startCount;
let gameScene = Scene('game');
let shipIndex;
gameScene.add({
  render() {
    // context.currentTime would be as long as the audio took to load, so was
    // always off. seems it's not meant for large files. better to use audio
    // element and play it right on time
    // @see https://stackoverflow.com/questions/33006650/web-audio-api-and-real-current-time-when-playing-an-audio-file

    // calculate speed of the audio wave based on the current time
    let move, startIndex = 0, ampBar;
    if (audio.currentTime) {
      move = Math.round((audio.currentTime / audio.duration) * (peaks.length * waveWidth));
      startIndex = move / waveWidth | 0;
    }
    else {
      move = startMove + tutorialMoveInc * startCount;

      if (!gameOverScene.active) {
        startCount++;

        if (move >= 0) {
          showTutorialBars = false;
          audio.play();
        }
      }
    }

    shipIndex = startIndex + maxLength / 2;

    // only draw the bars on the screen
    for (let i = startIndex; i < startIndex + maxLength && waveData[i]; i++) {
      let wave = waveData[i];
      let x = wave.x - move;

      let topY = wave.y;
      let botY = kontra.canvas.height - wave.height - wave.offset + wave.yOffset;
      let topHeight = wave.height - wave.offset + wave.yOffset;
      let botHeight = wave.height + wave.offset - wave.yOffset;

      // keep track of the amp bar
      if (x > waveWidth * (maxLength / 2 - 1) && x < waveWidth * (maxLength / 2 + 1)) {
        ampBar = wave;

        // collision detection
        if (!gameOverScene.active) {
          if (collidesWithShip(topY, topHeight) ||
              collidesWithShip(botY, botHeight) ||
              ship.y < -50 ||
              ship.y > kontra.canvas.height + 50) {
            return gameOver();
          }
        }
      }
      else {
        ctx.fillStyle = '#00a3dc';
        ctx.fillRect(x, topY, wave.width, topHeight);  // top bar
        ctx.fillRect(x, botY, wave.width, botHeight);  // bottom bar
      }
    }

    // draw amp bar
    if (ampBar) {
      let x = ampBar.x - move - waveWidth;
      let width = ampBar.width + waveWidth * 2;
      let topY = ampBar.y;
      let botY = kontra.canvas.height - ampBar.height - ampBar.offset + ampBar.yOffset;
      let topHeight = ampBar.height - ampBar.offset + ampBar.yOffset;
      let botHeight = ampBar.height + ampBar.offset - ampBar.yOffset;

      neonRect(x, topY, width, topHeight, 255, 0, 0);
      neonRect(x, botY, width, botHeight, 255, 0, 0);
    }

    ship.render(move);

    while (ship.points.length && ship.points[0].x - move < 0 - ship.width) {
      ship.points.shift();
    }

    drawTimeUi();

    if (!winScene.active && waveData[waveData.length - 1].x - move <= kontra.canvas.width / 2) {
      win();
    }
  }
});





//------------------------------------------------------------
// Game Over Scene
//------------------------------------------------------------
let gameOverScene = Scene('gameOver');
let gameOverText = Text({
  x: kontra.canvas.width / 2,
  y: kontra.canvas.height / 2,
  center: true,
  text: 'GAME OVER'
});
let restartBtn = Button({
  x: kontra.canvas.width / 2,
  prev: gameOverText,
  text: 'RESTART',
  onDown() {
    showTutorialBars = true;
    gameOverScene.hide();
    gameScene.hide(() => start());
  }
});
let menuBtn = Button({
  x: kontra.canvas.width / 2,
  prev: restartBtn,
  text: 'MAIN MENU',
  onDown() {
    gameScene.hide(() => {
      showTutorialBars = false;
    });
    gameOverScene.hide(() => {
      menuScene.show(() => startBtn.domEl.focus());
    });
  }
});
gameOverScene.add(gameOverText, restartBtn, menuBtn);





//------------------------------------------------------------
// Win Scene
//------------------------------------------------------------
let winScene = Scene('win');
let winText = Text({
  x: kontra.canvas.width / 2,
  y: kontra.canvas.height / 2,
  center: true,
  text: 'SONG COMPLETED!'
});
let winMenuBtn = Button({
  x: kontra.canvas.width / 2,
  prev: winText,
  text: 'MAIN MENU',
  onDown() {
    gameScene.hide();
    winScene.hide(() => {
      menuScene.show(() => startBtn.domEl.focus());
    });
  }
})
winScene.add(winText, winMenuBtn);
//------------------------------------------------------------
// Ship
//------------------------------------------------------------
let ship = kontra.sprite({
  x: kontra.canvas.width / 2 - waveWidth / 2,
  y: kontra.canvas.height / 2 - waveWidth / 2,
  width: waveWidth,
  height: waveWidth,
  gravity: 5,
  points: [],
  maxAcc: 8,
  update() {
    if (kontra.keys.pressed('space') || touchPressed || (gamepad && gamepad.buttons[0].pressed)) {
      this.ddy = -this.gravity;

      isTutorial = false;
    }
    else {
      this.ddy = this.gravity;
    }

    if (isTutorial) return;

    this.y += this.dy;
    this.dy += this.ddy;

    let maxAcc = this.maxAcc// / (1 / audio.playbackRate);
    if (Math.sqrt(this.dy * this.dy) > maxAcc) {
      this.dy = this.dy < 0 ? -maxAcc : maxAcc;
    }
  },
  render(move) {
    if (numUpdates >= 1 && !gameOverScene.active && !winScene.active) {
      this.points.push({x: this.x + move, y: this.y + 1});
    }

    neonRect(this.x, this.y, this.width, this.height, 0, 163, 220);
    neonLine(this.points, move, 0, 163, 220);
  }
});
//
// Sonant-X
//
// Copyright (c) 2014 Nicolas Vanhoren
//
// Sonant-X is a fork of js-sonant by Marcus Geelnard and Jake Taylor. It is
// still published using the same license (zlib license, see below).
//
// Copyright (c) 2011 Marcus Geelnard
// Copyright (c) 2008-2009 Jake Taylor
//
// This software is provided 'as-is', without any express or implied
// warranty. In no event will the authors be held liable for any damages
// arising from the use of this software.
//
// Permission is granted to anyone to use this software for any purpose,
// including commercial applications, and to alter it and redistribute it
// freely, subject to the following restrictions:
//
// 1. The origin of this software must not be misrepresented; you must not
//    claim that you wrote the original software. If you use this software
//    in a product, an acknowledgment in the product documentation would be
//    appreciated but is not required.
//
// 2. Altered source versions must be plainly marked as such, and must not be
//    misrepresented as being the original software.
//
// 3. This notice may not be removed or altered from any source
//    distribution.

var sonantx;
(function() {
"use strict";
sonantx = {};

var WAVE_SPS = 44100;                    // Samples per second
var WAVE_CHAN = 2;                       // Channels
var MAX_TIME = 33; // maximum time, in millis, that the generator can use consecutively

var audioCtx = null;

// Oscillators
function osc_sin(value)
{
    return Math.sin(value * 6.283184);
}

function osc_square(value)
{
    if(osc_sin(value) < 0) return -1;
    return 1;
}

function osc_saw(value)
{
    return (value % 1) - 0.5;
}

function osc_tri(value)
{
    var v2 = (value % 1) * 4;
    if(v2 < 2) return v2 - 1;
    return 3 - v2;
}

// Array of oscillator functions
var oscillators =
[
    osc_sin,
    osc_square,
    osc_saw,
    osc_tri
];

function getnotefreq(n)
{
    return 0.00390625 * Math.pow(1.059463094, n - 128);
}

function genBuffer(waveSize, callBack) {
    setTimeout(function() {
        // Create the channel work buffer
        var buf = new Uint8Array(waveSize * WAVE_CHAN * 2);
        var b = buf.length - 2;
        var iterate = function() {
            var begin = new Date();
            var count = 0;
            while(b >= 0)
            {
                buf[b] = 0;
                buf[b + 1] = 128;
                b -= 2;
                count += 1;
                if (count % 1000 === 0 && (new Date() - begin) > MAX_TIME) {
                    setTimeout(iterate, 0);
                    return;
                }
            }
            setTimeout(function() {callBack(buf);}, 0);
        };
        setTimeout(iterate, 0);
    }, 0);
}

function applyDelay(chnBuf, waveSamples, instr, rowLen, callBack) {
    var p1 = (instr.fx_delay_time * rowLen) >> 1;
    var t1 = instr.fx_delay_amt / 255;

    var n1 = 0;
    var iterate = function() {
        var beginning = new Date();
        var count = 0;
        while(n1 < waveSamples - p1)
        {
            var b1 = 4 * n1;
            var l = 4 * (n1 + p1);

            // Left channel = left + right[-p1] * t1
            var x1 = chnBuf[l] + (chnBuf[l+1] << 8) +
                (chnBuf[b1+2] + (chnBuf[b1+3] << 8) - 32768) * t1;
            chnBuf[l] = x1 & 255;
            chnBuf[l+1] = (x1 >> 8) & 255;

            // Right channel = right + left[-p1] * t1
            x1 = chnBuf[l+2] + (chnBuf[l+3] << 8) +
                (chnBuf[b1] + (chnBuf[b1+1] << 8) - 32768) * t1;
            chnBuf[l+2] = x1 & 255;
            chnBuf[l+3] = (x1 >> 8) & 255;
            ++n1;
            count += 1;
            if (count % 1000 === 0 && (new Date() - beginning) > MAX_TIME) {
                setTimeout(iterate, 0);
                return;
            }
        }
        setTimeout(callBack, 0);
    };
    setTimeout(iterate, 0);
}

sonantx.AudioGenerator = function(mixBuf) {
    this.mixBuf = mixBuf;
    this.waveSize = mixBuf.length / WAVE_CHAN / 2;
};
sonantx.AudioGenerator.prototype.getWave = function() {
    var mixBuf = this.mixBuf;
    var waveSize = this.waveSize;
    // Local variables
    var b, k, x, wave, l1, l2, s, y;

    // Turn critical object properties into local variables (performance)
    var waveBytes = waveSize * WAVE_CHAN * 2;

    // Convert to a WAVE file (in a binary string)
    l1 = waveBytes - 8;
    l2 = l1 - 36;
    wave = String.fromCharCode(82,73,70,70,
                               l1 & 255,(l1 >> 8) & 255,(l1 >> 16) & 255,(l1 >> 24) & 255,
                               87,65,86,69,102,109,116,32,16,0,0,0,1,0,2,0,
                               68,172,0,0,16,177,2,0,4,0,16,0,100,97,116,97,
                               l2 & 255,(l2 >> 8) & 255,(l2 >> 16) & 255,(l2 >> 24) & 255);
    b = 0;
    while(b < waveBytes)
    {
        // This is a GC & speed trick: don't add one char at a time - batch up
        // larger partial strings
        x = "";
        for (k = 0; k < 256 && b < waveBytes; ++k, b += 2)
        {
            // Note: We amplify and clamp here
            y = 4 * (mixBuf[b] + (mixBuf[b+1] << 8) - 32768);
            y = y < -32768 ? -32768 : (y > 32767 ? 32767 : y);
            x += String.fromCharCode(y & 255, (y >> 8) & 255);
        }
        wave += x;
    }
    return wave;
};
sonantx.AudioGenerator.prototype.getAudio = function() {
    var wave = this.getWave();
    var a = new Audio("data:audio/wav;base64," + btoa(wave));
    a.preload = "none";
    a.load();
    return a;
};
sonantx.AudioGenerator.prototype.getAudioBuffer = function(callBack) {
    if (audioCtx === null)
        audioCtx = new AudioContext();
    var mixBuf = this.mixBuf;
    var waveSize = this.waveSize;

    var buffer = audioCtx.createBuffer(WAVE_CHAN, this.waveSize, WAVE_SPS); // Create Mono Source Buffer from Raw Binary
    var lchan = buffer.getChannelData(0);
    var rchan = buffer.getChannelData(1);
    var b = 0;
    var iterate = function() {
        var beginning = new Date();
        var count = 0;
        while (b < waveSize) {
            var y = 4 * (mixBuf[b * 4] + (mixBuf[(b * 4) + 1] << 8) - 32768);
            y = y < -32768 ? -32768 : (y > 32767 ? 32767 : y);
            lchan[b] = y / 32768;
            y = 4 * (mixBuf[(b * 4) + 2] + (mixBuf[(b * 4) + 3] << 8) - 32768);
            y = y < -32768 ? -32768 : (y > 32767 ? 32767 : y);
            rchan[b] = y / 32768;
            b += 1;
            count += 1;
            if (count % 1000 === 0 && new Date() - beginning > MAX_TIME) {
                setTimeout(iterate, 0);
                return;
            }
        }
        setTimeout(function() {callBack(buffer);}, 0);
    };
    setTimeout(iterate, 0);
};

sonantx.SoundGenerator = function(instr, rowLen) {
    this.instr = instr;
    this.rowLen = rowLen || 5605;

    this.osc_lfo = oscillators[instr.lfo_waveform];
    this.osc1 = oscillators[instr.osc1_waveform];
    this.osc2 = oscillators[instr.osc2_waveform];
    this.attack = instr.env_attack;
    this.sustain = instr.env_sustain;
    this.release = instr.env_release;
    this.panFreq = Math.pow(2, instr.fx_pan_freq - 8) / this.rowLen;
    this.lfoFreq = Math.pow(2, instr.lfo_freq - 8) / this.rowLen;
};
sonantx.SoundGenerator.prototype.genSound = function(n, chnBuf, currentpos) {
    var marker = new Date();
    var c1 = 0;
    var c2 = 0;

    // Precalculate frequencues
    var o1t = getnotefreq(n + (this.instr.osc1_oct - 8) * 12 + this.instr.osc1_det) * (1 + 0.0008 * this.instr.osc1_detune);
    var o2t = getnotefreq(n + (this.instr.osc2_oct - 8) * 12 + this.instr.osc2_det) * (1 + 0.0008 * this.instr.osc2_detune);

    // State variable init
    var q = this.instr.fx_resonance / 255;
    var low = 0;
    var band = 0;
    for (var j = this.attack + this.sustain + this.release - 1; j >= 0; --j)
    {
        var k = j + currentpos;

        // LFO
        var lfor = this.osc_lfo(k * this.lfoFreq) * this.instr.lfo_amt / 512 + 0.5;

        // Envelope
        var e = 1;
        if(j < this.attack)
            e = j / this.attack;
        else if(j >= this.attack + this.sustain)
            e -= (j - this.attack - this.sustain) / this.release;

        // Oscillator 1
        var t = o1t;
        if(this.instr.lfo_osc1_freq) t += lfor;
        if(this.instr.osc1_xenv) t *= e * e;
        c1 += t;
        var rsample = this.osc1(c1) * this.instr.osc1_vol;

        // Oscillator 2
        t = o2t;
        if(this.instr.osc2_xenv) t *= e * e;
        c2 += t;
        rsample += this.osc2(c2) * this.instr.osc2_vol;

        // Noise oscillator
        if(this.instr.noise_fader) rsample += (2*Math.random()-1) * this.instr.noise_fader * e;

        rsample *= e / 255;

        // State variable filter
        var f = this.instr.fx_freq;
        if(this.instr.lfo_fx_freq) f *= lfor;
        f = 1.5 * Math.sin(f * 3.141592 / WAVE_SPS);
        low += f * band;
        var high = q * (rsample - band) - low;
        band += f * high;
        switch(this.instr.fx_filter)
        {
            case 1: // Hipass
                rsample = high;
                break;
            case 2: // Lopass
                rsample = low;
                break;
            case 3: // Bandpass
                rsample = band;
                break;
            case 4: // Notch
                rsample = low + high;
                break;
            default:
        }

        // Panning & master volume
        t = osc_sin(k * this.panFreq) * this.instr.fx_pan_amt / 512 + 0.5;
        rsample *= 39 * this.instr.env_master;

        // Add to 16-bit channel buffer
        k = k * 4;
        if (k + 3 < chnBuf.length) {
            var x = chnBuf[k] + (chnBuf[k+1] << 8) + rsample * (1 - t);
            chnBuf[k] = x & 255;
            chnBuf[k+1] = (x >> 8) & 255;
            x = chnBuf[k+2] + (chnBuf[k+3] << 8) + rsample * t;
            chnBuf[k+2] = x & 255;
            chnBuf[k+3] = (x >> 8) & 255;
        }
    }
};
sonantx.SoundGenerator.prototype.getAudioGenerator = function(n, callBack) {
    var bufferSize = (this.attack + this.sustain + this.release - 1) + (32 * this.rowLen);
    var self = this;
    genBuffer(bufferSize, function(buffer) {
        self.genSound(n, buffer, 0);
        applyDelay(buffer, bufferSize, self.instr, self.rowLen, function() {
            callBack(new sonantx.AudioGenerator(buffer));
        });
    });
};
sonantx.SoundGenerator.prototype.createAudio = function(n, callBack) {
    this.getAudioGenerator(n, function(ag) {
        callBack(ag.getAudio());
    });
};
sonantx.SoundGenerator.prototype.createAudioBuffer = function(n, callBack) {
    this.getAudioGenerator(n, function(ag) {
        ag.getAudioBuffer(callBack);
    });
};

sonantx.MusicGenerator = function(song) {
    this.song = song;
    // Wave data configuration
    this.waveSize = WAVE_SPS * song.songLen; // Total song size (in samples)
};
sonantx.MusicGenerator.prototype.generateTrack = function (instr, mixBuf, callBack) {
    var self = this;
    genBuffer(this.waveSize, function(chnBuf) {
        // Preload/precalc some properties/expressions (for improved performance)
        var waveSamples = self.waveSize,
            waveBytes = self.waveSize * WAVE_CHAN * 2,
            rowLen = self.song.rowLen,
            endPattern = self.song.endPattern,
            soundGen = new sonantx.SoundGenerator(instr, rowLen);

        var currentpos = 0;
        var p = 0;
        var row = 0;
        var recordSounds = function() {
            var beginning = new Date();
            while (true) {
                if (row === 32) {
                    row = 0;
                    p += 1;
                    continue;
                }
                if (p === endPattern - 1) {
                    setTimeout(delay, 0);
                    return;
                }
                var cp = instr.p[p];
                if (cp) {
                    var n = instr.c[cp - 1].n[row];
                    if (n) {
                        soundGen.genSound(n, chnBuf, currentpos);
                    }
                }
                currentpos += rowLen;
                row += 1;
                if (new Date() - beginning > MAX_TIME) {
                    setTimeout(recordSounds, 0);
                    return;
                }
            }
        };

        var delay = function() {
            applyDelay(chnBuf, waveSamples, instr, rowLen, finalize);
        };

        var b2 = 0;
        var finalize = function() {
            var beginning = new Date();
            var count = 0;
            // Add to mix buffer
            while(b2 < waveBytes)
            {
                var x2 = mixBuf[b2] + (mixBuf[b2+1] << 8) + chnBuf[b2] + (chnBuf[b2+1] << 8) - 32768;
                mixBuf[b2] = x2 & 255;
                mixBuf[b2+1] = (x2 >> 8) & 255;
                b2 += 2;
                count += 1;
                if (count % 1000 === 0 && (new Date() - beginning) > MAX_TIME) {
                    setTimeout(finalize, 0);
                    return;
                }
            }
            setTimeout(callBack, 0);
        };
        setTimeout(recordSounds, 0);
    });
};
sonantx.MusicGenerator.prototype.getAudioGenerator = function(callBack) {
    var self = this;
    genBuffer(this.waveSize, function(mixBuf) {
        var t = 0;
        var recu = function() {
            if (t < self.song.songData.length) {
                t += 1;
                self.generateTrack(self.song.songData[t - 1], mixBuf, recu);
            } else {
                callBack(new sonantx.AudioGenerator(mixBuf));
            }
        };
        recu();
    });
};
sonantx.MusicGenerator.prototype.createAudio = function(callBack) {
    this.getAudioGenerator(function(ag) {
        callBack(ag.getAudio());
    });
};
sonantx.MusicGenerator.prototype.createAudioBuffer = function(callBack) {
    this.getAudioGenerator(function(ag) {
        ag.getAudioBuffer(callBack);
    });
};

})();

//------------------------------------------------------------
// Song
//------------------------------------------------------------
var song = {
    "rowLen": 2242,
    "endPattern": 49,
    "songData": [
        {
            "osc1_oct": 7,
            "osc1_det": 0,
            "osc1_detune": 0,
            "osc1_xenv": 1,
            "osc1_vol": 255,
            "osc1_waveform": 0,
            "osc2_oct": 7,
            "osc2_det": 0,
            "osc2_detune": 0,
            "osc2_xenv": 1,
            "osc2_vol": 255,
            "osc2_waveform": 0,
            "noise_fader": 0,
            "env_attack": 50,
            "env_sustain": 150,
            "env_release": 4800,
            "env_master": 200,
            "fx_filter": 2,
            "fx_freq": 600,
            "fx_resonance": 254,
            "fx_delay_time": 0,
            "fx_delay_amt": 0,
            "fx_pan_freq": 0,
            "fx_pan_amt": 0,
            "lfo_osc1_freq": 0,
            "lfo_fx_freq": 0,
            "lfo_freq": 0,
            "lfo_amt": 0,
            "lfo_waveform": 0,
            "p": [
                1,
                1,
                1,
                2,
                1,
                1,
                1,
                1,
                1,
                1,
                1,
                3,
                1,
                1,
                1,
                1,
                1,
                1,
                1,
                3,
                1,
                1,
                1,
                1,
                1,
                1,
                1,
                3,
                4,
                4,
                4,
                4,
                4,
                4,
                4,
                3,
                1,
                1,
                1,
                1,
                1,
                1,
                1,
                3,
                1,
                1,
                1,
                2
            ],
            "c": [
                {
                    "n": [
                        128,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        128,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0
                    ]
                },
                {
                    "n": [
                        128,
                        0,
                        0,
                        0,
                        0,
                        0,
                        128,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        128,
                        0,
                        0,
                        0,
                        0,
                        0,
                        128,
                        0,
                        0,
                        0
                    ]
                },
                {
                    "n": [
                        128,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        128,
                        0,
                        0,
                        0,
                        0,
                        0,
                        128,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0
                    ]
                },
                {
                    "n": [
                        128,
                        0,
                        0,
                        0,
                        0,
                        0,
                        128,
                        0,
                        0,
                        0,
                        0,
                        0,
                        128,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        128,
                        0,
                        128,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0
                    ]
                }
            ]
        },
        {
            "osc1_oct": 8,
            "osc1_det": 0,
            "osc1_detune": 0,
            "osc1_xenv": 1,
            "osc1_vol": 160,
            "osc1_waveform": 0,
            "osc2_oct": 8,
            "osc2_det": 0,
            "osc2_detune": 0,
            "osc2_xenv": 1,
            "osc2_vol": 160,
            "osc2_waveform": 0,
            "noise_fader": 210,
            "env_attack": 50,
            "env_sustain": 200,
            "env_release": 6800,
            "env_master": 160,
            "fx_filter": 4,
            "fx_freq": 11025,
            "fx_resonance": 254,
            "fx_delay_time": 6,
            "fx_delay_amt": 0,
            "fx_pan_freq": 5,
            "fx_pan_amt": 61,
            "lfo_osc1_freq": 0,
            "lfo_fx_freq": 1,
            "lfo_freq": 4,
            "lfo_amt": 0,
            "lfo_waveform": 0,
            "p": [
                1,
                1,
                1,
                2,
                1,
                1,
                1,
                1,
                1,
                1,
                1,
                2,
                1,
                1,
                1,
                1,
                1,
                1,
                1,
                2,
                1,
                1,
                1,
                1,
                1,
                1,
                1,
                2,
                4,
                4,
                4,
                4,
                4,
                4,
                4,
                2,
                1,
                1,
                1,
                1,
                1,
                1,
                1,
                1,
                1,
                1,
                1,
                1
            ],
            "c": [
                {
                    "n": [
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        128,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        128,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0
                    ]
                },
                {
                    "n": [
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        128,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        128,
                        0,
                        0,
                        0,
                        128,
                        0,
                        0,
                        0,
                        128,
                        0,
                        128,
                        0
                    ]
                },
                {
                    "n": [
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0
                    ]
                },
                {
                    "n": [
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        128,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        128,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0
                    ]
                }
            ]
        },
        {
            "osc1_oct": 6,
            "osc1_det": 0,
            "osc1_detune": 0,
            "osc1_xenv": 0,
            "osc1_vol": 255,
            "osc1_waveform": 1,
            "osc2_oct": 7,
            "osc2_det": 0,
            "osc2_detune": 0,
            "osc2_xenv": 0,
            "osc2_vol": 154,
            "osc2_waveform": 1,
            "noise_fader": 0,
            "env_attack": 197,
            "env_sustain": 88,
            "env_release": 10614,
            "env_master": 45,
            "fx_filter": 2,
            "fx_freq": 4425,
            "fx_resonance": 163,
            "fx_delay_time": 8,
            "fx_delay_amt": 119,
            "fx_pan_freq": 3,
            "fx_pan_amt": 158,
            "lfo_osc1_freq": 0,
            "lfo_fx_freq": 0,
            "lfo_freq": 0,
            "lfo_amt": 0,
            "lfo_waveform": 0,
            "p": [
                2,
                3,
                2,
                3,
                2,
                3,
                2,
                3,
                2,
                3,
                4,
                5,
                2,
                3,
                2,
                3,
                2,
                3,
                4,
                5,
                2,
                3,
                2,
                3,
                2,
                3,
                4,
                5,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                2,
                3,
                2,
                3,
                2,
                3,
                4,
                5,
                2,
                3,
                2,
                2
            ],
            "c": [
                {
                    "n": [
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        128,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        133,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0
                    ]
                },
                {
                    "n": [
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        135,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        135,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0
                    ]
                },
                {
                    "n": [
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        143,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        142,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0
                    ]
                },
                {
                    "n": [
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        133,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        133,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0
                    ]
                },
                {
                    "n": [
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        137,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        138,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0
                    ]
                }
            ]
        },
        {
            "osc1_oct": 7,
            "osc1_det": 0,
            "osc1_detune": 0,
            "osc1_xenv": 1,
            "osc1_vol": 144,
            "osc1_waveform": 3,
            "osc2_oct": 6,
            "osc2_det": 0,
            "osc2_detune": 9,
            "osc2_xenv": 1,
            "osc2_vol": 162,
            "osc2_waveform": 0,
            "noise_fader": 255,
            "env_attack": 663,
            "env_sustain": 0,
            "env_release": 1584,
            "env_master": 37,
            "fx_filter": 1,
            "fx_freq": 6531,
            "fx_resonance": 132,
            "fx_delay_time": 12,
            "fx_delay_amt": 9,
            "fx_pan_freq": 0,
            "fx_pan_amt": 0,
            "lfo_osc1_freq": 0,
            "lfo_fx_freq": 0,
            "lfo_freq": 5,
            "lfo_amt": 0,
            "lfo_waveform": 0,
            "p": [
                0,
                0,
                0,
                0,
                4,
                4,
                4,
                4,
                4,
                4,
                4,
                4,
                4,
                4,
                4,
                4,
                4,
                4,
                4,
                4,
                4,
                4,
                4,
                4,
                4,
                4,
                4,
                4,
                3,
                3,
                3,
                3,
                3,
                3,
                3,
                3,
                4,
                4,
                4,
                4,
                4,
                4,
                4,
                4,
                4,
                4,
                0,
                0
            ],
            "c": [
                {
                    "n": [
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        140,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        145,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0
                    ]
                },
                {
                    "n": [
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        147,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        152,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0
                    ]
                },
                {
                    "n": [
                        152,
                        0,
                        0,
                        0,
                        152,
                        0,
                        0,
                        0,
                        152,
                        0,
                        0,
                        0,
                        152,
                        0,
                        0,
                        0,
                        152,
                        0,
                        0,
                        0,
                        152,
                        0,
                        0,
                        0,
                        152,
                        0,
                        0,
                        0,
                        152,
                        0,
                        0,
                        0
                    ]
                },
                {
                    "n": [
                        152,
                        0,
                        152,
                        0,
                        152,
                        0,
                        0,
                        0,
                        152,
                        0,
                        152,
                        0,
                        152,
                        0,
                        0,
                        0,
                        152,
                        0,
                        152,
                        0,
                        152,
                        0,
                        0,
                        0,
                        152,
                        0,
                        152,
                        0,
                        152,
                        0,
                        0,
                        0
                    ]
                }
            ]
        },
        {
            "osc1_oct": 7,
            "osc1_det": 0,
            "osc1_detune": 0,
            "osc1_xenv": 0,
            "osc1_vol": 63,
            "osc1_waveform": 2,
            "osc2_oct": 7,
            "osc2_det": 0,
            "osc2_detune": 0,
            "osc2_xenv": 0,
            "osc2_vol": 125,
            "osc2_waveform": 0,
            "noise_fader": 0,
            "env_attack": 444,
            "env_sustain": 3706,
            "env_release": 10614,
            "env_master": 124,
            "fx_filter": 0,
            "fx_freq": 2727,
            "fx_resonance": 199,
            "fx_delay_time": 0,
            "fx_delay_amt": 125,
            "fx_pan_freq": 3,
            "fx_pan_amt": 47,
            "lfo_osc1_freq": 1,
            "lfo_fx_freq": 0,
            "lfo_freq": 14,
            "lfo_amt": 0,
            "lfo_waveform": 1,
            "p": [
                0,
                0,
                0,
                0,
                2,
                2,
                2,
                2,
                2,
                2,
                3,
                4,
                2,
                2,
                2,
                2,
                2,
                2,
                3,
                4,
                2,
                2,
                2,
                2,
                2,
                2,
                3,
                4,
                2,
                2,
                2,
                2,
                2,
                2,
                3,
                4,
                2,
                2,
                2,
                2,
                2,
                2,
                3,
                4
            ],
            "c": [
                {
                    "n": [
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        159,
                        0,
                        0,
                        0,
                        157,
                        0,
                        157,
                        0,
                        0,
                        0,
                        157,
                        0,
                        0,
                        0,
                        152,
                        0,
                        0
                    ]
                },
                {
                    "n": [
                        123,
                        0,
                        0,
                        0,
                        126,
                        0,
                        0,
                        0,
                        128,
                        0,
                        0,
                        0,
                        130,
                        0,
                        0,
                        0,
                        131,
                        0,
                        0,
                        0,
                        130,
                        0,
                        0,
                        0,
                        128,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0
                    ]
                },
                {
                    "n": [
                        130,
                        0,
                        0,
                        0,
                        131,
                        0,
                        0,
                        0,
                        128,
                        0,
                        0,
                        0,
                        126,
                        0,
                        0,
                        0,
                        125,
                        0,
                        0,
                        0,
                        123,
                        0,
                        0,
                        0,
                        121,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0
                    ]
                },
                {
                    "n": [
                        123,
                        0,
                        0,
                        0,
                        121,
                        0,
                        0,
                        0,
                        123,
                        0,
                        0,
                        0,
                        125,
                        0,
                        0,
                        0,
                        126,
                        0,
                        0,
                        0,
                        125,
                        0,
                        0,
                        0,
                        121,
                        0,
                        0,
                        0,
                        123,
                        0,
                        0,
                        0
                    ]
                }
            ]
        },
        {
            "osc1_oct": 9,
            "osc1_det": 0,
            "osc1_detune": 0,
            "osc1_xenv": 1,
            "osc1_vol": 64,
            "osc1_waveform": 1,
            "osc2_oct": 5,
            "osc2_det": 0,
            "osc2_detune": 0,
            "osc2_xenv": 0,
            "osc2_vol": 128,
            "osc2_waveform": 3,
            "noise_fader": 0,
            "env_attack": 1776,
            "env_sustain": 7105,
            "env_release": 19736,
            "env_master": 119,
            "fx_filter": 1,
            "fx_freq": 1523,
            "fx_resonance": 128,
            "fx_delay_time": 10,
            "fx_delay_amt": 39,
            "fx_pan_freq": 3,
            "fx_pan_amt": 92,
            "lfo_osc1_freq": 0,
            "lfo_fx_freq": 1,
            "lfo_freq": 2,
            "lfo_amt": 0,
            "lfo_waveform": 3,
            "p": [
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                2,
                2,
                2,
                3,
                2,
                2,
                2,
                7,
                2,
                2,
                2,
                3,
                2,
                2,
                2,
                7,
                8,
                8,
                8,
                8,
                8,
                8,
                9,
                10,
                2,
                2,
                2,
                2,
                2,
                2,
                3,
                7
            ],
            "c": [
                {
                    "n": [
                        140,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        147,
                        0,
                        0,
                        0,
                        145,
                        0,
                        0,
                        0
                    ]
                },
                {
                    "n": [
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        133,
                        0,
                        0,
                        0,
                        135,
                        0,
                        0,
                        0
                    ]
                },
                {
                    "n": [
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        130,
                        0,
                        0,
                        0,
                        133,
                        0,
                        0,
                        0,
                        135,
                        0,
                        0,
                        0
                    ]
                },
                {
                    "n": [
                        145,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        145,
                        0,
                        0,
                        0,
                        147,
                        0,
                        0,
                        0
                    ]
                },
                {
                    "n": [
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0
                    ]
                },
                {
                    "n": [
                        135,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        145,
                        0,
                        0,
                        0,
                        147,
                        0,
                        0,
                        0
                    ]
                },
                {
                    "n": [
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        137,
                        0,
                        0,
                        0,
                        138,
                        0,
                        0,
                        0,
                        137,
                        0,
                        0,
                        0,
                        133,
                        0,
                        0,
                        0,
                        135,
                        0,
                        0,
                        0
                    ]
                },
                {
                    "n": [
                        135,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        145,
                        0,
                        0,
                        0,
                        147,
                        0,
                        0,
                        0
                    ]
                },
                {
                    "n": [
                        137,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        142,
                        0,
                        0,
                        0,
                        145,
                        0,
                        0,
                        0,
                        147,
                        0,
                        0,
                        0
                    ]
                },
                {
                    "n": [
                        140,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        152,
                        0,
                        0,
                        0,
                        149,
                        0,
                        0,
                        0,
                        150,
                        0,
                        0,
                        0,
                        149,
                        0,
                        0,
                        0,
                        145,
                        0,
                        0,
                        0,
                        147,
                        0,
                        0,
                        0
                    ]
                }
            ]
        },
        {
            "osc1_oct": 7,
            "osc1_det": 0,
            "osc1_detune": 0,
            "osc1_xenv": 1,
            "osc1_vol": 123,
            "osc1_waveform": 1,
            "osc2_oct": 8,
            "osc2_det": 0,
            "osc2_detune": 25,
            "osc2_xenv": 1,
            "osc2_vol": 166,
            "osc2_waveform": 0,
            "noise_fader": 0,
            "env_attack": 37768,
            "env_sustain": 19084,
            "env_release": 24610,
            "env_master": 43,
            "fx_filter": 4,
            "fx_freq": 4798,
            "fx_resonance": 167,
            "fx_delay_time": 8,
            "fx_delay_amt": 93,
            "fx_pan_freq": 6,
            "fx_pan_amt": 61,
            "lfo_osc1_freq": 0,
            "lfo_fx_freq": 1,
            "lfo_freq": 3,
            "lfo_amt": 67,
            "lfo_waveform": 0,
            "p": [
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                2,
                2,
                2,
                2,
                2,
                2,
                3,
                2,
                2,
                2,
                2,
                2,
                2,
                2,
                3,
                5,
                5,
                5,
                5,
                5,
                5,
                5,
                6,
                2,
                2,
                2,
                2,
                2,
                2,
                2,
                3
            ],
            "c": [
                {
                    "n": [
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0
                    ]
                },
                {
                    "n": [
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        135,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0
                    ]
                },
                {
                    "n": [
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        137,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0
                    ]
                },
                {
                    "n": [
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0
                    ]
                },
                {
                    "n": [
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        147,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0
                    ]
                },
                {
                    "n": [
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        149,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0
                    ]
                }
            ]
        }
    ],
    "songLen": 80
};
//------------------------------------------------------------
// Time functions
//------------------------------------------------------------

/**
 * Get the time in ss:ms format.
 * @param {number} time
 * @returns {string}
 */
function getTime(time) {
  return ('' + ((time * 100 | 0) / 100)).replace('.', ':');
}

/**
 * Get seconds from time.
 * @param {string} time
 * @returns {string}
 */
function getSeconds(time) {
  if (time.indexOf(':') !== -1) {
    return time.substr(0, time.indexOf(':'));
  }

  return '0';
}

/**
 * Get milliseconds from time.
 * @param {string} time
 * @returns {string}
 */
function getMilliseconds(time) {
  if (time.indexOf(':') !== -1) {
    return time.substr(time.indexOf(':') + 1);
  }

  return '0';
}

/**
 * Get the best time for the song.
 */
function getBestTime() {
  bestTimes = kontra.store.get('js13k-2018:best') || {};
  bestTime = bestTimes[songName] || '0:00';
}

/**
 * Set the best time for the song.
 */
function setBestTime() {
  if (isBetterTime(audio.currentTime)) {
    bestTime = getTime(audio.currentTime);
    bestTimes[songName] = bestTime;
    kontra.store.set('js13k-2018:best', bestTimes);
  }
}

/**
 * Check to see if the time is better than the best time.
 * @param {number} time
 * @returns {boolean}
 */
function isBetterTime(time) {
  return time > parseInt(bestTime.replace(':', '.'));
}
async function main() {
  setFontMeasurement();
  getBestTime();
  loadingScene.show();

  // i couldn't figure out how to transform a buffer into an audio element or
  // vise versa, so we're just going to do the work twice
  let songGen = new sonantx.MusicGenerator(song);
  let promises = [];

  promises.push(new Promise((resolve) => {
    songGen.createAudio(function(a) {
      audio = a;
      console.log("audio")
      resolve();
    });
  }), new Promise((resolve) => {
    songGen.createAudioBuffer(function(b) {
      buffer = b;
      console.log("buffer")
      resolve();
    });
  }));

  Promise.all(promises).then(() => {
    generateWaveData();
    loadingScene.hide(() => {
      menuScene.show(() => startBtn.focus());
    });
  });

  // music from https://opengameart.org/content/adventure-theme
  // await fetchAudio('./' + songName);
  // menuScene.show(() => startBtn.focus());
}

main();