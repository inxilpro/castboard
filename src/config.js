'use strict';

import fs from 'fs';
import path from 'path';
import nconf from 'nconf';

var config;
export default function() {
	if (config) {
		return Promise.resolve(config);
	}

	return buildNconf().then(nconf => {
		config = {
			version: 1.0,
			whitelist: toArray(nconf.get('CASTBOARD_WHITELIST') || nconf.get('whitelist')),
			refresh: Number(nconf.get('CASTBOARD_REFRESH') || nconf.get('refresh')),
			port: nconf.get('CASTBOARD_PORT') || nconf.get('port')
		};
		return config;
	});
}

function toArray(input) {
	if ('string' === typeof input) {
		input = input.replace(/\s*,\s*/g, ',').split(',');
	}
	return input;
}

function buildNconf() {
	return new Promise((resolve, reject) => {
		// Load nconf
		nconf.argv();
		nconf.env();

		// Optionally load config.json
		return loadConfig().then(configData => {
			debugger;
			nconf.add('custom', {
				type: 'literal',
				store: configData
			});
			resolve(nconf);
		}, () => {
			resolve(nconf);
		});
	}).then(nconf => {
		// Set defaults
		nconf.defaults({
			'whitelist': [],
			'refresh': 60,
			'port': 8996
		});
		return nconf;
	});
}

function checkConfig(filename) {
	const opts = {
		encoding: 'utf8',
		flag: 'r'
	};

	return new Promise((resolve, reject) => {
		fs.readFile(filename, opts, (err, data) => {
			if (err) {
				return reject(err);
			}

			try {
				let parsed = JSON.parse(data);
				resolve(parsed);
			} catch (e) {
				reject(e);
			}
		});
	});
}

function loadConfig() {
	return new Promise((resolve, reject) => {
		const re = (process.platform === 'win32' ? /[\/\\]/ : /\//);
		const parts = path.resolve(__dirname, '..').split(re);
		let paths = [];
		for (let tip = parts.length - 1; tip >= 0; tip--) {
			let filename = parts.slice(0, tip + 1).concat('config.json').join(path.sep);
			paths.push(filename);
		}
		
		const next = function() {
			const filename = paths.shift();
			checkConfig(filename).then(resolve).catch(e => {
				if (!paths.length) {
					return reject(new Error('No configuration file found.'));
				}
				next();
			});
		};

		next();
	});
}

