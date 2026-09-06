/* Service worker de « Molécules ».
   Stratégie « cache d'abord » : le jeu étant figé entre deux versions,
   inutile d'interroger le réseau une fois les fichiers en cache.

   IMPORTANT : à chaque nouvelle version du jeu, incrémentez CACHE.
   Sans cela, les appareils déjà installés continueront de servir
   l'ancienne version indéfiniment. */
const CACHE = 'molecules-v1';

const FICHIERS = [
  '.',
  'index.html',
  'manifest.webmanifest',
  'apple-touch-icon.png',
  'icone-192.png',
  'icone-512.png'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE)
      .then((c) => c.addAll(FICHIERS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((noms) => Promise.all(
        noms.filter((n) => n !== CACHE).map((n) => caches.delete(n))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request).then((reponse) => reponse || fetch(e.request))
  );
});
