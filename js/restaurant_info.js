(() => {
  const restaurantImages = restaurant => `/img/320/${restaurant.photograph}.jpg 1x, /img/480/${restaurant.photograph}.jpg 1.5x, /img/640/${restaurant.photograph}.jpg 2x`
  const restaurantImage  = restaurant => `/img/320/${restaurant.photograph}.jpg`

  /**
   * Initialize map as soon as the page is loaded.
   */
  document.addEventListener('DOMContentLoaded', async (event) => {
    const url = new URL(window.location.href)
    const id = url.searchParams.get("id")
    const store = await api
    const restaurant = store.restaurants.show(id)
    renderBreadcrumbs(restaurant)
    renderRestaurant(restaurant)
  });


  /**
   * Create restaurant HTML and add it to the webpage
   */
  renderRestaurant = restaurant => {
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
    // fill reviews
    renderReviews(restaurant.reviews);

    const cityMap = new CityMap({
      center: [restaurant.latlng.lat, restaurant.latlng.lng],
      zoom: 16
    });

    cityMap.addMarker(restaurant)
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
  renderReviews = reviews => {

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

    const ul = document.getElementById('reviews-list');
    reviews.forEach(review => {
      ul.appendChild(createReviewHTML(review));
    });
    container.appendChild(ul);
  }

  /**
   * Create review HTML and add it to the webpage.
   */
  createReviewHTML = review => {
    const li = document.createElement('li');
    const name = document.createElement('aside');

    name.classList.add('review_name')
    const time = `<time>${review.date}</time>`

    name.innerHTML = `on ${time} by ${review.name}`;

    li.appendChild(name);

    const rating = document.createElement('p');
    rating.innerHTML = `Rating: ${review.rating}`;
    li.appendChild(rating);

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

})()

