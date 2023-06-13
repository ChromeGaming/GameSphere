// Vibration api
navigator.vibrate = (function(){
    return navigator.vibrate
        || navigator.mozVibrate
        || navigator.webkitVibrate
        || noop;
})();

// Utility functions
var utils = {
	/**
	 * Get a random number between the specified values
	 * @param  {Number} min
	 * @param  {Number} max
	 * @return {Number}
	 */
	getRandomInt: function (min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	},
	/**
	 * Shorthand for parseInt with radix 10
	 * @param  {Number} value
	 * @return {Number}
	 */
	pI: function (value) {
		return parseInt(value, 10);
	},
	/**
	 * Clamp value between specified limits
	 * @param  {Number} value - value to be clamped
	 * @param  {Number} min   - min value
	 * @param  {Number} max   - max value
	 * @return {Number}       - desired clamped value
	 */
	clamp: function (value, min, max) {
		if (typeof min !== 'number') { min = -Infinity; }
		if (typeof max !== 'number') { max = Infinity; }
		return Math.max(min, Math.min(max, value));
	},
	/**
	 * Get local storage data decode it before using it
	 * @param  {Boolean} isSound
	 * @return {String}
	 */
	getLocalStorageData: function (isSound) {
		if (!isSound) {
			return utils.pI(atob(localStorage.getItem('__js13k_game_karma'))) || 0;
		}
		return utils.pI(atob(localStorage.getItem('__js13k_game_sound')));
	},
	/**
	 * Save data to local storage
	 * @param {String/Number}  data
	 * @param {Boolean} isSoundData - for saving sound preferences
	 */
	setLocalStorageData: function (data, isSoundData) {
		if (!isSoundData) {
			localStorage.setItem('__js13k_game_karma', btoa(data));
		} else {
			localStorage.setItem('__js13k_game_sound', btoa(data))
		}

	}
};
/* Jsfxr lib for sound effects */

function J(){this.B=function(e){for(var f=0;24>f;f++)this[String.fromCharCode(97+f)]=e[f]||0;0.01>this.c&&(this.c=0.01);e=this.b+this.c+this.e;0.18>e&&(e=0.18/e,this.b*=e,this.c*=e,this.e*=e)}}
			var W=new function(){this.A=new J;var e,f,d,g,l,z,K,L,M,A,m,N;this.reset=function(){var c=this.A;g=100/(c.f*c.f+0.001);l=100/(c.g*c.g+0.001);z=1-0.01*c.h*c.h*c.h;K=1E-6*-c.i*c.i*c.i;c.a||(m=0.5-c.n/2,N=5E-5*-c.o);L=0<c.l?1-0.9*c.l*c.l:1+10*c.l*c.l;M=0;A=1==c.m?0:2E4*(1-c.m)*(1-c.m)+32};this.D=function(){this.reset();var c=this.A;e=1E5*c.b*c.b;f=1E5*c.c*c.c;d=1E5*c.e*c.e+10;return e+f+d|0};this.C=function(c,O){var a=this.A,P=1!=a.s||a.v,r=0.1*a.v*a.v,Q=1+3E-4*a.w,n=0.1*a.s*a.s*a.s,X=1+1E-4*a.t,Y=1!=
			a.s,Z=a.x*a.x,$=a.g,R=a.q||a.r,aa=0.2*a.r*a.r*a.r,D=a.q*a.q*(0>a.q?-1020:1020),S=a.p?(2E4*(1-a.p)*(1-a.p)|0)+32:0,ba=a.d,T=a.j/2,ca=0.01*a.k*a.k,E=a.a,F=e,da=1/e,ea=1/f,fa=1/d,a=5/(1+20*a.u*a.u)*(0.01+n);0.8<a&&(a=0.8);for(var a=1-a,G=!1,U=0,v=0,w=0,B=0,t=0,x,u=0,h,p=0,s,H=0,b,V=0,q,I=0,C=Array(1024),y=Array(32),k=C.length;k--;)C[k]=0;for(k=y.length;k--;)y[k]=2*Math.random()-1;for(k=0;k<O;k++){if(G)return k;S&&++V>=S&&(V=0,this.reset());A&&++M>=A&&(A=0,g*=L);z+=K;g*=z;g>l&&(g=l,0<$&&(G=!0));h=g;0<
			T&&(I+=ca,h*=1+Math.sin(I)*T);h|=0;8>h&&(h=8);E||(m+=N,0>m?m=0:0.5<m&&(m=0.5));if(++v>F)switch(v=0,++U){case 1:F=f;break;case 2:F=d}switch(U){case 0:w=v*da;break;case 1:w=1+2*(1-v*ea)*ba;break;case 2:w=1-v*fa;break;case 3:w=0,G=!0}R&&(D+=aa,s=D|0,0>s?s=-s:1023<s&&(s=1023));P&&Q&&(r*=Q,1E-5>r?r=1E-5:0.1<r&&(r=0.1));q=0;for(var ga=8;ga--;){p++;if(p>=h&&(p%=h,3==E))for(x=y.length;x--;)y[x]=2*Math.random()-1;switch(E){case 0:b=p/h<m?0.5:-0.5;break;case 1:b=1-2*(p/h);break;case 2:b=p/h;b=0.5<b?6.28318531*
			(b-1):6.28318531*b;b=0>b?1.27323954*b+0.405284735*b*b:1.27323954*b-0.405284735*b*b;b=0>b?0.225*(b*-b-b)+b:0.225*(b*b-b)+b;break;case 3:b=y[Math.abs(32*p/h|0)]}P&&(x=u,n*=X,0>n?n=0:0.1<n&&(n=0.1),Y?(t+=(b-u)*n,t*=a):(u=b,t=0),u+=t,B+=u-x,b=B*=1-r);R&&(C[H%1024]=b,b+=C[(H-s+1024)%1024],H++);q+=b}q=0.125*q*w*Z;c[k]=1<=q?32767:-1>=q?-32768:32767*q|0}return O}};
			window.jsfxr=function(e){W.A.B(e);var f=W.D();e=new Uint8Array(4*((f+1)/2|0)+44);var f=2*W.C(new Uint16Array(e.buffer,44),f),d=new Uint32Array(e.buffer,0,44);d[0]=1179011410;d[1]=f+36;d[2]=1163280727;d[3]=544501094;d[4]=16;d[5]=65537;d[6]=44100;d[7]=88200;d[8]=1048578;d[9]=1635017060;d[10]=f;for(var f=f+44,d=0,g="data:audio/wav;base64,";d<f;d+=3)var l=e[d]<<16|e[d+1]<<8|e[d+2],g=g+("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"[l>>18]+"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"[l>>
			12&63]+"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"[l>>6&63]+"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"[l&63]);d-=f;return g.slice(0,g.length-d)+"==".slice(0,d)};
// For sound Effects
var soundUtils = SU = {
	rd: function (a, b){
	    if(!b){
	        b = a;
	        a = 0;
	    }
		return Math.random() * (b - a) + a;
	},
	rp: function (a){
	    return a[~~this.rd(a.length)];
	},
	soundEffect: function(sid, settings){
		SU[sid] = [];

		settings.forEach(function(sound){
			var audio = new Audio();
			audio.src = jsfxr(sound);

			SU[sid].push(audio);
		});
	},
	play: function(sid) {
		if (!G.isSound) {
			return;
		}
		SU[sid] && SU.rp(SU[sid]).play();
	}
};


SU.soundEffect('gameOver', [
	[2,0.2,0.01,,0.83,0.24,,,,0.62,0.6,,,0.1248,0.4522,,,,0.4,,,,,0.6]
]);
SU.soundEffect('moveAhead', [
	[2,,0.2047,,0.3986,0.5855,0.2236,-0.1697,,,,,,0.7882,-0.2576,,,,1,,,,,0.43]
]);
SU.soundEffect('highestScore', [
	[0,,0.016,0.4953,0.3278,0.6502,,,,,,0.4439,0.6322,,,,,,1,,,,,1]
]);
SU.soundEffect('explosion1', [
	[3,,0.3729,0.6547,0.4138,0.0496,,,,,,,,,,,,,1,,,,,0.4]
]);
SU.soundEffect('explosion2', [
	[3,0.43,0.61,0.3794,0.86,0.17,0.17,0.1399,0.1,0.07,0.06,0.04,0.1,,,0.96,0.26,-0.16,1,,,,,0.15]
]);
SU.soundEffect('info', [
	[2,,0.1889,,0.111,0.2004,,,,,,,,0.1157,,,,,1,,,0.1,,1]
]);
SU.soundEffect('soundOn', [
	[2,,0.2,,0.1753,0.64,,-0.5261,,,,,,0.5522,-0.564,,,,1,,,,,0.5]
]);
SU.soundEffect('playGame', [
	[2,,0.261,0.2142,0.2005,0.4618,0.0137,-0.3602,,,,,,0.2249,0.0858,,,,1,,,0.0001,,0.44]
]);
SU.soundEffect('glitch', [
	[3,,0.0272,0.5654,0.1785,0.7424,,,,,,0.2984,0.5495,,,,,,1,,,,,0.43]
])
var SF, Flame, H, PI_2, Smoke, Trail, W, SmokyFlame, drawCircle, rand, w, slice = [].slice;

PI_2 = 2 * Math.PI;
rand = function (a, b) {
    return (b - a) * Math.random() + a;
};
drawCircle = function (x, y, r, style) {
    bp();
    ar(x, y, r, 0, PI_2, false);
    ctx.fillStyle = style;
    return fl();
};

Smoke = function () {
    function Smoke(x, y) {
        this.opacity = 0.8;
        this.x = x;
        this.y = y;
        this.r = 2.0;
    }
    Smoke.prototype.step = function (x, y, w) {
        y -= utils.getRandomInt(rand(60,70), rand(200,350))
        // y -= rand(0, 3);
        x += rand(-2, 2);
        this.opacity -= 0.04;
        if (this.opacity <= 0) {
            return this.destroyed = true;
        }
    };
    Smoke.prototype.draw = function (x, y, w) {
        y -= utils.getRandomInt(60, 150)
        x += utils.getRandomInt(rand(-w+w/2, 0), rand(0,w-w/2))
        if (this.opacity <= 0) {
            return;
        }
        return drawCircle(x, y, this.r, 'rgba(60,60,60,' + this.opacity + ')');
    };
    return Smoke;
}();
Trail = function () {
    function Trail(x, y) {
        this.opacity = 1;
        this.x = x;
        this.y = y;
        this.r = 12;
    }
    Trail.prototype.step = function (x, y, w) {
        this.r = w / 5;
        y -= rand(0, 8);
        x -= rand(-3, 3);
        this.opacity -= 0.03;
        if (this.opacity <= 0) {
            this.destroyed = true;
            if (rand(0, 1) < 0.5) {
                return SF.addEntity(Smoke, x, y - this.r);
            }
        }
    };
    Trail.prototype.draw = function (x, y, w) {
        this.r = w / 6;
        y -= rand(rand(-45, 5), rand(25, 75));
        x -= rand(-w/2 - 20, w/2 + 20);
        var color, color2, g, rg;
        if (this.opacity <= 0) {
            return;
        }
        color = 'rgba(255,' + ~~(240 * this.opacity) + ',0,' + this.opacity + ')';
        color2 = 'rgba(255,' + ~~(240 * this.opacity) + ',0,0)';
        rg = this.r * 1.5 + rand(0, 2);
        g = ctx.createRadialGradient(x, y, 0, x, y, rg);
        g.addColorStop(0, color);
        g.addColorStop(1, color2);
        drawCircle(x, y, this.r, g);
        return drawCircle(x, y, this.r * this.opacity, color);
    };
    return Trail;
}();
Flame = function () {
    function Flame() {
        this.x = G.can.width / 2;
        this.y = G.can.height / 2 + 90;
        this.r = 24;
        this.rg = 22;
    }
    Flame.prototype.step = function (x, y, w) {
        return false;
    };
    Flame.prototype.draw = function (x, y, w) {
        this.g = ctx.createRadialGradient(x, y, 0, x, y, w * 1.2);
        this.g.addColorStop(0, 'rgba(255,255,255,1)');
        this.g.addColorStop(1, 'rgba(255,120,0,0)');


        var g, i, j;
        //for (i = j = 1; j <= 1; i = ++j) {
            SF.addEntity(Trail, x, y - this.r / 3);
        //}
        g = ctx.createRadialGradient(x, y, 0, x, y, this.rg);
        g.addColorStop(0, 'rgba(255,180,0,' + rand(0.2, 0.9) + ')');
        g.addColorStop(1, 'rgba(255,180,0,0)');
        drawCircle(x, y, this.rg, g);
        return drawCircle(x + rand(-1.5, 1.5), y + rand(-1.5, 1.5), w, this.g );
    };
    return Flame;
}();

SmokyFlame = function () {
    function SmokyFlame() {
        SF = this;
        this.entities = {};
        this.i = 0;
        this.ii = 0;
        // this.update();
    }
    SmokyFlame.prototype.addEntity = function () {
        var args, klass;
        klass = arguments[0], args = 2 <= arguments.length ? slice.call(arguments, 1) : [];
        this.entities[this.i] = function (func, args, ctor) {
            ctor.prototype = func.prototype;
            var child = new ctor(), result = func.apply(child, args);
            return Object(result) === result ? result : child;
        }(klass, args, function () {
        });
        return this.i += 1;
    };
    SmokyFlame.prototype.update = function (x, y, w) {
        var entity, k, ref;
        // ctx.clearRect(0, 0, W, H);
        ref = this.entities;
        for (k in ref) {
            entity = ref[k];
            if (entity.destroyed === true) {
                delete this.entities[k];
                continue;
            }

            if (this.ii % 5 === 0) {
                entity.step(x + (w / 2), y - 10, w);
                entity.draw(x + (w / 2), y - 10, w);
                this.ii = 0;
            }
            this.ii++;
        }
    };
    return SmokyFlame;
}();
var MN;
function Menu() {
    MN = this;
    this.y = 0;
    this.font = '50px Helvetica';
    this.fireColor = 'rgb(255, 56, 8)';

    ctx.fillStyle = '#fff'
    ctx.fillRect(0, 0, G.can.width, G.can.height);

    this.heat = MN.getHeatMap();
    this.noise = null;
    this.noise = MN.getNoise(G.can.width, G.can.height*8);
    ctx.drawImage(this.heat, 0, 0);
    this.update();
}
Menu.prototype = {
    getNoise: function () {
        var canvas = document.createElement('canvas');
        canvas.width = G.can.width;
        canvas.height = G.can.height;
        var ctx = canvas.getContext('2d');

        var w = canvas.width, h = canvas.height,
            img = ctx.createImageData(w, h),
            n = w * h * 4;

        for(var i = 0; i < n; i+=4) {
            img.data[i] = 15;
            img.data[i+1] = 3;
            img.data[i+2] = 1;
            img.data[i+3] = Math.floor(Math.random() * 128);
        }
        sv();
        ctx.putImageData(img, 0, 0);
        ctx.drawImage(canvas, 0, 0, w * 64, h * 64);
        ctx.globalAlpha = 0.5;
        ctx.drawImage(canvas, 0, 0, w * 16, h * 16);
        var img = ctx.getImageData(0, 0, w, h);
        // increase contrast a bit by clamping values
        for (var i = 3; i < w * h * 4; i += 4){
            if (img.data[i] > 220){
                img.data[i] = 255;
            }
            if (img.data[i] < 40){
                img.data[i] = 0;
            }
        }
        ctx.putImageData(img, 0, 0);
        rs();
        return canvas;
    },
    getHeatMap: function () {
        var canvas = document.createElement('canvas');
        canvas.width = G.can.width;
        canvas.height = G.can.height;

        var ctx = canvas.getContext('2d');
        sv();
        var w = G.can.width,
            h = G.can.height,
            color = MN.fireColor,
            firstText = G.isGameOver ? 'GAME' : 'SAVE',
            secondText = G.isGameOver ? 'OVER' : 'THE';
            thirdText = G.isGameOver ? '' : 'FOREST';

        if (G.isMobile()) {
            firstText = firstText.split('').join(' ');
            secondText = secondText.split('').join(' ');
            thirdText = thirdText.split('').join(' ');
        } else {
            firstText = firstText.split('').join('   ');
            secondText = secondText.split('').join('   ');
            thirdText = thirdText.split('').join('   ');
        }

        ctx.fillStyle = color;
        ctx.strokeStyle = color;
        ctx.font = MN.font;

        var m1 = ctx.measureText(firstText);
        var m2 = ctx.measureText(secondText);
        var m3 = ctx.measureText(thirdText);
        ctx.fillText(firstText, (w - m1.width) / 2, h / 6);
        ctx.fillText(secondText, (w - m2.width) / 2, h / 4);
        ctx.fillText(thirdText, (w - m3.width) / 2, h / 3);
        ctx.lineWidth = 10;

        if (!G.isInfoMenu) {
            var highestScoreText = 'BEST: ' + G.highscore;
            if (G.isMobile()) {
                highestScoreText = highestScoreText.split('').join(' ');
            } else {
                highestScoreText = highestScoreText.split('').join('   ');
            }
            ctx.fillStyle = '#fff';
            ctx.font = '35px Helvetica';
            ctx.fillText(highestScoreText, (w - ctx.measureText(highestScoreText).width) / 2, h / 2.1);

            // Sound circle
            ctx.beginPath();
            ctx.arc(w*(1/4), h/1.2, 30, 0, 2 * Math.PI, false);
            ctx.fillStyle = '#555';
            ctx.closePath();
            ctx.fill();

            // Rules / Instructions circle
            ctx.beginPath();
            ctx.arc(w*(3/4), h/1.2, 30, 0, 2 * Math.PI, false);
            ctx.fillStyle = '#555';
            ctx.closePath();
            ctx.fill();

            // sound icon
            ctx.beginPath();
            ctx.moveTo(w*(1/4) - 20, h/1.2 - 10);
            ctx.lineTo(w*(1/4) - 20, h/1.2 + 5);
            ctx.lineTo(w*(1/4) - 10, h/1.2 + 5);
            ctx.lineTo(w*(1/4) + 5, h/1.2 + 15);
            ctx.lineTo(w*(1/4) + 5, h/1.2 - 20);
            ctx.lineTo(w*(1/4) - 10, h/1.2 - 10);
            ctx.fillStyle = '#222';
            ctx.closePath();
            if (G.isSound) {
                ctx.fillRect(w*(1/4) + 10, h/1.2 - 5, 3, 10);
                ctx.fillRect(w*(1/4) + 15, h/1.2 - 7, 3, 15);
                ctx.fillRect(w*(1/4) + 20, h/1.2 - 10, 3, 20);
            }
            ctx.fill();

            // if no sound, show / on icon
            if (!G.isSound) {
                ctx.save();
                ctx.beginPath();
                    ctx.moveTo(w*(1/4) + 10, h/1.2 - 22);
                    ctx.lineTo(w*(1/4) - 10, h/1.2 + 22);
                ctx.closePath();
                ctx.fill();
                ctx.lineWidth = 5;
                ctx.strokeStyle = '#000';
                ctx.stroke();
                ctx.restore();
            }

            // instructions icon
            ctx.fillRect(w*(3/4) - 2, h/1.2, 5, 15);
            ctx.beginPath();
            ctx.arc(w*(3/4), h/1.2 - 10, 5, 0, 2 * Math.PI, false);
            ctx.closePath();
            ctx.fillStyle = '#222';
            ctx.fill();

            if (G.isGameOver) {
                ctx.fillStyle = '#fff';
                ctx.font = '35px Helvetica';
                var karmaText = 'KARMA: ' + G.karma;

                if (G.isMobile()) {
                    karmaText = karmaText.split('').join(' ');
                } else {
                    karmaText = karmaText.split('').join('   ');
                }

                ctx.fillText(karmaText, (w - ctx.measureText(karmaText).width) / 2, h / 2.5);
                ctx.lineWidth = 10;

                ctx.beginPath();
                    ctx.arc(w*(2/4), h/1.2, 30, 0, 2 * Math.PI, false);
                    ctx.fillStyle = '#555';
                ctx.closePath();
                ctx.fill();

                // download icon
                ctx.beginPath();
                    ctx.moveTo(w*(2/4) - 10, h/1.2 - 15);
                    ctx.lineTo(w*(2/4) - 10, h/1.2 - 15 + 15);
                    ctx.lineTo(w*(2/4) - 20, h/1.2 - 15 + 15);

                    ctx.lineTo(w*(2/4), h/1.2 - 15 + 35);
                    ctx.lineTo(w*(2/4) + 20, h/1.2 - 15 + 15);

                    ctx.lineTo(w*(2/4) + 10, h/1.2 - 15 + 15);
                    ctx.lineTo(w*(2/4) + 10, h/1.2 - 15);

                    ctx.fillStyle = '#222';
                ctx.closePath();
                ctx.fill();
            }

            // Play button
            ctx.beginPath();
                ctx.arc(w/2, h/1.6, 50, 0, 2 * Math.PI, false);
                ctx.fillStyle = '#793f02';
            ctx.closePath();
            ctx.fill();

            var tw = 20, th = h/1.6 - tw;
            ctx.beginPath();
                ctx.moveTo(w/2 - tw/2, th);
                ctx.lineTo(w/2 + tw, th + 20);
                ctx.lineTo(w/2 - tw/2, th + 40);
                ctx.fillStyle = '#fff';
            ctx.closePath();
            ctx.fill();
        } else {
            // back button
            var hFactor = G.isMobile() ? 10 : 4.4;

            ctx.beginPath();
            ctx.arc(w/10, h/hFactor, 30, 0, 2 * Math.PI, false);
            ctx.fillStyle = '#555';
            ctx.closePath();
            ctx.fill();

            ctx.beginPath();
                ctx.moveTo(w/10, h/hFactor-5);
                ctx.lineTo(w/10, h/hFactor-5 - 10);
                ctx.lineTo(w/10 - 20, h/hFactor-5 + 5);
                ctx.lineTo(w/10, h/hFactor-5 + 20);
                ctx.lineTo(w/10, h/hFactor-5 + 10);
                ctx.lineTo(w/10 + 20, h/hFactor-5 + 10);
                ctx.lineTo(w/10 + 20, h/hFactor-5);
            ctx.closePath();
            ctx.fillStyle = '#000';
            ctx.fill();

            // show info
            var instructionLines = [
                'Save our planet Earth!',
                'Protect Forest! Don\'t burn them!',
                'Abrupt climatic changes. Time to worry!',
                'Extinguish fire on trees.',
                'Hit spacebar or tap to jump player.',
                'Earn Karma! Nature will show her love!',
                'JS13KGames 16 - hidden glitches',
                'Climate Abnormalities, Player Loves Trees',
                '(Player struggles to jump off tree)',
                'More hinderances once speed > 1.6 mph'
            ];
            ctx.font = G.isMobile() ? '15px Helvetica' : '20px Helvetica';
            ctx.fillStyle = '#fff';
            for (var l = 0; l < instructionLines.length; l++) {
                var line = instructionLines[l];
                var hOffset = G.isMobile() ? l*40 : l*45;
                if (l === 0 || l === 2 || l === 4 || l === 6) {
                    ctx.beginPath();
                        ctx.arc(w / 10, h/2.6 + hOffset, 10, 0, 2*Math.PI, false);
                        ctx.fill();
                    ctx.closePath();
                }
                ctx.fillText(line, w/10 + (G.isMobile() ? 25: 50), h/2.6 + hOffset);
            }
        }
        rs();
        return canvas;
    },
     process: function () {
        sv();
        // cooldown factor
        ctx.globalAlpha = 0.35;
        ctx.globalCompositeOperation = 'source-over';
        // movement speed of cooldown map
        MN.y = (MN.y + 3) % MN.noise.height;
        // flickering of cooldown map
        x = Math.round(Math.random() * 5) * 0;
        ctx.drawImage(MN.noise, x, MN.y);
        ctx.drawImage(MN.noise, x, MN.y - MN.noise.height);

        // spread of the flame
        ctx.globalAlpha = 1.0;
        // whind
        x = 1 - Math.random() * 2;
        // move flame up
        ctx.drawImage(G.can, x, -1);
        ctx.globalAlpha = 0.13;
        ctx.globalCompositeOperation = 'lighter';
        ctx.drawImage(G.can, x, -1);

        // heat it up
        ctx.globalAlpha = 0.22;
        ctx.drawImage(MN.heat, 0, 0);
        fs(MN.fireColor);
        bp();
        ctx.globalAlpha = 0.52;
        cp();
        fl();
        rs();
    },
    mouseDown: function (e, x, y) {
        var w = G.can.width,
            h = G.can.height,
            ctx = MN.heat.getContext('2d');

        var hFactor = G.isMobile() ? 10 : 4.4;

        if (x >= w/2 - 50 && x <= w/2 + 50 &&
            y >= h/1.6 - 50 && y <= h/1.6 + 50) {
            // play btn clicked
            G.menu = null;
            G.restart();
            SU.play('playGame');
        } else if (x >= w*(2/4) - 30 && x <= w*(2/4) + 30 &&
            y >= h/1.2 - 30 && y <= h/1.2 + 30) {
            // download clicked
            downloadCanvas();
            SU.play('download');
        } else if (x >= w*(1/4) - 30 && x <= w*(1/4) + 30 &&
            y >= h/1.2 - 30 && y <= h/1.2 + 30) {
            // sound clicked
            G.isSound = +(!G.isSound);
            G.isSound && SU.play('soundOn');
            utils.setLocalStorageData(G.isSound, true);
            MN.heat = MN.getHeatMap();
        } else if (x >= w*(3/4) - 30 && x <= w*(3/4) + 30 &&
            y >= h/1.2 - 30 && y <= h/1.2 + 30) {
            // info clicked
            G.isInfoMenu = true;
            MN.heat = MN.getHeatMap();
            SU.play('info');
        } else if (x >= w*(1/10) - 30 && x <= w*(1/10) + 30 &&
            y >= h/hFactor - 30 && y <= h/hFactor + 30) {
            // back btn clicked
            G.isInfoMenu = false;
            MN.heat = MN.getHeatMap();
            SU.play('info');
        }
    },
    update: function () {
        // this.noise = MN.getNoise(G.can.width, G.can.height * 8);
        MN.process();
    }
};

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
/*var BG;
function Background() {
	BG = this;
	BG.animate();
}

Background.prototype = {
	burnBurnBurn: function() {
		var x, y, bottomLine = BG.canvasWidth * (BG.canvasHeight - 1);

		// draw random pixels at the bottom line
		for (x = 0; x < BG.canvasWidth; x++) {
			var value = 0;

			if (Math.random() > BG.threshold)
				value = 255;

			BG.fire[bottomLine + x] = value;
		}

		// move flip upwards, start at bottom
		var value = 0;

		for (y = 0; y < BG.canvasHeight; ++y) {
			for (var x = 0; x < BG.canvasWidth; ++x) {
				if (x == 0) {
					value = BG.fire[bottomLine];
					value += BG.fire[bottomLine];
					value += BG.fire[bottomLine - BG.canvasWidth];
					value /= 3;
				} else if (x == BG.canvasWidth -1) {
					value = BG.fire[bottomLine + x];
					value += BG.fire[bottomLine - BG.canvasWidth + x];
					value += BG.fire[bottomLine + x - 1];
					value /= 3;
				} else {
					value = BG.fire[bottomLine + x];
					value += BG.fire[bottomLine + x + 1];
					value += BG.fire[bottomLine + x - 1];
					value += BG.fire[bottomLine - BG.canvasWidth + x];
					value /= 4;
				}

				if (value > 1)
					value -= 1;

				value = Math.floor(value);
				var index = bottomLine - BG.canvasWidth + x;
				BG.fire[index] = value;
			}

			bottomLine -= BG.canvasWidth;
		}

		var skipRows = 1; // skip the bottom 2 rows

		// render the flames using our color table
		for (var y = skipRows; y < BG.canvasHeight; ++y) {
			for (var x = 0; x < BG.canvasWidth; ++x) {
				var index = y * BG.canvasWidth * 4 + x * 4;
				var value = BG.fire[(y - skipRows) * BG.canvasWidth + x];

				BG.data[index] = BG.colors[value][0];
				BG.data[++index] = BG.colors[value][1];
				BG.data[++index] = BG.colors[value][2];
				BG.data[++index] = 255;
			}
		}

		// sometimes change BG.fire intensity
		if (BG.intensity == null) {
			if (Math.random() > 0.95) {
				BG.randomizeThreshold();
			}
		}

		BG.ctx.putImageData(BG.imageData, 0, BG.CC.height - BG.canvasHeight);

	},
	randomizeThreshold: function() {
		BG.threshold += Math.random() * 0.2 - 0.1;
		BG.threshold = Math.min(Math.max(BG.threshold, 0.5), 0.8);
	},
	animate: function () {
		BG.intensity = null;
		BG.threshold = 0.5;
		BG.CC = document.querySelector('canvas');
		BG.ctx = BG.CC.getContext('2d');
		BG.canvasWidth = BG.CC.width;
		BG.canvasHeight = 50 || P.fireOffset;
		BG.imageData = BG.ctx.getImageData(0, BG.CC.height - BG.canvasHeight, BG.canvasWidth, BG.canvasHeight);
		BG.data = BG.imageData.data;
		//BG.numPixels = BG.data.length / 4;
		BG.colors = [];

		for (var i = 0; i < 256; i++) {
			var color = [];
			color[0] = color[1] = color[2] = 75;
			BG.colors[i] = color;
		}

		for (var i = 0; i < 32; ++i) {
			BG.colors[i][2] = i << 1;
			BG.colors[i + 32][0] = i << 3;
			BG.colors[i + 32][2] = 64 - (i << 1);
			BG.colors[i + 64][0] = 255;
			BG.colors[i + 64][1] = i << 3;
			BG.colors[i + 96][0] = 255;
			BG.colors[i + 96][1] = 255;
			BG.colors[i + 96][2] = i << 2;
			BG.colors[i + 128][0] = 255;
			BG.colors[i + 128][1] = 255;
			BG.colors[i + 128][2] = 64 + (i << 2);
			BG.colors[i + 160][0] = 255;
			BG.colors[i + 160][1] = 255;
			BG.colors[i + 160][2] = 128 + (i << 2);
			BG.colors[i + 192][0] = 255;
			BG.colors[i + 192][1] = 255;
			BG.colors[i + 192][2] = 192 + i;
			BG.colors[i + 224][0] = 255;
			BG.colors[i + 224][1] = 255;
			BG.colors[i + 224][2] = 224 + i;
		}

		BG.fire = [];
		// init BG.fire array
		for (var i = 0; i < BG.canvasWidth * BG.canvasHeight; i++) {
			BG.fire[i] = 75;
		}

		BG.burnBurnBurn();

		// intercept key up event to change intensity on BG.fire effect
		document.body.onkeyup = function(event) {
			if (event.keyCode >= 97 && event.keyCode <= 105) {
				BG.intensity = (event.keyCode - 97);
				BG.intensity = BG.intensity / 8;
				BG.intensity = BG.intensity * 0.4;
				BG.intensity = BG.intensity + 0.2;
				BG.threshold = 1 - BG.intensity;
			} else if (event.keyCode == 96) { // 0 ==> randomize
				BG.intensity = 0;
				BG.randomizeThreshold();
			}
 		};

	}
};*/

var flameBack = new function() {
    var context;
    var buffer;
    var bufferContext;
    var imageData;
    var palette;
    var colorMap;
    var width;
    var height;
    var scale = 2;
    var fan = 2.5;
    var slack = 5;
    this.time = new Date();

    this.canvas = undefined;

    this.init = function() {
        context = this.canvas.getContext('2d');

        width = (this.canvas.width + 30) / scale;
        height = P.fireOffset / scale;

        width = Math.ceil(width);
        height = Math.ceil(height);

        colorMap = Array(width * height);

        for(var i = 0; i < colorMap.length; i++)
            colorMap[i] = 255;

        initPalette();
        initBuffer();

        this.update();
    };

    // init palette from warm to white hot colors
    var initPalette = function() {
        palette = Array(256);

        for(var i = 0; i < 64; i++) {
            palette[i] = [(i << 2), 0, 0];
            palette[i + 64] = [255, (i << 2), 0];
            palette[i + 128] = [255, 255, (i << 2)];
            palette[i + 192] = [255, 255, 255];
        }
    };

    // offscreen buffer for rendering and scaling
    var initBuffer = function() {
        buffer = document.createElement('canvas');
        buffer.width = width;
        buffer.height = height;
        buffer.style.visibility = 'hidden';

        bufferContext = buffer.getContext('2d');
        imageData = bufferContext.createImageData(width, height);
    };

    // main render loop
   this.update = function() {
   		if (!G.isMobile()) {
	        smooth();
	        draw();
	        fan = utils.getRandomInt(0, 6);
	    } else {
	    	var grd = ctx.createLinearGradient(0, CC.h - P.fireOffset , 0, G.can.height);
	    	grd.addColorStop(0, 'rgba(255, 0, 0, ' + utils.getRandomInt(8, 10)/10 + ')');
	    	grd.addColorStop(0.7, 'rgba(255, 165, 0, ' + utils.getRandomInt(8, 10)/10 + ')');
	    	grd.addColorStop(0.9, 'rgba(255, 255, 0, ' + utils.getRandomInt(8, 10)/10 + ')');
	    	sv();
	    	fs(grd);
	    	fr(0, CC.h - P.fireOffset, G.can.width, P.fireOffset)
	    	rs();
	    }
    };

    var smooth = function() {
        for(var x = width - 1; x >= 1; x--) {
            for(var y = height; y--;) {
                var p = ((
                    colorMap[toIndex(x - 1, y - 1)] +
                    colorMap[toIndex(x, y - 1)] +
                    colorMap[toIndex(x + 1, y - 1)] +
                    colorMap[toIndex(x - 1, y)] +
                    colorMap[toIndex(x + 1, y)] +
                    colorMap[toIndex(x - 1, y + 1)] +
                    colorMap[toIndex(x, y + 1)] +
                    colorMap[toIndex(x + 1, y + 1)]) >> 3);

                p = Math.max(0, p - randomValue(fan));

                colorMap[toIndex(x, y - 1)] = p;

                if (y < height - slack) { // don't draw random noise in bottom rows
                    if (y < height - 2) {
                        // set two lines of random palette noise at bottom of
                        // colorMap
                        colorMap[toIndex(x, height)] =
                            randomValue(palette.length);
                        colorMap[toIndex(x, height - 1)] =
                            randomValue(palette.length);
                    }

                    drawPixel(x, y, palette[colorMap[toIndex(x, y)]]);
                }
            }
        }
    };

    // draw colormap->palette values to screen
    var draw = function() {
        // render the image data to the offscreen buffer...
        bufferContext.putImageData(imageData, 0, 0);
        // ...then draw it to scale to the onscreen canvas
        context.drawImage(buffer, -20, CC.h - (height * scale), width * scale, height * scale + 10);
    };

    // set pixels in imageData
    var drawPixel = function(x, y, color) {
        var offset = (x + y * imageData.width) * 4;
        imageData.data[offset] = color[0];
        imageData.data[offset + 1] = color[1];
        imageData.data[offset + 2] = color[2];
        imageData.data[offset + 3] = 255;
    };

    var randomValue = function(max) {
        // protip: a double bitwise not (~~) is much faster than
        // Math.floor() for truncating floating point values into "ints"
        return ~~(Math.random() * max);
    };

    // because "two-dimensional" arrays in JavaScript suck
    var toIndex = function(x, y) {
        return (y * width + x);
    };

    // draw a bunch of random embers onscreen
    this.drawEmbers = function() {
        for(var x = 1; x < width - 1; x++) {
            for(var y = 1; y < height; y++) {
                if(Math.random() < 0.11)
                    colorMap[toIndex(x, y)] = randomValue(palette.length);
            }
        }
    };
};

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


var G, ctx, CC, background, player, weather, smoky;
function Game() {
	G = this;
	G.isInProgress = true;
	G.canSpeedBeIncreased = G.canExplode = true;
	G.backgroundColor = '#fff';

	G.karma = 0;

	G.highscore = utils.getLocalStorageData() || 0;
	G.isSound = utils.getLocalStorageData(true);
	if (G.isSound !== 0) {
		G.isSound = 1;
	}

	G.resolution = 1;
	G.curPos = [];

	G.can = document.querySelector('canvas');
	G.can.width = P.w;
	G.can.height = P.h;

	ctx = G.ctx = window.c = G.can.getContext('2d');

	G.trees = [];

	// Resizing
	G.resize();
	addEventListener('resize', G.resize, false);

	CC = document.getElementById('canvascontainer').style;

	document.body.addEventListener('touchstart', G.touchStart.bind(G), false);
	document.body.addEventListener('touchmove', G.touchMove.bind(G), false);
	document.body.addEventListener('touchend', G.touchEnd.bind(G), false);
	document.body.addEventListener('mousedown', G.mouseDown.bind(G), false);
	document.body.addEventListener('mousemove', G.mouseMove.bind(G), false);
	document.body.addEventListener('mouseup', G.mouseUp.bind(G), false);

	document.body.addEventListener('keydown', G.keyDown.bind(G), false);
	document.body.addEventListener('keyup', G.keyUp.bind(G), false);

	// Loop
	G.frameCount = 0;
	G.lastFrame = G.frameCountStart = Date.now();

	var displayablePixels = _.innerWidth * _.innerHeight * _.devicePixelRatio,
		gamePixels = P.w * P.h,
		ratio = displayablePixels / gamePixels;

	if (ratio < 0.5){
		G.setResolution(ratio * 2);
	}

	G.speed = 1;

	// background animation
	// background = new Background();
	flameBack.canvas = G.can;
	//flameBack.init();

	G.menu = true;
}

var tree, time;
Game.prototype = {
	restart: function () {
		G.isGameOver = false;
		G.isInProgress = true;
		G.karma = 0;
		G.speed = 1;
		G.gameStartTime = new Date().getTime();

		smoky =  new SmokyFlame();

		blw = 200, bw =0;
		G.addInitialtrees();

		player = new Player();
		Pl.x = G.trees[0].x;

		flameBack.init();
		weather = new Weather();
		G.raf = raf(function(){
			if (G.raf) {
				G.cycle();
				raf(arguments.callee);
			}
		});
	},
	stopCycle: function () {
		G.isGameOver = true;
		G.isInProgress = false;

		flameBack.update();
		canvasToImage(); // get image before spash screen

   		// console.log('Boom! DIE!');
   		// update high score
   		if (G.karma > G.highscore) {
   			SU.play('highestScore');
   			G.highscore = G.karma;
   			utils.setLocalStorageData(G.karma);
   		}

   		SU.play('gameOver');

  		G.menu = new Menu();
	},
	cycle: function () {
		var now = new Date().getTime();
		dt = now - time;

		if (dt < (1000 / fps))
			return; // skip a frame

		//SU.play('game');
		time = now;
		if (G.menu) {
			G.menu.update && G.menu.update();
			return;
		}

		if (G.canExplode && M.ceil((now - G.gameStartTime) / 1000) % 6 === 0) {
			G.mildExplosion ? SU.play('explosion2') : SU.play('explosion1');
			G.mildExplosion = !G.mildExplosion;
			G.canExplode = false;
		} else if (M.ceil((now - G.gameStartTime) / 1000) % 7 === 0) {
			G.canExplode = true;
		}

		if (G.canSpeedBeIncreased && M.ceil((now - G.gameStartTime) / 1000) % 10 === 0) {
			G.speed += G.isMobile() ? 0.1 : 0.2;
			WD.speed = utils.getRandomInt(1, 30);
			G.canSpeedBeIncreased = false;
		} else if (M.ceil((now - G.gameStartTime) / 1000) % 11 === 0) {
			// G.speed += 0.1;
			G.canSpeedBeIncreased = true;
		}

		fs(G.backgroundColor);
		fr(0, 0, CC.w, CC.h);

		var speedIncFactor = G.isMobile() ? 1.1 : 1.6;
		if (G.speed >= speedIncFactor &&
			utils.getRandomInt(0, 10) === 10
		) {
			G.showNoisyScreen();
			utils.getRandomInt(0, 10) === 4 && SU.play('glitch');
		}

		//background.burnBurnBurn();
		weather.update();

		ctx.font = '15px Comic Sans';
		ctx.fillStyle = thisWeather.hexToRgb(thisWeather.getColor(true), 1.0);
		ctx.fillText('KARMA: ' + G.karma, 25, 25);
		ctx.fillText('SPEED: ' + G.speed.toFixed(1) + ' mph', G.can.width - 130, 25);
		ctx.fillText('WIND:  ' + WD.speed.toFixed(1) + ' mph W', G.can.width - 130, 45);
		ctx.lineWidth = 3;

		if (G.trees.length) {
			for (var i = 0; i < G.trees.length; i++) {
				G.trees[i].x -= G.speed;
				G.trees[i].update(G.trees[i]);

				if (G.trees[i].x < 0 - G.trees[i].width) {
					G.trees[i] = new Tree();
				}
			}
			player.update();
		}
		flameBack.update();
	},
	showNoisyScreen: function () {
		var w = G.can.width,
	       h = G.can.height,
	       idata = ctx.createImageData(w, h),
	       buffer32 = new Uint32Array(idata.data.buffer),
	       len = buffer32.length,
	       i = 0;

	   for (; i < len;) {
	       buffer32[i++] = ((255 * Math.random())|0) << 24;
	   }

	   ctx.putImageData(idata, 0, 0);
	},
	addInitialtrees: function () {
		G.trees = [];
		G.trees.push(new Tree({isNoFlame: true}))
		for (var i = 0; i < 5; i++) {
			G.trees.push(new Tree())
		}
	},
	resize: function() {
		setTimeout(function(){
			var maxWidth = innerWidth,
				maxHeight = innerHeight,

				availableRatio = maxWidth / maxHeight,
				baseRatio = P.w / P.h,
				ratioDifference = abs(availableRatio - baseRatio),
				width,
				height,
				s = document.getElementById('canvascontainer').style;

			if (availableRatio <= baseRatio){
				width = maxWidth;
				height = maxHeight;//width / baseRatio;
			} else{
				height = maxHeight;
				width = height * baseRatio;
			}

			s.width = width + 'px';
			s.height = height + 'px';

			ctx.globalCompositeOperation="lighter";

			G.can.width = width;
			G.can.height = height;


			if (G.menu) {
				G.menu = new Menu();
				G.raf = raf(function(){
					if (G.raf) {
						G.cycle();
						raf(arguments.callee);
					}
				});
				return;
			}

			G.restart();

		},100);
	},
	isMobile: function () {
		if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i
	      .test(navigator.userAgent)) {
	      return true;
	    }
	    return false;
	},
	pos : function(e){
		var rect = G.can.getBoundingClientRect(),
			pos = [];

		e = e.touches || [e];

		for(var i = 0 ; i < e.length ; i++){
			pos.push({
				x : (e[i].clientX),// - rect.left) / (rect.width / P.w),
				y : (e[i].clientY)// - rect.top) / (rect.height / P.h)
			})
		}

		return pos;
	},
	touchStart : function(e,m) {
		e.preventDefault();
		G.touch = G.touch || !m;
		var p = G.pos(e);
		G.curPos = p;

		scrollTo(0, 1);

		if (G.menu) {
			var x = G.curPos[0].x - G.can.offsetLeft,
				y = G.curPos[0].y - G.can.offsetTop;

			G.menu.mouseDown && G.menu.mouseDown(e, x, y);
		} else {
			// G.isTouching = true;
			G.keyDown({keyCode: 32});
		}

		if(!G.isInProgress) return;

		//G.world.touchStart();
	},
	touchMove : function(e) {
		e.preventDefault();
		if (G.curPos){
			G.curPos = G.pos(e);

			if(!G.isInProgress) return;
			//G.world.touchMove();
		}
	},
	touchEnd : function(e) {
		e.preventDefault();

		var p = G.curPos[0];
		G.curPos = G.pos(e);

		if (!G.isInProgress) {
			//!G.isInProgress.click(p.x, p.y);
		} else {
			//G.world.touchEnd();
		}
	},
	keyDown: function(e) {
		// 13 is enter
		if ((e.keyCode === 13 || e.keyCode === 32) && G.menu) {
			G.menu = null;
            G.restart();
            SU.play('playGame');
			return;
		}
		if (!G.isInProgress) {
			return;
		}

		// 39 is right, 40 is down, 38 is up
		if (e.keyCode === 39 || e.keyCode === 38 || e.keyCode === 32) {
			player && player.keyDown(e.keyCode);
		}
	},
	keyUp: function(e) {
		if(!G.isInProgress) return;
		player && player.keyUp(e.keyCode);
	},
	mouseDown: function(e) {
		/*if(!G.touch){
			G.touchStart(e, true);
		}*/
		if (G.menu) {
			var x = e.pageX - G.can.offsetLeft,
				y = e.pageY - G.can.offsetTop;

			G.menu.mouseDown && G.menu.mouseDown(e, x, y);
		}
	},
	mouseMove: function(e) {
		/*if(!G.touch){
			G.touchMove(e);
		}*/
	},
	mouseUp: function(e) {
		/*if(!G.touch){
			G.touchEnd(e);
		}*/
	},
	setResolution: function(r) {
		G.can.width = P.w * r;
		G.can.height = P.h * r;

		G.resolution = r;
	}
}
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

