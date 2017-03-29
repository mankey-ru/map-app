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
		<q-drawer ref="drawer_left"> <!-- Left Sidebar -->
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
					<lilink to="event-list" icon="chevron-right">
						Как это работает
					</lilink>

					<lilink to="event-list" icon="chevron-right">
						О нас
					</lilink>
				</div>
			</div>
		</q-drawer>

		<router-view class="layout-view"></router-view>

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



<style scoped>
</style>

