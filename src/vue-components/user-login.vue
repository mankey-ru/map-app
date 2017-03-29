<template>
	<div class="generic-margin">
		<div class="row">
			<div class="offset-1of3 width-1of3 sm-width-1of1 sm-offset-0">
				<h4 class="text-center">
					Вход
				</h4>
				<form v-on:submit.prevent="LOG_IN" class="group">
					<div class="">
						<div class="stacked-label">
							<label>Email</label>
							<input v-model="auth.email" type="email" class="full-width" />
						</div>
					</div>
					<div class="">
						<div class="stacked-label">
							<label>Пароль</label>
							<input  v-model="auth.password" type="password" class="full-width"/>
						</div>
					</div>
					<div class="row">
						<div class="width-2of3">
							<button class="primary clear" v-link="'register'" type="button">Регистрация</button> 
							<button class="primary clear" type="button">Забыли пароль?</button>
						</div>
						<div class="width-1of3 text-right">
							<q-progress-button indeterminate dark-filler class="primary full-width" v-bind:percentage="auth.pending">
								Войти
							</q-progress-button> <!-- http://quasar-framework.org/components/progress-button.html -->
						</div>
					</div>
				</form>
				<div class="social-login-wrap">
					<h5 class="text-center">Войти через соцсети</h5>
					<div class="flex justify-around">
						<button class="tertiary circular" v-bind:disabled="auth.pending===1" v-on:click="LOG_IN_EXT('facebook')">
							<i class="mdi mdi-facebook"></i>
						</button> 
						<button class="tertiary circular" v-bind:disabled="auth.pending===1" v-on:click="LOG_IN_EXT('vkontakte')">
							<i class="mdi mdi-vk"></i>
						</button> 
						<button class="tertiary circular" v-bind:disabled="auth.pending===1" v-on:click="LOG_IN_EXT('twitter')">
							<i class="mdi mdi-twitter"></i>
						</button>
						<button class="tertiary circular" v-bind:disabled="1 || auth.pending" v-on:click="LOG_IN_EXT('youtube')">
							<i class="mdi mdi-youtube-play"></i>
						</button>
						<button class="tertiary circular" v-bind:disabled="1 || auth.pending" v-on:click="LOG_IN_EXT('instagram')">
							<i class="mdi mdi-instagram"></i>
						</button>
					</div>
				</div>
				<div class="text-center">
					<a href="#/" class="primary clear">
						Перейти к карте
					</a>
					<br/>
					<br/>
					<a href="#/" class="mdi mdi-map-marker-circle"></a>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import mixins from './../vue-mixins.js';
	var Comp = {
		name: 'user-login-page',
		mixins: [mixins],
		data: function () {
			return {
				auth: {
					email: '',
					password: '',
					pending: 0
				}
			}
		}
	}
	export default Comp;
</script>

<style lang="less">
	.social-login-wrap {
		margin-top: 2em;
		margin-bottom: 2em;
	}
	.mdi {
		font-size: 2.5em;
	}
</style>
