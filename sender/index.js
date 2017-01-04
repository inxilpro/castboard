'use strict';

const ConnectionManager = require('./connection_manager');
const Sender = require('./sender');
const chalk = require('chalk');
const config = require('../config.json');

const manager = new ConnectionManager();

manager.on('status', (status, client) => {
	if (!status.applications) {
		return;
	}

	const appIds = status.applications.map(application => application.appId);
	const running = appIds.find(runningAppId => runningAppId === config.appId);

	if (running) {

	}

	if (!running) {
		const matches = appIds.filter(appId => config.override.indexOf(appId) !== -1);
		if (matches.length) {
			client.launch(Sender, function(err, sender) {
				if (err) {
					console.error('Error', err);
					return;
				}

				console.log('Launched app');
			});
		}
	}
});

manager.start();