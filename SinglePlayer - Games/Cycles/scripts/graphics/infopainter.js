function InfoPainter(ctx, view) {

    this.paint = function (data) {
        let metrics = setup();
        initStroke();
        drawDescription(metrics, data.level.text);
        if (data.level.hasOwnProperty('timeLeft')) {
            drawNumber(metrics, data.level.timeLeft, 'TIME LEFT');
        } else if (data.level.hasOwnProperty('turnsLeft')) {
            drawNumber(metrics, data.level.turnsLeft, 'TURNS LEFT');
        }
        drawRestartButton();
        drawEraseProgressButton();
    }

    function drawRestartButton() {
        let size = view.height / 2.5,
            x = view.height / 5 + size / 2,
            y = view.height - x;
        ctx.fillStyle = '#888';
        ctx.font = 'bold ' + size + 'px sans-serif';
        ctx.fillText(String.fromCharCode(8634), x, y);
    }

    function drawEraseProgressButton() {
        let size = view.height / 2.5,
            offset = view.height / 5 + size / 2,
            x = view.width - offset,
            y = view.height - offset;
        ctx.fillStyle = '#888';
        ctx.font = 'bold ' + size + 'px sans-serif';
        ctx.fillText('x', x, y);
    }

    function drawStroked(text, x, y) {
        ctx.strokeText(text, x, y);
        ctx.fillText(text, x, y);
    }

    function initStroke() {
        ctx.strokeStyle = 'black';
        ctx.lineJoin = "miter";
        ctx.miterLimit = 2;
        ctx.lineWidth = view.height / 15;
    }

    function drawDescription(metrics, text) {
        ctx.font = 'bold ' + metrics.descriptionSize + 'px sans-serif';
        drawStroked(text, view.width / 2, metrics.descriptionOffset);
    }

    function drawNumber(metrics, number, type) {
        ctx.font = 'bold ' + metrics.numberSize + 'px sans-serif';
        ctx.fillText(number, view.width / 2, metrics.numberOffset);
        ctx.font = 'bold ' + metrics.typeSize + 'px sans-serif';
        ctx.fillText(type, view.width / 2, metrics.typeOffset);
    }

    function setup() {
        ctx.fillStyle = 'white';
        ctx.textBaseline = 'middle';
        ctx.textAlign = "center";
        return {
            descriptionSize: view.height / 5,
            descriptionOffset: view.height / 5,
            numberSize: view.height * 2 / 5,
            numberOffset: view.height * 3 / 5,
            typeSize: view.height / 10,
            typeOffset: view.height * 85 / 100
        }
    }
}
