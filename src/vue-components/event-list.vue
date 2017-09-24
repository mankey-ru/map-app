

<script>
	import request from 'superagent'
	import mixins from './../vue-mixins/_global.js'
	import {QSpinner, Toast} from 'quasar'

	var apiUrl = require('./../api-url.js').def;

	export default {
		name: 'evt-list',
		components: {QSpinner},
		data: function () {
			return {
				pageTitle: this.$route.query.all ? 'События' : 'Мои события',
				evtList: [],
				LOADING: true,
				status: ''
			}
		},
		methods: {
			evt_fetch: function() {
				this.LOADING = true;
				
				request
					.get(apiUrl + 'events?own=1')
					.end((err, res)=>{
						this.LOADING = false;
						if (err) {
							Toast.create.warning({html:err || 'Ошибка запроса'})
						}
						else if (res.body.evtList instanceof Array) {
							if (res.body.evtList.length > 0) {
								for (let evt of res.body.evtList) {
									this.evtList.push(evt);
								}
							}
							else {
								this.status = 'У вас нет мероприятий'
							}
						}
					})
			}
		},
		mixins: [mixins],
		mounted: function(){
			this.evt_fetch();
		}
	}

	function getForum(arg) {
		return arg;
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
				<h4>
					<div class="label label-warning">
						{{status}}
					</div>
				</h4>
			</div>
			<table class="q-table horizontal-delimiter full-width">
				<tbody>
					<tr v-for="evt in evtList">
						<td>
							<a v-bind:href="'#/event/card/'+evt._id">{{evt.name}}</a>
						</td>
						<td>
							{{evt.descr}}
						</td>
						<td>
							{{evt.date | dateTimeFormat}}
						</td>
					</tr>
				</tbody>
			</table>
		</div>
	</div>
</template>

<style>
</style>
