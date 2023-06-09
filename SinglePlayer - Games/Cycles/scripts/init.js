window.onload = function () {
    let view = setupView();
    let game = new Game(view);
    game.start();
}

function setupView() {
    let size = {
        top: 2,
        mid: 7,
        bot: 2
    }
    size.sum = size.top + size.mid + size.bot;
    let ratio = size.mid / size.sum;
    let canvas = {
        top: document.getElementById('a'),
        mid: document.getElementById('b'),
        bot: document.getElementById('c'),
        back: document.getElementById('d')
    }

    updateOnResize();
    window.addEventListener('resize', updateOnResize);

    return canvas;

    function updateOnResize() {
        let unit;
        let width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
        let height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

        if (height * ratio <= width) {
            unit = height / size.sum;
        } else {
            unit = width / size.mid;
        }

        canvas.top.width = size.mid * unit;
        canvas.mid.width = size.mid * unit * 0.95;
        canvas.back.width = size.mid * unit;
        canvas.bot.width = size.mid * unit;

        canvas.top.height = size.top * unit;
        canvas.mid.height = size.mid * unit * 0.95;
        canvas.back.height = size.mid * unit;
        canvas.bot.height = size.bot * unit;
    }
}
