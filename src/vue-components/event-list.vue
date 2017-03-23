

<script>
	import request from 'superagent'
	import mixins from './../vue-mixins.js'
	import miniToastr from 'mini-toastr'

	var apiUrl = require('./../api-url.js').def;

	export default {
		name: 'evt-list',
		data: function () {
			return {
				pageTitle: this.$route.query.all ? 'Мероприятия' : 'Мои мероприятия',
				evtList: [],
				evtList_loading: true,
				status: ''
			}
		},
		methods: {
			evt_fetch: function() {
				this.evtList_loading = true;
				var url = Math.random()>.1 ? 'backend-emu/forum-list.json' : '';

				request
				.get(apiUrl + 'events?own=1')
				.end((err, res)=>{
					this.evtList_loading = false;
					if (err) {
						miniToastr.error(err || 'Ошибка запроса')
					}
					else if (res.body.evtList instanceof Array) {
						if (res.body.evtList.length > 0) {
							for (let evt of res.body.evtList) {
								this.evtList.push(evt);
							}
						}
						else {
							this.status = 'Не найдено ни одного вашего мероприятия'
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
		<h2>{{pageTitle}}</h2>
		<div v-show="evtList_loading" class="text-center">
			<i class="spin spin-lg"></i>
		</div>
		<div v-show="!evtList_loading">
			<div v-if="status">
				<h2 >
					<div class="label label-warning">
						{{status}}
					</div>
				</h2>
			</div>
			<table  class="table table-striped">
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
