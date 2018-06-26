(() => {
  const cityMap = new CityMap()

/**
 * Fetch neighborhoods and cuisines as soon as the page is loaded.
 */
document.addEventListener('DOMContentLoaded', event => {

  const neighborhoodsSelect = document.querySelector('#neighborhoods-select')
  neighborhoodsSelect.addEventListener('change', renderRestaurants)

  const cuisinesSelect = document.querySelector('#cuisines-select')
  cuisinesSelect.addEventListener('change', renderRestaurants)

  restaurants.index()
    .then(restaurants => {
      renderRestaurants(restaurants)
      renderNeighborhoods(restaurants)
      renderCuisines(restaurants)

    })
});

const restaurantURL    = restaurant => `./restaurant.html?id=${restaurant.id}`
const restaurantImages = restaurant => `/img/320/${restaurant.photograph}.jpg 1x, /img/480/${restaurant.photograph}.jpg 1.5x, /img/640/${restaurant.photograph}.jpg 2x`
const restaurantImage  = restaurant => `/img/320/${restaurant.photograph}.jpg`


/**
 * Set neighborhoods HTML.
 */
async function renderNeighborhoods (restaurants) {
  const neighborhoods = [...new Set(restaurants.map(r => r.neighborhood))]

  const select = document.getElementById('neighborhoods-select');
  neighborhoods.forEach(neighborhood => {
    const option = document.createElement('option');
    option.innerHTML = neighborhood;
    option.value = neighborhood;
    select.append(option);
  });
  return restaurants
}

/**
 * Set cuisines HTML.
 */
async function renderCuisines(restaurants) {
  const cuisines = [...new Set(restaurants.map(r => r.cuisine_type))]

  const select = document.getElementById('cuisines-select');
  cuisines.forEach(cuisine => {
    const option = document.createElement('option');
    option.innerHTML = cuisine;
    option.value = cuisine;
    select.append(option);
  });

  return restaurants
}

/**
 * Clear current restaurants, their HTML and remove their map markers.
 */
const resetRestaurants = () => {
  const ul = document.getElementById('restaurants-list');
  ul.innerHTML = '';

  cityMap.removeMarkers()
}

/**
 * Create all restaurants HTML and add them to the webpage.
 */
async function renderRestaurants (res) {

  resetRestaurants()

  let selectedCuisine = 'all'
  let selectedNeighbor = 'all'

  if (res instanceof Event) {
    event = res
    res = await restaurants.index()
    selectedCuisine = document.querySelector('#cuisines-select').value
    selectedNeighbor = document.querySelector('#neighborhoods-select').value
  }

  filteredRestaurants = res
    .filter(r => selectedCuisine === 'all' || r.cuisine_type === selectedCuisine)
    .filter(r => selectedNeighbor === 'all' || r.neighborhood === selectedNeighbor)


  const ul = document.getElementById('restaurants-list');
  if(!ul) return

  filteredRestaurants.forEach(restaurant => {
    ul.append(renderRestaurant(restaurant));
  });

  return res
}

/**
 * Create restaurant HTML.
 */
const renderRestaurant = (restaurant) => {
  const li = document.createElement('li');
  li.classList.add('restaurant_list-item')

  const card = document.createElement('article');
  card.classList.add('restaurant-card')
  li.append(card);

  const image = document.createElement('img');
  image.className = 'restaurant-img';
  image.alt = restaurant.name;
  image.src = restaurantImage(restaurant)
  image.srcset = restaurantImages(restaurant);
  card.append(image);

  const name = document.createElement('h3');
  name.innerHTML = restaurant.name;
  card.append(name);

  const neighborhood = document.createElement('p');
  neighborhood.innerHTML = restaurant.neighborhood;
  card.append(neighborhood);

  const address = document.createElement('p');
  address.innerHTML = restaurant.address;
  card.append(address);

  const cta = document.createElement("div")
  cta.classList.add('cta')

  const likeBtn = document.createElement("button")
  likeBtn.classList.add('likeBtn')


  const options = {
    el: likeBtn,
    id: restaurant.id,
    text: (restaurant.is_favorite === 'true') ? '⭑' : '⭒',
    liked: (restaurant.is_favorite === 'true')
  }
  cta.append(likeBtn)

  new Like(options)

  const more = document.createElement('a');
  more.classList.add('btn')
  more.innerHTML = 'View Details';
  more.href = restaurantURL(restaurant);
  cta.append(more)



  card.append(cta)


  cityMap.addMarker(restaurant)

  return li
}



})()