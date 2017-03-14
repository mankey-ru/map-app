<script>
	var apiUrl = require('./../api-url.js')
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
					date: new Date()
				},
				submit_pending: false
			}
		},
		mixins: [mixins],
		methods: {
			nevt_submit: function(){
				var pos = this.mark_cur.getPosition()
				this.nevt.latLng = [pos.lat(), pos.lng()]
				this.submit_pending = true;
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
						this.submit_pending = false;
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
				return this.$root.$data.genreList;
			}
		},
		components: {
			Datepicker
		},
		mounted: function(){
			if (!this.currentUser) {
				console.log('User not authed')
				this.$router.push('/');
				return
			}
			else 
				if ((this.currentUser.role|0)<1) {
					console.log('User cannot create events')
					this.$router.push('/user-profile')
				}

				_vm = this;

				mapLib.create((map, google)=>{

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
					if (touchmove===false) {
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
			<form v-on:submit.prevent="nevt_submit" class="evt-form">
				<h2 class="col-xs-24 form-group">{{title}}</h2>
				<hr />
				<div class="col-xs-24 col-md-12">
					<div class="form-group">
						<label>Место</label>
						<div v-show="1">
							<div class="hdn">
								<div data-pos="TOP_LEFT" class="map-ctrl-wrap">
									<input id="map-ctrl-search" class="form-control" style="width: 20em" placeholder="Поиск мест" />
								</div>
							</div>
							<div id="map-container"></div>
						</div>
					</div>
				</div>
				<div class="col-xs-24 col-md-12">
					<div class="form-group">
						<label>Название</label>
						<input v-model="nevt.name" class="form-control" />
					</div>
					<div class="form-group __datepicker-wrap">
						<label>Дата</label>
						<div>
							<datepicker 
							:input-class="'form-control'" 
							v-model="nevt.date"
							:language="'ru'"
							:monday-first="true"
							:format="'dd.MM.yyyy'"
							></datepicker>
						</div>
					</div>
					<div class="form-group">
						<label>Описание</label>
						<textarea v-model="nevt.descr" class="form-control"></textarea>
					</div>
					<div class="form-group">
						<label>Жанр</label>
						<select class="form-control">
							<option v-for="gen in genreList">{{gen.name}}</option>
						</select>
					</div>
					<hr />
					<div class="row">
						<div class="col-xs-12">
							<a v-on:click="$router.push({name:'map-google'})" class="btn btn-default">
								<i class="glyphicon glyphicon-chevron-left"></i> 
								Вернуться
							</a>
						</div>
						<div class="col-xs-12 text-right">
							<button type="submit" v-bind:disabled="nevt_invalid" class="btn btn-success btn-lg">
								<i v-show="!submit_pending" class="glyphicon glyphicon-ok"></i> 
								<i v-show="submit_pending" class="spin"></i> 
								Создать
							</button>
						</div>
					</div>
				</div>
			</form>

		</div>
	</template>

	<style>
	</style>
