$(document).ready(function () {
  var surveyCookie;
  if (localStorage) {
    surveyCookie = localStorage.getItem('survey');
  } else {
    surveyCookie = $.cookie('survey'); }

  if (!surveyCookie) $('#survey').removeClass('hiddendiv');

  $('.parallax').parallax();
});

/* Map */
var map;
function initialize() {
  var school = [47.635241, -122.520530];
  var brewery = [47.648509, -122.525361];
  var mapOptions = {
      zoom: 16,
      center: new google.maps.LatLng(brewery[0], brewery[1]), };
  map = new google.maps.Map(document.getElementById('map-canvas'),
    mapOptions);
  $('#map-canvas').addClass('center');
  var marker = new google.maps.Marker({
    map: map,
    title: 'NodeSchool',
  });
  marker.setPosition(new google.maps.LatLng(school[0], school[1]));
}

google.maps.event.addDomListener(window, 'load', initialize);
