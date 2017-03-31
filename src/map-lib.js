import GoogleMapsLoader from 'google-maps';
GoogleMapsLoader.KEY = 'AIzaSyAXcMXDuPCPgDe-HLOIYhyYVF7VvVvQyJ0'
GoogleMapsLoader.LANGUAGE = 'ru';
GoogleMapsLoader.LIBRARIES = ['places'];
// positions explained: https://google-developers.appspot.com/maps/documentation/javascript/examples/full/control-positioning-labels
export default {
	create: function (onloadCb, isFullscreen) {
		var map;
		var fsClass = '__fullscreen';
		var mapContainer = document.getElementById('map-container');
		if (!mapContainer) {
			mapContainer = document.createElement('div');
			mapContainer.className = fsClass;
			document.body.appendChild(mapContainer)
		}
		var bFullscreen = mapContainer.className.indexOf(fsClass) !== -1;
		//_toggleClass(document.body, fsClass, bFullscreen);

		GoogleMapsLoader.load((google) => {
			map = new google.maps.Map(mapContainer, {
				center: {
					lat: 55.75184,
					lng: 37.62113
				},
				clickableIcons: false,
				zoom: 12,
				mapTypeControl: false,
				minZoom: 11,
				zoomControlOptions: {
					position: google.maps.ControlPosition.RIGHT_CENTER
				},
				streetViewControlOptions: {
					position: google.maps.ControlPosition.RIGHT_CENTER
				}
			});
			//window.map = map
			/** Prevent empty map, see http://stackoverflow.com/q/19003291 */
			google.maps.event.addListenerOnce(map, 'idle', function () {
				var cen = map.getCenter();
				google.maps.event.trigger(map, 'resize');
				map.setCenter(cen);
			});
			/** Extra controls */
			var ctrls = document.querySelectorAll('.j-mapctrl');
			for (let i = 0; i < ctrls.length; i++) {
				let el = ctrls[i];
				let pos = el.dataset.pos;
				if (pos) {
					map.controls[google.maps.ControlPosition[pos]].push(el);
				}
			}
			/** Search box */
			var searchInp = document.getElementById('map-ctrl-search');
			if (searchInp) {
				var searchBox = new google.maps.places.SearchBox(searchInp);
				// Bias the SearchBox results towards current map's viewport.
				map.addListener('bounds_changed', function () {
					searchBox.setBounds(map.getBounds());
				});
				var markers = [];
				// Listen for the event fired when the user selects a prediction and retrieve
				// more details for that place.
				searchBox.addListener('places_changed', function () {
					var places = searchBox.getPlaces();
					if (places.length === 0) {
						return;
					}
					// Clear out the old markers.
					markers.forEach(function (marker) {
						marker.setMap(null);
					});
					markers = [];
					// For each place, get the icon, name and location.
					var bounds = new google.maps.LatLngBounds();
					places.forEach(function (place) {
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
						}
						else {
							bounds.extend(place.geometry.location);
						}
					});
					map.fitBounds(bounds);
				});
			}
			if (typeof onloadCb === 'function') {
				onloadCb(map, google);
			}
		});

		// GoogleMapsLoader.onLoad((google) => {});
	}
}

function _toggleClass(el, theClass, boo) { // classList.toggle second argument support isnt good so...
	var hasClass = el.className.indexOf(theClass) !== -1;
	var conditionToRemove = typeof boo === 'undefined' ? hasClass : hasClass && !boo;
	var conditionToAdd = typeof boo === 'undefined' ? !hasClass : !hasClass && boo;
	if (conditionToRemove) {
		el.className = el.className.split(theClass).join('')
	}
	else if (conditionToAdd) {
		el.className += ' ' + theClass;
	}
}