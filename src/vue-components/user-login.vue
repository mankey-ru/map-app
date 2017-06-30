<template>
	<div>
		<div class="vspace-2 gt-lg"></div>
		<h1 class="text-center h1-sm">
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
			<br/>
			<div>
				<q-btn small flat v-on:click="GOTO('register')">Регистрация</q-btn> 
				<q-btn small flat>Забыли пароль?</q-btn>
				<q-btn color="primary" v-bind:loader="auth.pending" v-bind:disabled="$v.$invalid" class="float-right">
					Войти
				</q-btn>
				
			</div>
		</form>
		<div>
			<h1 class="text-center h1-sm">
				Войти через соцсети
			</h1>
			<div class="flex justify-around social-login-btn-wrap">
				<q-btn icon="fa-youtube" v-bind:round="true" v-bind:disable="auth.pending" v-on:click="LOG_IN_EXT('facebook')"/>
				<q-btn icon="fa-vk" v-bind:round="true" v-bind:disable="auth.pending" v-on:click="LOG_IN_EXT('vkontakte')"/>
				<q-btn icon="fa-twitter" v-bind:round="true" v-bind:disable="auth.pending" v-on:click="LOG_IN_EXT('twitter')"/>
				<q-btn icon="fa-youtube" v-bind:round="true" v-bind:disable="true||auth.pending" v-on:click="LOG_IN_EXT('youtube')"/>
				<q-btn icon="fa-instagram" v-bind:round="true" v-bind:disable="true||auth.pending" v-on:click="LOG_IN_EXT('instagram')"/>
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
