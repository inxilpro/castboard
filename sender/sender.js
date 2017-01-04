'use strict';

const cast = require('castv2-client');
const RequestResponseController = cast.RequestResponseController;
const config = require('../config.json');

class Sender extends RequestResponseController {
	constructor(client, sourceId, destinationId, namespace) {
		super(client, sourceId, destinationId, namespace);
		this.once('close', () => this.stop());
	}
}

// Static props
Sender.APP_ID = config.appId;

module.exports = Sender;