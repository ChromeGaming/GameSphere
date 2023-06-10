/**
 * DOM query selector
 * @param {String} query
 * @param {DOMElement} element
 * @returns {DOMElement}
 */
function $(query, element) {
    element = element || document;
    return element.querySelector(query);
}

/**
 * Attach event listener
 * @param {DOMElement} element
 * @param {String} event
 * @param {Function} handler
 */
function on(element, event, handler) {
    event.split(",").forEach((name) => {
        element.addEventListener(name.trim(), handler, false);
    });
}

/**
 * Random seed
 */
Math.seed = 6;

/**
 * Seed random number generator
 */
Math.rnd = function(max, min) {
    max = max || 1;
    min = min || 0;
    Math.seed = (Math.seed * 9301 + 49297) % 233280;
    return min + (Math.seed / 233280) * (max - min);
};