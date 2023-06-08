var CC, RN, WD, SM, cloud, sunMoon, wind, rain;
var diffInWeatherTime = 5;
function Cloud() {
	this.color = 'blue';
	this.x = G.can.width || P.w;
	this.y = 100;
	this.speed = 7;
	this.update();
}
Cloud.prototype = {
	drawArcs: function (x, y, sx, sy) {
		bp();
		mt(x/sx + 150, y - 15); // 188, 50
		qct(
			x/sx + 150 + 50,
			y - 15 + 0,
			x/sx + 150 + 40,
			y - 15 + 40
		);
		ctx.lineWidth = 4;
		sts(thisWeather.hexToRgb(thisWeather.getColor(), 0.8))
		st();

		bp();
		mt(x/sx + 20 + 30, y + 10); // 188, 50
		qct(
			x/sx + 30,
			y + 35 + 10,
			x/sx + 30 + 60,
			y + 35 + 15
		);
		st();
	},
	draw: function (x, y, sx, sy) {
		var cloudColor = thisWeather.hexToRgb(thisWeather.getColor(), 0.5);

		ctx.scale(sx, sy);
		bp();
		fs(cloudColor)
		mt(x/sx, y);
		bct(x/sx - 40, y + 20, x/sx - 40, y + 70, x/sx + 60, y + 70);
		bct(x/sx + 80, y + 100, x/sx + 150, y + 100, x/sx + 170, y + 70);
		bct(x/sx + 250, y + 70, x/sx + 250, y + 40, x/sx + 220, y + 20);
		bct(x/sx + 260, y - 40, x/sx + 200, y - 50, x/sx + 170, y - 30);
		bct(x/sx + 150, y - 75, x/sx + 80, y - 60, x/sx + 80, y - 30);
		bct(x/sx + 30, y - 75, x/sx - 20, y - 60, x/sx, y);
		cp();
		ctx.shadowColor   = thisWeather.hexToRgb(thisWeather.getColor(), 0.8);
        ctx.shadowOffsetX = -3;
        ctx.shadowOffsetY = 3;
        ctx.shadowBlur    = 10;
		ctx.lineWidth = 3;
		sts(thisWeather.hexToRgb(thisWeather.getColor(), 0.8))
		st();
		fl();

		this.drawArcs(x, y, sx, sy);
	},
	update: function () {
		this.x -= this.speed;
		if (this.x + 250 < 0) {
			this.x = CC.w + 250;
			this.y = this.y + utils.getRandomInt(-10, 10);
		}

		var x = this.x, y = this.y;
		sv();
		this.draw(x, y, 0.8, 0.7);
		this.draw(x, y, 0.7, 0.6);
		this.draw(x, y, 0.6, 0.6);
		this.draw(x, y, 0.5, 0.7);
		rs();
	}
}

function SunMoon() {
	SM = this;
	this.isSun = true; // will act as moon too
	this.r = 20;
	this.x = 0;
	this.y = 100;
	this.speed = 1;
	G.period = 'morning';
	this.update();
}
SunMoon.prototype = {
	getColor: function () {
		var color;
		switch (G.period) {
			case 'morning':
				color = this.isSun ? '#ffff9e' : '#fff';
				break;
			case 'afternoon':
				color = this.isSun ? 'yellow' : '#fff';
				break;
			case 'evening':
				color = this.isSun ? '#e28800' : '#fff';
				break;
			case 'night':
				color = this.isSun ? '#fff' : '#fff';
				break;
		}
		return color;
	},
	resetPos: function () {
		this.x = 0;
		this.y = 100;
		G.period = 'morning';
		thisWeather.step = 0;
	},
	update: function () {
		// lets assume 30 secs is 1 day, so 15-15 secs day-night
		if (Weather.dt / 1000 % (5*diffInWeatherTime) > 5*diffInWeatherTime ||
			Weather.dt / 1000 % (5*diffInWeatherTime) > 4*diffInWeatherTime ||
			Weather.dt / 1000 % (5*diffInWeatherTime) > 3*diffInWeatherTime
		) {
			G.period = 'night';
		} else if (Weather.dt / 1000 % (5*diffInWeatherTime) > 2*diffInWeatherTime) {
			G.period = 'evening';
		} else if (Weather.dt / 1000 % (5*diffInWeatherTime) > 1*diffInWeatherTime) {
			G.period = 'afternoon';
		} else {
			G.period = 'morning';
		}

		this.x += ((G.can.width / (2 * diffInWeatherTime)) / fps); // this.speed;
		if (this.x > G.can.width) {
			this.resetPos();
			this.isSun = !this.isSun;
			return;
		}

		this.y -= 0.1;
		sv();
		ctx.shadowColor   = this.getColor();
        ctx.shadowOffsetX = -3;
        ctx.shadowOffsetY = 3;
        ctx.shadowBlur    = 10;
		bp();
		ar(this.x, this.y, this.r, 0, Math.PI * 2, true);
		cp();
		ctx.fillStyle = this.getColor();
		fl();
		rs()

		sv();
		bp();
		ctx.fillStyle = thisWeather.hexToRgb('#444', 0.5);
		// moon curvature
		if (!this.isSun) {
			ar(this.x + 5, this.y - 5, 20, 0, Math.PI * 2, true);
		}
		cp();
		fl();
		rs();

		thisWeather.updateGradient();
	}
}

function WindParticle(i) {
	this.x = G.can.width + utils.getRandomInt(0, G.can.width);
	this.y = (i+1) * WD.pDist;
	this.color = '#d1e5ff';
	this.speed = utils.getRandomInt(1, WD.speed);
}
function Wind() {
	WD = this;
	this.speed = 1;
	this.particlesCount = 15;
	this.particles = [];
	this.pDist = 10;
	this.create();
}
Wind.prototype = {
	create: function () {
		for (var i = 0; i < WD.particlesCount; i++) {
			WD.particles.push(new WindParticle(i));
		}
	},
	update: function () {
		for (var i = 0; i < WD.particles.length; i++) {
			var wParticle = WD.particles[i];
			// wParticle.y += wParticle.speed;
			wParticle.x -= M.max(wParticle.speed);
			wParticle.color = thisWeather.getColor();
			fs(wParticle.color);
			var wParticleW = utils.getRandomInt(10, 50)
			bp();
			mt(wParticle.x, wParticle.y);
			lt(wParticle.x - wParticleW, wParticle.y);
			cp();
			fl();
			ctx.lineWidth = 2;
			sts(wParticle.color);
			st();

			if (wParticle.x < 0) {
				// reinitialize a new wParticle
				WD.particles[i] = new WindParticle(i);
			}
		}
	}
}

function Droplet(i) {
	this.x = RN.topDropletsDist * i;
	this.y = 0;
	this.color = '#d1e5ff';
	this.speed = utils.getRandomInt(10, 30);
}
function Rain() {
	RN = this;
	this.particles = [];
	this.particlesCount = 33;
	this.topDroplets = this.particlesCount * 1.5; // 66
	this.rightDroplets = this.particlesCount / 3; // 33
	this.topDropletsDist = (G.can.width / this.topDroplets) * 2;
	this.rightDropletsDist = (G.can.width / this.rightDroplets) * 2;
	this.create();
}
Rain.prototype = {
	create: function () {
		for (var i = 0; i < RN.particlesCount; i++) {
			RN.particles.push(new Droplet(i));
		}
	},
	update: function () {
		for (var i = 0; i < RN.particles.length; i++) {
			var droplet = RN.particles[i];
			droplet.y += droplet.speed;
			droplet.x -= M.max(G.speed, wind.speed);
			droplet.color = thisWeather.getColor();
			fs(droplet.color);
			var dropletH = utils.getRandomInt(6, 20)
			bp();
			mt(droplet.x, droplet.y);
			lt(droplet.x - 2, droplet.y + dropletH);
			cp();
			fl();
			ctx.lineWidth = 2;
			sts(droplet.color);
			st();

			if (droplet.y > CC.h) {
				// reinitialize a new droplet
				RN.particles[i] = new Droplet(i);
			}
		}
	}
};

function Weather() {
	this.colors = [
		[255,255,255],
		[142,214,255],
		[255, 254, 210],
		[153,153,153],
		[20,20,20],
		[20,20,20]
	];

	this.step = 0;
	this.i = 0;
	this.colorIndices = [0, 1 ,2, 3];

	thisWeather = this;
	CC = document.getElementById('canvascontainer').style;
	this.init();
}

Weather.prototype = {
	updateGradient: function () {
		var c0_0 = thisWeather.colors[thisWeather.colorIndices[0]],
			c0_1 = thisWeather.colors[thisWeather.colorIndices[1]],
			c1_0 = thisWeather.colors[thisWeather.colorIndices[2]],
			c1_1 = thisWeather.colors[thisWeather.colorIndices[3]],

			istep = 1 - thisWeather.step,
			r1 = Math.round(istep * c0_0[0] + thisWeather.step * c0_1[0]),
			g1 = Math.round(istep * c0_0[1] + thisWeather.step * c0_1[1]),
			b1 = Math.round(istep * c0_0[2] + thisWeather.step * c0_1[2]),
			color1 = 'rgb(' + r1 + ',' + g1 + ',' + b1 + ')',

			r2 = Math.round(istep * 255+ thisWeather.step * 255),
			g2 = Math.round(istep * 255+ thisWeather.step * 255),
			b2 = Math.round(istep * 255+ thisWeather.step * 255),
			color2 = 'rgb(' + r2 + ',' + g2 + ',' + b2 + ')';

		var grd = ctx.createLinearGradient(0, 0, 0, G.can.height);
		grd.addColorStop(0, color1);
		grd.addColorStop(0.9, color2);
		G.backgroundColor = grd;

		thisWeather.step += SM.isSun ? 0.0076 : 0.0076/2.22; // 1 / (diffInWeatherTime * fps);
		if (thisWeather.step >= 1) {
			thisWeather.step = 0;
			for (var j = 0; j < thisWeather.colorIndices.length; j++) {
				thisWeather.colorIndices[j] = (thisWeather.i + 1) % thisWeather.colors.length;
			}
			thisWeather.i += 1;
		}
	},
	hexToRgb: function (hexColor, alpha) {
	    if (!hexColor) { return; }

	    alpha = alpha || 1.0;
	    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
	    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
	    hexColor = hexColor.replace(shorthandRegex, function(m, r, g, b) {
	        return r + r + g + g + b + b;
	    });

	    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hexColor);
	    return result ? 'rgba(' +
	      parseInt(result[1], 16) + ',' +
	      parseInt(result[2], 16) + ',' +
	      parseInt(result[3], 16) + ',' +
	      alpha + ')' : 'rgba(255,255,255,0)';
	},
	getColor:  function (isKarmaText) {
		var color;
		switch (G.period) {
			case 'morning':
				color = isKarmaText ? SM.isSun ? '#444' : '#fff' : SM.isSun ? '#8ED6FF' : '#444';
				break;
			case 'afternoon':
				color = isKarmaText ? SM.isSun ? '#444' : '#fff' : SM.isSun ? '#56baf3' : '#444';
				break;
			case 'evening':
				color = isKarmaText ? SM.isSun ? '#444' : '#fff' : SM.isSun ? '#999' : '#444';
				break;
			case 'night':
				color = isKarmaText ? SM.isSun ? '#444' : '#fff' : SM.isSun ? '#444' : '#444';
				break;
		}
		return color;
	},
	update: function () {
		var now = new Date().getTime();
		Weather.dt = now - G.gameStartTime;

		sunMoon.update();
		if (!G.isMobile()) {
			cloud.update();

			// console.log(M.ceil(Weather.dt / 1000))
			if (!this.canRain && M.ceil(Weather.dt / 1000) % 16 === 0) {
				this.canRain = true;
				this.isRaining = true;
			} else if (M.ceil(Weather.dt / 1000) % 33  === 0) {
				this.canRain = false;
				this.isRaining = false;
			}

			if (this.canRain && this.isRaining) {
				rain.update();
			}

			wind.update();
		}
	},
	init: function () {
		cloud = new Cloud();
		sunMoon = new SunMoon();
		rain = new Rain();
		wind = new Wind();
		this.update();
	}
};
