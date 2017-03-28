<template>
	<div>
		<form v-on:submit.prevent="userEdit">
			<div v-show="!user" class="text-center">
				<i class="spin spin-lg"></i>
			</div>
			<div v-show="user">
				<div class="col-md-5 col-xs-24 text-right">
					<img v-bind:src="user.pic" class="f-userpic" />
				</div>
				<div class="col-md-19 col-xs-24">
					<h2 v-if="!own">{{user.name}}</h2>
					<div v-if="own" class="form-group">
						<label>Имя</label>
						<input v-model="user.name" v-bind:readonly="!own" class="form-control" />
					</div>
					<div class="form-group">
						<label>О себе</label>
						<textarea v-model="user.descr" v-bind:readonly="!own" class="form-control"></textarea>
					</div>
					<div class="form-group">
						<label>Музыкант</label>
						<br />
						<input type="checkbox" v-bind:readonly="!own" v-model="user.role" style="width: 1.5em; height: 1.5em;vertical-align: middle;">
					</div>
					<div class="form-group __datepicker-wrap">
						<label>Дата рождения</label>
						<div v-if="own">
							<datepicker 
							:input-class="'form-control'" 
							v-model="user.bdate"
							:language="'ru'"
							:monday-first="true"
							:format="'dd.MM.yyyy'"
							></datepicker>
						</div>
						<div v-if="!own">
							{{user.bdate}}
						</div>
					</div>
					<div class="text-right">
						<button type="submit" v-bind:disabled="submit_pending" class="btn btn-primary">
							<i v-show="submit_pending" class="spin"></i>
							<i v-show="!submit_pending" class="glyphicon glyphicon-ok"></i>
							Сохранить
						</button>
					</div>
				</div>
			</div>
		</form>
	</div>
</template>

<script>
	var apiUrl = require('./../api-url.js').def;

	import request from 'superagent'
	import Datepicker from 'vuejs-datepicker'
	import miniToastr from 'mini-toastr'
	import mixins from './../vue-mixins.js'

	var Comp = {
		name: 'user-profile',
		data: function () {
			return {
				user: false,
				own: false,
				submit_pending: false
			}
		},
		mixins: [mixins],
		methods: {
			getUser: function(){
				var user_id = this.$router.currentRoute.params.user_id;
				if (user_id) {
					request
						.get(apiUrl + 'user/' + user_id) 
						.end((err, res)=>{
								if (err || !res.body) {
									miniToastr.error(res.body.error || 'User fetch failed')
								}
								else {
									this.user = data;
									this.own = this.currentUser._id === data._id;
								}
								this.submit_pending = false;
							})
				}
				else {
					this.$nextTick(()=>{
						// nextTick to let store update first
						// when loading page from scratch (without commondata)
						if (this.currentUser) {
							this.user = this.currentUser;
							this.own = true;
						}
						else {
							console.log('User not authorized')
							this.$router.push('/')
						}
					})
						
					
				}
			},
			userEdit: function(){
				this.submit_pending = true;
				request
					.post(apiUrl + 'auth/edit')
					.send(this.user)
					.end((err, res)=>{
							if (err || !res.body ||  !res.body.ok) {
								console.log(res.body)
								miniToastr.error(res.body.error || 'User edit failed');
							}
							else {
								miniToastr.success('Успех');
								this.$store.dispatch('updateUser', this.user);
							}
							this.submit_pending = false;
						});
			}
		},
		mounted: function(){
			this.getUser();
		},
		components: {
			Datepicker
		},
		/*watch: {
			'$route': 'getUser' // чтобы при смене /#/user-profile/1 на /#/user-profile обовлялся пользователь
		},*/
		destroyed: function () {},		
		beforeUpdate: function() {},
		created: function(){}
	}
	export default Comp;
</script>

<style scoped>
	.f-userpic {
		max-width:200px;
		border-radius: .5em;

	}
</style>
