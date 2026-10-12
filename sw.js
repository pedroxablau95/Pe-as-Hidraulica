const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './style.css',
  './materiais.js',
  './app.js',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

// Instalação do Service Worker e salvando em cache
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// Resposta com o cache quando estiver offline
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Retorna o arquivo do cache se encontrar, senão busca na rede
      return response || fetch(event.request);
    })
  );
});