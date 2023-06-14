/*
    LittleJS - Release Build
    MIT License - Copyright 2021 Frank Force

    - This file is used for release builds in place of engineDebug.js
    - Debug functionality will be disabled to lower size and increase performance
*/

'use strict';

let showWatermark = 0;

/**
 * LittleJS Utility Classes and Functions
 * <br> - General purpose math library
 * <br> - Vector2 - fast, simple, easy 2D vector class
 * <br> - Color - holds a rgba color with some math functions
 * <br> - Timer - tracks time automatically
 * @namespace Utilities
 */


/** A shortcut to get Math.PI
 *  @const
 *  @memberof Utilities */
const PI = Math.PI;

/** Returns absoulte value of value passed in
 *  @param {Number} value
 *  @return {Number}
 *  @memberof Utilities */
const abs = (a)=> a < 0 ? -a : a;

/** Returns lowest of two values passed in
 *  @param {Number} valueA
 *  @param {Number} valueB
 *  @return {Number}
 *  @memberof Utilities */
const min = (a, b)=> a < b ?  a : b;

/** Returns highest of two values passed in
 *  @param {Number} valueA
 *  @param {Number} valueB
 *  @return {Number}
 *  @memberof Utilities */
const max = (a, b)=> a > b ?  a : b;

/** Returns the sign of value passed in (also returns 1 if 0)
 *  @param {Number} value
 *  @return {Number}
 *  @memberof Utilities */
const sign = (a)=> a < 0 ? -1 : 1;

/** Returns first parm modulo the second param, but adjusted so negative numbers work as expected
 *  @param {Number} dividend
 *  @param {Number} [divisor=1]
 *  @return {Number}
 *  @memberof Utilities */
const mod = (a, b=1)=> ((a % b) + b) % b;

/** Clamps the value beween max and min
 *  @param {Number} value
 *  @param {Number} [min=0]
 *  @param {Number} [max=1]
 *  @return {Number}
 *  @memberof Utilities */
const clamp = (v, min=0, max=1)=> v < min ? min : v > max ? max : v;

/** Returns what percentage the value is between max and min
 *  @param {Number} value
 *  @param {Number} [min=0]
 *  @param {Number} [max=1]
 *  @return {Number}
 *  @memberof Utilities */
const percent = (v, min=0, max=1)=> max-min ? clamp((v-min) / (max-min)) : 0;

/** Linearly interpolates the percent value between max and min
 *  @param {Number} percent
 *  @param {Number} [min=0]
 *  @param {Number} [max=1]
 *  @return {Number}
 *  @memberof Utilities */
const lerp = (p, min=0, max=1)=> min + clamp(p) * (max-min);

/** Applies smoothstep function to the percentage value
 *  @param {Number} value
 *  @return {Number}
 *  @memberof Utilities */
const smoothStep = (p)=> p * p * (3 - 2 * p);

/** Returns the nearest power of two not less then the value
 *  @param {Number} value
 *  @return {Number}
 *  @memberof Utilities */
const nearestPowerOfTwo = (v)=> 2**Math.ceil(Math.log2(v));

/** Returns true if two axis aligned bounding boxes are overlapping
 *  @param {Vector2} pointA  - Center of box A
 *  @param {Vector2} sizeA   - Size of box A
 *  @param {Vector2} pointB  - Center of box B
 *  @param {Vector2} [sizeB] - Size of box B
 *  @return {Boolean}        - True if overlapping
 *  @memberof Utilities */
const isOverlapping = (pA, sA, pB, sB)=> abs(pA.x - pB.x)*2 < sA.x + sB.x & abs(pA.y - pB.y)*2 < sA.y + sB.y;

/** Returns an oscillating wave between 0 and amplitude with frequency of 1 Hz by default
 *  @param {Number} [frequency=1] - Frequency of the wave in Hz
 *  @param {Number} [amplitude=1] - Amplitude (max height) of the wave
 *  @param {Number} [t=time]      - Value to use for time of the wave
 *  @return {Number}              - Value waving between 0 and amplitude
 *  @memberof Utilities */
const wave = (frequency=1, amplitude=1, t=time)=> amplitude/2 * (1 - Math.cos(t*frequency*2*PI));

/** Formats seconds to mm:ss style for display purposes
 *  @param {Number} t - time in seconds
 *  @return {String}
 *  @memberof Utilities */
const formatTime = (t)=> (t/60|0)+':'+(t%60<10?'0':'')+(t%60|0);

///////////////////////////////////////////////////////////////////////////////

/** Random global functions
 *  @namespace Random */

/** Returns a random value between the two values passed in
 *  @param {Number} [valueA=1]
 *  @param {Number} [valueB=0]
 *  @return {Number}
 *  @memberof Random */
const rand = (a=1, b=0)=> b + (a-b)*Math.random();

/** Returns a floored random value the two values passed in
 *  @param {Number} [valueA=1]
 *  @param {Number} [valueB=0]
 *  @return {Number}
 *  @memberof Random */
const randInt = (a=1, b=0)=> rand(a,b)|0;

/** Randomly returns either -1 or 1
 *  @return {Number}
 *  @memberof Random */
const randSign = ()=> (rand(2)|0) * 2 - 1;

/** Returns a random color between the two passed in colors, combine components if linear
 *  @param {Color}   [colorA=new Color(1,1,1,1)]
 *  @param {Color}   [colorB=new Color(0,0,0,1)]
 *  @param {Boolean} [linear]
 *  @return {Color}
 *  @memberof Random */
const randColor = (cA = new Color, cB = new Color(0,0,0,1), linear)=>
    linear ? cA.lerp(cB, rand()) : new Color(rand(cA.r,cB.r),rand(cA.g,cB.g),rand(cA.b,cB.b),rand(cA.a,cB.a));

/** The seed used by the randSeeded function, should not be 0
 *  @memberof Random */
let randSeed = 1;

/** Returns a seeded random value between the two values passed in using randSeed
 *  @param {Number} [valueA=1]
 *  @param {Number} [valueB=0]
 *  @return {Number}
 *  @memberof Random */
const randSeeded = (a=1, b=0)=>
{
    randSeed ^= randSeed << 13; randSeed ^= randSeed >>> 17; randSeed ^= randSeed << 5; // xorshift
    return b + (a-b) * abs(randSeed % 1e9) / 1e9;
}

///////////////////////////////////////////////////////////////////////////////

/**
 * Create a 2d vector, can take another Vector2 to copy, 2 scalars, or 1 scalar
 * @param {Number} [x=0]
 * @param {Number} [y=0]
 * @return {Vector2}
 * @example
 * let a = vec2(0, 1); // vector with coordinates (0, 1)
 * let b = vec2(a);    // copy a into b
 * a = vec2(5);        // set a to (5, 5)
 * b = vec2();         // set b to (0, 0)
 * @memberof Utilities
 */
const vec2 = (x=0, y)=> x.x == undefined ? new Vector2(x, y == undefined? x : y) : new Vector2(x.x, x.y);

/**
 * 2D Vector object with vector math library
 * <br> - Functions do not change this so they can be chained together
 * @example
 * let a = new Vector2(2, 3); // vector with coordinates (2, 3)
 * let b = new Vector2;       // vector with coordinates (0, 0)
 * let c = vec2(4, 2);        // use the vec2 function to make a Vector2
 * let d = a.add(b).scale(5); // operators can be chained
 */
class Vector2
{
    /** Create a 2D vector with the x and y passed in, can also be created with vec2()
     *  @param {Number} [x=0] - X axis location
     *  @param {Number} [y=0] - Y axis location */
    constructor(x=0, y=0)
    {
        /** @property {Number} - X axis location */
        this.x = x;
        /** @property {Number} - Y axis location */
        this.y = y;
    }

    /** Returns a new vector that is a copy of this
     *  @return {Vector2} */
    copy() { return new Vector2(this.x, this.y); }

    /** Returns a copy of this vector plus the vector passed in
     *  @param {Vector2} vector
     *  @return {Vector2} */
    add(v) { return new Vector2(this.x + v.x, this.y + v.y); }

    /** Returns a copy of this vector minus the vector passed in
     *  @param {Vector2} vector
     *  @return {Vector2} */
    subtract(v) { return new Vector2(this.x - v.x, this.y - v.y); }

    /** Returns a copy of this vector times the vector passed in
     *  @param {Vector2} vector
     *  @return {Vector2} */
    multiply(v) { return new Vector2(this.x * v.x, this.y * v.y); }

    /** Returns a copy of this vector divided by the vector passed in
     *  @param {Vector2} vector
     *  @return {Vector2} */
    divide(v) { return new Vector2(this.x / v.x, this.y / v.y); }

    /** Returns a copy of this vector scaled by the vector passed in
     *  @param {Number} scale
     *  @return {Vector2} */
    scale(s) { return new Vector2(this.x * s, this.y * s); }

    /** Returns the length of this vector
     * @return {Number} */
    length() { return this.lengthSquared()**.5; }

    /** Returns the length of this vector squared
     * @return {Number} */
    lengthSquared() { return this.x**2 + this.y**2; }

    /** Returns the distance from this vector to vector passed in
     * @param {Vector2} vector
     * @return {Number} */
    distance(v) { return this.distanceSquared(v)**.5; }

    /** Returns the distance squared from this vector to vector passed in
     * @param {Vector2} vector
     * @return {Number} */
    distanceSquared(v) { return (this.x - v.x)**2 + (this.y - v.y)**2; }

    /** Returns a new vector in same direction as this one with the length passed in
     * @param {Number} [length=1]
     * @return {Vector2} */
    normalize(length=1) { const l = this.length(); return l ? this.scale(length/l) : new Vector2(0, length); }

    /** Returns a new vector clamped to length passed in
     * @param {Number} [length=1]
     * @return {Vector2} */
    clampLength(length=1) { const l = this.length(); return l > length ? this.scale(length/l) : this; }

    /** Returns the angle of this vector, up is angle 0
     * @return {Number} */
    angle() { return Math.atan2(this.x, this.y); }

    /** Returns copy of this vector rotated by the angle passed in
     * @param {Number} angle
     * @return {Vector2} */
    rotate(a) { const c = Math.cos(a), s = Math.sin(a); return new Vector2(this.x*c-this.y*s, this.x*s+this.y*c); }

    /** Returns a copy of this vector with each axis floored
     * @return {Vector2} */
    floor() { return new Vector2(Math.floor(this.x), Math.floor(this.y)); }

    /** Returns this vector expressed as a string
     * @return {String} */
    toString()
    { return `(${(this.x<0?'':' ') + this.x.toFixed()},${(this.y<0?'':' ') + this.y.toFixed()} )`; }

}

///////////////////////////////////////////////////////////////////////////////

/**
 * Color object (red, green, blue, alpha) with some helpful functions
 * @example
 * let a = new Color;             // white
 * let b = new Color(1, 0, 0);    // red
 * let c = new Color(0, 0, 0, 0); // transparent black
 */
class Color
{
    /** Create a color with the components passed in, white by default
     *  @param {Number} [red=1]
     *  @param {Number} [green=1]
     *  @param {Number} [blue=1]
     *  @param {Number} [alpha=1] */
    constructor(r=1, g=1, b=1, a=1)
    {
        /** @property {Number} - Red */
        this.r = r;
        /** @property {Number} - Green */
        this.g = g;
        /** @property {Number} - Blue */
        this.b = b;
        /** @property {Number} - Alpha */
        this.a = a;
    }

    /** Returns a new color that is a copy of this
     * @return {Color} */
    copy() { return new Color(this.r, this.g, this.b, this.a); }

    /** Returns a copy of this color plus the color passed in
     * @param {Color} color
     * @return {Color} */
    add(c) { return new Color(this.r+c.r, this.g+c.g, this.b+c.b, this.a+c.a); }

    /** Returns a copy of this color minus the color passed in
     * @param {Color} color
     * @return {Color} */
    subtract(c) { return new Color(this.r-c.r, this.g-c.g, this.b-c.b, this.a-c.a); }

    /** Returns a copy of this color times the color passed in
     * @param {Color} color
     * @return {Color} */
    multiply(c) { return new Color(this.r*c.r, this.g*c.g, this.b*c.b, this.a*c.a); }

    /** Returns a copy of this color scaled by the value passed in, alpha can be scaled separately
     * @param {Number} scale
     * @param {Number} [alphaScale=scale]
     * @return {Color} */
    scale(s, a=s) { return new Color(this.r*s, this.g*s, this.b*s, this.a*a); }

    /** Returns a new color that is p percent between this and the color passed in
     * @param {Color}  color
     * @param {Number} percent
     * @return {Color} */
    lerp(c, p) { return this.add(c.subtract(this).scale(clamp(p))); }

    /** Returns this color expressed as 32 bit integer RGBA value
     * @return {Number} */
    rgbaInt()
    {
        return (this.r*255|0) + (this.g*255<<8) + (this.b*255<<16) + (this.a*255<<24);
    }

    /** Returns this color expressed as an CSS color value
     * @return {String} */
    toString()
    {
        return `rgba(${this.r*255|0},${this.g*255|0},${this.b*255|0},${this.a.toFixed(3)})`;
    }
}

///////////////////////////////////////////////////////////////////////////////

/**
 * Timer object tracks how long has passed since it was set
 * @example
 * let a = new Timer;    // creates a timer that is not set
 * a.set(3);             // sets the timer to 3 seconds
 *
 * let b = new Timer(1); // creates a timer with 1 second left
 * b.unset();            // unsets the timer
 */
class Timer
{
    /** Create a timer object set time passed in
     *  @param {Number} [timeLeft] - How much time left before the timer elapses in seconds */
    constructor(timeLeft) { this.time = timeLeft == undefined ? undefined : time + timeLeft; this.setTime = timeLeft; }

    /** Set the timer with seconds passed in
     *  @param {Number} [timeLeft=0] - How much time left before the timer is elapsed in seconds */
    set(timeLeft=0) { this.time = time + timeLeft; this.setTime = timeLeft; }

    /** Returns true if set
     * @return {Boolean} */
    isSet() { return this.time != undefined; }

    /** Returns true if set and elapsed
     * @return {Boolean} */
    elapsed() { return time > this.time; }

    /** Get how long since elapsed, returns 0 if not set (returns negative if currently active)
     * @return {Number} */
    get() { return this.isSet()? time - this.time : 0; }

    /** Get percentage elapsed based on time it was set to, returns 0 if not set
     * @return {Number} */
    getPercent() { return this.isSet()? percent(this.time - time, this.setTime, 0) : 0; }
}
/**
 * LittleJS Engine Settings
 * @namespace Settings
 */


///////////////////////////////////////////////////////////////////////////////
// Display settings

/** The max size of the canvas, centered if window is larger
 *  @type {Vector2}
 *  @default
 *  @memberof Settings */
let canvasMaxSize = vec2(1920, 1200);

/** Fixed size of the canvas, if enabled canvas size never changes
 * - you may also need to set mainCanvasSize if using screen space coords in startup
 *  @type {Vector2}
 *  @default
 *  @memberof Settings */
let canvasFixedSize = vec2();

/** Disables anti aliasing for pixel art if true
 *  @default
 *  @memberof Settings */
let cavasPixelated = 1;

///////////////////////////////////////////////////////////////////////////////
// Tile sheet settings

/** Default size of tiles in pixels
 *  @type {Vector2}
 *  @default
 *  @memberof Settings */
let tileSizeDefault = vec2(32);

/** Prevent tile bleeding from neighbors in pixels
 *  @default
 *  @memberof Settings */
let tileFixBleedScale = .3;

///////////////////////////////////////////////////////////////////////////////
// Object settings

/** Default size of objects
 *  @type {Vector2}
 *  @default
 *  @memberof Settings */
let objectDefaultSize = vec2(1);

/** How much gravity to apply to objects along the Y axis, negative is down
 *  @default
 *  @memberof Settings */
let gravity = 0;


///////////////////////////////////////////////////////////////////////////////
// Camera settings

/** Position of camera in world space
 *  @type {Vector2}
 *  @default
 *  @memberof Settings */
let cameraPos = vec2();

/** Scale of camera in world space
 *  @default
 *  @memberof Settings */
let cameraScale = 128;

///////////////////////////////////////////////////////////////////////////////
// WebGL settings

/** Enable webgl rendering, webgl can be disabled and removed from build (with some features disabled)
 *  @default
 *  @memberof Settings */
let glEnable = 1;

/** Fixes slow rendering in some browsers by not compositing the WebGL canvas
 *  @default
 *  @memberof Settings */
let glOverlay = 1;

///////////////////////////////////////////////////////////////////////////////
// Input settings

/** Should gamepads be allowed
 *  @default
 *  @memberof Settings */
let gamepadsEnable = 1;

/** If true, the dpad input is also routed to the left analog stick (for better accessability)
 *  @default
 *  @memberof Settings */
let gamepadDirectionEmulateStick = 1;

/** If true the WASD keys are also routed to the direction keys (for better accessability)
 *  @default
 *  @memberof Settings */
let inputWASDEmulateDirection = 1;


///////////////////////////////////////////////////////////////////////////////
// Audio settings

/** Volume scale to apply to all sound, music and speech
 *  @default
 *  @memberof Settings */
let soundVolume = .5;

/** Default range where sound no longer plays
 *  @default
 *  @memberof Settings */
let soundDefaultRange = 30;

/** Default range percent to start tapering off sound (0-1)
 *  @default
 *  @memberof Settings */
let soundDefaultTaper = .7;

/*
    LittleJS - The Tiny JavaScript Game Engine That Can!
    MIT License - Copyright 2021 Frank Force

    Engine Features
    - Object oriented system with base class engine object
    - Base class object handles update, physics, collision, rendering, etc
    - Engine helper classes and functions like Vector2, Color, and Timer
    - Super fast rendering system for tile sheets
    - Sound effects audio with zzfx and music with zzfxm
    - Input processing system with gamepad and touchscreen support
    - Tile layer rendering and collision system
    - Particle effect system
    - Medal system tracks and displays achievements
    - Debug tools and debug rendering system
    - Call engineInit() to start it up!
*/


/** Name of engine */
const engineName = 'LittleJS';

/** Version of engine */
const engineVersion = '1.3.8';

/** Frames per second to update objects
 *  @default */
const frameRate = 60;

/** How many seconds each frame lasts, engine uses a fixed time step
 *  @default 1/60 */
const timeDelta = 1/frameRate;

/** Array containing all engine objects */
let engineObjects = [];

/** Current update frame, used to calculate time */
let frame = 0;

/** Current engine time since start in seconds, derived from frame */
let time = 0;

/** Actual clock time since start in seconds (not affected by pause or frame rate clamping) */
let timeReal = 0;

/** Is the game paused? Causes time and objects to not be updated. */
let paused = 0;

// Engine internal variables not exposed to documentation
let frameTimeLastMS = 0, frameTimeBufferMS = 0, tileImageSize, tileImageFixBleed;

// Engine stat tracking, if showWatermark is true
let averageFPS, drawCount;

// css text used for elements created by engine
const styleBody = 'touch-action:none;-webkit-user-select:none;-moz-user-select:none';
const styleCanvas = 'position:absolute;top:50%;left:50%;transform:translate(-50%,-50%)';

///////////////////////////////////////////////////////////////////////////////

/** Start up LittleJS engine with your callback functions
 *  @param {Function} gameInit        - Called once after the engine starts up, setup the game
 *  @param {Function} gameUpdate      - Called every frame at 60 frames per second, handle input and update the game state
 *  @param {Function} gameUpdatePost  - Called after physics and objects are updated, setup camera and prepare for render
 *  @param {Function} gameRender      - Called before objects are rendered, draw any background effects that appear behind objects
 *  @param {Function} gameRenderPost  - Called after objects are rendered, draw effects or hud that appear above all objects
 *  @param {String} [tileImageSource] - Tile image to use, everything starts when the image is finished loading
 */
function engineInit(gameInit, gameUpdate, gameUpdatePost, gameRender, gameRenderPost, tileImageSource)
{
    // init engine when tiles load or fail to load
    tileImage.onerror = tileImage.onload = ()=>
    {
        // save tile image info
        tileImageFixBleed = vec2(tileFixBleedScale).divide(tileImageSize = vec2(tileImage.width, tileImage.height));

        // setup html
        document.body.style = styleBody;
        document.body.appendChild(mainCanvas = document.createElement('canvas'));
        mainContext = mainCanvas.getContext('2d');
        mainCanvas.style = styleCanvas;

        // init stuff and start engine
        glInit();

        // create overlay canvas for hud to appear above gl canvas
        document.body.appendChild(overlayCanvas = document.createElement('canvas'));
        overlayContext = overlayCanvas.getContext('2d');
        overlayCanvas.style = styleCanvas;

        gameInit();
        engineUpdate();
    };

    // main update loop
    const engineUpdate = (frameTimeMS=0)=>
    {
        // update time keeping
        let frameTimeDeltaMS = frameTimeMS - frameTimeLastMS;
        frameTimeLastMS = frameTimeMS;
        if (showWatermark)
            averageFPS = lerp(.05, averageFPS || 0, 1e3/(frameTimeDeltaMS||1));

        timeReal += frameTimeDeltaMS / 1e3;
        frameTimeBufferMS = min(frameTimeBufferMS + !paused * frameTimeDeltaMS, 50); // clamp incase of slow framerate

        // clear and set size to same as window
        let width = min(innerWidth,  canvasMaxSize.x);
        let height = min(innerHeight, canvasMaxSize.y);
        // Make sure canvas size is even.
        width -= width % 2;
        height -= height % 2;

        overlayCanvas.width  = mainCanvas.width  = width;
        overlayCanvas.height = mainCanvas.height = height;

        // save canvas size
        mainCanvasSize = vec2(mainCanvas.width, mainCanvas.height);

        if (paused)
        {
            // do post update even when paused
            inputUpdate();
            gameUpdatePost();
            inputUpdatePost();
        }
        else
        {
            // apply time delta smoothing, improves smoothness of framerate in some browsers
            let deltaSmooth = 0;
            if (frameTimeBufferMS < 0 && frameTimeBufferMS > -9)
            {
                // force an update each frame if time is close enough (not just a fast refresh rate)
                deltaSmooth = frameTimeBufferMS;
                frameTimeBufferMS = 0;
            }

            // update multiple frames if necessary in case of slow framerate
            for (;frameTimeBufferMS >= 0; frameTimeBufferMS -= 1e3 / frameRate)
            {
                // update game and objects
                inputUpdate();
                gameUpdate();
                engineObjectsUpdate();

                // do post update
                gameUpdatePost();
                inputUpdatePost();
            }

            // add the time smoothing back in
            frameTimeBufferMS += deltaSmooth;
        }

        // render sort then render while removing destroyed objects
        enginePreRender();
        gameRender();
        engineObjects.sort((a,b)=> a.renderOrder - b.renderOrder);
        for (const o of engineObjects)
            o.destroyed || o.render();
        gameRenderPost();
        glCopyToContext(mainContext);

        if (showWatermark)
        {
            // update fps
            overlayContext.textAlign = 'right';
            overlayContext.textBaseline = 'top';
            overlayContext.font = '1em monospace';
            overlayContext.fillStyle = '#000';
            const text = engineName + ' ' + 'v' + engineVersion + ' / '
                + drawCount + ' / ' + engineObjects.length + ' / ' + averageFPS.toFixed(1)
                + ' ' + (glEnable ? 'GL' : '2D') ;
            overlayContext.fillText(text, mainCanvas.width-3, 3);
            overlayContext.fillStyle = '#fff';
            overlayContext.fillText(text, mainCanvas.width-2, 2);
            drawCount = 0;
        }

        requestAnimationFrame(engineUpdate);
    }

    // set tile image source to load the image and start the engine
    tileImageSource ? tileImage.src = tileImageSource : tileImage.onload();
}

// called by engine to setup render system
function enginePreRender()
{
    // save canvas size
    mainCanvasSize = vec2(mainCanvas.width, mainCanvas.height);

    // disable smoothing for pixel art
    mainContext.imageSmoothingEnabled = !cavasPixelated;

    // setup gl rendering if enabled
    glPreRender(mainCanvas.width, mainCanvas.height, cameraPos.x, cameraPos.y, cameraScale);
}

///////////////////////////////////////////////////////////////////////////////

/** Calls update on each engine object (recursively if child), removes destroyed objects, and updated time */
function engineObjectsUpdate()
{
    // recursive object update
    const updateObject = (o)=>
    {
        if (!o.destroyed)
        {
            o.update();
            for (const child of o.children)
                updateObject(child);
        }
    }
    for (const o of engineObjects)
        o.parent || updateObject(o);

    // remove destroyed objects
    engineObjects = engineObjects.filter(o=>!o.destroyed);

    // increment frame and update time
    time = ++frame / frameRate;
}

/*
    LittleJS Object System
*/


/**
 * LittleJS Object Base Object Class
 * <br> - Base object class used by the engine
 * <br> - Automatically adds self to object list
 * <br> - Will be updated and rendered each frame
 * <br> - Renders as a sprite from a tilesheet by default
 * <br> - Can have color and addtive color applied
 * <br> - 2d Physics and collision system
 * <br> - Sorted by renderOrder
 * <br> - Objects can have children attached
 * <br> - Parents are updated before children, and set child transform
 * <br> - Call destroy() to get rid of objects
 * <br>
 * <br>The physics system used by objects is simple and fast with some caveats...
 * <br> - Collision uses the axis aligned size, the object's rotation angle is only for rendering
 * <br> - Objects are guaranteed to not intersect tile collision from physics
 * <br> - If an object starts or is moved inside tile collision, it will not collide with that tile
 * <br> - Collision for objects can be set to be solid to block other objects
 * <br> - Objects may get pushed into overlapping other solid objects, if so they will push away
 * <br> - Solid objects are more performance intensive and should be used sparingly
 * @example
 * // create an engine object, normally you would first extend the class with your own
 * const pos = vec2(2,3);
 * const object = new EngineObject(pos);
 */
class EngineObject
{
    /** Create an engine object and adds it to the list of objects
     *  @param {Vector2} [position=new Vector2()]    - World space position of the object
     *  @param {Vector2} [size=objectDefaultSize]    - World space size of the object
     *  @param {Number}  [tileIndex=-1]              - Tile to use to render object (-1 is untextured)
     *  @param {Vector2} [tileSize=tileSizeDefault]  - Size of tile in source pixels
     *  @param {Number}  [angle=0]                   - Angle the object is rotated by
     *  @param {Color}   [color]                     - Color to apply to tile when rendered
     *  @param {Number}  [renderOrder=0]             - Objects sorted by renderOrder before being rendered
     */
    constructor(pos=vec2(), size=objectDefaultSize, tileIndex=-1, tileSize=tileSizeDefault, angle=0, color, renderOrder=0)
    {
        // set passed in params

        /** @property {Vector2} - World space position of the object */
        this.pos = pos.copy();
        /** @property {Vector2} - World space width and height of the object */
        this.size = size;
        /** @property {Vector2} - Size of object used for drawing, uses size if not set */
        this.drawSize;
        /** @property {Number}  - Tile to use to render object (-1 is untextured) */
        this.tileIndex = tileIndex;
        /** @property {Vector2} - Size of tile in source pixels */
        this.tileSize = tileSize;
        /** @property {Number}  - Angle to rotate the object */
        this.angle = angle;
        /** @property {Color}   - Color to apply when rendered */
        this.color = color;
        /** @property {Color}   - Additive color to apply when rendered */
        this.additiveColor;

        // set object defaults
        /** @property {Number} [renderOrder=0]                          - Objects are sorted by render order */
        this.renderOrder = renderOrder;

        // init other internal object stuff
        this.children = [];

        // add to list of objects
        engineObjects.push(this);
    }

    /** Update the object transform and physics, called automatically by engine once each frame */
    update()
    {
        const parent = this.parent;
        if (parent)
        {
            // copy parent pos/angle
            this.pos = this.localPos.multiply(vec2(parent.getMirrorSign(),1)).rotate(-parent.angle).add(parent.pos);
            this.angle = parent.getMirrorSign()*this.localAngle + parent.angle;
        }
    }

    /** Render the object, draws a tile by default, automatically called each frame, sorted by renderOrder */
    render()
    {
        // default object render
        drawTile(this.pos, this.drawSize || this.size, this.tileIndex, this.tileSize, this.color, this.angle, this.mirror, this.additiveColor);
    }

    /** Destroy this object, destroy it's children, detach it's parent, and mark it for removal */
    destroy()
    {
        if (this.destroyed)
            return;

        // disconnect from parent and destroy chidren
        this.destroyed = 1;
        this.parent && this.parent.removeChild(this);
        for (const child of this.children)
            child.destroy(child.parent = 0);
    }

    /** Get the direction of the mirror
     *  @return {Number} -1 if this.mirror is true, or 1 if not mirrored */
    getMirrorSign() { return this.mirror ? -1 : 1; }

    /** Removes a child from this one
     *  @param {EngineObject} child */
    removeChild(child)
    {
        this.children.splice(this.children.indexOf(child), 1);
        child.parent = 0;
    }
}
/**
 * LittleJS Drawing System
 * <br> - Hybrid with both Canvas2D and WebGL available
 * <br> - Super fast tile sheet rendering with WebGL
 * <br> - Can apply rotation, mirror, color and additive color
 * <br> - Many useful utility functions
 * <br>
 * <br>LittleJS uses a hybrid rendering solution with the best of both Canvas2D and WebGL.
 * <br>There are 3 canvas/contexts available to draw to...
 * <br> - mainCanvas - 2D background canvas, non WebGL stuff like tile layers are drawn here.
 * <br> - glCanvas - Used by the accelerated WebGL batch rendering system.
 * <br> - overlayCanvas - Another 2D canvas that appears on top of the other 2 canvases.
 * <br>
 * <br>The WebGL rendering system is very fast with some caveats...
 * <br> - The default setup supports only 1 tile sheet, to support more call glCreateTexture and glSetTexture
 * <br> - Switching blend modes (additive) or textures causes another draw call which is expensive in excess
 * <br> - Group additive rendering together using renderOrder to mitigate this issue
 * <br>
 * <br>The LittleJS rendering solution is intentionally simple, feel free to adjust it for your needs!
 * @namespace Draw
 */


/** Tile sheet for batch rendering system
 *  @type {Image}
 *  @memberof Draw */
const tileImage = new Image();

/** The primary 2D canvas visible to the user
 *  @type {HTMLCanvasElement}
 *  @memberof Draw */
let mainCanvas;

/** 2d context for mainCanvas
 *  @type {CanvasRenderingContext2D}
 *  @memberof Draw */
let mainContext;

/** A canvas that appears on top of everything the same size as mainCanvas
 *  @type {HTMLCanvasElement}
 *  @memberof Draw */
let overlayCanvas;

/** 2d context for overlayCanvas
 *  @type {CanvasRenderingContext2D}
 *  @memberof Draw */
let overlayContext;

/** The size of the main canvas (and other secondary canvases)
 *  @type {Vector2}
 *  @memberof Draw */
let mainCanvasSize = vec2();

/** Convert from screen to world space coordinates
 *  - if calling outside of render, you may need to manually set mainCanvasSize
 *  @param {Vector2} screenPos
 *  @return {Vector2}
 *  @memberof Draw */
const screenToWorld = (screenPos)=>
{
    return screenPos.add(vec2(.5)).subtract(mainCanvasSize.scale(.5)).multiply(vec2(1/cameraScale,-1/cameraScale)).add(cameraPos);
}

/** Convert from world to screen space coordinates
 *  - if calling outside of render, you may need to manually set mainCanvasSize
 *  @param {Vector2} worldPos
 *  @return {Vector2}
 *  @memberof Draw */
const worldToScreen = (worldPos)=>
{
    return worldPos.subtract(cameraPos).multiply(vec2(cameraScale,-cameraScale)).add(mainCanvasSize.scale(.5)).subtract(vec2(.5));
}

/** Draw textured tile centered in world space, with color applied if using WebGL
 *  @param {Vector2} pos                                - Center of the tile in world space
 *  @param {Vector2} [size=new Vector2(1,1)]            - Size of the tile in world space, width and height
 *  @param {Number}  [tileIndex=-1]                     - Tile index to use, negative is untextured
 *  @param {Vector2} [tileSize=tileSizeDefault]         - Tile size in source pixels
 *  @param {Color}   [color=new Color(1,1,1)]           - Color to modulate with
 *  @param {Number}  [angle=0]                          - Angle to rotate by
 *  @param {Boolean} [mirror=0]                         - If true image is flipped along the Y axis
 *  @param {Color}   [additiveColor=new Color(0,0,0,0)] - Additive color to be applied
 *  @param {Boolean} [useWebGL=glEnable]                - Use accelerated WebGL rendering
 *  @memberof Draw */
function drawTile(pos, size=vec2(1), tileIndex=-1, tileSize=tileSizeDefault, color=new Color, angle=0, mirror,
    additiveColor=new Color(0,0,0,0), useWebGL=glEnable)
{
    showWatermark && ++drawCount;
    if (glEnable && useWebGL)
    {
        if (tileIndex < 0 || !tileImage.width)
        {
            // if negative tile index or image not found, force untextured
            glDraw(pos.x, pos.y, size.x, size.y, angle, 0, 0, 0, 0, 0, color.rgbaInt());
        }
        else
        {
            // calculate uvs and render
            const cols = tileImageSize.x / tileSize.x |0;
            const uvSizeX = tileSize.x / tileImageSize.x;
            const uvSizeY = tileSize.y / tileImageSize.y;
            const uvX = (tileIndex%cols)*uvSizeX, uvY = (tileIndex/cols|0)*uvSizeY;

            glDraw(pos.x, pos.y, mirror ? -size.x : size.x, size.y, angle,
                uvX + tileImageFixBleed.x, uvY + tileImageFixBleed.y,
                uvX - tileImageFixBleed.x + uvSizeX, uvY - tileImageFixBleed.y + uvSizeY,
                color.rgbaInt(), additiveColor.rgbaInt());
        }
    }
    else
    {
        // normal canvas 2D rendering method (slower)
        drawCanvas2D(pos, size, angle, mirror, (context)=>
        {
            if (tileIndex < 0)
            {
                // if negative tile index, force untextured
                context.fillStyle = color;
                context.fillRect(-.5, -.5, 1, 1);
            }
            else
            {
                // calculate uvs and render
                const cols = tileImageSize.x / tileSize.x |0;
                const sX = (tileIndex%cols)*tileSize.x   + tileFixBleedScale;
                const sY = (tileIndex/cols|0)*tileSize.y + tileFixBleedScale;
                const sWidth  = tileSize.x - 2*tileFixBleedScale;
                const sHeight = tileSize.y - 2*tileFixBleedScale;
                context.globalAlpha = color.a; // only alpha is supported
                context.drawImage(tileImage, sX, sY, sWidth, sHeight, -.5, -.5, 1, 1);
            }
        });
    }
}

/** Draw colored rect centered on pos
 *  @param {Vector2} pos
 *  @param {Vector2} [size=new Vector2(1,1)]
 *  @param {Color}   [color=new Color(1,1,1)]
 *  @param {Number}  [angle=0]
 *  @param {Boolean} [useWebGL=glEnable]
 *  @memberof Draw */
function drawRect(pos, size, color, angle, useWebGL)
{
    drawTile(pos, size, -1, tileSizeDefault, color, angle, 0, 0, useWebGL);
}

/** Draw textured tile centered on pos in screen space
 *  @param {Vector2} pos                        - Center of the tile
 *  @param {Vector2} [size=new Vector2(1,1)]    - Size of the tile
 *  @param {Number}  [tileIndex=-1]             - Tile index to use, negative is untextured
 *  @param {Vector2} [tileSize=tileSizeDefault] - Tile size in source pixels
 *  @param {Color}   [color=new Color]
 *  @param {Number}  [angle=0]
 *  @param {Boolean} [mirror=0]
 *  @param {Color}   [additiveColor=new Color(0,0,0,0)]
 *  @param {Boolean} [useWebGL=glEnable]
 *  @memberof Draw */
function drawTileScreenSpace(pos, size=vec2(1), tileIndex, tileSize, color, angle, mirror, additiveColor, useWebGL)
{
    drawTile(screenToWorld(pos), size.scale(1/cameraScale), tileIndex, tileSize, color, angle, mirror, additiveColor, useWebGL);
}

/** Draw colored rectangle in screen space
 *  @param {Vector2} pos
 *  @param {Vector2} [size=new Vector2(1,1)]
 *  @param {Color}   [color=new Color(1,1,1)]
 *  @param {Number}  [angle=0]
 *  @param {Boolean} [useWebGL=glEnable]
 *  @memberof Draw */
function drawRectScreenSpace(pos, size, color, angle, useWebGL)
{
    drawTileScreenSpace(pos, size, -1, tileSizeDefault, color, angle, 0, 0, useWebGL);
}

/** Draw colored line between two points
 *  @param {Vector2} posA
 *  @param {Vector2} posB
 *  @param {Number}  [thickness=.1]
 *  @param {Color}   [color=new Color(1,1,1)]
 *  @param {Boolean} [useWebGL=glEnable]
 *  @memberof Draw */
function drawLine(posA, posB, thickness=.1, color, useWebGL)
{
    const halfDelta = vec2((posB.x - posA.x)/2, (posB.y - posA.y)/2);
    const size = vec2(thickness, halfDelta.length()*2);
    drawRect(posA.add(halfDelta), size, color, halfDelta.angle(), useWebGL);
}

/** Draw directly to a 2d canvas context in world space
 *  @param {Vector2}  pos
 *  @param {Vector2}  size
 *  @param {Number}   angle
 *  @param {Boolean}  mirror
 *  @param {Function} drawFunction
 *  @param {CanvasRenderingContext2D} [context=mainContext]
 *  @memberof Draw */
function drawCanvas2D(pos, size, angle, mirror, drawFunction, context = mainContext)
{
    // create canvas transform from world space to screen space
    pos = worldToScreen(pos);
    size = size.scale(cameraScale);
    context.save();
    context.translate(pos.x+.5|0, pos.y-.5|0);
    context.rotate(angle);
    context.scale(mirror ? -size.x : size.x, size.y);
    drawFunction(context);
    context.restore();
}

/** Enable normal or additive blend mode
 *  @param {Boolean} [additive=0]
 *  @param {Boolean} [useWebGL=glEnable]
 *  @memberof Draw */
function setBlendMode(additive, useWebGL=glEnable)
{
    if (glEnable && useWebGL)
        glSetBlendMode(additive);
    else
        mainContext.globalCompositeOperation = additive ? 'lighter' : 'source-over';
}

///////////////////////////////////////////////////////////////////////////////
// Fullscreen mode

/** Returns true if fullscreen mode is active
 *  @return {Boolean}
 *  @memberof Draw */
const isFullscreen =()=> document.fullscreenElement;

/** Toggle fullsceen mode
 *  @memberof Draw */
function toggleFullscreen()
{
    if (isFullscreen())
    {
        if (document.exitFullscreen)
            document.exitFullscreen();
        else if (document.mozCancelFullScreen)
            document.mozCancelFullScreen();
    }
    else
    {
        if (document.body.webkitRequestFullScreen)
            document.body.webkitRequestFullScreen();
        else if (document.body.mozRequestFullScreen)
            document.body.mozRequestFullScreen();
    }
}
/**
 * LittleJS Input System
 * <br> - Tracks key down, pressed, and released
 * <br> - Also tracks mouse buttons, position, and wheel
 * <br> - Supports multiple gamepads
 * <br> - Virtual gamepad for touch devices with touchGamepadSize
 * @namespace Input
 */


/** Returns true if device key is down
 *  @param {Number} key
 *  @param {Number} [device=0]
 *  @return {Boolean}
 *  @memberof Input */
const keyIsDown = (key, device=0)=> inputData[device] && inputData[device][key] & 1 ? 1 : 0;

/** Returns true if device key was pressed this frame
 *  @param {Number} key
 *  @param {Number} [device=0]
 *  @return {Boolean}
 *  @memberof Input */
const keyWasPressed = (key, device=0)=> inputData[device] && inputData[device][key] & 2 ? 1 : 0;

/** Returns true if device key was released this frame
 *  @param {Number} key
 *  @param {Number} [device=0]
 *  @return {Boolean}
 *  @memberof Input */
const keyWasReleased = (key, device=0)=> inputData[device] && inputData[device][key] & 4 ? 1 : 0;

/** Clears all input
 *  @memberof Input */
const clearInput = ()=> inputData = [[]];

/** Returns true if mouse button is down
 *  @param {Number} button
 *  @return {Boolean}
 *  @memberof Input */
const mouseIsDown = keyIsDown;

/** Returns true if mouse button was pressed
 *  @param {Number} button
 *  @return {Boolean}
 *  @memberof Input */
const mouseWasPressed = keyWasPressed;

/** Returns true if mouse button was released
 *  @param {Number} button
 *  @return {Boolean}
 *  @memberof Input */
const mouseWasReleased = keyWasReleased;

/** Mouse pos in world space
 *  @type {Vector2}
 *  @memberof Input */
let mousePos = vec2();

/** Mouse pos in screen space
 *  @type {Vector2}
 *  @memberof Input */
let mousePosScreen = vec2();

/** Mouse wheel delta this frame
 *  @memberof Input */
let mouseWheel = 0;

/** Returns true if user is using gamepad (has more recently pressed a gamepad button)
 *  @memberof Input */
let isUsingGamepad = 0;

/** Prevents input continuing to the default browser handling (false by default)
 *  @memberof Input */
let preventDefaultInput = 0;

/** Returns true if gamepad button is down
 *  @param {Number} button
 *  @param {Number} [gamepad=0]
 *  @return {Boolean}
 *  @memberof Input */
const gamepadIsDown = (button, gamepad=0)=> keyIsDown(button, gamepad+1);

/** Returns true if gamepad button was pressed
 *  @param {Number} button
 *  @param {Number} [gamepad=0]
 *  @return {Boolean}
 *  @memberof Input */
const gamepadWasPressed = (button, gamepad=0)=> keyWasPressed(button, gamepad+1);

/** Returns true if gamepad button was released
 *  @param {Number} button
 *  @param {Number} [gamepad=0]
 *  @return {Boolean}
 *  @memberof Input */
const gamepadWasReleased = (button, gamepad=0)=> keyWasReleased(button, gamepad+1);

/** Returns gamepad stick value
 *  @param {Number} stick
 *  @param {Number} [gamepad=0]
 *  @return {Vector2}
 *  @memberof Input */
const gamepadStick = (stick,  gamepad=0)=> stickData[gamepad] ? stickData[gamepad][stick] || vec2() : vec2();

///////////////////////////////////////////////////////////////////////////////
// Input update called by engine

// store input as a bit field for each key: 1 = isDown, 2 = wasPressed, 4 = wasReleased
// mouse and keyboard are stored together in device 0, gamepads are in devices > 0
let inputData = [[]];

function inputUpdate()
{
    // clear input when lost focus (prevent stuck keys)
    document.hasFocus() || clearInput();

    // update mouse world space position
    mousePos = screenToWorld(mousePosScreen);

    // update gamepads if enabled
    gamepadsUpdate();
}

function inputUpdatePost()
{
    // clear input to prepare for next frame
    for (const deviceInputData of inputData)
    for (const i in deviceInputData)
        deviceInputData[i] &= 1;
    mouseWheel = 0;
}

///////////////////////////////////////////////////////////////////////////////
// Keyboard event handlers

onkeydown = (e)=>
{
    e.repeat || (inputData[isUsingGamepad = 0][remapKeyCode(e.keyCode)] = 3);
    preventDefaultInput && e.preventDefault();
}
onkeyup = (e)=>
{
    inputData[0][remapKeyCode(e.keyCode)] = 4;
}
const remapKeyCode = (c)=> inputWASDEmulateDirection ? c==87?38 : c==83?40 : c==65?37 : c==68?39 : c : c;

///////////////////////////////////////////////////////////////////////////////
// Mouse event handlers

onmousedown = (e)=> {inputData[isUsingGamepad = 0][e.button] = 3; onmousemove(e); e.button && e.preventDefault();}
onmouseup   = (e)=> inputData[0][e.button] = inputData[0][e.button] & 2 | 4;
onmousemove = (e)=> mousePosScreen = mouseToScreen(e);
onwheel = (e)=> e.ctrlKey || (mouseWheel = sign(e.deltaY));
oncontextmenu = (e)=> !1; // prevent right click menu

// convert a mouse or touch event position to screen space
const mouseToScreen = (mousePos)=>
{
    if (!mainCanvas)
        return vec2(); // fix bug that can occur if user clicks before page loads

    const rect = mainCanvas.getBoundingClientRect();
    return vec2(mainCanvas.width, mainCanvas.height).multiply(
        vec2(percent(mousePos.x, rect.left, rect.right), percent(mousePos.y, rect.top, rect.bottom)));
}

///////////////////////////////////////////////////////////////////////////////
// Gamepad input

const stickData = [];
function gamepadsUpdate()
{
    if (!gamepadsEnable || !navigator.getGamepads || !document.hasFocus())
        return;

    // poll gamepads
    const gamepads = navigator.getGamepads();
    for (let i = gamepads.length; i--;)
    {
        // get or create gamepad data
        const gamepad = gamepads[i];
        const data = inputData[i+1] || (inputData[i+1] = []);
        const sticks = stickData[i] || (stickData[i] = []);

        if (gamepad)
        {
            // read clamp dead zone of analog sticks
            const deadZone = .3, deadZoneMax = .8;
            const applyDeadZone = (v)=>
                v >  deadZone ?  percent( v, deadZone, deadZoneMax) :
                v < -deadZone ? -percent(-v, deadZone, deadZoneMax) : 0;

            // read analog sticks
            for (let j = 0; j < gamepad.axes.length-1; j+=2)
                sticks[j>>1] = vec2(applyDeadZone(gamepad.axes[j]), applyDeadZone(-gamepad.axes[j+1])).clampLength();

            // read buttons
            for (let j = gamepad.buttons.length; j--;)
            {
                const button = gamepad.buttons[j];
                data[j] = button.pressed ? 1 + 2*!gamepadIsDown(j,i) : 4*gamepadIsDown(j,i);
                isUsingGamepad |= !i && button.pressed;
            }

            if (gamepadDirectionEmulateStick)
            {
                // copy dpad to left analog stick when pressed
                const dpad = vec2(gamepadIsDown(15,i) - gamepadIsDown(14,i), gamepadIsDown(12,i) - gamepadIsDown(13,i));
                if (dpad.lengthSquared())
                    sticks[0] = dpad.clampLength();
            }
        }
    }
}

///////////////////////////////////////////////////////////////////////////////
// Touch input

/** True if a touch device has been detected
 *  @const {boolean}
 *  @memberof Input */
const isTouchDevice = window.ontouchstart !== undefined;

// try to enable touch mouse
if (isTouchDevice)
{
    // handle all touch events the same way
    let wasTouching, hadTouchInput;
    ontouchstart = ontouchmove = ontouchend = (e)=>
    {
        e.button = 0; // all touches are left click

        // check if touching and pass to mouse events
        const touching = e.touches.length;
        if (touching)
        {
            hadTouchInput || zzfx(0, hadTouchInput=1) ; // fix mobile audio, force it to play a sound the first time

            // set event pos and pass it along
            e.x = e.touches[0].clientX;
            e.y = e.touches[0].clientY;
            wasTouching ? onmousemove(e) : onmousedown(e);
        }
        else if (wasTouching)
            onmouseup(e);

        // set was touching
        wasTouching = touching;

        // prevent normal mouse events from being called
        return !e.cancelable;
    }
}

/**
 * LittleJS Audio System
 * <br> - <a href=https://killedbyapixel.github.io/ZzFX/>ZzFX Sound Effects</a>
 * <br> - <a href=https://keithclark.github.io/ZzFXM/>ZzFXM Music</a>
 * <br> - Caches sounds and music for fast playback
 * <br> - Can attenuate and apply stereo panning to sounds
 * <br> - Ability to play mp3, ogg, and wave files
 * <br> - Speech synthesis wrapper functions
 */


/**
 * Sound Object - Stores a zzfx sound for later use and can be played positionally
 * <br>
 * <br><b><a href=https://killedbyapixel.github.io/ZzFX/>Create sounds using the ZzFX Sound Designer.</a></b>
 * @example
 * // create a sound
 * const sound_example = new Sound([.5,.5]);
 *
 * // play the sound
 * sound_example.play();
 */
class Sound
{
    /** Create a sound object and cache the zzfx samples for later use
     *  @param {Array}  zzfxSound - Array of zzfx parameters, ex. [.5,.5]
     *  @param {Number} [range=soundDefaultRange] - World space max range of sound, will not play if camera is farther away
     *  @param {Number} [taper=soundDefaultTaper] - At what percentage of range should it start tapering off
     */
    constructor(zzfxSound, range=soundDefaultRange, taper=soundDefaultTaper)
    {
        /** @property {Number} - World space max range of sound, will not play if camera is farther away */
        this.range = range;

        /** @property {Number} - At what percentage of range should it start tapering off */
        this.taper = taper;

        // get randomness from sound parameters
        this.randomness = zzfxSound[1] || 0;
        zzfxSound[1] = 0;

        // generate sound now for fast playback
        this.cachedSamples = zzfxG(...zzfxSound);
    }

    /** Play the sound
     *  @param {Vector2} [pos] - World space position to play the sound, sound is not attenuated if null
     *  @param {Number}  [volume=1] - How much to scale volume by (in addition to range fade)
     *  @param {Number}  [pitch=1] - How much to scale pitch by (also adjusted by this.randomness)
     *  @param {Number}  [randomnessScale=1] - How much to scale randomness
     *  @return {AudioBufferSourceNode} - The audio, can be used to stop sound later
     */
    play(pos, volume=1, pitch=1, randomnessScale=1)
    {
        let pan = 0;
        if (pos)
        {
            const range = this.range;
            if (range)
            {
                // apply range based fade
                const lengthSquared = cameraPos.distanceSquared(pos);
                if (lengthSquared > range*range)
                    return; // out of range

                // attenuate volume by distance
                volume *= percent(lengthSquared**.5, range, range*this.taper);
            }

            // get pan from screen space coords
            pan = worldToScreen(pos).x * 2/mainCanvas.width - 1;
        }

        // play the sound
        const playbackRate = pitch + pitch * this.randomness*randomnessScale*rand(-1,1);
        return playSamples([this.cachedSamples], volume, playbackRate, pan);
    }
}

///////////////////////////////////////////////////////////////////////////////

/** Audio context used by the engine
 *  @memberof Audio */
let audioContext;

/** Play cached audio samples with given settings
 *  @param {Array}   sampleChannels - Array of arrays of samples to play (for stereo playback)
 *  @param {Number}  [volume=1] - How much to scale volume by
 *  @param {Number}  [rate=1] - The playback rate to use
 *  @param {Number}  [pan=0] - How much to apply stereo panning
 *  @param {Boolean} [loop=0] - True if the sound should loop when it reaches the end
 *  @return {AudioBufferSourceNode} - The audio node of the sound played
 *  @memberof Audio */
function playSamples(sampleChannels, volume=1, rate=1, pan=0, loop=0)
{
    // create audio context
    if (!audioContext)
        audioContext = new (window.AudioContext||webkitAudioContext);

    // fix stalled audio
    audioContext.resume();

    // prevent sounds from building up if they can't be played
    if (audioContext.state != 'running')
        return;

    // create buffer and source
    const buffer = audioContext.createBuffer(sampleChannels.length, sampleChannels[0].length, zzfxR),
        source = audioContext.createBufferSource();

    // copy samples to buffer and setup source
    sampleChannels.forEach((c,i)=> buffer.getChannelData(i).set(c));
    source.buffer = buffer;
    source.playbackRate.value = rate;
    source.loop = loop;

    // create and connect gain node (createGain is more widley spported then GainNode construtor)
    const gainNode = audioContext.createGain();
    gainNode.gain.value = soundVolume*volume;
    gainNode.connect(audioContext.destination);

    // connect source to gain
    (
        window.StereoPannerNode ? // create pan node if possible
        source.connect(new StereoPannerNode(audioContext, {'pan':clamp(pan, -1, 1)}))
        : source
    )
    .connect(gainNode);

    // play and return sound
    source.start();
    return source;
}

///////////////////////////////////////////////////////////////////////////////
// ZzFXMicro - Zuper Zmall Zound Zynth - v1.1.8 by Frank Force

/** Generate and play a ZzFX sound
 *  <br>
 *  <br><b><a href=https://killedbyapixel.github.io/ZzFX/>Create sounds using the ZzFX Sound Designer.</a></b>
 *  @param {Array} zzfxSound - Array of ZzFX parameters, ex. [.5,.5]
 *  @return {Array} - Array of audio samples
 *  @memberof Audio */
const zzfx = (...zzfxSound) => playSamples([zzfxG(...zzfxSound)]);

/** Sample rate used for all ZzFX sounds
 *  @default 44100
 *  @memberof Audio */
const zzfxR = 44100;

/** Generate samples for a ZzFX sound
 *  @memberof Audio */
function zzfxG
(
    // parameters
    volume = 1, randomness = .05, frequency = 220, attack = 0, sustain = 0,
    release = .1, shape = 0, shapeCurve = 1, slide = 0, deltaSlide = 0,
    pitchJump = 0, pitchJumpTime = 0, repeatTime = 0, noise = 0, modulation = 0,
    bitCrush = 0, delay = 0, sustainVolume = 1, decay = 0, tremolo = 0
)
{
    // init parameters
    let PI2 = PI*2, startSlide = slide *= 500 * PI2 / zzfxR / zzfxR, b=[],
        startFrequency = frequency *= (1 + randomness*rand(-1,1)) * PI2 / zzfxR,
        t=0, tm=0, i=0, j=1, r=0, c=0, s=0, f, length;

    // scale by sample rate
    attack = attack * zzfxR + 9; // minimum attack to prevent pop
    decay *= zzfxR;
    sustain *= zzfxR;
    release *= zzfxR;
    delay *= zzfxR;
    deltaSlide *= 500 * PI2 / zzfxR**3;
    modulation *= PI2 / zzfxR;
    pitchJump *= PI2 / zzfxR;
    pitchJumpTime *= zzfxR;
    repeatTime = repeatTime * zzfxR | 0;

    // generate waveform
    for (length = attack + decay + sustain + release + delay | 0;
        i < length; b[i++] = s)
    {
        if (!(++c%(bitCrush*100|0)))                      // bit crush
        {
            s = shape? shape>1? shape>2? shape>3?         // wave shape
                Math.sin((t%PI2)**3) :                    // 4 noise
                max(min(Math.tan(t),1),-1):               // 3 tan
                1-(2*t/PI2%2+2)%2:                        // 2 saw
                1-4*abs(Math.round(t/PI2)-t/PI2):         // 1 triangle
                Math.sin(t);                              // 0 sin

            s = (repeatTime ?
                    1 - tremolo + tremolo*Math.sin(PI2*i/repeatTime) // tremolo
                    : 1) *
                sign(s)*(abs(s)**shapeCurve) *            // curve 0=square, 2=pointy
                volume * soundVolume * (                  // envelope
                i < attack ? i/attack :                   // attack
                i < attack + decay ?                      // decay
                1-((i-attack)/decay)*(1-sustainVolume) :  // decay falloff
                i < attack  + decay + sustain ?           // sustain
                sustainVolume :                           // sustain volume
                i < length - delay ?                      // release
                (length - i - delay)/release *            // release falloff
                sustainVolume :                           // release volume
                0);                                       // post release

            s = delay ? s/2 + (delay > i ? 0 :            // delay
                (i<length-delay? 1 : (length-i)/delay) *  // release delay
                b[i-delay|0]/2) : s;                      // sample delay
        }

        f = (frequency += slide += deltaSlide) *          // frequency
            Math.cos(modulation*tm++);                    // modulation
        t += f - f*noise*(1 - (Math.sin(i)+1)*1e9%2);     // noise

        if (j && ++j > pitchJumpTime)       // pitch jump
        {
            frequency += pitchJump;         // apply pitch jump
            startFrequency += pitchJump;    // also apply to start
            j = 0;                          // reset pitch jump time
        }

        if (repeatTime && !(++r % repeatTime)) // repeat
        {
            frequency = startFrequency;     // reset frequency
            slide = startSlide;             // reset slide
            j = j || 1;                     // reset pitch jump time
        }
    }

    return b;
}

/**
 * LittleJS WebGL Interface
 * <br> - All webgl used by the engine is wrapped up here
 * <br> - For normal stuff you won't need to see or call anything in this file
 * <br> - For advanced stuff there are helper functions to create shaders, textures, etc
 * <br> - Can be disabled with glEnable to revert to 2D canvas rendering
 * <br> - Batches sprite rendering on GPU for incredibly fast performance
 * <br> - Sprite transform math is done in the shader where possible
 * @namespace WebGL
 */


/** The WebGL canvas which appears above the main canvas and below the overlay canvas
 *  @type {HTMLCanvasElement}
 *  @memberof WebGL */
let glCanvas;

/** 2d context for glCanvas
 *  @type {WebGLRenderingContext}
 *  @memberof WebGL */
let glContext;

/** Main tile sheet texture automatically loaded by engine
 *  @type {WebGLTexture}
 *  @memberof WebGL */
let glTileTexture;

// WebGL internal variables not exposed to documentation
let glActiveTexture, glShader, glPositionData, glColorData, glBatchCount, glBatchAdditive, glAdditive;

///////////////////////////////////////////////////////////////////////////////

// Init WebGL, called automatically by the engine
function glInit()
{
    if (!glEnable) return;

    // create the canvas and tile texture
    glCanvas = document.createElement('canvas');
    glContext = glCanvas.getContext('webgl', {antialias: false});
    glCanvas.style = styleCanvas;
    glTileTexture = glCreateTexture(tileImage);

    // some browsers are much faster without copying the gl buffer so we just overlay it instead
    glOverlay && document.body.appendChild(glCanvas);

    // setup vertex and fragment shaders
    glShader = glCreateProgram(
        'precision highp float;'+     // use highp for better accuracy
        'uniform mat4 m;'+            // transform matrix
        'attribute vec2 p,t;'+        // position, uv
        'attribute vec4 c,a;'+        // color, additiveColor
        'varying vec2 v;'+            // return uv
        'varying vec4 d,e;'+          // return color, additiveColor
        'void main(){'+               // shader entry point
        'gl_Position=m*vec4(p,1,1);'+ // transform position
        'v=t;d=c;e=a;'+               // pass stuff to fragment shader
        '}'                           // end of shader
        ,
        'precision highp float;'+           // use highp for better accuracy
        'varying vec2 v;'+                  // uv
        'varying vec4 d,e;'+                // color, additiveColor
        'uniform sampler2D s;'+             // texture
        'void main(){'+                     // shader entry point
        'gl_FragColor=texture2D(s,v)*d+e;'+ // modulate texture by color plus additive
        '}'                                 // end of shader
    );

    // init buffers
    const glVertexData = new ArrayBuffer(gl_MAX_BATCH * gl_VERTICES_PER_QUAD * gl_VERTEX_BYTE_STRIDE);
    glCreateBuffer(gl_ARRAY_BUFFER, glVertexData.byteLength, gl_DYNAMIC_DRAW);
    glPositionData = new Float32Array(glVertexData);
    glColorData = new Uint32Array(glVertexData);

    // setup the vertex data array
    let offset = glBatchCount = 0;
    const initVertexAttribArray = (name, type, typeSize, size, normalize=0)=>
    {
        const location = glContext.getAttribLocation(glShader, name);
        glContext.enableVertexAttribArray(location);
        glContext.vertexAttribPointer(location, size, type, normalize, gl_VERTEX_BYTE_STRIDE, offset);
        offset += size*typeSize;
    }
    initVertexAttribArray('p', gl_FLOAT, 4, 2);            // position
    initVertexAttribArray('t', gl_FLOAT, 4, 2);            // texture coords
    initVertexAttribArray('c', gl_UNSIGNED_BYTE, 1, 4, 1); // color
    initVertexAttribArray('a', gl_UNSIGNED_BYTE, 1, 4, 1); // additiveColor
}

/** Set the WebGl blend mode, normally you should call setBlendMode instead
 *  @param {Boolean} [additive=0]
 *  @memberof WebGL */
function glSetBlendMode(additive)
{
    if (!glEnable) return;

    // setup blending
    glAdditive = additive;
}

/** Set the WebGl texture, not normally necessary unless multiple tile sheets are used
 *  <br> - This may also flush the gl buffer resulting in more draw calls and worse performance
 *  @param {WebGLTexture} [texture=glTileTexture]
 *  @memberof WebGL */
function glSetTexture(texture=glTileTexture)
{
    if (!glEnable) return;

    // must flush cache with the old texture to set a new one
    if (texture != glActiveTexture)
        glFlush();

    glContext.bindTexture(gl_TEXTURE_2D, glActiveTexture = texture);
}

/** Compile WebGL shader of the given type, will throw errors if in debug mode
 *  @param {String} source
 *  @param          type
 *  @return {WebGLShader}
 *  @memberof WebGL */
function glCompileShader(source, type)
{
    if (!glEnable) return;

    // build the shader
    const shader = glContext.createShader(type);
    glContext.shaderSource(shader, source);
    glContext.compileShader(shader);

    return shader;
}

/** Create WebGL program with given shaders
 *  @param {WebGLShader} vsSource
 *  @param {WebGLShader} fsSource
 *  @return {WebGLProgram}
 *  @memberof WebGL */
function glCreateProgram(vsSource, fsSource)
{
    if (!glEnable) return;

    // build the program
    const program = glContext.createProgram();
    glContext.attachShader(program, glCompileShader(vsSource, gl_VERTEX_SHADER));
    glContext.attachShader(program, glCompileShader(fsSource, gl_FRAGMENT_SHADER));
    glContext.linkProgram(program);

    return program;
}

/** Create WebGL buffer
 *  @param bufferType
 *  @param size
 *  @param usage
 *  @return {WebGLBuffer}
 *  @memberof WebGL */
function glCreateBuffer(bufferType, size, usage)
{
    if (!glEnable) return;

    // build the buffer
    const buffer = glContext.createBuffer();
    glContext.bindBuffer(bufferType, buffer);
    glContext.bufferData(bufferType, size, usage);
    return buffer;
}

/** Create WebGL texture from an image and set the texture settings
 *  @param {Image} image
 *  @return {WebGLTexture}
 *  @memberof WebGL */
function glCreateTexture(image)
{
    if (!glEnable || !image || !image.width) return;

    // build the texture
    const texture = glContext.createTexture();
    glContext.bindTexture(gl_TEXTURE_2D, texture);
    glContext.texImage2D(gl_TEXTURE_2D, 0, gl_RGBA, gl_RGBA, gl_UNSIGNED_BYTE, image);

    // use point filtering for pixelated rendering
    glContext.texParameteri(gl_TEXTURE_2D, gl_TEXTURE_MIN_FILTER, cavasPixelated ? gl_NEAREST : gl_LINEAR);
    glContext.texParameteri(gl_TEXTURE_2D, gl_TEXTURE_MAG_FILTER, cavasPixelated ? gl_NEAREST : gl_LINEAR);
    glContext.texParameteri(gl_TEXTURE_2D, gl_TEXTURE_WRAP_S, gl_CLAMP_TO_EDGE);
    glContext.texParameteri(gl_TEXTURE_2D, gl_TEXTURE_WRAP_T, gl_CLAMP_TO_EDGE);
    return texture;
}

// called automatically by engine before render
function glPreRender(width, height, cameraX, cameraY, cameraScale)
{
    if (!glEnable) return;

    // clear and set to same size as main canvas
    glContext.viewport(0, 0, glCanvas.width = width, glCanvas.height = height);
    glContext.clear(gl_COLOR_BUFFER_BIT);

    // set up the shader
    glContext.bindTexture(gl_TEXTURE_2D, glActiveTexture = glTileTexture);
    glContext.useProgram(glShader);
    glSetBlendMode();

    // build the transform matrix
    const sx = 2 * cameraScale / width;
    const sy = 2 * cameraScale / height;
    glContext.uniformMatrix4fv(glContext.getUniformLocation(glShader, 'm'), 0,
        new Float32Array([
            sx, 0, 0, 0,
            0, sy, 0, 0,
            1, 1, -1, 1,
            -1-sx*cameraX, -1-sy*cameraY, 0, 0
        ])
    );
}

/** Draw all sprites and clear out the buffer, called automatically by the system whenever necessary
 *  @memberof WebGL */
function glFlush()
{
    if (!glEnable || !glBatchCount) return;

    const destBlend = glBatchAdditive ? gl_ONE : gl_ONE_MINUS_SRC_ALPHA;
    glContext.blendFuncSeparate(gl_SRC_ALPHA, destBlend, gl_ONE, destBlend);
    glContext.enable(gl_BLEND);

    // draw all the sprites in the batch and reset the buffer
    glContext.bufferSubData(gl_ARRAY_BUFFER, 0,
        glPositionData.subarray(0, glBatchCount * gl_VERTICES_PER_QUAD * gl_INDICIES_PER_VERT));
    glContext.drawArrays(gl_TRIANGLES, 0, glBatchCount * gl_VERTICES_PER_QUAD);
    glBatchCount = 0;
    glBatchAdditive = glAdditive;
}

/** Draw any sprites still in the buffer, copy to main canvas and clear
 *  @param {CanvasRenderingContext2D} context
 *  @param {Boolean} [forceDraw=0]
 *  @memberof WebGL */
function glCopyToContext(context, forceDraw)
{
    if (!glEnable || !glBatchCount && !forceDraw) return;

    glFlush();

    // do not draw in overlay mode because the canvas is visible
    if (!glOverlay || forceDraw)
        context.drawImage(glCanvas, 0, 0);
}

/** Add a sprite to the gl draw list, used by all gl draw functions
 *  @param x
 *  @param y
 *  @param sizeX
 *  @param sizeY
 *  @param angle
 *  @param uv0X
 *  @param uv0Y
 *  @param uv1X
 *  @param uv1Y
 *  @param [rgba=0xffffffff]
 *  @param [rgbaAdditive=0]
 *  @memberof WebGL */
function glDraw(x, y, sizeX, sizeY, angle, uv0X, uv0Y, uv1X, uv1Y, rgba=0xffffffff, rgbaAdditive=0)
{
    if (!glEnable) return;

    // flush if there is no room for more verts or if different blend mode
    if (glBatchCount == gl_MAX_BATCH || glBatchAdditive != glAdditive)
        glFlush();

    // prepare to create the verts from size and angle
    const c = Math.cos(angle)/2, s = Math.sin(angle)/2;
    const cx = c*sizeX, cy = c*sizeY, sx = s*sizeX, sy = s*sizeY;

    // setup 2 triangles to form a quad
    let offset = glBatchCount++ * gl_VERTICES_PER_QUAD * gl_INDICIES_PER_VERT;

    // vertex 0
    glPositionData[offset++] = x - cx - sy;
    glPositionData[offset++] = y - cy + sx;
    glPositionData[offset++] = uv0X; glPositionData[offset++] = uv1Y;
    glColorData[offset++]    = rgba; glColorData[offset++]    = rgbaAdditive;

    // vertex 1
    glPositionData[offset++] = x + cx + sy;
    glPositionData[offset++] = y + cy - sx;
    glPositionData[offset++] = uv1X; glPositionData[offset++] = uv0Y;
    glColorData[offset++]    = rgba; glColorData[offset++]    = rgbaAdditive;

    // vertex 2
    glPositionData[offset++] = x - cx + sy;
    glPositionData[offset++] = y + cy + sx;
    glPositionData[offset++] = uv0X; glPositionData[offset++] = uv0Y;
    glColorData[offset++]    = rgba; glColorData[offset++]    = rgbaAdditive;

    // vertex 0
    glPositionData[offset++] = x - cx - sy;
    glPositionData[offset++] = y - cy + sx;
    glPositionData[offset++] = uv0X; glPositionData[offset++] = uv1Y;
    glColorData[offset++]    = rgba; glColorData[offset++]    = rgbaAdditive;

    // vertex 3
    glPositionData[offset++] = x + cx - sy;
    glPositionData[offset++] = y - cy - sx;
    glPositionData[offset++] = uv1X; glPositionData[offset++] = uv1Y;
    glColorData[offset++]    = rgba; glColorData[offset++]    = rgbaAdditive;

    // vertex 1
    glPositionData[offset++] = x + cx + sy;
    glPositionData[offset++] = y + cy - sx;
    glPositionData[offset++] = uv1X; glPositionData[offset++] = uv0Y;
    glColorData[offset++]    = rgba; glColorData[offset++]    = rgbaAdditive;
}

///////////////////////////////////////////////////////////////////////////////
// store gl constants as integers so their name doesn't use space in minifed
const
gl_ONE = 1,
gl_TRIANGLES = 4,
gl_SRC_ALPHA = 770,
gl_ONE_MINUS_SRC_ALPHA = 771,
gl_BLEND = 3042,
gl_TEXTURE_2D = 3553,
gl_UNSIGNED_BYTE = 5121,
gl_FLOAT = 5126,
gl_RGBA = 6408,
gl_NEAREST = 9728,
gl_LINEAR = 9729,
gl_TEXTURE_MAG_FILTER = 10240,
gl_TEXTURE_MIN_FILTER = 10241,
gl_TEXTURE_WRAP_S = 10242,
gl_TEXTURE_WRAP_T = 10243,
gl_COLOR_BUFFER_BIT = 16384,
gl_CLAMP_TO_EDGE = 33071,
gl_ARRAY_BUFFER = 34962,
gl_DYNAMIC_DRAW = 35048,
gl_FRAGMENT_SHADER = 35632,
gl_VERTEX_SHADER = 35633,
gl_COMPILE_STATUS = 35713,
gl_LINK_STATUS = 35714,

// constants for batch rendering
gl_VERTICES_PER_QUAD = 6,
gl_INDICIES_PER_VERT = 6,
gl_MAX_BATCH = 1<<16,
gl_VERTEX_BYTE_STRIDE = (4 * 2) * 2 + (4) * 2; // vec2 * 2 + (char * 4) * 2
