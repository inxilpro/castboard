'use strict';

import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import configureStore from './store';
import { replaceState } from './redux';
import Screen from './Screen';

const store = configureStore(window.__PRELOADED_STATE__);

// FIXME:
function fetchLiveData() {
	fetch('').then(res => {
		return res.json();
	}).then(json => {
		store.dispatch(replaceState(json));
	});
}

setInterval(fetchLiveData, 30000);
fetchLiveData();

// Render
render((
	<Provider store={store}>
		<Screen />
	</Provider>
), document.getElementById('app'));