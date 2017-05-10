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
		<q-layout>

			<div slot="header" class="toolbar primary" v-show="!$route.meta.noToolbar">
				<button class="hide-on-drawer-visible" v-on:click="$refs.drawer_left.open()">
					<i class="mdi mdi-menu"></i>
				</button>
				<q-toolbar-title v-bind:padding="1">
					{{$route.meta.title}}
				</q-toolbar-title>
				<button v-on:click="$router.push({name:'mainpage'})">
					<!-- <i class="mdi mdi-google-maps"></i> -->
					<i>explore</i>
				</button>
				<button v-show="currentUser" v-on:click="$router.push({name:'user-profile-current'})">
					<i class="mdi mdi-account-box"></i>
				</button>
			</div>
			<q-drawer ref="drawer_left" v-bind:backdrop-opacity="0"> <!-- Left Sidebar -->
				<div class="toolbar light" v-show="$route.meta.noToolbar">
					<q-toolbar-title v-bind:padding="1">
						{{$route.meta.title}}
					</q-toolbar-title>
				</div>
				<h4 class="text-center mar-v">
					<!-- <i class="mdi mdi-google-maps cursor-pointer sidebar-logo" v-on:click="$router.push({name:'mainpage'})"></i> -->
					<h1 class="h1-md cursor-pointer" v-on:click="$router.push({name:'mainpage'})">
						Лого
					</h1>
				</h4>
				<div class="list platform-delimiter">
					<div v-if="currentUser">
						<lilink to="user-profile-current" class="multiple-lines" icon="account-box" v-bind:drawer="$refs.drawer_left">
							{{currentUser.name}}
						</lilink>
						<div v-if="currentUser.role">
							<lilink to="event-new" icon="new-box" v-bind:drawer="$refs.drawer_left">
								Добавить событие
							</lilink>
							<lilink to="event-list" icon="format-list-bulleted-type" v-bind:drawer="$refs.drawer_left">
								Мои мероприятия
							</lilink>
						</div>
						<q-progress-button indeterminate class="tertiary full-width" v-bind:percentage="auth.pending" v-on:click.native="LOG_OUT">
							Выйти
						</q-progress-button>
					</div>
					<div v-if="!currentUser">
						<lilink to="user-login" icon="login-variant" v-bind:drawer="$refs.drawer_left">
							Вход
						</lilink>
						<lilink to="user-register" icon="account-card-details" v-bind:drawer="$refs.drawer_left">
							Регистрация
						</lilink>
					</div>
					<hr />
					<div>
						<lilink to="page-how" icon="chevron-right" v-bind:drawer="$refs.drawer_left">
							Как это работает
						</lilink>

						<lilink to="page-about" icon="chevron-right" v-bind:drawer="$refs.drawer_left">
							О нас
						</lilink>
					</div>
				</div>
			</q-drawer>

			<div class="row layout-view">
				<div v-bind:class="$route.meta.fullWidth?'router-view-wrap width-1of1':'router-view-wrap offset-1of4 width-2of4 lt-bg-width-1of1 lt-bg-offset-0'">
					<router-view></router-view>
				</div>
			</div>

			<q-ajax-bar position="bottom" color="primary" v-bind:speed="100" size="15px"></q-ajax-bar>			
		</q-layout>
	</div>
</template>



<style lang="less">/* Global (not scoped) styles */
	.drawer-content.left-side {
		/*box-shadow: 6px 0 19px 3px #888;*/
	}
	body.mobile, body.cordova {		
		.router-view-wrap {
			padding: 10px 15px;
		}
	}
	.sidebar-logo {
		font-size: 3em;
	}

 /* width took from drawer code */
/*	@media screen and (min-width: 921px) {
		.sidebar-title {
			display: none !important;
		}
	}*/

	.spinner-wrap {
		padding: 5em;
		text-align: center;
	}

	/*
	========================================================================================
									Basic helper classes
	========================================================================================
	*/
	.--vspace {
		width: 100%;
		clear: both;
	}
	.vspace-2 {
		.--vspace();
		height: 2em;
	}
	.vspace-3 {
		.--vspace();
		height: 3em;
	}
	.h1-md {
		font-size: 2.5rem;
	}
	.group-x {
		&>label, 
		&>.stacked-label, 
		&>.floating-label {		
			display: block;	
			margin-bottom: 2em;
		}
	}
	.--err {		
		color: #db2828;
	}
	.err-label {
		.--err();
		margin-left: 1em;
	}
	.err-msg {
		.--err();
		text-align: right;
		font-size: .7em;
	}
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
	body, body.desktop.with-modal {
		overflow-y: scroll !important;
		overflow-x: hidden !important;
	}

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
		position: absolute !important; // override .mapboxgl-map
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
</style>