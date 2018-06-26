importScripts('/js/idb.js');
importScripts('/js/idb-helper.js')
importScripts('/js/api.js')

const staticCacheName = 's-v2'
const dynamicCacheName = 'd-v2'

self.addEventListener('install', event => event.waitUntil(precache()))
self.addEventListener('activate', event => event.waitUntil(clearCache()))
self.addEventListener('fetch', fetchHandler)

const filesToCache = [
  'https://unpkg.com/leaflet@1.3.1/dist/leaflet.js',
  'https://unpkg.com/leaflet@1.3.1/dist/leaflet.css',
  '/css/styles.css',
  '/js/idb.js',
  '/js/idb-helper.js',
  '/js/api.js',
  '/js/city-map.js',
  '/js/index.js',
  '/js/main.js',
  'js/restaurant_info.js',
  '/'
]


async function precache () {
  const cache = await caches.open(staticCacheName)
  return await cache.addAll(filesToCache)
}


async function clearCache () {

  const isCashed = key => (cacheName => key === cacheName)
  const deleteKey = key => caches.delete(key)

  const keys = await caches.keys()

  const notCachedKeys = keys
    .filter(key => !isCashed(key)(staticCacheName))
    .filter(key => !isCashed(key)(dynamicCacheName))

  const promisedDeletions = notCachedKeys.map(deleteKey)

  return await Promise.all(promisedDeletions)
}

function fetchHandler (event) {

  if (event.request.url === 'http://localhost:1337/restaurants/') {
    event.respondWith(cacheRestaurants())

    async function cacheRestaurants() {

      const response = await fetch(event.request)
      if (response.ok) DB().clear('restaurants')
      const responseClone = response.clone()
      const data = await responseClone.json()
      data.forEach(entry => DB().put('restaurants', entry))


      return response
    }

  } else if (event.request.url.includes('http://localhost:1337/reviews')) {
    event.respondWith(cacheReviews())

    async function cacheReviews() {
      const response = await fetch(event.request)
      const responseClone = response.clone()
      const data = await responseClone.json()
      data.forEach(entry => DB().put('reviews', entry))
      return response
    }

  } else if (event.request.destination) {
    event.respondWith(
      caches
        .match(event.request)
        .then(cacheResponse => cacheResponse || fetch(event.request)
          .then(response => {
            const clone = response.clone()
            caches
              .open(dynamicCacheName)
              .then(cache => cache.put(event.request, clone))
            return response
          })
      )
    )
  }
}


self.addEventListener('sync', event => {
  switch (event.tag) {
    case 'sync-like':
      console.log('[SYNCING LIKES...]')
      event.waitUntil(
        DB().getAll('likes')
          .then(actions => actions
            .forEach(data =>
              like
                .update(data.id, data.value)
                .then(data => DB().delete('likes', data.id))
            )
          )
      )
      break;
    case 'sync-form':
      console.log('[SYNCING FORM...]')
      event.waitUntil(
        DB().getAll('form')
          .then(actions => actions
            .forEach(data => reviews.store(data)
            .then(data => DB().delete('form', data.restaurant_id))
            )
          )
        )
    default:
      break;
  }
})