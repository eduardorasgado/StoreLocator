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
  addressLocation();
}

function addressLocation() {
    stores.map((store) => {
        console.log("piece");
    })
    
    let storeList = document.getElementById('stores-list');
    let data = "8480 Beverly Blvd Los Angeles, CA 90048"

    for(let i = 0; i<4; i++) {
        let storeContainer = document.createElement("div");
        storeContainer.className = "store-container";

        let addressDiv = document.createElement("div");
        addressDiv.className = "store-address";
        addressDiv.innerHTML = data;

        let phoneDiv = document.createElement("div");
        phoneDiv.className = "store-phone-number";
        phoneDiv.innerHTML = "9999-9999-9999";

        storeContainer.appendChild(addressDiv);
        storeContainer.appendChild(phoneDiv);
        storeList.appendChild(storeContainer);
    }
}