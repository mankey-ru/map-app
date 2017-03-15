<script>
	var apiUrl = require('./../api-url.js')
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
		<div v-show="!evt" class="text-center">
			<i class="spin spin-lg"></i>
		</div>
		<div v-show="evt">
			<h2>{{evt.name}}</h2>
			<h3>
				<i class="glyphicon glyphicon-calendar"></i>&#160;
				{{evt.date | dateFormatPretty}}
			</h3>
			<h3>
				<i class="glyphicon glyphicon-user"></i>&#160;
				{{evt.author.name}}
			</h3>
			<pre>{{evt.descr}}</pre>

		</div>
	</div>
</template>

<style>
</style>
