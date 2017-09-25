<template>
	<div>
		<form v-on:submit.prevent="register_submit" class="group-x">
			<h1 class="h1-md gt-lg">Регистрация</h1>

			<q-toggle class="primary" v-model="role" label="Я музыкант"></q-toggle>
			<q-input float-label="Имя" v-model="name" required :clearable="true"/>
			<q-input float-label="Электронная почта" v-model="email" required type="email" :clearable="true" />
			<q-input float-label="Пароль" v-model="password" required type="password" :clearable="true" />
			<q-input float-label="Ещё раз пароль" v-model="password_confirm" required type="password" :clearable="true" />

			<div class="row">
				<div class="col-12">
					<q-btn color="secondary" v-on:click.prevent="uploadClick">
						Загрузить фото
					</q-btn>
					<span v-if="picPath">
						Выбран файл <b>{{picPath}}</b>
						<q-icon name="delete forever" size="30px" color="red" v-on:click="uploadReset" class="cursor-pointer" />
					</span>			
					<div class="hidden">
						<input type="file" ref="fileUploadInput" name="fileUploadInput_name" v-on:change="uploadChange" />
					</div>
				</div>
			</div>
			
			<div class="vspace-2"></div>
			<q-btn color="primary" class="pull-right" :loader="submit_pending" type="submit">Готово</q-btn>
		</form>
	</div>
</template>

<script>
	import request from 'superagent';
	import mixins from './../vue-mixins/_global.js';
	import {Toast, QToggle, QBtn, QInput, QIcon} from 'quasar';
	import { required, email, sameAs } from 'vuelidate/lib/validators'

	var apiUrl = require('./../api-url.js').def;

	var Comp = {
		name: 'user-profile',
		components: {QToggle, QBtn, QInput, QIcon},
		data: function () {
			return {
				picPath: '',
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
			uploadReset: function(){
				this.$data.picPath = '';
				this.$refs.fileUploadInput.value = '';
			},
			uploadChange: function(){
				this.$data.picPath = this.$refs.fileUploadInput.value;
			},
			uploadClick: function(){
				this.$refs.fileUploadInput.click();
			},
			register_submit: function(){
				if (false) {
					return
				}				
				this.submit_pending = true;
				request
					.post(apiUrl + 'auth/reg')
					.attach('fileUploadInput_name', this.$data.picPath)
					.field(this.$data)
					.end((err, res) => {
						this.submit_pending = false;
						if (err || !res.body) {
							Toast.create.warning({
								html: res.body.error || 'Registration failed'
							})
						}
						else {
							Toast.create.positive({
								html: 'Успех'
							})
							console.log(res.body);

							// TODO state mutation!
							// this.$root.currentUser = res.body;
							this.$store.updateUser(res.body);

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
