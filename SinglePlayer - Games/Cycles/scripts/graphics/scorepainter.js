function ScorePainter(ctx, view) {

    this.paint = function (data) {
        let scoreSize = view.height / 2;
        let comboSize = view.height / 5;
        initStroke();

        ctx.textBaseline = 'middle';
        ctx.textAlign = "center";

        ctx.fillStyle = 'white';
        ctx.font = 'bold ' + scoreSize + 'px monospace';
        drawStroked(scoreText(data.score), view.width / 2, view.height * 4 / 10);
        ctx.fillStyle = data.combo.color;
        ctx.font = 'bold ' + comboSize + 'px sans-serif';
        drawStroked(comboText(data.combo.current), view.width / 2, view.height * 4 / 5);
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

    function scoreText(score) {
        return score.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    function comboText(combo) {
        if(combo < 2)
            return '';

        return 'COMBO X' + combo;
    }
}
