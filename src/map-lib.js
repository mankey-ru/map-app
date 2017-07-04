import mapboxgl from 'mapbox-gl';
mapboxgl.accessToken = 'pk.eyJ1IjoiZDBlc250bWF0dGVyIiwiYSI6ImNqMmxtdHF2ODAwMHAycW82NTkycmlrNXcifQ.FoKPoQo54xurQSdHSnShRw';
require('mapbox-gl/dist/mapbox-gl.css');

var mapCenter = [37.62113, 55.75184];

export default {
	newMap: function() {
		return new mapboxgl.Map({
			container: 'map-container',
			style: 'mapbox://styles/d0esntmatter/cj2lokqx1000f2rs0ronhfmfy',
			minZoom: 10,
			zoom: 12,
			center: mapCenter // lng then lat. Thats weird.
		})
	},
	mapCenter: mapCenter,
	layerID: 'myLayerID', // для страниц с единственной картой с единственным слоем
	sourceID: 'mySourceID' // для страниц с единственной картой с единственным слоем
}