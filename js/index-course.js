window.onload = () => {
    displayStores();
}

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
}

function displayStores() {
    var storesHtml = '';

    for(var store of stores) {
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
                        1
                    </div>
                </div>
            </div>
        </div>
        `;
    }

    document.querySelector('.stores-list').innerHTML = storesHtml;
}