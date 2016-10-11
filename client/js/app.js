'use strict';

import '../chromecast';

if ('production' === process.env.NODE_ENV) {
	window.addEventListener('load', function() {
		if (!cast) {
			console.error('No chromecast SDK found.');
			return;
		}
		
		const appId = 'AD2B7C25';
		const namespace = 'urn:x-cast:org.nachi';
		const castReceiverManager = cast.receiver.CastReceiverManager.getInstance();
		
		// On Ready
		castReceiverManager.onReady = function(event) {
			console.log('Received Ready event: ' + JSON.stringify(event.data));
			castReceiverManager.setApplicationState("Application ready...");
		};
		
		// Sender Connected
		castReceiverManager.onSenderConnected = function(event) {
			console.log('Received Sender Connected event: ' + event.data);
			console.log(castReceiverManager.getSender(event.data).userAgent);
		};
		
		// Sender Disconnected
		castReceiverManager.onSenderDisconnected = function(event) {
			console.log('Received Sender Disconnected event: ' + event.data);
			if (0 === castReceiverManager.getSenders().length) {
				window.close();
			}
		};
		
		// Volume Changed
		castReceiverManager.onSystemVolumeChanged = function(event) {
			console.log('Received System Volume Changed event: ' + event.data['level'] + ' ' + event.data['muted']);
		};
		
		const messageBus = castReceiverManager.getCastMessageBus(namespace);
		
		// Message Bus Message
		messageBus.onMessage = function(event) {
			console.log('Message [' + event.senderId + ']: ' + event.data);
			messageBus.send(event.senderId, event.data);
			castReceiverManager.setApplicationState(event.data);
		};
		
		// Start
		castReceiverManager.start({
			statusText: "Application starting..."
		});
	});
}


