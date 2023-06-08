var T, CC;
var blw = 200, bw = 0;

function Tree(config) {
	T = this;
	config = config || {};
	// T.lw = T.w = 0;
	T.minW = 10;
	T.maxW = 80;
	T.minH = P.fireOffset;
	T.maxH = G.isMobile() ? 300 : 400;
	T.minDist = 50;
	T.maxDist = G.isMobile() ? 100 : 200;
	// T.branchThickness = 3;

	CC.w = utils.pI(G.can.width);
	CC.h = utils.pI(G.can.height);

	T.color = '#a77b44';
	this.add();
	if (!config.isNoFlame) {
		if (G.isMobile()) {
			this.flame = true;
		} else {
			this.flame = smoky;
			this.flame.addEntity(Flame);
		}
	}
	return T;
}

Tree.prototype = {
	/*drawFractalTree: function (x, y, width, height) {
		T.drawTree(x, y, width, height, -90, T.branchThickness);
	},
	drawTree: function (x1, y1, width, height, angle, depth){
		T.brLength = T.brLength || T.random(T.minW, T.maxW);
		T.angle = T.angle || T.random(15, 20);
		T.bb = (T.cos(angle) * depth * T.brLength);
		T.vv = (T.sin(angle) * depth * T.brLength);
		if (depth != 0){
			var x2 = x1 + T.bb;
			var y2 = y1 - T.vv;

			T.drawLine(x1, y1, x2, y2, depth);

			T.drawTree(x2, y2, width, height, angle - T.angle, depth - 1);
			T.drawTree(x2, y2, width, height, angle + T.angle, depth - 1);
			// T.drawLine(x1, y1, x2, y2, depth);
		}
	},
	random: function (min, max){
		return min + Math.floor(Math.random()*(max+1-min));
	},
	drawLine: function (x1, y1, x2, y2, thickness){
		ctx.fillStyle   = '#000';
		if(thickness > 2)
			ctx.strokeStyle = 'rgb(139,126, 102)'; //Brown
		else
			ctx.strokeStyle = 'rgb(34,139,34)'; //Green
		ctx.lineWidth = thickness * 1.5;
		bp();
		mt(x1, y1);
		lt(x2, y2);
		cp();
		st();

	},
	cos: function (angle) {
		return M.cos(T.deg_to_rad(angle));
	},
	sin: function (angle) {
		return M.sin(T.deg_to_rad(angle));
	},
	deg_to_rad: function (angle){
		return angle*(M.PI/180.0);
	},*/
	getWidth: function (val) {
		if (val !== undefined) {
			return val;
		}
		return utils.getRandomInt(T.minW, T.maxW);
	},
	getHeight: function (val) {
		if (val !== undefined) {
			return val;
		}
		return utils.getRandomInt(T.minH, T.maxH);
	},
	add: function (val) {
		T.preCompute();
		T.x = blw + bw;
		T.y = CC.h - T.h - (P.fireOffset * 0.6),
		T.width = bw,
		T.height = T.h;
		// T.drawFractalTree(T.x, T.y, T.width, T.height)

		//T.update(T);
		return T;
	},
	update: function (treeInstance) {
		var x = treeInstance.x,
			y = treeInstance.y,
			width = treeInstance.width,
			height = treeInstance.height;

		sv();
		fs(T.color);

		bp();
		mt(x, y);
		// left side
		bct(x , y + height, x - 25, y + height, x - 25, y + height);

		// left bottom curve
		bct(x, y + height, x + (width / 2), y + height / 1.2, x + (width / 2), y + (height / 1.2))
		// right bottom curve
		bct(x + (width / 2), y + (height / 1.2), x + (width / 2), y + height / 1.2, x + width + 25, y + height);

		// right side
		bct(x + width, y + height, x + width, y, x + width, y);

		ctx.shadowColor   = '#6b4e2a';
        ctx.shadowOffsetX = -3;
        ctx.shadowOffsetY = 3;
        ctx.shadowBlur    = 10;
		ctx.strokeStyle = '#6b4e2a';
		ctx.lineWidth = 1;
		st();
		cp();
		fl();
		rs();

		fs('#444')
		el(ctx, x, y - 4, width, 10, '#6b4e2a');

		if (treeInstance.flame) {
			if (G.isMobile()) {
				T.addCircle(x, y, width);
			} else {
				treeInstance.flame.update(x, y, width);
			}
		}
	},
	addCircle: function (x, y, width) {
		bp();
		ar(x + (width/2), y, width/2, 0, Math.PI*2, false);
		fs('rgba(255, 0, 0, 0.4)');
		fl();

		bp();
		ar(x + (width/2), y, width/3, 0, Math.PI*2, false);
		fs('rgba(255, 165, 0, 0.4)');
		fl();

		bp();
		ar(x + (width/2), y, width/6, 0, Math.PI*2, false);
		fs('rgba(255, 255, 0, ' + utils.getRandomInt(0.3, 0.5)/10 + ')');
		fl();
	},
	preCompute: function () {
		T.lw = blw + bw + (bw === 0 ? 0 : utils.getRandomInt(T.minDist, T.maxDist));
		blw = T.lw;
		T.w = utils.getRandomInt(T.minW, T.maxW);
		bw = T.w;
		T.h = utils.getRandomInt(T.minH, T.maxH);
		// console.log(blw, bw)
		// T.rw = CC.w - T.lw - T.w;
	},
	removeFlame: function (that) {
		that.flame = undefined;
	}
};

