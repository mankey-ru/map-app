<script>
	const apiUrl = require('./../api-url.js')
	import mixins from './../vue-mixins.js'
	import request from 'superagent'

	export default {
		name: 'AppRoot',
		data: function () {
			return {
				auth: {
					email: '',
					password: '',
					pending: false
				}
			}
		},
		mixins: [mixins]
	}
</script>


<template>
	<div>
		<div class="row header" v-show="$route.name !== 'mainpage'">
			<div class="col-sm-4 col-xs-24 hidden-xs">
				<span v-on:click="$router.push('/')" style="font-size: 4em;cursor: pointer;">
					<i class="glyphicon glyphicon-picture"></i>
				</span>
			</div>
			<div class="col-sm-20 col-xs-24">
				<div class="visible-xs pull-left">
					<span v-on:click="$router.push('/')" style="font-size: 2em;cursor: pointer;">
						<i class="glyphicon glyphicon-picture"></i>
					</span>
				</div>
				<div v-if="currentUser" class="text-right">
					<a v-if="currentUser.role" v-on:click="gotoEventNew" class="btn btn-primary hidden-xs">
						<i class="glyphicon glyphicon-plus"></i> Добавить событие
					</a>
					<button v-on:click="GOTO_PROFILE" class="btn btn-default">
						<i class="glyphicon glyphicon-user"></i> {{currentUser.name}}
					</button>
					<button v-on:click="LOG_OUT" class="btn btn-default">
						<i v-show="auth.pending" class="spin"></i> 
						<i v-show="!auth.pending" class="glyphicon glyphicon-log-out"></i> 
					</button>
				</div>
				<div v-if="!currentUser">
					<form v-on:submit.prevent="LOG_IN">
						<div class="row">
							<div class="col-xs-24 text-right">
								<button class="btn btn-default" v-on:click.prevent="GOTO_LOGIN">
									Вход
								</button>
								<button class="btn btn-default" v-on:click.prevent="GOTO_REGISTER" type="button">
									Регистрация
								</button>
							</div>
						</div>
					</form>
				</div>
			</div>					
		</div>
		<router-view></router-view>
	</div>
</template>



<style scoped>
	.header {
		margin-bottom: 2em;
	}
</style>

