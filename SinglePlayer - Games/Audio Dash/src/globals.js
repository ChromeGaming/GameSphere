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