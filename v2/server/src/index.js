'use strict';

import chalk from 'chalk';
import loadConfig from './config';
import Locator from './locator';
import Projector from './projector';

loadConfig().then(config => {
	// Start server
	// FIXME:
	// const server = new Server(config);
	// server.listen();

	// Set up locator & scan
	const locator = new Locator(config);
	locator.on('up', service => {
		try {
			const id = service.fullname;
			let projector = new Projector(config, service);
			locator.attach(id, projector);
			projector.connect();
		} catch (e) {
			console.log(chalk.blue(service.name) + ' already has a projector attached ("' + e.message + '").');
		}
	});
	locator.scan();
}).catch(e => {
	console.error(chalk.red('Configuration error: ' + e.message));
	process.exit(1);
});