var PS;
function Particles(x, y) {
	PS = this;
	this.x = x - 10,
	this.y = y;
	this.vyL1 = 3;
	this.vyL2 = 2;
	this.vyL3 = 1;
	this.finished = false;
	this.particles = [];
	this.diff = 0;
	this.draw();
	// setTimeout(function () {
	// 	PS.finished = true;
	// }, 1000);
}

Particles.prototype = {
	draw: function () {
	    // ctx.globalCompositeOperation = 'source-over';
		fs('red');
		for (var i = 0; i < 10; i+= 2) {
			fr(PS.x + 4*i, M.min(PS.y + this.vyL1, CC.h - 50), utils.getRandomInt(4, 6), utils.getRandomInt(4, 6));
		}
		for (var i = 1; i < 10; i+= 2) {
			fr(PS.x + 4*i, M.min(PS.y + 7 + this.vyL2, CC.h - 50), utils.getRandomInt(4, 6), utils.getRandomInt(4, 6));
		}
		for (var i = 0; i < 10; i+= 2) {
			fr(PS.x + 4*i, M.min(PS.y + 15 + this.vyL3, CC.h - 50), utils.getRandomInt(4, 6), utils.getRandomInt(4, 6));
		}

		this.diff = CC.h - PS.y;
		PS.y += this.diff * (10 / 15) * (fps / 1000);

		if (PS.y > CC.h - P.fireOffset) {
			PS.finished = true;
		}
		PS.x -= G.speed;
	}
}