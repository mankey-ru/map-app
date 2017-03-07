import start from './vue-components/start.vue';
import event from './vue-components/event.vue';
import user_profile from './vue-components/user-profile.vue';
import user_register from './vue-components/user-register.vue';
import mapGoogle from './vue-components/map-google.vue';
import mapMapzen from './vue-components/map-mapzen.vue';

export default [
	// Профайлы
	{
		name: 'user-profile-current',
		path: '/user-profile',
		component: user_profile
	}, {
		name: 'user-profile-any',
		path: '/user-profile/:user_id',
		component: user_profile
	},{
		name: 'user-register',
		path: '/register',
		component: user_register
	},
	{
		path: '/start',
		name: 'start',
		alias: '/',
		component: start
	},
	{
		path: '/map-google',
		name: 'map-google',
		component: mapGoogle
	},
	{
		path: '/map-mapzen',
		name: 'map-mapzen',
		component: mapMapzen
	},
	{
		path: '/event/:event_id',
		name: 'event',
		component: event
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
]