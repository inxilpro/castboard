'use strict';

const cast = require('castv2-client');
const RequestResponseController = cast.RequestResponseController;
const Client = cast.Client;

const chalk = require('chalk');

class Sender extends RequestResponseController {
	constructor(client, sourceId, destinationId, namespace) {
		/*
		const client = new Client();
		const sourceId = 'client-' + Math.random();
		const destinationId = 'receiver-0';;
		const namespace = 'urn:x-cast:org.indyhall';
		*/

		super(client, sourceId, destinationId, namespace);

		this.once('close', () => this.stop());
	}
}

// Static props
Sender.APP_ID = 'CA719434';

module.exports = Sender;