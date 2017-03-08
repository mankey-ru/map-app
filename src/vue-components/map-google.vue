<script>

	import _ from 'lodash';
	import mixins from './../vue-mixins.js';
	import GoogleMapsLoader from 'google-maps';
	import TokIn from './_token-input.vue'

	GoogleMapsLoader.KEY = 'AIzaSyAXcMXDuPCPgDe-HLOIYhyYVF7VvVvQyJ0'
	GoogleMapsLoader.LANGUAGE = 'ru';
	GoogleMapsLoader.LIBRARIES = ['places']; // https://developers.google.com/maps/documentation/javascript/libraries

	import Datepicker from 'vuejs-datepicker'; // next time try this https://www.npmjs.com/package/vue-material-datepicker

	export default {
		name: 'start',
		data: function () {
			return {
				title: 'Google maps with Google geocoding',
				textSearch: '',
				date: new Date(2016, 9,  16),
				genres: ['Cloud rap', 'Witch house', 'Stadium Rock']
			}
		},
		methods: {
			onChangeToken: function(){

			},
			submit: function(){
				alert(JSON.stringify(this.$data, null, 2))
			}
		},
		mixins: [mixins],
		components: {
			'token-input': TokIn,
			Datepicker
		},
		mounted: function(){
			GoogleMapsLoader.load(function(google) {
				var el = document.getElementById('map-container')
				var map = new google.maps.Map(el, {
					center: {lat: 55.73305, lng: 37.61751},
					zoom: 16,
					mapTypeControl: false
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
					//console.log('I just loaded google maps api');
				});

		}
	}
</script>

<template>
	<div>
		<h2>{{title}}</h2>
		<div class="well">
			<div class="row form-group">
				<div class="col-md-7 col-xs-12">
					<label>Название</label>
					<input v-model="textSearch" class="form-control" />
				</div>
				<div class="col-md-10 col-xs-12">
					<label>Жанры</label>
					<token-input 
					class="form-control" 
					v-bind:on-change="onChangeToken()" 
					v-bind:tags="genres"
					v-bind:placeholder="'Type and press enter'"
					></token-input> 
				</div>
				<div class="col-md-4 col-xs-12" v-bind:class="{'datepicker__date-empty': !date}">
					<label>Дата</label>
					<div class="__datepicker-wrap">
						<datepicker 
						:input-class="'form-control'" 
						v-model="date"
						:language="'ru'"
						:monday-first="true"
						:format="'dd.MM.yyyy'"
						></datepicker>
						<i class="__datepicker-clear" v-on:click="date=null">
							<i class="glyphicon glyphicon-remove"></i>
						</i>
					</div>
				</div>
				<div class="col-md-3 col-xs-12">
					<label>&#160;</label>
					<a class="btn btn-primary btn-block" v-on:click="submit">Искать</a>
				</div>
			</div>
		</div>
		<input id="pac-input" class="controls" type="text" placeholder="Поиск мест">
		<div id="map-container"></div>
	</div>
</template>

<style scoped>
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
