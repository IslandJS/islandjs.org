$(document).ready(function () {
  $('.parallax').parallax();

  // show the survey button if it has not been filled out yet
  var surveyCookie;
  localStorage ? surveyCookie = localStorage.getItem('survey') : surveyCookie = $.cookie('survey');
  if (!surveyCookie) $('#survey').removeClass('hiddendiv');

  // populate the map with meetup details
  getMeetupInfo();
});

// Call the Meetup API to get info about the next meetup
// If a future meetup isn't scheduled, display the last one instead
function getMeetupInfo() {
  var nextMeetup = 'https://api.meetup.com/2/events?&callback=?' +
        '&group_urlname=IslandJS-Nodeschool' +
        '&status=upcoming' +
        '&page=1',
      lastMeetup = 'https://api.meetup.com/2/events?&callback=?' +
        '&offset=0' +
        '&group_urlname=IslandJS-Nodeschool' +
        '&time=-12w,' +
        '&status=past' +
        '&desc=true' +
        '&page=1';

  $.getJSON(nextMeetup).done(function (nextMeetupData) {
    if (nextMeetupData.results.length !== 0) {
      $('#past-future-event').text('Details on our next event: ');
      displayMeetupInfo(nextMeetupData);
    } else {
      $.getJSON(lastMeetup).done(function (lastMeetupData) {
        $('#past-future-event').text('Details from our last event: ');
        displayMeetupInfo(lastMeetupData);
      });
    }
  });
}

function displayMeetupInfo(data) {
  // handle missing data from the API
  if (data.results.length === 0) {
    missingData();
    return;
  }

  // convert UTC time and display basic location information
  var results = data.results[0],
      time = results.time,
      dateObj = new Date(time),
      days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August',
                'September', 'October', 'November', 'December'],
      day = days[dateObj.getDay()],
      date = dateObj.getDate(),
      month = months[dateObj.getMonth()],
      year = dateObj.getFullYear(),
      venue = results.venue.name,
      url = results.event_url,
      lat = results.venue.lat,
      lon = results.venue.lon,
      address = results.venue.address_1 + ',' +
                results.venue.city + ',' +
                results.venue.state + ' ' +
                results.venue.zip;

  $('#meetup-date').text(day + ', ' + month + ' ' + date + ', ' + year);
  $('#meetup-location').text('at ' + venue);
  $('#meetup-event-url').attr('href', url);
  initializeMap(lat, lon, address);
}

// Call Google Maps API to display a map of the next meetup location
var map, marker;
function initializeMap(lat, lon, address) {
  var mapOptions =  {
        zoom: 15,
        scrollwheel: false,
        draggable: false,
        center: new google.maps.LatLng(lat, lon),
      };
  map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions),
  marker = new google.maps.Marker({
    map: map,
    title: 'Bainbridge NodeSchool'
  });
  marker.setPosition(new google.maps.LatLng(lat, lon));
  $('#map-url').attr('href', 'https://www.google.com/maps/place/' + address);
}

// If Meetup doesn't return data, show the library on the map and say we're scheduling one soon
function missingData() {
  //library = [47.6352486, -122.522736], brewery = [47.64836, -122.52508]
  initializeMap(47.6352486, -122.522736);

  $('#meetup-details').html(
    '<blockquote>' +
      'We will schedule another meetup soon. ' +
      '<a href="http://www.meetup.com/IslandJS-Nodeschool/join/" target="_blank">' +
        'Join us' +
      '</a>' +
      ' on Meetup to get notified about our next event!' +
    '</blockquote>'
  );
}
