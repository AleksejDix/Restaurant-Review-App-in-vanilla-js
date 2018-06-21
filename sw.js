importScripts('/js/idb.js');
importScripts('/js/idb-helper.js')

const staticCacheName = 's-v5'
const dinamicCacheName = 'd-v5'

const filesToCache = [
  'https://unpkg.com/leaflet@1.3.1/dist/leaflet.css',
  '/offline.html',
  '/css/styles.css',
  '/js/idb.js',
  '/js/idb-helper.js',
  '/js/api.js',
  '/js/city-map.js',
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

  const restaurantsEndpoint =  'http://localhost:1337/restaurants'
  if (event.request.url.includes(restaurantsEndpoint)) {
    console.log(event.request.url)
    event.respondWith(
      fetch(restaurantsEndpoint)
        .then(res => {
          const cloneRes = res.clone()
          cloneRes.json()
            .then(json => {
              json.forEach(entry => {
                DB().clear()
                DB().set(entry)
              })
            })
          return res
        })
    )
  } else {

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
  }
})


