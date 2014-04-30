define(function() {
	var p = {};
	p.vars = {
		rtc: null
	};

	var module = {
		init: function(callback) {
			function rtrn(val) {
				if (typeof(callback) === 'function') {
					callback(val);
				}
			}
			require([
				'plugins/nodebb-plugin-webrtc/static/js/lib/base.js',
				'plugins/nodebb-plugin-webrtc/static/js/lib/utils.js',
				'plugins/nodebb-plugin-webrtc/static/js/lib/actions.js',
				'plugins/nodebb-plugin-webrtc/static/js/lib/events.js',
				'plugins/nodebb-plugin-webrtc/static/js/lib/config.js'
			], function(b, u, a, e, c) {
				b(p); u(p); a(p); e(p); c(p);

				if (easyrtc.supportsDataChannels() && easyrtc.supportsGetUserMedia() && easyrtc.supportsPeerConnections()) {
					p.utils.getConfig(function() {
						if (p.config.vars.running) {
							p.base.init();
							rtrn(true);
						} else {
							rtrn(false)
						}
					});
				} else {
					rtrn(false);
				}
			});
		}
	}

    return module;
});