<script>
	var apiUrl = require('./../api-url.js').def;
	import mixins from './../vue-mixins.js'
	import _ from 'lodash'
	import request from 'superagent'
	import miniToastr from 'mini-toastr'

	export default {
		name: 'event-card',
		data: function () {
			return {
				evt: false
			}
		},
		methods: {
			evt_fetch: function() {
				var event_id = this.$router.currentRoute.params.event_id;
				request
				.get(apiUrl + 'events/' + event_id)
				.end((err, res)=> {
					if (err) {

					}
					else {
						this.evt = res.body;
					}
				})
			}
		},
		mixins: [mixins],
		mounted: function(){
			this.evt_fetch()
		}
	}

	function getForum(arg) {
		return arg;
	}
</script>

<template>
	<div>
		<div v-if="evt">
			<h2 class="gt-bg">{{evt.name}}</h2>
			<p>
				<i class="mdi mdi-calendar"></i>&#160;
				{{evt.date | dateFormatPretty}}
			</p>
			<p>
				<a v-bind:href="'#/user-profile/'+evt.author._id">
					<i class="mdi mdi-account-box"></i>&#160;
					{{evt.author.name}}
				</a>
			</p>
			<pre>{{evt.descr}}</pre>
			<pre>Координаты: {{evt.latLng}}</pre>
		</div>
		<div v-else class="spinner-wrap">
			<spinner :size="50"></spinner>
		</div>
	</div>
</template>

<style>
</style>
