function MusicManager() {
  this.audioButton = new AudioButton();
  this.music = new Audio();
  this.loaded = false;
  this.tempoInBpm = 96;  // in bpm
  this.timePerBeat = 60 / this.tempoInBpm;  // in seconds
  this.hasEnded = false;
  var that = this;
  loaded++;
  this.music.addEventListener("loadeddata", function() {
    that.loaded || loaded--;
    that.loaded = true;
  });
  this.music.addEventListener("canplay", function() {
    that.loaded || loaded--;
    that.loaded = true;
  });
  this.music.volume = 0.6;
  this.music.src = "res/music.ogg";
  this.state = "menu";
  document.body.appendChild(this.music);
  this.beat = 0;
  this.musicLength = 70;  // in seconds
}

MusicManager.prototype.changeState = function(state) {
  this.state = state;
  if (state === 'game') {
    this.music.play();
  }
};

MusicManager.prototype.update = function() {
  if (this.loaded && this.state === "game") {
    this.updateBeatBean();
  }
  if (this.music.currentTime >= this.musicLength) {
    this.hasEnded = true;
  }
};

MusicManager.prototype.updateBeatBean = function() {
  this.beat = 1 - ((this.tempoInBpm * this.music.currentTime / 60) % 1);
};
