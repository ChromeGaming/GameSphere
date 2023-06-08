var scoreFactor = 100,
    thrust = -0.01,
    grav = 0.002,
    maxVel = 0.9,
    highscore = 0,
    baseDelta = 7,
    paused, delT, currentScreen, tutorial, score, camY, velY, running, can,
    ctx, hero, joystick, bg;

var TUT_INTRO = 0,
    TUT_GRAB = 1,
    TUT_RELEASE = 2,
    TUT_REVERSE = 3,
    TUT_AVOID = 4,
    TUT_OVER = 5,
    TUT_FAIL = 6;

function isTouchEnabled() {
    return 'ontouchstart' in window || navigator.msMaxTouchPoints;
}

function isHighResolution() {
    return window.devicePixelRatio > 2;
}

function Tutorial() {
    this.fadeDelay = 10;
    this._state = TUT_INTRO;
    this._delTV = 0.04;
    this._t = 0;
    delT = 0;
    joystick.disabled = true;
}

Tutorial.prototype = {
    _changeState: function(nextState) {
        this._state = nextState;
        this._t = 0;
    },
    _retry: function() {
        this._sinceGrab = null;
        this._sinceRelease = null;
    },
    update: function() {
        this._t += 1;
        switch(this._state) {
            case TUT_INTRO:
                if (this._t >= 80) {
                    this._changeState(TUT_GRAB);
                    joystick.disabled = false;
                }
                break;
            case TUT_GRAB:
                if (delT < 3) {
                    delT += this._delTV;
                }
                if (this._sinceGrab) {
                    if (this._t >= this._sinceGrab + this.fadeDelay) {
                        this._changeState(TUT_RELEASE);
                    }
                }
                break;
            case TUT_RELEASE:
                if (delT > 0.7) {
                    delT -= this._delTV;
                }
                if (this._sinceRelease) {
                    delT += this._delTV;
                    if (this._t >= this._sinceRelease + this.fadeDelay) {
                        this._changeState(TUT_REVERSE);
                    }
                }
                break;
            case TUT_REVERSE:
                if (this._t >= 150) {
                    this._changeState(TUT_AVOID);
                }
                break;
            case TUT_AVOID:
                if (delT < 5) {
                    delT += this._delTV;
                }
                if (this._t >= 500) {
                    this._changeState(TUT_OVER);
                }
                break;
            case TUT_OVER:
                if (delT < baseDelta) {
                    delT += this._delTV;
                }
                break;
            case TUT_FAIL:
                if (camY < 0) {
                    velY += (-camY / 200);
                    camY = ~~(camY + velY);
                    this._t = 0;
                } else if (this._t >= 120) {
                    transition(sI('start-screen'));
                    running = false;
                    tutorial = null;
                } else {
                    camY = 0;
                }
                break;
        }
    },
    _drawText: function(txt, x, y, color, alpha, bold) {
        ctx.save();
        ctx.font = (bold ? 'bold ' : '') + '32px Arial';
        ctx.fillStyle = color || 'black';
        ctx.shadowColor = color || 'black';
        ctx.shadowBlur = 7;
        ctx.globalAlpha = alpha;
        ctx.fillText(txt, x, y - camY);
        ctx.restore();
    },
    _ease: function(s, e) {
        if (this._t < s) {
            return 0;
        } else if (this._t < s + this.fadeDelay) {
            return (this._t - s) / this.fadeDelay;
        } else if (this._t > e - this.fadeDelay) {
            return (e - this._t) / this.fadeDelay;
        } else {
            return 1;
        }
    },
    drawIndicators: function() {
        switch(this._state) {
            case TUT_GRAB:
                if (!this._sinceGrab) {
                    
                }
                break;
        }
    },
    drawMessages: function() {
        var end = Math.Infinity,
            baseX, baseY;
        switch(this._state) {
            case TUT_INTRO:
                end = 80;
                this._drawText('this is you', 150, 100, 'black', this._ease(0, end));
                break;
            case TUT_GRAB:
                if (this._sinceGrab) {
                    end = this._sinceGrab + this.fadeDelay;
                }
                this._drawText('grab the', 180, 300, 'black', this._ease(30, end));
                this._drawText('blue dot', 305, 300, 'blue', this._ease(30, end));
                break;
            case TUT_RELEASE:
                if (this._sinceRelease) {
                    end = this._sinceRelease + this.fadeDelay;
                }
                baseX = 180;
                baseY = 400;
                this._drawText('blue dot', baseX, baseY, 'blue', this._ease(10, end));
                this._drawText('moves', baseX + 125, baseY, 'black', this._ease(10, end));
                this._drawText('only', baseX + 225, baseY, 'black', this._ease(10, end), true);
                this._drawText('in the', baseX, baseY + 40, 'black', this._ease(10, end));
                this._drawText('green semicircle', baseX + 85, baseY + 40, 'green', this._ease(10, end));
                this._drawText('pull and release to', baseX, baseY + 110, 'black', this._ease(50, end));
                this._drawText('thrust', baseX + 265, baseY + 110, 'black', this._ease(50, end), true);
                break;
            case TUT_REVERSE:
                end = 150;
                baseX = 250;
                baseY = joystick.pos.y - joystick.wellSize - 60;
                this._drawText('green region', baseX, baseY, 'green', this._ease(0, end));
                this._drawText('reverses', baseX + 185, baseY, 'black', this._ease(0, end), true);
                this._drawText('every time you thrust', baseX, baseY + 40, 'black', this._ease(10, end));
                break;
            case TUT_AVOID:
                end = 500;
                this._drawText('avoid the edges of the screen', 150, 300, 'black', this._ease(30, end));
                this._drawText('keep climbing', 100, 150, 'black', this._ease(170, end));
                this._drawText('dodge falling ', 150, 30, 'black', this._ease(270, end));
                this._drawText('boxes', 345, 30, 'black', this._ease(270, end), true);
                break;
            case TUT_FAIL:
                end = 120;
                this._drawText('try again', 240, 50, 'black', this._ease(20, end), true);
        }
    },
    touchDown: function() {
        this._sinceGrab = this._t;
    },
    touchUp: function() {
        this._sinceRelease = this._t;
    },
    end: function() {
        if (this._state === TUT_OVER) {
            tutorial = null;
            endGame();
        } else if (this._state !== TUT_FAIL) {
            // restart
            this._changeState(TUT_FAIL);
        }
    }
}

// util
function sI(id) {
    return document.getElementById(id);
}

function resetScreen(s) {
    hide(s);
}

function transition(nextScreen) {
    hide(currentScreen);
    show(nextScreen);
    currentScreen = nextScreen;
}

function hide(e) {
    e.style.display = 'none';
}

function show(e) {
    e.style.display = '';
}

function forEach(arr, f) {
    for (var i = 0; i < arr.length; i++) {
        f(arr[i]);
    }
}

function randRange(start, end) {
    return Math.random() * (end - start) + start;
}

// physics functions
function motion(b) {
    b.vel.fAdd(delT, b.acc);
    b.pos.fAdd(delT, b.vel);
}

// draw functions
function drawCircle(ctx, x, y, size, fill) {
    ctx.beginPath();
    ctx.arc(x, y, size, 0, 2 * Math.PI);
    if (fill === true) {
        ctx.fill();
    } else {
        ctx.stroke();
    }
}

function drawText(txt, x, y) {
    ctx.textAlign = 'center';
    ctx.fillText(txt, x, y);
}

function drawBox(ctx, x, y, w, h) {
    ctx.fillRect(x - w / 2, y - h / 2, w, h);
}

function drawCan(can, x, y, theta) {
    if (theta) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(theta);
        ctx.drawImage(can, -can.width / 2, -can.height / 2);
        ctx.restore();
    } else {
        ctx.drawImage(can, x - can.width / 2, y - can.height / 2);
    }
}

function preDraw(f) {
    var can = document.createElement('canvas'),
        ctx = can.getContext('2d');
    f(ctx, can);
    return can;
}

function V(x, y) {
    this.x = x || 0;
    this.y = y || 0;
}

V.fromTouch = function(ev) {
    return new V(ev.clientX, ev.clientY);
}

V.fromMouse = function(ev) {
    return new V(ev.offsetX, ev.offsetY);
}

V.prototype = {
    add: function(o) {
        this.x += o.x;
        this.y += o.y;
    },

    fAdd: function(f, o) {
        this.x += f * o.x;
        this.y += f * o.y;
    },

    scale: function(f) {
        this.x *= f;
        this.y *= f;
    },

    sub: function(o) {
        this.x -= o.x;
        this.y -= o.y;
    },

    set: function(x, y) {
        this.x = x;
        this.y = y;
    },

    angle: function() {
        return Math.atan2(this.y, this.x);
    },

    rotate: function(angle) {
        var x = this.x,
            y = this.y;
        this.x = x * Math.cos(angle) - y * Math.sin(angle);
        this.y = x * Math.sin(angle) + y * Math.cos(angle);
    },

    i: function() {
        return new V(this.x, this.y);
    },

    r: function() {
        return this.x * this.x + this.y * this.y;
    },

    limit: function(rad) {
        var d = this.r(),
            rad2 = rad * rad,
            f;
        if (d > rad2) {
            f = rad / Math.sqrt(d);
            this.x *= f;
            this.y *= f;
        }
    }
}

var BOX_RED = 0,
    BOX_BLUE = 1,
    BOX_GREEN = 2;

var TYPE_PARAMS = {};

TYPE_PARAMS[BOX_RED] = {
    speed: 1,
    fill: '#e55',
    stroke: '#d88'
};

TYPE_PARAMS[BOX_BLUE] = {
    speed: 1.8,
    fill: '#77d',
    stroke: '#99b'
};
TYPE_PARAMS[BOX_GREEN] = {
    speed: 2.4,
    fill: '#6d6',
    stroke: '#8e8'
};

function Box(w, h) {
    this.pos = new V();
    this._top = 0;
    this._left = 0;
    this.w = w;
    this.h = h;
    this._type = this._getType();
    this.speed = TYPE_PARAMS[this._type].speed * boxes.speed;
    this.can = preDraw(this._drawBox.bind(this));
}

Box.prototype = {
    _getType: function() {
        var r = randRange(0, 10);
        if (r < 5) {
            return BOX_RED;
        } else if (r < 8) {
            return BOX_BLUE;
        } else {
            return BOX_GREEN;
        }
    },
    _drawBox: function(ctx, can) {
        var padX = 5,
            padY = 5;
        can.width = this.w + 2 * padX;
        can.height = this.h + 2 * padY;
        ctx.globalAlpha = 0.8;
        ctx.fillStyle = TYPE_PARAMS[this._type].fill;
        ctx.lineWidth = 5;
        ctx.strokeStyle = TYPE_PARAMS[this._type].stroke;
        ctx.beginPath();
        ctx.moveTo(padX, padY);
        ctx.lineTo(padX + this.w, padY);
        ctx.lineTo(padX + this.w, padY + this.h);
        ctx.lineTo(padX, padY + this.h);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    },
    update: function() {
        this.pos.y += this.speed * delT;
        this._top = this.pos.y - this.h / 2;
    },
    outOfView: function() {
        return (this._top) > camY + can.height;
    },
    checkCollide: function(top, left, w, h) {
        return (this._top + this.h > top && this._top < top + h) && (this._left + this.w > left && this._left < left + w);
    },
}

function Boxes() {
    var i;
    this._lastInc = 0;
    this._bs = [];
    this.numBoxes = 0;
    this.maxBoxes = 7;
    this.baseDelay = 750;
    this.numChannels = 6;
    this.speed = 0.1;
    this.incAmt = 0.065;
    this.incInt = 3000;
    this.acc = 0.001;
    this._targetSpeed = 0.1;
    this._t = 0;
    this._chs = [];
    this._chSep = can.width / this.numChannels;
    for(i = 0; i < this.numChannels; i++) {
        this._chs[i] = [];
    }
}

Boxes.prototype = {
    collides: function(top, left, w, h) {
        var c1 = ~~( (left) / this._chSep),
            c2 = ~~( (left + w) / this._chSep);
        if (this._checkChannel(c1, top, left, w, h)) {
            return true;
        }
        if (c2 !== c1) {
            if (this._checkChannel(c2, top, left, w, h)) {
                return true;
            }
        }
        return false;
    },
    _checkChannel: function(i, top, left, w, h) {
        if (i < 0 || i >= this._chs.length) return false;
        var ch = this._chs[i],
            j, b;
        for(j = 0; j < ch.length; j++) {
            b = ch[j];
            if (b.checkCollide(top, left, w, h)) {
                return true;
            }
        }
        return false;
    },
    _spawnBox: function(c) {
        var b, w, h, sp;
        w = ~~randRange(this._chSep / 2, this._chSep * 3 / 4);
        h = ~~randRange(40, 80);
        b = new Box(w, h);
        sp = this._chSep - w;
        b.pos.x = this._chSep * c + randRange(0, sp - 2) + w / 2;
        b.pos.y = camY - h - randRange(30, 60);
        b._top = b.pos.y - h / 2;
        b._left = b.pos.x - w / 2;
        if (this._checkChannel(c, b._top, b._left, w, h)) {
            // retry
            this._trySpawn();
            return;
        }
        this._chs[c].push(b);
        this.numBoxes += 1;
    },
    update: function() {
        var i, j, b, ch;
        if (this.speed < this._targetSpeed) {
            this.speed += this.acc;
        }
        for(i = 0; i < this.numChannels; i++) {
            c = this._chs[i];
            for(j = c.length - 1; j >= 0; j--) {
                // update existing
                c[j].update();
                // clear boxes
                if (c[j].outOfView()) {
                    c.splice(j, 1);
                    this.numBoxes -= 1;
                }
            }
        }
        for(i = this._bs.length - 1; i >= 0; i--) {
            if(this._bs[i].outOfView()) {
            }
        }
        // check for collision
        // add more boxes
        this._t += delT;
        if (this._t > this.baseDelay && !hero._dead) {
            this._t = 0;
            if (this.numBoxes > this.maxBoxes) {
                return;
            }
            this._trySpawn();
        }
        // increase difficulty level
        if (-hero.pos.y > -this._lastInc + this.incInt) {
            this._targetSpeed += this.incAmt;
            this._lastInc = hero.pos.y;
        }
    },
    draw: function() {
        var i, j, c, b;
        for(i = 0; i < this.numChannels; i++) {
            c = this._chs[i];
            for(j = c.length - 1; j >= 0; j--) {
                // update existing
                b = c[j];
                drawCan(b.can, b.pos.x, b.pos.y - camY);
            }
        }
    },
    _trySpawn: function() {
        var st = ~~randRange(0, 10),
            hc = ~~(hero.pos.x / this._chSep);
        // spawn strategies
        if (st < 4) {
            // same channel as player
            this._spawnBox(hc);
        } else if (st < 6) {
            // in two adjacent channels
            if (hc > 0) {
                this._spawnBox(hc - 1);
            }
            if (hc < this.numChannels - 1) {
                this._spawnBox(hc + 1);
            }
        } else {
            // randomly pick a channel
            this._spawnBox(~~randRange(0, this.numChannels - 1));
        }
    }
}

function Fragment(pos, vec) {
    this.alpha = 1;
    this.size = 30;
    this.speed = 0.55;
    this.pos = pos;
    this.vec = vec;
    this.vec.limit(this.speed);
    this.can = preDraw(this._drawCan.bind(this));
    this._t = 0;
}

Fragment.prototype = {
    _drawCan: function(ctx, can) {
        can.width = can.height = this.size * 2;
        ctx.beginPath();
        ctx.arc(this.size, this.size, this.size, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.fill();
    },
    update: function() {
        this._t += delT;
        this.alpha *= 0.87;
    },
    draw: function() {
        ctx.save();
        //ctx.globalAlpha = this.alpha;
        ctx.translate(this.pos.x + this.vec.x * this._t, this.pos.y + this.vec.y * this._t - camY);
        ctx.scale(this.alpha, this.alpha);
        ctx.drawImage(this.can, -this.can.width / 2, -this.can.height / 2)
        ctx.restore();
    }
}

function Hero() {
    this.size = 45;
    this.pos = new V();
    this.vel = new V();
    this.acc = new V();
    this.numFragments = 8;
    this.explodeTime = 40;
    this._can = preDraw(this._drawChar.bind(this));
    this._dead = false;
    this._fs = [];
}

Hero.prototype = {
    _drawChar: function(ctx, can) {
        var size = ~~(this.size * 1.2);
        can.width = can.height = size;
        ctx.globalAlpha = 0.9
        ctx.fillStyle = '#222';
        ctx.strokeStyle = '#333';
        ctx.shadowColor = '#444';
        ctx.shadowBlur = 2;
        ctx.beginPath();
        ctx.moveTo(size / 2, 0);
        ctx.lineTo(size, size / 2);
        ctx.lineTo(size / 2, size);
        ctx.lineTo(0, size / 2);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    },
    update: function() {
        motion(this);
        this.vel.limit(maxVel);
        if (this._dead) {
            if (this.explodeTime < 0) {
                return;
            } else if (this.explodeTime === 0) {
                if (tutorial) {
                    tutorial.end();
                } else {
                    endGame();
                }
            }
            this.explodeTime -= 1;
            this._fs.forEach(function(f) {
                f.update();
            });
            return;
        }
        // if out of viewport break
        var top = this.pos.y - this.size / 2,
            left = this.pos.x - this.size / 2;
        if (left < 0 || left + this.size > can.width || top < camY || top + this.size > camY + can.height) {
            this.explode();
            return;
        }
        if (boxes.collides(top, left, this.size, this.size)) {
            this.explode();
            return;
        }
        // update camY
        this._trackCam3();
    },
    draw: function() {
        if (this._dead) {
            this._fs.forEach(function(f) {
                f.draw();
            });
            return;
        }
        drawCan(this._can, this.pos.x, this.pos.y - camY, joystick._angle);
    },
    explode: function() {
        this._dead = true;
        var ang = new V(1, 0),
            angSep = 2 * Math.PI / this.numFragments,
            vec, i;
        for(i = 0; i < this.numFragments; i++) {
            vec = ang.i();
            ang.rotate(angSep);
            this._fs.push(new Fragment(this.pos.i(), vec, angSep, this.pos));
        }
    },
    impulse: function(vec) {
        vec.scale(thrust);
        hero.vel.set(vec.x, vec.y);
        hero.acc.y = grav;
        vec.scale(-1);
    },
    _trackCam1: function() {
        if (this.vel.y !== 0) {
            if (this.vel.y < 0) {
                // camY = Math.min(camY, this.pos.y - can.width / 2);
                velY = -Math.pow(-this.vel.y, 1.3) * (camY + can.height - this.pos.y) * 2 / can.height;
            } else {
                velY = Math.pow(this.vel.y, 2);
            }
        }
        camY = ~~(camY + velY * delT);
    },
    _trackCam2: function() {
        camY = ~~Math.min(camY, this.pos.y - can.height / 2);
    },
    _trackCam3: function() {
        if (this.vel.y !== 0) {
            if (this.vel.y < 0) {
                velY = -Math.pow(-this.vel.y, 1.3) * (camY + can.height - this.pos.y) * 2 / can.height;
                camY = ~~(camY + velY * delT);
            }
        }
    }
}

var STICK_ENGAGED = 1,
    STICK_RESETTING = 2,
    STICK_FREE = 3;

var DIR_LEFT = 1,
    DIR_RIGHT = 2;

function Joystick(stickSize) {
    this.wellSize = ~~stickSize;
    this.dotSize = ~~(stickSize * 0.35);
    this.pos = new V();
    this.disabled = false;
    this.reset();
    this._dotR2 = this.dotSize * this.dotSize;
    this._dotCan = preDraw(this._drawDot.bind(this));
    this._wellCan = preDraw(this._drawWell.bind(this));
    if (isTouchEnabled()) {
        // touch event listeners
        can.addEventListener('touchstart', this._touchStart.bind(this));
        can.addEventListener('touchmove', this._touchMove.bind(this));
        can.addEventListener('touchend', this._touchEnd.bind(this));
        can.addEventListener('touchcancel', this._touchEnd.bind(this));
        can.addEventListener('touchleave', this._touchEnd.bind(this));
    } else {
        // mouse event listeners
        can.addEventListener('mouseout', this._mouseUp.bind(this));
        can.addEventListener('mouseup', this._mouseUp.bind(this));
        can.addEventListener('mousedown', this._mouseDown.bind(this));
        can.addEventListener('mousemove', this._mouseMove.bind(this));
    }
}

Joystick.prototype = {
    reset: function() {
        this.resetTime = 130;
        this.dot = new V();
        this.direction = DIR_LEFT;
        this.state = STICK_FREE;
        this._angle = 0;
        this._dotV = new V();
        this._initTouch = new V();
        this._id = null;
        this._t = 0;
    },
    update: function() {
        var f;
        switch (this.state) {
        case STICK_RESETTING:
            this._t += delT;
            f = this._t / this.resetTime;
            this.dot.scale(1 - f);
            this._angle = ((this.direction === DIR_RIGHT) ? -f : (1 - f)) * Math.PI;
            if (this._t > this.resetTime) {
                this.state = STICK_FREE;
                this.dot.set(0, 0);
                this._t = 0;
                this._angle = (this.direction === DIR_RIGHT) ? Math.PI : 0;
            }
            break;
        }
    },
    draw: function() {
        drawCan(this._wellCan, this.pos.x, this.pos.y, this._angle);
        drawCan(this._dotCan, this.pos.x + this.dot.x, this.pos.y + this.dot.y);
    },
    _start: function(t) {
        t.sub(this.pos);
        if (t.r() < this._dotR2) {
            this._initTouch.set(t.x, t.y);
            this.state = STICK_ENGAGED;
            if (tutorial) {
                tutorial.touchDown();
            }
            return true;
        }
        return false;
    },
    _move: function(t) {
        t.sub(this.pos);
        t.sub(this._initTouch);
        this.dot.set(t.x, t.y);
        if (this.direction === DIR_LEFT) {
            this.dot.x = Math.min(0, this.dot.x);
        } else {
            this.dot.x = Math.max(0, this.dot.x);
        }
        this.dot.limit(this.wellSize);
    },
    _touchStart: function(ev) {
        var self = this;
        forEach(ev.changedTouches, function(touch) {
            if (self.state !== STICK_FREE || self.disabled) return;
            if (self._start(V.fromTouch(touch))) {
                self._id = touch.identifier;
            }
        });
    },
    _touchMove: function(ev) {
        if (this.state !== STICK_ENGAGED) return;
        var self = this;
        forEach(ev.changedTouches, function(touch) {
            if (touch.identifier !== self._id) return;
            self._move(V.fromTouch(touch));
        });
    },
    _touchEnd: function(ev) {
        if (this.state !== STICK_ENGAGED) return;
        var self = this;
        forEach(ev.changedTouches, function(touch) {
            if (touch.identifier !== self._id) return;
            self._release();
        });
    },
    _mouseUp: function(ev) {
        if (this.state !== STICK_ENGAGED) return;
        if (this._id !== ev.button) return;
        this._id = null;
        this._release();
    },
    _mouseDown: function(ev) {
        // interesting story here. mouse events are fired on touch devices on long press because that action opens the contextmenu
        if (this.state !== STICK_FREE) return;
        if (this._start(V.fromMouse(ev))) {
            this._id = ev.button;
        }
    },
    _mouseMove: function(ev) {
        if (this.state !== STICK_ENGAGED) return;
        if (this._id !== ev.button) return;
        this._move(V.fromMouse(ev));
    },
    _release: function() {
        this.state = STICK_RESETTING;
        hero.impulse(this.dot.i());
        this._lf = 0;
        this.direction = (this.direction === DIR_LEFT) ? DIR_RIGHT : DIR_LEFT;
        if (tutorial) {
            tutorial.touchUp();
        }
    },
    _drawDot: function(ctx, can) {
        var r = this.dotSize,
            d = 2 * r,
            blur = 8,
            width = 6,
            offset = blur + width;
        can.height = can.width = d + offset;
        ctx.fillStyle = '#55e';
        ctx.shadowBlur = blur;
        ctx.lineWidth = width;
        ctx.shadowColor = '#33a';
        var c = r + offset / 2;
        ctx.beginPath();
        ctx.arc(c, c, r, 0, 2 * Math.PI);
        ctx.fill();
    },
    _drawWell: function(ctx, can) {
        var r = this.wellSize,
            d = 2 * r,
            blur = 10,
            width = 8,
            offset = blur + width;
        can.width = can.height = d + offset;
        ctx.fillStyle = '#7f7';
        ctx.strokeStyle = '#5e5';
        ctx.shadowBlur = blur;
        ctx.lineWidth = width;
        ctx.shadowColor = '#3a3';
        var c = this.wellSize + offset / 2;
        ctx.beginPath();
        ctx.arc(c, c, r, Math.PI / 2, -Math.PI / 2);
        ctx.closePath();
        ctx.stroke();
        ctx.globalAlpha = 0.7;
        ctx.fill();
    },
}

function Background() {
    this.bgColor = '#fffacd';
    this.lineColor = '#eed8ae';
    this.numX = 22;
    this.numY = ~~(this.numX * can.height / can.width);
    this.sepX = ~~(can.width / this.numX);
    this.sepY = ~~(can.height / this.numY);
    this.subDiv = 5;
    this.rulerRes = this.sepY * this.subDiv;
    this.rulerWidth = this.sepX * 3;
    this.rulerStart = can.height - can.height % this.rulerRes;
    this.numR = ~~(can.height / this.rulerRes) + 1;
    this.gridCan= preDraw(this._drawGrid.bind(this));
}

Background.prototype = {
    _drawGrid: function(ctx, bCan) {
        bCan.width = can.width;
        bCan.height = can.height + this.sepY;
        var i, x, y;
        ctx.fillStyle = this.bgColor;
        ctx.fillRect(0, 0, bCan.width, bCan.height);
        ctx.strokeStyle = this.lineColor;
        ctx.lineWidth = 1;
        for(i = 0; i < this.numX; i++) {
            x = i * this.sepX;
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, bCan.height);
            ctx.closePath();
            ctx.stroke();
        }
        for(i = 0; i <= this.numY + 1; i++) {
            y = i * this.sepY;
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(bCan.width, y);
            ctx.closePath();
            ctx.stroke();
        }
    },
    update: function() {},
    draw: function() {
        ctx.drawImage(this.gridCan, 0, -camY % this.sepY - this.sepY);
        ctx.fillStyle = 'black';
        ctx.font = '20px sans-serif';
        ctx.textAlign = 'start';
        var y, w, txt;
        for(i = -this.subDiv; i <= this.numR * this.subDiv; i++) {
            y = ~~(i * this.rulerRes / this.subDiv - (camY % this.rulerRes));
            w = this.rulerWidth / 3;
            txt = '' + (this.rulerStart - camY - y - can.height);
            if (i % this.subDiv == 0) {
                ctx.fillText(txt, 5, y - 2);
                w = this.rulerWidth;
            }
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(w, y);
            ctx.stroke();
        }
    }
}

function updateScore(force) {
    score = ~~Math.max(score, -hero.pos.y / scoreFactor);
}

function tick() {
    if (!running) return;
    // update things
    if (!paused) {
        if (tutorial) {
            tutorial.update();
        }
        boxes.update();
        hero.update();
        joystick.update();
        bg.update();
        updateScore();
    }
    // draw things
    ctx.clearRect(0, 0, can.width, can.height);
    bg.draw();
    if (tutorial) {
        tutorial.drawMessages();
    }
    hero.draw();
    boxes.draw();
    joystick.draw();
    if (tutorial) {
        tutorial.drawIndicators();
    }
    drawScore();
    requestAnimationFrame(tick);
}

function reset() {
    paused = false;
    delT = 7;
    camY = 0;
    velY = 0;
    score = 0;
    boxes = new Boxes();
    hero = new Hero();
    hero.pos.set(100, 100);
    hero.acc.y = grav;
    running = true;
    joystick.reset();
    tick();
}

function finalScore() {
    if (!highscore) {
        try {
            highscore = +localStorage.getItem('highscore');
        } catch (e) {
            highscore = 0;
        }
    }
    sI('end-score').innerHTML = score;
    highscore = Math.max(score, highscore);
    sI('end-highscore').innerHTML = highscore;
    try {
        localStorage.setItem('highscore', highscore);
    } catch (e) {}
}

function drawScore() {
    ctx.save();
    ctx.font = '48px monospace';
    ctx.textAlign = 'end';
    ctx.fillStyle = '#444';
    ctx.shadowColor = '#222';
    ctx.shadowBlur = 3;
    ctx.fillText('' + score, can.width - 10, 54);
    ctx.restore();
}


function startGame(isTutorial) {
    transition(sI('game-canvas'));
    reset();
    if (isTutorial) {
        tutorial = new Tutorial();
    }
}

function endGame() {
    running = false;
    finalScore();
    transition(sI('end-screen'));
}

function backToMenu() {
    transition(sI('start-screen'));
}

function restartGame() {
    transition(sI('game-canvas'));
    reset();
}

function resize() {
    can.width = 600;
    can.height = document.body.clientHeight;
    bg = new Background();
    var stickSize = 120;
    joystick = new Joystick(stickSize);
    var ar = can.height / can.width,
        padX = ~~(stickSize * 1.3),
        padY;
    console.log(ar);
    // widescreen
    if (ar > 1.77) {
        padY = ~~(padX * 1.3);
    } else {
        padY = padX;
    }
    console.log(padX, padY);
    joystick.pos.set(can.width - padX, can.height - padY);
}

// cordova event handlers
function deviceReady() {
    // trap back button
    document.addEventListener('backbutton', backPressed);
}

function backPressed(e) {
    if (running === true && paused === false) {
        paused = true;
        navigator.notification.alert('Game is paused', function() {
            paused = false;
        }, 'Paused', 'Resume');
    } else {
        navigator.app.exitApp();
    }
}

document.addEventListener('deviceready', deviceReady);

window.onresize = resize;

window.onload = function() {
    currentScreen = sI('start-screen');
    resetScreen(sI('end-screen'));
    resetScreen(sI('game-canvas'));
    resetScreen(sI('settings-screen'));
    can = sI('game-canvas');
    ctx = can.getContext('2d');
    resize();
}

window.oncontextmenu = function(e) {
    e.preventDefault();
    return false;
}

document.ontouchmove = function(e){
    e.preventDefault();
    return false;
}

