import React, { Component,  } from 'react';
import { combineReducers, createStore, applyMiddleware, compose } from 'redux';
import { Provider } from 'react-redux';
import thunkMiddleware from 'redux-thunk';
import { Router } from 'react-router';
import {reduxReactRouter, ReduxRouter, routerStateReducer} from 'redux-router';

import createHistory from 'history/lib/createHistory'

import {getRoutes, getRoutesHook} from '../routes'
import routes from '../routes/routes'
import * as reducers from '../reducers';
import {initPhone} from '../actions/phone';

let createStoreWithMiddleware = applyMiddleware(thunkMiddleware)(createStore);
createStoreWithMiddleware = reduxReactRouter({getRoutes:getRoutesHook(routes), createHistory})(createStoreWithMiddleware);

const store = createStoreWithMiddleware(combineReducers({
    ...reducers,
    router: routerStateReducer}));

store.dispatch(initPhone({
    appName: 'queue',
    accName: 'modulbank'
}));

export default class Root extends Component {
    render() {
        return (
            <Provider store={store}>
                <ReduxRouter routes={getRoutes(routes, store)}/>
            </Provider>
        );
    }
}
