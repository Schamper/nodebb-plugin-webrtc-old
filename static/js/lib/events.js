define(function() {
	var p;
	var Events = {
		oncall: {
			register: function(modal) {
				easyrtc.setAcceptChecker(function(callerId, cb) {
					Events.oncall.handleAccept(modal, callerId, cb);
				});
				easyrtc.setStreamAcceptor(function(callerEasyrtcid, stream) {
					Events.oncall.handle(modal, stream);
				});
				easyrtc.setCallCancelled(function() {
					p.utils.modal.clean(modal);
				});
			},
			handle: function(modal, stream) {
				p.utils.modal.toAnswered(modal);
				easyrtc.setVideoObjectSrc(modal.find(p.config.selectors.container.videoThem).get(0), stream);
			},
			handleAccept: function(modal, callerId, cb) {
				p.utils.modal.toIncoming(modal);
				var acceptor = function(isAccepted) {
					if (isAccepted) {
						easyrtc.initMediaSource(function() {
							easyrtc.setVideoObjectSrc(modal.find(p.config.selectors.container.videoMe).get(0), easyrtc.getLocalStream());
							cb(true);
						}, function() {
							app.alertError('It looks like there is an issue with your webcam or microphone!');
							cb(false);
						});
					} else {
						p.utils.modal.clean(modal);
						cb(false);
					}
				}
				modal.find(p.config.selectors.button.answer).off('click.webrtc').on('click.webrtc', function() {
					acceptor(true);
				});
				modal.find(p.config.selectors.button.decline).off('click.webrtc').on('click.webrtc', function() {
					acceptor(false);
				});
			}
		},
		onpresence: {
			register: function(modal) {
				easyrtc.setRoomOccupantListener( function(roomName, list, selfInfo){
					Events.onpresence.handle(roomName, list, modal);
				});
				p.utils.checkConnection(modal);
			},
			handle: function(roomName, list, modal) {
				if (roomName == modal.data(p.config.dataKeys.room))
					p.utils.checkConnection(modal, list);
			}
		},
		onstreamclosed: {
			register: function(modal) {
				easyrtc.setOnStreamClosed(function(easyrtcid) {
					Events.onstreamclosed.handle(modal, easyrtcid);
				});
			},
			handle: function(modal, easyrtcid) {
				console.log('onstreamclosed');
				p.utils.modal.clean(modal);
				easyrtc.setVideoObjectSrc(modal.find(p.config.selectors.container.videoThem).get(0), '');
			}
		},
		ondisconnect: {
			register: function(modal) {
				easyrtc.setDisconnectListener(this.handle);
			},
			handle: function(modal) {
				app.alertError('You seem to have lost connection with the server!');
			}
		},
		onerror: {
			register: function(modal) {
				easyrtc.setOnError(this.handle);
			},
			handle: function(errObj) {
				app.alertError('An error occured: ' + errObj.errorText);
			}
		}
	}

	return function(Plugin) {
		Plugin.events = Events;
		p = Plugin;
	};
});