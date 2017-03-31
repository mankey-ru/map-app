import Vue from 'vue'
import router from './vue-router.js'
import store from './vue-store.js'
import App from './vue-components/App.vue'
import Quasar from 'quasar-framework'
Vue.use(Quasar)
import Vuelidate from 'vuelidate'
Vue.use(Vuelidate)


// for some unclear reason
// this code:
// 		var THEME = 'mat';
// 		require(`../node_modules/quasar-framework/dist/quasar.mat.standalone.min.css`)
// produces both quasar.mat.standalone.min.css and quasar.ios.standalone.min.css inside the bundle
// what the fuck
require(`quasar-framework/dist/quasar.mat.standalone.min.css`)
require(`mdi/css/materialdesignicons.min.css`) // it aliased in webpack config to use instead of google's mdi


Quasar.start(() => {
	/* eslint-disable no-new */
	new Vue({
		el: '#vue-app',
		router,
		store,
		render: (h) => h(App),
		mounted: () => {
			store.dispatch('loadCommonData')
		}
	})
})