import Vue from 'vue'
import VueRouter from 'vue-router'

import start from './vue-components/start.vue';
import mainpage from './vue-components/mainpage.vue';
import eventNew from './vue-components/event-new.vue';
import eventCard from './vue-components/event-card.vue';
import eventList from './vue-components/event-list.vue';
import user_profile from './vue-components/user-profile.vue';
import user_register from './vue-components/user-register.vue';
import user_login from './vue-components/user-login.vue';

const routes = [
	// Профайлы
	{
		name: 'user-profile-current',
		path: '/user-profile',
		component: user_profile,
		meta: {
			showHeader: true
		}
	}, {
		name: 'user-profile-any',
		path: '/user-profile/:user_id',
		component: user_profile
	}, {
		name: 'user-register',
		path: '/register',
		component: user_register
	}, {
		name: 'user-login',
		path: '/login',
		component: user_login
	}, {
		path: '/start',
		name: 'start',
		component: start
	}, {
		path: '/mainpage',
		alias: '/',
		name: 'mainpage',
		component: mainpage
	}, {
		path: '/event/new',
		name: 'event-new',
		component: eventNew,
		meta: {
			showHeader: true
		}
	}, {
		path: '/event/card/:event_id',
		name: 'event-card',
		component: eventCard,
		meta: {
			showHeader: true
		}
	}, {
		path: '/event/list/',
		name: 'event-list',
		component: eventList,
		meta: {
			showHeader: true
		}
	},
	// 404
	{
		path: '*',
		_hidden: true,
		component: {
			template: `
			<h1 class="text-center"><br/><br/><br/><br/>Ой-вэй, страница не найдена</h1>
			`
		}
	}
];



// -------------------------------------------------------------------------------
Vue.use(VueRouter);
export default new VueRouter({
	routes
});