//------------------------------------------------------------
// Audio functions
//------------------------------------------------------------
let context = new (window.AudioContext || window.webkitAudioContext)();
uploadFile.addEventListener('change', uploadAudio);

/**
 * Load audio file as an ArrayBuffer.
 * @param {string} url - URL of the audio file
 * @returns {Promise} resolves with decoded audio data
 */
function loadAudioBuffer(url) {

  // we can't use fetch because response.arrayBuffer() isn't supported
  // in lots of browsers
  return new Promise((resolve, reject) => {
    let request = new XMLHttpRequest();
    request.responseType = 'arraybuffer';

    request.onload = function() {
      context.decodeAudioData(request.response, decodedData => {
        resolve(decodedData)
      });
    };

    request.open('GET', url, true);
    request.send();
  });
}

/**
 * Load audio file as an Audio element.
 * @param {string} url - URL of the audio file
 * @returns {Promise} resolves with audio element
 */
function loadAudio(url) {
  return new Promise((resolve, reject) => {
    let audioEl = document.createElement('audio');

    audioEl.addEventListener('canplay', function() {
      resolve(this);
    });

    audioEl.onerror = function(e) {
      console.error('e:', e);
      reject(e);
    };

    audioEl.src = url;
    audioEl.load();
  })
}

/**
 * Upload an audio file from the users computer.
 * @param {Event} e - File change event
 */
async function uploadAudio(e) {
  menuScene.hide();
  loadingScene.show();

  // clear any previous uploaded song
  URL.revokeObjectURL(objectUrl);

  let file = e.currentTarget.files[0];
  objectUrl = URL.createObjectURL(file);
  songName = uploadFile.value.replace(/^.*fakepath/, '').substr(1);

  await fetchAudio(objectUrl);
  getBestTime();
  loadingScene.hide();
  startBtn.onDown();
}

/**
 * Generate the wave data for an audio file.
 * @param {string} url - URL of the audio file
 */
async function fetchAudio(url) {
  buffer = await loadAudioBuffer(url);
  audio = await loadAudio(url);

  generateWaveData();

  return Promise.resolve();
}

function generateWaveData() {
  // numPeaks determines the speed of the game, the less peaks per duration, the
  // slower the game plays
  let numPeaks = audio.duration / 8 | 0;
  peaks = exportPCM(1024 * numPeaks);  // change this by increments of 1024 to get more peaks

  startBuffer = new Array(maxLength / 2 | 0).fill(0);

  // remove all negative peaks
  let waves = peaks
    .map((peak, index) => peak >= 0 ? peak : peaks[index-1]);

  let pos = mid;  // position of next turn
  let lastPos = 0;  // position of the last turn
  let gapDistance = maxLength;  // how long to get to the next turn
  let step = 0;  // increment of each peak to pos
  let offset = 0;  // offset the wave data position to create curves

  let minBarDistance = 270;  // min distance between top and bottom wave bars
  let heightDt = minBarDistance - waveHeight + 10;  // distance between max height and wave height
  let heightStep = heightDt / (startBuffer.length + waves.length);  // game should reach the max bar height by end of the song
  let counter = 0;
  let peakVisited = false;
  let obstacle;
  let prevObstacle;

  let yPos = 0;
  let yLastPos = 0;
  let yGapDistance = maxLength;
  let yStep = 0;
  let yOffset = 0;
  let yCounter = 0;

  let isIntroSong = songName === 'AudioDashDefault.mp3';

  Random.setValues(peaks);

  waveData = startBuffer
    .concat(waves)
    .map((peak, index, waves) => {

      // if (index === 13146) {
      //   debugger;
      // }

      let maxPos = (190 - heightStep * index) / 2;

      // for the intro song give the player some time to get use to the controls
      // before adding curves (numbers are tailored to points in the song)
      let firstCurveIndex = maxLength * (isIntroSong ? 4 : 1);
      if (index >= firstCurveIndex) {
        offset += step;

        // the steeper the slope the less drastic position changes we should have
        yOffset += Math.abs(step) > 1
          ? yStep / (Math.abs(step) * 1.25)
          : yStep;

        if (yPos < 0 && yOffset < yPos ||
            yPos > 0 && yOffset > yPos) {
          yOffset = yPos;
        }

        // all calculations are based on the peaks data so that the path is the
        // same every time
        let peakIndex = index - startBuffer.length;
        Random.seed(peakIndex);

        if (++counter >= gapDistance) {
          counter = 0;
          lastPos = pos;
          pos = mid + Random.getNext(200);
          gapDistance = 300 + Random.getNext(100);
          step = (pos - lastPos) / gapDistance;
        }

        if (++yCounter >= yGapDistance) {
          yCounter = 0;
          lastYPos = yPos;
          yGapDistance = 110 + Random.getNext(23);
          yPos = Random.getNext(maxPos);
          yStep = (yPos - lastYPos) / yGapDistance;
        }
      }

      // a song is more or less "intense" based on how much it switches between
      // high and low peaks. a song like "Through the Fire and the Flames" has
      // a high rate of switching so is more intense. need to look a few peaks
      // before to ensure we find the low peaks
      let peakThreshold = 0.38; // increase or decrease to get less or more obstacles
      let lowPeak = 1;
      for (let i = index - 5; i < index; i++) {
        if (waves[i] < lowPeak) {
          lowPeak = waves[i];
        }
      }

      let maxPeak = 0;
      for (let i = index - 20; i < index+20; i++) {
        if (waves[i] > maxPeak) {
          maxPeak = waves[i];
        }
      }

      // for the intro song give the player some time to get use to the controls
      // before adding obstacles (numbers are tailored to points in the song)
      let firstObstacleIndex = maxLength * (isIntroSong ? 15 : 3);

      // don't create obstacles when the slope of the offset is too large
      let addObstacle = index > firstObstacleIndex && peak - lowPeak >= peakThreshold && Math.abs(step) < 1.35;
      let height = addObstacle
        ? kontra.canvas.height / 2 - Math.max(65, 35 * (1 / peak))
        : 160 + peak * waveHeight + heightStep * index;

      // a song that goes from a low peak to a really high peak while the current
      // yOffset is close to the top or bottom needs to drop the yOffset a bit so
      // there's enough of a gap between the peaks
      // if (Math.abs(yOffset) > (minBarDistance - heightStep * index) / 2 &&
      //     maxPeak - lowPeak > peakThreshold) {
      //   yOffset += -getSign(yOffset) * 65;
      //   console.log('hit here');
      // }

      // a song that goes from a low peak to a really high peak while in an obstacle
      // would create a spike in the obstacle that is too narrow to pass so we need
      // to match the height to the others
      // if (addObstacle && maxPeak - peak > peakThreshold) {
      //   height = kontra.canvas.height / 2 - Math.max(65, 35 * (1 / maxPeak));
      // }

      return {
        x: index * waveWidth,
        y: 0,
        width: waveWidth,
        height: height,
        offset: offset,
        yOffset: addObstacle && index > firstObstacleIndex ? yOffset : 0,
        yPos: yPos
      };
    });
}