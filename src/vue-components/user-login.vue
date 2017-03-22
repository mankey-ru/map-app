<template>
	<div>
		<div class="row">
			<div class="col-md-8 col-md-offset-8 col-xs-24">
				<h2 class="text-center">
					Вход
				</h2>
				<form v-on:submit.prevent="LOG_IN">
					<div class="form-group">
						<label>Email</label>
						<input name="email" type="email" class="form-control" v-model="auth.email"/>
					</div>
					<div class="form-group">
						<label>Пароль</label>
						<input name="password" class="form-control" v-model="auth.password" type="password"/>
					</div>
					<div class="row form-group">
						<div class="col-xs-12">
							<a class="btn btn-link">Регистрация</a>
						</div>
						<div class="col-xs-12 text-right">
							<a class="btn btn-link">Забыли пароль?</a>
						</div>
					</div>
					<div class="row">
						<div class="col-xs-14 col-xs-offset-5">
							<button class="btn btn-primary btn-block" v-bind:disabled="auth.pending" type="submit">
								&#160;Войти
							</button>
						</div>
						<div class="col-xs-5">
							<i v-show="auth.pending" class="spin spin-sm"></i> 
						</div>
					</div>
					<div class="row social-login-wrap">
						<div class="col-xs-24">
							<h3>Войти через соцсети</h3>
							<a class="btn btn-default btn-round" v-bind:disabled="auth.pending" v-on:click="LOG_IN_EXT('facebook')">
								<i class="socicon socicon-facebook"></i>
							</a> 
							<a class="btn btn-default btn-round" v-bind:disabled="auth.pending" v-on:click="LOG_IN_EXT('vkontakte')">
								<i class="socicon socicon-vkontakte"></i>
							</a> 
							<a class="btn btn-default btn-round" v-bind:disabled="auth.pending" v-on:click="LOG_IN_EXT('twitter')">
								<i class="socicon socicon-twitter"></i>
							</a>
							<!-- <a class="btn btn-default btn-round" v-bind:disabled="1 || auth.pending" v-on:click="LOG_IN_EXT('youtube')">
								<i class="socicon socicon-youtube"></i>
							</a>
							<a class="btn btn-default btn-round" v-bind:disabled="1 || auth.pending" v-on:click="LOG_IN_EXT('instagram')">
								<i class="socicon socicon-instagram"></i>
							</a> -->
						</div>
					</div>
					<div class="row text-center">
						<div class="col-xs-24">
							<a href="#/" class="btn btn-link">
								Перейти к карте
							</a>
							<br/>
							<a href="#/" class="btn btn-primary btn-round">
								<i class="glyphicon glyphicon-map-marker"></i>
							</a>
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

	var apiUrl = require('./../api-url.js').def;
	var emailRe = new RegExp("^([0-9a-zA-Z_]([-.\\w]*[0-9a-zA-Z_-])*@([0-9a-zA-Z][-\\w]*[0-9a-zA-Z]\\.)+[a-zA-Z]{2,9})$");

	var Comp = {
		name: 'user-login-page',
		mixins: [mixins],
		data: function () {
			return {
				auth: {
					email: '',
					password: '',
					pending: false
				}
			}
		}
	}
	export default Comp;
</script>

<style lang="less">
	.social-login-wrap {
		border-top:1px solid;
		border-bottom: 1px solid;
		text-align: center;
		margin-top:2em;
		padding-bottom: 2em;
		margin-bottom: 1em;
		.btn {
			margin-top: .7em;
			margin-right: .5em;
		}
		.socicon {
			//color: #fff;
		}
	}
</style>
