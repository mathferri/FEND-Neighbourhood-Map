/* MAP VARIABLES*/

var map;

var markers = [];

var marker;

var infoWindow;

var restaurants = [
    {title: "Tuk-Tuk Comida Indiana e Tailandesa", location: {lat: -25.4141575, lng: -49.2462872}, id: "ChIJZUviWDLk3JQRNRqYsyrkIRk"},
    {title: "Terrazza 40 - Restaurante Panorâmico", location: {lat: -25.4302751, lng: -49.2919939}, id: "ChIJ_wDMVPDj3JQRwXztiU8LKs4"},
    {title: "Lisboa Gastronomia", location: {lat: -25.4294114, lng: -49.2817917}, id: "ChIJ61qqKwrk3JQRsQan_u3rtbo"},
    {title: "Pasteur Grill", location: {lat: -25.4429859, lng: -49.2799385}, id: "ChIJkb4GW3fk3JQRbOAATP6bH3A"},
    {title: "Saanga - Iguaçu", location: {lat: -25.448126, lng: -49.284492}, id: "ChIJh4hxZIfj3JQReSm2xlukAsw"}
];

/* INITIALIZE MAP FUNCTION */

function initMap() {
    // Constructor creates a new map.
    map = new google.maps.Map(document.getElementById("map"), {
        center: {lat: -25.4283708, lng: -49.28024},
        zoom: 14,
        mapTypeControl: false
    });
    
    infoWindow = new google.maps.InfoWindow();

    // The following group uses the location array to create an array of markers on initialize.
        for (var i = 0; i < restaurants.length; i++) {
            // Get the variables from the array.
            var position = restaurants[i].location;
            var title = restaurants[i].title;
            var id = restaurants[i].id;
            // Create a marker per restaurant, and put into markers array.
            marker = new google.maps.Marker({
            position: position,
            title: title,
            animation: google.maps.Animation.DROP,
            id: id,
        });
            // Adds marker to restaurant item.
            restaurants[i].markerObject = marker;
            // Push the marker to our array of markers.
            markers.push(marker);
            // Create an onclick event to open an infowindow at each marker.
            marker.addListener("click", function() {
                populateInfoWindow(this, infoWindow);
            });
        }
}

/* POPULATE INFOWINDOW FUNCTION*/

// This function populates the infowindow when the marker is clicked. We'll only allow
// one infowindow which will open at the marker that is clicked, and populate based
// on that markers position.

function populateInfoWindow(marker, infowindow) {
    // Check to make sure the infowindow is not already opened on this marker.
    if (infowindow.marker != marker) {
        // Get information from Google Maps API and display it on the marker's infowindow.
        var service = new google.maps.places.PlacesService(map);
        service.getDetails({placeId: marker.id}, function(place, status) {
            if (status === google.maps.places.PlacesServiceStatus.OK) {
                // Set the marker property on this infowindow so it isn't created again.
                infowindow.marker = marker;
                var innerHTML = "<div>";
                // If statements check for existance at Google Maps API request and if so adds it to the inner HTML.
                if (place.name) {
                    innerHTML += "<strong>" + place.name + "</strong><br>";
                }
                if (place.formatted_address) {
                    innerHTML += "<br>" + place.formatted_address;
                }
                if (place.formatted_phone_number) {
                    innerHTML += "<br>" + place.formatted_phone_number;
                }
                if (place.opening_hours) {
                    innerHTML += "<br><br><strong>Hours:</strong><br><br>" +
                        place.opening_hours.weekday_text[0] + "<br>" +
                        place.opening_hours.weekday_text[1] + "<br>" +
                        place.opening_hours.weekday_text[2] + "<br>" +
                        place.opening_hours.weekday_text[3] + "<br>" +
                        place.opening_hours.weekday_text[4] + "<br>" +
                        place.opening_hours.weekday_text[5] + "<br>" +
                        place.opening_hours.weekday_text[6];
                }
                if (place.photos) {
                    innerHTML += "<br><br><img src='" + place.photos[0].getUrl(
                        {maxHeight: 100, maxWidth: 200}) + "'>";
                }
                innerHTML += "</div>";
                infowindow.setContent(innerHTML);
                infowindow.open(map, marker);
                // Make sure the marker property is cleared if the infowindow is closed.
                infowindow.addListener("closeclick", function() {
                    infowindow.marker = null;
                });
            }
        });
    }
}
            
/* SHOW LISTINGS FUNCTION*/

// This function sets the markers to be visible when the page is loaded.
function showListings() {
    //display the marker.
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(map);  
    }   
} 

/* VIEW MODEL */

//Creates the view model with Knockout.

var AppViewModel = function() {

    var self = this;

    self.restaurants = ko.observableArray(restaurants);

    //click on gallery to display marker.
    self.clickGallery = function(restaurants) {
        map.setZoom(18);
        map.setCenter(restaurants.location);
        // Displays infowindow.
        populateInfoWindow(restaurants.markerObject, infoWindow);
    };

    self.query = ko.observable('');
   
    self.search = ko.computed(function() {
        //Defines the array with all the titles of markers that match the search query.
        var newArray = ko.utils.arrayFilter(self.restaurants(), function(gallery) {
            if (gallery.title.toLowerCase().indexOf(self.query().toLowerCase()) >= 0) {
                gallery.markerObject.setVisible(true);
                return true;
            } else {
                gallery.markerObject.setVisible(false);
                return false;
            }
        });
        return newArray;
    });
    
};

/* JQUERY INITIALIZER */

// Initialize Knockout and display markers when document is ready.

$(document).ready(function(){
    //Menu toggle.
    $('.menu-anchor').on('click touchstart', function(e){
        $('.menu').toggleClass('menu-active');
    });
    //Display Markers.
    showListings();
    // Initialize Knockout.
    ko.applyBindings(new AppViewModel());
});