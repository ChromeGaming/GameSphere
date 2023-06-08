var Pl;
function Player() {
	Pl = this;
	Pl.liesOn = 0;
	Pl.maxH = 66;
	Pl.bounceHeight = 5;
	Pl.w = 20;
	Pl.h = Pl.maxH;
	Pl.x = G.trees[0].x;
	Pl.y = G.trees[0].y - Pl.h;
	Pl.vel = 0;
	Pl.isJet = false;
	Pl.isRest = true;
	Pl.t = new Date();
	Pl.update();
	return Pl;
}

Player.prototype = {
	tears: function (x, y) {
		if (Pl.died) return;
		bp();
        ctx.fillStyle = '#36b1f7';
        mt(Pl.x + Pl.w + x - 3, Pl.y + y);
        lt(Pl.x + Pl.w + x, Pl.y + y - 4);
        lt(Pl.x + Pl.w + x + 3, Pl.y + y);
        ar(Pl.x + Pl.w + x, Pl.y + y, 3, 0, Math.PI);
        cp();
        fl();
	},
	body: function () {
		sv();
		ctx.shadowColor   = '#000';
        ctx.shadowOffsetX = -2;
        ctx.shadowOffsetY = 2;
        ctx.shadowBlur    = 10;
		if (Pl.died) {
			fr(Pl.x - 2 * (Pl.h / 3), Pl.y, (2 * Pl.h) / 3, Pl.w);
			rs();
		} else {
			fr(Pl.x, Pl.y, Pl.w, (2 * Pl.h) / 3);
			rs();
			// shade
			fs('#777')
			fr(Pl.x + 3, Pl.y + 15, 3, 2 * (Pl.h / 3) - 30);
		}
		rs();
	},
	eyes: function () {
		if (!Pl.w && !Pl.h) return;

		var ct = new Date(), clr;
		// 0 means NO, 1 means starts blinking, 2 means blinked
		Pl.isBlink = ct - Pl.t > 2500 ? ++Pl.isBlink : 0;
		clr = Pl.isBlink > 5 ? '#000' : '#fff';

		if (Pl.isBlink >= 8) {
			Pl.t = ct; Pl.isBlink = 0;
		}
		//fs(clr);
		bp(clr);

		if (Pl.died) {
			ar(Pl.x - 2 * (Pl.h / 3) + 6, Pl.y + 4, 2, 0, M.PI * 2, true);
	    	ar(Pl.x - 2 * (Pl.h / 3) + 6, Pl.y + 10, 2, 0, M.PI * 2, true);
		} else {
	    	ar(Pl.x + 2 * (Pl.w / 3) - 2, Pl.y + 5, 2, 0, M.PI * 2, true);
	    	ar(Pl.x + (Pl.w - 3), Pl.y + 5, 2, 0, M.PI * 2, true);
	    }
    	ctx.fillStyle = clr;//'#8effb6';
		fl();
	},
	legs: function () {
		var lw = 3; // leg width
		fs('#000');
		if (Pl.died) {
			// left leg
			fr(Pl.x, Pl.y + (Pl.w / 3), Pl.h / 3, lw);
			// right leg
			fr(Pl.x, Pl.y + 2 * (Pl.w / 3), Pl.h / 3, lw);
		} else {
			// left leg
			fr(Pl.x + (Pl.w / 3) - lw / 2, Pl.y + 2 * (Pl.h / 3), lw, Pl.h / 3);
			// right leg
			fr(Pl.x + 2 * (Pl.w / 3) - lw / 2, Pl.y + 2 * (Pl.h / 3), lw, Pl.h / 3);
		}
	},
	fe: function () { // Fire Extinguisher
		fs('#eaeaea');
		bp();
		el(ctx, Pl.x - 30, Pl.y + Pl.h, 80, 10, '#000')
		cp();
		fs('#EAEAEA');
		fl();
		ctx.lineWidth = 1;
		sts('#dedede');
		st();
		fs('#8ED6FF');
		for (var i = -30; i < Pl.w + 30; i+=6) {
			bp();
			mt(Pl.x + i, Pl.y + Pl.h);
			lt(Pl.x + i - 1, Pl.y + Pl.h + utils.getRandomInt(10, G.can.height/2));
			lt(Pl.x + i + 3, Pl.y + Pl.h + utils.getRandomInt(10, G.can.height/2));
			lt(Pl.x + i + 1, Pl.y + Pl.h);
			cp();
			fl();
		}

	},
	burst: function () {
		// Particle effects
		if (Pl.w && Pl.h) {
			this.dieParticles = new Particles(Pl.x, Pl.y);
		} else if (PS.finished) {
			G.stopCycle();
			PS.finished = false;
		}

		if (!Pl.w && !Pl.h) {
			this.dieParticles.draw();
		}

		Pl.w = 0;
		Pl.h = 0;
	},
	update: function () {
		Pl.x -= G.speed;
		if (Pl.isInAir && Pl.bounceFactor > 0) {
			Pl.y -= Pl.bounceHeight;
			Pl.x += 1.5 * G.speed;
			Pl.bounceFactor -= 2;
		} else if (Pl.isInAir && !Pl.bounceFactor) {  // smooth curve parabola jump
			Pl.y -= Pl.bounceHeight / 2;
			Pl.x += 1.5 * G.speed;
			Pl.bounceFactor -= 2;
		} else if (Pl.isInAir && Pl.bounceFactor === -2) { // smooth curve parabola jump
			Pl.y -= 0;
			Pl.x += 1.5 * G.speed;
			Pl.bounceFactor -= 2;
		} else if (Pl.isInAir && Pl.bounceFactor === -4) { // smooth curve parabola jump
			Pl.y -= Pl.bounceHeight / 2;
			Pl.x += 1.5 * G.speed;
			Pl.bounceFactor -= 2;
		} else if (Pl.isInAir && Pl.bounceFactor === -6) { // revert back force rewind
			Pl.y += Pl.bounceHeight;
			Pl.x += 1.5 * G.speed;
			Pl.bounceFactor = -6;
		}

		if (Pl.died && !Pl.busted) {
			Pl.y += 10;
			if (Pl.isCornerStrike) {
				if (Pl.y > CC.h - 3*P.fireOffset) {
					if (!Pl.busted) {
						Pl.busted = true;
					}
				}
			} else if (!Pl.busted) {
				Pl.busted = true;
			}
		}

		fs('#000');
		Pl.body();
		Pl.legs();
		Pl.eyes();
		Pl.tears(2, 6);
		Pl.tears(5, 15);
		if (Pl.isInAir && !Pl.busted) Pl.fe();
		if (Pl.busted) {
			Pl.burst();
		}
		Pl.checkCollision();
	},
	keyDown: function (key) {
		if (Pl.busted) { return; }

		if (key === 32) { // 32 is space,38 is UP, 40 is DOWN
			Pl.irj = true; // isReadyToJump
			if (Pl.h < 50) { return; }
			Pl.h -= 2;
			Pl.y += 2;
		} else if (key === 39) {
			Pl.x += G.speed;
		}

		if (Pl.irj) {
			Pl.irj = false;
			Pl.isInAir = true;
			Pl.isKarmaLocked = false;
			Pl.bounceFactor = Pl.maxH - Pl.h;
			Pl.bounceFactor *= 4;
			Pl.h = Pl.maxH;
		}
	},
	keyUp: function () {
		/*if (Pl.irj) {
			Pl.irj = false;
			Pl.isInAir = true;
			SU.play('moveAhead');
			Pl.bounceFactor = Pl.maxH - Pl.h;
			Pl.bounceFactor *= 4;
			Pl.h = Pl.maxH;
		}*/
	},
	checkCollision: function () {
		if (Pl.x <= 0) { // leftmost collision
			Pl.died = true;
			Pl.isCornerStrike = true;
			return;
		} else if (Pl.y > CC.h - P.fireOffset) { // bottom fire collision
			Pl.died = true;
			Pl.isCornerStrike = true;
			return;
		} else if (Pl.x + Pl.w > CC.w) { // rightmost collision
			Pl.died = true;
			Pl.isCornerStrike = true;
			return;
		} else if (Pl.y < 0 ) { // topmost collision
			Pl.died = true;
			Pl.isCornerStrike = true;
			return;
		}

		var i, tree;
		for (i = 0; i < G.trees.length; i++) { // M.min(Pl.liesOn + 10, )
			tree = G.trees[i];

			var playerEnd = Pl.x + Pl.w - 4; // 4 bcz legs are placed (x coord)technically before body
			if ((playerEnd >= tree.x && playerEnd < (tree.x + tree.width + 4) && Pl.y + Pl.w + Pl.h >= tree.x)
			) {
				for (var j = 0; j < Pl.bounceHeight; j++) {
					if (Pl.y + Pl.h + j >= tree.y) {
						G.trees[i].flame = null;
						Pl.isInAir = false;
						Pl.liesOn = i;
						if (!Pl.isKarmaLocked && Pl.liesOn !== Pl.lastLiesOn) {
							G.karma && SU.play('moveAhead');
							G.karma += 1;
						}
						Pl.isKarmaLocked = true;;
						Pl.lastLiesOn = Pl.liesOn;
						// Pl.y += tree.y - (Pl.y + Pl.h) - 2;
						break;
					}
				}
				if (Pl.y >= tree.y && Pl.y < tree.y + tree.height) {
					Pl.died = true;
					break;
				}

			}
		}
	}
};