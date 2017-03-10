import GoogleMapsLoader from 'google-maps';
GoogleMapsLoader.KEY = 'AIzaSyAXcMXDuPCPgDe-HLOIYhyYVF7VvVvQyJ0'
GoogleMapsLoader.LANGUAGE = 'ru';
GoogleMapsLoader.LIBRARIES = ['places'];

export default {
	create: function (onloadCb) {
		var map;
		var mapContainer = document.getElementById('map-container');
		if (!mapContainer) {
			console.error('Element with id=map-container not found')
			return
		}
		GoogleMapsLoader.load((google) => {
			map = new google.maps.Map(mapContainer, {
				center: {
					lat: 55.75184,
					lng: 37.62113
				},
				clickableIcons: false,
				zoom: 12,
				mapTypeControl: false,
				minZoom: 11
			});
			//window.map = map
			/** Prevent empty map, see http://stackoverflow.com/q/19003291 */
			google.maps.event.addListenerOnce(map, 'idle', function () {
				var cen = map.getCenter();
				google.maps.event.trigger(map, 'resize');
				map.setCenter(cen);
			});
			/** Extra controls */
			var ctrls = document.querySelectorAll('.map-ctrl-wrap');
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