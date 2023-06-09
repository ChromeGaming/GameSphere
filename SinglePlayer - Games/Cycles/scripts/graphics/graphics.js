function Graphics(view) {
    let ctx = {
            top: view.top.getContext('2d'),
            mid: view.mid.getContext('2d'),
            bot: view.bot.getContext('2d')
        },

        boardPainter = new BoardPainter(ctx.mid, view.mid),
        scorePainter = new ScorePainter(ctx.top, view.top),
        infoPainter = new InfoPainter(ctx.bot, view.bot);

    this.update = function (data) {
        clearAll();
        boardPainter.paint(data);
        scorePainter.paint(data);
        infoPainter.paint(data);
    };

    function clearAll() {
        clear('mid');
        clear('bot');
        clear('top');
    }

    function clear(location) {
        ctx[location].fillStyle = '#333';
        ctx[location].fillRect(0, 0, view[location].width, view[location].height);
    };
}

Graphics.getRainbow = function () {
    return 'hsl(' + Math.random() * 360 + ', 100%, 60%)';
}

Graphics.roundRect = function (ctx, x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
    ctx.fill();
}
