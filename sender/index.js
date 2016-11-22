'use strict';

const Client = require('castv2-client').Client;
const ConnectionManager = require('./connection_manager');
const Sender = require('./sender');
const chalk = require('chalk');

const appId = Sender.APP_ID;
const overrideApps = ['E8C28D3C'];

const manager = new ConnectionManager();

manager.on('status', (status, client) => {
	// Set volume
	/*
	if (status.volume && !status.volume.muted) {
		client.setVolume({ muted: true }, (err, volume) => {
			if (err) {
				console.error('Volume error', err);
				return;
			}
			console.log('Set volume to ', volume);
		});
	}
	*/

	// Launch app
	if (status.applications) {
		const apps = status.applications.map(application => application.appId);
		const running = apps.find(runningAppId => runningAppId === appId);

		if (!running) {
			const matches = apps.filter(appId => overrideApps.indexOf(appId) !== -1);
			if (matches.length) {
				client.launch(Sender, function(err, player) {
					console.log('Launched app');
					if (err) {
						console.error('Error', err);
						// FIXME
					}
				});
			}
		}
	}
});

manager.start();