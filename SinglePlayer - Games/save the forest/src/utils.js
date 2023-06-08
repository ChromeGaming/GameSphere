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