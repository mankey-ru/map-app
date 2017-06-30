<script>
	var apiUrl = require('./../api-url.js').def;
	import mapLib from './../map-lib.js'
	import mixins from './../vue-mixins.js'
	import request from 'superagent'	
	import {QInput, QSpinner, QIcon, QBtn, Toast, QModal, QModalLayout, QToolbar, QToolbarTitle, QCheckbox, QDialogSelect, QInlineDatetime} from 'quasar'

	var _vm;
	var mapInitd = false;
	export default {
		name: 'evt-new',		
		components: {QInput, QSpinner, QIcon, QBtn, Toast, QModal, QModalLayout, QToolbar, QToolbarTitle, QCheckbox, QDialogSelect, QInlineDatetime},
		data: function () {
			return {
				title: 'Новое событие',
				mark_cur: false,
				nevt: {  // NewEvent
					name: '',
					descr: '',
					latLng: false,
					date: '',
					genre_id: ''
				},
				newplace: {
					active: false,
					title: ''
				},
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
				this.mark_cur.setMap(null);
				this.mark_cur = false;
			},
			updateLocation: function(){
				var pos = this.mark_cur.getPosition()
				this.nevt.latLng = [pos.lat(), pos.lng()]
			},
			mapOpen: function(){
				this.$refs.modal_map.open()
				if (mapInitd === false) {

					_vm = this;

					mapLib.create((map, google) => {

						placeMarker(map.getCenter()); // initial draggable marker

						// This code is to prevent situation when mobile user 
						// scrolls page above map and in the end of scroll click event fires
						var touchmove = false;
						document.body.addEventListener('touchmove', function(event) {
							touchmove = true;
						});
						google.maps.event.addListener(map, 'mousedown', function(evt) {
							touchmove = false;
						});
						google.maps.event.addListener(map, 'click', function(evt) {
							if (touchmove === false) {
								placeMarker(evt.latLng);
							}
						});

						function placeMarker(location) {
							var options = {
								position: location,
								map: map,
								draggable: true,
								icon: 'pin.svg',
								animation: google.maps.Animation.DROP
							}
							if (_vm.mark_cur) {
								_vm.nevt_discard();
							}
							_vm.mark_cur = new google.maps.Marker(options);
						}
					})
					mapInitd = true;
				}
			}
		},
		computed: {
			nevt_invalid: function(){
				var valid = this.mark_cur && this.nevt.name && this.nevt.descr;
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
					<q-btn v-on:click="$refs.modal_datetime.close()" color="primary">
						Ок
					</q-btn>
				</div>
			</div>
		</q-modal>

		<q-modal ref="modal_map" position="right" v-on:close="updateLocation" :content-css="{minWidth: '80vw', minHeight: '60vh'}">
			<q-modal-layout>
				<q-toolbar slot="header">
					<q-btn @click="$refs.modal_map.close()" flat>
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
					<q-toolbar-title :padding="1">
						<div class="text-right">
							<q-btn v-on:click="$refs.modal_map.close()" color="primary">
								Ок
							</q-btn>
						</div>
					</q-toolbar-title>
				</q-toolbar>
			</q-modal-layout>
		</q-modal>
		<form v-on:submit.prevent="nevt_submit">
			<h1 class="h1-md">
				Новое мероприятие
			</h1>
			<div class="group">

				<div class="row">
					<div class="col-4">
						<q-btn v-on:click.prevent="mapOpen" color="primary" small>
							<span v-if="nevt.latLng">Изменить</span><span v-else>Указать</span>&nbsp;место
						</q-btn>
					</div>
					<div class="col-3 text-right">
						<q-checkbox v-model="newplace.active" label="Запомнить"></q-checkbox>
					</div>
					<div class="col-5">
						<q-input v-show="newplace.active" v-model="newplace.title" vlaue="" placeholder="Введите название" required class="full-width" />
					</div>
				</div>
				<q-input value="" v-model="nevt.name" required class="full-width" float-label="Название мероприятия"/>
				<q-input value="" v-model="nevt_date" required class="full-width" v-on:focus.prevent="$refs.modal_datetime.open()" float-label="Дата" />
				<q-input type="textarea" value="" v-model="nevt.descr" required class="full-width" float-label="Описание"/>				
				<q-dialog-select type="radio" required class="full-width"
				v-model="nevt.genre_id" v-bind:options="genreList" ok-label="Выбрать" cancel-label="Отмена" 
				float-label="Жанр мероприятия"></q-dialog-select>
				<br />
				<div class="row">
					<div class="col-8">
						<homebtn></homebtn>
					</div>
					<div class="col-4 text-right">
						<q-btn big color="primary" class="full-width" :disabled="nevt_invalid" :loader="submit_pending" type="submit">
							Готово
						</q-btn>
					</div>
				</div>
			</div>
		</form>

	</div> 
</template>