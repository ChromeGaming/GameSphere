var Music = function() {
    
    // audio buffers
    this.buffers = [];
    this.loaded = 0;

    // sequence playback
    this.currStep = -1;
    this.percStep = -1;
    this.bassStep = -1;
	
    // 99 is a rest
    var a = 99;

    // game level/height sets tempo
    this.lev = 0; 

    // melody
    this.seq = [];
    while (this.seq.length < 64) this.seq.push(a);
    while (this.seq.length < 96) this.seq.push(4,a,a,a,  7,a,a,a,  5,a,a,a,  9,a,a,a, 7,a,9,a,  11,a,12,a,  a,a,a,a, a,a,a,a);
    while (this.seq.length < 128) this.seq.push(a);

    // percussion
    this.perc = [];
    while (this.perc.length < 64) this.perc.push(0,a,a,a,  a,a,a,a,  1,1,a,a,  a,a,a,a);
    
    // bass
    this.bass = [];
    while (this.bass.length < 64) this.bass.push(-8,a,a,a, a,a,a,a, -7,a,a,a,  a,a,a,a, -5,a,a,a,  a,a,a,a, 0,a,a,a,  a,a,a,a);

    // note frequencies
    //           C3     C#3    D3     D#3    E3     F3     F3#    G3     G3#    A3     A3#    B3     C4     C#4    D4     D#4    E4     F4     F#4    G4     G#4
    //           -12    -11    -10    -9     -8     -7     -6     -5     -4     -3     -2     -1     0      1      2      3      4      5      6      7      8      9      10     11     12 
    this.freq = [130.8, 138.6, 146.8, 155.6, 164.8, 174.6, 185.0, 196.0, 207.7, 220.0, 233.1, 246.9, 261.6, 277.2, 293.7, 311.1, 329.6, 349.2, 367.0, 392.0, 415.3, 440.0, 466.2, 493.9, 523.3];
    
    // c4 (middle C) is at index 12 in the frequencies array
    this.freqOffset = 12;

    // ms interval
    this.interval = 100;

    this.jumpSFX = null;
    this.jumpInt = null;

    this.load("a/trumpet.mp3", 0);
    this.load("a/hat.mp3", 1);
}

Music.prototype = {
    
	load : function(file, buf) {

        var self = this;

        var req = new XMLHttpRequest();
        req.open("GET", file, true);
        req.responseType = "arraybuffer";

        req.onload = function() {

            audioCtx.decodeAudioData(req.response, function(b) {

                self.buffers[buf] = b;
                self.loaded++;

                // all sounds loaded
                if (self.loaded == 2) {

                    self.onLoad();
                }
            },

            function(e){

            });
        }

        req.send();
    },

    onLoad : function() {

        this.play();
    },

	getFreq : function(offset) {

        var perc = this.freq[this.freqOffset + offset] / this.freq[this.freqOffset];
        return perc;        
    },

    note : function(b, n) {

        // 99 is a rest
        if (n != 99) {
        
            var src = audioCtx.createBufferSource();

            // which sound to play
            src.buffer = this.buffers[b];

            // connect the source to the context destination
            src.connect(audioCtx.destination);

            src.start(0);
		    src.playbackRate.value = this.getFreq(n);
        }
        
        // melody buffer controls timer
        if (b == 1) {
        
            var self = this;
            setTimeout(function() { self.onNote() }, this.interval);
        }
    },

    jump : function() {

        this.jumpSFX = audioCtx.createBufferSource();
        this.jumpSFX.buffer = this.buffers[0];

        // connect the source to the context destination
        this.jumpSFX.connect(audioCtx.destination);

        this.jumpSFX.start(0);
        this.jumpSFX.playbackRate.value = 1;

        var self = this;
        clearInterval(this.jumpInt);
        this.jumpInt = setInterval(function() { self.jumpFreq() }, 10);
    },

    jumpFreq : function() {

        this.jumpSFX.playbackRate.value += 0.1;
    },

    land : function() {

        var src = audioCtx.createBufferSource();
        src.buffer = this.buffers[1];

        // connect the source to the context destination
        src.connect(audioCtx.destination);

        src.start(0);
		src.playbackRate.value = this.getFreq(-8);
    },

    onNote : function() {

        // use this for sequences
        if (this.currStep >= 0) {

            this.currStep++;
            this.percStep++;
            this.bassStep++;

            // loop
            if (this.currStep > this.seq.length - 1) {
                
                this.currStep = 0;

                this.interval = Math.max(60, 100 - (this.lev / 10));
            }

            if (this.percStep > this.perc.length - 1) this.percStep = 0;
            if (this.bassStep > this.bass.length - 1) this.bassStep = 0;

            this.note(0, this.seq[this.currStep]);
            this.note(0, this.bass[this.bassStep]);
            this.note(1, this.perc[this.percStep]);
        }
    },

    play : function() {

        this.currStep = this.percStep = this.bassStep = 0;

        this.note(0, this.seq[0]);
        this.note(0, this.bass[0]);
        this.note(1, this.perc[0]);
    },

    stop : function() {

        this.currStep = this.percStep = this.bassStep = -1;
    },

    setLev : function(lev) {

        this.lev = lev;
    }
}