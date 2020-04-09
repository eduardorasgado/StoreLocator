var foundStores;
var searchInput;

window.onload = () => {
    searchInput = document.getElementById("zip-code-input");
    searchInput.addEventListener("keyup",function(event) {
        // number 13 is enter
        if(event.keyCode == 13) {
            event.preventDefault();
            searchStores();
        }
    })
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
  foundStores = stores;
  displayStores();
  showStoresMarkers();
  setOnClickListener();

}

function searchStores() {
    foundStores = [];
    var zipCode = document.getElementById('zip-code-input').value;

    for(var store of stores) {
        var postal = store['address']['postalCode'].substring(0, 5);
        if(postal === zipCode) {
            foundStores.push(store);
        }
    }    
    clearLocations();
    displayStores();
    showStoresMarkers();
    setOnClickListener();
}

/**
 * remove all the pinned markers
 */
function clearLocations() {
    for(let marker of markers) {
        marker.setMap = null;
    }
    markers = [];
}

function setOnClickListener() {
    // actually need to target all the stores
    var storeElements = document.querySelectorAll('.store-container');
    
    storeElements.forEach(function(storeElement, index) {
        storeElement.addEventListener('click', 
            function() {
                new google.maps.event.trigger(markers[index], 'click');
            })
    })
}

function displayStores() {
    let storesHtml = '';

    let index, store;
    for([index, store] of foundStores.entries()) {
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
    map = new google.maps.Map(
        document.getElementById('map'), {center: la, zoom:14});
    mapBounds = new google.maps.LatLngBounds();

    let store, index;
    for([index, store] of foundStores.entries()) {

        let latLng = new google.maps.LatLng(
            store['coordinates']["latitude"],
            store['coordinates']["longitude"]
        );

        let name = store["name"];
        let openStatusText = store['openStatusText'];
        let address = store["addressLines"][0];

        mapBounds.extend(latLng);

        createMarker(index, latLng, name, address, openStatusText);
    }
    map.fitBounds(mapBounds);
}

function createMarker(index, location, name, address, openStatusText) {
    // Add the marker at the clicked location, and add the next-available label
    // from the array of alphabetical characters.
    var marker = new google.maps.Marker({
      position: location,
      label: `${index+1}`,
      map: map
    });

    infoWindow = new google.maps.InfoWindow();
    let html = `
        <div class='store-info-window'>
            <div class='store-info-name'>
                ${name} 
            </div>
            <div class='store-info-address'>
                ${address}
            </div>
            <div class=''>
                ${openStatusText}
            </div>
        </div>
    `;
    
    // event that can be activate clicking a marker
    google.maps.event.addListener(marker, 
        'click', 
        (function(marker) {
            return function() {
                infoWindow.setContent(html);
                infoWindow.open(map, marker);
            }
        })(marker)
    );


    markers.push(marker)
  }
  