'use strict';

const EventEmitter = require('events');
const mdns = require('multicast-dns');
const chalk = require('chalk');

class Browser extends EventEmitter {
	constructor() {
		super();
		
		this.devices = {};
		this.watchInterval = null;
		this.mdns = mdns();
		
		// Set up event listeners
		this.mdns.on('response', response => this.handleMdnsResponse(response));
	}
	
	start() {
		this.query();
		this.watchInterval = setInterval(() => this.query(), 60000);
	}
	
	stop() {
		clearInterval(this.watchInterval);
	}
	
	query() {
		console.log(chalk.green('Querying network for Chromecast devices...'));
		this.mdns.query('_googlecast._tcp.local', 'PTR');
	}
	
	handleMdnsResponse(response) {
		response.answers.map(answer => this.handleAnswer(answer));
		response.additionals.map(answer => this.handleAnswer(answer));
	}
	
	handleAnswer(answer) {
		let name;
		switch (answer.type) {
			case 'PTR':
				name = answer.data.replace('._googlecast._tcp.local', '');
				this.device(name, {chromecast: true});
				break;
			
			case 'A':
				name = answer.name.replace('.local', '');
				this.device(name, {host: answer.data});
				break;
		}
	}
	
	device(name, data) {
		if (!this.devices[name]) {
			this.devices[name] = {
				name: name,
				chromecast: false,
				host: null
			};
		}
		
		if (data) {
			const existing = this.devices[name];
			const next = Object.assign({}, existing, data);
			
			if (existing.chromecast !== next.chromecast && next.host) {
				this.emit('host', next);
			}
			if (existing.host !== next.host && next.chromecast) {
				this.emit('host', next);
			}
			
			this.devices[name] = next;
		}
		
		return this.devices[name];
	}
}

module.exports = Browser;