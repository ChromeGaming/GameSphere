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