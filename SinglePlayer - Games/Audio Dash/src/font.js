/**
 * Set font size.
 * @param {number} size - Size of font
 */
function setFont(size) {
  ctx.font = size * options.uiScale + "px 'Lucida Console', Monaco, monospace";
}

/**
 * Set font measurement
 */
function setFontMeasurement() {
  fontMeasurement = 15 * options.uiScale;
}