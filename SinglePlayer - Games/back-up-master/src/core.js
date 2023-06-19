// all images used
var sources = [	"a/font.png",
				"a/bar_base.png",
				"a/p2.png",
				"a/leaf.png",
				"a/plat.png",
				"a/spr2.png",
				"a/w.png",
				"a/shade.png",
				"a/ray.png"];

// storage for all images
var im = {};

// counts for preloading
var ldImg = 0;
var tImg = 0;

// sections
var preload;
var menu;
var game;

// screen transition
var trans;
var transFunc;

var cv = null;
var cvRect = null;
var ctx = null;

var audioCtx = null;

// game state
var state;

// scaling
var scale;
var ratio;

var mPos;
var buttons = [];

// ref to this scope level
var target = this;

// run init on load
window.onload = init;
window.addEventListener('resize', resize, false);

var hiscore = 0;

// first time playeing
var isFT = true;

// mode
var isTouch = false;

var bg = null;


/* Initialisation */

function init() {
	
	window.AudioContext = window.AudioContext || window.webkitAudioContext;

	if (window.AudioContext) audioCtx = new window.AudioContext();

	state = Constants.S_INIT;
	
	cv = document.getElementById('game');
	cvRect = cv.getBoundingClientRect();
	ctx = cv.getContext('2d');
	ctx.webkitImageSmoothingEnabled = false;
	
	bg = ctx.createLinearGradient(0, 0, 0, 720);
	bg.addColorStop(0, "#9BD8E7");
	bg.addColorStop(1, "#1EADD9");

	//ratio = cv.height / cv.width;
	ratio = cv.width / cv.height;
	
	resize();
	
	// create preloader with width and height
	preload = new Preloader(this, 200, 32);
	
	// handle mouse behavior
	mPos = {x:0, y:0};
	cv.addEventListener('mousemove', msMv, false);
	cv.addEventListener('mousedown', msDn, false);
	cv.addEventListener('mouseup', msUp, false);

	cv.addEventListener('touchmove', tMv, false);
	cv.addEventListener('touchstart', tDn, false);
	cv.addEventListener('touchend', tUp, false);
	
	cv.addEventListener('keydown', onKeyDown, false);
	cv.addEventListener('keyup', onKeyUp, false);
	
	// main update loop
	setInterval(update, 1000 / Constants.FPS);
}

function resize() {

	cv.height = window.innerHeight;
	cv.width = cv.height * ratio; 
	
	// set the scale (fixed ratio)
	scale = cv.width / Constants.W;
}

function print(px, py, text, center, s) {
	
	var i = -1;
	var len = text.length;
	var image = im["a/font.png"];
	
	var size = s || 1;

	var offset = 0;
	
	if (center) offset = (len * 22 * size) * 0.5;
	
	while(i++ < len) {
		
		ctx.drawImage(image, ((text.charCodeAt(i) - 32) % 10) * 32, (Math.floor((text.charCodeAt(i) - 32) / 10) - 1) * 32, 32, 32, ((px - offset) * scale) + (i * 22 * scale * size), py * scale, 32 * size * scale, 32 * size * scale);
	}
}


/* Keyboard */

function onKeyDown(event) {
	
	if (state == Constants.S_GAME) game.msDn(1);
}

function onKeyUp(event) {
	
	if (state == Constants.S_GAME) game.msUp(1);
	else if (state == Constants.S_MENU) menu.click(mPos.x, mPos.y);
}


/* Mouse Handling */

function msMv(event) {
	
	mPos = getmPos(cv, event);
}

function msDn(event) {
	
	if (state == Constants.S_GAME) game.msDn(1);
}

function msUp(event) {
	
	if (state == Constants.S_MENU) menu.click(mPos.x, mPos.y);
	else if (state == Constants.S_GAME) game.msUp(1);
}


/* Touch Handling */

function tMv(event) {
	
	event.preventDefault();
	
	mPos = tPos(cv, event);
}

function tDn(event) {
	
	event.preventDefault();
	mPos = tPos(cv, event);
	
	if (state == Constants.S_GAME) {
		
		if (mPos.x < Constants.W * 0.5 * scale) game.msDn(1);
		else game.msDn(2);
	}
}

function tUp(event) {
	
	event.preventDefault();
	mPos = tPos(cv, event);
	
	if (state == Constants.S_MENU) {
		
		isTouch = true;
		menu.click(mPos.x, mPos.y);
	}
	else if (state == Constants.S_GAME) {
	
		if (mPos.x < Constants.W * 0.5 * scale) game.msUp(1);
		else game.msUp(2);
	}
}

function tPos(cv, event) {
	
	return { x: event.changedTouches[0].pageX - cv.offsetLeft, y: event.changedTouches[0].pageY - cv.offsetTop };
}

function getmPos(cv, event) {
	
	return { x: event.pageX - cv.offsetLeft, y: event.pageY - cv.offsetTop };
}


/* Simple Image Loading */

function loadAllImages(src) {
	
	// count images
	tImg = src.length;
	
	// load images
	for (var s in src) loadImage(src[s]);
}

function loadImage(src) {

	im[src] = new Image();
	im[src].onload = function() {
	
		ldImg += 1;
		preload.update(ldImg, tImg);
	}
	
	im[src].src = src;
}

function startGame(players) {
	
	numPlayers = players;
	transFunc = onTransGame;
	trans.start();
}

function quitGame() {
	
	transFunc = onTransQuit;
	trans.start();
}

function onTransQuit() {

	game.cleanUp();
	game = null;
	
	menu = new Menu();			
	
	state = Constants.S_MENU;
}

function onTransGame() {
	
	game = new Game();
	game.init();
	
	state = Constants.S_GAME;
	
	menu.cleanUp();
	menu = null;
}

function rnd() {

	return Math.random();
}

/* Main Loop */

function update() {
	
	// clear the screen
	ctx.clearRect(0, 0, cv.width, cv.height);
	
	switch (state) {
		
		case Constants.S_INIT:
			
			if (preload.isReady) {
				
				loadAllImages(sources);
				state = Constants.S_LOAD;
			}
			break;
		
		case Constants.S_LOAD:
			
			preload.draw();
			
			if (preload.isComplete) {
				
				menu = new Menu();
				
				trans = new Transition();
				state = Constants.S_MENU;
			}
			break;
			
		case Constants.S_MENU:
			
			menu.update(mPos.x, mPos.y);
			break;
		
		case Constants.S_GAME:			
			
			game.update(mPos.x, mPos.y);
			break;
	}
	
	if (trans) trans.update();
	
	if (state > Constants.S_LOAD) print(235, 16, "BEST " + hiscore, true);
}