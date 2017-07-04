<template>
	<div>
		<form v-on:submit.prevent="register_submit" class="group-x">
			<h1 class="h1-md">Регистрация</h1>

			<q-toggle class="primary" v-model="role" label="Я музыкант"></q-toggle>
			<q-input float-label="Имя" v-model="name" required :clearable="true"/>
			<q-input float-label="Электронная почта" v-model="email" required type="email" :clearable="true" />
			<q-input float-label="Пароль" v-model="password" required type="password" :clearable="true" />
			<q-input float-label="Ещё раз пароль" v-model="password_confirm" required type="password" :clearable="true" />
			
			<div class="vspace-2"></div>
			<q-btn color="primary" class="pull-right" :loader="submit_pending" type="submit">Готово</q-btn>
		</form>
	</div>
</template>

<script>
	import request from 'superagent';
	import mixins from './../vue-mixins.js';
	import {Toast, QToggle, QBtn, QInput} from 'quasar';
	import { required, email, sameAs } from 'vuelidate/lib/validators'

	var apiUrl = require('./../api-url.js').def;

	var Comp = {
		name: 'user-profile',
		components: {QToggle, QBtn, QInput},
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
				submit_pending: false
			}
		},
		methods: {
			register_submit: function(){
				if (false) {
					return
				}				
				this.submit_pending = true;
				request
					.post(apiUrl + 'auth/reg')
					.send(this.$data)
					.end((err, res)=>{
						this.submit_pending = false;
						if (err || !res.body) {
							Toast.create.warning({html:res.body.error || 'Registration failed'})
						}
						else {
							Toast.create.positive({html:'Успех'})
							this.$root.currentUser = res.body;
							this.GOTO('user-profile-current'); 
						}						
					});
			}
		},
		mixins: [mixins],
		computed: {},
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
