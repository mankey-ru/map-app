<template>
	<div class="row">
		<form v-on:submit.prevent="userEdit" class="width-2of4 offset-1of4 lt-bg-width-1of1 lt-bg-offset-0 pad-h">
			<div v-show="user">
				<div class="row">
					<div class="width-1">
						<h3>{{user.name}}</h3>
					</div>
				</div>
				<div class="row">
					<div class="width-1of3 text-right">
						<img v-bind:src="user.pic" class="user-pic" />
					</div>
					<div class="width-2of3 mar-v-group">
						<div v-if="own" class="floating-label">
							<input v-model="user.name" v-bind:readonly="!own" class="full-width" required />
							<label>Имя</label>
						</div>
						<div>
							<label>
								<q-toggle v-bind:disable="!own" class="primary" v-model="currentUserIsMusician"></q-toggle>
								Музыкант
							</label>
						</div>
						<div class="__datepicker-wrap">
							<label>День рождения</label>
							<div v-if="own">
								<datepicker 
								:input-class="'full-width'" 
								v-model="user.bdate"
								:language="'ru'"
								:monday-first="true"
								:format="'dd.MM.yyyy'"
								></datepicker>
							</div>
							<span v-if="!own">
								{{user.bdate | df_pretty_dm}}
							</span>
						</div>
					</div>
				</div>
				<div class="mar-v-group"> 
					<div class="floating-label" v-if="own">
						<textarea v-if="own" v-model="user.descr" v-bind:readonly="!own" class="full-width user-textarea" required></textarea>
						<label>О себе</label>
					</div>
					<p v-if="!own">{{user.descr}}</p>

					<div class="row">
						<div class="width-1of2">
							<homebtn></homebtn>
						</div>
						<div class="width-1of2 text-right">
							<q-progress-button v-if="own" indeterminate class="primary big" v-bind:percentage="submit_pending" type="submit">
								Сохранить
							</q-progress-button>
						</div>
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
				submit_pending: 0
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
								this.user = res.body;
								this.own = this.currentUser && this.currentUser._id === res.body._id;
							}
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
				this.submit_pending = 1;
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
					this.submit_pending = 0;
				});
			}
		},
		mounted: function(){
			this.getUser();
		},
		computed: {
			currentUserIsMusician: { // for q-toggle which accepts boolean only
				get: function(){
					return !!this.user.role
				},
				set: function(val){
					this.user.role = (val | 0);  
				}
			}
		},
		components: {
			Datepicker
		},
		watch: {
		    '$route': 'getUser' // чтобы при смене /#/user-profile/1 на /#/user-profile обовлялся пользователь
		},
		destroyed: function () {},		
		beforeUpdate: function() {},
		created: function(){}
	}
	export default Comp;
</script>

<style scoped>
	.user-pic {
		max-width:200px;
		border-radius: .5em;
		margin-right: 1em;
	}
	.user-textarea {
		height: 7em;
		resize: none;
	}
</style>
