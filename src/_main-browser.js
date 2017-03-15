import Vue from 'vue'
import router from './vue-router.js'
import store from './vue-store.js'
import App from './vue-components/App.vue'
import request from 'superagent'
// --------------------------------------------------------------------------------
const apiUrl = require('./api-url.js');

// Getting initial page data (since page itself contains nothing)
request
	.get(apiUrl + 'commondata')
	.end((err, res) => {
		if (err || !res.body) {
			console.log('Resource "api/commondata" did not responded. Reloading page in 3 sec');
			window.setTimeout(window.location.reload, 3000)
		}
		else {
			vueInit(res)
		}
	});

function vueInit(res) {
	var vm = new Vue({
		el: '#vue-app',
		router,
		store,
		render: (h) => h(App)
	})
	vm.$store.dispatch('loadCommonData', res.body)
}

/*
	import VueCordova from 'vue-cordova';
	Vue.use(VueCordova);
	console.log(Vue.cordova);
*/