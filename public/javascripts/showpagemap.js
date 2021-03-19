mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
  container: "map", // container ID
  style: "mapbox://styles/mapbox/streets-v11", // style URL
  center: campground.geometry.coordinates, // starting position [lng, lat]
  zoom: 8, // starting zoom
});

// var marker = new mapboxgl.Marker()
//   .setLngLat(campground.geometry.coordinates)
//   .addTo(map);

new mapboxgl.Marker()
  .setLngLat(campground.geometry.coordinates)
  .setPopup(
    new mapboxgl.Popup({ offset: 30 }).setHTML(
      `<h3>${campground.title}</h3><p>${campground.location}</p>`
    )
  )
  .addTo(map);

// Add zoom and rotation controls to the map.
map.addControl(new mapboxgl.NavigationControl());

// mapboxgl.accessToken = mapToken;
// var map = new mapboxgl.Map({
//   container: "map",
//   zoom: 13.1,
//   center: campground.geometry.coordinates, // starting ,
//   pitch: 85,
//   bearing: 80,
//   style: "mapbox://styles/mapbox-map-design/ckhqrf2tz0dt119ny6azh975y",
// });

// map.on("load", function () {
//   map.addSource("mapbox-dem", {
//     type: "raster-dem",
//     url: "mapbox://mapbox.mapbox-terrain-dem-v1",
//     tileSize: 512,
//     maxzoom: 14,
//   });
//   // add the DEM source as a terrain layer with exaggerated height
//   map.setTerrain({ source: "mapbox-dem", exaggeration: 1.5 });

//   // add a sky layer that will show when the map is highly pitched
//   map.addLayer({
//     id: "sky",
//     type: "sky",
//     paint: {
//       "sky-type": "atmosphere",
//       "sky-atmosphere-sun": [0.0, 0.0],
//       "sky-atmosphere-sun-intensity": 15,
//     },
//   });
// });
