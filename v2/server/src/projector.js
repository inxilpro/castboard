'use strict';

import {EventEmitter} from 'events';
import {Client} from 'castv2';
import chalk from 'chalk';

// TODO: Should check to see if the chromecast is connected before connecting

export default class Projector extends EventEmitter {
	constructor(config, service) {
		super();

		this.appId = config.appId;
		this.service = service;
		this.currentImage = 0;
		this.images = [];

		console.log(config);
		console.log(chalk.yellow('Setting App ID to ') + chalk.blue(this.appId));
	}

	connect() {
		const host = this.service.addresses[0];
		let client = this.client = new Client();

		client.on('error', (err) => {
			client.close();
			client = null;
			this.emit('close');
		});

		client.connect(host, () => {
			console.log(chalk.yellow(`Connected to ${this.service.name}...`));
			this.run();
		});
	}

	run() {
		let client = this.client;

		const connection = client.createChannel('sender-0', 'receiver-0', 'urn:x-cast:com.google.cast.tp.connection', 'JSON');
		const heartbeat = client.createChannel('sender-0', 'receiver-0', 'urn:x-cast:com.google.cast.tp.heartbeat', 'JSON');
		const receiver = client.createChannel('sender-0', 'receiver-0', 'urn:x-cast:com.google.cast.receiver', 'JSON');

		// Open virtual connection
		connection.send({type: 'CONNECT'});

		// Send heartbeat every 5 seconds
		setInterval(function() {
			heartbeat.send({type: 'PING'});
		}, 5000);

		// Open app
		receiver.send({
			type: 'LAUNCH',
			appId: this.appId,
			requestId: 1
		});

		// Handle events
		receiver.on('message', function(data, broadcast) {
			console.log(chalk.yellow('Message: ') + JSON.stringify(data, null, 4));
		});
	}
}


