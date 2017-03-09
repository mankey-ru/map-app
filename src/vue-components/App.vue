<script>
	const apiUrl = require('./../api-url.js');
	import mixins from './../vue-mixins.js';
	import routes from './../vue-routes.js';
	import request from 'superagent';
	import notie from 'notie';

	export default {
		name: 'AppRoot',
		data: function () {
			return {
				routes: routes,
				signIn: {
					email: '',
					password: '',
					pending: false
				},
				signOut_pending: false
			}
		},
		methods: {
			signIn_submit: function(){
				if (!this.signIn_valid) {
					return
				}
				this.signIn.pending = true;
				request
				.post(apiUrl + 'auth/in')
				.send({
					username: this.signIn.email,
					password: this.signIn.password
				})
				.end((err, res)=>{
					if (err || !res.body) {
						notie.alert({ type: 'error', text: 'Request error' })
					}
					else if (!res.body.user) {
						notie.alert({ type: 'warning', text: 'Email/password combination not found. Please try again.' })
					}
					else {
						notie.alert({ type: 'success', text: 'Success', time: 1 })
						this.$root.currentUser = res.body.user;
					}
					this.signIn.pending = false;
				});
			},
			signOut: function(){
				this.signOut_pending = true;
				request
				.post(apiUrl + 'auth/out')
				.end((err, res)=>{
					if (err || !res.body) {
						notie.alert({ type: 'error', text: 'Request error' })
					}
					else if (res.body.user) {
						notie.alert({ type: 'warning', text: 'Signout failed' })
					}
					else {
						notie.alert({ type: 'success', text: 'Success', time: 1 })
						this.$root.currentUser = false;
					}
					this.signOut_pending = false;
				});
			}
		},
		mixins: [mixins],
		watch: {
			'$route' : function(to, from){
				if (to.name.indexOf('mapzen')!==-1) {
					window.location.reload();
				}
			}
		},
		computed: {
			signIn_valid: function(){
				return this.signIn.email && this.signIn.password
			},
			currentUser: function(){
				return this.$root.currentUser
			}
		}
	}
</script>


<template>
	<div>
		<div class="row header">
			<div class="col-md-7 col-xs-24">
				<span v-on:click="$router.push('/')" style="font-size: 4em;cursor: pointer;">
					<i class="glyphicon glyphicon-picture"></i>
				</span>
			</div>
			<div class="col-md-17 col-xs-24">
				<div v-if="currentUser" class="text-right">
					<button v-on:click="gotoProfile" class="btn btn-default">
						<i class="glyphicon glyphicon-user"></i> {{currentUser.name}}
					</button>
					<button v-on:click="signOut" class="btn btn-default">
						<i v-show="signOut_pending" class="spin"></i> 
						<i v-show="!signOut_pending" class="glyphicon glyphicon-log-out"></i> 
						Log out
					</button>
				</div>
				<div v-if="!currentUser">
					<form v-on:submit.prevent="signIn_submit">
						<div class="row">
							<div class="col-md-6 col-xs-24">
								<label>Email</label>
								<input name="email" type="email" class="form-control" v-model="signIn.email"/>
							</div>
							<div class="col-md-6 col-xs-24">
								<label>Password</label>
								<input name="password" class="form-control" v-model="signIn.password" type="password"/>
							</div>
							<div class="col-md-4 col-xs-12">
								<div><label>&#160;</label></div>
								<button class="btn btn-default" v-bind:disabled="!signIn_valid || signIn.pending" type="submit">
									<i v-show="signIn.pending" class="spin"></i> 
									<i v-show="!signIn.pending" class="glyphicon glyphicon-log-in"></i> 
									Log in
								</button>
							</div>
							<div class="col-md-4 col-md-offset-4  col-xs-12 text-right">
								<div><label>&#160;</label></div>
								<button class="btn btn-default" v-on:click.prevent="gotoRegister" v-bind:disabled="signIn.pending" type="button">
									Register
								</button>
							</div>
						</div>
					</form>
				</div>
			</div>					
		</div>
		<router-view></router-view>
		<!-- <div class="mynav">
			<router-link class="btn btn-lg btn-default" active-class="active" to="/" exact>
				Google
			</router-link>  
			<router-link class="btn btn-lg btn-default" active-class="active" to="/map-osm">
				OSM
			</router-link>  
			<router-link class="btn btn-lg btn-default" active-class="active" to="/map-mapzen">
				Mapzen with fancy 3D view
			</router-link> 
			<router-link class="btn btn-lg btn-default" active-class="active" to="/map-mapzen-v0">
				Mapzen with default tiles
			</router-link>
		</div> -->
	</div>
</template>



<style scoped>
/*	.mynav {
		margin: 2em 0;
		text-align: center;
	}
	.mynav a {
		margin-bottom: .3em;
	}*/
	.header {
		margin-bottom: 2em;
	}
</style>

