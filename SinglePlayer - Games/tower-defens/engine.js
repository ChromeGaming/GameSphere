/*
 * This class controls the events concerning the user. 
 * That is the input events (mouse and keyboard) and the frame rendering.
 * The FPS and SPS parameters are respectively:
 * - FPS: the number of frames that should be shown each second.
 * - SPS: the number of times each action object should have the step method invoked each second.
 */
function FrameController(canvas, sps, fps) {
    var actionObjects = [];
    var renderObjects = [];
    var graphicsContext = canvas.getContext("2d");
    var keyMap = new Array(255);
    var mouseClicks = [];
    var stepsPerFrame = sps / fps | 0;
    var stepsCounter = 0;
    var gameLoopId = null;

    // Invokes the step method of every action object, and then, renders if it is time.
    var gameLoop = function () {
        actionObjects.forEach(function (object) {
            object.step();
        });
        if (!stepsCounter) {
            stepsCounter = stepsPerFrame;
            renderObjects.forEach(function (object) {
                object.render(graphicsContext);
            });
        } else {
            stepsCounter--;
        } 
    };
    
    // Handles the key down event.
    var onKeyDown = function (e) {
        keyMap[e.keyCode] = true;
    };

    // Handles the key up event.
    var onKeyUp = function (e) {
        keyMap[e.keyCode] = false;
    };

    // Handles the mouse button press event.
    var mouseClick = function (e) {
        var rect = canvas.getBoundingClientRect();
        mouseClicks.push({ x: e.clientX - rect.left, y: e.clientY - rect.top });
        e.preventDefault();
    };

    // Adds an object to the action objects collection.
    this.addActionObject = function (object) {
        actionObjects.push(object);
    };

    // Adds an object to the render objects collection.
    this.addRenderObject = function (object) {
        renderObjects.push(object);
    };

    // Returns true if the key with the given key code is pressed.
    this.isKeyPressed = function (keyCode) {
        return keyMap[keyCode];
    };

    // Returns the first mouse click event. 
    // If a rect is given, only events inside the rect will be considered.
    this.readMouseClick = function (rect) {
        if (!rect) return mouseClicks.shift();
        for (var i = 0; i < mouseClicks.length; i++) {
            var e = mouseClicks[i];
            if (e.x >= rect.x + rect.width || e.y >= rect.y + rect.height || e.x < rect.x || e.y < rect.y)
                continue;
            mouseClicks.splice(i, 1);
            return e;
        }
    };

    // This method is invoked before rendering the first frame, 
    // and should be overwritten to instantiate objects created by the graphics context,
    // like gradient styles.
    this.renderSetup = function (gc) {
        
    };
    
    // Starts the game loop.
    this.start = function () {
        this.renderSetup(graphicsContext);
        document.addEventListener("keydown", onKeyDown, false);
        document.addEventListener("keyup", onKeyUp, false);
        canvas.addEventListener("click", mouseClick, false);
        this.stop();
        gameLoopId = setInterval(gameLoop, 1000 / sps);
    };
    
    // Interrupts the game loop.
    this.stop = function () {
        if (!gameLoopId) return;
        clearInterval(gameLoopId);
        gameLoopId = null;
    };
}