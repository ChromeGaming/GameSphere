const ctx = $("#game").getContext("2d");
const form = $("#form");
const code = $("#code");
const draw = new Draw(ctx);
const game = new Game(draw, []);

function load() {
    let config = code.value.trim().replace(/[\r\n]+/gm, "|");
    $("#config").value = config;
    game.cfg[0] = config;
    game.index = 0;
    game.load();
    localStorage.setItem("editor", config);
}

function update() {
    game.update();
    game.render();
    requestAnimationFrame(update);
}

on(ctx.canvas, "mousedown", (e) => {
    e.preventDefault();
    game.tap();
});

on(form, "submit", (e) => {
    e.preventDefault();
    load();
});

new Sprite(draw).render(() => {
    let config = localStorage.getItem("editor");
    if (config) {
        code.value = config.replace(/\|/gm, "\n");
    }
    load();
    update();
});
