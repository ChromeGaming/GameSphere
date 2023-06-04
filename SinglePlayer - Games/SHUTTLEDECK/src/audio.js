import bus from './bus.js'

function Audio() {
  var audioCtx = null;
  var sampleRate = null;

  // Sounds to be loaded on init (cursed AudioContext waiting for interaction)
  var gateCloseSound;
  var gateOpenSound;
  var buySound;
  var mineralSound;
  var collisionSound;
  var laneSound;
  var missileSound;
  var laserSound;
  var pulseBreakerSound;
  var hopSound;
  var dashSound;
  var hyperSound
  var healSound;
  var musicBuffer;
  var rocketBuffer;

  var sin = (i) => Math.min(Math.max(Math.sin(i), -1), 1)
  var saw = (i) => ((i % 6.28)-3.14)/6.28;
  var sqr = (i) => Math.min(Math.max(Math.sin(i) * 1000, -1), 1)
  var win = (i, ts, te) => {
    if (i<ts*44100 || i>te*44100) {return 0;}
    return 1 - ((i/44100) - ts)/(te - ts);
  }
  var note = (i, tone, time, dur) => 0.01*sqr(i / (80/Math.pow(2,tone/12))) * win(i,time,time+dur);
  var hhat = (i, time) => 0.02*Math.random() * win(i,time,time+0.06);

  var generate = (duration, fn, fading = true) => {
    var audioBuffer = audioCtx.createBuffer(1, sampleRate * duration, sampleRate);
    var buffer = audioBuffer.getChannelData(0);
    var N = audioBuffer.length;
    var anim = 0;
    for (var i = 0; i < N; i++) {
      var p = i / N;
      var envelope = 1 - p;
      if (!fading) { envelope = 1; }
      buffer[i] = fn(i*44100/sampleRate) * envelope;
    }
    return audioBuffer;
  }

  this.init = () => {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    sampleRate = audioCtx.sampleRate;

    // Transition animation - Gate whirring close
    gateCloseSound = generate(0.6, (i) => {
      return 0.05 * sqr(i/250) * (sin(i/300)+0);
    });

    // Transition animation -  Gate whirring open + noise of steam
    gateOpenSound = generate(1, (i) => {
      return 0.05 * sqr(i/250) * (sin(i/300)+0) + 0.1 * Math.random() * win(i, 0, 1);
    });

    // Buy an item (ding + ding)
    buySound = generate(0.7, (i) => {
      return 0.07 * (saw(i/19) * win(i, 0, 0.15) + saw(i/11) * win(i, 0.1, 0.7));
    });

    // Gain mineral blip + Siphon sound
    mineralSound = generate(0.15, (i) => {
      return 0.04 * sin(i/(15 - i / 2000));
    });

    // Collision / take damage
    collisionSound = generate(0.8, (i) => {
      return 0.1 * Math.random() * win(i, 0, 0.8) * (sqr(i/200)+1);
    });

    // Swap lane
    laneSound = generate(0.4, (i) => {
      return 0.04 * (1+Math.random()/3) * win(i, 0, 0.4) * sin(i/50);
    });

    // Kepler missile + Crazy Rockets + Nuke
    missileSound = generate(0.7, (i) => {
      return 0.04 * Math.random() * win(i, 0, 0.7) * (sqr(i/100) + 1);
    });

    // Sigma cannon / laser
    laserSound = generate(1.5, (i) => {
      return 0.08 * (sin(i/(30-i/400)) * win(i, 0, 0.15) * 3 + saw(i/60)*(sqr(i/400)+1)/2*win(i,0.1,1.5))
    });

    // Pulse breaker
    pulseBreakerSound = generate(1, (i) => {
      return 0.04 * sin(i/50)*(sqr(i/800+1)+1);
    });

    // Hop sound
    hopSound = generate(0.7, (i) => {
      return 0.1 * (
        saw(i/30) * win(i, 0, 0.1) +
        saw(i/50) * win(i, 0.1, 0.2) +
        saw(i/40) * win(i, 0.2, 0.3) +
        saw(i/20) * win(i, 0.3, 0.4) +
        saw(i/10) * win(i, 0.4, 0.5)
      );
    });

    // Dash sound
    dashSound = generate(0.7, (i) => {
      var acc = 0;
      for (let q = 0; q < 10; q++) {
        acc += sin(i/(10+q*q/20)) * win(i, q/10, (q+1)/10);
      }
      return 0.05*acc;
    });

    // Hyperdrive sound
    hyperSound = generate(1.5, (i) => {
      var acc = 0;
      for (let q = 0; q < 13; q++) {
        acc += sqr(i/(10-q*q/15)) * win(i, q/15, (q+1)/15);
        acc += sqr(i/(40-q*q/3)) * win(i, q/15+0.03, (q+1)/15);
      }
      return 0.05*acc;
    });

    // Heal sound
    healSound = generate(0.6, (i) => {
      return 0.04 * sin(i/(50-i/2000))*(sqr(i/700+1)+1);
    });

    musicBuffer = generate(0.2*48, (i) => {
      var d = 0.2;
      var acc = 0;
      for (let q = 0; q < 48; q+=8) {
        acc += hhat(i, d*(q+0))+
          hhat(i, d*(q+1))+
          hhat(i, d*(q+2))*3+
          hhat(i, d*(q+3))+
          hhat(i, d*(q+4))+
          hhat(i, d*(q+6))*3;
      }
      // Phrase 1
      acc += note(i, 12, d * 8, d * 1) +
        note(i, 7, d * 11, d * 1) +
        note(i, 10, d * 14, d * 1.5) +
        note(i, 9, d * 16, d * 1.5) +
        note(i, 3, d * 18, d * 1.5) +
        // Phrase 2
        note(i, 6, d * 32, d * 1) +
        note(i, 3, d * 35, d * 1) +
        note(i, 5, d * 38, d * 1.5) +
        note(i, 3, d * 40, d * 1.5) +
        note(i, 0, d * 42, d * 1.5);
      return acc;
    }, false);

    rocketBuffer = generate(3, (i) => {
      return 0.01 * (saw(i/300)*sqr(i/130) + 1);
    }, false);
  }

  var play = (audioBuffer) => {
    var source = audioCtx.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(audioCtx.destination);
    source.start();
  };

  this.setup = () => {
    if (audioCtx == null) { this.init(); }
    bus.on('txn', () => { play(gateCloseSound); });
    bus.on('txn-done', () => { play(gateOpenSound); });
    bus.on('buy', () => { play(buySound); });
    bus.on('mineral', () => { play(mineralSound); });
    bus.on('mine', () => { play(mineralSound); });
    bus.on('hit', () => { play(collisionSound); });
    bus.on('boom', () => { play(collisionSound); });
    bus.on('lane', () => { play(laneSound); });
    bus.on('hop', () => { play(hopSound); });
    bus.on('dash', () => { play(dashSound); });
    bus.on('hyper', () => { play(hyperSound); });
    bus.on('heal', () => { play(healSound); });
    bus.on('projectile', (t) => {
      if (t==1 || t==4 || t==5) {play(missileSound);}
      if (t==2) {play(laserSound);}
      if (t==3) {play(pulseBreakerSound);}
    });
  };

  var musicSource = null;
  this.music = () => {
    if (audioCtx == null) { this.init(); }
    musicSource = audioCtx.createBufferSource();
    musicSource.buffer = musicBuffer;
    musicSource.loop = true;
    musicSource.connect(audioCtx.destination);
    musicSource.start();
  };
  this.bgRocket = () => {
    if (audioCtx == null) { this.init(); }
    musicSource = audioCtx.createBufferSource();
    musicSource.buffer = rocketBuffer;
    musicSource.loop = true;
    musicSource.connect(audioCtx.destination);
    musicSource.start();
  };
  this.stopMusic = () => {
    try {
      if (musicSource != null) { musicSource.stop(); }
    } catch (e) {}
  }
}

export default new Audio();