async function main() {
  setFontMeasurement();
  getBestTime();
  loadingScene.show();

  // i couldn't figure out how to transform a buffer into an audio element or
  // vise versa, so we're just going to do the work twice
  let songGen = new sonantx.MusicGenerator(song);
  let promises = [];

  promises.push(new Promise((resolve) => {
    songGen.createAudio(function(a) {
      audio = a;
      console.log("audio")
      resolve();
    });
  }), new Promise((resolve) => {
    songGen.createAudioBuffer(function(b) {
      buffer = b;
      console.log("buffer")
      resolve();
    });
  }));

  Promise.all(promises).then(() => {
    generateWaveData();
    loadingScene.hide(() => {
      menuScene.show(() => startBtn.focus());
    });
  });

  // music from https://opengameart.org/content/adventure-theme
  // await fetchAudio('./' + songName);
  // menuScene.show(() => startBtn.focus());
}

main();