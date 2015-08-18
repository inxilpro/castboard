'use strict';

import http from 'http';
import https from 'https';
import fs from 'fs';
import chalk from 'chalk';

export default class Server {
	constructor(config) {
		this.port = config.port;
		
		// Try SSL
		if (config.ssl && config.ssl.key && config.ssl.cert) {
			try {
				this.server = https.createServer({
					key: fs.readFileSync(config.ssl.key),
					cert: fs.readFileSync(config.ssl.cert)
				}, this.request);
			} catch (err) {
				console.error(chalk.red(`Error loading HTTPS key/cert: ${err.message}`));
			}
		}

		if (!this.server) {
			this.server = http.createServer(this.request);
		}
	}

	listen() {
		this.server.listen(this.port, () => {
			console.log(chalk.yellow('Server listening on port ') + chalk.blue(this.port));
		});
	}

	request(req, res) {
		res.writeHead(200);
		res.end("hello world\n");
	}
}