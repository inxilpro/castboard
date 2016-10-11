'use strict';

import {EventEmitter} from 'events';
import mdns from 'mdns';
import chalk from 'chalk';

export default class Locator extends EventEmitter {
	constructor(config) {
		super();

		this.whitelist = config.whitelist;
		this.blacklist = config.blacklist;
		this.refreshRate = config.refresh;
		this.projectors = {};
		this.services = {};
		this.scanning = false;
	}

	attach(serviceId, projector) {
		if (this.projectors[serviceId]) {
			throw new Exception('Already attached.');
		}

		this.projectors[serviceId] = projector;

		// Re-emit 'up' if a client closes for some reason
		projector.on('close', () => {
			this.projectors[serviceId] = null;
			if (this.services[serviceId]) {
				this.up(this.services[serviceId]);
			}
		});
	}

	up(service) {
		const id = service.fullname;

		if (this.whitelist.length && -1 === this.whitelist.indexOf(service.addresses[0])) {
			console.log(`Skipping ${service.addresses[0]} because not on whitelist.`);
			return;
		}

		// TODO: Blacklist

		if (!this.services[id]) {
			console.log('%s %s at %s:%s', chalk.bgWhite.black.bold('Up:'), chalk.bold(service.name), chalk.green(service.addresses[0]), chalk.blue(service.port));
			this.services[id] = service;
			this.emit('up', service);
		}
	}

	down(service) {
		const id = service.fullname;
		this.projectors[id] = null;
		this.services[id] = false;
		this.emit('down', service);
	}

	scan() {
		if (this.scanning) {
			return;
		}

		this.scanning = true;
		console.log(chalk.yellow('Starting scan for chromecasts...'));

		const browser = mdns.createBrowser(mdns.tcp('googlecast'));

		let debounce;
		const done = () => {
			clearTimeout(debounce);
			setTimeout(() => {
				browser.stop();
				this.scanning = false;
				setTimeout(() => {
					this.scan()
				}, this.refreshRate * 1000);
			}, 5000);
		};

		browser.on('serviceUp', service => {
			this.up(service);
			done();
		});

		browser.on('serviceDown', service => {
			this.down(service);
		});

		browser.on('error', err => {
			console.log(chalk.bgRed.white.bold('Error:'));
			console.log(chalk.red(err.message));
			console.trace(err);
		});

		browser.start();
	}
}