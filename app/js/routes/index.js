import {loginRequiredRoutesHook, getRoutes as _getRoutes} from './loginRequiredRoutesHook';
import safeRoutesHook from './safeRoutesHook';

export function getRoutesHook(routes) {
	return (store)=> {
		let finalRoutes = loginRequiredRoutesHook(routes)(store);
		return safeRoutesHook(finalRoutes)(store);
	}
}

export function getRoutes(routes, store){
	return _getRoutes(routes, store)
}


