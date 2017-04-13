<script>
	var apiUrl = require('./../api-url.js').def;
	import mapLib from './../map-lib.js'
	import mixins from './../vue-mixins.js'
	import miniToastr from 'mini-toastr'
	import request from 'superagent'
	import Datepicker from 'vuejs-datepicker'

	var _vm;
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
					date: new Date(),
					genre_id: ''
				},
				submit_pending: 0
			}
		},
		mixins: [mixins],
		methods: {
			nevt_submit: function(){
				var pos = this.mark_cur.getPosition()
				this.nevt.latLng = [pos.lat(), pos.lng()]
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
			}
		},
		components: {
			Datepicker
		},
		mounted: function () {
			if (this.currentUser && (this.currentUser.role | 0) < 1) {
				console.log('User cannot create events')
				this.$router.push('/user-profile')
			}

			_vm = this;

			mapLib.create((map, google) => {

				placeMarker(map.getCenter()); // initial draggable marker

				// This code is to prevent situation when mobile user 
				// scrolls page above map and in the end of scroll click event fires
				var touchmove = false;
				document.body.addEventListener('touchmove', function (event) {
					touchmove = true;
				});
				google.maps.event.addListener(map, 'mousedown', function (evt) {
					touchmove = false;
				});
				google.maps.event.addListener(map, 'click', function (evt) {
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
		}
	}
</script>

<template>
	<div class="row">
		<form v-on:submit.prevent="nevt_submit" class="width-2of4 offset-1of4 lt-bg-width-1of1 lt-bg-offset-0 pad-h">

			<div class="group">
				<h1 class="gt-bg">
					Новое мероприятие
				</h1>
				<div>
					<label>Место</label>
					<div v-show="1">
						<div class="hdn">
							<div data-pos="TOP_LEFT" class="map-ctrl-wrap">
								<input id="map-ctrl-search" style="width: 20em" placeholder="Поиск мест" />
							</div>
						</div>
						<div id="map-container"></div>
					</div>
				</div>
				<div class="floating-label">
					<input v-model="nevt.name" required class="full-width" />
					<label>Название</label>
				</div>
				<div class="stacked-label __datepicker-wrap">
					<datepicker 
					v-bind:input-class="'full-width'" 
					v-model="nevt.date"
					v-bind:language="'ru'"
					v-bind:monday-first="true"
					v-bind:format="'dd.MM.yyyy'"
					></datepicker>
					<label>Дата</label>
				</div>
				<div class="floating-label">
					<textarea v-model="nevt.descr" required class="full-width"></textarea>
					<label>Описание</label>
				</div>
				<div>
					<q-dialog-select type="radio" required class="full-width"
					v-model="nevt.genre_id" 
					v-bind:options="genreList" 
					ok-label="Выбрать" cancel-label="Отмена" 
					title="Жанр мероприятия" label="Жанр"></q-dialog-select>
				</div>
				<br />
				<br />
				<br />
				<div class="row">
					<div class="width-1of2">
						<homebtn></homebtn>
					</div>
					<div class="width-1of2 text-right">
						<q-progress-button indeterminate class="primary full-width big" v-bind:disabled="nevt_invalid" v-bind:percentage="submit_pending" type="submit">
							Готово
						</q-progress-button>
					</div>
				</div>
			</div>
		</form>

	</div>
</template>

<style>
</style>
