
export const canvas = document.getElementsByTagName('canvas')[0];
export const ctx = canvas.getContext('2d');
ctx.imageSmoothingEnabled = true;
ctx.lineCap='round';
ctx.lineJoin='round';

var w, h;
export function width() { return w; }
export function height() { return h; }

export function resize() {
  canvas.width = window.innerWidth * 1;
  canvas.height = window.innerHeight * 1;
  w = canvas.width;
  h = canvas.height;
};
resize();
window.addEventListener('resize', resize)