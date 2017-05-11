<script>
import mixins from './../vue-mixins.js'
import request from 'superagent'
import {
	Toast,
	Dialog
}
from 'quasar-framework'

var apiUrl = require('./../api-url.js').def;

require('mapbox-gl/dist/mapbox-gl.css');

import mapboxgl from 'mapbox-gl';
mapboxgl.accessToken = 'pk.eyJ1IjoiZDBlc250bWF0dGVyIiwiYSI6ImNqMDF1aWpqcDAyMW8ycXFuaDM2MzU1emIifQ.6PVUbllSeBVy41c-fSeqTg';

var map;
var _vm;

export default {
	name: 'MainPage',
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
	computed: {},
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
			var hiddenQty = 0;
			// TODO debounce or pass closure to $nextTick
			for (var i = 0, len = this.$data.evtList.length; i < len; i++) {
				var evt = this.$data.evtList[i];
				var evtMatch = selected_ids.indexOf(evt.genre_id) !== -1;
				evt.mark.setVisible(evtMatch)
				if (evtMatch === false) {
					hiddenQty++
				}
			}
			this.evtHiddenQty = hiddenQty;
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
						Toast.create.error(err || 'Failed to get events')
					}
					else {
						if (res.body.evtList instanceof Array) {
							if (res.body.evtList.length === 0) {
								Toast.create.warning('По вашему запросу ничегошенки не нашлось :(');
								return
							}

							console.time('removing markers from map');
							/*for (var i=0, len=this.$data.evtList.length; i<len; i++) {
								this.$data.evtList[i].mark.remove();
							}*/
							console.timeEnd('removing markers from map');

							this.$data.evtList = [];
							var featureList = [];

							console.time('adding markers on map');
							for (var i = 0, len = res.body.evtList.length; i < len; i++) { // res.body.evtList.length 
								var evt = res.body.evtList[i];

								this.$data.evtList.push(evt);

								// Opening infobox automatically for a single result
								if (res.body.evtList.length === 1) {
									// mark.togglePopup()
								}
								var evtFeature = {
									type: 'Feature',
									properties: {
										_id: evt._id,
										name: evt.name,
										descr: evt.descr,
										iconcode: 'star' 
										// https://github.com/mapbox/mapbox-gl-styles/tree/master/sprites/basic-v9/_svg
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
							var myLayer = map.addLayer({
								id: 'myLayerId',
								type: 'symbol',
								source: {
									type: 'geojson',
									data: {
										type: 'FeatureCollection',
										features: featureList
									}
								},
								layout: {
									'icon-image': '{iconcode}-15', 
            						// 'text-field': '{name}',
									'icon-allow-overlap': true
								}/*,
								paint: {
									'fill-color': "#00ffff"
								}*/
							});

							map.on('click', 'myLayerId', function(ev) {
								var props = ev.features[0].properties;
								Dialog.create({
									title: props.name,
									message: props.descr,
									buttons: [{
										label: 'Подробнее',
										handler: function() {
											_vm.$router.push(`event/card/${props._id}`);
										}
									}]
								})
								/*new mapboxgl.Popup()
									.setLngLat(ev.features[0].geometry.coordinates)
									.setHTML(ev.features[0].properties.description)
									.addTo(map);*/
							});
							map.on('mouseenter', 'myLayerId', function() {
								map.getCanvas().style.cursor = 'pointer';
							});
							map.on('mouseleave', 'myLayerId', function() {
								map.getCanvas().style.cursor = '';
							});

							console.timeEnd('adding markers on map');
						}

					}
				})
		}
	},
	mixins: [mixins],
	components: {},
	mounted: function() {
		_vm = this;

		map = new mapboxgl.Map({
			container: 'map-container',
			//style: 'mapbox://styles/mapbox/streets-v9',
			style: 'mapbox://styles/d0esntmatter/cj2kdezgu001e2smvq8302bid',
			minZoom: 10,
			zoom: 13,
			center: [37.62113, 55.75184] // lng then lat
		});
		map.on('load', _vm.getEvents);
		window.mmm = map;

		// Handling genre list
		// If store have genres right now, they are copied to $data right now
		if (this.$store.state.genreList) {
			setGenres(this.$store.state.genreList)
		}
		else { // Otherwise it happens after store mutation
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
</script>

<template>
	<!-- TODO use https://www.npmjs.com/package/v-media-query instead of bootstrap media queries like visible-xs -->
	<div>
		<q-modal ref="modal_date" position="top">
			<div class="generic-margin group">
				<div>
					<q-inline-datetime v-model="search.date" type="date" v-on:input="$refs.modal_date.close()">
						
					</q-inline-datetime>
				</div>
				<div class="row">
					<div class="width-1of2">
						<button v-on:click.prevent="search.date = ''" class="tertiary">
							Любая дата
						</button>
					</div>
					<div class="width-1of2 text-right">
						<button v-on:click="$refs.modal_date.close()" class="primary">
							Ок
						</button>
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
			<div class="map-pane-main row inline"><!-- hide-on-drawer-visible -->

				<i v-on:click="$parent.$parent.$refs.drawer_left.open()" class="mdi mdi-menu"></i>

				<form class="inline" v-on:submit.prevent="evtSearch">
					<span class="gt-sm">
						<input v-model="search.text" placeholder="Поиск" />
						<span class="search-icon-wrap">
							<spinner v-show="search_pending" v-bind:size="30"></spinner>
							<i v-show="!search_pending" v-on:click="evtSearch" class="search-icon">search</i>
						</span>
					</span>
				</form>
			</div>
			<div class="sm-hide row inline">
				<div class="map-pane__date">
					<div class="cursor-pointer" v-on:click="$refs.modal_date.open()">
						<span>{{search.date | dateFormatPretty}}</span> 
						<i class="mdi mdi-calendar"></i>
					</div>
				</div>
			</div>
		</div>


		<div class="map-ctrl-wrap absolute-top-right">
			<!-- Mobile -->
			<div class="lt-md">
				<button class="primary push bg-white text-black big" v-on:click="$refs.modal_date.open()">
					<i class="mdi mdi-calendar"></i>
				</button>
			</div>
			<!-- Desktop -->
			<div class="gt-sm">
				<div v-if="currentUser">
					<i v-on:click.prevent="GOTO_PROFILE" class="mdi mdi-account-box map-profile-icon"></i>
				</div>
				<div v-if="!currentUser">
					<button class="primary push bg-white text-black big" v-on:click="GOTO_LOGIN">
						Вход
					</button> &#160;
					<button class="primary push bg-white text-black big" v-on:click="GOTO_REGISTER">
						Регистрация
					</button>
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
				<button class="primary push" v-on:click="$refs.modal_genres.open()">
					Фильтр по жанрам
				</button>
			</div>
		</div>

		<div v-if="currentUser && currentUser.role" >
			<div class="map-ctrl-wrap absolute-bottom-right">
				<button class="gt-md push primary round big" v-on:click="GOTO_EVT_NEW">
					Создать мероприятие 
				</button>
				<button class="lt-bg push primary circular big" v-on:click="GOTO_EVT_NEW">
					<i class="mdi mdi-plus"></i>
				</button>
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
	.search-icon {
		cursor: pointer;	
		font-size: 1.7em;
	}
	.search-icon-wrap {
		width: 1.5em;
		display: inline-block;
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
	.mdi {
		cursor: pointer;
		font-size: 1.8em;
	}
	.map-profile-icon {
		font-size: 6em;
		cursor: pointer;
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