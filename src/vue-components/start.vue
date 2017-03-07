<script>
	import './../../node_modules/leaflet/dist/leaflet.css';
	import './../../node_modules/leaflet-geocoder-mapzen/dist/leaflet-geocoder-mapzen.min.css';
	//import './../../node_modules/leaflet-control-geocoder/dist/Control.Geocoder.css';

	import _ from 'lodash';
	import mixins from './../vue-mixins.js';

	import L from 'leaflet';
	import 'leaflet-geocoder-mapzen'; // replace to https://github.com/perliedman/leaflet-control-geocoder

	import Mapzen from 'mapzen.js';


	export default {
		name: 'start',
		data: function () {
			return {
			}
		}
	}
</script>

<template>
	<div>
		<h1 class="text-center">
			<br /><br /><br />
			GOTO 
			<router-link to="/map-google">Google</router-link> or
			<router-link to="/map-mapzen">Mapzen</router-link>
		</h1>
	</div>
</template>

<style>
	#map-container {
		width: 100%;
		height: 600px;
	}
</style>
