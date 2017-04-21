<template>
	<div>
		<form v-on:submit.prevent="register_submit" class="group-x">
			<h1 class="text-center h1-md">Регистрация</h1>
			<label>
				<!-- <q-checkbox class="primary" v-model="role"></q-checkbox> --> 
				<q-toggle class="primary" v-model="role"></q-toggle> &#160; 
				<b>Я музыкант</b>
			</label>
			<div class="stacked-label">
				<input class="full-width" v-model="name" v-che:NAME.reqd />
				<label>
					Имя <span class="err-label" v-html="cheErr('NAME')"></span>
				</label>
			</div>
			<div class="stacked-label">
				<input v-model="email" class="full-width" v-che:EMAIL.reqd.email>
				<label>
					Электронная почта <span class="err-label" v-html="cheErr('EMAIL')"></span>
				</label>
			</div>
			<div class="stacked-label">
				<input v-if="!password_visible" type="password" v-model="password" class="full-width" v-che:PASSWORD.reqd />
				<input v-if="password_visible" type="text" v-model="password" class="full-width" v-che:PASSWORD.reqd />

				<div class="pwdvis">
					<i v-show="!password_visible" v-on:click="password_visible = true" class="mdi mdi-eye"></i>
					<i v-show="password_visible" v-on:click="password_visible = false" class="mdi mdi-eye-off"></i>
				</div>
				<label>
					Пароль 
				</label>
			</div>
			<div class="stacked-label"  v-bind:class="{opa: password_visible}">
				<input v-model="password_confirm" v-bind:disabled="password_visible" class="full-width" type="password" v-che:PASSWORD_CONFIRM.sameas="'password'">
				<label>
					Ещё раз пароль <span class="err-label" v-html="cheErr('PASSWORD_CONFIRM')"></span>
				</label>
			</div>

			<div>
				<homebtn></homebtn>
				<q-progress-button indeterminate class="primary pull-right" v-bind:percentage="submit_pending" type="submit">
					Готово
				</q-progress-button>
			</div>
		</form>
	</div>
</template>

<script>
	import request from 'superagent';
	import mixins from './../vue-mixins.js';
	import miniToastr from 'mini-toastr';
	import { required, email, sameAs } from 'vuelidate/lib/validators'

	var apiUrl = require('./../api-url.js').def;

	var Comp = {
		name: 'user-profile',
		data: function () {
			return {
				role: false, // to be converted to boolean server-side
				name: '',
				email: '',
				email_pending: false,
				email_unique: false,
				email_exists: false,
				password: '',
				password_confirm: '',
				password_visible: false,
				submit_pending: 0,
				$che: {}
			}
		},
		methods: {
			register_submit: function(){
				if (this.cheAll()===true) {
					return
				}				
				this.submit_pending = 1;
				request
				.post(apiUrl + 'auth/reg')
				.send(this.$data)
				.end((err, res)=>{
					if (err || !res.body) {
						miniToastr.error(res.body.error || 'Registration failed');
					}
					else {
						miniToastr.success('Registration succeeded');
						this.$root.currentUser = res.body;
						this.GOTO_PROFILE(); 
					}
					submit_pending = 0;
				});
			}
		},
		mixins: [mixins],
		computed: {
		},
		destroyed: function () {},		
		beforeUpdate: function() {},
		created: function(){}
	}
	export default Comp;
</script>

<style scoped>
	.pwdvis {
		position: absolute;
		right: 4px;
		bottom: .5em;
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
