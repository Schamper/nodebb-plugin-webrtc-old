define(function() {
	var p;
	var Utils = {
		getUID: function(modal) {
			return modal.get(0).id.match(/\d+/)[0];
		},
		getUsername: function(modal) {
			return modal.find('#chat-with-name').text();
		},
		getUserslug: function(modal) {
			return window.utils.slugify(Utils.getUsername(modal));
		},
		getEasyrtcid: function(modal) {
			var rtcid = modal.data(p.config.dataKeys.easyrtcid);
			return rtcid;
		},
		getRoom: function(modal) {
			return modal.data(p.config.dataKeys.room);
		},
		checkConnection: function(modal, list) {
			if (modal.data(p.config.dataKeys.state) != 'freeze') {
				if (Utils.hasConnection(modal, list)) {
					Utils.enableCalling(modal);
				} else {
					Utils.disableCalling(modal);
				}
			}
		},
		hasConnection: function(modal, list) {
			var clients;
			if (list) {
				clients = list;
			} else {
				var room = Utils.getRoom(modal),
					roomData = easyrtc.roomData[room];
				if (roomData) {
					clients = roomData.clientList;
				}
			}
			for (var c in clients) {
				if (clients.hasOwnProperty(c)) {
					if (c != easyrtc.myEasyrtcid) {
						modal.data(p.config.dataKeys.easyrtcid, c);
						return true;
					}
				}
			}
			return false;
		},
		enableCalling: function(modal) {
			modal.find(p.config.selectors.button.call).removeAttr('disabled');
		},
		disableCalling: function(modal) {
			modal.find(p.config.selectors.button.call).attr('disabled', 'disabled');
		},
		freezeCalling: function(modal, disabled) {
			modal.data(p.config.dataKeys.state, 'freeze');
			if (disabled) {
				Utils.disableCalling(modal);
			}
		},
		unfreezeCalling: function(modal) {
			modal.data(p.config.dataKeys.state, 'allowed');
			Utils.ping();
		},
		modal: {
			toCalling: function(modal) {
				modal.find(p.config.selectors.container.endCallButton).show();
				modal.find(p.config.selectors.container.videoPanel).show();
				Utils.freezeCalling(modal, true);
			},
			toIncoming: function(modal) {
				modal.find(p.config.selectors.container.answerButtons).show();
				Utils.freezeCalling(modal, true);
			},
			toAnswered: function(modal) {
				modal.find(p.config.selectors.container.answerButtons).hide();
				modal.find(p.config.selectors.container.endCallButton).show();
				modal.find(p.config.selectors.container.videoPanel).show();
			},
			clean: function(modal) {
				modal.find(p.config.selectors.container.endCallButton).hide();
				modal.find(p.config.selectors.container.answerButtons).hide();
				modal.find(p.config.selectors.container.videoPanel).hide();
				Utils.unfreezeCalling(modal);
			},
			close: function(modal) {
				require(['chat'], function(chat) {
					chat.close(modal);
				});
			}
		},
		getConfig: function(callback) {
			socket.emit(p.config.sockets.getConfig, function(err, config) {
				p.config.vars = config;
				callback();
			});
		},
		ping: function(callback) {
			setTimeout(function() {
				easyrtc.updatePresence('chat', 'ping');
				if (callback)
					callback();
			}, 1000);
		}
	}

	return function(Plugin) {
		Plugin.utils = Utils;
		p = Plugin;
	};
});