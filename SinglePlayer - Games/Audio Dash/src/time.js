//------------------------------------------------------------
// Time functions
//------------------------------------------------------------

/**
 * Get the time in ss:ms format.
 * @param {number} time
 * @returns {string}
 */
function getTime(time) {
  return ('' + ((time * 100 | 0) / 100)).replace('.', ':');
}

/**
 * Get seconds from time.
 * @param {string} time
 * @returns {string}
 */
function getSeconds(time) {
  if (time.indexOf(':') !== -1) {
    return time.substr(0, time.indexOf(':'));
  }

  return '0';
}

/**
 * Get milliseconds from time.
 * @param {string} time
 * @returns {string}
 */
function getMilliseconds(time) {
  if (time.indexOf(':') !== -1) {
    return time.substr(time.indexOf(':') + 1);
  }

  return '0';
}

/**
 * Get the best time for the song.
 */
function getBestTime() {
  bestTimes = kontra.store.get('js13k-2018:best') || {};
  bestTime = bestTimes[songName] || '0:00';
}

/**
 * Set the best time for the song.
 */
function setBestTime() {
  if (isBetterTime(audio.currentTime)) {
    bestTime = getTime(audio.currentTime);
    bestTimes[songName] = bestTime;
    kontra.store.set('js13k-2018:best', bestTimes);
  }
}

/**
 * Check to see if the time is better than the best time.
 * @param {number} time
 * @returns {boolean}
 */
function isBetterTime(time) {
  return time > parseInt(bestTime.replace(':', '.'));
}