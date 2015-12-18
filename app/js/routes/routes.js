import React from 'react';
import { Route } from 'react-router';
import { createRoutes } from 'react-router/lib/RouteUtils';

import {App, Login, CallDialer, Home}  from '../containers'
import NotFound from '../components/NotFound.jsx'

const routes = (<Route component={App}>
	<Route path="/" component={Home}/>
	<Route path="/login" component={Login}/>

	<Route loginRequired>
		<Route path="/phone" default component={CallDialer}/>
	</Route>

	<Route path="*" component={NotFound}/>
	<Route path="notFount" component={NotFound}/>
</Route>);

const createdRoutes = createRoutes(routes);
let defaultRoute;
getDefaultRoute(createdRoutes);

export default createdRoutes;

export {defaultRoute};

function getDefaultRoute(routes) {
	if (Array.isArray(routes)) {
		return routes.filter((route) => getDefaultRoute(route))[0];
	}
	if (routes.childRoutes) {
		return getDefaultRoute(routes.childRoutes);
	}

	if (routes.indexRoute) {
		return getDefaultRoute(routes.indexRoute);
	}

	if (routes.default){
		defaultRoute = routes;
	}

}