game.updateSize = function () {
    if (window.innerWidth != game.canvas.width || window.innerHeight != game.canvas.height) {
        game.canvas.width = window.innerWidth;
        game.canvas.height = window.innerHeight;
        game.canvas.style.width = window.innerWidth;
        game.canvas.style.height = window.innerHeight;
        game.canvas.style.imageRendering = "pixelated";
        game.ctx.imageSmoothingEnabled = false;
        //console.log("hello");
    }
};