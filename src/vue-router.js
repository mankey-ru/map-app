import Vue from 'vue'
import VueRouter from 'vue-router'

import mainpage from './vue-components/mainpage.vue';
import eventNew from './vue-components/event-new.vue';
import eventCard from './vue-components/event-card.vue';
import eventList from './vue-components/event-list.vue';
import user_profile from './vue-components/user-profile.vue';
import user_register from './vue-components/user-register.vue';
import user_login from './vue-components/user-login.vue';
import placeList from './vue-components/place-list.vue';
import page_how from './vue-components/page-how.vue';
import page_about from './vue-components/page-about.vue';
import pwdrestore from './vue-components/user-pwd-restore.vue';

const routes = [{
		path: '/mainpage',
		alias: '/',
		name: 'mainpage',
		component: mainpage,
		meta: {
			fullscreen: true,
			title: 'Main Page',
			noToolbar: true
		}
	}, {
		path: '/event/new',
		name: 'event-new',
		component: eventNew,
		meta: {
			needAuth: true,
			title: 'Новое событие'
		}
	}, {
		path: '/event/card/:event_id',
		name: 'event-card',
		component: eventCard,
		meta: {
			title: 'Мероприятие'
		}
	}, {
		path: '/event/list/',
		name: 'event-list',
		component: eventList,
		meta: {
			title: 'Список мероприятий'
		}
	}, {
		name: 'user-profile-current',
		path: '/user-profile',
		component: user_profile,
		meta: {
			title: 'Ваш профиль'
		}
	}, {
		name: 'place-list',
		path: '/place-list',
		component: placeList,
		meta: {
			title: 'Мои места'
		}
	}, {
		name: 'user-profile-any',
		path: '/user-profile/:user_id',
		component: user_profile,
		meta: {
			title: 'Профиль пользователя'
		}
	}, {
		name: 'user-register',
		path: '/register',
		component: user_register,
		meta: {
			title: 'Регистрация'
		}
	}, {
		name: 'user-login',
		path: '/login',
		component: user_login,
		meta: {
			title: 'Вход'
		}
	}, {
		path: '/about',
		name: 'page-about',
		component: page_about,
		meta: {
			title: 'О нас'
		}
	}, {
		path: '/how-it-works',
		name: 'page-how',
		component: page_how,
		meta: {
			title: 'Как это работает'
		}
	},, {
		path: '/pwdrestore',
		name: 'pwdrestore',
		component: pwdrestore,
		meta: {
			title: 'Восстановление пароля'
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

Vue.use(VueRouter);
var router = new VueRouter({
	routes
});

// https://router.vuejs.org/en/advanced/navigation-guards.html
router.beforeEach((to, from, next) => {
	if (to.meta.fullscreen !== from.meta.fullscreen) {
		_toggleClass(document.body, '__fullscreen', to.meta.fullscreen);
	}
	var store = this.a.app.$store;
	next()
	return
	if (store && !store.getters.currentUser && to.meta.needAuth === true) {
		console.warn('vue-router.js: this page needs auth')
		next({
			name: 'user-login'
		})
	}
	else {
		next()
	}
})
export default router;



function _toggleClass(el, theClass, boo) { // classList.toggle second argument support isnt good so...
	var hasClass = el.className.indexOf(theClass) !== -1;
	var conditionToRemove = typeof boo === 'undefined' ? hasClass : hasClass && !boo;
	var conditionToAdd = typeof boo === 'undefined' ? !hasClass : !hasClass && boo;
	if (conditionToRemove) {
		el.className = el.className.split(theClass).join('')
	}
	else if (conditionToAdd) {
		el.className += ' ' + theClass;
	}
}