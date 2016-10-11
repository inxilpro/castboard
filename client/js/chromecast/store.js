'use strict';

import { createStore, applyMiddleware, compose } from 'redux';
import { persistState } from 'redux-devtools';
import reducer from './redux';

export default function configureStore(initialState = {}) {
	let middleware = applyMiddleware();
	let enhancer;
	
	if (process.env.NODE_ENV !== 'production') {
		let middlewares = [require('redux-immutable-state-invariant')()]
		middleware = applyMiddleware(...middlewares);
		
		let getDebugSessionKey = function () {
			// By default we try to read the key from ?debug_session=<key> in the address bar
			const matches = window.location.href.match(/[?&]debug_session=([^&]+)\b/);
			return (matches && matches.length) ? matches[1] : null;
		};
		
		enhancer = compose(
			middleware,
			window.devToolsExtension ? window.devToolsExtension() : noop => noop,
			persistState(getDebugSessionKey())
		);
	} else {
		enhancer = compose(middleware);
	}
	
	const store = createStore(reducer, initialState, enhancer);
	
	// Enable Webpack hot module replacement for reducers
	if (module.hot) {
		module.hot.accept('./redux', () =>
			store.replaceReducer(require('./redux').default)
		);
	}
	
	return store;
}