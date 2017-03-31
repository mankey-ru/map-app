<script>
	import mixins from './../vue-mixins.js'
	import lilink from './_lilink.vue'

	export default {
		name: 'AppRoot',
		data: function () {
			return {
				auth: {
					pending: 0
				}
			}
		},
		mixins: [mixins],
		components: {lilink}
	}
</script>


<template>
	<div>
		<q-drawer ref="drawer_left" v-bind:backdrop-opacity=".2"> <!-- Left Sidebar -->
			<h4 class="text-center mar-v">
				<i class="mdi mdi-google-maps cursor-pointer" v-on:click="GOTO_MAIN($refs.drawer_left)"></i>
			</h4>
			<div class="list platform-delimiter">
				<div v-if="currentUser">
					<lilink to="user-profile-current" icon="account-box">
						{{currentUser.name}}
					</lilink>
					<div v-if="currentUser.role">
						<lilink to="event-new" icon="new-box">
							Добавить событие
						</lilink>

						<lilink to="event-list" icon="format-list-bulleted-type">
							Мои мероприятия
						</lilink>
					</div>
					<q-progress-button indeterminate class="tertiary full-width" v-bind:percentage="auth.pending" v-on:click.native="LOG_OUT">
						Выйти
					</q-progress-button>
				</div>
				<div v-if="!currentUser">
					<lilink to="user-login" icon="login-variant">
						Вход
					</lilink>
					<lilink to="user-register" icon="account-card-details">
						Регистрация
					</lilink>
				</div>
				<hr />
				<div>
					<lilink to="page-how" icon="chevron-right">
						Как это работает
					</lilink>

					<lilink to="page-about" icon="chevron-right">
						О нас
					</lilink>
				</div>
			</div>
		</q-drawer>

		<div slot="header" class="toolbar orange" v-show="$route.name!=='mainpage'">
			<button class="11hide-on-drawer-visible" v-on:click="$refs.drawer_left.open()">
				<i class="mdi mdi-menu"></i>
			</button>
			<q-toolbar-title :padding="2">
				Джигурда!
			</q-toolbar-title>
			<button v-on:click="$router.push({name:'mainpage'})">
				<i class="mdi mdi-google-maps"></i>
			</button>
			<button v-show="currentUser" v-on:click="$router.push({name:'user-profile-current'})">
				<i class="mdi mdi-account-box"></i>
			</button>
		</div>

		<router-view class="layout-view"></router-view>

		<q-ajax-bar position="bottom" color="orange" v-bind:speed="200" size="15px"></q-ajax-bar> 
		<!-- Bottom progressbar -->

		<!-- <q-drawer ref="drawer_right" right-side>
			<div class="list platform-delimiter">
				<div class="list-header">
					Right Side Drawer
				</div>
				<q-drawer-link icon="mail" to="/shopping-cart">Shopping Cart</q-drawer-link>
				<q-drawer-link icon="mail" to="/weather">Weather</q-drawer-link>
			</div>
		</q-drawer> -->
	</div>
</template>



<style lang="less">/* Global (not scoped) styles */
	.drawer-content.left-side {
		/*box-shadow: 6px 0 19px 3px #888;*/
	}

	/*
	========================================================================================
									Basic helper classes
	========================================================================================
	*/

	.mar-v {
		margin-top: 1em;
		margin-bottom: 1em;
	}
	.mar-h {
		margin-left: 1em;
		margin-right: 1em;
	}
	.pad-v {
		padding-top: 1em;
		padding-bottom: 1em;
	}
	.pad-h {
		padding-left: 1em;
		padding-right: 1em;
	}
	.mar-v-group>* {
		.mar-v();
	}
	.mar-h-group>* {
		.mar-h();
	}
	.pad-v-group>* {
		.pad-v();
	}
	.pad-h-group>* {
		.pad-h();
	}
	/* --------------------------------------------------------------------- */
	.opa {
		opacity: .5;
	}
	.nwr {
		white-space: nowrap;
	}
	.pntr {
		cursor: pointer;
	}
	.hdn {
		display: none;
	}
	.link-dotted{
		cursor: pointer;
		border-bottom: 1px dotted;
	}
	.link-dotted:hover {
		text-decoration: none;
	}
	/* --------------------------------------------------------------------- */
	textarea {
		resize: none;
	}
	input:-webkit-autofill {
		-webkit-box-shadow: 0 0 0px 1000px white inset;
	}
	blockquote {
		border-left: 3px solid #bbb;
		margin-left: .5em;
		padding: .5em;
	}
	body {
		overflow-y: scroll;
		overflow-x: hidden;
	}
	.main-container {}

	/*
	========================================================================================
									Map related common styles
	========================================================================================
	*/
	#map-container {
		background-color: #eee;
		border-radius: 3px;
		min-height: 400px;
	}

	.__fullscreen {
		position: absolute;
		width: 100%;
		height: 100%;
		top: 0;
		left: 0;
		bottom:0;
		right: 0;
		overflow: hidden;
	}

	.map-ctrl-wrap {
		padding: 1em;
	}

	/*
	========================================================================================
							ext styles for vuejs-datepicker
	========================================================================================
	*/
	.__datepicker-clear {
		position: absolute;
		top: .5em;
		right: .7em;
		color: #666;
		cursor: pointer;
	}
	.__datepicker-wrap {
		position:relative
	}
	.__datepicker-wrap input[readonly]{ 
		/*background-color: #fff;*/
		cursor: pointer;
	}
	.__datepicker-wrap-noborder .calendar {
		border-width: 0;
	}
	.__datepicker-wrap-center {
		text-align: center;
	}
	.__datepicker-wrap-center .datepicker {
		display: inline-block;
		text-align: left;
	}
</style>