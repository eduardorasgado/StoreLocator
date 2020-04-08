window.onload = () => {
    displayStores();
}

var la = {
    lat: 34.052235,
    lng: -118.243683
};

var map;
var markers = [];
var infoWindow;
var mapBounds;

function initMap() {
  // The location of Uluru
  //var uluru = {lat: -25.344, lng: 131.036};
  // The map, centered at Uluru
  map = new google.maps.Map(
      document.getElementById('map'), {center: la, zoom:14});
  // The marker, positioned at Uluru
  var marker = new google.maps.Marker({position: la, map: map});
  showStoresMarkers();
}

function displayStores() {
    let storesHtml = '';

    let index, store;
    for([index, store] of stores.entries()) {
        var address = store["addressLines"];
        var phoneNumber = store["phoneNumber"]
        storesHtml += `
        <div class="store-container">
            <div class="store-info-container">
                <div class="store-address">
                    <span>${address[0]}</span>
                    <span>${address[1]}</span>
                </div>
                <div-- class="store-phone-number">
                    ${phoneNumber}
                </div>
                <div class="store-number-container">
                    <div class="store-number">
                        ${++index}
                    </div>
                </div>
            </div>
        </div>
        `;
    }

    document.querySelector('.stores-list').innerHTML = storesHtml;
}

function showStoresMarkers() {
    mapBounds = new google.maps.LatLngBounds();

    let store, index;
    for([index, store] of stores.entries()) {

        let latLng = new google.maps.LatLng(
            store['coordinates']["latitude"],
            store['coordinates']["longitude"]
        );

        let name = store["name"];
        let address = store["addressLines"];

        mapBounds.extend(latLng);

        createMarker(index, latLng, name, address);
    }
    map.fitBounds(mapBounds);
}

function createMarker(index, location, name, address) {
    // Add the marker at the clicked location, and add the next-available label
    // from the array of alphabetical characters.
    var marker = new google.maps.Marker({
      position: location,
      label: `${index}`,
      map: map
    });

    infoWindow = new google.maps.InfoWindow();
    let content = `<span class='marker'>${name} ${address}</span>`;
    // event that can be activate clicking a marker
    google.maps.event.addListener(marker, 
        'click', 
        (function(marker) {
            return function() {
                infoWindow.setContent(content);
                infoWindow.open(map, marker);
            }
        })(marker)
    );


    markers.push(marker)
  }
  