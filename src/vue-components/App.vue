<script>
	const apiUrl = require('./../api-url.js')
	import mixins from './../vue-mixins.js'
	import routes from './../vue-routes.js'
	import request from 'superagent'

	export default {
		name: 'AppRoot',
		data: function () {
			return {
				routes: routes,
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
	<div><!-- 
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
					<button v-on:click="gotoProfile" class="btn btn-default">
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
							<div class="col-md-6 col-xs-24">
								<label>Email</label>
								<input name="email" type="email" class="form-control" v-model="auth.email"/>
							</div>
							<div class="col-md-6 col-xs-24">
								<label>Password</label>
								<input name="password" class="form-control" v-model="auth.password" type="password"/>
							</div>
							<div class="col-md-4 col-xs-12">
								<div><label>&#160;</label></div>
								<button class="btn btn-default" v-bind:disabled="auth.pending" type="submit">
									<i v-show="auth.pending" class="spin"></i> 
									<i v-show="!auth.pending" class="glyphicon glyphicon-log-in"></i> 
									Вход
								</button>
							</div>
							<div class="col-md-4 col-md-offset-4  col-xs-12 text-right">
								<div><label>&#160;</label></div>
								<button class="btn btn-default" v-on:click.prevent="gotoRegister" v-bind:disabled="auth.pending" type="button">
									Регистрация
								</button>
							</div>
						</div>
					</form>
				</div>
			</div>					
		</div> -->
		<router-view></router-view>
	</div>
</template>



<style scoped>
	.header {
		margin-bottom: 2em;
	}
</style>

