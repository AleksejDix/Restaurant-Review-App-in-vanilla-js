class CityMap {
  constructor (options) {

    const defaults = {
      cssID: 'map',
      center: [40.722216, -73.987501],
      zoom: 12
    }
    this.markers = [];

    options = Object.assign({}, defaults, options);
    this.createMap(options)
  }

  createMap(options) {
    this.map = L.map( options.cssID, {
      center: options.center,  // [restaurant.latlng.lat, restaurant.latlng.lng],
      zoom: options.zoom, // 16
      scrollWheelZoom: false
    })


    /**
     * Initialize leaflet map, called from HTML.
     */
    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.jpg70?access_token={mapboxToken}', {
      mapboxToken: 'pk.eyJ1IjoiYWxla3NlamRpeCIsImEiOiJjamlrMjN2ZWkxeHNjM3dveWpsc2U1ZDdwIn0.mYDE1pggX2JkOtnqXgMWfw',
      maxZoom: 18,
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
        '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
        'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      id: 'mapbox.streets'
    }).addTo(this.map);
  }

  /**
   * Add marker for current restaurant to the map.
  */

  addMarker(restaurant) {

    const marker = new L.marker(
      [restaurant.latlng.lat, restaurant.latlng.lng],
      {
        title: restaurant.name,
        alt: restaurant.name,
        url: `./restaurant.html?id=${restaurant.id}`
      }
    )

    marker.on("click", onClick);
    marker.addTo(this.map);
    this.markers.push(marker);

    function onClick() {
      window.location.href = marker.options.url;
    }

  }

  /**
   * Remove markers from current map
  */

  removeMarkers() {
    this.markers.forEach(marker => marker.remove());
  }

}


