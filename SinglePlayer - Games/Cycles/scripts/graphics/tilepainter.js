function TilePainter() {
    let size,
        outline,
        width,
        height,
        shadow,
        radius,
        line = {
            horizontal: {},
            vertical: {}
        };

    this.recalculate = function (canvasSize) {
        size = canvasSize / Game.BOARD_SIZE;
        outline = size / 20;
        width = size - outline * 2;
        height = width * 6 / 7;
        shadow = width / 7;
        radius = size / 8;

        let xThickness = width / 6,
            yThickness = xThickness * 6 / 7;

        line.horizontal.x = width / 2;
        line.horizontal.y = 0;
        line.horizontal.thickness = yThickness;

        line.vertical.x = 0;
        line.vertical.y = height / 2;
        line.vertical.thickness = xThickness;
    };

    this.paintTile = function (ctx, x, y, tile) {
        x *= size;
        y *= size;
        if (isVisible(x, y)) {
            paintOutline(ctx, x, y);
            x += outline;
            y += outline;
            paintBase(ctx, x, y, tile);
            paintBlocker(ctx, x, y, tile);
            paintPattern(ctx, x, y, tile);
        }
    };

    function isVisible(x, y) {
        let min = -size,
            max = size * 7;
        return (x >= min) && (x <= max) && (y >= min) && (y <= max);
    }

    function paintOutline(ctx, x, y) {
        ctx.fillStyle = '#181818';
        Graphics.roundRect(ctx, x, y, size, size, radius);
    }

    function paintBase(ctx, x, y, tile) {
        ctx.fillStyle = getSecondaryColor(tile);
        Graphics.roundRect(ctx, x, y + shadow, width, height, radius);
        ctx.fillStyle = getPrimaryColor(tile);
        Graphics.roundRect(ctx, x, y, width, height, radius);
    }

    function getPrimaryColor(tile) {
        if (tile.isBlocker()) {
            return '#444';
        } else if (tile.isGlitch()) {
            return 'hsl(' + tile.hue + ', 80%, 50%)';
        } else {
            return '#F9ECC0';
        }
    }

    function getSecondaryColor(tile) {
        if (tile.isBlocker()) {
            return '#333';
        } else if (tile.isGlitch()) {
            return 'hsl(' + tile.hue + ', 100%, 35%)';
        } else {
            return '#B0A274';
        }
    }

    function paintPattern(ctx, x, y, tile) {
        if (tile.isEmpty())
            return;

        if (tile.has('n')) {
            drawLine(line.horizontal.x, 0, 'vertical', tile.hasCycle('n'));
        }
        if (tile.has('w')) {
            drawLine(0, line.vertical.y, 'horizontal', tile.hasCycle('w'));
        }
        if (tile.has('s')) {
            drawLine(line.horizontal.x, line.vertical.y + line.horizontal.y, 'vertical', tile.hasCycle('s'));
        }
        if (tile.has('e')) {
            drawLine(line.horizontal.x + line.vertical.x, line.vertical.y, 'horizontal', tile.hasCycle('e'));
        }
        drawCenterPin(x + width / 2, y + height / 2, tile.isPartOfCycle());

        function drawLine(x0, y0, direction, isCycle) {
            ctx.strokeStyle = getLineColor(tile, isCycle);
            ctx.lineWidth = isCycle ? line[direction].thickness * 1.5 : line[direction].thickness;

            ctx.beginPath();
            ctx.moveTo(x + x0, y + y0);
            ctx.lineTo(x + x0 + line[direction].x, y + y0 + line[direction].y);
            ctx.stroke();
        }

        function drawCenterPin(x, y, isCycle) {
            let width = isCycle ? line.vertical.thickness * 1.5 : line.vertical.thickness;
            let height = isCycle ? line.horizontal.thickness * 1.5 : line.horizontal.thickness;
            ctx.fillStyle = getLineColor(tile, isCycle);

            ctx.beginPath();
            ctx.ellipse(x, y, width / Math.sqrt(2), height / Math.sqrt(2), 0, 0, 2 * Math.PI);
            ctx.fill();
        }

        function getLineColor(tile, isCycle) {
            if(isCycle)
                return Graphics.cycleColor;
            if(tile.isBlocker())
                return 'white';
            return 'black';
        }
    }

    function paintBlocker(ctx, x, y, tile) {
        if(!tile.isBlocker())
            return;

        ctx.strokeStyle = '#e00';
        ctx.lineWidth = line.vertical.thickness * 1.2;

        ctx.beginPath();
        ctx.moveTo(x + width / 5, y + height / 5);
        ctx.lineTo(x + width * 4 / 5, y + + height * 4 / 5);
        ctx.moveTo(x + width * 4 / 5, y + height / 5);
        ctx.lineTo(x + width / 5, y + + height * 4 / 5);
        ctx.stroke();
    }
}
