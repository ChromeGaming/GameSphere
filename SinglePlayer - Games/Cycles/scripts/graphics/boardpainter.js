function BoardPainter(ctx, view) {
    let tilePainter = new TilePainter();

    this.paint = function (data) {
        tilePainter.recalculate(view.width);
        drawBoard(data.board, data.offset);
        drawMessage(data.message);
    }

    function drawBoard(board, offset) {
        board.forEach(function (element, pos) {
            if (pos.y === offset.row) {
                tilePainter.paintTile(ctx, pos.x + offset.value, pos.y, element);
                tilePainter.paintTile(ctx, pos.x + offset.value - board.size, pos.y, element);
                tilePainter.paintTile(ctx, pos.x + offset.value + board.size, pos.y, element);
            } else if (pos.x === offset.column) {
                tilePainter.paintTile(ctx, pos.x, pos.y + offset.value, element);
                tilePainter.paintTile(ctx, pos.x, pos.y + offset.value - board.size, element);
                tilePainter.paintTile(ctx, pos.x, pos.y + offset.value + board.size, element);
            } else {
                tilePainter.paintTile(ctx, pos.x, pos.y - element.offset, element);
            }
        });
    };

    function drawMessage(message) {
        if(message.visible) {
            ctx.textBaseline = 'middle';
            ctx.textAlign = "center";
            ctx.fillStyle = message.color;
            ctx.font = 'bold ' + message.size * view.height / 10  + 'px sans-serif';
            ctx.strokeStyle = 'black';
            ctx.lineJoin = "miter";
            ctx.miterLimit = 2;
            ctx.lineWidth = view.height / 30;
            ctx.strokeText(message.text, view.width / 2, view.height / 2);
            ctx.fillText(message.text, view.width /2, view.height / 2);
        }
    }
}
