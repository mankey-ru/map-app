import Vue from 'vue'
import Vuex from 'vuex'
import request from 'superagent'
const apiUrl = require('./api-url.js').def;

const state = {}
const mutations = {
	m_loadCommonData: function (state, cdata) {
		for (var k in cdata) { // straightforward merge
			Vue.set(state, k, cdata[k])
		}
	},
	m_updateUser: function (state, user) {
		Vue.set(state, 'currentUser', user);
	}
}
const actions = {
	loadCommonData: function (store) {
		// Getting initial page data (since page itself contains nothing)
		// http://stackoverflow.com/a/40393742
		request
			.get(apiUrl + 'commondata')
			.end((err, res) => {
				if (err || !res.body) {
					console.log('Resource "api/commondata" did not responded. Reloading page in 3 sec');
					window.setTimeout(window.location.reload, 3000)
				}
				else {
					store.commit('m_loadCommonData', res.body)
				}
			});
		
	},
	updateUser: function (store, user) {
		return store.commit('m_updateUser', user)
	}
};
const getters = {
	currentUser: state => state.currentUser
}

// -------------------------------------------------------------------------------
Vue.use(Vuex);
export default new Vuex.Store({
	state,
	getters,
	actions,
	mutations
})