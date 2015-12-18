import * as actions from '../constants/actionTypes';
import createReducer from '../utils/reducerCreator';
import * as loginStatus from '../constants/clientLoginStatus'
import * as connectionStatus from '../constants/clientConnectionStatus'

const initialState = {
	ready: false,
	loginStatus: loginStatus.NONE,
	connectionStatus: connectionStatus.NONE
};

const actionHandlers = {
	[actions.CLIENT_INITED](state){
		return {
			...state,
			ready:true
		}
	},

	[actions.CLIENT_LOGINING](state){
		return {
			...state,
			loginStatus: loginStatus.LOGINING
		}
	},

	[actions.CLIENT_AUTH_RESULT](state, action){
		return {
			...state,
			loginStatus: action.result.result ? loginStatus.LOGIN_SUCCESS : loginStatus.LOGIN_FAILED
		}
	},

	[actions.CLIENT_CONNECTING](state){
		return {
			...state,
			connectionStatus: connectionStatus.CONNECTING
		}
	},

	[actions.CLIENT_CONNECTED](state){
		return {
			...state,
			connectionStatus: connectionStatus.CONNECTED
		}
	},

	[actions.CLIENT_CONNECTION_CLOSED](state){
		return {
			...state,
			connectionStatus: connectionStatus.DISCONNECTED
		}
	},

	[actions.CLIENT_CONNECTION_FAILED](state){
		return {
			...state,
			connectionStatus: connectionStatus.DISCONNECTED
		}
	}
}

export default createReducer(initialState, actionHandlers);
