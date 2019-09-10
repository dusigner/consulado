'use strict';
require('vendors/Uri');

Nitro.module('linkDoubleClick', function() {
	var self = this;

	this.init = function() {
		self.checklinkdouble();
	};

	this.checklinkdouble = function() {
		var $linkBanner = $('.banner-principal .box-banner > a'),
			verify,
			link_left,
			link_rigth,
			conteudo,
			box_banner,
			urlbanner;
		$.each($linkBanner, function() {
			urlbanner = $(this).attr('href');
			if (urlbanner !== undefined) {
				verify = urlbanner.indexOf('link-alternate');
				if (verify !== -1) {
					conteudo = $(this).html();
					box_banner = $(this)
						.parent('.box-banner')
						.addClass('double-click');
					link_left = urlbanner.substring(0, urlbanner.indexOf('link-alternate') - 1);
					link_rigth = urlbanner.substring(link_left.length + 'link-alternate='.length + 1);
					box_banner.html('<a href=' + link_left + '></a> ' + conteudo + ' <a href=' + link_rigth + '></a>');
				}
			}
		});
	};

	self.init();
});
