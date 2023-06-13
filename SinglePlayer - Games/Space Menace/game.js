/*
	TO DO:  NEXT TIME, DESIGN THE GAME AND ALL ITS FEATURES BEFORE TYPING ANY CODE.

*/
{
    // THIS SETS UP A VARIABLE TO USE IN THE HACKY WAY I TRIED TO KEEP LANDSCAPE MODE FROM BREAKING THE GAME.
    var firstO = 'none'
    // Create the canvas 
    var canvas = document.createElement("canvas");
    var ctx = canvas.getContext("2d");
    var wide = window.innerWidth;
    var tall = window.innerHeight;
    canvas.width = wide;
    canvas.height = tall;
    canvas.style.position = 'absolute';
    canvas.style.zIndex = "-10";
    canvas.style.left = '0%';
    canvas.style.top = '0%';
    document.body.appendChild(canvas);
    var touchX = -1;
    var touchY = -1;
    var ctx = canvas.getContext("2d");
    //THIS IS CALLED ON BODY LOAD AND SETS UP TRANSPARENT BUTTON ELEMENTS THAT I HAD TO OVERLAY THE CANVAS WITH TO 
    //GET MOBILE SAFARI ON IPHONE TO PLAY THE SOUNDS AND NOT BRING UP THE LONG PRESS SAVE AS IMAGE MENU
    var setup = function() {
        if (window.innerHeight < window.innerWidth) {
            if (firstO == 'none') {
                firstO = 'Landscape'
            }
        } else {
            if (firstO == 'none') {
                firstO = 'Portrait'
            }
        }
        var BB = document.getElementById("bigButton");
        BB.style.background = 'transparent';
        BB.style.borderColor = 'transparent';
        BB.style.position = 'absolute';
        BB.style.left = '0%';
        BB.style.top = '0%';
        BB.style.width = '100%';
        BB.style.height = '100%';
        // THIS SETS UP THE INVISIBLE FULL SCREEN BUTTONS TOUCH EVENTS
        BB.addEventListener('touchstart', function(e) {
            touchX = e.changedTouches[0].pageX;
            touchY = e.changedTouches[0].pageY;
            advance = 1
            e.preventDefault();
        }, false);
        BB.addEventListener('touchmove', function(e) {
            touchX = e.changedTouches[0].pageX;
            touchY = e.changedTouches[0].pageY;
            e.preventDefault();
        }, false);
        BB.addEventListener('touchend', function(e) {
            touchX = -1
            advance = 0;
            e.preventDefault();
        }, false);
        var SB = document.getElementById("smallButton");
        SB.style.background = 'transparent';
        SB.style.borderColor = 'transparent';
        SB.style.position = 'absolute';
        SB.style.left = '0%';
        SB.style.top = '90%';
        SB.style.width = wide + 'px';
        SB.style.height = '100%';
    };
    // THIS IS WHERE A ZZFX SOUND IS PLAYED AT 0 VOLUME TO GET MOBILE SAFARI ON IPHONES TO ALLOW
    // SOUND FOR REST OF THE GAME.  IT THEN SHRINKS THE BUTTON THAT WAS CLICKED TO CALL THIS
    // DOWN TO 0% OF THE WINDOW WINDOW WIDTH AND HEIGHT MAKING IT UNCLICKABLE FOR THE REST OF THE GAME.
    var safariSFXstart = function() {
        zzfx(...[0, , 1079, .18, .12, .2, 1, .04, , 9, , , , .1, 15, , , , .02])
        var SB = document.getElementById("smallButton");
        SB.style.background = 'transparent';
        SB.style.position = 'absolute';
        SB.style.left = '-100px';
        SB.style.top = '0%';
        SB.style.width = '0%';
        SB.style.height = '0%';
        touchX = wide;
        touchY = tall;
    }

    // THIS SETS UP THE MIDDLE OF THE VISIBLE WINDOW 
    var cW = wide / 2;
    var cH = tall / 2;

    // THIS IS ZZFX.JS PASTED IN 
    'use strict';
    let zzfx, zzfxV, zzfxX
    // ZzFXMicro - Zuper Zmall Zound Zynth - v1.1.7
    zzfxV = .2
    // volume
    zzfx = // play sound
    (p=1,k=.05,b=220,e=0,r=0,t=.1,q=0,D=1,u=0,y=0,v=0,z=0,l=0,E=0,A=0,F=0,c=0,w=1,m=0,B=0)=>{
        let M = Math, R = 44100, d = 2 * M.PI, G = u *= 500 * d / R / R, C = b *= (1 - k + 2 * k * M.random(k = [])) * d / R, g = 0, H = 0, a = 0, n = 1, I = 0, J = 0, f = 0, x, h;
        e = R * e + 9;
        m *= R;
        r *= R;
        t *= R;
        c *= R;
        y *= 500 * d / R ** 3;
        A *= d / R;
        v *= d / R;
        z *= R;
        l = R * l | 0;
        for (h = e + m + r + t + c | 0; a < h; k[a++] = f)
            ++J % (100 * F | 0) || (f = q ? 1 < q ? 2 < q ? 3 < q ? M.sin((g % d) ** 3) : M.max(M.min(M.tan(g), 1), -1) : 1 - (2 * g / d % 2 + 2) % 2 : 1 - 4 * M.abs(M.round(g / d) - g / d) : M.sin(g),
            f = (l ? 1 - B + B * M.sin(d * a / l) : 1) * (0 < f ? 1 : -1) * M.abs(f) ** D * p * zzfxV * (a < e ? a / e : a < e + m ? 1 - (a - e) / m * (1 - w) : a < e + m + r ? w : a < h - c ? (h - a - c) / t * w : 0),
            f = c ? f / 2 + (c > a ? 0 : (a < h - c ? 1 : (h - a) / c) * k[a - c | 0] / 2) : f),
            x = (b += u += y) * M.cos(A * H++),
            g += x - x * E * (1 - 1E9 * (M.sin(a) + 1) % 2),
            n && ++n > z && (b += v,
            C += v,
            n = 0),
            !l || ++I % l || (b = C,
            u = G,
            n = n || 1);
        p = zzfxX.createBuffer(1, h, R);
        p.getChannelData(0).set(k);
        b = zzfxX.createBufferSource();
        b.buffer = p;
        b.connect(zzfxX.destination);
        b.start();
        return b
    }
    var AudioContext = window.AudioContext // Default
    || window.webkitAudioContext;
    // Safari and old versions of Chrome

    zzfxX = new AudioContext();
    //zzfxX = new (window.AudioContext || webkitAudioContext)
    // audio context

    // THESE ARE ALL THE GAMES SPRITES LOADED IN BASE64
    // ship image 
    var sReady = false;
    var sImage = new Image();
    sImage.onload = function() {
        sReady = true;
    }
    ;
    sImage.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAPCAYAAADtc08vAAAA3ElEQVR4nI2ToRKDMAyGo6frp/c63PEY1Wg0Fo3mkFjeY3oePd3lzzVcWiid+O6nSZqSNKW+76lC03VdYN0ZaIhr8dMwDHe8EMyaEG0SQ+M4FkEg64lod4ihaZouQRBrWJZFNAd+QPM8Kw81KmwTkES/LW3bBlrX1QFsYD2AE1hbjiTQ07ZtOzZZ2P5h3vBbcBuszyOBPdVSOh0JWAm1O2Br1vrAVe1JD/LOW7TjpZuQBJUZ+GJzaRbkGu8mMU7cfjuJlXfg4twnJG+BFzWaPEn8ffGT9/4v8gar/QeLehcr9yg/LgAAAABJRU5ErkJggg==";

    var aReady = false;
    var aImage = new Image();
    aImage.onload = function() {
        aReady = true;
    }
    ;
    aImage.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAICAYAAADA+m62AAAAaklEQVR4nGNggAJRUVGGAwwH/jMgQ3QAUrR69er/IJx9IJth6rmpDBgK+WT44IpAGMXEBijmYwBpZEAoamBAxY+PIdh4FR7vQ7DdibFaG+pOBwcHuGKHVw4MoY9DEZ7hY5BB8RRIMb7gAQCxKnVaKGiT9wAAAABJRU5ErkJggg==";

    var eReady = false;
    var eImage = new Image();
    eImage.onload = function() {
        eReady = true;
    }
    ;
    eImage.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAICAYAAADED76LAAAAP0lEQVR4nI2PbQ4AMARD39F2dDdjRBO/ZkTaUF8Y5g4unDwRkXMdqEguESpWom3makJ2qSAhvW4XfK1Yj3y9GQgSl5HSqbygAAAAAElFTkSuQmCC";
    var lReady = false;
    var lImage = new Image();
    lImage.onload = function() {
        lReady = true;
    }
    ;
    lImage.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAATElEQVR4nGNgYGD4f+DAAbIwSC8DnIGM/zNgimHBYL0YBvynxABckCgDCEGKXIDDEOLCAI8h2A3AFgs4DMFtADY8asBgNgDGIDc7AwBnALXXKC5VuQAAAABJRU5ErkJggg==";

    var rReady = false;
    var rImage = new Image();
    rImage.onload = function() {
        rReady = true;
    }
    ;
    rImage.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAASUlEQVR4nGNgYGD4f+DAAbIwSC8DnEEI/8cUA+slyYD/pBqACxJlACGI1wAiNOM2AIdi4sIAl2aiYwGXZhx41IBBYwCMQW52BgCpy7XX5fAVrgAAAABJRU5ErkJggg==";

    // THIS IS BASE OBJECT I BASED ALL OTHERS OFF OF.
    var gizmo = function(x, y, vx, vy, launched, id, ang) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.launched = launched;
        this.id = id;
        this.ang = ang;

    };
    var score = 0;
    var aliensCaught = 0;
    var aliensLost = 0;
    var pulseHits = 0;
    // ORBIT VARIABLES CONTROL WHERE THE PLAYERS SHIP IS ON THE SCREEN
    var orbitX = 0;
    var orbitY = 0;
    var orbitAngle = 0;
    var orbitAngleTarget = 0;
    var orbitDistance = (wide * 0.45) * 0.9;
    var orbitDistanceTarget = orbitDistance;
    var orbitSpeed = 2;
    // THIS IS TRIGGERED WHEN THE PLAYER HITS A PULSEBOMB(emps[i])
    var orbitFreeze = false
    // THESE ARE USED FOR THE SHIPS POWER UP EFFECT WHEN COLLECTING A ROCKET(aliens[i])
    var Powerup = false
    var PowerRadius = 4
    var PowerFlux = 4
    var planetShake = 0;
    var alienID = 0;
    var empID = 0;
    var alienPopulation = 10;
    //THE TOTAL NUMBER OF ALIENS MADE
    var empNumber = 50;
    // HOW MANY EMPS TO HAVE "IN PLAY" AT ONCE IT SLOWLY GETS INCREASE TO ADD TO THE GAMES DIFFICULTY
    var hard = 5
    // THE TOTAL NUMBER OF stars MADE
    var starNumber = 200;
    // THE TOTAL NUMBER OF EMPS MADE
    var moving = 0;
    var game = 0;
    var OGgame = 0;

    var nrg = 90;
    var lazy = 0;
    var lazerNumber = 40;
    var lazerSpeed = 6;
    var canShoot = true;
    var planetHP = 90;
    //THESE ARE USED TO CALULATE HOW MANY SECONDS IT TOOK THE PLAYER TO BEAT THE GAME
    var sTime = Math.round(Date.now() / 1000);
    var eTime = sTime;
    var timeCheck = 0;
    var hScore = 0;
    var firstTouch = 0;
    //THESE ARE USED TO MAKE THE PRESS TO START AND TITLE SCREEN SOUND MUTE WORK
    var advance = 0
    var mutePause = 0
    //STARS COORDS GENERATION
    stars = [];
    for (var i = 0; i < starNumber; i++) {
        t = new gizmo();
        rAngle = Math.random() * 360
        tDis = 32 + Math.random() * (wide - 32)
        t.x = (cW) + (tDis * Math.cos(rAngle * Math.PI / -180))
        t.y = (cH) + (tDis * Math.sin(rAngle * Math.PI / -180))
        t.id = Math.random();
        t.ang = Math.round(Math.random() * 12) + 12;
        //THIS IS USED FOR SCALE
        stars.push(t);
    }
    ;//PLANET CITY COORDS GENERATION
    cities = [];
    for (var i = 0; i < 40; i++) {
        t = new gizmo();
        rAngle = Math.random() * 360
        tDis = Math.random() * 32
        t.x = (cW - 4) + (tDis * Math.cos(rAngle * Math.PI / -180))
        t.y = (cH - 4) + (tDis * Math.sin(rAngle * Math.PI / -180))
        t.id = Math.random();
        t.ang = Math.round(Math.random() * 12) + 12;
        //THIS IS USED FOR SCALE
        cities.push(t);
    }
    ;//CREATES ALL THE ALIENS/ROCKETS AND SETS THIER STARTING VARIABLES
    aliens = [];
    for (var i = 0; i < alienPopulation; i++) {
        et = new gizmo();
        et.id = i;
        et.x = cW;
        et.y = cH;
        et.vx = Math.random() * 40 - 20;
        et.vy = Math.random() * 40 - 20;
        et.ang = Math.atan2((et.y + et.vy) - et.y, (et.x + et.vx) - et.x) * (-180 / Math.PI)
        et.launched = false
        aliens.push(et);
    }
    ;//THIS SETS UP ALL THE PULSEBOMBS(emps) AND ALL THIER STARTING VALUES
    emps = [];
    for (var i = 0; i < empNumber; i++) {
        et = new gizmo();
        et.id = i;
        et.x = cW;
        et.y = cH;
        et.vx = Math.random() * 40 - 20;
        et.vy = Math.random() * 40 - 20;
        et.ang = Math.atan2((et.y + et.vy) - et.y, (et.x + et.vx) - et.x) * (-180 / Math.PI)
        et.launched = false
        emps.push(et);
    }
    ;//THIS CREATES THE PLAYERS SHIP AND SETS IT STARING LOCATION
    ship = [];
    temp = new gizmo();
    temp.x = cW + (orbitDistance * Math.cos(orbitAngle * Math.PI / -180))
    temp.y = cH + (orbitDistance * Math.sin(orbitAngle * Math.PI / -180))
    ship.push(temp);
    // THIS SETS UP THE PLANETS COORDS FOR LATER HIT TESTING
    planetCore = [];
    temp = new gizmo();
    temp.x = cW;
    temp.y = cH;
    planetCore.push(temp);

    //THIS SETS ALL THE SHIPS LASERS FOR LATER
    lazers = [];
    for (var i = 0; i < lazerNumber; i++) {
        et = new gizmo();
        et.id = i;
        et.x = cW;
        et.y = cH;
        et.vx = 0;
        et.vy = 0;
        et.ang = 0;
        et.launched = false
        lazers.push(et);
    }
    ;// THIS DISABLES PINCH ZOOM ON MOBILE IT MAY NOT BE NEEDED SINCE I ADDED THE 
    // TRANSPARENT BUTTONS THAT OVERLAY THE CANVAS........
    document.addEventListener('gesturestart', function(e) {
        e.preventDefault();
    });
    // THIS SHAKES THE SCREEN WHEN THE PLAYER HITS A PULSEBOMB
    var zzzzt = function() {

        if (orbitFreeze == true) {
            canvas.style.left = Math.round(((Math.random() * 6)) - 3) + 'px';
            canvas.style.top = Math.round(((Math.random() * 6)) - 3) + 'px';
        } else {
            canvas.style.left = '0%';
            canvas.style.top = '0%';
        }

    }
    // THIS LAUNCES AN ALIEN OFF THE PLANET
    var blastoff = function() {
        aliens[alienID].launched = true;
        alienID++;
        if (alienID == alienPopulation) {
            alienID = 0
        }
        ;
    };

    // THIS LAUNCHES AN EMP/PULSEBOMB OFF THE PLANET
    var bombsaway = function() {
        emps[empID].launched = true;
        empID++;
        if (empID > hard) {
            empID = 0
        }
        ;
    };
    var quake = function(big) { // SHAKES THE SCREEN
        if (planetShake > 0) {
            planetCore[0].x = cW + (Math.random() * 2) - 1;
            planetCore[0].y = cH + (Math.random() * 2) - 1;
            planetShake--;
        } else {

            planetCore[0].x = cW;
            planetCore[0].y = cH;
        }
    }

    // THE GAMES COLLISION FUNCTION
    var hit = function(obj1, obj2, dist) {
        if (obj1.x >= obj2.x - dist && obj1.x <= obj2.x + dist && obj1.y >= obj2.y - dist && obj1.y <= obj2.y + dist) {
            return true;
        }
    };
    // THIS IS A FUNCTION TO MAKE A VARIABLE CHANGE GRADUALY THAT I USE FOR THE SHIP ORBIT CONTROL
    var ease = function(input, target, percentage) {

        if (input < target) {
            var diff = target - input;
            var r = input + (diff * percentage);
        }
        if (input > target) {
            var diff = input - target;
            var r = input - (diff * percentage);
        }

        return r;

    }
    //THIS DRAWS A ROUNDED RECTANGLE 
    var rectRound = function(ox, oy, width, round, lWidth, fcol, scol) {
        ctx.fillStyle = fcol;
        ctx.strokeStyle = scol;
        ctx.lineWidth = lWidth;
        ctx.beginPath();
        ctx.moveTo(ox, oy);
        ctx.lineTo(ox + (width - round), oy);
        ctx.quadraticCurveTo(ox + width, oy, ox + width, oy + round);
        ctx.lineTo(ox + width, oy + width);
        ctx.quadraticCurveTo(ox + width, oy + (width + round), ox + (width - round), oy + (width + round));
        ctx.lineTo(ox, oy + (width + round));
        ctx.quadraticCurveTo(ox - round, oy + (width + round), ox - round, oy + width);
        ctx.lineTo(ox - round, oy + round);
        ctx.quadraticCurveTo(ox - round, oy, ox, oy);
        ctx.fill();
        ctx.stroke();

        ctx.lineWidth = 1;
    }
    var inRange = function(input, min, max) {
        if (input >= min && input <= max) {
            return true;
        }
    }
    //DRAWS ORBIT BUTTONS
    var buttons = function() {
        rectRound(wide * 0.08, tall * 0.8, 120, 20, 8, '#000000', '#00ff00');
        rectRound(wide * 0.7, tall * 0.8, 120, 20, 8, '#000000', '#00ff00');

        ctx.fillStyle = '#00ff00'
        ctx.font = " bold 70px Helvetica";
        ctx.fillText(" ->", wide * 0.08, tall * 0.8)
        ctx.fillText("<-", wide * 0.7, tall * 0.8)
        ctx.fillText("(", wide * 0.08, tall * 0.84)
        ctx.fillText("   )", wide * 0.7, tall * 0.84)

    }
    var shiphud = function() {
        //DRAWS PLANETS HEALTH
        ctx.fillStyle = '#000000'
        ctx.fillRect(0, 0, wide, tall * 0.1)
        ctx.fillStyle = '#526638'
        if(planetHP<20){if(Math.random()>0.8){ctx.fillStyle = '#aa0000';}}
        ctx.beginPath();
        ctx.arc(wide * 0.1, 35, 32, 0, 2 * Math.PI);
        ctx.fill();
        ctx.fillStyle = '#6F9B35';
        if(planetHP<20){if(Math.random()>0.8){ctx.fillStyle = '#ff0000';}}
        ctx.beginPath();
        ctx.arc(wide * 0.1, 35, 26, 0, 2 * Math.PI);
        ctx.fill();

        tcolor = '#000000'
        if (inRange(planetHP, 0, 10)) {
            tcolor = '#ff0000'
        }
        if (inRange(planetHP, 10, 20)) {
            tcolor = '#dd1100'
        }
        if (inRange(planetHP, 20, 30)) {
            tcolor = '#bb3300'
        }
        if (inRange(planetHP, 30, 40)) {
            tcolor = '#995500'
        }
        if (inRange(planetHP, 40, 50)) {
            tcolor = '#777700'
        }
        if (inRange(planetHP, 50, 60)) {
            tcolor = '#559900'
        }
        if (inRange(planetHP, 60, 70)) {
            tcolor = '#33bb00'
        }
        if (inRange(planetHP, 70, 80)) {
            tcolor = '#11dd00'
        }
        if (inRange(planetHP, 80, 90)) {
            tcolor = '#00ff00'
        }
        ctx.fillStyle = tcolor;
        ctx.font = " bold 50px Helvetica";
        ctx.textAlign = "left";
        var php = '';
        for (var i = 2; i < (Math.round(planetHP * 0.2)); i++) {
            php += ')'
        }
        ctx.fillText(php, wide * 0.2, 7, wide * 0.75);

        //DRAWS SHIP CONTROL ICONS/REMINDERS
        //DRAWS ROUNDED RECTANGLES AROUND ICONS
        buttons();
    }

    //THIS SHOOTS A LASER OBJECT FROM THE PLAYERS SHIP TOWARDS THE PLANET
    var lazershoot = function() {
        zzfx(...[.6, , 270+(Math.random()*100-50), .03, , .05, 3, 1.95, 2.4, .7, , , , , , , .11, .94, .04]);
        lazers[lazy].ang = orbitAngle;
        //set lazer xy
        lazers[lazy].x = ship[0].x - 10;
        lazers[lazy].y = ship[0].y - 10;
        // calculate vx and vy
        lazers[lazy].vx = -lazerSpeed * Math.cos(lazers[lazy].ang * Math.PI / -180);
        lazers[lazy].vy = -lazerSpeed * Math.sin(lazers[lazy].ang * Math.PI / -180);
        //set launced variable to true
        lazers[lazy].launched = true;
        lazy++;
        if (lazy >= lazerNumber) {
            lazy = 0
        }
    }
    // Update game objects
    var update = function(modifier) {
        //console.log(modifier)
        //LANDSCAPE ORIENTATION
        if (window.innerHeight < window.innerWidth) {
            if (game < 13) {
                game += 13

            }

        } else {
            if (game >= 13) {
                game -= 13
                if (firstO == 'Landscape') {
                    location.reload()
                }

            }

        }

        if (game == 2) {
            //console.log(planetHP)
            // THIS SHAKES THE PLANET WHEN HIT WITH THE quake() function
            // setting the planetShake variable to greater than zero causes the
            // the planet to shake for that many cycles
            quake();
            //THIS SHAKES THE SCREEN WHEN A PLAYER HITS A PULSEBOMB
            zzzzt();
            // THIS CHECKS THE PLANETS HP AND SETS THE GAMESTATE TO END
            // WHEN NEEDED
            if (planetHP <= 8) {
                game = 4
            }
            if (moving != 0) {
                orbitDistanceTarget -= 3 * modifier
            }
            ;nrg = orbitDistanceTarget / (wide * 0.45);
            if (nrg > 1) {
                orbitDistanceTarget -= 0.4;
                if (canShoot) {
                    lazershoot();
                    canShoot = false;
                    setTimeout(function() {
                        canShoot = true;
                    }, 1000);
                }
            }

            //MOVES  LAZERS
            for (var i = 0; i < lazerNumber; i++) {
                if (lazers[i].launched) {
                    lazers[i].x += lazers[i].vx;
                    lazers[i].y += lazers[i].vy;
                    if (hit(planetCore[0], lazers[i], 36)) {
                        zzfx(...[0.7, , 168+(Math.random()*100-50), , .25, .29, 4, 2.98, , .9, , , .01, .9, , .6, , .55, .1, .17]);
                        planetShake = 15;
                        if (hard < empNumber) {
                            hard += 0.5;
                            //console.log('hard : ' + hard)
                        }

                        lazers[i].launched = false;
                        lazers[i].x = 0;
                        lazers[i].vx = 0;
                        lazers[i].y = 0;
                        lazers[i].vy = 0;
                        planetHP -= 1;

                    }

                }
            }
            //MOVES  ALIENS/ROCKETS
            for (var i = 0; i < alienPopulation; i++) {
                if (aliens[i].launched) {
                    aliens[i].x += aliens[i].vx * modifier;
                    aliens[i].y += aliens[i].vy * modifier;
                }
            }

            //MOVES  EMPS/PULSEBOMBS
            for (var i = 0; i < hard; i++) {
                if (emps[i].launched) {
                    emps[i].x += emps[i].vx * modifier;
                    emps[i].y += emps[i].vy * modifier;
                }
            }
            //THIS MAKES THE SHIPS ORBIT DISTANCE CHANGE SMOOTHLY SINCE THE EASE FUNCTION CAUSED
            //AN ERROR WHEN I TRIED TO USE IT FOR THIS
            if (orbitDistance > orbitDistanceTarget + 1) {
                orbitDistance -= 0.15
            }
            ;if (orbitDistance < orbitDistanceTarget + 1) {
                orbitDistance += 0.15
            }

            // THIS CHECKS IF THE SHIP HAS CRASED INTO THE PLANET
            if (orbitDistance < 50) {
                zzfx(...[1.27, , 168+(Math.random()*100-50), , .25, .29, 4, 2.98, , .9, , , .01, .9, , .6, , .55, .1, .17]);
                // Explosion 162
                game = 3;
            }
            //TRIES TO KEEP SHIP ON SCREEN

            if (orbitDistance > (wide * 0.55)) {
                orbitDistanceTarget -= 0.1
            }
            //ROTATES SHIP AROUND PLANET ACCORDING TO orbitAngle
            ship[0].x = (cW) + (orbitDistance * Math.cos(orbitAngle * Math.PI / -180))
            ship[0].y = (cH) + (orbitDistance * Math.sin(orbitAngle * Math.PI / -180))
            if (touchX > 0 && orbitFreeze == false) {
                if (touchX < cW) {
                    orbitAngleTarget -= orbitSpeed;
                    moving = +1;

                } else {
                    orbitAngleTarget += orbitSpeed;
                    moving = -1;
                }
            } else {
                moving = 0;
            }
            orbitAngle = ease(orbitAngle, orbitAngleTarget, modifier)

            // ALIEN/ROCKET HITTEST//OFFSCREEN
            for (var i = 0; i < alienPopulation; i++) {
                if (hit(aliens[i], ship[0], 14) && orbitFreeze == false) {
                    ++aliensCaught;
                    zzfx(...[1.02, , 796+(Math.random()*100-50), .14, .01, .02, , 1.6, -7, -93.8, -250, .1, , , -0.2, , .19, , .03, .53]);
                    // PowerUp    //set angle of lazer path
                    // INCREASED THE SHIPS ORBITDISTANCE AND CONTROLS THE POWERUP VISUAL
                    Powerup = true;
                    PowerFlux = 4;
                    orbitDistanceTarget += 20;
                    setTimeout(function() {
                        Powerup = false;
                        PowerRadius = 4
                    }, 200);
                    setTimeout(function() {
                        PowerFlux = -4;
                    }, 100);
                    // aliens[i].launched = false;
                    aliens[i].x = cW;
                    aliens[i].y = cH;
                    aliens[i].vx = Math.random() * 40 - 20;
                    aliens[i].vy = Math.random() * 40 - 20;
                    aliens[i].ang = Math.atan2((aliens[i].y + aliens[i].vy) - aliens[i].y, (aliens[i].x + aliens[i].vx) - aliens[i].x) * (-180 / Math.PI)

                }
                // ALIENS/ROCKETS OFFSCREEN
                if (aliens[i].x > wide || aliens[i].y > tall || aliens[i].x < 0 || aliens[i].y < 0) {
                    ++aliensLost;
                    // aliens[i].launched = false;
                    aliens[i].x = cW;
                    aliens[i].y = cH;
                    aliens[i].vx = Math.random() * 40 - 20;
                    aliens[i].vy = Math.random() * 40 - 20;
                    aliens[i].ang = Math.atan2((aliens[i].y + aliens[i].vy) - aliens[i].y, (aliens[i].x + aliens[i].vx) - aliens[i].x) * (-180 / Math.PI)

                }
            }

            // EMPS HITTEST//OFFSCREEN
            for (var i = 0; i < empNumber; i++) {
                if (hit(emps[i], ship[0], 14)) {
                    orbitFreeze = true;
                    pulseHits++;
                    zzfx(...[.3, 1, 1, , .8, .03, 4, .01, , , 2, .13, .16, , 57, .1, , .9, 1]);
                    // Buzzed
                    // THIS BRINGS THE SHIP CLOSER TO THE PLANET
                    orbitDistanceTarget -= 20;
                    // THIS FREEZES THE SHIP AND CONTROLS THE FREEZE VISUAL EFFECT
                    setTimeout(function() {
                        orbitFreeze = false;
                    }, 2000);
                    // emps[i].launched = false;
                    emps[i].x = cW;
                    emps[i].y = cH;
                    emps[i].vx = Math.random() * 40 - 20;
                    emps[i].vy = Math.random() * 40 - 20;
                    emps[i].ang = Math.atan2((emps[i].y + emps[i].vy) - emps[i].y, (emps[i].x + emps[i].vx) - emps[i].x) * (-180 / Math.PI)
                }
                // EMPS/PULSEBOMBS OFF SCREEN
                if (emps[i].x > wide || emps[i].y > tall || emps[i].x < 0 || emps[i].y < 0) {
                    //emps[i].launched = false;
                    emps[i].x = cW;
                    emps[i].y = cH;
                    emps[i].vx = Math.random() * 40 - 20;
                    emps[i].vy = Math.random() * 40 - 20;
                    emps[i].ang = Math.atan2((emps[i].y + emps[i].vy) - emps[i].y, (emps[i].x + emps[i].vx) - emps[i].x) * (-180 / Math.PI)

                }
            }

        }
        // THIS IS A BUNCH OF START/PROLOGUE/INSTRUCTION/GAME SCREEN PROGRESSIONS
        if (game == 1) {
            if (touchX > 0) {

                if (advance == 1) {
                    game = 2;
                    advance = 0
                }

                touchX = -1;
                orbitAngleTarget = 0;

            }
        }
        if (game == 0.5) {
            if (touchX > 0 && touchY > tall * 0.9) {

                if (advance == 1) {
                    game = 1;
                    advance = 0
                }

                touchX = -1
            }
        }
        if (game == 0) {
            // SUPER SECRET UPPER LEFT TITLE SCREEN TOUCH CODE
            if (touchX > 0 && touchX < 50 && touchY < 50) {
                alert("BAD TOUCH!! Highscore reset");
                localStorage.removeItem("SpaceMenace0374.hiscore");
                touchX = -1;
            }
            if (touchX > 0 && touchY > tall * 0.9) {
                game = 0.5;
                touchX = -1
            }
            // THIS CONTROLS THE TITLE SCREEN SOUND MUTE OPTIONS
            if (mutePause == 0 && touchX > (wide * 0.8) && touchX < (wide * 0.9) && touchY > (tall * 0.8) && touchY < (tall * 0.9)) {
                if (zzfxV == .2) {
                    zzfxV = 0;

                } else {
                    zzfxV = .2;

                }
                mutePause = 1;
                setTimeout(function() {
                    mutePause = 0;
                }, 500);
            }
        }
        // PLAYER LOSE STATE
        if (game == 3) {
            if (touchX > 0 && touchY < 140) {
                sTime = Math.round(Date.now() / 1000);
                eTime = sTime;
                timeCheck = 0;
                score = 0;
                game = 2;
                hard = 5;
                empID = 0;
                alienID = 0;
                nrg = 90;
                aliensCaught = 0;
                pulseHits = 0;
                orbitDistance = (wide * 0.45) * 0.9
                orbitDistanceTarget = orbitDistance;
                aliensLost = 0;
                planetHP = 90;
                for (var i = 0; i < empNumber; i++) {
                    emps[i].x = cW;
                    emps[i].y = cH;
                    emps[i].vx = Math.random() * 40 - 20;
                    emps[i].vy = Math.random() * 40 - 20;

                }
                ;for (var i = 0; i < alienPopulation; i++) {
                    aliens[i].x = cW;
                    aliens[i].y = cH;
                    aliens[i].vx = Math.random() * 40 - 20;
                    aliens[i].vy = Math.random() * 40 - 20;
                    aliens[i].ang = Math.atan2((aliens[i].y + aliens[i].vy) - aliens[i].y, (aliens[i].x + aliens[i].vx) - aliens[i].x) * (-180 / Math.PI)

                }
                ;;touchX = -1;
            }
        }
        //PLAYER WIN STATE
        if (game == 4) {
            if (timeCheck == 0) {
                eTime = Math.round(Date.now() / 1000) - sTime;
                timeCheck = 1;

                if (localStorage.getItem("SpaceMenace0374.hiscore") == null) {
                    alert("First Victory, Play again!!");
                    localStorage.setItem("SpaceMenace0374.hiscore", eTime)
                    hScore = parseInt(eTime, 10);
                } else {
                    temp = localStorage.getItem("SpaceMenace0374.hiscore");
                    if (parseInt(temp, 10) > eTime) {
                        localStorage.setItem("SpaceMenace0374.hiscore", eTime);
                        hScore = eTime;
                    } else {
                        hScore = temp
                    }
                }
            }
            // RESTARTS THE GAME
            if (touchX > 0 && touchY < 250) {
                sTime = Math.round(Date.now() / 1000);
                eTime = sTime;
                timeCheck = 0;
                score = 0;
                game = 2;
                hard = 5;
                empID = 0;
                alienID = 0;
                nrg = 90;
                aliensCaught = 0;
                pulseHits = 0;
                orbitDistance = (wide * 0.45) * 0.9
                orbitDistanceTarget = orbitDistance;
                aliensLost = 0;
                planetHP = 90;
                for (var i = 0; i < empNumber; i++) {
                    emps[i].x = cW;
                    emps[i].y = cH;
                    emps[i].vx = Math.random() * 40 - 20;
                    emps[i].vy = Math.random() * 40 - 20;
                }
                ;for (var i = 0; i < alienPopulation; i++) {
                    aliens[i].x = cW;
                    aliens[i].y = cH;
                    aliens[i].vx = Math.random() * 40 - 20;
                    aliens[i].vy = Math.random() * 40 - 20;
                    aliens[i].ang = Math.atan2((aliens[i].y + aliens[i].vy) - aliens[i].y, (aliens[i].x + aliens[i].vx) - aliens[i].x) * (-180 / Math.PI)
                }
                ;;touchX = -1;
            }
        }
    };
    // Draw everything
    var render = function(modifier) {

        //DRAW BACKGROUND
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        if (game == 2 || game == 0) {
            //DRAW STARS

            for (var i = 0; i < starNumber; i++) {
                ctx.font = stars[i].ang + "px Helvetica";
                ctx.fillStyle = '#FFFFFF'
                ctx.globalAlpha = stars[i].id
                if (i <= starNumber / 2) {
                    ctx.fillText("*", stars[i].x, stars[i].y)
                } else {
                    ctx.fillText(".", stars[i].x, stars[i].y);
                }
            }
            ctx.globalAlpha = 1;
        }
        if (game == 2) {
            for (var i = 0; i < alienPopulation; i++) {
                //DRAW ALIEN/ROCKETS
                if (aReady) {
                    ctx.save();
                    ctx.beginPath();
                    ctx.translate(aliens[i].x, aliens[i].y)
                    ctx.rotate(aliens[i].ang * Math.PI / -180);
                    ctx.scale(2, 2);
                    ctx.drawImage(aImage, -4, -4);
                    ctx.restore();
                    //DRAW EXHAUST
                    var burn = 255;
                    for (var xi = 0; xi < 25; xi++) {
                        ctx.fillStyle = "rgb(0, " + burn + ", 0)";
                        burn -= 10;
                        tx = aliens[i].x + (-aliens[i].vx * xi * .1) - 5;
                        ty = aliens[i].y + (-aliens[i].vy * xi * .1) - 5;
                        ctx.fillText("*", tx + ((Math.random() * 8) - 4), ty + ((Math.random() * 8) - 4));
                    }
                }
                ctx.fillStyle = '#00ff00';
                ctx.fillRect(aliens[i].x - 2.5, aliens[i].y - 2.5, 5, 5);

            }
            //DRAW SHIP
            var jstr = 1
            if (sReady) {

                for (var i = 0; i < 12; i++) {

                    tdis = Math.random() * 50;
                    tdis += 8;
                    ctx.fillStyle = "rgb(0, " + (255 - (tdis * 5.1)) + ", 0)";
                    if (moving < 0) {
                        jstr = orbitAngle - 90
                    }
                    if (moving > 0) {
                        jstr = orbitAngle + 90
                    }
                    tempx = ship[0].x + (tdis * Math.cos((jstr) * Math.PI / -180))
                    tempy = ship[0].y + (tdis * Math.sin((jstr) * Math.PI / -180))
                    tx = tempx + (Math.random() * 20) - 10;
                    ty = tempy + (Math.random() * 20) - 10
                    if (moving != 0 && orbitFreeze == false) {
                        ctx.fillText("*", tx, ty);
                    }
                }
                ctx.globalAlpha = 1;
                ctx.save();
                ctx.beginPath();
                ctx.translate(ship[0].x, ship[0].y)
                ctx.rotate(orbitAngle * Math.PI / -180);
                ctx.scale(2, 2);
                ctx.drawImage(sImage, -8, -8);
                ctx.restore();

                if (orbitFreeze == true) {
                    ctx.globalAlpha = 0.9;
                    ctx.strokeStyle = "#ffffff";
                    ctx.lineWidth = 2;
                    ctx.beginPath()
                    ctx.moveTo(ship[0].x, ship[0].y);
                    for (var i = 0; i < 10; i++) {
                        ctx.lineTo(ship[0].x + ((Math.random() * 24) - 12), ship[0].y + ((Math.random() * 24) - 16));
                    }
                }
                //Powerup=true
                if (Powerup == true) {
                    if (PowerRadius >= 4) {
                        PowerRadius += PowerFlux;
                    }
                    ctx.globalAlpha = 0.5;
                    ctx.strokeStyle = "#00ff00";
                    ctx.fillStyle = "#00ff00";
                    ctx.beginPath();
                    ctx.arc(ship[0].x, ship[0].y, PowerRadius, 0, 2 * Math.PI);
                    ctx.fill();
                } else {
                    PowerRadius = 4
                }

                ctx.stroke();
                ctx.restore()
                ctx.globalAlpha = 1;

            }

            for (var i = 0; i < empNumber; i++) {
                //DRAW EMPS/PULSEBOMB EFFECTS
                if (sReady) {
                    ctx.save();
                    ctx.beginPath();
                    ctx.translate(emps[i].x, emps[i].y)
                    emps[i].ang++;
                    ctx.rotate(emps[i].ang * Math.PI / -180);
                    ctx.scale(2, 2);
                    ctx.drawImage(eImage, -5, -5);
                    ctx.rotate((Math.random() * 360) * Math.PI / -180);
                    ctx.fillStyle = '#aaaaaa';
                    ctx.font = "20px Helvetica";
                    for (var empi = 0; empi < 5; empi++) {
                        if (Math.random() > 0.9) {
                            ctx.fillText("*", -5, -5);
                        }
                    }
                    ctx.restore();
                }

            }

            //DRAW PLANET
            ctx.fillStyle = '#526638'
            ctx.beginPath();
            ctx.arc(planetCore[0].x, planetCore[0].y, 40, 0, 2 * Math.PI);
            ctx.fill();
            ctx.fillStyle = '#6F9B35';
            //525D45
            ctx.beginPath();
            ctx.arc(planetCore[0].x, (planetCore[0].y) - 1, 36, 0, 2 * Math.PI);
            ctx.fill();
            for (var i = 0; i < 40; i++) {
                ctx.fillStyle = '#525D45'
                ctx.font = cities[i].ang + "px Helvetica";
                ctx.globalAlpha = cities[i].id
                if (i <= 20) {
                    if (planetShake == 0) {
                        ctx.fillText("*", cities[i].x, cities[i].y)
                    } else {
                        ctx.fillText("*", cities[i].x + ((Math.random() * 2) - 1), cities[i].y + ((Math.random() * 4) - 2))
                    }
                } else {
                    if (planetShake == 0) {
                        ctx.fillText("~", cities[i].x, cities[i].y)
                    } else {
                        ctx.fillText("~", cities[i].x + ((Math.random() * 2) - 1), cities[i].y + ((Math.random() * 4) - 2))
                    }
                }
            }
            ctx.globalAlpha = 1;

            //DRAW  LAZERS
            ctx.fillStyle = '#00FF00'
            for (var i = 0; i < lazerNumber; i++) {
                if (lazers[i].launched) {
                    ctx.fillText("*", lazers[i].x, lazers[i].y)

                }
            }

            //DRAW ONSCREEN CONTROLS
            shiphud();

        }
        // TITLE SCREEN
        if (game == 0) {
            ctx.fillStyle = '#00ff00'
            ctx.font = "100px Helvetica";
            ctx.textAlign = "center";
            ctx.textBaseline = "top";
            ctx.fillText("SPACE MENACE", wide / 2, tall * 0.01, wide * 0.9);
            ctx.textAlign = "right";
            ctx.font = "30px Helvetica";
            ctx.fillText("sound effects", wide * 0.78, tall * 0.82);
            ctx.textAlign = "center";

            //SPEAKER ICON
            ctx.beginPath();
            ctx.arc(wide * 0.85, tall * 0.85 - 1, 16, 0, 2 * Math.PI);
            ctx.fill();
            ctx.fillStyle = '#888888'
            ctx.beginPath();
            ctx.arc(wide * 0.85, tall * 0.85 - 1, 12, 0, 2 * Math.PI);
            ctx.fill();
            ctx.fillStyle = '#222222'
            ctx.beginPath();
            ctx.arc(wide * 0.85, tall * 0.85 - 1, 5, 0, 2 * Math.PI);
            ctx.fill();
            if (zzfxV == 0) {
                // MUTE ICON
                ctx.lineWidth = 4;
                ctx.strokeStyle = '#FF0000'
                ctx.beginPath();
                ctx.arc(wide * 0.85, tall * 0.85 - 1, 22, 0, 2 * Math.PI);
                ctx.stroke();
                ctx.lineWidth = 8;
                ctx.beginPath();
                ctx.moveTo(wide * 0.82, tall * 0.82);
                ctx.lineTo(wide * 0.87, tall * 0.87);
                ctx.stroke();
            }

            ctx.lineWidth = 1;
            //DRAW PLANET
            ctx.fillStyle = '#526638'
            ctx.beginPath();
            ctx.arc(planetCore[0].x, planetCore[0].y, 40, 0, 2 * Math.PI);
            ctx.fill();
            ctx.fillStyle = '#6F9B35';
            //525D45
            ctx.beginPath();
            ctx.arc(planetCore[0].x, (planetCore[0].y) - 1, 36, 0, 2 * Math.PI);
            ctx.fill();

            ctx.font = "16px Helvetica";
            for (var i = 0; i < 40; i++) {
                ctx.fillStyle = '#525D45'
                ctx.globalAlpha = cities[i].id
                if (i <= 20) {
                    ctx.fillText("*", cities[i].x, cities[i].y)
                } else {
                    ctx.fillText("~", cities[i].x, cities[i].y);
                }
            }

            ctx.globalAlpha = 1;
            ctx.save();
            ctx.beginPath();
            ctx.translate(ship[0].x, ship[0].y)
            orbitAngle += 1;
            if (orbitAngle == 360) {
                orbitAngle = 0;
            }
            //ROTATES SHIP AROUND PLANET ACCORDING TO orbitAngle
            ship[0].x = (cW) + (orbitDistance * Math.cos(orbitAngle * Math.PI / -180))
            ship[0].y = (cH) + (orbitDistance * Math.sin(orbitAngle * Math.PI / -180))
            ctx.rotate(orbitAngle * Math.PI / -180);
            ctx.scale(2, 2);
            ctx.drawImage(sImage, -8, -8);
            ctx.restore();
            ctx.globalAlpha = 1;
            ctx.fillStyle = '#00ff00'
            ctx.strokeStyle = '#00ff00'
            ctx.font = "30px Helvetica"
            ctx.fillText("Touch here to continue", wide / 2, tall - 35, wide * 0.9);
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.rect(0, tall - 35, wide, 32);
            ctx.stroke();
            ctx.lineWidth = 1;
        }
        //PROLOGUE SCREEN
        if (game == 0.5) {
            ctx.fillStyle = '#00ff00'
            ctx.font = " bold 44px Helvetica";
            ctx.textAlign = "center";
            ctx.fillText("PROLOGUE", wide / 2, 10, wide * 0.9);
            ctx.font = "24px Helvetica";
            ctx.fillText("13000 A.D.", wide / 2, 70, wide * 0.9);
            ctx.fillText("", wide / 2, 95, wide * 0.9);
            ctx.fillText("You fight your way", wide / 2, 120, wide * 0.9);
            ctx.fillText("to the homeworld of", wide / 2, 145, wide * 0.9);
            ctx.fillText("the aliens trying", wide / 2, 170, wide * 0.9);
            ctx.fillText("destroy Earth", wide / 2, 195, wide * 0.9);
            ctx.fillText("", wide / 2, 220, wide * 0.9);
            ctx.fillText("Your ship limps into", wide / 2, 245, wide * 0.9);
            ctx.fillText("orbit around the planet", wide / 2, 270, wide * 0.9);
            ctx.fillText("with only enough power", wide / 2, 295, wide * 0.9);
            ctx.fillText("left to manuver.", wide / 2, 320, wide * 0.9);
            ctx.fillText("Maybe you can harvest.", wide / 2, 355, wide * 0.9);
            ctx.fillText("energy from one of the", wide / 2, 380, wide * 0.9);
            ctx.fillText("alien rockets heading.", wide / 2, 405, wide * 0.9);
            ctx.fillText("towards Earth to destroy it.", wide / 2, 430, wide * 0.9);
            ctx.fillText("But they know your here.", wide / 2, 465, wide * 0.9);
            ctx.fillText("As soon as you entered", wide / 2, 490, wide * 0.9);
            ctx.fillText("thier solar system the", wide / 2, 515, wide * 0.9);
            ctx.fillText("pulse bombs started coming.", wide / 2, 540, wide * 0.9);
            ctx.font = "30px Helvetica";
            ctx.fillText("Touch here to continue", wide / 2, tall - 35, wide * 0.9);
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.rect(0, tall - 35, wide, 32);
            ctx.stroke();
            ctx.lineWidth = 1;
        }
        // INSTRUCTIONS SCREEN
        if (game == 1) {
            ctx.fillStyle = '#00ff00'
            ctx.font = " bold 44px Helvetica";

            ctx.fillText("INSTRUCTIONS", wide / 2, 4, wide * 0.9);
            ctx.save();
            ctx.font = "24px Helvetica";
            ctx.textAlign = "center";
            ctx.fillText("Collect Alien Rockets", wide / 2, 60, wide * 0.9);
            ctx.save();
            ctx.translate(wide / 2 - 16, 90);
            ctx.scale(4, 4);
            ctx.drawImage(aImage, 0, 0);
            ctx.restore();
            ctx.fillText("to power up your", wide / 2, 124, wide * 0.9);
            ctx.fillText("ships main gun and", wide / 2, 149, wide * 0.9);
            ctx.fillText("blast the alien planet", wide / 2, 174, wide * 0.9);
            ctx.fillText("saving earth from the", wide / 2, 199, wide * 0.9);
            ctx.fillText("space menace", wide / 2, 224, wide * 0.9);

            ctx.fillText("Avoid Pulse Bombs", wide / 2, 270, wide * 0.9);
            ctx.save();
            ctx.translate(wide / 2 - 16, 299);
            ctx.scale(4, 4);
            ctx.drawImage(eImage, 0, 0);
            ctx.restore();
            ctx.fillText("that drain your ships", wide / 2, 334, wide * 0.9);
            ctx.fillText("energy causing your", wide / 2, 359, wide * 0.9);
            ctx.fillText("ship to lose altitude", wide / 2, 384, wide * 0.9);
            ctx.fillText(" and crash.", wide / 2, 409, wide * 0.9);
            ctx.fillText("touch the buttons on the", wide / 2, 449, wide * 0.9);
            ctx.fillText("bottom of the screen to", wide / 2, 474, wide * 0.9);
            ctx.fillText("move your ship.", wide / 2, 499, wide * 0.9);
            ctx.save();
            ctx.translate(wide / 2 - 24, 524);
            ctx.scale(4, 4);
            ctx.drawImage(sImage, 0, 2);
            ctx.restore();

            ctx.font = "30px Helvetica";
            ctx.fillText("Touch here to start", wide / 2, tall - 35, wide * 0.9);
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.rect(0, tall - 35, wide, 32);
            ctx.stroke();
            ctx.lineWidth = 1;
        }
        // PLAYER LOSES SCREEN
        if (game == 3) {
            ctx.fillStyle = '#00ff00'
            ctx.strokeStyle = '#00ff00'
            ctx.font = "100px Helvetica";
            ctx.textAlign = "center";
            ctx.textBaseline = "top";
            ctx.fillText("GAME OVER", wide / 2, 10, wide * 0.9);
            ctx.font = "30px Helvetica";
            ctx.fillText("Touch HERE", wide / 2, 110, wide * 0.9);
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.rect(0, 110, wide, 32);
            ctx.stroke();
            ctx.lineWidth = 1;
            ctx.fillText("to", wide / 2, 140, wide * 0.9);
            ctx.fillText("restart", wide / 2, 170, wide * 0.9);
        }
        //PLAYER WINS SCREEN
        if (game == 4) {
            ctx.fillStyle = '#00ff00'
            ctx.font = "100px Helvetica";
            ctx.textAlign = "center";
            ctx.textBaseline = "top";
            ctx.fillText("VICTORY", wide / 2, 10, wide * 0.9);
            ctx.textAlign = "left";
            ctx.font = "30px Helvetica";
            ctx.fillText("You have saved the ", wide * 0.1, 110, wide * 0.9);
            ctx.fillText("Earth from the space", wide * 0.1, 140, wide * 0.9);
            ctx.fillText("menace", wide * 0.1, 170, wide * 0.9);
            ctx.fillText("Touch here to restart", wide * 0.1, 200, wide * 0.9);
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.rect(0, 200, wide, 32);
            ctx.stroke();
            ctx.lineWidth = 1;
            ctx.fillText("Rockets captured : " + aliensCaught, wide * 0.1, 330, wide * 0.9);
            ctx.fillText("Rockets escaped : " + aliensLost, wide * 0.1, 360, wide * 0.9);
            ctx.fillText("Time taken : " + eTime + " seconds", wide * 0.1, 390, wide * 0.9);
            ctx.fillText("Bombs hit : " + pulseHits, wide * 0.1, 420, wide * 0.9);

            ctx.fillText("Record time : " + hScore, wide * 0.1, 450, wide * 0.9);
        }
        if (game >= 13) {
            ctx.globalAlpha = 1;

            ctx.font = "24px Helvetica";
            ctx.fillStyle = '#00ff00'
            ctx.textAlign = "left";
            ctx.textBaseline = "top";
            if (firstO == 'Landscape') {
                ctx.fillText("SORRY, IN THE YEAR 13000 A.D. THERE", wide * 0.01, tall * 0.1, wide * .9);
                ctx.fillText("IS NO LANDSCAPE MODE.  ALL THE", wide * 0.01, tall * 0.18, wide * .9);
                ctx.fillText("TECHNOLOGY THAT ALLOWS LANDSCAPE", wide * 0.01, tall * 0.26, wide * .9);
                ctx.fillText("MODE WAS REPURPOSED MAKING WEAPONS", wide * 0.01, tall * .34, wide * .9);
                ctx.fillText("TO FIGHT THE SPACE MENACE.", wide * 0.01, tall * .42, wide * .9);
                ctx.fillText("SO TURN YOUR PHONE BACK TO ", wide * 0.01, tall * .50, wide * .9);
                ctx.fillText("PORTRAIT AND DESTROY THE ALIEN", wide * 0.01, tall * .58, wide * .9);
                ctx.fillText("PLANET AND SAVE US ALL.", wide * 0.01, tall * .66, wide * .9);
            } else {
                ctx.fillText("SORRY, IN THE YEAR 13000 A.D. THERE", wide * 0.1, tall * 0.01, wide * .9);
                ctx.fillText("IS NO LANDSCAPE MODE.  ALL THE", wide * 0.1, tall * 0.06, wide * .9);
                ctx.fillText("TECHNOLOGY THAT ALLOWS LANDSCAPE", wide * 0.1, tall * 0.11, wide * .9);
                ctx.fillText("MODE WAS REPURPOSED MAKING WEAPONS", wide * 0.1, tall * .17, wide * .9);
                ctx.fillText("TO FIGHT THE SPACE MENACE.", wide * 0.1, tall * .23, wide * .9);
                ctx.fillText("SO TURN YOUR PHONE BACK TO ", wide * 0.1, tall * .28, wide * .9);
                ctx.fillText("PORTRAIT AND DESTROY THE ALIEN", wide * 0.1, tall * .33, wide * .9);
                ctx.fillText("PLANET AND SAVE US ALL.", wide * 0.1, tall * .38, wide * .9);
            }
        }

    };
    // THIS TICK OFF TO CAUSE ROCKETS AND PULSE BOMBS TO BE LAUNCHED
    setInterval(blastoff, 1000)
    setInterval(bombsaway, 1500)
    //
    // The main game loop
    var main = function() {
        var now = Date.now();
        var delta = now - then;
        update(delta / 1000);
        skip++;
        if (skip == 40) {
            fps = 1000 / delta;
            skip = 0
        }
        render(delta / 1000);
        then = now;
        // Request to do this again ASAP
        requestAnimationFrame(main);
    };
    // Cross-browser support for requestAnimationFrame
    var w = window;
    requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;
    // Let's play this game!
    var then = Date.now();
    var fps = 0;
    var skip = 0;
    main();
}
