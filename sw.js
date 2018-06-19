const cacheName = 'q'
const filesToCache = [
  '/css/styles.css',
  '/data/restaurants.json',
  '/js/dbhelper.js',
  '/js/main.js',
  'js/restaurant_info.js',
  '/offline.html',
  '/',
  '/restaurant.html'
]

self.addEventListener('install', e => {
  console.log('[ServiceWorker] Installing');
})


self.addEventListener('activate', e => {
  console.log("[ServiceWorker] Activated")
  return self.clients.claim()
})


self.addEventListener('fetch', e => {
  console.log("[ServiceWorker] Activated")
  e.respondWith(self.fetch(e.request))
})


