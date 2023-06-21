// brushes.js
function pickOne(options)
{
    let r = ~~(Math.random() * options.length);
    return options[r];
}

function makeBrush(colors)
{
    let size = 64;
    let canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    let ctx = canvas.getContext('2d');

    ctx.fillStyle = colors[0];
    ctx.fillRect(0, 0, size, size);

    for(let y = 0; y < size; y ++)
    {
        for(let x = 0; x < size; x++)
        {
            ctx.fillStyle = pickOne(colors);
            ctx.fillRect(x, y, 1, 1);
        }
    }

    let pattern = ctx.createPattern(canvas, 'repeat');
    return pattern;
}

function makeCrowdBrush()
{
    let size = 512;
    let canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    let ctx = canvas.getContext('2d');

    ctx.fillStyle = '#07f';
    ctx.fillRect(0, 0, size, size);

    let headColors = [
        '#260701', '#3d0c02', '#843722', '#af6e51', '#c69076'
    ];
    let bodyColors = [
        '#d00', '#0d0', '#00d', '#d40', '#dd4', '#04d'
    ]

    for(let y = 0; y < size; y += foot * 40)
    {
        for(let x = 0; x < size; x+= foot * 20)
        {
            ctx.fillStyle = pickOne(headColors);
            ctx.beginPath();
            ctx.arc(x, y, 3, 0, TAU, false);
            ctx.fill();
            ctx.fillStyle = pickOne(bodyColors);
            ctx.fillRect(x-2, y+1.5, 4, 9);
        }
    }
    let pattern = ctx.createPattern(canvas, 'repeat');
    return pattern;
}