import * as actions from '../constants/actionTypes';

import CloudPhoneClient from '../client/CloudPhoneClient'
import Call from '../client/Call'
import {normalizePhoneNumber} from '../utils/normalizePhoneNumber'

const cloudPhoneClient = new CloudPhoneClient({
	normalizePhoneNumber
});

export function call(phone, cb) {
	return (dispatch, getState) => {
		dispatch({
			type: actions.CALLING
		});

		const call = cloudPhoneClient.call({phone});

		call.addListener(Call.Events.Connected, (ev)=> {
			dispatch({
				type: actions.CALL_CONNECTED,
				call
			});
		});

		call.addListener(Call.Events.Disconnected, (ev)=> {
			dispatch({
				type: actions.CALL_DISCONNECTED,
				call
			});
		});

		call.addListener(Call.Events.Failed, (ev)=> {
			dispatch({
				type: actions.CALL_Failed,
				call
			});
		});
	}
}

export function rejectCall(call){
	return (dispatch, getState) => {
		call.reject()
	}
}

export function initPhone(options) {
	return (dispatch, getState)=> {
		cloudPhoneClient.addListener(CloudPhoneClient.Events.SDKReady, ()=> {
			dispatch({
				type: actions.CLIENT_INITED
			});
			cloudPhoneClient.connect();
		});

		cloudPhoneClient.addListener(CloudPhoneClient.Events.AuthResult, (result)=> {
			dispatch({
				type: actions.CLIENT_AUTH_RESULT,
				result
			});
		});

		cloudPhoneClient.addListener(CloudPhoneClient.Events.Connecting, ()=> {
			dispatch({
				type: actions.CLIENT_CONNECTING
			});
		});

		cloudPhoneClient.addListener(CloudPhoneClient.Events.ConnectionEstablished, ()=> {
			dispatch({
				type: actions.CLIENT_CONNECTED
			});
		});

		cloudPhoneClient.addListener(CloudPhoneClient.Events.ConnectionFailed, ()=> {
			dispatch({
				type: actions.CLIENT_CONNECTION_FAILED
			});
		});

		cloudPhoneClient.addListener(CloudPhoneClient.Events.ConnectionClosed, ()=> {
			dispatch({
				type: actions.CLIENT_CONNECTION_CLOSED
			});
		});

		cloudPhoneClient.init(options);
	}
}

export function login(login, password, cb) {
	return (dispatch, getState)=> {
		cloudPhoneClient.login({login, password});
		dispatch({type: actions.CLIENT_LOGINING});
		cloudPhoneClient.once(CloudPhoneClient.Events.AuthResult, cb);
	}
}