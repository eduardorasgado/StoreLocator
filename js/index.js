var la = {
    lat: 34.052235,
    lng: -118.243683
};

var markersList = [];
var map;
// to be able to store the markers and remove them globally
var mapMarker;
// mapBound should be global to fix it at the markers location
var storesIds = [];
var mapBoundListener;
var currentStores;
var searchInput;
var mapBounds;
var gMapsInfoWindow;
var mapOptions;
var storeIcon;
var positionLabelColor = "#eb3a44";

// Icons made by 
// <a href="https://www.flaticon.com/authors/freepik" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon"> www.flaticon.com</a>
var iconBase = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTkuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjxzdmcgdmVyc2lvbj0iMS4xIiBpZD0iTGF5ZXJfMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgeD0iMHB4IiB5PSIwcHgiCgkgdmlld0JveD0iMCAwIDUxMS45OTkgNTExLjk5OSIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgNTExLjk5OSA1MTEuOTk5OyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+CjxwYXRoIHN0eWxlPSJmaWxsOiNFRTM4NDA7IiBkPSJNNDU0Ljg0OCwxOTguODQ4YzAsMTU5LjIyNS0xNzkuNzUxLDMwNi42ODktMTc5Ljc1MSwzMDYuNjg5Yy0xMC41MDMsOC42MTctMjcuNjkyLDguNjE3LTM4LjE5NSwwCgljMCwwLTE3OS43NTEtMTQ3LjQ2NC0xNzkuNzUxLTMwNi42ODlDNTcuMTUzLDg5LjAyNywxNDYuMTgsMCwyNTYsMFM0NTQuODQ4LDg5LjAyNyw0NTQuODQ4LDE5OC44NDh6Ii8+CjxwYXRoIHN0eWxlPSJmaWxsOiNGRkUxRDY7IiBkPSJNMjU2LDI5OC44OWMtNTUuMTY0LDAtMTAwLjA0MS00NC44NzktMTAwLjA0MS0xMDAuMDQxUzIwMC44MzgsOTguODA2LDI1Niw5OC44MDYKCXMxMDAuMDQxLDQ0Ljg3OSwxMDAuMDQxLDEwMC4wNDFTMzExLjE2NCwyOTguODksMjU2LDI5OC44OXoiLz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPC9zdmc+Cg==';
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
    //storeIcon = iconBase + 'locator.svg';
    mapOptions = {
        center: la, 
        zoom:14,
        styles: styleOptions
    };
    // The location of Uluru
    //var uluru = {lat: -25.344, lng: 131.036};
    // The map, centered at Uluru
    var map = new google.maps.Map(
        document.getElementById('map'), mapOptions);
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
    if(currentStores.length > 0) {
        restoreMarkers(); // delete the current markers to append new ones
        addMapMarkers();
    } else {
        restoreMarkers();
    }
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
    storesIds = []; // reseting the id container list
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
            // saving the id of the current stores to add the specific
            // eventListener to information window
            storesIds.push(store.storeNumber);
            //console.log(store)
            // rendering the first 4 stores, for the moment, this will be dynamic
            data = `${store.addressLines[0]} <br>${store.addressLines[1]}`

            storeContainer = document.createElement("div");
            storeContainer.className = "store-container";
            storeContainer.id = store.storeNumber;

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
function addMapMarkers() {
    // appending all the coordinates from stores
        // TODO: Check to create a map list or just remove all the markers into the 
    // marker object
    //mapMarker = null;
    // to be able to load information into the marker on click
    // TODO: CHECK IF THESE VARS NEED TO BE GLOBAL
    mapBounds = new google.maps.LatLngBounds();

    map = new google.maps.Map(
        document.getElementById('map'), mapOptions);

    let index, store;
    for([index, store] of currentStores.entries())
    {
        // creating a coordinates object to group more than one marker in google frame
        let markerPosition = new google.maps.LatLng(
            store.coordinates["latitude"], 
            store.coordinates["longitude"]
        );
        let name = store["name"];
        let address = store["addressLines"];
        addSingleMarker(index, markerPosition, name, address);
        // extending the area of screen vision given the location of the markers
        mapBounds.extend(markerPosition);
    }
    addInformationWindows();
    // all the markers should be visualized withing the map screen
    // applying the max visualization area
    map.fitBounds(mapBounds);
    // fix the map
    setMapBoundsFixed();
}

function addSingleMarker(index, latLng, name, address) {
    let content = `<span class='marker'>${name} ${address}</span>`;
    
    var markerIcon = {
        url: iconBase,
        scaledSize: new google.maps.Size(55, 60),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(32,65),
        labelOrigin: new google.maps.Point(28,24)
      };

    mapMarker = new google.maps.Marker({
        position: latLng,
        map: map,
        animation: google.maps.Animation.DROP,
        title: name,
        label:{ 
            text: `K${index+1}`, 
            color: positionLabelColor,
            fontSize: "12px",
            fontWeight: "bold"
    },
        //icon: storeIcon,
        icon: markerIcon
    });

    // to be able to handle markers in another moment
    markersList.push(mapMarker);
}

/**
 * Every time a new input, a new zip code is needed, markers list should be empty
 */
function restoreMarkers() {
    // if there are no elements in currentStores means bad zip code
        // so show no markers
    map = new google.maps.Map(
        document.getElementById('map'), mapOptions);

    for(let marker of markersList) {
        marker.setMap = null;
    }
    markersList = [];
}

/**
 * Creates all the information windows events for the currentStores that already
 * exists
 */
function addInformationWindows() {
    gMapsInfoWindow = new google.maps.InfoWindow();

    let storesData = [];
    // we can optimize this section by taking the data in above sections
    currentStores.forEach((store) => {
        let data = {
            name: store.name,
            schedule: store.schedule[0].hours,
            address: store.addressLines[0],
            phone: store.phoneNumber,
            lat: store.coordinates.latitude,
            lng: store.coordinates.longitude,
        };
        storesData.push(data);
    })

    markersList.forEach((mapMarker, i) => {
        let content = createInfoWindowContent(storesData[i])
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
    });

    prepareStoresListeners(storesData);
}

function createInfoWindowContent(storeData) {
    let lat = storeData.lat;
    let lng = storeData.lng;
    return `
    <div class='marker'
        onclick="window.open(
            'https://www.google.com/maps/search/?api=1&query=${lat},${lng}', 'newLocation'
            );"
    >
        <div class='marker-header'>
            <div class='marker-header-title'>
                ${storeData.name}
            </div>
            <span class='marker-header-schedule'>
            ${storeData.schedule}
            </span>
        </div>
        <div class='marker-body'>
            <span>
                <i class="fas fa-location-arrow"></i>
                ${storeData.address}
            </span>
            <span>
                <i class="fas fa-phone-alt"></i>
                ${storeData.phone}
            </span>
        </div>
    </div>
    `;
    
}

function prepareStoresListeners(storesData) {

    // for every marker assume we have a store within storesIds
    // we link a listener for every stor container
    markersList.forEach((mapMarker, index) => {
        
        let storeListener = document.getElementById(storesIds[index]);
        let content = createInfoWindowContent(storesData[index])

        storeListener.addEventListener("click", 
            (function(mapMarker) {
                return function() {
                    gMapsInfoWindow.setContent(content);
                    gMapsInfoWindow.open(map, mapMarker);
                }
            })(mapMarker)
        );
    })
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

  