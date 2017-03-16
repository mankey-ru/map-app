import Vue from 'vue'
import router from './vue-router.js'
import store from './vue-store.js'
import App from './vue-components/App.vue'
// --------------------------------------------------------------------------------
new Vue({
	el: '#vue-app',
	router,
	store,
	render: (h) => h(App),
	mounted: () => {
		store.dispatch('loadCommonData')
	}
})