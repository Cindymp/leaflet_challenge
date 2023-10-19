// Define the URL for earthquake data
let url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Creating the map object
let map = L.map("map", {
  center: [40.7128, -74.0059],
  zoom: 3,
});

// Tile layer as the background of the map
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Function to determine marker size
function getMarkerSize(magnitude) {
  return magnitude * 5;
}

// Function to determine marker color by depth
function getMarkerColor(depth) {
  return depth > 90 ? 'red' :
         depth > 70 ? 'orangered' :
         depth > 50 ? 'orange' :
         depth > 30 ? 'gold' :
         depth > 10 ? 'yellow' :
         'lightgreen';
}

// Legends
let legend = L.control({ position: 'bottomright' });

legend.onAdd = function (map) {
  
  var div = L.DomUtil.create('div', 'info legend'),
    grades = [0, 10, 30, 50, 70, 90],
    colors = ["lightgreen", "yellow", "gold", "orange", "orangered", "red"],
    labels = [];


  // loop through our depth intervals and generate a label with a colored square for each interval
  for (var i = 0; i < grades.length; i++) {
    div.innerHTML +=
      '<i style="background:' + colors[i] + '"></i> ' +
      grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
  }

  return div;
};

legend.addTo(map);

// Retrieve and add the earthquake data
d3.json(url).then(function(data) {
  L.geoJson(data, {
    pointToLayer: function(feature, latlng) {
      return L.circleMarker(latlng, {
        radius: getMarkerSize(feature.properties.mag),
        fillColor: getMarkerColor(feature.geometry.coordinates[2]),
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8,
      });
    },
    onEachFeature: function(feature, layer) {
      layer.bindPopup(
        "Magnitude: " + feature.properties.mag + "<br>" +
        "Depth: " + feature.geometry.coordinates[2] + "km" +  "<br>" +
        "Location: " + feature.properties.place
      );
    }
  }).addTo(map);
});







