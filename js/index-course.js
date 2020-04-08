var la = {
    lat: 34.052235,
    lng: -118.243683
};

var map;
// to be able to store the markers and remove them globally

function initMap() {
  // The location of Uluru
  //var uluru = {lat: -25.344, lng: 131.036};
  // The map, centered at Uluru
  var map = new google.maps.Map(
      document.getElementById('map'), {center: la, zoom:14});
  // The marker, positioned at Uluru
  var marker = new google.maps.Marker({position: la, map: map});
  addressesLoader();
}
