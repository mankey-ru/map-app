

<script>
	import request from 'superagent'
	import mixins from './../vue-mixins/_global.js'
	import {QBtn, QIcon, QInput, QSpinner, Toast} from 'quasar'

	var apiUrl = require('./../api-url.js').def;

	export default {
		name: 'PlaceList',
		components: {QBtn, QIcon, QInput, QSpinner},
		data: function () {
			return {
				pageTitle: this.$route.query.all ? 'Места' : 'Мои места',
				placeList: [],
				LOADING: true,
				status: ''
			}
		},
		methods: {
			place_fetch: function() {
				this.LOADING = true;

				request
				.get(apiUrl + 'places?own=1')
				.end((err, res)=>{
					this.LOADING = false;
					if (err) {
						Toast.create.warning({html:err || 'Ошибка запроса'})
					}
					else if (res.body.placeList instanceof Array) {
						if (res.body.placeList.length > 0) {
							for (let place of res.body.placeList) {
								place.CHANGED = false;
								place.LOADING = false; // service props for reactivity
								this.placeList.push(place);
							}
						}
						else {
							this.status = 'У вас нет сохранённых мест'
						}
					}
				})
			},
			place_edit: function(place){
				place.CHANGED = false;
				place.LOADING = true;

				request
					.post(apiUrl + 'places/edit')
					.send(place)
					.end((err, res)=>{
						place.LOADING = false;
						if (err) {
							Toast.create.warning({html:err || 'Ошибка запроса'})
						}
						else {
							Toast.create.positive('Успех')
						}
					})
			},
			place_show: function(place){
				Toast.create.info('Здесь будет показ карты места ' + place.name)
			},
			place_remove: function(place){
				Toast.create.info('Здесь будет удаление места ' + place.name)
			}
		},
		mixins: [mixins],
		mounted: function(){
			this.place_fetch();
		}
	}
</script>

<template>
	<div>
		<h1 class="h1-md">{{pageTitle}}</h1>
		<div v-if="LOADING" class="spinner-wrap">
			<q-spinner :size="50"/>
		</div>
		<div v-else class="group-x">
			<div v-if="status">
				<h5>
					<div class="label label-warning">
						{{status}}
					</div>
				</h5>
			</div>
			<div class="row" v-for="place in placeList">
				<div class="col-8">
					<q-input :disable="place.LOADING" v-model="place.name" required placeholder="Название места" v-on:input="place.CHANGED = true" v-on:keyup.enter="place_edit(place)">
						<q-btn v-show="place.CHANGED || place.LOADING" small flat v-on:click="place_edit(place)">
							<q-icon v-show="place.CHANGED" name="fa-save" />	
							<q-spinner v-show="place.LOADING" :size="20"/>								
						</q-btn>					
						<q-btn small flat v-on:click="place_show(place)">
							<q-icon name="fa-map-marker" />									
						</q-btn>
						<q-btn small flat v-on:click="place_remove(place)">
							<q-icon name="fa-remove" />									
						</q-btn>
					</q-input>
				</div>
			</div>
		</div>
	</div>
</template>

<style>
</style>
