$.Audio = {

	init: function(g) {

		var aCtx = AudioContext || webkitAudioContextx;
		this.ctx = (aCtx) ? new aCtx : false;
    this.g = g;

		if (this.ctx) {
			this.encode();
		}

	},

	encode: function() {
		var s = this;
		s.sounds = [];

		var convert = function(data) {
			var len, bytes, i;
			data = jsfxr(data);
			data = atob(data.substr(data.indexOf(',')+1));
			len = data.length;
			bytes = new Uint8Array( len );
			for (i = 0; i < len; i++)        {
					bytes[i] = data.charCodeAt(i);
			}
			return bytes.buffer;

		};

		var decode = function(n) {
			s.ctx.decodeAudioData( convert($.data.sfx[n]), function(b) {
				s.sounds[n] = b;
			});
		};

		for (var n in $.data.sfx) {
			decode(n);
			};

	},

	play: function(sfx) {
		if (this.ctx && this.sounds[sfx]) {
			var source = this.ctx.createBufferSource();
			source.buffer = this.sounds[sfx];
			source.connect(this.ctx.destination);
			source.start(0);
		}
	},

  say: function(msg, rate = 1.1) {
    if (this.g.firefox) {
      return;
    }
    var u = new SpeechSynthesisUtterance(msg);
    u.lang = 'en-US';
    u.rate = rate;
    u.pitch = 0.1;
    window.speechSynthesis.speak(u);
  }


};


