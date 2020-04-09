var la = {
    lat: 34.052235,
    lng: -118.243683
};

var markersList = [];
var map;
// to be able to store the markers and remove them globally
var mapMarker;
// mapBound should be global to fix it at the markers location
var mapBoundListener;
var currentStores;
var searchInput;

/**
 * before page loads input search is located and a event is inserted within it
 */
window.onload = () => {
    searchInput = document.getElementById("zip-code-input");
    searchInput.addEventListener("keyup",function(event) {
        // number 13 is enter
        if(event.keyCode == 13) {
            event.preventDefault();
            loadScreenDataByZipCode();
        }
    })
}

/**
 * First time google maps load
 */
function initMap() {
  // The location of Uluru
  //var uluru = {lat: -25.344, lng: 131.036};
  // The map, centered at Uluru
  var map = new google.maps.Map(
      document.getElementById('map'), {center: la, zoom:14});
  // The marker, positioned at Uluru
  var marker = new google.maps.Marker({position: la, map: map});  

  // listing all the stores inmediately the page has loaded
  currentStores = getAddressesByZipCode();
  addressesLoader();
}

/**
 * take the search input content and loads the addresses and the markers
 */
function loadScreenDataByZipCode() {
    let zipCode = searchInput.value;
    if(zipCode) {
        currentStores = getAddressesByZipCode(zipCode);
    } else{ // if enter zip code is empty then store list loads every store
        currentStores = getAddressesByZipCode();
    }
    addressesLoader();
    //addMapMarkers();
}

/**
 * This function returns an array of stores given a certain zipCode
 * @param {*} zipCode 
 */
function getAddressesByZipCode(zipCode = '') {
    if(zipCode == '') {
        return stores;
    } 
    let storesToReturn = [];
    let storeZipCode;
    for(let store of stores) {
        // assuming every call to the api, data comes clean
        // with this field in every store
        storeZipCode = store.address.postalCode.slice(0, 5);
        if(storeZipCode === zipCode) storesToReturn.push(store);
    }
    return storesToReturn;
}

/**
 * inserting every location within store data within the store list
 */
function addressesLoader() {
    let storeListContainer = document.getElementsByClassName('stores-list-container')[0];
    
    storeListContainer.innerHTML = '';
    if(currentStores.length === 0) {
        let html = `
        <div class="stores-list-empty">
            <span>
                Nothing here
                <i class="fas fa-binoculars"></i>
            </span>
            <span>What if you take a look at <span class="zip-optional">90036</span> zip code</span>
        </div>
        `
        storeListContainer.innerHTML = html;
    }
    else {
        let storesList = document.createElement("div");
        storesList.className = "stores-list";
        storesList.id = "stores-list";
        // appending list as child and then we took it from the dom, to avoid
        // time outs due to stores search
        storeListContainer.appendChild(storesList);
        
        storesList = document.getElementById("stores-list");

        let data;
        let storeContainer;
        let addressDiv;
        let phoneDiv;
        let hr;
        let circle;
        let cicleSpan;
        for(let [index, store] of currentStores.entries()) {
            //console.log(store)
            // rendering the first 4 stores, for the moment, this will be dynamic
            data = `${store.addressLines[0]} <br>${store.addressLines[1]}`

            storeContainer = document.createElement("div");
            storeContainer.className = "store-container";

            cicleSpan = document.createElement("span");
            cicleSpan.innerHTML = index+1;
            circle = document.createElement("div");
            circle.className = "circle";
            circle.appendChild(cicleSpan);
            addressDiv = document.createElement("div");
            addressDiv.className = "store-address";
            addressDiv.innerHTML = data;
            addressDiv.appendChild(circle);

            phoneDiv = document.createElement("div");
            phoneDiv.className = "store-phone-number";
            phoneDiv.innerHTML = store.phoneNumber;
            hr = document.createElement("hr");
            hr.className = "store-divider";

            storeContainer.appendChild(addressDiv);
            storeContainer.appendChild(phoneDiv);
            storeContainer.appendChild(hr);
            // appending the container within the list
            storesList.appendChild(storeContainer);
        }
    }
}


/**
 * google maps markers appending
 * 
 * @param {*} markers 
 */
function addMapMarkers(markers) {
    // appending all the coordinates from stores
    //markersList.push([store.brandName,
    //    store.coordinates["latitude"],
    //    store.coordinates["longitude"]]
    //    )
    
        // TODO: Check to create a map list or just remove all the markers into the 
    // marker object
    mapMarker = null;
    // to be able to load information into the marker on click
    var gMapsInfoWindow = new google.maps.InfoWindow();
    var mapBounds = new google.maps.LatLngBounds();

    map = new google.maps.Map(
        document.getElementById('map'), {center: la, zoom:14});

    for(let i = 0; i < markers.length; i++)
    {
        // creating a coordinates object to group more than one marker in google frame
        var markerPosition = new google.maps.LatLng(markers[i][1], markers[i][2]);

        // extending the area of screen vision given the location of the markers
        mapBounds.extend(markerPosition);

        mapMarker = new google.maps.Marker({
            position: markerPosition,
            map: map,
            title: markers[i][0]
        });

        // dont forget to push the mapMarker to markersList

        let content = `<span class='marker'>${markers[i][0]}</span>`;
        // event that can be activate clicking a marker
        google.maps.event.addListener(mapMarker, 
            'click', 
            (function(mapMarker) {
                return function() {
                    gMapsInfoWindow.setContent(content);
                    gMapsInfoWindow.open(map, mapMarker);
                }
            })(mapMarker)
            );
        // all the markers should be visualized withing the map screen
        // applying the max visualization area
        map.fitBounds(mapBounds);
        // fix the map
        setMapBoundsFixed();
    }
}

/**
 * Fix the map at the max area given the current markers group
 * The map cannot move to avoid losing the locations focus
 */
function setMapBoundsFixed() {
    // finally set zoom level fixed, no way user can change
    mapBoundListener = google.maps.event.addListener((map),
        'bounds_changed', function(event) {
            this.setZoom(14);
            google.maps.event.removeListener(mapBoundListener);
        }
    );
}

  