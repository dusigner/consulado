'use strict';
module.exports = function() {
	window.vtex &&
		window.vtex.events &&
		window.vtex.events.subscribe &&
		window.vtex.events.subscribe('jussi', function(name, data) {
			//console.log('event', name, data);

			if (data && data.visitorContactInfo && data.visitorContactInfo[1]) {
				$('.prateleira h2:contains(Você)').text(data.visitorContactInfo[1]);
			}
		});
};
