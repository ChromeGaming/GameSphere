const game = new Game(
    new Draw($("#game").getContext("2d")),
    [
        "M3,7,7,6,3|H4,6|D5,6|W6,6|#The door is open.|#I have to escape!",
        "M4,8,6,3,8,1,2,3,4|H4,7|D7,2|#I can jump up walls!",
        "M0,0,10,10,0|M1,1,9,9,1,3,7,7,3,5,4,6,6,4,2,8,8,2,1|H1,0|D2,0,5,5|#The door is locked.|#I need a key!",
        "M0,10,10,0,0|M2,9,6,2,8,1,4,8,2|G7,11|H0,9|D7,0,3,7|#This wall has no texture!|#Is it a glitch?",
        "M0,0,10,10,0|M2,2,4,6,6,2,8,8,2|H4,9,1|D2,9,3.8,5|B6,9|#Uh-oh! The Sentinel.|#Can't jump through him.",
        "M0,0,1,2,4,6,5,1,2,0,6,4,7,2,9,1,7,0,10,3,8,4,10,7,8,9,9,8,10,10,7,6,9,5,6,10,0,7,3,3,1,4,2,6,1,5,0|M1,8,4,7,5,9,1|H8,9,1|D6.8,0,1.2,5|#I can get out through|#the Libraryinth.",
        "M0,10,10,0,0|M1,1,3,3,4,1,6,3,7,1,9,5,8,9,7,4,3,9,2,5,1|M4,6,6,8,4|H1,0|D4,0,5,5|E1,5|E8,5|#What was that noise...",
        "M0,0,10,10,0|M1,1,9,5,8,2,5,3,7,7,3,5,4,6,6,4,3,3,4,2,2,8,8,6,9,9,1|M6,0,7,1,6|M7,6,8,7,7|H4,0,1|D5,5,7,0|G26,19|#Oh no, dead-end!",
        "M0,10,10,7,1,6,10,3,1,2,10,1,0,4,9,5,0,8,9,9,0|C3,9|C5,9|C7,9|C3,5|C5,5|C7,5|C3,1|C5,1|C7,1|H1,9|D0,9,9,1|#Through the Basement.|#Jump over the cogs.",
        "M0,0,10,10,0|M1,2,4,3,1|M6,2,9,3,6|M1,4,2,6,1|M3,4,7,6,3|M8,4,9,6,8|M1,7,3,8,7,7,9,8,8,9,2,8,1|H2,1|D7,1,5,9|E2,3|E7,3|#The Infected Ones.|#They got me!",
        "M0,10,10,0,0|M1,1,9,2,6,8,9,9,1,8,4,2,1|G5,9,11,15|H6,7|D3,7,8,0|C3,5,0,5|C6,5,9,5|C3,0|C6,0|E1,0|#Almost there...|#Where's the exit?",
        "M0,2,1,1,2,2,3,1,4,2,5,1,6,2,7,1,8,2,9,1,10,9,9,8,8,10,7,8,6,10,5,8,4,10,3,8,2,10,1,8,0,7,1,6,2,7,3,6,4,7,5,6,6,7,7,6,8,7,9,3,8,5,7,3,6,5,5,3,4,5,3,3,2,5,1,3,0|H8,7|D-.2,2,-.2,7|C1,4|C3,4|C5,4|C7,4|C1,9|C3,9|C5,9|C7,9|#Oops, wrong turn.|#Great. More cogs.",
        "M0,0,10,2,8,3,10,4,9,5,10,7,8,8,10,10,0,8,1,7,0,5,2,4,0,2,1,1,0|M2,2,4,3,2|M5,3,7,4,5|M3,5,5,6,3|M6,5,8,6,6|M2,8,4,9,2|M5,8,7,9,5|H1,9|D8,9,0,0|E9,3|E0,3|#Too quiet. I have a bad|#feeling about this.",
        "M0,0,10,10,8,2,1,6,7,8,6,7,5,8,1,9,7,10,0|H8,9|D6,9,5,6|C8,8|C9,7|C8,6|C9,5|C8,4|C9,3|C8,2|C9,1|E6,7|#Double trouble.|#Even better.",
        "M0,10,2,2,4,10,10,4,9,2,10,0,8,8,6,0,0,2,1,4,0|H0,9|D-.2,1,9.2,1|C2,1,5,1|C4,9,7,9|#The Workshop.|#Might be tricky.",
        "M0,0,10,10,0|M1,3,2,2,3,1,7,2,8,3,9,7,8,8,7,9,6,7,7,6,8,4,7,3,6,2,4,3,3,4,2,6,3,7,4,9,3,8,2,7,1|M4,4,6,6,4|H4,0|D5,0,4,3|C2,1,0,1|C7,1,9,1|C1,7,1,9|C8,7,8,9|#Hope I get out|#in one piece.",
        "M0,0,2,1,8,0,10,2,9,8,10,10,8,9,2,10,0,8,1,2,0|M2,2,4,3,3,5,2|M5,2,8,4,7,3,5|M2,6,3,7,5,8,2|M7,5,8,8,6,7,7|H0,9|D9.2,9,-.2,1|B9,1|#The Sentinel is on my|#track. Gotta hurry!",
        "M0,0,3,2,4,0,5,1,6,0,9,2,10,3,9,5,10,6,9,8,10,9,9,10,6,8,5,10,4,9,3,10,0|M1,1,2,3,1|M1,4,2,6,1|M1,7,2,9,1|M3,3,4,5,3|M3,6,4,8,3|M5,2,6,4,5|M5,5,6,7,5|M7,1,8,3,7|M7,4,8,6,7|M7,7,8,9,7|H1,9|D5,4,7,0|C2,1.7,4,1.7|C6,5.7,8,5.7|#Jump around the Gym|#and I'll be at the Gates.",
        "M0,10,4,9,2,1,8,2,3,3,8,4,3,7,8,6,4,5,9,10,10,0,0|G5,9|H2,0|D7,6,3,9|C4,0,5,0|E5,6|B0,0|W6,6|#Final test. Tough,|#but I'm almost out.",
        "M2,4,8,6,2|H4,5|X5,5|R3,5|#Hello Mr Rodman."
    ],
    new Camera($("#cam").getContext("2d"), 300, "#420")
);

function update() {
    game.update(); 
    game.render();
    requestAnimationFrame(update);
}

on(document, "mousedown,touchstart", (e) => {
    e.preventDefault();
    game.tap();
});

on(document, "keydown", (e) => {
    if (e.keyCode == 32) {
        e.preventDefault();
        game.tap();
    }
});

on(window, "resize", () => {
    game.cam.resize();
});

new Icon($("#icon").getContext("2d")).render(function() {
    $("link[rel=apple-touch-icon]").href = this.src;
    $("link[rel=icon]").href = this.src;
});

new Sprite(game.draw).render(() => {
    game.load();
    update();
});
