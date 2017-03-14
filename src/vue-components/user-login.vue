<template>
	<div>
		<div class="row">
			<div class="hidden-xs"><br /><br /><br /><br /><br /><br /></div>
			<div class="col-md-10 col-md-offset-7 col-xs-24">
				<h1>Вход</h1>
				<form v-on:submit.prevent="LOG_IN">
					<div class="form-group">
						<label>Email</label>
						<input name="email" type="email" class="form-control" v-model="auth.email"/>
					</div>
					<div class="form-group">
						<label>Пароль</label>
						<input name="password" class="form-control" v-model="auth.password" type="password"/>
					</div>
					<div class="row">
						<div class="col-xs-12">
							<a class="btn btn-link">Напомнить</a>
						</div>
						<div class="col-xs-12 text-right">
							<button class="btn btn-primary" v-bind:disabled="auth.pending" type="submit">
								<i v-show="auth.pending" class="spin"></i> 
								<i v-show="!auth.pending" class="glyphicon glyphicon-log-in"></i>
								&#160;Войти
							</button>
						</div>
					</div>
				</form>
			</div>
		</div>
	</div>
</template>

<script>
	import request from 'superagent';
	import mixins from './../vue-mixins.js';
	import miniToastr from 'mini-toastr';

	var apiUrl = require('./../api-url.js');
	var emailRe = new RegExp("^([0-9a-zA-Z_]([-.\\w]*[0-9a-zA-Z_-])*@([0-9a-zA-Z][-\\w]*[0-9a-zA-Z]\\.)+[a-zA-Z]{2,9})$");

	var Comp = {
		name: 'user-login',
		data: function () {
			return {
				auth: {
					email: '',
					password: '',
					pending: false
				}
			}
		},
		mixins: [mixins],
		computed: {},
		methods: {},
		destroyed: function () {},		
		beforeUpdate: function() {},
		created: function(){}
	}
	export default Comp;
</script>

<style scoped>
</style>
