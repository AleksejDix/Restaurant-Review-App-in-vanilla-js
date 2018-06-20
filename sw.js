const staticCacheName = 's-v1'
const dinamicCacheName = 'd-v1'

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
      .open(staticCacheName)
      .then(cache => {
        cache.addAll(filesToCache)
      })
  )
})


self.addEventListener('activate', event => {
  event.waitUntil(
    caches
      .keys()
      .then(keys => Promise.all(keys.map(key => {
        if (key != staticCacheName && key != dinamicCacheName) {
          return caches.delete(key)
        }
      })))
  )
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
                .open(dinamicCacheName)
                .then(cache => {
                  cache.put(event.request.url, res.clone())
                  return res
                })
            })
            .catch(console.log)
        }
        return response
      })
  )
})


