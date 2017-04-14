<script>
	var apiUrl = require('./../api-url.js').def;
	import mapLib from './../map-lib.js'
	import mixins from './../vue-mixins.js'
	import miniToastr from 'mini-toastr'
	import request from 'superagent'

	var _vm;
	var mapInitd = false;
	export default {
		name: 'evt-new',
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
				submit_pending: 0
			}
		},
		mixins: [mixins],
		methods: {
			nevt_submit: function(){
				this.submit_pending = 1;
				request
				.post(apiUrl + 'events')
				.send(this.nevt)
				.end((err, res)=>{
					if (err || !res.body) {
						miniToastr.error(res.body.error || 'Ошибка создания события')
					}
					else {
						console.log(res)
						miniToastr.success('Успех');
						this.nevt_discard();
					}
					this.submit_pending = 0;
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
				console.log(this.$options.filters.dateTimeFormat)
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
	<div class="row">

		<q-modal ref="modal_datetime" position="top">
			<div class="group">
				<div>
					<q-inline-datetime v-model="nevt.date" type="datetime"></q-inline-datetime>
				</div>
				<div class="text-right">
					<button v-on:click="$refs.modal_datetime.close()" class="primary">
						Ок
					</button>
				</div>
			</div>
		</q-modal>

		<q-modal ref="modal_map" position="right" v-on:close="updateLocation" :content-css="{minWidth: '80vw', minHeight: '80vh'}">
			<q-layout>
				<div slot="header" class="toolbar">
					<button @click="$refs.modal_map.close()">
						<i>keyboard_arrow_right</i>
					</button>
					<q-toolbar-title :padding="1">
						Выберите место
					</q-toolbar-title>
				</div>
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
				<div slot="footer" class="toolbar">
					<q-toolbar-title :padding="1">
						<div class="text-right">
							<button v-on:click="$refs.modal_map.close()" class="primary">
								Ок
							</button>
						</div>
					</q-toolbar-title>
				</div>
			</q-layout>
		</q-modal>
		<form v-on:submit.prevent="nevt_submit" class="width-2of4 offset-1of4 lt-bg-width-1of1 lt-bg-offset-0 pad-h">
			<h3 class="gt-bg">
				Новое мероприятие
			</h3>
			<div class="group">

				<div class="row">
					<div class="width-1of5">
						<button v-on:click.prevent="mapOpen" class="primary">
							<span v-if="nevt.latLng">Изменить</span><span v-else>Указать</span> место
						</button>
					</div>
					<div class="width-2of5 text-right" style="padding-top:.4em;padding-right:1.4em;">
						<label>
							Запомнить место
							<q-checkbox v-model="newplace.active"></q-checkbox>
						</label>
					</div>
					<div class="width-2of5">
						<div v-show="newplace.active">
							<input v-model="newplace.title" placeholder="Введите название" required class="full-width" />
						</div>
					</div>
				</div>
				<div class="floating-label">
					<input v-model="nevt.name" required class="full-width" />
					<label>Название мероприятия</label>
				</div>
				<div class="floating-label">
					<input v-model="nevt_date" required class="full-width" v-on:focus="$refs.modal_datetime.open()" />
					<label>Дата</label>
				</div>
				<div class="floating-label">
					<textarea v-model="nevt.descr" required class="full-width"></textarea>
					<label>Описание</label>
				</div>
				<div>
					<q-dialog-select type="radio" required class="full-width"
					v-model="nevt.genre_id" v-bind:options="genreList" ok-label="Выбрать" cancel-label="Отмена" 
					title="Жанр мероприятия" label="Жанр"></q-dialog-select>
				</div>
				<br />
				<br />
				<br />
				<div class="row">
					<div class="width-2of3">
						<homebtn></homebtn>
					</div>
					<div class="width-1of3 text-right">
						<q-progress-button indeterminate class="primary full-width big" v-bind:disabled="nevt_invalid" v-bind:percentage="submit_pending" type="submit">
							Готово
						</q-progress-button>
					</div>
				</div>
			</div>
		</form>

	</div> 
</template>