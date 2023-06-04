import bus from './bus.js';

isMobile = ()=>/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

window.addEventListener('touchstart', (evt) => {
  evt.stopPropagation();
  bus.emit('tap', { x: evt.touches[0].clientX, y: evt.touches[0].clientY });
});

window.addEventListener('mousedown', (evt) => {
  evt.preventDefault();
  evt.stopPropagation();
  if (!isMobile()) { bus.emit('tap', { x: evt.x, y: evt.y });}
});

window.addEventListener('mousemove', (evt) => {
  evt.preventDefault();
  evt.stopPropagation();
  if (isMobile()) {
    bus.emit('move', { x: -1, y: -1 });
  } else {
    bus.emit('move', { x: evt.x, y: evt.y });
  }
});

