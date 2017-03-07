<script>
import './../../node_modules/leaflet/dist/leaflet.css';
import './../../node_modules/leaflet-geocoder-mapzen/dist/leaflet-geocoder-mapzen.min.css';
//import './../../node_modules/leaflet-control-geocoder/dist/Control.Geocoder.css';


import _ from 'lodash';
import mixins from './../vue-mixins.js';

import L from 'leaflet';
import 'leaflet-geocoder-mapzen'; // replace to https://github.com/perliedman/leaflet-control-geocoder

import Mapzen from 'mapzen.js';


import st from './../st.js';

export default {
	name: 'Mapzen',
	data: function () {
		return {
			title: 'Mapzen maps with Mapzen geocoding'
		}
	},
	methods: {
		forum_fetch: function () {}
	},
	mixins: [mixins],
	mounted: function () {
		/**
			Mapzen/Tangram layer init
			http://tangrams.github.io/generic-demo/
			note: it should be BEFORE map
			Mapzen.bug has no styles in npm bundle so its useless
  			alternative plugin has autocomplete
  			https://github.com/mapzen/leaflet-geocoder
		*/
		Mapzen.apiKey = 'mapzen-33jrZyT';
		var map
		var layer = this.$router._maplayer;
		if (layer) {
			initMap()
		}
		else {
			layer = Mapzen._tangram({
				scene: 'scene.yaml', // https://mapzen.com/documentation/tangram/Scene-file/
				attribution: 'GenericLayer'
			});
			window.addEventListener('load', ()=>{
				initMap()
				this.$router._maplayer = layer;
			});
		}
		function initMap(){
			/**
				Leaflet map init
				note: its init should be BEFORE map
				Mapzen.bug has no styles in npm bundle so its useless
			*/
			map = L.map('map-container');
			// https://mapzen.com/documentation/mapzen-js/api-reference/
			// TODO define debugTangram + scene
			map.setView([55.73305, 37.61751], 16);


			/**
  				Geocoder plugin for Leaflet by Mapzen
  			*/
			var geocoder = L.control
				.geocoder(Mapzen.apiKey, {
					placeholder: 'Искать',
					errorMessage: 'Ничего не найдено',
					bounds: true,
					position: 'topright',
					expanded: true
				})
				.addTo(map);

			layer.addTo(map);
			layer.on('init', function () {});
		}

	},
	destroyed: function () {},
	beforeUpdate: function () {},
	created: function () {}
}

/*
// http://leafletjs.com/reference-1.0.3.html
// http://leafletjs.com/plugins.html
var map = L.map('map-container').setView([51.505, -0.09], 13);
L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);
L.marker([51.5, -0.09]).addTo(map)
.bindPopup('A pretty CSS3 popup.<br> Easily customizable.')
.openPopup();
*/
</script>

<template>
	<div>
		<h2>{{title}}</h2>
		<div id="map-container"></div>
	</div>
</template>

<style>
	#map-container {
		width: 100%;
		height: 600px;
	}
</style>
