'use strict';

import { Client, DefaultMediaReceiver } from 'castv2-client';

import chalk from 'chalk';

var browser, config;
export default function(config) {
	start();
	return browser;
}

var running = false;
function start() {
	if (!running) {
		console.log(chalk.yellow('Searching for new services...'));

		

		browser.on('serviceUp', function(service) {
			console.log(chalk.bgWhite.black.bold('Service Up:'));
			console.log('%s at %s:%s', chalk.bold(service.name), chalk.green(service.addresses[0]), chalk.blue(service.port));
			
		});

		browser.on('serviceDown', function(service) {
			console.log(chalk.bgWhite.black.bold('Service Down:'));
			console.log('%s at %s:%s', chalk.bold(service.name), chalk.green(service.addresses[0]), chalk.blue(service.port))
			const id = service.fullname;
		});

		browser.on('error', function(err) {
			console.log(chalk.bgRed.white.bold('Error:'));
			console.log(JSON.stringify(err, null, 2));
		});

		browser.start();
	}
	running = true;
}

function stop() {
	if (running) {
		console.log(chalk.yellow('Shutting down multicast locator...'));
		browser.stop();
	}
	running = false;
}

var willSleep;
function sleep(refresh) {
	clearTimeout(willSleep);
	willSleep = setTimeout(() => {
		stop();
		setTimeout(() =>{
			start();
		}, refresh * 1000);
	}, 5000);
}