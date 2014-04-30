$(document).ready(function() {
	requirejs(['/plugins/nodebb-plugin-webrtc/static/js/lib/module.js'], function(module) {
		module.init(console.log);
	});
});