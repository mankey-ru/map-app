<script>

	import _ from 'lodash';
	import mixins from './../vue-mixins.js';
	import GoogleMapsLoader from 'google-maps';

	GoogleMapsLoader.KEY = 'AIzaSyAXcMXDuPCPgDe-HLOIYhyYVF7VvVvQyJ0'
	GoogleMapsLoader.LANGUAGE = 'ru';
	GoogleMapsLoader.LIBRARIES = ['geometry', 'places']; // https://developers.google.com/maps/documentation/javascript/libraries

	export default {
		name: 'start',
		data: function () {
			return {
				title: 'Google maps with Google geocoding'
			}
		},
		methods: {

		},
		mixins: [mixins],
		mounted: function(){

			GoogleMapsLoader.load(function(google) {
				var el = document.getElementById('map-container')
			    var map = new google.maps.Map(el, {
				    center: {lat: 55.73305, lng: 37.61751},
				    zoom: 16
				  });

			    // Create the search box and link it to the UI element.
				  var input = document.getElementById('pac-input');
				  var searchBox = new google.maps.places.SearchBox(input);
				  map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

				  // Bias the SearchBox results towards current map's viewport.
				  map.addListener('bounds_changed', function() {
				    searchBox.setBounds(map.getBounds());
				  });

				  var markers = [];
				  // Listen for the event fired when the user selects a prediction and retrieve
				  // more details for that place.
				  searchBox.addListener('places_changed', function() {
				    var places = searchBox.getPlaces();

				    if (places.length == 0) {
				      return;
				    }

				    // Clear out the old markers.
				    markers.forEach(function(marker) {
				      marker.setMap(null);
				    });
				    markers = [];

				    // For each place, get the icon, name and location.
				    var bounds = new google.maps.LatLngBounds();
				    places.forEach(function(place) {
				      var icon = {
				        url: place.icon,
				        size: new google.maps.Size(71, 71),
				        origin: new google.maps.Point(0, 0),
				        anchor: new google.maps.Point(17, 34),
				        scaledSize: new google.maps.Size(25, 25)
				      };

				      // Create a marker for each place.
				      markers.push(new google.maps.Marker({
				        map: map,
				        icon: icon,
				        title: place.name,
				        position: place.geometry.location
				      }));

				      if (place.geometry.viewport) {
				        // Only geocodes have viewport.
				        bounds.union(place.geometry.viewport);
				      } else {
				        bounds.extend(place.geometry.location);
				      }
				    });
				    map.fitBounds(bounds);
				  });
			});

			GoogleMapsLoader.onLoad(function(google) {
			    console.log('I just loaded google maps api');
			});

		}
	}
</script>

<template>
	<div>
		<h2>{{title}}</h2>
    	<input id="pac-input" class="controls" type="text" placeholder="Search Box">
		<div id="map-container"></div>
	</div>
</template>

<style>
	#map-container {
		width: 100%;
		height: 600px;
	}


	.controls {
  margin-top: 10px;
  border: 1px solid transparent;
  border-radius: 2px 0 0 2px;
  box-sizing: border-box;
  -moz-box-sizing: border-box;
  height: 32px;
  outline: none;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
}

#pac-input {
  background-color: #fff;
  font-family: Roboto;
  font-size: 15px;
  font-weight: 300;
  margin-left: 12px;
  padding: 0 11px 0 13px;
  text-overflow: ellipsis;
  width: 300px;
}

#pac-input:focus {
  border-color: #4d90fe;
}

.pac-container {
  font-family: Roboto;
}

#type-selector {
  color: #fff;
  background-color: #4d90fe;
  padding: 5px 11px 0px 11px;
}

#type-selector label {
  font-family: Roboto;
  font-size: 13px;
  font-weight: 300;
}
</style>
