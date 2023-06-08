const resources = [
  '/',
  'game.js',
  'main.css',
  'manifest.json',
  'favicon.ico',
  'icons/icon-72x72.png',
  'icons/icon-96x96.png',
  'icons/icon-128x128.png',
  'icons/icon-144x144.png',
  'icons/icon-152x152.png',
  'icons/icon-192x192.png',
  'icons/icon-384x384.png'
];

this.addEventListener('install', event => {
  event.waitUntil(
    caches
      .open('v1')
      .then(cache => cache.addAll(resources))
  );
});

this.addEventListener('fetch', event => {
  event.respondWith(
    caches
      .match(event.request)
      .then(response => response || fetch(event.request))
  );
});