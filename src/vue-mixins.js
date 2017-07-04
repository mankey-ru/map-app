/**
	Global mixins
*/

const moment = require('moment')
moment.locale('ru');

const apiUrl = require('./api-url.js').def;
import request from 'superagent'
import _ from 'lodash'

import DICT from './dict.js'

import {Toast, QBtn} from 'quasar'

/*
TODO add store mixins if needed
import { mapGetters, mapActions } from 'vuex'
{
  computed: mapGetters(['getterName']),
  methods: mapActions(['actionName'])
}
*/

export default {
	methods: {
		LOG_IN: function () {
			var credentials = this.auth ? {
				username: this.auth.email,
				password: this.auth.password
			} : {};
			this.auth.pending = true;
			var meth = this.auth.method || ''
			request
				.post(`${apiUrl}auth/in/${meth}`)
				.send(credentials)
				.end((err, res) => {
					if (err || !res.body) {
						Toast.create.warning({html:'Request error'})
					}
					else {
						var user = res.body.currentUser;
						if (!user) {
							Toast.create.warning({html:'Email/password combination not found. Please try again.'})
						}
						else {
							this.LOG_IN_SUCCESS(user);
						}
					}
					this.auth.pending = false;
				});
			// TODO implement permanent credentials storage
			// https://github.com/Crypho/cordova-plugin-secure-storage
			// https://github.com/TheCocoaProject/cordova-plugin-nativestorage
			// https://dbwriteups.wordpress.com/2016/01/24/sharing-data-between-hybrid-app-and-inapp-browser/
		},
		LOG_IN_EXT: function (provider) {
			window._handleLogonSuccess = (user) => {
				this.LOG_IN_SUCCESS(user);
				delete window._handleLogonSuccess;
			}
			var wo = window.open(`${apiUrl}auth/in?provider=${provider}`, '_blank', 'height=500,width=700,location=no,status=no,titlebar=no,toolbar=no')
		},
		LOG_IN_SUCCESS: function (user) {
			this.$store.dispatch('updateUser', user);
			if (this.$route.name === 'user-login') {
				this.$router.push('/')
			}
		},
		LOG_OUT: function () {
			if (this.auth) {
				this.auth.pending = 1;
			}
			request
				.post(apiUrl + 'auth/out')
				.end((err, res) => {
					if (err || !res.body) {
						Toast.create.warning({html:'Request error'})
					}
					else if (res.body.user) {
						Toast.create.warning({html:'Logout failed'})
					}
					else {
						Toast.create.positive({html:'Success'})
						this.$store.dispatch('updateUser', false);
						// this.$router.push('/')
					}
					if (this.auth) {
						this.auth.pending = 0;
					}
				});
		},
		GOTO: function(to, drawer){
			if (typeof to === 'string') {
				to = {name: to}
			}
			this.$router.push(to)
		},
		LOC: function(k){
			return DICT.ru[k]
		},
		TOGGLESIDE: function(){
			var Lay = this.$root.$children[0].$refs.AppLayout;
			if (Lay.leftOnLayout === false) { // not closing sidebar on big screens (also NB Lay.leftState.openedBig)
				Lay.toggleLeft()
			}
		}
	},
	filters: {
		dateTimeFormat: function (val) {
			if (!val) {
				return ''
			}
			var date = new Date(val);
			if (date.toLocaleString) {
				return date.toLocaleString()
			}
			return moment(val).format('MM.DD.YYYY hh:mm');
		},
		dateFormatPretty: function (val) {
			if (!val) {
				return ''
			}
			return moment(val).format('D MMMM, dddd');
		},
		df_pretty_dm: function (val) {
			if (!val) {
				return ''
			}
			return moment(val).format('D MMMM');
		}
	},
	components: {
		homebtn: {
			components: {QBtn},
			template: `
			<q-btn icon="fa-map-o" v-on:click="$router.push({name:'mainpage'})" color="primary" outline small type="button">
				На главную
			</q-btn>`
		}
	},
	computed: {
		currentUser: function () {
			return this.$store.state.currentUser
		}
	}
}