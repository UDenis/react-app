function defaultHandler(state, action){
	return state;
}

export default function createReducer(initialState, actionHandlers) {
	return function reducer(state = initialState, action) {
		const handler = actionHandlers[action.type] || actionHandlers['default'] || defaultHandler;
		return handler(state, action);
	}
}