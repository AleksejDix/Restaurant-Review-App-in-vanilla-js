//     // DB().list().then(data => createStore(data));
const host = 'http://localhost:1337'

const like = {
  index() {
    return fetch(`${host}/restaurants/?is_favorite=true`).then(res => res.json())
  },

  update(id, payload) {
    const options = {
      headers: {
        'content-type': 'application/json'
      },
      method: 'PUT',
      mode: 'cors'
    }
    const url = `${host}/restaurants/${id}/?is_favorite=${payload}`
    return fetch(url, options).then(res => res.json())
  }
}

const restaurants = {
  index() {
    return fetch(`${host}/restaurants/`)
      .then(res => res.json())
      .catch(() => DB().getAll('restaurants'))
  },

  show(id) {
    return fetch(`${host}/restaurants/${id}/`)
      .then(res => res.json())
      .catch(() => DB().getById('restaurants', +id))
  }
}


const restaurantReviews = {
  index(restaurantID) {
    return fetch(`${host}/reviews/?restaurant_id=${restaurantID}`)
      .then(res => res.json())
      .catch(err => DB().getByIndex('reviews', 'restaurant_id', restaurantID))
  }
}

const reviews = {
  index() {
    return fetch(`${host}/reviews/`)
      .then(res => res.json())
  },

  store(payload) {
    const options = {
      headers: {
        'content-type': 'application/json'
      },
      method: 'POST',
      mode: 'cors',
      body: JSON.stringify(payload),
    }
    return fetch(`${host}/reviews/`, options)
      .then(res => res.json())
  },

  update(id, payload) {
    // const payload = {
    //   "name": <reviewer_name>,
    //   "rating": <rating>,
    //   "comments": <comment_text>
    // }
    const options = {
      method: 'put',
      body: JSON.stringify(payload)
    }
    return fetch(`${host}/reviews/${id}`, options).then(res => res.json())
  },

  destroy(id) {
    const options = {
      method: 'delete'
    }
    return fetch(`${host}/reviews/${id}`, options).then(res => res.json())
  }
}