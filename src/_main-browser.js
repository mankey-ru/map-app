import Vue from 'vue'
import store from './vue-store.js'
import framework7 from './vue-f7.js'
import App from './vue-components/App.vue'
// --------------------------------------------------------------------------------
new Vue({
	el: '#vue-app',
	framework7,
	store,
	render: (h) => h(App), //     same as:  «   components:{app: App},template:'<app/>'   »
	mounted: () => {
		store.dispatch('loadCommonData')
	}
})