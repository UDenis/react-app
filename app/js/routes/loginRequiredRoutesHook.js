import {LOGIN_SUCCESS} from '../constants/clientLoginStatus'

export function loginRequiredRoutesHook(routes) {
	return (store) => getRoutes(routes, store);
}

export function getRoutes(routes, store) {
	return addLoginRequiredHook(routes, store, getRequireLoginHook(store));
}

function addLoginRequiredHook(routes, store, requireLogin) {
	if (Array.isArray(routes)) {
		return routes.map((route) => addLoginRequiredHook(route, store, requireLogin));
	}

	const onEnter = routes.onEnter || noop;
	const loginRequired = routes.loginRequired;

	if (loginRequired) {
		routes.onEnter = function loginRequiredOnEnter(...args) {
			try {
				requireLogin.apply(null, args);
			} catch (err) {
				if (onEnter.length === 3) {
					args[2]();
				}

				// There's no store yet so ignore the hook
				return;
			}

			onEnter.apply(null, args);
		};
	}

	if (routes.childRoutes) {
		addLoginRequiredHook(routes.childRoutes, store, requireLogin);
	}

	if (routes.indexRoute) {
		addLoginRequiredHook(routes.indexRoute, store, requireLogin);
	}

	return routes;
}

function getRequireLoginHook(store) {
	return function requireLogin(nextState, transition) {
		const { client: { loginStatus }} = store.getState();

		if (loginStatus !== LOGIN_SUCCESS) {
			transition(null, '/login');
		}
	};
}

function noop() {
}