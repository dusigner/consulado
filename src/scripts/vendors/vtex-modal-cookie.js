/**
 * VTEX Modal Cookie v2.2.2
 * Copyright (c) 2015 Lucas Monteverde
 * Under MIT License
 */

require('vendors/vtex-modal');
require('vendors/jquery.cookie');

(function(factory) {
	'use strict';
	if (typeof define === 'function' && define.amd) {
		define(['jquery'], factory);
	} else if (typeof exports !== 'undefined') {
		module.exports = factory(require('jquery'));
	} else {
		factory(jQuery);
	}

}(function($) {

	'use strict';

	var modal = $.fn.vtexModal; //plugin override

	$.fn.vtexModal = function(options) {

		var settings,
			defaults = {
				cookieOptions: (options && options.cookieOptions) ? options.cookieOptions : false,
				onClose: true
			};

		if (options) {
			settings = $.extend({
				id: (options && options.cookieName) ? options.cookieName : this.attr('id')
			}, defaults, options);

			if (!$.cookie(settings.id)) {
				if (settings.cookieOptions) {
					options.close = function() {
						$.cookie(settings.id, true, settings.cookieOptions);
					};
				}
			} else {
				return; //cookie is set, stop plugin execution
			}

		}

		modal.call(this, options);
	};

	$('div[data-modal-auto]').each(function() {

		var options = $(this).data();

		if (options.utmSource && options.utmSource !== $.getParameterByName('utm_source')) {
			return;
		}

		$(this).vtexModal(options);
	});

}));
