var pointer = {
    x: 0,
    y: 0,
};
/*
function toggleFullScreen() {
    if (!document.fullscreenElement) {
        if (game.canvas.requestFullscreen) {
            game.canvas.requestFullscreen();
        } else if (game.canvas.mozRequestFullScreen) {
            game.canvas.mozRequestFullScreen();
        } else if (game.canvas.webkitRequestFullscreen) {
            game.canvas.webkitRequestFullscreen();
        } else if (game.canvas.msRequestFullscreen) {
            game.canvas.msRequestFullscreen();
        }
    } else {
        document.webkitExitFullscreen();
        document.mozCancelFullScreen();
        document.msExitFullscreen();
        document.exitFullscreen();
    }
}*/

function toggleFullScreen() {
    var doc = window.document;
    var docEl = doc.documentElement;

    var requestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;
    var cancelFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen;

    if (!doc.fullscreenElement && !doc.mozFullScreenElement && !doc.webkitFullscreenElement && !doc.msFullscreenElement) {
        requestFullScreen.call(docEl);
    } else {
        cancelFullScreen.call(doc);
    }
}

function click(e) {
    if (game.currentState == "play") {

        game.play.onclick();
    }
    if (hoverOn(game.start.playBTN) == true && game.currentState == "start") {
        game.play.init();
        game.particles = [];
        aa.play('fade');
    }
    if (hoverOn(game.start.storeBTN) == true && game.currentState == "start") {
        game.store.init();
        game.fade = 1;
        game.particles = [];
        game.bugs = [];
        game.bullets = [];
        aa.play('fade');
    }
    if (game.start.controls == true) {
        game.start.controls = false;
    }
    if (hoverOn(game.start.controlBTN) == true && game.currentState == "start") {
        game.start.controls = true;
    }
    if (game.currentState == "store") {
        game.store.onclick();
    }
    if (game.currentState == "gameover" && game.over.timer >= 60) {
        game.fade = 1;
        game.particles = [];
        game.currentState = "start";
        aa.play('fade');
    }
    if (hoverOn(game.gui.fullscreenBTN) == true && game.currentState != "preload" && game.currentState != "play") {
        if (game.gui.fullscreenBTN.toggled == true) {
            game.gui.fullscreenBTN.toggled = false;
            toggleFullScreen();
        } else {
            game.gui.fullscreenBTN.toggled = true;
            toggleFullScreen();
        }
    }
    pointer.x = e.pageX - game.canvas.offsetLeft;
    pointer.y = e.pageY - game.canvas.offsetTop;
    e.preventDefault();
}
document.addEventListener("mousemove", function (e) {
    pointer.x = e.pageX - game.canvas.offsetLeft;
    pointer.y = e.pageY - game.canvas.offsetTop;
    e.cancelBubble = true;
    e.returnValue = false;
    if (e.stopPropagation) e.stopPropagation();
    if (e.preventDefault) e.preventDefault();
}, false);

document.addEventListener("mousedown", click, false);
/*
document.addEventListener("contextmenu", function (e) {
    e.cancelBubble = true;
    e.returnValue = false;
    if (e.stopPropagation) e.stopPropagation();
    if (e.preventDefault) e.preventDefault();
}, false);
*/
document.addEventListener("drag", function (e) {
    e.cancelBubble = true;
    e.returnValue = false;
    if (e.stopPropagation) e.stopPropagation();
    if (e.preventDefault) e.preventDefault();
}, false);