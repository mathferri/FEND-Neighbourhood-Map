/* MAP */

var map;

function initMap() {
    // Constructor creates a new map - only center and zoom are required.
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: -25.4392395, lng: -49.2886484},
        zoom: 16,
        mapTypeControl: false
    });
}

/* MENU TOGGLE */

$(document).ready(function(){
    $('.menu-anchor').on('click touchstart', function(e){
        $('menu').toggleClass('menu-active');
    });
});