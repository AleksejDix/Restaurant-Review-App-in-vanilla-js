const cacheName = 'r'
const filesToCache = [
  'https://unpkg.com/leaflet@1.3.1/dist/leaflet.css',
  '/offline.html',
  '/css/styles.css',
  '/data/restaurants.json',
  '/js/dbhelper.js',
  '/js/main.js',
  'js/restaurant_info.js',
  '/restaurant.html',
  '/'
]

self.addEventListener('install', event => {
  event.waitUntil(
    caches
      .open(cacheName)
      .then(cache => {
        cache.addAll(filesToCache)
      })
  )
})


self.addEventListener('activate', () => {
  return self.clients.claim()
})


self.addEventListener('fetch', event => {
  event.respondWith(
    caches
      .match(event.request)
      .then(response => {
        if (!response) {
          return fetch(event.request)
            .then(res => {
              return caches
                .open('dinamic')
                .then(cache => {
                  cache.put(event.request.url, res.clone())
                  return res
                })
            })
        }
        return response
      })
  )
})


