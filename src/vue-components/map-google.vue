<script>
	import _ from 'lodash';
	import mixins from './../vue-mixins.js';
	import GoogleMapsLoader from 'google-maps';
	import notie from 'notie';

	GoogleMapsLoader.KEY = 'AIzaSyAXcMXDuPCPgDe-HLOIYhyYVF7VvVvQyJ0'
	GoogleMapsLoader.LANGUAGE = 'ru';
	GoogleMapsLoader.LIBRARIES = ['places']; // https://developers.google.com/maps/documentation/javascript/libraries

	import Datepicker from 'vuejs-datepicker'; // next time try this https://www.npmjs.com/package/vue-material-datepicker
	function gei(id) {return document.getElementById(id)}

	export default {
		name: 'start',
		data: function () {
			return {
				textSearch: '',
				date: new Date(2016, 9, 16),
				genreList: [{
					name: 'Клауд реп',
					selected: true
				}, {
					name: 'Вич хаус',
					selected: true
				}, {
					name: 'Вепорвейв',
					selected: true
				}, {
					name: 'Дарк-фолк',
					selected: true
				}],
				map_pending: true,
				mark_cur: false,
				nevt_stage: 0,
			nevt: {} // NewEvent
		}
	},
	methods: {
		genresCheck: function (boo) {
			boo = !!boo;
			for (let gen of this.genreList) {
				gen.selected = !!boo;
			}
		},
		submit: function () {
			alert(JSON.stringify(this.$data, null, 2))
		},
		nevt_stage1: function(){
			this.nevt_stage = 1;
			notie.alert({
				type: 'success',
				text: 'Выберите расположение мероприятия на карте и нажмите «Далее»',
				time: 3
			});
			//placeMarker(map.getCenter())
		},
		nevt_stage2: function(){
			this.nevt_stage = 2;
		},
		nevt_submit: function(){

			// do things
			this.nevt_discard();
		},
		nevt_discard: function(){
			this.nevt_stage = 0;
			this.mark_cur.setMap(null);
			this.mark_cur = false;
		}
	},
	mixins: [mixins],
	components: {
		Datepicker
	},
	mounted: function () {
		_vm = this;
		GoogleMapsLoader.load(mapInit);
		GoogleMapsLoader.onLoad((google)=>{
			// https://github.com/googlemaps/v3-utility-library
			// http://htmlpreview.github.io/?https://github.com/googlemaps/v3-utility-library/blob/master/infobox/docs/reference.html
			//window.InfoBox = require('google-maps-infobox');
			//console.log()
			/*InfoBox({
				content: '123'
			})*/
			this.map_pending = false;
		});
	},
	computed: {
		nevt_invalid: function(){
			return false
		}
	}
}


var _vm;
var mark_cur;
var map;

function mapInit(google) {
	map = new google.maps.Map(gei('map-container'), {
		center: {
			lat: 55.75184,
			lng: 37.62113
		},
		clickableIcons: false,
		zoom: 12,
		mapTypeControl: false,
		minZoom: 11
	});
	/** Pushing extra controls */
	var ctrls = document.querySelectorAll('.map-ctrl-wrap');
	for (let i=0; i<ctrls.length; i++) {
		let el = ctrls[i];
		let pos = el.dataset.pos;
		if (pos) {
			map.controls[google.maps.ControlPosition[pos]].push(el);
		}
	}

	/** Search box */
	// Create the search box and link it to the UI element.
	var input = gei('map-ctrl-search');
	var searchBox = new google.maps.places.SearchBox(input);
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

	/** Marker add on click */
	google.maps.event.addListener(map, 'click', function(evt) {
		if (_vm.nevt_stage===1) {
			placeMarker(evt.latLng);
		}
	});
}


function placeMarker(location, opt) {
	if (_vm.mark_cur) {
		_vm.mark_cur.setPosition(location);
	} 
	else {
		opt = opt || {};
		var options = _.defaults({
			position: location,
			map: map,
			draggable: true,
			animation: google.maps.Animation.DROP
		}, opt)
		_vm.mark_cur = new google.maps.Marker(options);
	}
}
</script>

<template>

	<div>
		<div class="well">
			<div class="row form-group">
				<div class="col-md-7 col-xs-24">
					<label>Название</label>
					<input v-model="textSearch" class="form-control" />
				</div>
				<div class="col-md-10 col-xs-24">
					<div>
						<label>Жанры</label> 
						&#160;&#160;&#160;
						<a v-on:click="genresCheck(1)" class="link-dotted">Все</a> &#160;
						<a v-on:click="genresCheck(0)" class="link-dotted">Ничего</a>
					</div>
					<div>
						<label v-for="gen in genreList" class="genre btn btn-default" v-bind:class="gen.selected?'active':''">
							<input type="checkbox" v-model="gen.selected" />
							<span>{{gen.name}}</span>
						</label>
						<span class=""></span>
					</div>
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

		<div v-show="map_pending" class="text-center">
			<i class="spin spin-lg"></i>
		</div>

		<div v-show="!map_pending">
			<div class="hdn">
				<div data-pos="TOP_RIGHT" class="map-ctrl-wrap">
					<a v-show="nevt_stage===0" v-on:click="nevt_stage1" class="btn btn-primary btn-lg">
						<i class="glyphicon glyphicon-plus"></i> Добавить событие
					</a>
					<a v-show="nevt_stage===1" v-bind:disabled="!mark_cur" v-on:click="nevt_stage2" class="btn btn-success btn-lg">
						<i class="glyphicon glyphicon-ok"></i> Далее
					</a>
				</div>
				<div data-pos="TOP_LEFT" class="map-ctrl-wrap">
					<input id="map-ctrl-search" class="form-control" style="width: 20em" placeholder="Поиск мест" />
				</div>
				<div data-pos="TOP_LEFT" class="map-ctrl-wrap" v-show="nevt_stage==2">
					<form v-on:submit.prevent="register_submit" class="evt-form">
						<div class="form-group">
							<label>Название</label>
							<input v-model="nevt.name" class="form-control" />
						</div>
						<div class="form-group">
							<label>Описание</label>
							<textarea v-model="nevt.descr" class="form-control"></textarea>
						</div>
						<div class="row">
							<div class="col-xs-12">
								<a v-on:click="nevt_discard" class="btn btn-default">
									<i class="glyphicon glyphicon-chevron-left"></i> 
									Отмена
								</a>	
							</div>
							<div class="col-xs-12 text-right">
								<a v-on:click="nevt_submit" v-bind:disabled="nevt_invalid" type="submit" class="btn btn-primary">
									<i class="glyphicon glyphicon-ok"></i> 
									Сохранить
								</a>
							</div>
						</div>
					</form>
				</div>
			</div>
			<div id="map-container"></div>
		</div>

	</div>
</template>

<style scoped>
	#map-container {
		width: 100%;
		height: 600px;
		background-color: #eee;
		border-radius: 3px;
	}
	.map-ctrl-wrap {
		margin: 1em;
	}
	.evt-form {
		width: 40em;
		background-color: #fff;
		padding: 2em;
		border-radius: 3px;
	}
	.genre {
		cursor: pointer;
		margin-top: .1em;
		margin-right: 1em;
		font-weight: normal;
		font-size: 1em;
		opacity: .7;
	}
	.genre.active {
		opacity: 1;
	}
	.genre>input {
		display: none;
	}
	textarea {
		resize: none;
	}
</style>
