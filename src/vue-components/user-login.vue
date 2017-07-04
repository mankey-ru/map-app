<template>
	<div>
		<div class="vspace-2 gt-lg"></div>
		<h1 class="text-center h1-xs">
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
				<q-input type="email" value=""
				v-model="auth.email" 
				v-on:input="$v.auth.email.$touch()" 
				v-bind:error="$v.auth.email.$error"
				v-bind:clearable="true"
				v-bind:autofocus="true"
				/>
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
				<q-input type="password" value="" 	
				v-model="auth.password"
				v-on:input="$v.auth.password.$touch()"
				v-bind:error="$v.auth.password.$error"
				v-bind:clearable="true" 
				v-bind:autofocus="true"
				/>
			</div>
			<div class="row">	
				<div class="col-8">					
					<q-btn small flat no-caps v-on:click="GOTO('register')">Регистрация</q-btn> 
					<q-btn small flat no-caps v-on:click="GOTO('pwdrestore')">Забыли пароль?</q-btn>
				</div>
				<div class="col-4 text-right">
					<q-btn color="primary" no-caps v-bind:loader="auth.pending" v-bind:disabled="$v.$invalid">Войти</q-btn>				
				</div>				
			</div>			
		</form>

		<div>
			<h1 class="text-center h1-xs">
				Войти через соцсети
			</h1>
			<div class="flex justify-around social-login-btn-wrap">
				<q-btn icon="fa-facebook" :small="$q.platform.is.mobile" round :disable="auth.pending" v-on:click="LOG_IN_EXT('facebook')"/>
				<q-btn icon="fa-vk" :small="$q.platform.is.mobile" round :disable="auth.pending" v-on:click="LOG_IN_EXT('vkontakte')"/>
				<q-btn icon="fa-twitter" :small="$q.platform.is.mobile" round :disable="auth.pending" v-on:click="LOG_IN_EXT('twitter')"/>
				<q-btn icon="fa-youtube" :small="$q.platform.is.mobile" round :disable="true" v-on:click="LOG_IN_EXT('youtube')"/>
				<q-btn icon="fa-instagram" :small="$q.platform.is.mobile" round :disable="true" v-on:click="LOG_IN_EXT('instagram')"/>
			</div>
		</div>
		<!-- <div class="text-center"><a href="#/" class="primary clear">Перейти к карте</a><br/><br/><a href="#/" class="mdi mdi-map-marker-circle"></a></div> -->
	</div>
</template>



<script>
	import mixins from './../vue-mixins.js'
	import { required, email } from 'vuelidate/lib/validators'
	import { QBtn,QInput  } from 'quasar'

	var Comp = {
		name: 'user-login-page',
		mixins: [mixins],
		components: {QBtn,QInput },
		data: function () {
			return {
				auth: {
					email: '',
					password: '',
					pending: false
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
