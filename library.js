var easyrtc = require('easyrtc'),

	Sockets = module.parent.require('./socket.io/index'),
	ModulesSockets = module.parent.require('./socket.io/modules'),

	app,
	io,
	rtc;

var WebRTCPlugin = {};

var constants = Object.freeze({
	'name': 'WebRTC Chat',
	'admin': {
		'route': '/webrtc',
		'icon': 'fa-eye'
	}
});

WebRTCPlugin.init = {
    load: function(expressApp, middleware, controllers) {
		app = expressApp;
		io = Sockets.server;
		function renderAdmin(req, res, next) {
			res.render('webrtc/admin', {});
		}

		app.get('/admin/webrtc', middleware.admin.buildHeader, renderAdmin);
		app.get('/api/admin/webrtc', renderAdmin);

		rtc = easyrtc.listen(app, io);
		ModulesSockets.chats.webrtc = WebRTCPlugin.sockets;
    },
	admin: {
		"addNavigation": function(custom_header, callback) {
			custom_header.plugins.push({
				"route": constants.admin.route,
				"icon": constants.admin.icon,
				"name": constants.name
			});

			callback(null, custom_header);
		}
	}
}

WebRTCPlugin.sockets = {
	getConfig: function(socket, data, callback) {
		var config = {};
		config.running = (rtc !== null);
		return callback(null, config);
	}
}

module.exports = WebRTCPlugin;