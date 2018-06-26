if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js')
    .then(reg => console.log('✅ Service Worker'))
    .catch(err => console.log('⛔️ Service Worker'))
}

class Like {

  constructor (options) {

    const defaults = {
      el: null,
      id: null,
      text: '⭒',
      liked: false
    }

    options = Object.assign({}, defaults, options);


    this.toggleLike = this.toggleLike.bind(this)

    this.el = options.el
    this.id = options.id
    this.text = options.text
    this.liked = options.liked
    this.init()
  }

  init () {
    this.el.textContent = this.text
    if(this.liked) {
      this.el.classList.add('⭑')
    }
    this.el.addEventListener("click", this.toggleLike)


  }

  toggleLike () {
    if (this.liked) {
      this.unlike()
      return
    }
    this.like()
    return
  }

  like () {
    this.el.textContent = '⭑'
    this.el.classList.add('⭑')
    this.liked = true

    if ('serviceWorker' in navigator && "SyncManager" in window) {
      navigator.serviceWorker.ready.then(sw =>
        DB().put('likes', {
          id: this.id,
          value: true
        }).then(() => {
          sw.sync.register('sync-like')
        })
      )
    } else {
      like.update(this.id, true)
    }
  }

  unlike () {
    this.el.textContent = '⭒'
    this.el.classList.remove('⭑')
    this.liked = false

    if ('serviceWorker' in navigator && "SyncManager" in window) {
      navigator.serviceWorker.ready.then(sw =>
        DB().put('likes', {
          id: this.id,
          value: false
        }).then(() => {
          sw.sync.register('sync-like')
        })
      )
    } else {
      like.update(this.id, false)
    }
  }
}