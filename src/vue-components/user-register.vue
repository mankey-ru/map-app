<template>
	<div>
		<div class="row items-center hi-content">
			<form v-on:submit.prevent="register_submit"  class="offset-1of3 width-1of3 lt-bg-width-1of1 lt-bg-offset-0 pad-h group-x">
				<h1 class="text-center h1-md">Регистрация</h1>
				<label>
					<!-- <q-checkbox class="primary" v-model="nu.role"></q-checkbox> --> 
					<q-toggle class="primary" v-model="nu.role"></q-toggle> &#160; 
					<b>Я музыкант</b>
				</label>
				<div class="stacked-label">
					<input required class="full-width" v-model="nu.name">
					<label>Имя</label>
				</div>
				<div class="stacked-label">
					<input required v-model="nu.email" class="full-width">
					<label>Электронная почта</label>
				</div>
				<div class="stacked-label">
					<input v-if="!nu.password_visible" type="password" v-model="nu.password" required class="full-width" />
					<input v-if="nu.password_visible" type="text" v-model="nu.password" required class="full-width" />
					<label>
						Пароль 
						<i v-show="!nu.password_visible" v-on:click="nu.password_visible = false" class="glyphicon glyphicon-eye-open"></i>
						<i v-show="nu.password_visible" v-on:click="nu.password_visible = true" class="glyphicon glyphicon-eye-close"></i>
					</label>
				</div>
				<div class="stacked-label"  v-bind:class="{opa: nu.password_visible}">
					<input required v-model="nu.password_confirm" v-bind:disabled="nu.password_visible" class="full-width" type="password">
					<label>Ещё раз пароль</label>
				</div>

				<div>
					<homebtn></homebtn>
					<q-progress-button indeterminate class="primary pull-right" v-bind:disabled="form_invalid" v-bind:percentage="nu.submit_pending" type="submit">
						Готово
					</q-progress-button>
				</div>
			</form>
		</div>
	</div>
</template>

<script>
	import request from 'superagent';
	import mixins from './../vue-mixins.js';
	import miniToastr from 'mini-toastr';
	import { required, email, sameAs } from 'vuelidate/lib/validators'

	var apiUrl = require('./../api-url.js').def;
	var emailRe = new RegExp("^([0-9a-zA-Z_]([-.\\w]*[0-9a-zA-Z_-])*@([0-9a-zA-Z][-\\w]*[0-9a-zA-Z]\\.)+[a-zA-Z]{2,9})$");

	var Comp = {
		name: 'user-profile',
		data: function () {
			return {
				nu: { // NewUser
					role: false, // to be converted to boolean server-side
					name: '',
					email: '',
					email_pending: false,
					email_unique: false,
					email_exists: false,
					password: '',
					password_confirm: '',
					password_visible: false,
					submit_pending: 0
				}
			}
		},
		validations: { // https://monterail.github.io/vuelidate/#getting-started
			nu: {
				name: {
					required
				},
				email: {
					required, email
				},
				password: {
					required
				},
				repeatPassword: {
					sameAsPassword: sameAs('password')
				}
			}
		},
		methods: {
			register_submit: function(){
				var nu = this.nu;
				if (this.password_match===false) {
					return
				}
				nu.submit_pending = 1;
				request
				.post(apiUrl + 'auth/reg')
				.send(nu)
				.end((err, res)=>{
					if (err || !res.body) {
						miniToastr.error(res.body.error || 'Registration failed');
					}
					else {
						miniToastr.success('Registration succeeded');
						this.$root.currentUser = res.body;
						this.GOTO_PROFILE(); 
					}
					nu.submit_pending = 0;
				});
			}
		},
		mixins: [mixins],
		computed: {
			password_match: function(){
				var nu = this.nu;
				if (nu.password_visible || (!nu.password && !nu.password_confirm)) {
					// if pwd is visible or at least one of passwords is empty
					// then do nothing
					return null
				}
				return nu.password===nu.password_confirm
			},
			form_invalid: function(){
				var match_invalid = this.password_match===false; // if value is null then form is OK (see password_match)
				return match_invalid || !this.nu.password || this.email_invalid
			},
			email_invalid: function(){
				if (!this.nu.email) {
					return null
				}
				return !emailRe.test(this.nu.email);
			}
		},
		destroyed: function () {},		
		beforeUpdate: function() {},
		created: function(){}
	}
	export default Comp;
</script>

<style scoped>
	.glyphicon {
		font-size: 2em;
		vertical-align: middle;
		cursor: pointer;
	}
	.color-good {
		color: #5cb85c; /* taken from btn-success */
	}
	.color-bad {
		color: #c9302c; /* taken from btn-danger */
	}
	.color-good, .color-bad {
		font-weight: bold;
	}
</style>
