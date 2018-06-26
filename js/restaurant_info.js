(() => {
  const restaurantImages = restaurant => `/img/320/${restaurant.photograph}.jpg 1x, /img/480/${restaurant.photograph}.jpg 1.5x, /img/640/${restaurant.photograph}.jpg 2x`
  const restaurantImage  = restaurant => `/img/320/${restaurant.photograph}.jpg`

  /**
   * Initialize map as soon as the page is loaded.
   */
  document.addEventListener('DOMContentLoaded', event => {
    const url = new URL(window.location.href)
    const id = url.searchParams.get("id")

    restaurants.show(id)
      .then(restaurant => {
        renderBreadcrumbs(restaurant)
        initForm(restaurant.id)
        initFavorite(restaurant)
        renderRestaurant(restaurant, initMap(restaurant))

      })
  });

  function initMap(restaurant) {
    return new CityMap({
      center: [restaurant.latlng.lat, restaurant.latlng.lng],
      zoom: 16
    });
  }


  /**
   * Create restaurant HTML and add it to the webpage
   */
  function renderRestaurant (restaurant, map) {

    map.addMarker(restaurant)

    const name = document.getElementById('restaurant-name');
    name.innerHTML = restaurant.name;

    const address = document.getElementById('restaurant-address');
    address.textContent = restaurant.address;

    const image = document.getElementById('restaurant-img');
    image.className = 'restaurant-img'
    image.alt = restaurant.name;
    image.srcset = restaurantImages(restaurant);
    image.src = restaurantImage(restaurant);

    const cuisine = document.querySelector('.restaurant-cuisine');
    cuisine.innerHTML = restaurant.cuisine_type;

    // fill operating hours
    if (restaurant.operating_hours) {
      renderRestaurantHours(restaurant.operating_hours);
    }

    restaurantReviews
      .index(restaurant.id)
      .then(renderReviews)
  }

  /**
   * Create restaurant operating hours HTML table and add it to the webpage.
   */
  renderRestaurantHours = operatingHours => {

    if (!operatingHours) return

    const hours = document.getElementById('restaurant-hours');
    const tableHead = document.createElement('tr')

    const titles = ["Weekdays", "Operating Hours"]

    titles.forEach(title => {
      const tableHeadCell = document.createElement('th')
      tableHeadCell.textContent = title
      tableHead.appendChild(tableHeadCell)
    })

    hours.appendChild(tableHead);

    for (let key in operatingHours) {
      const row = document.createElement('tr');

      const day = document.createElement('td');
      day.innerHTML = key;
      row.appendChild(day);

      const time = document.createElement('td');
      time.innerHTML = operatingHours[key];
      row.appendChild(time);

      hours.appendChild(row);
    }
  }

  /**
   * Create all reviews HTML and add them to the webpage.
   */
  renderReviews = (reviews) => {
    const container = document.getElementById('reviews-container');
    const title = document.createElement('h2');
    title.innerHTML = 'Reviews';
    container.appendChild(title);

    if (!reviews) {
      const noReviews = document.createElement('p');
      noReviews.innerHTML = 'No reviews yet!';
      container.appendChild(noReviews);
      return
    }
    container.appendChild(createReviewList(reviews));
  }

  function createReviewList (reviews) {
    const ul = document.getElementById('reviews-list');
    reviews.forEach(review => {
      ul.appendChild(createReviewHTML(review));
    });
    return ul
  }

  /**
   * Create review HTML and add it to the webpage.
   */
  createReviewHTML = review => {
    const li = document.createElement('li');
    const name = document.createElement('h3');

    // TODO add DELETE REVIEW offline SYNC
    // const deleteBtn = document.createElement('btn');
    // deleteBtn.classList.add('btn')
    // deleteBtn.textContent = 'delete'
    // deleteBtn.dataset.id = review.id
    // deleteBtn.addEventListener('click', deleteReview)

    // function deleteReview(event) {
    //   reviews
    //     .destroy(event.target.dataset.id)
    //     .then(async(review) => {
    //       const reviews = await restaurantReviews.index(review.restaurant_id)
    //       const reviewList = document.getElementById('reviews-list');
    //       const container = document.getElementById('reviews-container');
    //       reviewList.innerHTML = '';
    //       container.appendChild(createReviewList(reviews));
    //     })
    // }

    // li.appendChild(deleteBtn)
    const rating = document.createElement('span');
    rating.classList.add("rating")

    function createStar () {
      const star = document.createElement('span');
      star.textContent = '★'
      return star
    }

    for (i = 0; i < +review.rating; i++) {
      const star = createStar()
      rating.appendChild(star)
    }

    name.classList.add('review_name')
    const nameWrapper = document.createElement('span')
    const date = new Date(review.createdAt)
    const localDate = date.toLocaleDateString()

    const time = `<time>${localDate}</time>`
    nameWrapper.innerHTML = ` by <strong>${review.name}</strong>, on ${time}`;
    name.appendChild(rating);
    name.appendChild(nameWrapper)

    li.appendChild(name);

    const comments = document.createElement('p');
    comments.innerHTML = review.comments;
    li.appendChild(comments);

    return li;
  }

  /**
   * Add restaurant name to the breadcrumb navigation menu
   */
  renderBreadcrumbs = restaurant => {
    const breadcrumb = document.getElementById('breadcrumb');
    const li = document.createElement('li');
    li.setAttribute('aria-current', "page");
    li.innerHTML = restaurant.name;
    breadcrumb.appendChild(li);
  }


  function initFavorite(restaurant) {
    const likeBtn = document.querySelector(".likeBtn")

    const options = {
      el: likeBtn,
      id: restaurant.id,
      text: (restaurant.is_favorite === 'true') ? '⭑' : '⭒',
      liked: (restaurant.is_favorite === 'true')
    }

    new Like(options)
  }

  function initForm(id) {
    const reviewForm = document.querySelector('.review-form__form')
    reviewForm.addEventListener('submit', sendForm);
    function sendForm(event) {
      event.preventDefault();
      const entriesIterator = new FormData(event.target).entries()

      const payload = {
        restaurant_id: id
      }

      for (const entries of entriesIterator) {
        const [key, value] = entries
        payload[key] = value
      }

      async function updateReviews (id) {
        const reviews = await restaurantReviews.index(id)
        const reviewList = document.getElementById('reviews-list');
        const container = document.getElementById('reviews-container');
        reviewList.innerHTML = '';
        container.appendChild(createReviewList(reviews));
      }
      if ('serviceWorker' in navigator && "SyncManager" in window) {
        navigator.serviceWorker.ready.then(sw => {
          DB().put('form', payload).then(() => {
            sw.sync.register('sync-form')
            return payload
          }).then(data => updateReviews(data.restaurant_id))
        })
      } else {
        reviews
          .store(payload)
          .then(console.log)
      }
    }
  }



})()

