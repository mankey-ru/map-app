<script>
	import mixins from './../vue-mixins.js'
	import request from 'superagent'
	import {
		Toast,
		Dialog
	}
	from 'quasar-framework'

	import {
		QModal,
		QAjaxBar,
		QLayout,
		QToolbar,
		QToolbarTitle,
		QSpinner,
		QInlineDatetime,
		QInput,
		QIcon,
		QBtn,
		QTooltip,
		QFixedPosition
	}
	from 'quasar'

	var apiUrl = require('./../api-url.js').def;
	
	import mapboxgl from 'mapbox-gl';
	mapboxgl.accessToken = 'pk.eyJ1IjoiZDBlc250bWF0dGVyIiwiYSI6ImNqMmxtdHF2ODAwMHAycW82NTkycmlrNXcifQ.FoKPoQo54xurQSdHSnShRw';
	require('mapbox-gl/dist/mapbox-gl.css');

	var _vm;
	var map;
	var layerRef;
	var layerID = 'evtLayerID';
	var uniqueFeatures;

	export default {
		name: 'MainPage',		
		components: {
			QModal, QAjaxBar, QLayout, QToolbarTitle, QSpinner, QInlineDatetime, QInput, QIcon, QBtn, QTooltip, QFixedPosition
		},
		data: function() {
			return {
				search: {
					date: '',
					text: ''
				},
				search_pending: false,
				map_pending: true,
				genres: [],
				evtList: [],
				evtHiddenQty: 0
			}
		},
		computed: {
			c_searchDate: function(){
				var sdate = this.$data.search.date;
				return sdate ? this.$options.filters.dateFormatPretty(sdate) : 'Любая дата';
			}
		},
		methods: {
			showAll: function() {
				for (var i = 0, len = this.$data.evtList.length; i < len; i++) {
					this.$data.evtList[i].mark.setVisible(true)
					this.evtHiddenQty = 0;
					this.genres_checkAll(1);
				}
			},
			genres_check: function(gen, boo) {
				var newState = typeof boo === 'undefined' ? !gen.selected : boo;
				gen.selected = newState;
				var selected_ids = this.$data.genres
				.filter(function(_gen) {
					return _gen.selected === true
				})
				.map(function(_gen) {
					return _gen._id
				})
				var matchedEvents = [];
			// TODO debounce or pass closure to $nextTick
			for (var i = 0, len = this.$data.evtList.length; i < len; i++) {
				var event = this.$data.evtList[i];
				var eventMatch = selected_ids.indexOf(event.genre_id) !== -1;
				if (eventMatch === true) {
					matchedEvents.push(event);
				}
			}
			this.evtHiddenQty = this.evtList.length - matchedEvents.length;
			var features = map.queryRenderedFeatures({layers: [layerID]});
			if (features) {				
				// map.setFilter(layerID, ['has', '_id']); ---- показать все
				map.setFilter(layerID, ['in', '_id'].concat(matchedEvents.map(function(event) {
					return event._id;
				})));
			}
		},
		genres_checkAll: function(boo) {
			boo = !!boo;
			for (let gen of this.genres) {
				this.genres_check(gen, boo)
			}
		},
		evtSearch: function() {
			this.search_pending = true;
			this.getEvents();
		},
		getEvents: function() {
			request
			.get(apiUrl + 'events')
			.query(this.search)
			.end((err, res) => {
				this.search_pending = false;
				if (err) {
					Toast.create.negative('Ошибка запроса')
				}
				else {
					if (res.body.evtList instanceof Array) {
						if (res.body.evtList.length === 0) {
							Toast.create.info('По вашему запросу ничегошенки не нашлось :(');
							return
						}
						if (map.getLayer(layerID)) {
							map.removeSource(layerID); // map.removeLayer(layerID); layer removed automatically with source
						}

						this.$data.evtList = [];
						var featureList = [];

						//console.time('adding markers on map');
						for (var i = 0, len = res.body.evtList.length; i < len; i++) { // res.body.evtList.length 
							var evt = res.body.evtList[i];
							this.$data.evtList.push(evt);
							var evtFeature = {
								type: 'Feature',
								properties: {
									_id: evt._id,
									name: evt.name,
									descr: evt.descr,
									iconcode: 'fire-station'
										// https://github.com/mapbox/mapbox-gl-styles/tree/master/sprites/basic-v9/_svg
										// https://www.mapbox.com/maki-icons/
										// theatre art-gallery star music
									},
									geometry: {
										type: 'Point',
										coordinates: evt.latLng.reverse()
									}
								};
								evt.mark = evtFeature;
								featureList.push(evtFeature);
							}
						// On initial layer creation we should add layer-related event handlers
						if (!layerRef) {
							map.on('moveend', function() {
								var features = map.queryRenderedFeatures({
									layers: [layerID]
								});
								if (features) {
									uniqueFeatures = getUniqueFeatures(features, '_id');
								}
							});
							map.on('click', layerID, function(ev) {
								var props = ev.features[0].properties;
								Dialog.create({
									title: props.name,
									message: props.descr,
									//stackButtons: true,
									buttons: [{
										label: 'Подробнее',
										handler: function() {
											_vm.$router.push(`event/card/${props._id}`);
										}
									}, {
										label: 'Я пойду',
										handler: function() {

										}
									}]
								})
							});
							map.on('mouseenter', layerID, function() {
								map.getCanvas().style.cursor = 'pointer';
							});
							map.on('mouseleave', layerID, function() {
								map.getCanvas().style.cursor = '';
							});
						}
						layerRef = map.addLayer({
							id: layerID,
							type: 'symbol',
							source: {
								type: 'geojson',
								data: {
									type: 'FeatureCollection',
									features: featureList
								}
							},
							layout: { // https://www.mapbox.com/mapbox-gl-js/style-spec/#layers-symbol
								'icon-image': '{iconcode}-15',
								'icon-allow-overlap': true,
								'icon-size': 1.3
							}
						});
						//console.log(map.queryRenderedFeatures({layers:[layerID]}))
						//console.timeEnd('adding markers on map');
					}

				}
			})
		}
	},
	mixins: [mixins],
	mounted: function() {
		_vm = this;
		map = new mapboxgl.Map({
			container: 'map-container',
			style: 'mapbox://styles/d0esntmatter/cj2lokqx1000f2rs0ronhfmfy',
			minZoom: 10,
			zoom: 12,
			center: [37.62113, 55.75184] // lng then lat. Thats weird.
		});
		map.on('load', function(){
			_vm.getEvents();
		});
		window.mmm = map;

		// Handling genre list
		// If vuex has genres right now, they are copied to $data right now
		if (this.$store.state.genreList) {
			setGenres(this.$store.state.genreList)
		}
		// Otherwise it happens after store mutation
		else { 
			this.$store.subscribe(function(mutation, state) {
				if (mutation.type === 'm_loadCommonData') {
					setGenres(state.genreList)
				}
			})
		}
		function setGenres(state_genreList) {
			var mapped = state_genreList.map((v) => {
				_vm.$set(v, 'selected', true)
				return v
			});
			_vm.$data.genres = mapped;
		}
	}
}

// Because features come from tiled vector data, feature geometries may be split
// or duplicated across tile boundaries and, as a result, features may appear
// multiple times in query results.
function getUniqueFeatures(array, comparatorProperty) {
	var existingFeatureKeys = {};
	var uniqueFeatures = array.filter(function(el) {
		if (existingFeatureKeys[el.properties[comparatorProperty]]) {
			return false;
		}
		else {
			existingFeatureKeys[el.properties[comparatorProperty]] = true;
			return true;
		}
	});
	return uniqueFeatures;
}
</script>

<template>
	<!-- TODO use https://www.npmjs.com/package/v-media-query instead of bootstrap media queries like visible-xs -->
	<div>
		<q-modal ref="modal_date" position="top">
			<div class="generic-margin group">
				<div>
					<q-inline-datetime v-model="search.date" type="date" v-on:input="$refs.modal_date.close()"></q-inline-datetime>
				</div>
				<div class="row">
					<div class="col-6">
						<q-btn v-on:click.prevent="search.date = ''" color="purple">
							Любая дата
						</q-btn>
					</div>
					<div class="col-6 text-right">
						<q-btn v-on:click="$refs.modal_date.close()" color="primary">
							Ок
						</q-btn>
					</div>
				</div>
			</div>
		</q-modal>

		<q-modal ref="modal_genres" position="bottom" v-bind:content-css="{minWidth: '70vw', minHeight: '40vh'}">
			<q-layout>
				<div slot="header" class="toolbar primary">
					<q-toolbar-title :padding="1">
						Выберите жанры
					</q-toolbar-title>
				</div>
				<div slot="footer" class="toolbar primary">
					<div class="row full-width">
						<div class="width-3of4">
							<button v-on:click="genres_checkAll(1)" class="primary">
								<i class="mdi mdi-checkbox-multiple-marked-outline"></i> 
								Всё
							</button> 
							&#160;
							<button v-on:click="genres_checkAll(0)" class="primary">
								<i class="mdi mdi-checkbox-multiple-blank-outline"></i>
								Ничего
							</button>
						</div>
						<div class="width-1of4 text-right">
							<button v-on:click="$refs.modal_genres.close()" class="primary">
								Закрыть
							</button>
						</div>
					</div>
				</div>
				<div class="layout-view">
					<div class="layout-padding">
						<div class="group">
							<span v-for="gen in genres" class="chip label cursor-pointer text-white" v-bind:class="gen.selected?'bg-primary':'bg-grey-6'" v-on:click="genres_check(gen)">
								{{gen.name}}
							</span>
						</div>
					</div>
				</div>
			</q-layout>
		</q-modal>

		<div class="map-ctrl-wrap absolute-top-left">
			<div class="map-pane-main row inline"><!-- lt-lg === hide-on-drawer-visible-->
				<q-icon name="menu" color="black" class="pntr lt-lg" v-on:click="$parent.$parent.$refs.drawer_left.open()"/>
				<form class="gt-md" v-on:submit.prevent="evtSearch">
					<q-input v-model="search.text" placeholder="Поиск" class="no-margin">
						<q-icon name="fa-search" color="black" class="pntr" v-show="!search_pending" v-on:click="evtSearch"/>
						<q-spinner v-show="search_pending" />
					</q-input>
				</form>
			</div>
			<span class="gt-md inline">
				<div class="map-pane__date"><!-- Calendar Desktop -->
					<div class="cursor-pointer" v-on:click="$refs.modal_date.open()">
						<span>{{c_searchDate}}</span> 
						<q-icon name="fa-calendar" />
					</div>
				</div>				
			</span>
		</div>


		<div class="map-ctrl-wrap absolute-top-right">			
			<div class="lt-lg"><!-- Calendar Mobile -->
				<button class="primary push bg-white text-black big" v-on:click="$refs.modal_date.open()">
					<q-icon name="fa-calendar" />
				</button>
			</div>			
			<div class="gt-md"><!-- Desktop -->
				<div v-if="currentUser">
					<q-icon v-on:click.prevent="GOTO_PROFILE" name="fa-user-circle" class="icon-profile"/>
				</div>
				<div v-if="!currentUser">
					<q-btn color="primary" big push v-on:click="GOTO_LOGIN">
						Вход
					</q-btn> &#160;
					<q-btn color="primary" big push v-on:click="GOTO_REGISTER">
						Регистрация
					</q-btn>
				</div>
			</div>
		</div>

		<div class="map-ctrl-wrap absolute-bottom-left">
			<div class="text-center">
				<div>
					<span v-show="evtHiddenQty!==0">
						Скрыто {{evtHiddenQty}} из {{evtList.length}}. 
						<a class="link-dotted" v-on:click="showAll">Показать все</a>
					</span>
				</div>
				<q-btn big color="primary" push v-on:click="$refs.modal_genres.open()">
					<q-tooltip :delay="500" anchor="center right" self="center left" :offset="[20, 0]">Отфильтровать события по жанрам</q-tooltip>
					Жанры
				</q-btn>
			</div>
		</div>

		<div v-if="currentUser && currentUser.role" >
			<div class="map-ctrl-wrap absolute-bottom-right">
				<q-fixed-position corner="bottom-right" :offset="[18, 18]">
					<q-btn round color="primary" v-on:click="GOTO_EVT_NEW">
						<q-icon name="fa-plus" />
						<q-tooltip anchor="center left" self="center right" :offset="[20, 0]">Создать мероприятие</q-tooltip>
					</q-btn>
				</q-fixed-position>
			</div>
		</div>

		<div id="map-container" class="__fullscreen"></div>
	</div>
</div>
</template>

<style scoped lang="less">
	.map-ctrl-wrap {
		margin: 1.5em;
		z-index: 1;
	}
	.icon-profile {
		font-size: 6em;
		cursor: pointer;
	}
	.-boxshad {
		box-shadow: #000 1px 2px 4px 0px;
	}
	.map-pane__content {
		.-boxshad();		
		font-size: 1.4em;
		border-radius: 3px;
		background: #fff;
		padding: .3em .5em;
	}
	.map-pane__date {
		.map-pane__content();
		display: inline-block;
	}
	.map-pane-main {		
		float:left;
		.map-pane__content();
		margin-right: .4em;
		input{
			margin-left: 1em;
			border: none;
			width:15em;
		}
	}
</style>

<style>
	.mark-custom-cls {
		width: 44px;
		/* background-image: url(pin.svg); */
		width: 22px;
		height: 22px;
		background-color: #1290fd;
		box-shadow: #aaa 0px 0px 9px 3px;
		border-radius: 50%;
		cursor: pointer;
	}
</style>