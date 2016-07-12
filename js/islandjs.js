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

var langs = ['blockly', 'html', 'javascript', 'cpp', 'c', 'lisp', 'haskell',
'perl', 'ruby', 'python',];

/* Generate language checkboxes */
langs.forEach(function (lang) {
  $('#languages')
    .append('<p>\n')
    .append("\t<input name='" + lang + "' type='checkbox' id='" + lang + "'/>")
    .append("<label for ='" + lang + "'>" + lang + '</label>\n')
    .append('</p>');
});

$('#ranger').on('input', function () {
  $('#years').val($('#ranger').val());
});

$('#years').on('input', function () {
  $('#ranger').val($('#years').val());
});

$('form').submit(function (event) {
  event.preventDefault();
  var results = {
    Survey: 'NodeSchool',
    Name: $('#firstName').val(),
    Email: $('#email').val(),
    Volunteering: $('#volunteering_yes').is(':checked') ? true : false,
    Interests: $('#interests').val(),
    Program: $('#program_yes').is(':checked') ? true : false,
    Years: new Number($('#years').val()),
    Languages: langs.filter(function (lang) {
      return eval("$('#" + lang + "').is(':checked')"); }),
  };

  $.ajax({
    url: 'http://islandjs.org:3000/survey/spring',
    type: 'POST',
    crossDomain: true,
    data: JSON.stringify(results),
    dataType: 'json',
    success: function (response) {
      if (localStorage) {
        localStorage.setItem('survey', 'completed');
      } else {
        $.cookie('survey', 'completed');
      }

      window.history.back().reload();
    },

    error: function (xhr, status) {
      $('#error-modal').openModal();
    },
  });
});

$('#close-button').on('click', function () {
  window.history.back();
});
