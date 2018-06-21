function createApi (endpoint) {

  return new Promise(
    function (resolve, reject) {

      let fetched = false

      fetch(endpoint)
        .then(res => {
          if (!res.ok) throw new Error(`can't fetch ${endpoint}`)
          return res.json()
        })
        .then(json => {
          console.log("from Network:", json)
          fetched = true
          return createStore(json);
        })
        .then(resolve)
        .catch(console.error)

        if (!fetched) {
          DB()
            .list()
            .then(data => {
              console.log('from Cache', data)
              return createStore(data);
            })
            .then(resolve)
        }
    }
  )

  function createStore (stores) {
    return {
      get restaurants () {
        const list = stores
        const show = id => this.restaurants.list.find(r => r.id === +id)
        return { list, show }
      },
      get cuisines () {
        const list = [...new Set(this.restaurants.list.map(r => r.cuisine_type))]
        return { list }

      },
      get neighborhoods () {
        const list = [...new Set(this.restaurants.list.map(r => r.neighborhood))]
        return { list }
      }
    }
  }
}