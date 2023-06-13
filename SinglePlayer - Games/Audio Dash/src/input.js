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