function initMap() {
  var la = {
        lat: 34.052235,
        lng: -118.243683
    };
  // The location of Uluru
  var uluru = {lat: -25.344, lng: 131.036};
  // The map, centered at Uluru
  var map = new google.maps.Map(
      document.getElementById('map'), {center: la, zoom:14});
  // The marker, positioned at Uluru
  var marker = new google.maps.Marker({position: la, map: map});
  addressLoader();
}

function addressLoader() {
    
    let storeList = document.getElementById('stores-list');
    let data;
    let storeContainer;
    let addressDiv;
    let phoneDiv;
    let i = 0;
    for(let store of stores) {
        if(i === 4) break;
        data = `${store.address.streetAddressLine1} ${store.address.countrySubdivisionCode}`
        storeContainer = document.createElement("div");
        storeContainer.className = "store-container";

        addressDiv = document.createElement("div");
        addressDiv.className = "store-address";
        addressDiv.innerHTML = data;

        phoneDiv = document.createElement("div");
        phoneDiv.className = "store-phone-number";
        phoneDiv.innerHTML = store.phoneNumber;

        storeContainer.appendChild(addressDiv);
        storeContainer.appendChild(phoneDiv);
        storeList.appendChild(storeContainer);
        ++i;
    }
}