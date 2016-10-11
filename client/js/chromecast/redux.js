'use strict';

import { createAction, handleActions } from 'redux-actions';
import moment from 'moment';

/*
 * Action Constants
 */

const TICK = 'chromecast/TICK';
const NEXT_VIDEO = 'chromecast/NEXT_VIDEO';
const REPLACE_STATE = 'chromecast/REPLACE_STATE';

/*
 * Reducer
 */

const reducer = handleActions({
	/**
	 * Recalculate timing-related state properties
	 *
	 * @param state
	 * @returns {{}}
	 */
	[TICK]: state => {
		const nextState = {
			...state,
			now: moment()
		};
		
		return nextState;
	},
	
	[NEXT_VIDEO]: state => {
		let { activeSlide, slides } = state;
		
		// Progress
		activeSlide++;
		if (!slides[activeSlide]) {
			activeSlide = 0;
		}
		
		const nextState = {
			...state,
			activeSlide
		};
		
		return nextState;
	},
	
	[REPLACE_STATE]: (state, { payload }) => {
		console.log('Got', payload);
		return payload;
	}
});

/*
 * Action creators
 */

const tick = createAction(TICK);
const nextVideo = createAction(NEXT_VIDEO);
const replaceState = createAction(REPLACE_STATE);

/*
 * Exports
 */

export {
	reducer as default,
	tick,
	nextVideo,
	replaceState
};