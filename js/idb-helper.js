function DB () {
  const dbPromise = idb.open('restaurants-store', 1, db => {

    if (!db.objectStoreNames.contains('restaurants')) {
      db.createObjectStore('restaurants', {keyPath: 'id'})
    }

    if (!db.objectStoreNames.contains('reviews')) {
      const reviews = db.createObjectStore('reviews', {keyPath: 'id'})
      reviews.createIndex('restaurant_id', 'restaurant_id', { unique: false });
    }

    if (!db.objectStoreNames.contains('likes')) {
      db.createObjectStore('likes', {keyPath: 'id'})
    }

    if (!db.objectStoreNames.contains('form')) {
      db.createObjectStore('form', {keyPath: 'restaurant_id'})
    }

  })

  return {
    getAll(name) {
      return dbPromise
        .then(db => db
          .transaction(name)
          .objectStore(name)
          .getAll()
        )
    },

    getByIndex(name, key, id) {
      return dbPromise
        .then(db => {
          const tx = db.transaction(name);
          const store = tx.objectStore(name);
          const index = store.index(key);
          return index.getAll(IDBKeyRange.only(id));
        })
    },

    getById(name, key) {
      return dbPromise
        .then(db => db
          .transaction(name)
          .objectStore(name)
          .get(key)
      )
    },

    put(name, val) {
      return dbPromise
        .then(db => db
          .transaction(name, 'readwrite')
          .objectStore(name)
          .put(val)
          .complete
        )
    },

    delete(name, id) {
      return dbPromise
        .then(db => db
          .transaction(name, 'readwrite')
          .objectStore(name)
          .delete(id)
          .complete
        )
    },

    clear(name) {
      return dbPromise
        .then(db => db
          .transaction(name, 'readwrite')
          .objectStore(name)
          .clear()
          .complete
        )
    },

    keys(name) {
      return dbPromise
        .then(db => db
          .transaction(name)
          .objectStore(name)
          .getAllKeys() // don't work in safari
        )
    }
  }
}