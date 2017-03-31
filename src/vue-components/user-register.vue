<template>
	<div>
		<div class="row">
			<form v-on:submit.prevent="register_submit"  class="width-2of4 offset-1of4 lt-bg-width-1of1 lt-bg-offset-0 pad-h mar-v-group">
				<div>
					<h2>Регистрация</h2>
				</div>
				<div class="row">
					<div class="width-3of4">
						<label>
							<!-- <q-checkbox class="orange" v-model="nu.role"></q-checkbox> -->
							<q-toggle class="orange" v-model="nu.role"></q-toggle>
							Я музыкант
						</label>

					</div>
				</div>
				<div class="row">
					<div class="width-3of4">
						<div class="floating-label">
							<input required class="full-width" v-model="nu.name">
							<label>Логин</label>
						</div>
					</div>
					<div class="width-1of4"></div>
				</div>
				<div class="row">
					<div class="width-3of4">
						<div class="floating-label">
							<input required v-model="nu.email" class="full-width">
							<label>Электронная почта</label>
						</div>
					</div>
					<div class="width-1of4">
						<i v-show="nu.email_pending" class="spin spin-sm"></i>
						<div v-show="nu.email_unique" class="color-good">
							<i class="glyphicon glyphicon-ok-circle"></i>
							Not available
						</div>
						<div v-show="nu.email_exists" class="color-bad">
							<i class="glyphicon glyphicon-ban-circle"></i>
							Available
						</div>
						<div v-show="email_invalid===true" class="color-bad">
							<i class="glyphicon glyphicon-ban-circle"></i>
							Invalid format
						</div>
					</div>
				</div>
				<div class="row">
					<div class="width-3of4">
						<div class="floating-label">
							<input v-if="!nu.password_visible" type="password" v-model="nu.password"required class="full-width" />
							<input v-if="nu.password_visible" type="text" v-model="nu.password" required class="full-width" />
							<label>Пароль</label>
						</div>
					</div>
					<div class="width-1of4">
						<i v-show="!nu.password_visible" v-on:click="nu.password_visible = !nu.password_visible" class="glyphicon glyphicon-eye-open"></i>
						<i v-show="nu.password_visible" v-on:click="nu.password_visible = !nu.password_visible" class="glyphicon glyphicon-eye-close"></i>
					</div>
				</div>
				<div class="row" v-bind:class="{opa: nu.password_visible}">
					<div class="width-3of4">
						<div class="floating-label">
							<input required v-model="nu.password_confirm" v-bind:disabled="nu.password_visible" class="full-width" type="password">
							<label>Ещё раз пароль</label>
						</div>
					</div>
					<div class="width-1of4" v-show="!nu.password_visible">
						<div v-show="password_match===true" class="color-good">
							<i class="glyphicon glyphicon-ok-circle"></i>
							Match
						</div>
						<div v-show="password_match===false" class="color-bad">
							<i class="glyphicon glyphicon-ban-circle"></i>
							Not match
						</div>
					</div>
				</div>
				<div class="row">
					<div class="width-3of4">
						<div class="row">
							<div class="width-1of2">
								<homebtn></homebtn>
							</div>
							<div class="width-1of2 text-right">
								<q-progress-button indeterminate class="orange full-width" v-bind:disabled="form_invalid" v-bind:percentage="nu.submit_pending" type="submit">
									Готово
								</q-progress-button>
							</div>
						</div>
					</div>
				</div>
			</form>
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
