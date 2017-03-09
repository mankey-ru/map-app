import start from './vue-components/start.vue';

import eventNew from './vue-components/event-new.vue';
import eventCard from './vue-components/event-card.vue';

import user_profile from './vue-components/user-profile.vue';
import user_register from './vue-components/user-register.vue';
import mapGoogle from './vue-components/map-google.vue';
import mapMapzen from './vue-components/map-mapzen.vue';
import mapMapzenV0 from './vue-components/map-mapzen-v0.vue';
import mapOsm from './vue-components/map-osm.vue';

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
		component: start
	},
	{
		path: '/map-google',
		alias: '/',
		name: 'map-google',
		component: mapGoogle
	},
	{
		path: '/map-mapzen',
		name: 'map-mapzen',
		component: mapMapzen
	},

	{
		path: '/map-mapzen-v0',
		name: 'map-mapzen-v0',
		component: mapMapzenV0
	},
	{
		path: '/map-osm',
		name: 'map-osm',
		component: mapOsm
	},
	{
		path: '/event/new',
		name: 'event-new',
		component: eventNew
	},
	{
		path: '/event/card/:event_id',
		name: 'event-card',
		component: eventCard
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