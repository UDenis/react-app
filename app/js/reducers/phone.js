import * as actions from '../constants/actionTypes';
import createReducer from '../utils/reducerCreator';
import * as callingStatus from '../constants/clientCallingStatus'

const initialState = {
	callingStatus: callingStatus.NONE,
	lastCall: null
};

const actionHandlers = {

	[actions.CALLING](state, action){
		return {
			...state,
			callingStatus:callingStatus.CALLING,
			lastCall: action.call
		}
	},

	[actions.CALL_CONNECTED](state, action){
		return {
			...state,
			callingStatus:callingStatus.CALL_CONNECTED,
			lastCall: action.call
		}
	},

	[actions.CALL_DISCONNECTED](state, action){
		return {
			...state,
			callingStatus:callingStatus.NONE,
			lastCall: null
		}
	},

	[actions.CALL_Failed](state, action){
		return {
			...state,
			callingStatus:callingStatus.NONE,
			lastCall: null
		}
	}

}

export default createReducer(initialState, actionHandlers);
