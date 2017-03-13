const moment = require('moment')
moment.locale('ru');

const apiUrl = require('./api-url.js')
import pager from './vue-components/_pager.vue'
import request from 'superagent'

import miniToastr from 'mini-toastr'
miniToastr.init();

export default {
	methods: {
		LOG_IN: function () {
			var credentials = {
				username: this.auth.email,
				password: this.auth.password
			};
			if (!credentials.username || !credentials.password) {
				return
			}
			this.auth.pending = true;
			request
				.post(apiUrl + 'auth/in')
				.send(credentials)
				.end((err, res) => {
					if (err || !res.body) {
						miniToastr.error('Request error')
					}
					else if (!res.body.user) {
						miniToastr.warn('Email/password combination not found. Please try again.')
					}
					else {
						miniToastr.success('Success');
						this.$root.currentUser = res.body.user;
						if (this.$route.name==='user-login') {
							this.$router.push('/')
						}
					}
					this.auth.pending = false;
				});
		},
		LOG_OUT: function () {
			this.auth.pending = true;
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
						this.$root.currentUser = false;
					}
					this.auth.pending = false;
				});
		},
		gotoProfile: function (author) {
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
		gotoRegister: function () {
			this.$router.push({
				name: 'user-register'
			})
		},
		gotoTheme: function (th) {
			this.$router.push({
				name: 'reply_list',
				params: {
					theme_id: th._id
				}
			})
		},
		gotoEventNew: function () {
			this.$router.push({
				name: 'event-new'
			})
		},
		GOTO_LOGIN: function(){
			this.$router.push({
				name: 'user-login'
			})
		}
	},
	filters: {
		dateTimeFormat: function (val) {
			var date = new Date(val);
			if (date.toLocaleString) {
				return date.toLocaleString()
			}
			return moment(val).format('MM.DD.YYYY hh:mm');
		},
		dateFormatPretty: function (val) {
			return moment(val).format('D MMMM, dddd');
		}
	},
	components: {
		pager: pager
	},
	computed: {
		currentUser: function () {
			return this.$root.currentUser
		}
	}
}