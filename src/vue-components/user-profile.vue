<template>
	<div>
		<form v-on:submit.prevent="userEdit">
			<div v-if="user">
				<div class="row">
					<div class="width-1">
						<h3 class="gt-sm">{{user.name}}</h3>
						<h5 class="lt-md">{{user.name}}</h5>
					</div>
				</div>
				<div class="row">
					<div class="col-4 text-center">
						<img v-bind:src="user.pic" class="user-pic" />
					</div>
					<div class="col-8 mar-v-group">
						<q-input v-model="user.name" v-if="own" :readonly="!own" float-label="Имя" required />
						<div>
							<q-checkbox :disable="!own" v-model="currentUserIsMusician" label="Музыкант" />
						</div>
						<q-datetime 
						v-model="user.bdate" 
						type="date" 
						float-label="День рождения"
						:month-names="LOC('monthNames')"
						:day-names="LOC('dayNamesShort')"
						:monday-first="true"
						format="DD.MM.YYYY"
						ok-label="Ок"
						clear-label="Очистить"
						cancel-label="Отмена"
						/>
						<span v-if="!own">
							{{user.bdate | df_pretty_dm}}
						</span>
						<div class="clearfix"></div>
					</div>
				</div>
				<br />
				<br />
				<div class="row">
					<div class="col-12">						
						<div class="mar-v-group"> 
							<q-input type="textarea"
							v-model="user.descr" 
							:readonly="!own" 
							class="user-textarea" 
							required 
							float-label="О себе" />
							<p v-if="!own">{{user.descr}}</p>
							<br/>
							<div class="row">
								<div class="col-6">
									<homebtn></homebtn>
								</div>
								<div class="col-6 text-right">
									<q-btn v-if="own" big color="primary" :loading="submit_pending" type="submit">
										Сохранить
									</q-btn>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div v-else class="spinner-wrap">
				<q-spinner :size="50"/>
			</div>
		</form>
	</div>
</template>

<script>
	var apiUrl = require('./../api-url.js').def;

	import request from 'superagent'
	import {Toast, QInput, QBtn, QDatetime, QCheckbox, QSpinner} from 'quasar'
	import mixins from './../vue-mixins/_global.js'

	var Comp = {
		name: 'user-profile',		
		components: {QInput, QBtn, QDatetime, QCheckbox, QSpinner},
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
							Toast.create.warning({html:res.body.error || 'User fetch failed'})
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
				this.submit_pending = true;
				request
				.post(apiUrl + 'auth/edit')
				.send(this.user)
				.end((err, res)=>{
					if (err || !res.body ||  !res.body.ok) {
						Toast.create.warning({html:res.body.error || 'User edit failed'})
					}
					else {
						Toast.create.positive({html:'Успех'})
						this.$store.dispatch('updateUser', this.user);
					}
					this.submit_pending = false;
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
		watch: {
		    '$route': 'getUser' // чтобы при смене /#/user-profile/1 на /#/user-profile обовлялся пользователь
		},
		destroyed: function () {},		
		beforeUpdate: function() {},
		created: function(){}
	}
	export default Comp;
</script>

<style scoped lang="less">
.user-pic {
	border-radius: .5em;
	margin-right: 1em;
}
body.desktop {
	.user-pic {
		max-width:200px;
	}
}
body.mobile {
	.user-pic {
		max-width:50px;
	}
}
.user-textarea {
	height: 7em;
	resize: none;
}
</style>
