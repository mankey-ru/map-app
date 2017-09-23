<script>
	import mixins from './../vue-mixins/_global.js'

	import {QLayout, QToolbar, QToolbarTitle, QAjaxBar, QBtn, QIcon, QList, QItem, QItemSide, QItemMain, QSideLink}	from 'quasar'

	export default {
		name: 'AppRoot',
		components: {  // TODO перенести часть в миксины?
			QLayout, QToolbar, QToolbarTitle, QList, QAjaxBar, QIcon, QBtn, QItem, QItemSide, QItemMain, QSideLink
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
				col-lg-8	offset-lg-1
				col-xl-6	offset-xl-2
				`
			}
		},
		mixins: [mixins],
		mounted: function() {}
	}
</script>


<template>
	<div>
		<q-layout ref="AppLayout">

			<div slot="header" v-show="!$route.meta.noToolbar">				
				<q-toolbar>
					<q-toolbar-title>
						{{$route.meta.title}} 
						<span slot="subtitle">Для пидоров</span>
					</q-toolbar-title>	

					<q-btn v-on:click="$router.push({name:'mainpage'})" flat>
						<q-icon name="explore" /> 
					</q-btn>				
					<q-btn v-show="currentUser" v-on:click="$router.push({name:'user-profile-current'})" flat class="lt-lg">
						<q-icon name="account box" />
					</q-btn>			
					<q-btn v-on:click="TOGGLESIDE" flat class="lt-lg">
						<q-icon name="menu" />
					</q-btn>
				</q-toolbar>	
			</div>
			<div slot="left">
				<h4 class="text-center mar-v">
					<h1 class="h1-md cursor-pointer" v-on:click="$router.push({name:'mainpage'})">
						<q-icon name="fa-map-o"/>
					</h1>
				</h4>

				<q-list no-border link inset-delimiter>					
					<div v-if="currentUser">
						<q-side-link item :to="{name:'user-profile-current'}">
							<q-item-side icon="account box" />
							<q-item-main :label="currentUser.name" class="multiple-lines" />
						</q-side-link>
						<div v-if="currentUser.role">
							<q-side-link item :to="{name:'event-new'}">
								<q-item-side icon="fiber new" />
								<q-item-main label="Новое событие" />
							</q-side-link>

							<q-side-link item :to="{name:'event-list'}">
								<q-item-side icon="list" />
								<q-item-main label="Мои события" />
							</q-side-link>

							<q-side-link item :to="{name:'place-list'}">
								<q-item-side icon="fa-map-marker" />
								<q-item-main label="Мои места" />
							</q-side-link>
						</div>
					</div>
					<div v-if="!currentUser">
						<q-side-link item :to="{name:'user-login'}">
							<q-item-side icon="fa-sign-in" />
							<q-item-main label="Вход" />
						</q-side-link>
						<q-side-link item :to="{name:'user-register'}">
							<q-item-side icon="fa-sign-out" />
							<q-item-main label="Регистрация" />
						</q-side-link>
					</div>	
					<hr />	
					<q-side-link item :to="{name:'page-how'}">
						<q-item-side icon="chevron right" />
						<q-item-main label="Как это работает" />
					</q-side-link>
					<q-side-link item :to="{name:'page-about'}">
						<q-item-side icon="chevron right" />
						<q-item-main label="О нас" />
					</q-side-link>		
					<div v-show="currentUser">			
						<hr />
						<q-item :link="true" v-on:click="LOG_OUT">
							<q-item-side :icon="auth.pending ? 'fa-sign-out':'fa-sign-out'"/>
							<q-item-main label="Выйти" />
						</q-item>
					</div>

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
	body.mobile, body.cordova {		
		.router-view-wrap {
			padding: 5px 10px;
		}
	}
	.sidebar-logo {
		font-size: 3em;
	}


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
	.h1-xs {
		font-size: 1.4rem;
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