<script>
	import mixins from './../vue-mixins.js'
	import lilink from './_lilink.vue'

	export default {
		name: 'AppRoot',
		data: function () {
			return {
				auth: {
					email: '',
					password: '',
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
		<q-drawer ref="drawer_left" v-bind:backdrop-opacity="0"> <!-- Left Sidebar -->
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

		<q-ajax-bar position="bottom" color="orange" v-bind:speed="200" size="10px"></q-ajax-bar> <!-- Bottom progressbar -->

		<q-drawer ref="drawer_right" right-side><!-- Right Sidebar -->
			<div class="list platform-delimiter">
				<div class="list-header">
					Right Side Drawer
				</div>
				<q-drawer-link icon="mail" to="/shopping-cart">Shopping Cart</q-drawer-link>
				<q-drawer-link icon="mail" to="/weather">Weather</q-drawer-link>
			</div>
		</q-drawer>
	</div>
</template>



<style lang="less">
/*
Global styles
стили в my.css нужны для мгновенного выполнения
те что нет - перенести сюда
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
.hamburger-icon {
	line-height: 3em;
	margin-left: 1em;
	margin-top: 1em;
	padding-left: .6rem; // override
	padding-right: .6rem; // override
}
</style>

