'use strict';

import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import moment from 'moment';
import * as actions from './redux';

function mapStateToProps(state) {
	return {
		...state
	};
}

function mapDispatchToProps(dispatch) {
	return {
		actions: bindActionCreators(actions, dispatch)
	};
}

// Core Exam component
class Screen extends React.Component {
	
	timer = null;
	
	componentDidMount() {
		this.timer = setInterval(() => this.tick(), 1000);
	}
	
	componentWillUnmount() {
		clearInterval(this.timer);
	}
	
	render() {
		// TODO: Use websockets to reload slides & notice
		
		let { slides, activeSlide, now } = this.props;
		
		if (!now) {
			now = moment();
		}
		
		return (
			<div>
				<div className="logo"></div>
				<video src={ slides[activeSlide] } autoPlay onEnded={ ::this.onEnded }></video>
				{ this.renderNotice() }
				<span className="time">
					{ now.format('h:mma') }
				</span>
			</div>
		);
	}
	
	renderNotice() {
		const { notice } = this.props;
		
		if (!notice) {
			return (
				<div className="notice off"></div>
			);
		}
		
		return (
			<div className="notice">
				{ notice }
			</div>
		);
	}
	
	tick() {
		this.props.actions.tick();
	}
	
	onEnded() {
		this.props.actions.nextVideo();
	}
}

// Export connected class
export default connect(mapStateToProps, mapDispatchToProps)(Screen);