import Vue from 'vue'
import Framework7 from 'framework7'
import Framework7Vue from 'framework7-vue'
import Framework7Theme from 'framework7/dist/css/framework7.material.min.css'
import Framework7ThemeColors from 'framework7/dist/css/framework7.material.colors.min.css'

Vue.use(Framework7Vue);

export default {
	root: '#vue-app',
	pushState: true,
	pushStateSeparator: '#',
	material: true,
	routes: [{
		path: '/about/',
		component: require('./vue-components/about.vue')
	},{
		path: '/main/',
		component: require('./vue-components/mainpage.vue')
	}]
}

/*,
material: true,
sortable: false,
swipePanel: 'left'*/