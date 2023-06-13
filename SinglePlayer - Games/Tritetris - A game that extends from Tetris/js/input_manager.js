function InputManager() {
  this.events = {};
  this.listenToButtons();
  this.listenToKeyboard();
  this.listenToScreen();
}

InputManager.prototype.on = function(event, callback) {
  if (!this.events[event])  {
    this.events[event] = [];
  }
  this.events[event].push(callback);
}

InputManager.prototype.emit = function(event, data) {
  var callbacks = this.events[event];
  if (callbacks)  {
    callbacks.forEach(function(callback) {
      callback(data);
    });
  }
}

InputManager.prototype.listenToButtons = function() {
  this.bindButtonPress('.pause-or-continue-btn', this.pauseOrContinue);
  this.bindButtonPress('.deform-btn', this.deform);
  this.bindButtonPress('.clockwise-btn', this.rotate);
  this.bindButtonPress('.anticlockwise-btn', this.rotate);

  this.bindButtonPress('.replay-btn', this.replay);

}

InputManager.prototype.listenToKeyboard = function() {
  var self = this;
  var keyupMap =  {
    65: 2 * Math.PI / 3,
    68: -2 * Math.PI / 3
  };
  var keydownMap =  {
    38: 'deform',
    37: 'left',
    39: 'right',
    40: 'down'
  }
  document.addEventListener('keydown', function(event) {
    var modifiers = event.altKey || event.ctrlKey ||
                    event.metaKey || event.shiftKey;
    var keydownMapped = keydownMap[event.which];
    if (!modifiers)  {
      if (keydownMapped)  {
        event.preventDefault();
        if(keydownMapped === 'deform') {
          self.emit('deform');
        }else {
          self.emit('move', keydownMapped);
        }
      }
    }
  });

  document.addEventListener('keyup', function(event) {
    var modifiers = event.altKey || event.ctrlKey ||
                    event.metaKey || event.shiftKey;
    var keyupMapped = keyupMap[event.which];
    if (!modifiers)  {
      if (keyupMapped)  {
        event.preventDefault();
        self.emit('rotate', keyupMapped);
      }
    }
  });
}

InputManager.prototype.listenToScreen = function() {
  var self = this;
  var touchStartClientX, touchStartClientY, 
      touchMoveClientX, touchMoveClientY;
  var gameCanvas = document.querySelector('.game-canvas');

  gameCanvas.addEventListener('touchstart', function(event) {
    if (event.touches.length > 1 || event.targetTouches.length > 1) return;
    event.preventDefault();
    touchStartClientX = event.touches[0].clientX;
    touchStartClientY = event.touches[0].clientY;
  });

  gameCanvas.addEventListener('touchmove', function(event) {
    if (event.touches.length > 1 || event.targetTouches.length > 1) return;
    event.preventDefault();
    touchMoveClientX = event.touches[0].clientX;
    touchMoveClientY = event.touches[0].clientY;
    var dx = touchMoveClientX - touchStartClientX, 
        dy = touchMoveClientY - touchStartClientY;
    var absDx = Math.abs(dx), absDy = Math.abs(dy);
    if (Math.max(absDx, absDy) > 10)  {
      if (dy < 0 && absDy > absDx)  {
        self.emit('deform');
      } else {
        self.emit('move', 
          absDx > absDy ? (dx > 0 ? 'right' : 'left')
                        : (dy > 0 ? 'down' : ''));
      }
      touchStartClientX = touchMoveClientX;
      touchStartClientY = touchMoveClientY;
    }
  });
}

InputManager.prototype.deform = function(event) {
  event.preventDefault();
  this.emit('deform'); 
}

InputManager.prototype.rotate = function(event) {
  event.preventDefault();
  if (event.target.className === 'clockwise-btn') {
    this.emit('rotate', 2 * Math.PI / 3);
  } else if (event.target.className === 'anticlockwise-btn') {
    this.emit('rotate', -2 * Math.PI / 3);
  }
}

InputManager.prototype.pauseOrContinue = function(event) {
  event.preventDefault();
  if (event.target.innerText === 'Pause') {
    this.emit('pause');
  } else  {
    this.emit('continue');
  }
}

InputManager.prototype.replay = function(event) {
  event.preventDefault();
  this.emit('replay');
}

InputManager.prototype.bindButtonPress = function(selector, fn) {
  var button = document.querySelector(selector);
  button.addEventListener('click', fn.bind(this));
  button.addEventListener('touchend', fn.bind(this));
}

