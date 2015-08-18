'use strict';

import { EventEmitter } from 'events';
import { Client, DefaultMediaReceiver } from 'castv2-client';
import chalk from 'chalk';
import fetch from 'node-fetch';

export default class Projector extends EventEmitter {
	constructor(service) {
		super();

		const id = service.fullname;
		this.service = service;

		this.currentImage = 0;
		this.images = [];
		this.load();
	}

	load() {
		let url = '';
		fetch(url).then(res => {
			return res.json();
		}).then(json => {
			if (json.success) {
				this.images = json.data;
			}
		});
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
		if (!this.images || !this.images.length) {
			console.log(chalk.yellow('Waiting for images to load...'));
			return setTimeout(() => this.run(), 1000);
		}

		let client = this.client;
		client.launch(DefaultMediaReceiver, (err, player) => {
			let media = {
				contentId: '',
				contentType: 'image/jpeg',
				streamType: 'BUFFERED',
				metadata: {
					type: 0,
					metadataType: 0,
					title: ''
				}
			};

			media.contentId = '';
			media.metadata.title = '';
			player.load(media, { autoplay: true }, (err, status) => {
				console.log(status);
			});
		});
	}
}


