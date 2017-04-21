<template>
	<div >
		<h1 class="text-center h1-md">
			Войти с паролем
		</h1>
		<form v-on:submit.prevent="LOG_IN" class="group-x">
			<div class="stacked-label">
				<label>
					Email
					<span class="err-label" v-show="$v.auth.email.$dirty">
						<span v-show="!$v.auth.email.required">
							Это обязательное поле
						</span>
						<span v-show="!$v.auth.email.email">
							Некорректный формат адреса электронной почты
							<!-- <pre v-html="$v.auth.email"></pre> -->
						</span>
					</span>
				</label>
				<input v-model="auth.email" type="email" class="full-width" 
				v-on:input="$v.auth.email.$touch()" v-bind:class="{'has-error':$v.auth.email.$error}" />
			</div>
			<div class="stacked-label">
				<label>
					Пароль
					<span class="err-label" v-show="$v.auth.password.$dirty">
						<span v-show="!$v.auth.password.required">
							Это обязательное поле
						</span>
					</span>
				</label>
				<input  v-model="auth.password" type="password" class="full-width" v-on:input="$v.auth.password.$touch()" v-bind:class="{'has-error':$v.auth.password.$error}" />
			</div>
			<br/>
			<div>
				<button class="tertiary clear small" v-link="'register'" type="button">Регистрация</button> 
				<button class="tertiary clear small" type="button">Забыли пароль?</button>
				<q-progress-button indeterminate dark-filler class="primary pull-right" v-bind:percentage="auth.pending" v-bind:disabled="$v.$invalid">
					Войти
				</q-progress-button> <!-- http://quasar-framework.org/components/progress-button.html -->
				
			</div>
		</form>
		<div class="vspace-3"></div>
		<div>
			<h1 class="text-center h1-md">
				Войти через соцсети
			</h1>
			<div class="flex justify-around social-login-btn-wrap">
				<button class="primary circular" v-bind:disabled="auth.pending===1" v-on:click="LOG_IN_EXT('facebook')">
					<i class="mdi mdi-facebook"></i>
				</button> 
				<button class="primary circular" v-bind:disabled="auth.pending===1" v-on:click="LOG_IN_EXT('vkontakte')">
					<i class="mdi mdi-vk"></i>
				</button> 
				<button class="primary circular" v-bind:disabled="auth.pending===1" v-on:click="LOG_IN_EXT('twitter')">
					<i class="mdi mdi-twitter"></i>
				</button>
				<button class="primary circular" v-bind:disabled="1 || auth.pending" v-on:click="LOG_IN_EXT('youtube')">
					<i class="mdi mdi-youtube-play"></i>
				</button>
				<button class="primary circular" v-bind:disabled="1 || auth.pending" v-on:click="LOG_IN_EXT('instagram')">
					<i class="mdi mdi-instagram"></i>
				</button>
			</div>
		</div>
				<!-- <div class="text-center">
					<a href="#/" class="primary clear">
						Перейти к карте
					</a>
					<br/>
					<br/>
					<a href="#/" class="mdi mdi-map-marker-circle"></a>
				</div> -->
			</div>
		</template>

		<script>
			import mixins from './../vue-mixins.js';
			import { required, email } from 'vuelidate/lib/validators'

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
				},
		validations: { // https://monterail.github.io/vuelidate/#getting-started
			auth: {
				email: {
					required, email
				},
				password: {
					required
				}
			}
		}
	}
	export default Comp;
</script>

<style lang="less" scoped>
	.social-login-btn-wrap {
		margin-top: 2em;
		margin-bottom: 2em;
	}
	.mdi {
		font-size: 2.5em;
	}
</style>
