define(function() {
	var p;
	var Actions = {
		load: {
			register: function() {
				$('body').off('focus.webrtc').on('focus.webrtc', '#chat-message-input', this.handle);
			},
			handle: function(e) {
				var modal = $(e.target).parents('.chat-modal');
				var isEquipped = modal.data(p.config.dataKeys.equiped);
				if (!isEquipped) {
					modal.data(p.config.dataKeys.equiped, true);
					p.base.prepareModal(modal);
				}
			}
		},
		close: {
			register: function(modal) {
				modal.find('#chat-close-btn').off('click').on('click', function() {
					Actions.close.handle(modal);
				});
			},
			handle: function(modal) {
				p.base.leaveRoom(modal);
			}
		},
		call: {
			register: function(modal) {
				modal.find(p.config.selectors.button.call).off('click.webrtc').on('click.webrtc', function(e) {
					Actions.call.handle(modal);
				});
			},
			handle: function(modal) {
				easyrtc.initMediaSource(function() {
					easyrtc.setVideoObjectSrc(modal.find(p.config.selectors.container.videoMe).get(0), easyrtc.getLocalStream());

					p.utils.modal.toCalling(modal);
					console.log(p.utils.getEasyrtcid(modal));
					easyrtc.call(p.utils.getEasyrtcid(modal), function(caller, mediaType) {
						console.log("First callback: ", caller, mediaType);
					}, function(errorCode, errorMessage) {
						console.log(errorCode, errorMessage);
						app.alertError('Something went wrong... Try again later.');
						p.utils.modal.clean(modal);
					}, function(accepted, user) {
						if (accepted) {
							p.utils.modal.toAnswered(modal);
						} else {
							p.utils.modal.clean(modal);
						}
					});
				}, function() {
					app.alertError('It looks like there is an issue with your webcam or microphone!');
				});
			}
		},
		endcall: {
			register: function(modal) {
				modal.find(p.config.selectors.button.endCall).off('click.webrtc').on('click.webrtc', function(e) {
					Actions.endcall.handle(modal);
				});
			},
			handle: function(modal) {
				console.log('endcall');
				easyrtc.hangupAll();
			}
		}
	}

	return function(Plugin) {
		Plugin.actions = Actions;
		p = Plugin;
	};
});