<script>
import './../../node_modules/leaflet/dist/leaflet.css';
//import './../../node_modules/leaflet-control-geocoder/dist/Control.Geocoder.css';
import _ from 'lodash';
import mixins from './../vue-mixins.js';
import L from 'leaflet';
import 'leaflet-geocoder-mapzen'; // replace to https://github.com/perliedman/leaflet-control-geocoder\

export default {
	name: 'Osm',
	data: function () {
		return {
			title: 'Osm maps with osm geocoding'
		}
	},
	methods: {
		forum_fetch: function () {}
	},
	mixins: [mixins],
	mounted: function () {

		var map = L.map('map-container').setView([55.73305, 37.61751], 16);
		L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
		attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
		})
		.addTo(map);

		
	},
	destroyed: function () {},
	beforeUpdate: function () {},
	created: function () {}
}


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
