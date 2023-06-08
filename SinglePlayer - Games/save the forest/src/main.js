var _ = window,
raf = (function() {
	return  _.requestAnimationFrame     ||
    _.webkitRequestAnimationFrame 		||
    _.mozRequestAnimationFrame    		||

    function(c){
        setTimeout(c, 1000 / 60);
    };
})(),
M       = Math,
abs     = M.abs,
min     = M.min,
max     = M.max,
to      = setTimeout,
fps     = 60;

// Shortcuts
var p = CanvasRenderingContext2D.prototype;
p.fr = p.fillRect;
p.sv = p.save;
p.rs = p.restore;
p.lt = p.lineTo;
p.mt = p.moveTo;
p.sc = p.scale;
p.bp = p.beginPath;
p.cp = p.closePath;
p.rt = p.rotate;
p.ft = p.fillText;
p.bct = p.bezierCurveTo;
p.qct = p.quadraticCurveTo;
p.st = p.stroke;
p.ar = p.arc;
p.fl = p.fill;

// ctx.ellipsis wont work in firefox
p.el = function drawEllipseWithQuatraticCurve(ctx, x, y, w, h, style) {
    var kappa = .5522848,
        ox = (w / 2) * kappa, // control point offset horizontal
        oy = (h / 2) * kappa, // control point offset vertical
        xe = x + w,           // x-end
        ye = y + h,           // y-end
        xm = x + w / 2,       // x-middle
        ym = y + h / 2;       // y-middle

    sv();
    bp();
    mt(x, ym);
    qct(x,y,xm,y);
    qct(xe,y,xe,ym);
    qct(xe,ye,xm,ye);
    qct(x,ye,x,ym);
    ctx.strokeStyle = style ? style : '#000';
    ctx.lineWidth = 2;
    st();
    rs();
    fl();
}

p.fs = function(p){
    this.fillStyle = P.inverted ? invert(p) : p;
};
p.sts = function(p){
    this.strokeStyle = P.inverted ? invert(p) : p;
};

// Adding all these functions to the global scope
for(var i in p){
    _[i] = (function(f){
        return function(){
            c[f].apply(c, arguments);
        }
    })(i);
}

var P = {
	w: 640,
	h: 760,
	g: 800,
	fireOffset: 70,
    spikesOffset: 50,
    tbOffset: 20
};

function canvasToImage() {
    G.dataURL = document.getElementById('game-canvas').toDataURL('image/png');
}

function downloadCanvas() {
    var windowRef = _.open();
    if (windowRef) {
        windowRef.document.write('<img src="' + G.dataURL + '"/>');
    } else {
        alert('Your browser prevented the window from opening. Please allow to view game screenshot.')
    }
}

addEventListener('DOMContentLoaded',function(){
	_._can  = document.querySelector('canvas');
    new Game();
});

