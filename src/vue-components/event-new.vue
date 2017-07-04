<script>
	var apiUrl = require('./../api-url.js').def;
	import mapLib from './../map-lib.js'
	import mixins from './../vue-mixins.js'
	import request from 'superagent'	
	import {QInput, QSpinner, QIcon, QBtn, Toast, QModal, QModalLayout, QToolbar, QToolbarTitle, QCheckbox, QDialogSelect, QInlineDatetime} from 'quasar'

	var map;
	var latLngCache; // чтобы не дёргать Vue при перетаскивании метки

	export default {
		name: 'evt-new',		
		components: {QInput, QSpinner, QIcon, QBtn, Toast, QModal, QModalLayout, QToolbar, QToolbarTitle, QCheckbox, QDialogSelect, QInlineDatetime},
		data: function () {
			return {
				title: 'Новое событие',
				nevt: {  // NewEvent
					name: '',
					descr: '',
					latLng: false,
					date: '',
					genre_id: ''
				},
				newplace_remember: false,
				submit_pending: false
			}
		},
		mixins: [mixins],
		methods: {
			nevt_submit: function(){
				this.submit_pending = true;
				request
				.post(apiUrl + 'events')
				.send(this.nevt)
				.end((err, res)=>{
					if (err || !res.body) {
						Toast.create.warning({html:res.body.error || 'Ошибка создания события'})
					}
					else {
						Toast.create.positive({html:'Успех'})
						this.nevt_discard();
					}
					this.submit_pending = false;
				});
			},
			nevt_discard: function(){
				latLngCache = null;
				this.updateLocation();
			},
			updateLocation: function(){
				this.$data.nevt.latLng = latLngCache;
			},
			mapOpen: function() {
				this.$refs.modal_map.open();
				if (typeof map === 'undefined') {
					map = mapLib.newMap();
					var geojson = {
						type: 'FeatureCollection',
						features: [{
							type: 'Feature',
							properties: {},
							geometry: {
								type: 'Point',
								coordinates: mapLib.mapCenter
							}
						}]
					};
					map.on('load', function() {
						map.resize(); // window.dispatchEvent(new Event('resize'));
						map.addSource(mapLib.sourceID, {
							type: 'geojson',
							data: geojson
						});

						map.addLayer({
							id: mapLib.layerID,
							type: 'symbol',
							source: mapLib.sourceID,
							layout: { // https://www.mapbox.com/mapbox-gl-js/style-spec/#layers-symbol
								'icon-image': 'star-15', // star
								'icon-allow-overlap': true,
								'icon-size': 1.3
							}
						});
						var source = map.getSource(mapLib.sourceID);


						var isDragging;
						var isCursorOverPoint;
						var canvasCont = map.getCanvasContainer();

						map.on('mouseenter', mapLib.layerID, function() {
							canvasCont.style.cursor = 'move';
							isCursorOverPoint = true;
							map.dragPan.disable();
						});
						map.on('mouseleave', mapLib.layerID, function() {
							canvasCont.style.cursor = '';
							isCursorOverPoint = false;
							map.dragPan.enable();
						});

						map.on('mousedown', function () {
							if (isCursorOverPoint) {
								isDragging = true;
								canvasCont.style.cursor = 'grab';
								map.on('mousemove', onMove);
								map.once('mouseup', onUp);
							}
							else {
								// Перемещение по клику
								map.once('mouseup', function(evt){
									if (map.moving===false) {
										setLocation(evt.lngLat);
									}
								});
							}
						});

						function setLocation(coords) {
							geojson.features[0].geometry.coordinates = [coords.lng, coords.lat];
							latLngCache = [coords.lat, coords.lng];
							source.setData(geojson);
						}

						function onMove(evt) {
							if (isDragging===true) {
								canvasCont.style.cursor = 'grabbing';
								setLocation(evt.lngLat);	
							}				
						}

						function onUp(e) {
							if (isDragging===true) {		
								canvasCont.style.cursor = '';
								isDragging = false;
								map.off('mousemove', onMove);
							}
						}
					})
				}	
			}
		},
		computed: {
			nevt_invalid: function(){
				var valid = this.$data.nevt.latLng && this.$data.nevt.name && this.$data.nevt.descr;
				return !valid;
			},
			genreList: function(){
				var glist = this.$store.state.genreList || [];
				return glist.map(function(el){
					return {
						label: el.name,
						value: el._id
					}
				});
			},
			nevt_date: function (){
				return this.$options.filters.dateTimeFormat(this.$data.nevt.date)
			}
		},
		mounted: function () {
			if (this.currentUser && (this.currentUser.role | 0) < 1) {
				console.log('User cannot create events')
				this.$router.push('/user-profile')
			}
		}
	}
</script>

<template>
	<div>
		<q-modal ref="modal_datetime" position="top">
			<div class="group">
				<div>
					<q-inline-datetime v-model="nevt.date" type="datetime"></q-inline-datetime>
				</div>
				<div class="text-right">
					<q-btn v-on:click="$refs.modal_datetime.close()">Ок</q-btn>
				</div>
			</div>
		</q-modal>

		<q-modal ref="modal_map" v-on:close="updateLocation" :content-css="{minWidth: '80vw', minHeight: '60vh'}">
			<q-modal-layout>
				<q-toolbar slot="header">
					<q-btn v-on:click="$refs.modal_map.close()" flat>
						<q-icon name="keyboard arrow right"/>
					</q-btn>
					<q-toolbar-title :padding="1">
						Выберите место
					</q-toolbar-title>
				</q-toolbar>
				<div class="layout-view">
					<div class="layout-padding">
						<div class="group">
							<div>
								<div class="hdn">
									<div data-pos="TOP_LEFT" class="map-ctrl-wrap">
										<input id="map-ctrl-search" style="width: 20em" placeholder="Поиск мест" />
									</div>
								</div>
								<div id="map-container"></div>
							</div>
						</div>
					</div>
				</div>
				<q-toolbar slot="footer">
					<q-toolbar-title>
						<div class="text-right">
							<q-btn v-on:click="$refs.modal_map.close()">Ок</q-btn>
						</div>
					</q-toolbar-title>
				</q-toolbar>
			</q-modal-layout>
		</q-modal>
		<form v-on:submit.prevent="nevt_submit">
			<h1 class="h1-md">{{$route.meta.title}}</h1>
			<div class="group">
				<q-btn v-on:click.prevent="mapOpen" color="primary" big>
					<span v-if="nevt.latLng">Изменить</span><span v-else>Указать</span>&nbsp;место
				</q-btn>
				&nbsp; 
				<q-checkbox v-model="newplace_remember" label="Запомнить"></q-checkbox>

				<q-input v-model="nevt.name" required float-label="Название мероприятия"/>
				<q-input v-model="nevt_date" required v-on:focus.prevent="$refs.modal_datetime.open()" float-label="Дата" />
				<q-input v-model="nevt.descr" type="textarea" required float-label="Описание"/>				
				<q-dialog-select v-model="nevt.genre_id" type="radio" required v-bind:options="genreList" ok-label="Выбрать" cancel-label="Отмена" 
				float-label="Жанр мероприятия"></q-dialog-select>
				<br />
				<div class="row">
					<div class="col-8">
						<homebtn></homebtn>
					</div>
					<div class="col-4 text-right">
						<q-btn big color="primary" :disabled="nevt_invalid" :loader="submit_pending" type="submit">
							Готово
						</q-btn>
					</div>
				</div>
			</div>
		</form>

	</div> 
</template>