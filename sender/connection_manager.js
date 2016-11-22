'use strict';

// const util = require('util');
const EventEmitter = require('events');
const Client = require('castv2-client').Client;
const Browser = require('./browser');
const chalk = require('chalk');

class ConnectionManager extends EventEmitter {
	constructor() {
		super();

		this.devices = {};
		this.updateInterval = null;
		this.browser = new Browser();

		this.browser.on('host', device => {
			const existing = (this.devices[device.name] ? this.devices[device.name] : {});
			this.devices[device.name] = Object.assign({}, existing, device);
			this.update();
		});
	}

	start() {
		this.browser.start();
		this.updateInterval = setInterval(() => {
			this.update();
		}, 30000);
	}

	stop() {
		this.browser.stop();
		clearInterval(this.updateInterval);
	}

	update() {
		Object.keys(this.devices).forEach(name => {
			if (!this.devices[name].client) {
				this.emit('device', this.devices[name]);
				this.connect(this.devices[name]);
			}
		});
	}

	connect(device) {
		const client = device.client = new Client();
		client.connect(device.host, () => {
			this.emit('connect', client, device);
			this.pollStatus(client);
			const pollInterval = setInterval(() => this.pollStatus(client), 10000);
			client.on('error', function(err) {
				console.error(chalk.bgRed.white('Client Error:') + "\n" + chalk.red(JSON.stringify(err, null, 2)));
				client.close();
				device.client = null;
				clearInterval(pollInterval);
			});
		});
	}

	pollStatus(client) {
		client.getStatus((err, status) => {
			if (err) {
				console.error('Status Error:', status);
				console.error(chalk.bgRed.white('Status Error:') + "\n" + chalk.red(JSON.stringify(err, null, 2)));
				return;
			}
			this.handleStatus(status, client);
		});
	}

	handleStatus(status, client) {
		this.emit('status', status, client);
	}
}

module.exports = ConnectionManager;
