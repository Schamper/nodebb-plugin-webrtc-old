define(function() {
	var p;
	var Base = {
		init: function() {
			easyrtc.setUsername(window.utils.slugify(app.username));
			easyrtc.connect(p.config.appName,
				function() {
					p.actions.load.register();
				}, function(errID, errText) {
					console.log(errText);
					app.alertError('Something went wrong while connecting to the server...');
				}
			);
		},
		prepareModal: function(modal) {
			var html = {
				callerid: '<p><span id="webrtc-caller-id"></span> is calling</p>',
				buttons: {
					call: '<button type="button" href="#" class="btn btn-success" id="webrtc-call-btn" disabled>Call</button>',
					answer: '<button type="button" href="#" class="btn btn-success" id="webrtc-answer-btn">Answer</button>',
					decline: '<button type="button" href="#" class="btn btn-danger" id="webrtc-decline-btn">Decline</button>',
					answerButtons: '<div id="webrtc-answer-button-container"></div>',
					endcall: '<div id="webrtc-endcall-button-container"><button type="button" href="#" class="btn btn-danger" id="webrtc-endcall-btn">End call</button></div>'
				},
				video: '<div id="webrtc-video-panel" class="modal-content"><video id="webrtc-them" autoplay="true"></video><video id="webrtc-me" autoplay="true" muted="true"></video></div>'
			}

			function addHTML(callback) {
				//Panel
				modal.find('.modal-body').append(html.buttons.answerButtons).append(html.buttons.endcall).parent().append(html.video);
				//Buttons
				modal.find('.input-group-btn').append(html.buttons.call);
				modal.find(p.config.selectors.container.answerButtons).append(html.buttons.answer + html.buttons.decline);
				callback();
			}

			addHTML(function() {
				Base.connectToRoom(modal);
			});
		},
		connectToRoom: function(modal) {
			var id = [app.uid, p.utils.getUID(modal)].sort();
			var roomName = p.config.roomPrefix + id[0] + '-' + id[1];
			easyrtc.joinRoom(roomName, null, function(name) {
				modal.data(p.config.dataKeys.room, roomName);
				Base.addActionListeners(modal);
				Base.addEventListeners(modal);
			}, function(errID, errText) {
				console.log(errText);
				app.alertError('Something went wrong while joining this chat...');
			});
		},
		leaveRoom: function(modal) {
			easyrtc.leaveRoom(modal.data(p.config.dataKeys.room));
			p.utils.modal.close(modal);
		},
		addActionListeners: function(modal) {
            var actions = p.actions;
            for (var a in actions) {
                if (actions.hasOwnProperty(a) && a !== 'load') {
                    actions[a].register(modal);
                }
            }
		},
		addEventListeners: function(modal) {
			var events = p.events;
			for (var e in events) {
				if (events.hasOwnProperty(e) && e !== 'load') {
					events[e].register(modal);
				}
			}
		}
	}

	return function(Plugin) {
		Plugin.base = Base;
		p = Plugin;
	};
});