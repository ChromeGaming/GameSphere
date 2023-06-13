var fps = 30;
var now;
var then = Date.now();
var interval = 1000 / fps;
var delta;

function draw() {

    requestAnimationFrame(draw);

    now = Date.now();
    delta = now - then;

    if (delta > interval) {
        // update time stuffs

        // Just `then = now` is not enough.
        // Lets say we set fps at 10 which means
        // each frame must take 100ms
        // Now frame executes in 16ms (60fps) so
        // the loop iterates 7 times (16*7 = 112ms) until
        // delta > interval === true
        // Eventually this lowers down the FPS as
        // 112*10 = 1120ms (NOT 1000ms).
        // So we have to get rid of that extra 12ms
        // by subtracting delta (112) % interval (100).
        // Hope that makes sense.

        then = now - (delta % interval);

        game.updateSize();

        game.update();

        game.tick++;

        if (delta >= 1000 / 15) {
            game.update();

            game.tick++;
        }
        var random1 = 0;
        var random2 = 0;
        if (random(1, 200) < game.hits) {
            random1 = random(-10, 10);
            random2 = random(-10, 10);
        }

        if (random1 != 0 || random2 != 0) {
            game.ctx.translate(random1, random2);
        }

        game.ctx.globalAlpha = 0.7;
        game.ctx.fillStyle = "#1C4145"; //1C4145
        game.ctx.fillRect(0, 0, game.canvas.width, game.canvas.height);
        game.ctx.globalAlpha = 1;
        game.render();
        if (random1 != 0 || random2 != 0) {
            game.ctx.translate(-random1, -random2);
        }
    }
}


game.init = function () {
    draw();

};