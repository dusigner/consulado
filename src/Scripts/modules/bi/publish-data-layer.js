'use strict';

define('publishDataLayer', function() {
	var $menu = $('.menu .item');

	this.push = function(name, event) {
		$menu
			.find('a')
			.filter(function() {
				return $(this).text() === name;
			})
			.map(function() {
				$(this).on('click', function(e) {
					e.preventDefault();
					dataLayer.push({ event: event });
					$(location).attr('href', $(this).attr('href'));
				});
			});
	};
});
