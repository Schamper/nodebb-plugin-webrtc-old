define(function() {
	var Config = {
		sockets: {
			getConfig: 'modules.chats.webrtc.getConfig'
		},
		dataKeys: {
			room: 'webrtc-room',
			equiped: 'webrtc-equiped',
			state: 'webrtc-state',
			easyrtcid: 'webrtc-id'
		},
		selectors: {
			button: {
				call: '#webrtc-call-btn',
				answer: '#webrtc-answer-btn',
				decline: '#webrtc-decline-btn',
				endCall: '#webrtc-endcall-btn'
			},
			container: {
				answerButtons: '#webrtc-answer-button-container',
				endCallButton: '#webrtc-endcall-button-container',
				videoPanel: '#webrtc-video-panel',
				videoThem: '#webrtc-them',
				videoMe: '#webrtc-me'
			}
		},
		roomPrefix: 'chat-',
		appName: 'nodebb_chat_webrtc',
		vars: {

		}
	}

	return function(Plugin) {
		Plugin.config = Config;
	};
});