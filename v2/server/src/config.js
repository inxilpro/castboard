'use strict';

import fs from 'fs';
import path from 'path';
import nconf from 'nconf';

var config;
export default function() {
	if (config) {
		return Promise.resolve(config);
	}

	return new Promise((resolve, reject) => {
		nconf
			.argv()
			.file(path.resolve(__dirname, '..', '..', 'config.json'))
			.defaults({
				"whitelist": [],
				"blacklist": [],
				"refresh": 60,
				"port": 4994,
				"appId": null
			});

		config = {
			whitelist: nconf.get('whitelist'),
			blacklist: nconf.get('blacklist'),
			refresh: nconf.get('refresh'),
			port: nconf.get('port'),
			appId: nconf.get('appId')
		};

		if (!config.appId || "" === config.appId) {
			return reject('No app ID configured.');
		}

		resolve(config);
	});
}