

<script>
	import './../../node_modules/leaflet/dist/leaflet.css';
	import _ from 'lodash';
	import mixins from './../vue-mixins.js';
	import L from './../../node_modules/leaflet/dist/leaflet.js';
	export default {
		name: 'forum-card',
		data: function () {
			return {
				title: 'test-map-app'
			}
		},
		methods: {
			forum_fetch: function() {
			}
		},
		mixins: [mixins],
		mounted: function(){
			var map = L.map('map-container').setView([51.505, -0.09], 13);
			L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
			    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
			}).addTo(map);

			L.marker([51.5, -0.09]).addTo(map)
			    .bindPopup('A pretty CSS3 popup.<br> Easily customizable.')
			    .openPopup();
		},
		destroyed: function () {},		
		beforeUpdate: function() {},
		created: function(){}
	}

	function getForum(arg) {
		return arg;
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
		height: 500px;
	}
</style>
