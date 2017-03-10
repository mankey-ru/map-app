<script>
	import mapLib from './../map-lib.js'; 
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
					LOG: ''
				}
			}
		},
		methods: {
			nevt_submit: function(){
				notie.alert({
					type: 'success',
					text: 'Успех',
					time: 3
				});
				// do things
				this.nevt_discard();
			},
			nevt_discard: function(){
				this.mark_cur.setMap(null);
				this.mark_cur = false;
			},
			log: function(txt){
				if (txt) {
					this.LOG += txt + '\n';
				}
			}
		},
		computed: {
			nevt_invalid: function(){
				var valid = this.mark_cur && this.nevt.name && this.nevt.descr;
				return !valid;
			},
			genreList: function(){
				return this.$root.$data.genreList;
			},
			currentUser: function(){
				return this.$root.currentUser;
			}
		},
		mounted: function(){
			if (!this.currentUser) {this.$router.push('/'); return}
			else 
			if ((this.currentUser.role|0)<1) {this.$router.push('/user-profile')}

			_vm = this;

			mapLib.create((map, google)=>{

				placeMarker(map.getCenter()); // initial draggable marker

				google.maps.event.addListener(map, 'click', function(evt) {
					placeMarker(evt.latLng);
				});
				google.maps.event.addListener(map, 'tilesloaded', function(evt) {
					_vm.log('tilesloaded')
				});
				var isTouch = 'ontouchstart' in document.documentElement;
				google.maps.event.addListener(map, 'click', function(event) {
				   _vm.log('click_touch='+isTouch)
				});
				google.maps.event.addListener(map, 'mousedown', function(evt) {
					_vm.log('mousedown')
				});
				google.maps.event.addListener(map, 'mouseup', function(evt) {
					_vm.log('mouseup')
				});
				google.maps.event.addListener(map, 'touchstart', function(evt) {
					_vm.log('touchstart')
				});
				google.maps.event.addListener(map, 'touchmove', function(evt) {
					_vm.log('touchmove')
				});

				function placeMarker(location) {
					var options = {
						position: location,
						map: map,
						draggable: true,
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
			<div class="col-xs-24 col-md-16 col-md-offset-4">
				<h2 class="form-group">{{title}}</h2>
				<hr />
				<div class="form-group">
					<label>Название</label>
					<input v-model="nevt.name" class="form-control" />
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
				<div class="form-group">
					<label>Место</label>
					<pre v-html="LOG" v-if="LOG"></pre>
					<div v-show="1">
						<div class="hdn">
							<div data-pos="TOP_LEFT" class="map-ctrl-wrap">
								<input id="map-ctrl-search" class="form-control" style="width: 20em" placeholder="Поиск мест" />
							</div>
						</div>
						<div id="map-container"></div>
					</div>
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
							<i class="glyphicon glyphicon-ok"></i> 
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
