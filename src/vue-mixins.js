const moment = require('moment')
moment.locale('ru');

const apiUrl = require('./api-url.js').def;
import request from 'superagent'
import _ from 'lodash'

import miniToastr from 'mini-toastr'
_.extend(miniToastr.config.style['.mini-toastr'], {
	'top': 'initial',
	'bottom': '1em',
	'right': '1em'
})
_.extend(miniToastr.config.style['.mini-toastr__notification'], {
	'opacity': 1,
	'box-shadow': 'none'
})
miniToastr.init();

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
			this.auth.pending = 1;
			var meth = this.auth.method || ''
			request
				.post(`${apiUrl}auth/in/${meth}`)
				.send(credentials)
				.end((err, res) => {
					if (err || !res.body) {
						miniToastr.error('Request error')
					}
					else {
						var user = res.body.currentUser;
						if (!user) {
							miniToastr.warn('Email/password combination not found. Please try again.')
						}
						else {
							this.LOG_IN_SUCCESS(user);
						}
					}
					this.auth.pending = 0;
				});
		},
		LOG_IN_EXT: function (provider) {
			window._handleLogonSuccess = (user) => {
				this.LOG_IN_SUCCESS(user);
				delete window._handleLogonSuccess;
			}
			var wo = window.open(`${apiUrl}auth/in?provider=${provider}`, '_blank', 'height=500,width=700,location=no,status=no,titlebar=no,toolbar=no')
		},
		LOG_IN_SUCCESS: function (user) {
			//console.log(user)
			//miniToastr.success('Success');
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
						miniToastr.error('Request error')
					}
					else if (res.body.user) {
						miniToastr.warning('Logout failed')
					}
					else {
						miniToastr.success('Success')
						this.$store.dispatch('updateUser', false);
						//this.$router.push('/')
					}
					if (this.auth) {
						this.auth.pending = 0;
					}
				});
		},
		GOTO_PROFILE: function (author) {
			var rt;
			if (author && author._id) {
				rt = {
					name: 'user-profile-any',
					params: {
						user_id: author._id
					}
				}
			}
			else {
				rt = {
					name: 'user-profile-current'
				}
			}
			this.$router.push(rt)
		},
		GOTO_REGISTER: function (drawer) {
			this.GOTO__ABSTRACT({
				name: 'user-register'
			}, drawer)
		},
		GOTO_EVT_NEW: function (drawer) {
			this.GOTO__ABSTRACT({
				name: 'event-new'
			}, drawer)
		},
		GOTO_LOGIN: function (drawer) {
			this.GOTO__ABSTRACT({
				name: 'user-login'
			}, drawer)
		},
		GOTO__ABSTRACT: function(to, drawer){
			if (drawer && drawer.close) {
				drawer.setState(false, () => {
					this.$router.push(to)
				});
			}
			else {
				this.$router.push(to)
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
		}
	},
	components: {},
	computed: {
		currentUser: function () {
			return this.$store.state.currentUser
		}
	}
}