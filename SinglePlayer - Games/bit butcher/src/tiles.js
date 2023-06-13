const TILE_SIZE = window.TILE_SIZE || 24;
let ctx;
let tileCount = 0;
let ri = randInt;

function getTileX() {
    return TILE_SIZE * (++tileCount);
}

const rect = (r, g, b, x, y, q = TILE_SIZE, w = TILE_SIZE) => {
    ctx.fillStyle = `#${r}${g}${b}`;
    ctx.fillRect(x, y, q, w);
};

function drawTerrain(r, g, b) {
    const x = getTileX(),
        y = 0;
    rect(r, g, b, x, y);
    [6, 5, 4, 3, 3, 2, 2, 2, 1, 1, 1, 1, 1].forEach((n) => {
        rect(
            ri(r, 6),
            ri(g, 6),
            ri(b, 6),
            x + ri(TILE_SIZE - n),
            y + ri(TILE_SIZE - n),
            n,
            n,
        );
    });
    return x;
}

function drawRockyTerrain(r, g, b) {
    const x = drawTerrain(r, g, b),
        y = 0;
    [14, 10, 6, 3, 3, 3, 2, 2].forEach((n) => rect(
        ri(7, 9), ri(7, 9), 'a',
        x + ri(TILE_SIZE - n),
        y + ri(TILE_SIZE - n),
        n,
        n,
    ));
}

function drawStoneWall() {
    const x = getTileX(),
        y = 0;
    rect(5, 5, 6, x, y);
    [8, 8, 8, 8, 8, 6, 6, 6, 6, 4].forEach((n) => rect(
        ri(8, 9), 8, 'a',
        x + ri(TILE_SIZE - n),
        y + ri(TILE_SIZE - (n/2)),
        n,
        n/2,
    ));
}

function drawTiles(doc) {
    const canvas = doc.createElement('canvas');
    canvas.width = 30 * TILE_SIZE;
    canvas.height = 2 * TILE_SIZE;
    // doc.body.appendChild(canvas);
    ctx = canvas.getContext('2d');
    canvas.style = styleCanvas;
    ctx.drawImage(tileImage, 1000, 1000);
    // 0
    rect('f', 0, 0, 0, 0, 12, 12);
    rect('f', 'f', 0, 12, 12, 12, 12);
    drawTerrain(2, 4, 3); // 1
    drawTerrain(2, 4, 2); // 2
    drawTerrain(3, 4, 3); // 3
    drawTerrain(4, 3, 3); // 4
    ctx.fillStyle = '#fff';
    ctx.font = '20px serif';
    [ // Tile indices:
        '🔪', // 5
        '🩸', // 6
        '🍖', // 7
        '🌿', // 8 
        '💕', // 9
        '❕', // 10
        '💢', // 11
        '💀', // 12
        '🍷', // 13
        '🍲', // 14
        '⛏️', // 15
        '🪓', // 16
        '🔨', // 17
        '🕯️', // 18
        '🧱', // 19
        '', // 20
        '', // 21
        '', // 22
        '', // 23
        '', // 24
    ].forEach((emoji) => {
        ctx.fillText(emoji, getTileX() - 1, 20);
    });
    drawRockyTerrain(3, 4, 3); // 25
    drawRockyTerrain(4, 3, 3); // 26
    drawTerrain(3, 4, 2); // 27 -- Between 2 and 3
    drawTerrain(3, 3, 3); // 28 -- Between 3 and 4
    drawStoneWall(); // 29
    // const x = getTileX();
    // rect(3, 3, 3, x, 0);
    // Tile incides 5, 6, 7, 8, 9
    // ctx.fillText('🔪🩸🍖🌿💕', x - 1, 19.5);
    // Test
    // ctx.fillText('🦀🍖🥩🍗💀🔪', 0, 44);
    // ctx.fillText('🔥', 0, 22);
    return canvas.toDataURL();
}

function loadTileImageSource(src) {
    return new Promise((resolve) => {
        const t = new Image(); // The tile image
        t.onload = () => resolve(drawTiles(document));
        if (src) t.src = src;
        else t.onload();
    });
}

export { loadTileImageSource };
