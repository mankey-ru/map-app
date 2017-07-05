import Vue from 'vue'
import Vuex from 'vuex'
import request from 'superagent'
const apiUrl = require('./api-url.js').def;

const state = {}
const mutations = {
	m_GLOBAL_SYNCRONOUS_DATA: function(state, cdata) {
		for (var k in cdata) { // straightforward merge
			Vue.set(state, k, cdata[k])
		}
	},
	m_updateUser: function(state, user) {
		Vue.set(state, 'currentUser', user);
	}
}
const actions = {
	a_GLOBAL_SYNCRONOUS_DATA: function(store) {
		// Getting initial page data (since page itself contains nothing)
		// http://stackoverflow.com/a/40393742
		if (GLOBAL_SYNCRONOUS_DATA) {			
			store.commit('m_GLOBAL_SYNCRONOUS_DATA', window.GLOBAL_SYNCRONOUS_DATA);		
			delete window.GLOBAL_SYNCRONOUS_DATA;
		}
	},
	updateUser: function(store, user) {
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