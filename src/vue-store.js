import Vue from 'vue'
import Vuex from 'vuex'

const state = {
	currentUser: false
}
const mutations = {
	m_loadCommonData: function (state, cdata) {
		for (var k in cdata) { // straightforward merge
			state[k] = cdata[k]
		}
	},
	m_updateUser: function (state, user) {
		state.currentUser = user;
	}
}
const actions = {
	loadCommonData: function (store, cdata) {
		// todo make async
		// http://stackoverflow.com/a/40393742
		return store.commit('m_loadCommonData', cdata)
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