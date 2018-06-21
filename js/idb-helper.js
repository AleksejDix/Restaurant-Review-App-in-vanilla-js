function DB () {

  const name = 'restaurants';

  const dbPromise = idb.open('restaurants-store', 1 , db => {
    if(db.objectStoreNames.contains(name)) return
    db.createObjectStore(name, {keyPath: 'id'})
  })

  function list () {
    return dbPromise
      .then(db => db
        .transaction(name)
        .objectStore(name)
        .getAll()
      )
  }

  function set(val) {
    return dbPromise
      .then(db => db
        .transaction(name, 'readwrite')
        .objectStore(name)
        .put(val)
        .complete
      )
  }

  function remove(id) {
    return dbPromise
      .then(db => db
        .transaction(name, 'readwrite')
        .objectStore(name)
        .delete(id)
        .complete
      )
  }

  function clear () {
    return dbPromise
      .then(db => db
        .transaction(name, 'readwrite')
        .objectStore(name)
        .clear()
        .complete
      )
  }

  return {
    list,
    clear,
    set,
    remove
  }
}

