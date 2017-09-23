import Vue from 'vue'
import store from './vue-store.js'
import router from './vue-router.js'
import App from './vue-components/App.vue'

import Vuelidate from 'vuelidate'
Vue.use(Vuelidate)

import VueChe from 'vue-che'
Vue.use(VueChe, {
	errorClass: 'has-error',
	lang: 'ru'
})

import Quasar from 'quasar'
Vue.use(Quasar)

require(`quasar/dist/quasar.${__THEME}.css`)
if (__THEME === 'mat') {
	require('quasar-extras/roboto-font')
}
import 'quasar-extras/material-icons'
import 'quasar-extras/fontawesome'
// import 'quasar-extras/ionicons'
// import 'quasar-extras/animate'

store.dispatch('a_GLOBAL_SYNCRONOUS_DATA');

Quasar.start(() => {
	/* eslint-disable no-new */
	new Vue({
		el: '#vue-app',
		router,
		store,
		render: (h) => h(App)
	})
})