let mergedPeaks;
let splitPeaks;

/**
 * Wave code taken from wavesurfer.js
 * @see https://github.com/katspaugh/wavesurfer.js
 */
function exportPCM(length, accuracy, noWindow, start) {
  length = length || 1024;
  start = start || 0;
  accuracy = accuracy || 10000;
  const peaks = getPeaks(length, start);

  // find largest peak and treat it as peaks of 1 and normalize rest of peaks
  let maxPeak = 0;
  let arr = [].map.call(peaks, peak => {
    if (peak > maxPeak) {
      maxPeak = peak;
    }
    return peak;
  });
  let normalizePeak = 1 - maxPeak;
  arr = arr.map(peak =>  Math.round((peak + normalizePeak) * accuracy) / accuracy);

  return arr;
}

function setLength(length) {
  splitPeaks = [];
  mergedPeaks = [];
  // Set the last element of the sparse array so the peak arrays are
  // appropriately sized for other calculations.
  const channels = buffer ? buffer.numberOfChannels : 1;
  let c;
  for (c = 0; c < channels; c++) {
    splitPeaks[c] = [];
    splitPeaks[c][2 * (length - 1)] = 0;
    splitPeaks[c][2 * (length - 1) + 1] = 0;
  }
  mergedPeaks[2 * (length - 1)] = 0;
  mergedPeaks[2 * (length - 1) + 1] = 0;
}

function getPeaks(length, first, last) {
  first = first || 0;
  last = last || length - 1;

  setLength(length);

  /**
   * The following snippet fixes a buffering data issue on the Safari
   * browser which returned undefined It creates the missing buffer based
   * on 1 channel, 4096 samples and the sampleRate from the current
   * webaudio context 4096 samples seemed to be the best fit for rendering
   * will review this code once a stable version of Safari TP is out
   */
  // if (!buffer.length) {
  //     const newBuffer = this.createBuffer(1, 4096, this.sampleRate);
  //     buffer = newBuffer.buffer;
  // }

  const sampleSize = buffer.length / length;
  const sampleStep = ~~(sampleSize / 10) || 1;
  const channels = buffer.numberOfChannels;
  let c;

  for (c = 0; c < channels; c++) {
      const peaks = splitPeaks[c];
      const chan = buffer.getChannelData(c);
      let i;

      for (i = first; i <= last; i++) {
          const start = ~~(i * sampleSize);
          const end = ~~(start + sampleSize);
          let min = 0;
          let max = 0;
          let j;

          for (j = start; j < end; j += sampleStep) {
              const value = chan[j];

              if (value > max) {
                  max = value;
              }

              if (value < min) {
                  min = value;
              }
          }

          peaks[2 * i] = max;
          peaks[2 * i + 1] = min;

          if (c == 0 || max > mergedPeaks[2 * i]) {
              mergedPeaks[2 * i] = max;
          }

          if (c == 0 || min < mergedPeaks[2 * i + 1]) {
              mergedPeaks[2 * i + 1] = min;
          }
      }
  }

  return mergedPeaks;
}