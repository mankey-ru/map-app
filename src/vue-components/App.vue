<script>
	import mixins from './../vue-mixins.js'
	import lilink from './_lilink.vue'

	import {QLayout, QToolbar, QToolbarTitle, QAjaxBar, QBtn, QIcon, QList, QItem, QItemSide, QItemMain}	from 'quasar'

	export default {
		name: 'AppRoot',
		components: {  // TODO перенести часть в миксины?
			lilink, QLayout, QToolbar, QToolbarTitle, QList, QAjaxBar, QIcon, QBtn, QItem, QItemSide, QItemMain
		}, 
		data: function() {
			return {
				auth: {
					pending: false
				},
				layoutLimitedWidth: `
				col-xs-10	offset-xs-1
				col-sm-10	offset-sm-1
				col-md-10	offset-md-1
				col-lg-8	offset-lg-2
				col-xl-6	offset-xl-3
				`
			}
		},
		mixins: [mixins],
		mounted: function() {}
	}
</script>


<template>
	<div>
		<q-layout>

			<div slot="header" v-show="!$route.meta.noToolbar">				
				<q-toolbar>
					<q-toolbar-title>
						{{$route.meta.title}} 
						<span slot="subtitle">
							Subtitle
						</span>
					</q-toolbar-title>	

					<q-btn v-on:click="$router.push({name:'mainpage'})" flat>
						<q-icon name="explore" /> 
						<span class="gt-md"> Карта событий</span>
					</q-btn>				
					<q-btn v-show="currentUser" v-on:click="$router.push({name:'user-profile-current'})" flat class="lt-lg">
						<q-icon name="account box" />
						<span class="gt-md">Аккаунт</span>
					</q-btn>			
					<q-btn v-on:click="$refs.drawer_left.open()" flat class="lt-lg">
						<q-icon name="menu" />
					</q-btn>
				</q-toolbar>	
			</div>
			<div slot="left" ref="drawer_left"> <!-- Left Sidebar :backdrop-opacity="0" -->

				<h4 class="text-center mar-v">
					<!-- <i class="mdi mdi-google-maps cursor-pointer sidebar-logo" v-on:click="$router.push({name:'mainpage'})"></i> -->
					<h1 class="h1-md cursor-pointer" v-on:click="$router.push({name:'mainpage'})">
						<q-icon name="fa-map-o"/>
					</h1>
				</h4>

				<q-list no-border link inset-delimiter>
					
					<div v-if="currentUser">
						<lilink to="user-profile-current" class="multiple-lines" icon="account box" v-bind:label="currentUser.name"/>
						<div v-if="currentUser.role">
							<lilink to="event-new" icon="fiber new" label="Добавить событие"/> 
							<lilink to="event-list" icon="list" label="Мои события"/>
						</div>
					</div>
					<div v-if="!currentUser">
						<lilink to="user-login" icon="fa-sign-in" label="Вход"/>
						<lilink to="user-register" icon="fa-sign-out" label="Регистрация" />
					</div>	
					<hr />	
					<lilink to="page-how" icon="chevron right" label="Как это работает"/>
					<lilink to="page-about" icon="chevron right" label="О нас"/>
					<hr />
					<q-item :link="true" v-on:click.native="LOG_OUT" v-show="currentUser">
						<q-item-side :icon="auth.pending ? 'fa-sign-out':'fa-sign-out'"/>
						<q-item-main label="Выйти" />
					</q-item>		

				</q-list>
			</div>

			<div class="row layout-view">
				<div v-bind:class="$route.meta.fullWidth?'router-view-wrap col-12':'router-view-wrap' + layoutLimitedWidth">
					<router-view></router-view>
					<q-ajax-bar position="bottom" color="secondary" v-bind:speed="100" size="10px"></q-ajax-bar>			
				</div>
			</div>

			
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
	.vspace-4 {
		.--vspace();
		height: 4em;
	}
	.h1-md {
		font-size: 2.5rem;
	}
	.h1-sm {
		font-size: 1.8rem;
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
		cursor: pointer !important;
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
</style>